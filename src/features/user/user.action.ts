"use server";

import { revalidatePath } from "next/cache";
import * as userService from "./user.service";
import { getErrorMessage } from "@/lib/constants/errors";
import * as userType from "./user.types";
import { handleActionError } from "@/lib/utils/action-helper";

/**
 * Normalize action errors into ActionResponse format
 */
function formatActionError(error: unknown): {
  success: false;
  error: string;
  code: string;
} {

  if (error instanceof Error) {
    return {
      success: false,
      code: error.message,
      error: getErrorMessage(error.message),
    };
  }

  return {
    success: false,
    code: "UNKNOWN_ERROR",
    error: getErrorMessage("UNKNOWN_ERROR"),
  };
}

/**
 * Register user
 */
export async function registerAction(
  data: userType.RegisterFormInput,
): Promise<userType.ActionResponse<userType.SafeUser>> {
  try {
    const user = await userService.registerUser(data);
    return { success: true, data: user };
  } catch (error) {
    return formatActionError(error);
  }
}

/**
 * Login user (mainly for custom flows — NextAuth usually handles login)
 */
export async function loginAction(
  data: unknown,
): Promise<userType.ActionResponse<userType.SafeUser>> {
  try {
    const user = await userService.loginUser(data);
    return { success: true, data: user };
  } catch (error) {
    return formatActionError(error);
  }
}

/**
 * Forgot password
 */
export async function forgotPasswordAction(
  email: string,
): Promise<userType.ActionResponse> {
  try {
    await userService.forgotPassword(email);

    revalidatePath("/forgot-password");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return formatActionError(error);
  }
}

/**
 * Reset password
 */
export async function resetPasswordAction(
  data: unknown,
): Promise<userType.ActionResponse> {
  try {
    await userService.resetPassword(data);

    revalidatePath("/reset-password");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return formatActionError(error);
  }
}

/**
 * Verify email
 */
export async function verifyEmailAction(
  token: string,
): Promise<userType.ActionResponse> {
  try {
    await userService.verifyEmail(token);

    revalidatePath("/verify-email");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return formatActionError(error);
  }
}

/**
 * Resend verification email
 * Always returns success for security reasons
 */
export async function resendVerificationAction(
  email: string,
): Promise<userType.ActionResponse> {
  try {
    await userService.resendVerificationEmail(email);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Check if user email is verified (used for polling)
 */
export async function checkVerificationStatusAction(
  email: string,
): Promise<userType.ActionResponse<userType.VerificationStatusData>> {
  try {
    const user = await userService.findUserByEmail(email);

    return {
      success: true,
      data: { isVerified: !!user?.emailVerified },
    };
  } catch {
    return {
      success: false,
      error: "Failed to check verification status",
      code: "INTERNAL_ERROR",
    };
  }
}
