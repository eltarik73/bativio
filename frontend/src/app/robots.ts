import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/devis/"],
      },
    ],
    sitemap: "https://www.bativio.fr/sitemap.xml",
  };
}
