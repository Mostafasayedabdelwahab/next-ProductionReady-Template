import { ERROR_CODES } from "@/config/errors";
import { requireString, strongPasswordSchema } from "@/schemas";
import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: requireString,
    email: z.string().trim().email(ERROR_CODES.INVALID_EMAIL_FORMAT),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, ERROR_CODES.INPUT_Required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: ERROR_CODES.Passwords_Not_Match,
  });

export const registerApiSchema = z.object({
  name: requireString,
  email: z.string().trim().email(ERROR_CODES.INVALID_EMAIL_FORMAT),
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email(ERROR_CODES.INVALID_EMAIL_FORMAT),
  password: z.string().min(1, ERROR_CODES.INPUT_Required),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(ERROR_CODES.INVALID_EMAIL_FORMAT),
});

export const resetPasswordFromSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, ERROR_CODES.INPUT_Required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_CODES.Passwords_Not_Match,
    path: ["confirmPassword"],
  });

export const resetPasswordApiSchema = z.object({
  token: z.string().min(1),
  password: strongPasswordSchema,
});

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, ERROR_CODES.INVALID_TOKEN)
    .max(6, ERROR_CODES.INVALID_TOKEN),
});

export type LoginInput = z.infer<typeof loginSchema>;
