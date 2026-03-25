import Link from "next/link";
import StarRating from "./StarRating";
import type { ArtisanPublic } from "@/lib/api";

const metierColors: Record<string, string> = {
  Plombier: "bg-blue-500",
  Electricien: "bg-yellow-500",
  Peintre: "bg-pink-500",
  Macon: "bg-orange-700",
  Carreleur: "bg-teal-500",
  Menuisier: "bg-amber-700",
  Couvreur: "bg-red-700",
  Chauffagiste: "bg-red-500",
  Serrurier: "bg-gray-600",
  Cuisiniste: "bg-green-600",
};

export default function ArtisanCard({ artisan, villeSlug }: { artisan: ArtisanPublic; villeSlug?: string }) {
  const slug = villeSlug || artisan.ville?.toLowerCase().replace(/[^a-z]/g, "") || "chambery";
  const initials = artisan.nomAffichage
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/${slug}/${artisan.slug}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-black/5">
        <div className={`h-3 ${metierColors[artisan.metierNom] || "bg-terre"}`} />
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-terre/10 flex items-center justify-center text-terre font-display font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-lg text-anthracite truncate">
                {artisan.nomAffichage}
              </h3>
              <p className="text-sm text-anthracite/60">
                {artisan.metierIcone} {artisan.metierNom} &middot; {artisan.ville}
              </p>
              <div className="mt-1">
                <StarRating rating={artisan.noteMoyenne} count={artisan.nombreAvis} />
              </div>
            </div>
          </div>
          {artisan.description && (
            <p className="mt-3 text-sm text-anthracite/70 line-clamp-2">
              {artisan.description}
            </p>
          )}
          {artisan.badgesNoms && artisan.badgesNoms.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {artisan.badgesNoms.slice(0, 3).map((badge) => (
                <span key={badge} className="frosted text-xs px-2 py-1 rounded-full text-anthracite/70 border border-black/5">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
