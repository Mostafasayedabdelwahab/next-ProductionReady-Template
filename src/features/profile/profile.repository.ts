import prisma from "@/lib/prisma";
import {
  CreateProfileInput,
  UpdateProfileInput,
  Profile,
} from "./profile.types";
import { Prisma } from "@/generated/prisma/client";

function toPrismaJson(
  value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === null) return Prisma.JsonNull;
  if (value === undefined) return undefined;

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

/**
 * Create profile for user
 */
export async function createProfile(
  data: CreateProfileInput,
): Promise<Profile> {
  const result = await prisma.profile.create({
    data: {
      ...data,
      image: toPrismaJson(data.image),
    },
  });

  return {
    ...result,
    image: result.image as Profile["image"],
  };
}

/**
 * Get profile by user id
 */
export async function getProfileByUserId(
  userId: string,
): Promise<Profile | null> {
  const result = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!result) return null;

  return {
    ...result,
    image: result.image as Profile["image"],
  };
}

/**
 * Update profile
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileInput,
): Promise<Profile> {
  const result = await prisma.profile.update({
    where: { userId },
    data: {
      ...data,
      image: toPrismaJson(data.image),
    },
  });

  return {
    ...result,
    image: result.image as Profile["image"],
  };
}
