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

  // Tags: use services titles first, fallback to badges
  const tags = (artisan.services && artisan.services.length > 0)
    ? artisan.services.slice(0, 3).map((s) => s.titre)
    : artisan.badgesNoms?.slice(0, 3) || [];

  return (
    <Link href={`/${vs}/${artisan.slug}`} className="block">
      <article
        className="card-animate flex overflow-hidden bg-white cursor-pointer group"
        style={{
          borderRadius: 14,
          border: "1px solid #EDEBE7",
          minHeight: 160,
          transition: "all .35s cubic-bezier(.22,1,.36,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 16px 44px rgba(28,28,30,.1)";
          e.currentTarget.style.borderColor = "transparent";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#EDEBE7";
        }}
      >
        {/* Photo — fixed 150px width */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ width: 150, minWidth: 150 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={artisan.metierNom}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,.35) 100%)" }}
          />

          {/* Badge metier */}
          <div
            className="absolute top-[10px] left-[10px] z-[2] flex items-center gap-[5px] rounded-[6px] text-white"
            style={{ background: color, padding: "5px 12px", fontSize: 11, fontWeight: 600 }}
          >
            <svg className="flex-shrink-0" style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" dangerouslySetInnerHTML={{ __html: icon }} />
            {artisan.metierNom}
          </div>

          {/* Rating */}
          <div
            className="absolute bottom-[10px] left-[10px] z-[2] flex items-center gap-1"
            style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}
          >
            <svg style={{ width: 14, height: 14, fill: "#E8A84C" }} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {artisan.noteMoyenne?.toFixed(1) || "4.5"}{" "}
            <small style={{ fontFamily: "'Karla', sans-serif", fontSize: 10, fontWeight: 500, opacity: 0.7 }}>({artisan.nombreAvis})</small>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center min-w-0" style={{ padding: "14px 16px" }}>
          {/* Row 1: name + certs */}
          <div className="flex items-start justify-between gap-[6px]">
            <span
              className="font-display font-bold text-anthracite truncate"
              style={{ fontSize: 15, lineHeight: 1.2 }}
            >
              {artisan.nomAffichage}
            </span>
            {artisan.badgesNoms && artisan.badgesNoms.length > 0 && (
              <div className="flex gap-[3px] flex-shrink-0 mt-[1px] overflow-hidden max-w-[140px]">
                {artisan.badgesNoms.slice(0, 2).map((b) => (
                  <span
                    key={b}
                    className="whitespace-nowrap"
                    style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: "rgba(196,83,26,.07)", color: "#C4531A", letterSpacing: "0.2px" }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Row 2: meta */}
          <div className="flex items-center gap-[5px] mt-[3px]" style={{ fontSize: 11.5, color: "#9B9590" }}>
            {artisan.ville}
            {online && (
              <>
                <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "#C5C0B9", display: "inline-block" }} />
                <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 11 }}>En ligne</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-2" style={{ fontSize: 12, color: "#6B6560", lineHeight: 1.5, margin: "8px 0 10px" }}>
            {artisan.description}
          </p>

          {/* Bottom: tags + arrow */}
          <div className="flex items-center gap-[6px]">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="whitespace-nowrap"
                  style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#F7F5F2", color: "#6B6560" }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              className="flex items-center justify-center flex-shrink-0 transition-all duration-[250ms] group-hover:bg-terre"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "#F7F5F2" }}
            >
              <svg style={{ width: 13, height: 13 }} className="stroke-[#9B9590] group-hover:stroke-white" strokeWidth="2" fill="none" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
