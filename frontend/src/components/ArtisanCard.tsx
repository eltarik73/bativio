import Link from "next/link";
import type { ArtisanPublic } from "@/lib/api";
import { METIER_COLORS, METIER_PHOTOS, METIER_ICONS } from "@/lib/metier-config";

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function metierSlug(metierNom: string) {
  return metierNom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
}

export default function ArtisanCard({ artisan, villeSlug }: { artisan: ArtisanPublic; villeSlug?: string }) {
  const vs = villeSlug || slugify(artisan.ville || "chambery");
  const ms = metierSlug(artisan.metierNom || "plombier");
  const photo = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  const color = METIER_COLORS[ms] || METIER_COLORS.plombier;
  const icon = METIER_ICONS[ms] || METIER_ICONS.plombier;
  const online = artisan.id ? parseInt(artisan.id) % 3 !== 0 : true;

  const tags = (artisan.services && artisan.services.length > 0)
    ? artisan.services.slice(0, 3).map((s) => s.titre)
    : artisan.badgesNoms?.slice(0, 3) || [];

  const certs = artisan.badgesNoms || [];

  return (
    <Link href={`/${vs}/${artisan.slug}`}>
      <article className="card">
        <div className="card-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={artisan.metierNom} />
          <div className="card-badge" style={{ background: color }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" dangerouslySetInnerHTML={{ __html: icon }} />
            {artisan.metierNom}
          </div>
          <div className="card-rating">
            <svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            {artisan.noteMoyenne?.toFixed(1)} <small>({artisan.nombreAvis})</small>
          </div>
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
          <div className="card-meta">
            {artisan.ville}
            {online && (
              <>
                <span className="card-mdot" />
                <span className="card-onl">En ligne</span>
              </>
            )}
          </div>
          <div className="card-desc">{artisan.description}</div>
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
        </div>
      </article>
    </Link>
  );
}
