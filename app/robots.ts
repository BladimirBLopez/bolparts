import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://bolparts.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/mis-publicaciones", "/favoritos", "/publicar"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
