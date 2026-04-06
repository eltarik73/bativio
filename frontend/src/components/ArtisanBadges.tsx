import { getEffectivePlan } from "@/lib/plan-gates";

interface ArtisanBadgesProps {
  plan: string;
  planOverride?: string | null;
  planOverrideExpireAt?: string | null;
  experienceAnnees?: number | null;
  size?: "sm" | "md";
}

export default function ArtisanBadges({
  plan,
  planOverride,
  planOverrideExpireAt,
  experienceAnnees,
  size = "sm",
}: ArtisanBadgesProps) {
  const effectivePlan = getEffectivePlan({ plan, planOverride, planOverrideExpireAt });

  const px = size === "md" ? "6px 12px" : "2px 8px";
  const fs = size === "md" ? 12 : 11;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {effectivePlan === "business" && (
        <>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: fs,
              fontWeight: 600,
              padding: px,
              borderRadius: 20,
              background: "rgba(201,148,58,.1)",
              color: "#C9943A",
            }}
          >
            &#9733; Certifi&eacute;
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: fs,
              fontWeight: 600,
              padding: px,
              borderRadius: 20,
              background: "rgba(59,130,246,.06)",
              color: "#3B82F6",
            }}
          >
            &#9889; Devis rapide
          </span>
        </>
      )}
      {effectivePlan === "pro" && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: fs,
            fontWeight: 600,
            padding: px,
            borderRadius: 20,
            background: "rgba(196,83,26,.08)",
            color: "#C4531A",
          }}
        >
          &#10003; V&eacute;rifi&eacute;
        </span>
      )}
      {experienceAnnees != null && experienceAnnees > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: fs,
            padding: px,
            borderRadius: 20,
            background: "rgba(0,0,0,.04)",
            color: "#6B6560",
          }}
        >
          {experienceAnnees} ans d&apos;exp.
        </span>
      )}
    </div>
  );
}
