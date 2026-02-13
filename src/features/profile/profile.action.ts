"use server";

import { revalidatePath } from "next/cache";
import {
  getOrCreateProfile,
  updateUserProfile,
  changeUserPassword,
} from "./profile.service";
import { requireVerifiedUser } from "@/lib/guards";
import { ZodError } from "zod";

// استيراد المترجم والأكواد
import { getErrorMessage } from "@/lib/constants/errors";
import { changePasswordSchema, updateProfileSchema } from "./profile.schema";
import { ActionResponse, ChangePasswordInput, Profile, UpdateProfileInput } from "./profile.types";

function formatError(error: unknown): { success: false; error: string } {
  if (error instanceof ZodError) {
    return {
      success: false,
      error: error.issues[0]?.message ?? "Validation error",
    };
  }
  if (error instanceof Error) {
    return { success: false, error: getErrorMessage(error.message) };
  }
  return { success: false, error: "Unknown error occurred" };
}

export async function getProfileAction(): Promise<Profile> {
  // الـ Guard هنا هيرمي Error لو فيه مشكلة، والأكشن هيقف تماماً
  const user = await requireVerifiedUser(); // لازم الـ Guard ده يرمي (throw) خطأ لو اليوزر مش موجود
  const profile = await getOrCreateProfile(user.id);

  if (!profile) throw new Error("PROFILE_NOT_FOUND"); // دي اللي هتخلي الـ catch تشتغل

  return profile;
}

export async function updateProfileAction(
  data: unknown,
): Promise<ActionResponse<Profile>> {
  try {
    const parsed: UpdateProfileInput = updateProfileSchema.parse(data);

    const user = await requireVerifiedUser();
    const updated = await updateUserProfile(user.id, parsed);

    revalidatePath("/profile");
    return { success: true, data: updated };
  } catch (error) {
    return formatError(error);
  }
}

export async function changePasswordAction(
  input: unknown,
): Promise<ActionResponse<void>> {
  try {
    const parsed: ChangePasswordInput = changePasswordSchema.parse(input);
    const user = await requireVerifiedUser();
    await changeUserPassword(user.id, parsed);
    
    return {
      success: true,
      message: "Password changed successfully.",
    };
  } catch (error) {
    return formatError(error);
  }
}
