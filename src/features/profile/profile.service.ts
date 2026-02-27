import bcrypt from "bcryptjs";
import { ERROR_CODES } from "@/lib/constants/errors";
import * as userRepo from "../user/user.repository";
import * as profileRepo from "./profile.repository";
import * as profileTypes from "./profile.types";
import * as profileSchema from "./profile.schema";

/**
 * Get existing profile or create a new one
 */
export async function getOrCreateProfile(
  userId: string,
): Promise<profileTypes.Profile> {
  const existingProfile = await profileRepo.getProfileByUserId(userId);

  if (existingProfile) {
    return existingProfile;
  }

  const name = await userRepo.getUserNameById(userId);

  const data: profileTypes.CreateProfileInput =
    profileSchema.createProfileSchema.parse({
      userId,
      name: name ?? undefined,
    });

  return profileRepo.createProfile(data);
}

/**
 * Update user profile data
 */
export async function updateUserProfile(
  userId: string,
  input: unknown,
): Promise<profileTypes.Profile> {
  const data = profileSchema.updateProfileSchema.parse(input);
  return profileRepo.updateProfile(userId, data);
}

/**
 * Change user password
 */
export async function changeUserPassword(
  userId: string,
  input: unknown,
): Promise<void> {
  // Validate input
  const data = profileSchema.changePasswordSchema.parse(input);

  // Get user
  const user = await userRepo.getUserById(userId);

  if (!user || !user.password) {
    throw new Error(ERROR_CODES.NOT_FOUND);
  }

  // Verify current password
  const isValid = await bcrypt.compare(data.currentPassword, user.password);

  if (!isValid) {
    throw new Error(ERROR_CODES.INVALID_CURRENT_PASSWORD);
  }

  // Prevent using the same password
  const isSamePassword = await bcrypt.compare(data.newPassword, user.password);

  if (isSamePassword) {
    throw new Error(ERROR_CODES.SAME_PASSWORD_ERROR);
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await userRepo.updateUserPassword(userId, hashedPassword);
}
