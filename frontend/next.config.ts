import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Redirects 308 (permanent) pour récupérer les signaux SEO sur les formats
  // d'URL alternatifs que Google teste/devine. Ex: Google a découvert
  // /plombier-cognin (format inversé) et /artisans-yenne — on les redirige
  // vers le bon format /cognin/plombier et /yenne pour ne pas perdre l'autorité.
  redirects: async () => [
    // /{metier}-{ville} → /{ville}/{metier} (8 métiers)
    { source: "/plombier-:ville", destination: "/:ville/plombier", permanent: true },
    { source: "/electricien-:ville", destination: "/:ville/electricien", permanent: true },
    { source: "/peintre-:ville", destination: "/:ville/peintre", permanent: true },
    { source: "/macon-:ville", destination: "/:ville/macon", permanent: true },
    { source: "/carreleur-:ville", destination: "/:ville/carreleur", permanent: true },
    { source: "/menuisier-:ville", destination: "/:ville/menuisier", permanent: true },
    { source: "/couvreur-:ville", destination: "/:ville/couvreur", permanent: true },
    { source: "/chauffagiste-:ville", destination: "/:ville/chauffagiste", permanent: true },
    // /artisans-{ville} → /{ville} (hub ville)
    { source: "/artisans-:ville", destination: "/:ville", permanent: true },
    // Anciens formats SEO observés
    { source: "/artisan-:ville", destination: "/:ville", permanent: true },
    { source: "/artisans/:ville", destination: "/:ville", permanent: true },
    // Google a découvert /travaux/:slug/:ville (format hypothétique) → redirige
    // vers la page travaux générique. Si on veut ranker spécifiquement sur
    // "renovation salle de bain lyon", il faudra créer /travaux/[slug]/[ville].
    { source: "/travaux/:slug/:ville", destination: "/travaux/:slug", permanent: true },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://placehold.co",
            "font-src 'self' data:",
            "connect-src 'self' https://api.stripe.com https://*.invoquo.vercel.app https://invoquo.vercel.app https://recherche-entreprises.api.gouv.fr https://vitals.vercel-insights.com",
            "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://invoquo.vercel.app https://*.invoquo.vercel.app",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests",
          ].join("; "),
        },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    {
      source: "/icons/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
