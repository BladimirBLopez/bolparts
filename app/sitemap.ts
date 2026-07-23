import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bolparts.vercel.app";

  const listings = await prisma.listing.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  const listingUrls: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${baseUrl}/repuesto/${l.id}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...listingUrls,
  ];
}
