"use client";

import { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Check,
  AlertCircle,
  Building2,
  Phone,
  FileText,
  Settings as SettingsIcon,
  CreditCard,
  Search,
  Link2,
  Eye,
  EyeOff,
} from "lucide-react";

interface ArtisanFull {
  id: string;
  siret: string;
  raisonSociale: string | null;
  nomAffichage: string;
  prenom: string | null;
  nom: string | null;
  description: string | null;
  telephone: string;
  adresse: string | null;
  codePostal: string | null;
  ville: string | null;
  villeSlug: string | null;
  codeInsee: string | null;
  latitude: number | null;
  longitude: number | null;
  zoneRayonKm: number;
  experienceAnnees: number | null;
  metierId: string | null;
  metierSlugSeo: string | null;
  metier?: { id: string; nom: string; slug: string } | null;
  actif: boolean;
  visible: boolean;
  slug: string;
  artisanStatus: string;
  motifRefus: string | null;
  plan: string;
  planOverride: string | null;
  planOverrideRaison: string | null;
  planOverrideExpireAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  horairesTexte: string | null;
  zoneTexte: string | null;
  googleBusinessUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  siteWebUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: { email: string; createdAt: string };
}

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  ONBOARDING: { label: "Onboarding", bg: "#FEF3C7", color: "#92400E" },
  PENDING_NAF_REVIEW: { label: "NAF à valider", bg: "#FEE2E2", color: "#B91C1C" },
  PENDING_REVIEW: { label: "À valider", bg: "#FEF3C7", color: "#92400E" },
  ACTIVE: { label: "Actif", bg: "#D1FAE5", color: "#065F46" },
  REJECTED: { label: "Refusé", bg: "#FEE2E2", color: "#B91C1C" },
  INACTIVE: { label: "Inactif", bg: "#F3F4F6", color: "#4B5563" },
};

const STATUSES = Object.keys(STATUS_META);

// All editable keys, used to compute the diff payload sent to the API.
const EDITABLE_KEYS: (keyof ArtisanFull)[] = [
  "siret", "raisonSociale", "nomAffichage", "prenom", "nom", "metierId",
  "description", "telephone", "adresse", "codePostal", "ville", "villeSlug",
  "codeInsee", "latitude", "longitude", "zoneRayonKm", "experienceAnnees",
  "metierSlugSeo", "actif", "visible", "artisanStatus", "motifRefus",
  "planOverride", "planOverrideRaison", "planOverrideExpireAt",
  "seoTitle", "seoDescription", "horairesTexte", "zoneTexte",
  "googleBusinessUrl", "facebookUrl", "instagramUrl", "siteWebUrl",
];

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] || { label: status, bg: "#F3F4F6", color: "#4B5563" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

function Field({
  label, value, onChange, type = "text", textarea = false, placeholder, hint,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-stone-600">
        <span>{label}</span>
        {hint && <span className="text-[11px] font-normal text-stone-400">{hint}</span>}
      </span>
      {textarea ? (
        <textarea
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
        />
      ) : (
        <input
          type={type}
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
        />
      )}
    </label>
  );
}

function Section({
  icon: Icon, title, description, children,
}: {
  icon: typeof Building2;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6">
      <header className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-50">
          <Icon className="h-[18px] w-[18px] text-stone-600" />
        </div>
        <div>
          <h2
            className="text-base font-bold text-stone-900"
            style={{ fontFamily: "'Fraunces',serif" }}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-stone-500">{description}</p>
          )}
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function CardSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="mb-5 h-5 w-32 animate-pulse rounded bg-stone-100" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-stone-100" />
            <div className="h-9 animate-pulse rounded-lg bg-stone-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminArtisanEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const [artisan, setArtisan] = useState<ArtisanFull | null>(null);
  const [form, setForm] = useState<Partial<ArtisanFull>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = (await fetchWithAuth(`/admin/artisans/${id}`)) as ArtisanFull;
        setArtisan(data);
        setForm(data);
      } catch (e) {
        setMsg({ type: "err", text: e instanceof Error ? e.message : "Erreur de chargement" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, fetchWithAuth]);

  const update = <K extends keyof ArtisanFull>(key: K, value: ArtisanFull[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  // Compute the changed-fields set (used to enable Save + show counter)
  const changedFields = useMemo(() => {
    if (!artisan) return new Set<string>();
    const set = new Set<string>();
    for (const k of EDITABLE_KEYS) {
      if (form[k] !== artisan[k]) set.add(k as string);
    }
    return set;
  }, [form, artisan]);

  const handleSave = async () => {
    if (!artisan || changedFields.size === 0) return;
    setSaving(true);
    setMsg(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const k of EDITABLE_KEYS) {
        if (form[k] !== artisan[k]) {
          payload[k] = form[k] === "" ? null : form[k];
        }
      }
      const updated = (await fetchWithAuth(`/admin/artisans/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })) as ArtisanFull;
      setArtisan(updated);
      setForm(updated);
      setMsg({ type: "ok", text: `${Object.keys(payload).length} champ${Object.keys(payload).length > 1 ? "s" : ""} mis à jour.` });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Erreur d'enregistrement" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (artisan) setForm(artisan);
    setMsg(null);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <div className="h-12 w-1/2 animate-pulse rounded bg-stone-100" />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }
  if (!artisan) {
    return (
      <div className="mx-auto max-w-5xl p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Artisan introuvable.
        </div>
        <Link
          href="/admin/artisans"
          className="mt-4 inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </Link>
      </div>
    );
  }

  const publicUrl = `/${artisan.villeSlug || (artisan.ville || "chambery").toLowerCase()}/${artisan.slug}`;

  return (
    <div className="mx-auto max-w-5xl pb-32">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/artisans"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Liste des artisans
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1
                className="truncate text-2xl font-bold text-stone-900"
                style={{ fontFamily: "'Fraunces',serif" }}
              >
                {artisan.nomAffichage}
              </h1>
              <StatusBadge status={artisan.artisanStatus} />
              {artisan.actif ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <Eye className="h-3 w-3" /> Visible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500">
                  <EyeOff className="h-3 w-3" /> Masqué
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-sm text-stone-500">
              {artisan.user?.email} · SIRET <span className="font-mono">{artisan.siret}</span>
              {artisan.metier?.nom && <> · {artisan.metier.nom}</>}
              {artisan.ville && <> · {artisan.ville}</>}
            </p>
          </div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
          >
            Voir la fiche <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
            msg.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {msg.type === "ok" ? (
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          )}
          <div>{msg.text}</div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        <Section icon={Building2} title="Identité" description="Informations légales et métier">
          <Field label="Nom affiché" value={form.nomAffichage} onChange={(v) => update("nomAffichage", v)} />
          <Field label="Raison sociale" value={form.raisonSociale} onChange={(v) => update("raisonSociale", v)} />
          <Field label="Prénom" value={form.prenom} onChange={(v) => update("prenom", v)} />
          <Field label="Nom" value={form.nom} onChange={(v) => update("nom", v)} />
          <Field label="SIRET" value={form.siret} onChange={(v) => update("siret", v)} hint="9 ou 14 chiffres" />
          <Field label="ID métier" value={form.metierId} onChange={(v) => update("metierId", v)} hint={artisan.metier?.nom || "—"} />
        </Section>

        <Section icon={Phone} title="Contact & localisation" description="Téléphone, adresse, zone d'intervention">
          <Field label="Téléphone" value={form.telephone} onChange={(v) => update("telephone", v)} />
          <Field label="Adresse" value={form.adresse} onChange={(v) => update("adresse", v)} />
          <Field label="Code postal" value={form.codePostal} onChange={(v) => update("codePostal", v)} />
          <Field label="Ville" value={form.ville} onChange={(v) => update("ville", v)} />
          <Field label="Slug ville (URL)" value={form.villeSlug} onChange={(v) => update("villeSlug", v)} hint="ex: chambery, lyon-3e" />
          <Field label="Code INSEE" value={form.codeInsee} onChange={(v) => update("codeInsee", v)} />
          <Field label="Latitude" type="number" value={form.latitude} onChange={(v) => update("latitude", v === "" ? null : Number(v))} />
          <Field label="Longitude" type="number" value={form.longitude} onChange={(v) => update("longitude", v === "" ? null : Number(v))} />
          <Field label="Rayon zone (km)" type="number" value={form.zoneRayonKm} onChange={(v) => update("zoneRayonKm", v === "" ? 15 : Number(v))} />
          <Field label="Années d'expérience" type="number" value={form.experienceAnnees} onChange={(v) => update("experienceAnnees", v === "" ? null : Number(v))} />
        </Section>

        <Section icon={FileText} title="Description publique" description="Texte affiché sur la fiche annuaire et la vitrine">
          <div className="md:col-span-2">
            <Field
              label="Description"
              value={form.description}
              textarea
              onChange={(v) => update("description", v)}
              placeholder="Décrivez l'activité, les spécialités, l'expérience…"
            />
          </div>
        </Section>

        <Section
          icon={SettingsIcon}
          title="Statut admin"
          description="Override manuel — bypass le scoring automatique"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Statut artisan</span>
            <select
              value={form.artisanStatus || ""}
              onChange={(e) => update("artisanStatus", e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label} ({s})
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-1 gap-3 pt-6 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.actif}
                onChange={(e) => update("actif", e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span>Actif (visible annuaire)</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.visible}
                onChange={(e) => update("visible", e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span>Visible (toggle public)</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <Field
              label="Motif de refus"
              value={form.motifRefus}
              textarea
              onChange={(v) => update("motifRefus", v)}
              placeholder="Visible par l'artisan si statut REJECTED"
            />
          </div>
        </Section>

        <Section icon={CreditCard} title="Plan & override" description="Forcer un plan supérieur sans Stripe">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Plan actuel (Stripe)</span>
            <input
              value={artisan.plan}
              disabled
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-600">Plan override (admin)</span>
            <select
              value={form.planOverride || ""}
              onChange={(e) => update("planOverride", e.target.value || null)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
            >
              <option value="">— aucun —</option>
              <option value="GRATUIT">GRATUIT</option>
              <option value="STARTER">STARTER</option>
              <option value="PRO">PRO</option>
              <option value="BUSINESS">BUSINESS</option>
            </select>
          </label>
          <Field label="Raison de l'override" value={form.planOverrideRaison} onChange={(v) => update("planOverrideRaison", v)} />
          <Field
            label="Expire le"
            value={form.planOverrideExpireAt}
            onChange={(v) => update("planOverrideExpireAt", v || null)}
            hint="ISO8601 ex: 2026-12-31T23:59:00Z"
          />
        </Section>

        <Section icon={Search} title="SEO vitrine" description="Méta-données pour Google et les bots IA">
          <Field label="SEO title" value={form.seoTitle} onChange={(v) => update("seoTitle", v)} />
          <Field label="Slug métier SEO" value={form.metierSlugSeo} onChange={(v) => update("metierSlugSeo", v)} />
          <div className="md:col-span-2">
            <Field label="Méta-description" value={form.seoDescription} textarea onChange={(v) => update("seoDescription", v)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Horaires (texte libre)" value={form.horairesTexte} textarea onChange={(v) => update("horairesTexte", v)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Zone d'intervention (texte libre)" value={form.zoneTexte} textarea onChange={(v) => update("zoneTexte", v)} />
          </div>
        </Section>

        <Section icon={Link2} title="Liens externes" description="Réseaux sociaux et profils tiers">
          <Field label="Google Business URL" value={form.googleBusinessUrl} onChange={(v) => update("googleBusinessUrl", v)} placeholder="https://maps.google.com/…" />
          <Field label="Facebook URL" value={form.facebookUrl} onChange={(v) => update("facebookUrl", v)} placeholder="https://facebook.com/…" />
          <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => update("instagramUrl", v)} placeholder="https://instagram.com/…" />
          <Field label="Site web" value={form.siteWebUrl} onChange={(v) => update("siteWebUrl", v)} placeholder="https://exemple.fr" />
        </Section>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-stone-200 bg-white/90 backdrop-blur-md md:left-[var(--admin-sidebar-w,240px)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="text-sm text-stone-500">
            {changedFields.size === 0 ? (
              <span>Aucune modification</span>
            ) : (
              <span className="font-medium text-stone-900">
                {changedFields.size} champ{changedFields.size > 1 ? "s" : ""} modifié
                {changedFields.size > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={changedFields.size === 0 || saving}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/artisans")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || changedFields.size === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
