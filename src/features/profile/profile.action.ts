"use server";

import { revalidatePath } from "next/cache";
import * as profileService from "./profile.service";
import { requireVerifiedUser } from "@/lib/guards";
import { ZodError } from "zod";

// Import error codes and translator
import { ERROR_CODES, getErrorMessage } from "@/lib/constants/errors";
import { changePasswordSchema, updateProfileSchema } from "./profile.schema";
import { ActionResponse, Profile } from "./profile.types";

/**
 * Normalize errors returned to the client
 * TODO: move to shared helper in the future
 */
function formatError(error: unknown): {
  success: false;
  error: string;
  code: string;
} {
  if (error instanceof ZodError) {
    return {
      success: false,
      code: ERROR_CODES.INVALID_INPUT,
      error: error.issues[0]?.message ?? "Validation error",
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      code: error.message,
      error: getErrorMessage(error.message),
    };
  }

  return {
    success: false,
    code: ERROR_CODES.SERVER_ERROR,
    error: "Unknown error occurred",
  };
}

/**
 * Get current user profile
 */
export async function getProfileAction(): Promise<Profile> {
  const user = await requireVerifiedUser();
  const profile = await profileService.getOrCreateProfile(user.id);

  if (!profile) throw new Error("PROFILE_NOT_FOUND");

  return profile;
}

/**
 * Update profile data
 */
export async function updateProfileAction(
  data: unknown,
): Promise<ActionResponse<Profile>> {
  try {
    const user = await requireVerifiedUser();

    const parsed = updateProfileSchema.parse(data);
    const updated = await profileService.updateUserProfile(user.id, parsed);

    revalidatePath("/profile");

    return { success: true, data: updated };
  } catch (error) {
    return formatError(error);
  }
}

/**
 * Change user password
 */
export async function changePasswordAction(
  input: unknown,
): Promise<ActionResponse<void>> {
  try {
    const user = await requireVerifiedUser();

    const parsed = changePasswordSchema.parse(input);
    await profileService.changeUserPassword(user.id, parsed);

    return {
      success: true,
      message: "Password changed successfully.",
    };
  } catch (error) {
    return formatError(error);
  }
}
