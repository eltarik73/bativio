"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Toggle switch inline                                              */
/* ------------------------------------------------------------------ */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 12, padding: 2, border: "none", cursor: "pointer",
      background: checked ? "#C4531A" : "#E0DDD8", transition: "background .2s",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 10, background: "#fff",
        transform: checked ? "translateX(20px)" : "translateX(0)", transition: "transform .2s",
      }} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface ConfigItem {
  id: string;
  cle: string;
  valeur: string;
  type: string;
  categorie: string;
  label: string;
  description?: string;
}

type ConfigMap = Record<string, ConfigItem[]>;

const TABS = [
  { key: "notifications", label: "Notifications" },
  { key: "plans", label: "Plans & Tarifs" },
  { key: "features", label: "Fonctionnalites" },
  { key: "seo", label: "Contenu & SEO" },
  { key: "legal", label: "Mentions legales" },
  { key: "limites", label: "Limites" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function parseVal(item: ConfigItem): any {
  if (item.type === "boolean") return item.valeur === "true";
  if (item.type === "number") return Number(item.valeur);
  if (item.type === "json") {
    try { return JSON.parse(item.valeur); } catch { return item.valeur; }
  }
  return item.valeur;
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */
export default function AdminParametresPage() {
  const { fetchWithAuth } = useAuth();
  const [configs, setConfigs] = useState<ConfigMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("notifications");
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  /* Load configs */
  const loadConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await fetchWithAuth("/admin/config")) as ConfigMap;
      setConfigs(data);
    } catch (e) {
      console.error("Erreur chargement config:", e);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => { loadConfigs(); }, [loadConfigs]);

  /* Mark a config as changed */
  const updateLocal = (cle: string, valeur: string) => {
    setDirty((prev) => ({ ...prev, [cle]: valeur }));
    setConfigs((prev) => {
      const next = { ...prev };
      for (const cat of Object.keys(next)) {
        next[cat] = next[cat].map((c) => (c.cle === cle ? { ...c, valeur } : c));
      }
      return next;
    });
  };

  /* Save */
  const save = async () => {
    const entries = Object.entries(dirty);
    if (entries.length === 0) return;
    try {
      setSaving(true);
      await fetchWithAuth("/admin/config", {
        method: "PUT",
        body: JSON.stringify(entries.map(([cle, valeur]) => ({ cle, valeur }))),
      });
      setDirty({});
      setToast("Parametres enregistres");
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
      setToast("Erreur lors de la sauvegarde");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  /* Category helpers */
  const allItems = Object.values(configs).flat();
  const itemsByCle = (cle: string) => allItems.find((c) => c.cle === cle);
  const itemsByPrefix = (prefix: string) => allItems.filter((c) => c.cle.startsWith(prefix));

  /* ---------------------------------------------------------------- */
  /*  Tab renderers                                                   */
  /* ---------------------------------------------------------------- */
  const renderNotifications = () => {
    const smsItems = itemsByPrefix("sms.");
    const emailItems = itemsByPrefix("email.");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Card title="SMS">
          {smsItems.length === 0 && <EmptyMessage />}
          {smsItems.map((item) => (
            <ConfigRow key={item.cle} item={item} onUpdate={updateLocal} />
          ))}
        </Card>
        <Card title="Email">
          {emailItems.length === 0 && <EmptyMessage />}
          {emailItems.map((item) => (
            <ConfigRow key={item.cle} item={item} onUpdate={updateLocal} />
          ))}
        </Card>
      </div>
    );
  };

  const renderPlans = () => {
    const plans = ["GRATUIT", "ESSENTIEL", "PRO", "PRO_PLUS"];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {plans.map((plan) => {
          const prefix = `plans.${plan.toLowerCase()}`;
          const enabledItem = itemsByCle(`${prefix}.enabled`);
          const prixItem = itemsByCle(`${prefix}.prix`);
          const photosItem = itemsByCle(`${prefix}.photos_max`);
          const badgesItem = itemsByCle(`${prefix}.badges_max`);
          const hasAny = enabledItem || prixItem || photosItem || badgesItem;
          if (!hasAny) return null;
          return (
            <Card key={plan} title={plan.replace("_", " ")}>
              {enabledItem && (
                <ConfigRow item={enabledItem} onUpdate={updateLocal} />
              )}
              {prixItem && (
                <ConfigRow item={prixItem} onUpdate={updateLocal} />
              )}
              {photosItem && (
                <ConfigRow item={photosItem} onUpdate={updateLocal} />
              )}
              {badgesItem && (
                <ConfigRow item={badgesItem} onUpdate={updateLocal} />
              )}
            </Card>
          );
        })}
        {/* Fallback: show all plans.* configs */}
        {itemsByPrefix("plans.").length === 0 && (
          <Card title="Plans">
            <EmptyMessage />
          </Card>
        )}
      </div>
    );
  };

  const renderFeatures = () => {
    const featureItems = itemsByPrefix("features.");
    // Group by feature name (features.xxx and features.xxx.plans)
    const featureNames = new Set<string>();
    featureItems.forEach((item) => {
      const parts = item.cle.split(".");
      if (parts.length >= 2) featureNames.add(parts[1]);
    });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {featureNames.size === 0 && <Card title="Fonctionnalites"><EmptyMessage /></Card>}
        {Array.from(featureNames).map((name) => {
          const enabledItem = itemsByCle(`features.${name}`);
          const plansItem = itemsByCle(`features.${name}.plans`);
          return (
            <Card key={name} title={enabledItem?.label || name}>
              {enabledItem && (
                <ConfigRow item={enabledItem} onUpdate={updateLocal} />
              )}
              {plansItem && (
                <FeaturePlansRow item={plansItem} onUpdate={updateLocal} />
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderSeo = () => {
    const keys = ["seo.hero_title", "seo.hero_subtitle", "seo.site_name", "seo.site_description", "seo.maintenance_mode"];
    return (
      <Card title="Contenu & SEO">
        {keys.map((k) => {
          const item = itemsByCle(k);
          if (!item) return null;
          return <ConfigRow key={k} item={item} onUpdate={updateLocal} />;
        })}
        {/* Fallback: show all seo.* */}
        {itemsByPrefix("seo.").filter((i) => !keys.includes(i.cle)).map((item) => (
          <ConfigRow key={item.cle} item={item} onUpdate={updateLocal} />
        ))}
        {itemsByPrefix("seo.").length === 0 && <EmptyMessage />}
      </Card>
    );
  };

  const renderLegal = () => {
    const keys = ["legal.societe", "legal.siret", "legal.adresse", "legal.email", "legal.telephone"];
    return (
      <Card title="Mentions legales">
        {keys.map((k) => {
          const item = itemsByCle(k);
          if (!item) return null;
          return <ConfigRow key={k} item={item} onUpdate={updateLocal} />;
        })}
        {itemsByPrefix("legal.").filter((i) => !keys.includes(i.cle)).map((item) => (
          <ConfigRow key={item.cle} item={item} onUpdate={updateLocal} />
        ))}
        {itemsByPrefix("legal.").length === 0 && <EmptyMessage />}
      </Card>
    );
  };

  const renderLimites = () => {
    const keys = ["limites.max_devis_ia_global", "limites.max_devis_ia_artisan", "limites.max_sms_global"];
    return (
      <Card title="Limites">
        {keys.map((k) => {
          const item = itemsByCle(k);
          if (!item) return null;
          return <ConfigRow key={k} item={item} onUpdate={updateLocal} />;
        })}
        {itemsByPrefix("limites.").filter((i) => !keys.includes(i.cle)).map((item) => (
          <ConfigRow key={item.cle} item={item} onUpdate={updateLocal} />
        ))}
        {itemsByPrefix("limites.").length === 0 && <EmptyMessage />}
      </Card>
    );
  };

  const tabRenderers: Record<TabKey, () => React.ReactNode> = {
    notifications: renderNotifications,
    plans: renderPlans,
    features: renderFeatures,
    seo: renderSeo,
    legal: renderLegal,
    limites: renderLimites,
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <div style={{ width: 32, height: 32, border: "3px solid #E0DDD8", borderTopColor: "#C4531A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", margin: 0 }}>
          Parametres
        </h1>
        <p style={{ fontSize: 14, color: "#9B9590", marginTop: 4 }}>
          Configuration globale de la plateforme
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: activeTab === tab.key ? "#C4531A" : "#fff",
              color: activeTab === tab.key ? "#fff" : "#1C1C1E",
              boxShadow: activeTab === tab.key ? "none" : "0 1px 3px rgba(0,0,0,.08)",
              transition: "all .15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tabRenderers[activeTab]()}

      {/* Save button */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
        {Object.keys(dirty).length > 0 && (
          <span style={{ fontSize: 13, color: "#C4531A", fontWeight: 500 }}>
            {Object.keys(dirty).length} modification{Object.keys(dirty).length > 1 ? "s" : ""} en attente
          </span>
        )}
        <button
          onClick={save}
          disabled={saving || Object.keys(dirty).length === 0}
          style={{
            padding: "10px 28px",
            borderRadius: 8,
            border: "none",
            cursor: saving || Object.keys(dirty).length === 0 ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: 600,
            background: Object.keys(dirty).length === 0 ? "#E0DDD8" : "#C4531A",
            color: "#fff",
            opacity: saving ? 0.7 : 1,
            transition: "all .15s",
          }}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#1C1C1E", color: "#fff",
          padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,.15)", zIndex: 999,
          animation: "slideUp .3s ease",
        }}>
          {toast}
          <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, border: "1.5px solid #EDEBE7",
      padding: "20px 24px",
    }}>
      <h3 style={{
        fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E",
        margin: "0 0 16px 0", paddingBottom: 12, borderBottom: "1px solid #EDEBE7",
      }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function EmptyMessage() {
  return (
    <p style={{ fontSize: 13, color: "#9B9590", fontStyle: "italic", margin: 0 }}>
      Aucune configuration dans cette categorie.
    </p>
  );
}

function ConfigRow({ item, onUpdate }: { item: ConfigItem; onUpdate: (cle: string, val: string) => void }) {
  const val = parseVal(item);

  if (item.type === "boolean") {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 36 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1E" }}>{item.label}</span>
          {item.description && (
            <p style={{ fontSize: 12, color: "#9B9590", margin: "2px 0 0 0" }}>{item.description}</p>
          )}
        </div>
        <Toggle checked={val} onChange={(v) => onUpdate(item.cle, String(v))} />
      </div>
    );
  }

  if (item.type === "number") {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 36, gap: 16 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1E" }}>{item.label}</span>
          {item.description && (
            <p style={{ fontSize: 12, color: "#9B9590", margin: "2px 0 0 0" }}>{item.description}</p>
          )}
        </div>
        <input
          type="number"
          value={item.valeur}
          onChange={(e) => onUpdate(item.cle, e.target.value)}
          style={{
            width: 100, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #EDEBE7",
            fontSize: 14, color: "#1C1C1E", outline: "none", textAlign: "right",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C4531A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#EDEBE7"; }}
        />
      </div>
    );
  }

  // Default: string / text input
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minHeight: 36 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1E" }}>{item.label}</span>
      {item.description && (
        <p style={{ fontSize: 12, color: "#9B9590", margin: 0 }}>{item.description}</p>
      )}
      <input
        type="text"
        value={item.valeur}
        onChange={(e) => onUpdate(item.cle, e.target.value)}
        style={{
          padding: "8px 12px", borderRadius: 8, border: "1.5px solid #EDEBE7",
          fontSize: 14, color: "#1C1C1E", outline: "none", width: "100%",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#C4531A"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#EDEBE7"; }}
      />
    </div>
  );
}

function FeaturePlansRow({ item, onUpdate }: { item: ConfigItem; onUpdate: (cle: string, val: string) => void }) {
  const plans = ["GRATUIT", "ESSENTIEL", "PRO", "PRO_PLUS"];
  let current: string[] = [];
  try {
    current = JSON.parse(item.valeur);
    if (!Array.isArray(current)) current = [];
  } catch {
    current = [];
  }

  const toggle = (plan: string) => {
    const next = current.includes(plan) ? current.filter((p) => p !== plan) : [...current, plan];
    onUpdate(item.cle, JSON.stringify(next));
  };

  return (
    <div style={{ minHeight: 36 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1E" }}>{item.label}</span>
      {item.description && (
        <p style={{ fontSize: 12, color: "#9B9590", margin: "2px 0 0 0" }}>{item.description}</p>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {plans.map((plan) => (
          <label key={plan} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={current.includes(plan)}
              onChange={() => toggle(plan)}
              style={{ accentColor: "#C4531A", width: 16, height: 16 }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#1C1C1E" }}>{plan.replace("_", " ")}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
