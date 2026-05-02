"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  UserPlus,
  FileText,
  Euro,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";

interface Stats {
  totalArtisansActif: number;
  totalArtisansAll: number;
  inscriptionsThisMonth: number;
  inscriptionsLastMonth: number;
  inscriptionsDeltaPct: number | null;
  totalDevisThisMonth: number;
  totalDevisLastMonth: number;
  devisDeltaPct: number | null;
  artisansEnAttente: number;
  revenusEstimes: number;
  plans: Record<string, number>;
  villes: Array<{ slug: string; count: number }>;
  generatedAt: string;
}

const VILLE_LABELS: Record<string, string> = {
  chambery: "Chambéry",
  annecy: "Annecy",
  grenoble: "Grenoble",
  lyon: "Lyon",
  valence: "Valence",
  autres: "Autres",
};

const PLAN_META: Record<string, { label: string; color: string; bg: string }> = {
  GRATUIT: { label: "Gratuit", color: "#6B6560", bg: "#F0EDE8" },
  STARTER: { label: "Starter", color: "#0F6E56", bg: "#E6F4EE" },
  ESSENTIEL: { label: "Starter", color: "#0F6E56", bg: "#E6F4EE" },
  PRO: { label: "Pro", color: "#185FA5", bg: "#E6EFF8" },
  PRO_PLUS: { label: "Business", color: "#534AB7", bg: "#EDEBF8" },
  BUSINESS: { label: "Business", color: "#534AB7", bg: "#EDEBF8" },
};

function Delta({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-xs text-gray-400">— pas de comparaison</span>;
  }
  if (value === 0) {
    return <span className="text-xs text-gray-500">stable</span>;
  }
  const positive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        positive ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}
      {value}% vs mois dernier
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  hint,
  href,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  delta?: number | null;
  hint?: string;
  href?: string;
  accent?: string;
}) {
  const inner = (
    <div className="group relative h-full rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-stone-300 hover:shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: accent ? `${accent}14` : "#F7F5F2" }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color: accent || "#6B6560" }} />
        </div>
        {href && (
          <ArrowRight className="h-4 w-4 text-stone-300 transition-colors group-hover:text-stone-500" />
        )}
      </div>
      <div
        className="font-display text-3xl font-bold leading-none text-stone-900"
        style={{ fontFamily: "'Fraunces',serif" }}
      >
        {value}
      </div>
      <div className="mt-2 text-sm text-stone-500">{label}</div>
      <div className="mt-3 min-h-[16px]">
        {delta !== undefined ? <Delta value={delta} /> : hint ? <span className="text-xs text-stone-400">{hint}</span> : null}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function CardSkeleton() {
  return (
    <div className="h-full rounded-2xl border border-stone-200 bg-white p-6">
      <div className="mb-4 h-9 w-9 animate-pulse rounded-lg bg-stone-100" />
      <div className="h-9 w-20 animate-pulse rounded bg-stone-100" />
      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-stone-100" />
      <div className="mt-3 h-3 w-24 animate-pulse rounded bg-stone-50" />
    </div>
  );
}

export default function AdminDashboard() {
  const { fetchWithAuth } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);
      try {
        const data = (await fetchWithAuth("/admin/stats")) as Stats;
        setStats(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchWithAuth]
  );

  useEffect(() => {
    load();
  }, [load]);

  const totalForPlanRatio =
    stats && Object.values(stats.plans).length > 0
      ? Object.values(stats.plans).reduce((s, n) => s + n, 0)
      : 1;
  const totalForVilleRatio =
    stats && stats.villes.length > 0
      ? Math.max(stats.villes.reduce((s, v) => s + v.count, 0), 1)
      : 1;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-stone-900"
            style={{ fontFamily: "'Fraunces',serif" }}
          >
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Vue temps réel des inscriptions, plans et activité.
            {stats && (
              <span className="ml-2 text-stone-400">
                · Actualisé {new Date(stats.generatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-60"
          title="Recharger les données"
        >
          <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Rafraîchir
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-medium">Impossible de charger les statistiques</p>
            <p className="mt-1 text-red-700/80">{error}</p>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatCard
              icon={Users}
              label="Artisans actifs"
              value={stats.totalArtisansActif}
              hint={`${stats.totalArtisansAll} au total (incluant non-validés)`}
              href="/admin/artisans"
              accent="#0F6E56"
            />
            <StatCard
              icon={UserPlus}
              label="Inscriptions ce mois"
              value={stats.inscriptionsThisMonth}
              delta={stats.inscriptionsDeltaPct}
              accent="#185FA5"
            />
            <StatCard
              icon={FileText}
              label="Demandes ce mois"
              value={stats.totalDevisThisMonth}
              delta={stats.devisDeltaPct}
              href="/admin/demandes-projets"
              accent="#C4531A"
            />
            <StatCard
              icon={Euro}
              label="Revenus estimés / mois"
              value={`${stats.revenusEstimes.toLocaleString("fr-FR")} €`}
              hint="Somme des plans payants actifs"
              accent="#534AB7"
            />
          </>
        ) : null}
      </div>

      {/* À valider */}
      {stats && stats.artisansEnAttente > 0 && (
        <Link
          href="/admin/validations"
          className="mb-8 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/60 p-5 transition-colors hover:bg-amber-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <AlertCircle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {stats.artisansEnAttente} artisan{stats.artisansEnAttente > 1 ? "s" : ""} en attente
                de validation
              </p>
              <p className="mt-0.5 text-xs text-amber-700/80">
                Statuts ONBOARDING / PENDING_NAF_REVIEW / PENDING_REVIEW
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-700" />
        </Link>
      )}

      {/* Breakdown grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Plans */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2
              className="text-base font-bold text-stone-900"
              style={{ fontFamily: "'Fraunces',serif" }}
            >
              Répartition par plan
            </h2>
            <span className="text-xs text-stone-400">artisans actifs uniquement</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-7 animate-pulse rounded bg-stone-100" />
              ))}
            </div>
          ) : stats && Object.keys(stats.plans).length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">Aucun artisan actif</p>
          ) : (
            <div className="space-y-4">
              {stats &&
                Object.entries(stats.plans)
                  .sort(([, a], [, b]) => b - a)
                  .map(([plan, count]) => {
                    const meta = PLAN_META[plan] || { label: plan, color: "#6B6560", bg: "#F0EDE8" };
                    const pct = Math.round((count / totalForPlanRatio) * 100);
                    return (
                      <div key={plan}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                              style={{ background: meta.bg, color: meta.color }}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-stone-700">
                            {count}
                            <span className="ml-2 text-xs font-normal text-stone-400">
                              {pct}%
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: meta.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}
        </div>

        {/* Villes */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2
              className="text-base font-bold text-stone-900"
              style={{ fontFamily: "'Fraunces',serif" }}
            >
              Répartition par ville
            </h2>
            <span className="text-xs text-stone-400">artisans actifs uniquement</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 animate-pulse rounded bg-stone-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats &&
                stats.villes.map((v) => {
                  const pct = Math.round((v.count / totalForVilleRatio) * 100);
                  return (
                    <div key={v.slug}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm text-stone-700">
                          {VILLE_LABELS[v.slug] || v.slug}
                        </span>
                        <span className="text-sm font-semibold text-stone-700">
                          {v.count}
                          <span className="ml-2 text-xs font-normal text-stone-400">{pct}%</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
