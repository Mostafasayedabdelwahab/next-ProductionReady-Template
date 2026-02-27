import { z } from "zod";
import * as userSchema from "./user.schema";

/* ========= Roles ========= */

export type UserRole = "USER" | "ADMIN";

/* ========= Auth ========= */

export type LoginInput = z.infer<typeof userSchema.loginSchema>;

/* ========= Register ========= */

// Frontend form
export type RegisterFormInput = z.infer<typeof userSchema.registerFormSchema>;

// Backend API
export type CreateUserInput = z.infer<typeof userSchema.registerApiSchema>;

/* ========= Forgot / Reset Password ========= */

export type ForgotPasswordInput = z.infer<
  typeof userSchema.forgotPasswordSchema
>;

// Frontend form
export type ResetPasswordFormInput = z.infer<
  typeof userSchema.resetPasswordFromSchema
>;

// Backend API
export type ResetPasswordInput = z.infer<
  typeof userSchema.resetPasswordApiSchema
>;

/* ========= User ========= */

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  role: UserRole;
}

/* ========= Action Response ========= */

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

/* ========= Verification ========= */

export type VerificationStatusData = {
  isVerified: boolean;
};
