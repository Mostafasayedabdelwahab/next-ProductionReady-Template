"use server";

import {
  getOrCreateProfile,
  updateUserProfile,
  changeUserPassword,
} from "./profile.service";

import { cache } from "react";
import { requireUser } from "@/guards";
import { handleActionError } from "@/utils/action-helper";
import { checkRateLimit } from "@/services/rate-limit";

/**
 * Get current user profile
 */
export async function getProfileAction() {
  const result = await requireUser();

  const profile = await getOrCreateProfile(result.id);
  return profile;
}

export const getProfileCached = cache(async () => {
  return await getProfileAction();
});

//  Update profile
export async function updateProfileAction(input: unknown) {
  const user = await requireUser();
  const rate = await checkRateLimit("user", user.id);
  if (!rate.success) return rate;

  try {
    const profile = await updateUserProfile(user.id, input);
    return {
      success: true as const,
      data: profile,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

// Change password
export async function changePasswordAction(input: unknown) {
  const user = await requireUser();

  const rate = await checkRateLimit("auth", user.id);

  if (!rate.success) return rate;

  try {
    await changeUserPassword(user.id, input);
    return {
      success: true as const,
    };
  } catch (error) {
    return handleActionError(error);
  }
}
