import { cache } from "react";
import { getSiteSettingsService } from "@/features/site-settings/site-settings.service";

// Cached loader to prevent duplicate DB hits per request
export const getCachedSiteSettings = cache(async () => {
  return await getSiteSettingsService();
});
