import { z } from "zod";

import {
    registerFormSchema,
    registerApiSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordFromSchema,
    resetPasswordApiSchema,
} from "./user.schema";

/* ========= Auth ========= */

export type LoginInput = z.infer<typeof loginSchema>;

/* ========= Register ========= */

// Frontend form
export type RegisterFormInput = z.infer<typeof registerFormSchema>;

// Backend API
export type CreateUserInput = z.infer<typeof registerApiSchema>;

/* ========= Forgot / Reset Password ========= */

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Frontend form
export type ResetPasswordFormInput = z.infer<
    typeof resetPasswordFromSchema
>;

// Backend API
export type ResetPasswordInput = z.infer<
    typeof resetPasswordApiSchema
>;
