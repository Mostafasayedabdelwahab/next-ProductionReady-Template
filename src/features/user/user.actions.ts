"use server";

import { requireAuthUser } from "@/guards";
import {
  registerUser,
  resendVerificationEmail,
  forgotPassword,
} from "./user.service";

import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Register
 */
export async function registerAction(input: unknown) {
  try {
    const user = await registerUser(input);

    return {
      message: "Account created. Please verify your email.",
      userId: user.id,
    };
  } catch (error) {
    handleError(error);
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationAction() {
  const user = await requireAuthUser();

  await resendVerificationEmail(user.email);
  return {
    message: "If an account exists, a verification email has been sent.",
  };
}

/**
 * Forgot password
 */
export async function forgotPasswordAction(email: string) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    throw new Error("You are already logged in");
  }

  try {
    await forgotPassword(email);

    return {
      message: "If the email exists, a reset link was sent",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong");
  }
}

/**
 * Shared error handler
 */
function handleError(error: unknown): never {
  if (error instanceof ZodError) {
    throw new Error(error.issues[0].message);
  }

  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error("Something went wrong");
}
