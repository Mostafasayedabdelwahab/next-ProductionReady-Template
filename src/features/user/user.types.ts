import { z } from "zod";
import {
    registerFormSchema, loginSchema, forgotPasswordSchema, resetPasswordFromSchema,
} from "./user.schema";



export type LoginInput = z.infer<typeof loginSchema>;

export type CreateUserInput = z.infer<typeof registerFormSchema>;

export type RegisterFormInput = CreateUserInput & { confirmPassword: string; };

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput = z.infer<typeof resetPasswordFromSchema>;