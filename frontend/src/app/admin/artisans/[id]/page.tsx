"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
  user?: { email: string; createdAt: string };
}

const STATUSES = [
  "ONBOARDING",
  "PENDING_NAF_REVIEW",
  "PENDING_REVIEW",
  "ACTIVE",
  "REJECTED",
  "INACTIVE",
];

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

  const handleSave = async () => {
    if (!artisan) return;
    setSaving(true);
    setMsg(null);
    try {
      // Build a diff payload — only fields that actually changed
      const payload: Record<string, unknown> = {};
      const editable: (keyof ArtisanFull)[] = [
        "siret", "raisonSociale", "nomAffichage", "prenom", "nom", "metierId",
        "description", "telephone", "adresse", "codePostal", "ville", "villeSlug",
        "codeInsee", "latitude", "longitude", "zoneRayonKm", "experienceAnnees",
        "metierSlugSeo", "actif", "visible", "artisanStatus", "motifRefus",
        "planOverride", "planOverrideRaison", "planOverrideExpireAt",
        "seoTitle", "seoDescription", "horairesTexte", "zoneTexte",
        "googleBusinessUrl", "facebookUrl", "instagramUrl", "siteWebUrl",
      ];
      for (const k of editable) {
        if (form[k] !== artisan[k]) {
          payload[k] = form[k] === "" ? null : form[k];
        }
      }
      if (Object.keys(payload).length === 0) {
        setMsg({ type: "ok", text: "Aucune modification à enregistrer." });
        return;
      }
      const updated = (await fetchWithAuth(`/admin/artisans/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })) as ArtisanFull;
      setArtisan(updated);
      setForm(updated);
      setMsg({ type: "ok", text: "Fiche artisan mise à jour." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Erreur d'enregistrement" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Chargement…</div>;
  }
  if (!artisan) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-4">Artisan introuvable.</div>
        <Link href="/admin/artisans" className="text-blue-600 hover:underline">← Retour à la liste</Link>
      </div>
    );
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );

  const Field = ({
    label, value, onChange, type = "text", textarea = false, placeholder,
  }: {
    label: string;
    value: string | number | boolean | null | undefined;
    onChange: (v: string) => void;
    type?: string;
    textarea?: boolean;
    placeholder?: string;
  }) => (
    <label className="block">
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      {textarea ? (
        <textarea
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={value == null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
      )}
    </label>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link href="/admin/artisans" className="text-sm text-gray-500 hover:underline">← Liste des artisans</Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">{artisan.nomAffichage}</h1>
          <p className="text-sm text-gray-500">
            {artisan.user?.email} · SIRET {artisan.siret} · Statut <strong>{artisan.artisanStatus}</strong>
          </p>
        </div>
        <a
          href={`/${artisan.villeSlug || artisan.ville?.toLowerCase() || "chambery"}/${artisan.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Voir la fiche publique →
        </a>
      </div>

      {msg && (
        <div
          className={`mb-4 rounded border px-4 py-3 text-sm ${
            msg.type === "ok"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {msg.text}
        </div>
      )}

      <Section title="Identité">
        <Field label="Nom affiché" value={form.nomAffichage} onChange={(v) => update("nomAffichage", v)} />
        <Field label="Raison sociale" value={form.raisonSociale} onChange={(v) => update("raisonSociale", v)} />
        <Field label="Prénom" value={form.prenom} onChange={(v) => update("prenom", v)} />
        <Field label="Nom" value={form.nom} onChange={(v) => update("nom", v)} />
        <Field label="SIRET (9 ou 14 chiffres)" value={form.siret} onChange={(v) => update("siret", v)} />
        <Field label="ID métier (Metier.id)" value={form.metierId} onChange={(v) => update("metierId", v)} />
      </Section>

      <Section title="Contact">
        <Field label="Téléphone" value={form.telephone} onChange={(v) => update("telephone", v)} />
        <Field label="Adresse" value={form.adresse} onChange={(v) => update("adresse", v)} />
        <Field label="Code postal" value={form.codePostal} onChange={(v) => update("codePostal", v)} />
        <Field label="Ville" value={form.ville} onChange={(v) => update("ville", v)} />
        <Field label="Slug ville (URL annuaire)" value={form.villeSlug} onChange={(v) => update("villeSlug", v)} />
        <Field label="Code INSEE" value={form.codeInsee} onChange={(v) => update("codeInsee", v)} />
        <Field label="Latitude" value={form.latitude} type="number" onChange={(v) => update("latitude", v === "" ? null : Number(v))} />
        <Field label="Longitude" value={form.longitude} type="number" onChange={(v) => update("longitude", v === "" ? null : Number(v))} />
        <Field label="Rayon zone (km)" value={form.zoneRayonKm} type="number" onChange={(v) => update("zoneRayonKm", v === "" ? 15 : Number(v))} />
        <Field label="Années d'expérience" value={form.experienceAnnees} type="number" onChange={(v) => update("experienceAnnees", v === "" ? null : Number(v))} />
      </Section>

      <Section title="Description publique">
        <div className="md:col-span-2">
          <Field label="Description (annuaire + vitrine)" value={form.description} textarea onChange={(v) => update("description", v)} />
        </div>
      </Section>

      <Section title="Statut admin (override)">
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Statut artisan</span>
          <select
            value={form.artisanStatus || ""}
            onChange={(e) => update("artisanStatus", e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.actif}
              onChange={(e) => update("actif", e.target.checked)}
            />
            Actif (visible dans annuaire)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.visible}
              onChange={(e) => update("visible", e.target.checked)}
            />
            Visible (toggle public)
          </label>
        </div>
        <div className="md:col-span-2">
          <Field label="Motif de refus (si REJECTED)" value={form.motifRefus} textarea onChange={(v) => update("motifRefus", v)} />
        </div>
      </Section>

      <Section title="Plan & override">
        <Field label="Plan actuel" value={artisan.plan} onChange={() => {}} />
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Plan override (admin)</span>
          <select
            value={form.planOverride || ""}
            onChange={(e) => update("planOverride", e.target.value || null)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">— aucun —</option>
            <option value="GRATUIT">GRATUIT</option>
            <option value="STARTER">STARTER</option>
            <option value="PRO">PRO</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>
        </label>
        <Field label="Raison override" value={form.planOverrideRaison} onChange={(v) => update("planOverrideRaison", v)} />
        <Field
          label="Expire le (ISO datetime, ex: 2026-12-31T23:59:00Z)"
          value={form.planOverrideExpireAt}
          onChange={(v) => update("planOverrideExpireAt", v || null)}
        />
      </Section>

      <Section title="SEO vitrine">
        <Field label="SEO title (vitrine)" value={form.seoTitle} onChange={(v) => update("seoTitle", v)} />
        <Field label="Slug métier SEO" value={form.metierSlugSeo} onChange={(v) => update("metierSlugSeo", v)} />
        <div className="md:col-span-2">
          <Field label="SEO description" value={form.seoDescription} textarea onChange={(v) => update("seoDescription", v)} />
        </div>
        <div className="md:col-span-2">
          <Field label="Horaires (texte libre)" value={form.horairesTexte} textarea onChange={(v) => update("horairesTexte", v)} />
        </div>
        <div className="md:col-span-2">
          <Field label="Zone d'intervention (texte libre)" value={form.zoneTexte} textarea onChange={(v) => update("zoneTexte", v)} />
        </div>
      </Section>

      <Section title="Liens externes">
        <Field label="Google Business URL" value={form.googleBusinessUrl} onChange={(v) => update("googleBusinessUrl", v)} />
        <Field label="Facebook URL" value={form.facebookUrl} onChange={(v) => update("facebookUrl", v)} />
        <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => update("instagramUrl", v)} />
        <Field label="Site web" value={form.siteWebUrl} onChange={(v) => update("siteWebUrl", v)} />
      </Section>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4 mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/artisans")}
          className="text-sm text-gray-600 hover:underline"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}
