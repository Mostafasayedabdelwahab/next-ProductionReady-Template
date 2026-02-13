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
import { ERROR_CODES, getErrorMessage } from "@/lib/constants/errors";
import { changePasswordSchema, updateProfileSchema } from "./profile.schema";
import { ActionResponse, Profile } from "./profile.types";

/**
 * دالة مساعدة لتوحيد شكل الأخطاء الراجعة للـ Client
 * يفضل مستقبلاً نقلها لملف @/lib/utils/action-utils.ts
 */
// يفضل وضع هذه الدالة في ملف helper مشترك واستدعائها في كل الـ Actions
function formatError(error: unknown): { success: false; error: string; code: string } {
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
      code: error.message, // الكود الخام (مثلاً: UNAUTHORIZED)
      error: getErrorMessage(error.message) // الرسالة المترجمة
    };
  }

  return { 
    success: false, 
    code: ERROR_CODES.SERVER_ERROR, 
    error: "Unknown error occurred" 
  };
}

export async function getProfileAction(): Promise<Profile> {
  // الـ Guard هنا هيرمي Error (مثل UNAUTHORIZED) والكود هيتوقف
  const user = await requireVerifiedUser();
  const profile = await getOrCreateProfile(user.id);

  if (!profile) throw new Error("PROFILE_NOT_FOUND");

  return profile;
}

export async function updateProfileAction(
  data: unknown,
): Promise<ActionResponse<Profile>> {
  try {
    const user = await requireVerifiedUser();

    // عمل الـ Parse هنا أو جوه الـ Service كلاهما صحيح
    const parsed = updateProfileSchema.parse(data);
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
    const user = await requireVerifiedUser();

    // التحقق من البيانات قبل إرسالها للسيرفس
    const parsed = changePasswordSchema.parse(input);
    await changeUserPassword(user.id, parsed);

    return {
      success: true,
      message: "Password changed successfully.",
    };
  } catch (error) {
    return formatError(error);
  }
}
