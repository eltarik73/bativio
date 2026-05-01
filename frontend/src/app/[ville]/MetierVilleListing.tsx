import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getEffectivePlan, normalizePlan } from "@/lib/plan-gates";
import ArtisanBadges from "@/components/ArtisanBadges";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BASE_URL } from "@/lib/constants";
import { safeJsonLd } from "@/lib/html-escape";

interface Props {
  metierSlug: string;
  villeSlug: string;
  metierDisplay: string;
  villeDisplay: string;
}

export default async function MetierVilleListing({ metierSlug, villeSlug, metierDisplay, villeDisplay }: Props) {
  // Find metier by slug to query via artisanMetiers
  const metier = await prisma.metier.findFirst({
    where: {
      OR: [
        { slug: metierSlug },
        { slug: { contains: metierSlug, mode: "insensitive" } },
      ],
    },
  });

  // Query artisans who have this metier (primary OR secondary)
  const artisans = await prisma.artisan.findMany({
    where: {
      ...(metier
        ? { artisanMetiers: { some: { metierId: metier.id } } }
        : { metierSlugSeo: metierSlug }),
      villeSlug: villeSlug,
      actif: true,
      visible: true,
      deletedAt: null,
    },
    include: {
      photos: { take: 1, orderBy: { ordre: "asc" } },
      badges: true,
      metier: true,
      artisanMetiers: {
        include: { metier: { select: { id: true, nom: true, slug: true, icone: true } } },
        orderBy: { principal: "desc" },
      },
    },
    orderBy: { noteMoyenne: "desc" },
  });

  // Sort by plan: Business first, then Pro, then rest
  const PLAN_HIERARCHY = ["gratuit", "starter", "pro", "business"];
  const sorted = [...artisans].sort((a, b) => {
    const planA = PLAN_HIERARCHY.indexOf(normalizePlan(getEffectivePlan(a)));
    const planB = PLAN_HIERARCHY.indexOf(normalizePlan(getEffectivePlan(b)));
    if (planB !== planA) return planB - planA;
    return (b.noteMoyenne || 0) - (a.noteMoyenne || 0);
  });

  const composedSlug = `${metierSlug}-${villeSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${metierDisplay} \u00e0 ${villeDisplay}`,
    numberOfItems: sorted.length,
    itemListElement: sorted.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: a.nomAffichage,
        url: `${BASE_URL}/${composedSlug}/${a.slug}`,
        address: { "@type": "PostalAddress", addressLocality: a.ville || villeDisplay },
        ...(a.telephone && { telephone: a.telephone }),
        ...(a.noteMoyenne > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: a.noteMoyenne, reviewCount: a.nombreAvis } }),
      },
    })),
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <main>
        {/* Hero */}
        <section style={{ background: "#3D2E1F", padding: "48px 32px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 16 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Accueil</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <Link href={`/${villeSlug}`} style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>{villeDisplay}</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,.7)" }}>{metierDisplay}</span>
            </nav>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 8 }}>
              {metierDisplay} &agrave; <span style={{ color: "#D4956B" }}>{villeDisplay}</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", maxWidth: 480, margin: "0 auto" }}>
              {sorted.length} artisan{sorted.length > 1 ? "s" : ""} disponible{sorted.length > 1 ? "s" : ""} &middot; Devis gratuit &middot; Z&eacute;ro commission
            </p>
          </div>
        </section>

        {/* List */}
        <section style={{ background: "#FAF8F5", padding: "32px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            {sorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <p style={{ fontSize: 18, fontWeight: 600, color: "#3D2E1F", marginBottom: 8 }}>Aucun artisan pour le moment</p>
                <p style={{ fontSize: 14, color: "#9C958D" }}>Soyez le premier {metierDisplay.toLowerCase()} r&eacute;f&eacute;renc&eacute; &agrave; {villeDisplay}</p>
                <Link href="/inscription" style={{ display: "inline-block", marginTop: 20, padding: "12px 24px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  Cr&eacute;er ma page
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {sorted.map((a) => {
                  const photo = a.photos[0]?.url;
                  const initials = a.nomAffichage.split(/\s+/).map(w => w[0]).join("").substring(0, 2).toUpperCase();
                  return (
                    <Link key={a.id} href={`/${composedSlug}/${a.slug}`} style={{ display: "flex", gap: 20, padding: 24, background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", textDecoration: "none", transition: "all .2s" }}>
                      {/* Avatar/Photo */}
                      {photo ? (
                        <Image src={photo} alt={a.nomAffichage} width={80} height={80} style={{ borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 80, height: 80, borderRadius: 12, background: "linear-gradient(135deg, #C4531A, #D4956B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>{initials}</span>
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#3D2E1F", margin: 0 }}>{a.nomAffichage}</h2>
                          {a.noteMoyenne > 0 && (
                            <span style={{ fontSize: 13, color: "#E8A84C", fontWeight: 600 }}>
                              &#9733; {a.noteMoyenne.toFixed(1)} <span style={{ color: "#9C958D", fontWeight: 400 }}>({a.nombreAvis})</span>
                            </span>
                          )}
                        </div>
                        <ArtisanBadges
                          plan={a.plan}
                          planOverride={a.planOverride}
                          planOverrideExpireAt={a.planOverrideExpireAt?.toISOString()}
                          experienceAnnees={a.experienceAnnees}
                        />
                        <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 6, marginTop: 4 }}>{a.metier?.nom || metierDisplay} &middot; {a.ville || villeDisplay}</p>
                        {a.description && (
                          <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{a.description}</p>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                        <span style={{ padding: "8px 16px", borderRadius: 8, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Devis gratuit</span>
                        {a.zoneRayonKm && (
                          <span style={{ fontSize: 11, color: "#C5C0B9" }}>{a.zoneRayonKm} km</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
