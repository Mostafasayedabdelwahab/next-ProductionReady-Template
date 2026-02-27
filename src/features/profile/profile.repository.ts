import prisma from "@/lib/prisma";
import * as profileTypes from "./profile.types";


/**
 * Create profile for user
 */
export async function createProfile(
    data: profileTypes.CreateProfileInput
): Promise<profileTypes.Profile> {
    return prisma.profile.create({
        data,
    });
}

/**
 * Get profile by user id
 */
export async function getProfileByUserId(
    userId: string
): Promise<profileTypes.Profile | null> {
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
    }) as Promise<profileTypes.Profile | null>;
}

/**
 * Update profile
 */
export async function updateProfile(
    userId: string,
    data: profileTypes.UpdateProfileInput
): Promise<profileTypes.Profile> {
    return prisma.profile.update({
        where: { userId },
        data,
    });
}
