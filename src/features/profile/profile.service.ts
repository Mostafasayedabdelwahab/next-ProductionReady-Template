import bcrypt from "bcryptjs";

import { getUserNameById, getUserById, updateUserPassword } from "../user/user.repository";
import { createProfile, getProfileByUserId, updateProfile, } from "./profile.repository";

import { createProfileSchema, updateProfileSchema, changePasswordSchema } from "./profile.schema";

import type { CreateProfileInput, UpdateProfileInput, Profile, } from "./profile.types";



/**
 * Get profile for logged-in user
 * If profile does not exist, create one
 */
export async function getOrCreateProfile(
    userId: string
): Promise<Profile> {
    const existingProfile = await getProfileByUserId(userId);

    if (existingProfile) {
        return existingProfile;
    }

    // 👇 الاسم جاي من user.repository
    const name = await getUserNameById(userId);

    // Create empty profile on first access
    const data: CreateProfileInput =
        createProfileSchema.parse({
            userId,
            name: name ?? undefined,
        });

    return createProfile(data);
}

/**
 * Update profile for logged-in user
 */
export async function updateUserProfile(
    userId: string,
    input: unknown
): Promise<Profile> {
    // Validate input (runtime safety)
    const data: UpdateProfileInput =
        updateProfileSchema.parse(input);

    return updateProfile(userId, data);
}



export async function changeUserPassword(
    userId: string,
    input: unknown
) {
    const data = changePasswordSchema.parse(input);

    const user = await getUserById(userId);

    if (!user || !user.password) {
        throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(
        data.currentPassword,
        user.password
    );

    if (!isValid) {
        throw new Error("Current password is incorrect");
    }

    const isSamePassword = await bcrypt.compare(
        data.newPassword,
        user.password
    );

    if (isSamePassword) {
        throw new Error("New password must be different from current password");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await updateUserPassword(userId, hashedPassword);
}
