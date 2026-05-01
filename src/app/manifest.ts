import { MetadataRoute } from "next";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { getMediaUrl } from "@/utils/media";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getCachedSiteSettings();

  return {
    name: settings.siteNameEn || "Website",
    short_name: settings.siteNameEn || "Website",
    start_url: "/en",
    display: "standalone",
    background_color: settings.backgroundColor || "#ffffff",
    theme_color: settings.primaryColor || "#000000",
    icons: [
      {
        src: getMediaUrl(settings.faviconUrl) || "/globe.svg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: getMediaUrl(settings.faviconUrl) || "/globe.svg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
