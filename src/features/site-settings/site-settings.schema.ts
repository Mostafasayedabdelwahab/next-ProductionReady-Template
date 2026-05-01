import { ERROR_CODES } from "@/config/errors";
import {
  ArabicFont,
  EnglishFont,
  RadiusOption,
  ThemeMode,
} from "@/generated/prisma/enums"; // Importing RadiusOptions enum from generated Prisma enums
import { z } from "zod";

import {
  optionalString,
  optionalUrl,
  socialUrl,
  phoneSchema,
  keywordsSchema,
  hexColor,
  mediaSchema,
} from "@/schemas";

// Validation schema for site settings form
export const siteSettingsSchema = z.object({
  siteNameAr: z
    .string()
    .trim()
    .min(2, ERROR_CODES.FIELD_TOO_SHORT)
    .max(50, ERROR_CODES.FIELD_TOO_LONG)
    .or(z.literal(""))
    .nullable()
    .optional(),

  siteTitleAr: optionalString,
  siteDescriptionAr: optionalString,

  siteNameEn: z
    .string()
    .trim()
    .min(2, ERROR_CODES.FIELD_TOO_SHORT)
    .max(50, ERROR_CODES.FIELD_TOO_LONG)
    .or(z.literal(""))
    .nullable()
    .optional(),

  siteTitleEn: optionalString,
  siteDescriptionEn: optionalString,

  arabicFont: z.nativeEnum(ArabicFont).optional(),
  englishFont: z.nativeEnum(EnglishFont).optional(),

  logoUrl: mediaSchema,
  faviconUrl: mediaSchema,

  primaryColor: hexColor,
  secondaryColor: hexColor,
  accentColor: hexColor,
  backgroundColor: hexColor,
  foregroundColor: hexColor,
  cardColor: hexColor,
  borderColor: hexColor,
  mutedColor: hexColor,
  radius: z.nativeEnum(RadiusOption).optional(),
  defaultTheme: z.nativeEnum(ThemeMode).optional(),

  contactEmail: z
    .string()
    .trim()
    .email(ERROR_CODES.INVALID_EMAIL_FORMAT)
    .optional()
    .nullable()
    .or(z.literal("")),

  contactPhone: phoneSchema,
  whatsappNumber: phoneSchema,
  addressAr: optionalString,
  addressEn: optionalString,

  facebookUrl: socialUrl(["facebook.com"]),
  instagramUrl: socialUrl(["instagram.com"]),
  twitterUrl: socialUrl(["twitter.com", "x.com"]),
  linkedinUrl: socialUrl(["linkedin.com"]),
  youtubeUrl: socialUrl(["youtube.com"]),

  defaultKeywordsAr: keywordsSchema,
  defaultKeywordsEn: keywordsSchema,
  ogImageUrl: mediaSchema,
  domainUrl: optionalUrl.refine((url) => !url || url.startsWith("https://"), {
    message: ERROR_CODES.INVALID_URL,
  }),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
