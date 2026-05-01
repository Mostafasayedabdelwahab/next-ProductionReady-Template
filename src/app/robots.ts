import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getCachedSiteSettings();

  const baseUrl = settings.domainUrl || "https://example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/profile/", "/api/", "/*?*"],
      },
    ],
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
