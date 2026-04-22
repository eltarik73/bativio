import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // cache 1h

async function getSocialStats() {
  const since30d = new Date();
  since30d.setDate(since30d.getDate() - 30);

  const [demandes30d, artisansActifs, demandesProjetsIA, devisCreated30d] = await Promise.all([
    prisma.demandeDevis.count({
      where: { createdAt: { gte: since30d } },
    }).catch(() => 0),
    prisma.artisan.count({
      where: {
        actif: true,
        deletedAt: null,
        profilCompletion: { gte: 50 },
        NOT: { slug: { startsWith: "test-" } },
      },
    }).catch(() => 0),
    prisma.demandeProjet.count({
      where: { createdAt: { gte: since30d } },
    }).catch(() => 0),
    prisma.devis.count({
      where: { createdAt: { gte: since30d } },
    }).catch(() => 0),
  ]);

  return {
    demandes30d: demandes30d + demandesProjetsIA,
    artisansActifs,
    devisCreated30d,
  };
}

export default async function SocialProofStrip() {
  const stats = await getSocialStats();

  // Ne pas afficher si catalogue vide (pas de crédibilité)
  if (stats.artisansActifs === 0) return null;

  const items = [
    { value: stats.artisansActifs, label: "artisans vérifiés en Rhône-Alpes" },
    { value: stats.demandes30d, label: "demandes reçues ce mois", hide: stats.demandes30d < 5 },
    { value: stats.devisCreated30d, label: "devis générés ce mois", hide: stats.devisCreated30d < 5 },
    { value: 5, label: "villes couvertes (Chambéry, Annecy, Grenoble, Lyon, Valence)" },
  ].filter((i) => !i.hide);

  return (
    <section
      aria-label="Chiffres clés Bativio"
      style={{
        background: "linear-gradient(180deg,#FAF8F5 0%,#fff 100%)",
        padding: "48px 24px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--pierre,#9C958D)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 20,
          }}
        >
          Bativio en chiffres · Rhône-Alpes
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`,
            gap: 24,
          }}
        >
          {items.map((it, i) => (
            <div key={i} style={{ padding: "0 8px" }}>
              <div
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: 36,
                  fontWeight: 600,
                  color: "var(--terre,#C4531A)",
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {it.value.toLocaleString("fr-FR")}
              </div>
              <div style={{ fontSize: 13, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.4 }}>
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
