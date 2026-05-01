import { PUBLIC_ROUTES } from "@/config/constants";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getCachedSiteSettings();
  const baseUrl = settings.domainUrl || "https://example.com";

  const locales = ["ar", "en"];

  const dynamicRoutes = locales.flatMap((locale) =>
    PUBLIC_ROUTES.map((page) => ({
      url: `${baseUrl}/${locale}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...dynamicRoutes];
}
