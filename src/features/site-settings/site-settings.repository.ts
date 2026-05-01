import prisma from "@/lib/prisma";
import type {
  SiteSettingsDTO,
  SiteSettingsEntity,
} from "./site-settings.types";
import { Prisma } from "@/generated/prisma/client";

// Get single site settings (single-site mode)
export async function getSiteSettings(): Promise<SiteSettingsEntity | null> {
  return prisma.siteSetting.findFirst();
}

function toPrismaJson(
  value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === null) return Prisma.JsonNull;
  if (value === undefined) return undefined;

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

// Create or update site settings safely
export async function upsertSiteSettings(
  data: SiteSettingsDTO,
): Promise<SiteSettingsEntity> {
  const existing = await prisma.siteSetting.findFirst();

  const preparedData = {
    ...data,
    logoUrl: toPrismaJson(data.logoUrl),
    faviconUrl: toPrismaJson(data.faviconUrl),
    ogImageUrl: toPrismaJson(data.ogImageUrl),
  };

  if (existing) {
    return prisma.siteSetting.update({
      where: { id: existing.id },
      data: preparedData,
    });
  }

  return prisma.siteSetting.create({
    data: preparedData,
  });
}
