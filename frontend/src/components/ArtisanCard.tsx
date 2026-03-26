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
  const online = Math.random() > 0.4; // placeholder

  const tags = artisan.services?.slice(0, 3).map((s) => s.titre) ||
    artisan.badgesNoms?.slice(0, 3) || [];

  return (
    <Link href={`/${vs}/${artisan.slug}`} className="block">
      <article className="card-animate flex rounded-[14px] overflow-hidden bg-white border border-g100 cursor-pointer transition-all duration-[350ms] ease-[cubic-bezier(.22,1,.36,1)] min-h-[160px] max-md:min-h-[140px] hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(28,28,30,.1)] hover:border-transparent group">
        {/* Photo */}
        <div className="w-[150px] max-md:w-[120px] flex-shrink-0 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={artisan.metierNom}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/35" />

          {/* Badge metier */}
          <div
            className="absolute top-[10px] left-[10px] z-[2] flex items-center gap-1 px-[10px] py-1 rounded-[6px] text-[10px] font-semibold text-white"
            style={{ background: color }}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" dangerouslySetInnerHTML={{ __html: icon }} />
            {artisan.metierNom}
          </div>

          {/* Rating */}
          <div className="absolute bottom-[10px] left-[10px] z-[2] flex items-center gap-1 font-display text-[18px] font-extrabold text-white [text-shadow:0_2px_8px_rgba(0,0,0,.5)]">
            <svg className="w-[14px] h-[14px] fill-or" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {artisan.noteMoyenne?.toFixed(1) || "4.5"}{" "}
            <small className="font-body text-[10px] font-medium opacity-70">({artisan.nombreAvis})</small>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-[14px] max-md:px-[14px] max-md:py-3 flex flex-col justify-center min-w-0">
          {/* Row 1: name + certs */}
          <div className="flex items-start justify-between gap-[6px]">
            <span className="font-display text-[15px] max-md:text-[14px] font-bold text-anthracite leading-[1.2] truncate">
              {artisan.nomAffichage}
            </span>
            {artisan.badgesNoms && artisan.badgesNoms.length > 0 && (
              <div className="flex gap-[3px] flex-shrink-0 mt-[1px]">
                {artisan.badgesNoms.slice(0, 2).map((b) => (
                  <span key={b} className="text-[9px] font-semibold px-[7px] py-[2px] rounded bg-[rgba(196,83,26,.07)] text-terre tracking-[0.2px]">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Row 2: meta */}
          <div className="text-[11.5px] text-g400 mt-[3px] flex items-center gap-[5px]">
            {artisan.ville}
            {online && (
              <>
                <span className="w-[2.5px] h-[2.5px] rounded-full bg-g300 inline-block" />
                <span className="text-green font-semibold text-[11px]">En ligne</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-g500 leading-[1.5] mt-2 mb-[10px] line-clamp-2">
            {artisan.description}
          </p>

          {/* Bottom: tags + arrow */}
          <div className="flex items-center gap-[6px]">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="text-[9.5px] px-2 py-[3px] rounded bg-g50 text-g500 whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>
            <div className="w-7 h-7 rounded-full bg-g50 flex items-center justify-center flex-shrink-0 transition-all duration-[250ms] group-hover:bg-terre">
              <svg className="w-[13px] h-[13px] stroke-g400 group-hover:stroke-white" strokeWidth="2" fill="none" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
