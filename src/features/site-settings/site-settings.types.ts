import type { SiteSetting } from "@/generated/prisma/client";
import type {
  ArabicFont,
  EnglishFont,
  RadiusOption,
  ThemeMode,
} from "@/generated/prisma/enums"; // Importing RadiusOptions enum from generated Prisma enums
import { Media } from "@/types/upload.type";

// DTO used when updating site settings
export type SiteSettingsDTO = {
  siteNameAr: string;
  siteNameEn: string;

  siteTitleAr?: string | null;
  siteTitleEn?: string | null;

  siteDescriptionAr?: string | null;
  siteDescriptionEn?: string | null;

  logoUrl?: Media | null;
  faviconUrl?: Media | null;

  arabicFont?: ArabicFont;
  englishFont?: EnglishFont;

  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
  foregroundColor?: string | null;
  cardColor?: string | null;
  borderColor?: string | null;
  mutedColor?: string | null;
  radius?: RadiusOption;
  defaultTheme?: ThemeMode;

  contactEmail?: string | null;
  contactPhone?: string | null;
  whatsappNumber?: string | null;

  addressAr?: string | null;
  addressEn?: string | null;

  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;

  defaultKeywordsAr?: string | null;
  defaultKeywordsEn?: string | null;
  ogImageUrl?: Media | null;

  domainUrl?: string | null;
};

// DB return type (read only)
export type SiteSettingsEntity = SiteSetting;
