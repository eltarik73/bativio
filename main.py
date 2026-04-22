import sys
import os
import csv
import json
import time
from decimal import Decimal
from pathlib import Path
from config import *
from gamma_client import fetch_markets, fetch_events, parse_market
from risk_manager import RiskManager
from strategies.intra_arb import detect_intra_arb
from strategies.cross_logical import detect_cross_logical
from strategies.market_making import evaluate_mm_opportunity
from strategies.whale_tracker import detect_whale_moves
from utils import ts

class PolymarketBot:
    def __init__(self):
        self.risk = RiskManager(CAPITAL_INITIAL)
        self.cycle = 0
        self.mm_inventory = {}
        self.paper_positions = {}
        Path("logs").mkdir(exist_ok=True)
        if not Path(LOG_FILE).exists():
            with open(LOG_FILE, "w", newline="") as f:
                csv.writer(f).writerow(["timestamp", "action", "type", "market", "price", "size", "edge", "pnl"])

    def _log(self, action, opp, price, size, pnl=Decimal("0")):
        with open(LOG_FILE, "a", newline="") as f:
            csv.writer(f).writerow([ts(), action, opp.get("type",""), opp.get("question",opp.get("event",""))[:80], f"{price:.4f}", f"{size:.2f}", f"{opp.get('edge_net',0):.4f}", f"{pnl:.4f}"])

    def check_open_positions(self, markets):
        market_prices = {}
        for m in markets:
            market_prices[m["id"]] = m
        closed = []
        for mid, pos in list(self.paper_positions.items()):
            if mid not in market_prices:
                continue
            current = market_prices[mid]
            current_yes = current["yes_price"]
            current_no = current["no_price"]
            entry = pos["entry_price"]
            age_sec = time.time() - pos["entry_time"]
            age_min = age_sec / 60
            should_close = False
            reason = ""
            if pos["type"] == "intra_arb":
                current_total = current_yes + current_no
                if current_total >= Decimal("0.995"):
                    should_close = True
                    reason = "gap closed"
                elif age_min > 60:
                    should_close = True
                    reason = "timeout 1h"
            elif "cross" in pos["type"]:
                if pos.get("total_yes"):
                    new_markets = [m for m in markets if m.get("event_id") == current.get("event_id") and m["yes_price"] > 0]
                    if new_markets:
                        new_total = sum(m["yes_price"] for m in new_markets)
                        if pos["action"] == "sell_all_yes" and new_total <= Decimal("1.01"):
                            should_close = True
                            reason = "cross corrected"
                        elif pos["action"] == "buy_all_yes" and new_total >= Decimal("0.98"):
                            should_close = True
                            reason = "cross corrected"
                if age_min > 120:
                    should_close = True
                    reason = "timeout 2h"
            elif pos["type"] == "whale_signal":
                if current_yes > entry * Decimal("1.03"):
                    should_close = True
                    reason = "take profit +3%"
                elif current_yes < entry * Decimal("0.97"):
                    should_close = True
                    reason = "stop loss -3%"
                elif age_min > 30:
                    should_close = True
                    reason = "timeout 30m"
            if should_close:
                if pos["type"] == "intra_arb":
                    pnl_pct = (Decimal("1") - (current_yes + current_no)) - pos["edge_at_entry"]
                    pnl_pct = pos["edge_at_entry"]
                elif "cross" in pos["type"]:
                    pnl_pct = pos["edge_at_entry"] * Decimal("0.7")
                else:
                    pnl_pct = (current_yes - entry) / entry if entry > 0 else Decimal("0")
                pnl_usdc = pos["size"] * pnl_pct
                self.risk.close_position(mid, entry * (Decimal("1") + pnl_pct))
                emoji = "+" if pnl_usdc > 0 else ""
                print(f"  <<< CLOSE {pos['type']} | {reason} | PnL: {emoji}${pnl_usdc:.2f} ({pnl_pct*100:+.1f}%) | {pos['question'][:50]}")
                self._log("CLOSE", pos, float(current_yes), float(pos["size"]), pnl_usdc)
                closed.append(mid)
        for mid in closed:
            del self.paper_positions[mid]

    def run_cycle(self):
        self.cycle += 1
        self.risk.update_heartbeat()
        all_opps = []
        print(f"\n{'='*65}")
        print(f"Cycle #{self.cycle} | {ts()}")
        print(f"{self.risk.status()}")
        if self.paper_positions:
            print(f"  Positions ouvertes: {len(self.paper_positions)}")
        print(f"{'='*65}")
        raw_markets = fetch_markets(limit=200)
        markets = [parse_market(m) for m in raw_markets]
        markets = [m for m in markets if m["yes_price"] > 0]
        events = []
        if ENABLE_CROSS_LOGICAL:
            raw_events = fetch_events(limit=50)
            market_by_id = {m["id"]: m for m in markets}
            for ev in raw_events:
                ev_markets = []
                for em in ev.get("markets", []):
                    mid = em.get("id", "")
                    if mid in market_by_id:
                        ev_markets.append(market_by_id[mid])
                    else:
                        parsed = parse_market(em)
                        if parsed["yes_price"] > 0:
                            ev_markets.append(parsed)
                if ev_markets:
                    events.append({"title": ev.get("title",""), "markets": ev_markets})
        print(f"  Marches: {len(markets)} | Events: {len(events)}")
        self.check_open_positions(markets)
        if ENABLE_CROSS_LOGICAL and events:
            for o in detect_cross_logical(events):
                if o.get("event","") not in [p.get("question","") for p in self.paper_positions.values()]:
                    all_opps.append(o)
        if ENABLE_INTRA_ARB:
            for m in markets:
                if m["id"] not in self.paper_positions:
                    arb = detect_intra_arb(m)
                    if arb:
                        all_opps.append(arb)
        if ENABLE_WHALE_COPY:
            for ws in detect_whale_moves(markets):
                if ws["market_id"] not in self.paper_positions:
                    all_opps.append(ws)
        if all_opps:
            all_opps.sort(key=lambda x: x.get("edge_net", Decimal("0")), reverse=True)
            for opp in all_opps[:3]:
                can, reason = self.risk.can_trade()
                if not can:
                    print(f"  [RISK] {reason}")
                    break
                edge = opp.get("edge_net", Decimal("0"))
                if edge >= MIN_EDGE_FULL:
                    size = self.risk.get_trade_size(edge)
                    label = "FULL"
                elif edge >= MIN_EDGE_REDUCED:
                    size = self.risk.get_trade_size(edge) / Decimal("3")
                    label = "REDUCED"
                else:
                    continue
                mid = opp.get("market_id", opp.get("event", ""))
                price = opp.get("yes_price", Decimal("0.5"))
                self.risk.open_position(mid, "yes", price, size, opp["type"])
                self.paper_positions[mid] = {"type": opp["type"], "question": opp.get("question", opp.get("event","")), "entry_price": price, "size": size, "edge_at_entry": edge, "entry_time": time.time(), "action": opp.get("action",""), "total_yes": opp.get("total_yes", Decimal("0"))}
                print(f"  >>> BUY {opp['type']} | Edge: {edge*100:.2f}% | ${size:.0f} ({label}) | {opp.get('question', opp.get('event',''))[:50]}")
                self._log("BUY", opp, float(price), float(size))
        else:
            print("  Aucune opportunite.")

    def run(self):
        print("=" * 65)
        print(f"  POLYMARKET BOT PRO - PAPER SIMULATION")
        print(f"  Simule achats/ventes pour valider la strategie")
        print(f"  Capital: ${self.risk.capital} | Scan: {SCAN_INTERVAL}s")
        print("=" * 65)
        while True:
            try:
                self.run_cycle()
                time.sleep(SCAN_INTERVAL)
            except KeyboardInterrupt:
                print(f"\n{'='*65}")
                print(f"RESULTATS SIMULATION")
                print(f"{self.risk.status()}")
                print(f"Positions encore ouvertes: {len(self.paper_positions)}")
                print(f"{'='*65}")
                break
            except Exception as e:
                print(f"[ERREUR] {e}")
                time.sleep(30)

if __name__ == "__main__":
    bot = PolymarketBot()
    bot.run()
