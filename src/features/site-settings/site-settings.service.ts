import { DEFAULT_THEME } from "@/config/constants";
import {
  getSiteSettings,
  upsertSiteSettings,
} from "./site-settings.repository";
import { SiteSettingsDTO, SiteSettingsEntity } from "./site-settings.types";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { isMedia, normalizeMedia } from "@/utils/media";
import { requireUser } from "@/guards";
import { ERROR_CODES } from "@/config/errors";

const SITE_DEFAULTS = {
  name: "Nexus Solutions",
  title: "Leading the Way in Modern Innovation",
  description:
    "Partner with us to redefine your industry standards. We provide professional services tailored to your business needs.",
};

// Read site settings
export async function getSiteSettingsService() {
  let settings = await getSiteSettings();

  if (!settings) {
    settings = await upsertSiteSettings({
      siteNameAr: SITE_DEFAULTS.name,
      siteNameEn: SITE_DEFAULTS.name,
      siteTitleAr: SITE_DEFAULTS.title,
      siteTitleEn: SITE_DEFAULTS.title,
      siteDescriptionAr: SITE_DEFAULTS.description,
      siteDescriptionEn: SITE_DEFAULTS.description,

      primaryColor: DEFAULT_THEME.primaryColor,
      secondaryColor: DEFAULT_THEME.secondaryColor,
      accentColor: DEFAULT_THEME.accentColor,
      mutedColor: DEFAULT_THEME.mutedColor,
      backgroundColor: DEFAULT_THEME.backgroundColor,
      foregroundColor: DEFAULT_THEME.foregroundColor,
      cardColor: DEFAULT_THEME.cardColor,
      borderColor: DEFAULT_THEME.borderColor,

      defaultTheme: "system",

      logoUrl: null,
      faviconUrl: null,
      ogImageUrl: null,
    });
  }

  return {
    ...settings,

    siteNameAr: settings?.siteNameAr || SITE_DEFAULTS.name,
    siteNameEn: settings?.siteNameEn || SITE_DEFAULTS.name,
    siteTitleAr: settings?.siteTitleAr || SITE_DEFAULTS.title,
    siteTitleEn: settings?.siteTitleEn || SITE_DEFAULTS.title,
    siteDescriptionAr: settings?.siteDescriptionAr || SITE_DEFAULTS.description,
    siteDescriptionEn: settings?.siteDescriptionEn || SITE_DEFAULTS.description,

    primaryColor: settings?.primaryColor || DEFAULT_THEME.primaryColor,
    secondaryColor: settings?.secondaryColor || DEFAULT_THEME.secondaryColor,
    accentColor: settings?.accentColor || DEFAULT_THEME.accentColor,
    mutedColor: settings?.mutedColor || DEFAULT_THEME.mutedColor,
    backgroundColor: settings?.backgroundColor || DEFAULT_THEME.backgroundColor,
    foregroundColor: settings?.foregroundColor || DEFAULT_THEME.foregroundColor,
    cardColor: settings?.cardColor || DEFAULT_THEME.cardColor,
    borderColor: settings?.borderColor || DEFAULT_THEME.borderColor,

    defaultTheme: settings?.defaultTheme || "system",
  };
}

// Update site settings
// site-settings.service.ts
export async function updateSiteSettingsService(
  data: SiteSettingsDTO,
): Promise<SiteSettingsEntity> {
  
  const user = await requireUser();
  if (user.email === process.env.ADMIN_DEMO_EMAIL) {
    throw new Error(ERROR_CODES.NOT_ALLOWED_IN_DEMO);
  }

  const existing = await getSiteSettings();

  const imageKeys = ["logoUrl", "faviconUrl", "ogImageUrl"] as const;

  for (const key of imageKeys) {
    const oldValue = existing?.[key];
    const newValue = data[key];

    if (isMedia(oldValue) && isMedia(newValue)) {
      if (oldValue.url !== newValue.url) {
        const publicId = oldValue.public_id;

        deleteImageFromCloudinary(publicId, oldValue.resource_type).catch(
          (err) => {
            console.error(`Cloudinary cleanup failed for ${key}:`, err);
          },
        );
      }
    }

    // حالة حذف الصورة
    if (isMedia(oldValue) && !newValue) {
      deleteImageFromCloudinary(
        oldValue.public_id,
        oldValue.resource_type,
      ).catch((err) => {
        console.error(`Cloudinary cleanup failed for ${key}:`, err);
      });
    }
  }

  const finalData: SiteSettingsDTO = {
    ...data,

    siteNameAr: data.siteNameAr?.trim() || SITE_DEFAULTS.name,
    siteNameEn: data.siteNameEn?.trim() || SITE_DEFAULTS.name,
    siteTitleAr: data?.siteTitleAr || SITE_DEFAULTS.title,
    siteTitleEn: data?.siteTitleEn || SITE_DEFAULTS.title,
    siteDescriptionAr: data?.siteDescriptionAr || SITE_DEFAULTS.description,
    siteDescriptionEn: data?.siteDescriptionEn || SITE_DEFAULTS.description,

    primaryColor: data?.primaryColor || DEFAULT_THEME.primaryColor,
    secondaryColor: data?.secondaryColor || DEFAULT_THEME.secondaryColor,
    accentColor: data?.accentColor || DEFAULT_THEME.accentColor,
    mutedColor: data?.mutedColor || DEFAULT_THEME.mutedColor,
    backgroundColor: data?.backgroundColor || DEFAULT_THEME.backgroundColor,
    foregroundColor: data?.foregroundColor || DEFAULT_THEME.foregroundColor,
    cardColor: data?.cardColor || DEFAULT_THEME.cardColor,
    borderColor: data?.borderColor || DEFAULT_THEME.borderColor,

    logoUrl: normalizeMedia(data.logoUrl),
    faviconUrl: normalizeMedia(data.faviconUrl),
    ogImageUrl: normalizeMedia(data.ogImageUrl),

    defaultTheme: data.defaultTheme || "system",
  };

  return upsertSiteSettings(finalData);
}
