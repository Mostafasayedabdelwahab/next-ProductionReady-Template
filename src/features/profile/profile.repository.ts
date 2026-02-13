import prisma from "@/lib/prisma";
import { CreateProfileInput, UpdateProfileInput, Profile, } from "./profile.types";

/**
 * Create profile for user
 */
export async function createProfile(
    data: CreateProfileInput
): Promise<Profile> {
    return prisma.profile.create({
        data,
    });
}

/**
 * Get profile by user id
 */
export async function getProfileByUserId(
    userId: string
): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            isActive: true,
          },
        },
      },
    }) as Promise<Profile | null>;
}

/**
 * Update profile
 */
export async function updateProfile(
    userId: string,
    data: UpdateProfileInput
): Promise<Profile> {
    return prisma.profile.update({
        where: { userId },
        data,
    });
}
