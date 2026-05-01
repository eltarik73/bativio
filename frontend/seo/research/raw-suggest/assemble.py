#!/usr/bin/env python3
"""
Assemble fetched suggestions into a structured markdown report.
Sections: Bing / DuckDuckGo / Yahoo
Sub-sections (per engine): the 6 thematic blocks (metiers, communes, urgent, travaux, intent)
Suggestions kept raw (no dedup).
"""
import json
import os
import re
import sys

DIR = "/Users/macbook/Desktop/bativio/.claude/worktrees/jolly-northcutt-afea33/frontend/seo/research/raw-suggest"
OUT = "/Users/macbook/Desktop/bativio/.claude/worktrees/jolly-northcutt-afea33/frontend/seo/research/02-bing-ddg-yahoo-suggest.md"

BLOCKS = [
    ("Métiers Rhône-Alpes", [
        "plombier chambery", "electricien chambery", "macon chambery", "peintre chambery",
        "carreleur chambery", "menuisier chambery", "couvreur chambery", "chauffagiste chambery",
        "plombier annecy", "electricien annecy", "macon annecy", "peintre annecy",
        "plombier grenoble", "electricien grenoble",
        "plombier lyon", "electricien lyon",
        "plombier valence", "electricien valence",
    ]),
    ("Communes secondaires", [
        "plombier bissy", "plombier la bridoire", "plombier la motte servolex", "plombier cognin",
        "plombier aix les bains", "plombier annecy le vieux", "plombier cran gevrier",
        "plombier seynod", "plombier meythet",
        "plombier echirolles", "plombier saint martin d'heres", "plombier meylan", "plombier eybens",
        "plombier villeurbanne", "plombier venissieux", "plombier bron", "plombier caluire",
        "plombier bourg les valence", "plombier portes les valence", "plombier guilherand granges",
    ]),
    ("Modificateurs urgents", [
        "depannage plombier chambery", "depanneur plombier chambery",
        "plombier urgence 24/24 chambery", "plombier dimanche chambery",
        "plombier nuit chambery", "fuite eau chambery",
    ]),
    ("Travaux + ville", [
        "renovation maison chambery", "isolation chambery", "ravalement chambery",
        "couverture toiture chambery", "platrerie chambery",
    ]),
    ("Intent commercial", [
        "devis plombier", "tarif plombier 2026", "prix horaire electricien",
        "cout renovation salle de bain",
    ]),
]


def slug(q: str) -> str:
    s = q.lower()
    s = re.sub(r"'", "_", s)
    s = re.sub(r"[^a-z0-9]", "_", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s


def parse_bing(raw: str):
    """Bing osjson: ["query",["s1","s2",...],[],[],{...}]"""
    try:
        data = json.loads(raw)
        if isinstance(data, list) and len(data) >= 2 and isinstance(data[1], list):
            return [str(x) for x in data[1]]
    except Exception:
        pass
    return []


def parse_ddg(raw: str):
    """DuckDuckGo: [{"phrase":"s1"},{"phrase":"s2"},...]"""
    try:
        data = json.loads(raw)
        out = []
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and "phrase" in item:
                    out.append(str(item["phrase"]))
                elif isinstance(item, str):
                    out.append(item)
        return out
    except Exception:
        return []


def parse_yahoo(raw: str):
    """Yahoo gossip-fr-fr: ["query",["s1","s2",...],[],[]]"""
    try:
        data = json.loads(raw)
        if isinstance(data, list) and len(data) >= 2 and isinstance(data[1], list):
            return [str(x) for x in data[1]]
    except Exception:
        pass
    return []


def read_raw(prefix: str, query: str) -> str:
    path = os.path.join(DIR, f"{prefix}-{slug(query)}.json")
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""


def emit_engine(name: str, prefix: str, parser) -> str:
    lines = [f"## {name}", ""]
    total = 0
    for block_title, queries in BLOCKS:
        lines.append(f"### {block_title}")
        lines.append("")
        for q in queries:
            raw = read_raw(prefix, q)
            suggestions = parser(raw) if raw else []
            lines.append(f"#### `{q}`")
            if not raw:
                lines.append("- _(aucune réponse — fichier manquant)_")
            elif not suggestions:
                # keep the raw blob visible so caller can verify
                preview = raw if len(raw) < 200 else raw[:200] + "..."
                lines.append(f"- _(aucune suggestion — réponse brute : `{preview}`)_")
            else:
                for s in suggestions:
                    lines.append(f"- {s}")
                    total += 1
            lines.append("")
        lines.append("")
    lines.insert(2, f"_Total suggestions {name} : **{total}**_")
    lines.insert(3, "")
    return "\n".join(lines)


def main():
    parts = []
    parts.append("# Suggestions de recherche — Bing / DuckDuckGo / Yahoo")
    parts.append("")
    parts.append("Données brutes collectées le **2026-05-01** sur les APIs publiques de suggestion.")
    parts.append("Marché : `fr-FR`. Suggestions **non dédupliquées**, ordre conservé tel que retourné par chaque moteur.")
    parts.append("")
    parts.append("**Sources :**")
    parts.append("- Bing : `https://api.bing.com/osjson.aspx?query=…&mkt=fr-FR`")
    parts.append("- DuckDuckGo : `https://duckduckgo.com/ac/?q=…&kl=fr-fr`")
    parts.append("- Yahoo : `https://fr.search.yahoo.com/sugg/gossip/gossip-fr-fr?command=…&output=fxjson`")
    parts.append("")
    parts.append("**Note Yahoo :** l'endpoint `search.yahoo.com/sugg/gossip/gossip-fr-fr` retourne `Service fr__FR is not allowed`. ")
    parts.append("On utilise donc le mirror français `fr.search.yahoo.com`, qui sert correctement le marché fr-FR.")
    parts.append("")
    parts.append("---")
    parts.append("")

    parts.append(emit_engine("Bing", "bing", parse_bing))
    parts.append("---")
    parts.append("")
    parts.append(emit_engine("DuckDuckGo", "ddg", parse_ddg))
    parts.append("---")
    parts.append("")
    parts.append(emit_engine("Yahoo", "yahoo", parse_yahoo))

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
