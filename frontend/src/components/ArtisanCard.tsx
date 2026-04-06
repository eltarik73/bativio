"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArtisanPublic } from "@/lib/api";
import { METIER_COLORS, METIER_ICONS } from "@/lib/metier-config";
import { getArtisanPhoto, FALLBACK_PHOTO } from "@/lib/artisan-photos";
import ArtisanBadges from "@/components/ArtisanBadges";

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function metierSlug(metierNom: string) {
  return metierNom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
}

export default function ArtisanCard({ artisan, villeSlug }: { artisan: ArtisanPublic; villeSlug?: string }) {
  const vs = villeSlug || slugify(artisan.ville || "chambery");
  const ms = metierSlug(artisan.metierNom || "plombier");
  const photo = getArtisanPhoto({
    photos: artisan.photos,
    metierNom: artisan.metierNom,
  });
  const [imgSrc, setImgSrc] = useState(photo);
  const color = METIER_COLORS[ms] || METIER_COLORS.plombier;
  const icon = METIER_ICONS[ms] || METIER_ICONS.plombier;
  const online = artisan.id ? parseInt(artisan.id) % 3 !== 0 : true;

  const tags = (artisan.services && artisan.services.length > 0)
    ? artisan.services.slice(0, 3).map((s) => s.titre)
    : artisan.badgesNoms?.slice(0, 3) || [];

  const certs = artisan.badgesNoms || [];

  const hasRating = artisan.noteMoyenne != null && artisan.noteMoyenne > 0 && artisan.nombreAvis > 0;

  return (
    <Link href={`/${vs}/${artisan.slug}`}>
      <article className="card">
        <div className="card-photo">
          <Image
            src={imgSrc}
            alt={artisan.metierNom || "Photo artisan"}
            fill
            style={{ objectFit: "cover" }}
            onError={() => setImgSrc(FALLBACK_PHOTO)}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="card-badge" style={{ background: color }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" dangerouslySetInnerHTML={{ __html: icon }} />
            {artisan.metierNom}
          </div>
          {hasRating ? (
            <div className="card-rating">
              <svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {artisan.noteMoyenne?.toFixed(1)} <small>({artisan.nombreAvis})</small>
            </div>
          ) : (
            <div className="card-nouveau">Nouveau</div>
          )}
        </div>
        <div className="card-main">
          <div className="card-r1">
            <div className="card-name">{artisan.nomAffichage}</div>
            {certs.length > 0 && (
              <div className="card-certs">
                {certs.slice(0, 2).map((c) => (
                  <span key={c} className="card-cert">{c}</span>
                ))}
              </div>
            )}
          </div>
          <ArtisanBadges
            plan={artisan.plan}
            planOverride={artisan.planOverride}
            planOverrideExpireAt={artisan.planOverrideExpireAt}
            experienceAnnees={artisan.experienceAnnees}
          />
          <div className="card-meta">
            {artisan.ville}
            {artisan.distance != null && artisan.distance < 100 && (
              <span style={{ fontSize: 11, color: "var(--pierre,#9C958D)", marginLeft: 4 }}>
                {"\u00B7"} {"\u00E0"} {artisan.distance < 1 ? `${Math.round(artisan.distance * 1000)}m` : `${artisan.distance.toFixed(1)} km`}
              </span>
            )}
            {online && (
              <>
                <span className="card-mdot" />
                <span className="card-onl">En ligne</span>
              </>
            )}
          </div>
          <div className="card-desc">
            {artisan.description ? (
              artisan.description
            ) : (
              <em style={{ color: "#C5C0B9", fontStyle: "italic" }}>
                Cet artisan n&apos;a pas encore compl&eacute;t&eacute; son profil.
              </em>
            )}
          </div>
          {tags.length > 0 && (
            <div className="card-bot">
              <div className="card-tags">
                {tags.map((t) => (
                  <span key={t} className="card-tag">{t}</span>
                ))}
              </div>
              <div className="card-arr">
                <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          )}
          {tags.length === 0 && (
            <div className="card-bot">
              <div className="card-tags" />
              <div className="card-arr">
                <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
