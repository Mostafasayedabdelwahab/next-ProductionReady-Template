"use server";

import { requireAuthUser } from "@/guards";
import {
  registerUser,
  resendVerificationEmail,
  forgotPassword,
} from "./user.service";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleActionError } from "@/utils/action-helper";
import { checkRateLimit } from "@/services/rate-limit";

/**
 * Register
 */
export async function registerAction(input: unknown) {
  try {
    
    const email = (input as { email: string })?.email?.toLowerCase().trim();

    const rate = await checkRateLimit("auth", email);
    if (!rate.success) return rate;


    const user = await registerUser(input);

    return {
      success: true as const,
      data: {
        userId: user.id,
      },
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationAction() {
  try {
    const user = await requireAuthUser();

    const rate = await checkRateLimit("auth", user.user.email);
    if (!rate.success) return rate;
    
    await resendVerificationEmail(user.user.email);

    return {
      success: true as const,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Forgot password
 */
export async function forgotPasswordAction(email: string) {
  try {

    const normalizedEmail = email.toLowerCase().trim();

    const rate = await checkRateLimit("auth", normalizedEmail);
    if (!rate.success) return rate;

    
    const session = await getServerSession(authOptions);

    if (session?.user) {
      return {
        success: false as const,
        code: "ALREADY_AUTHENTICATED",
      };
    }

    await forgotPassword(email);

    return {
      success: true as const,
    };
  } catch (error) {
    return handleActionError(error);
  }
}