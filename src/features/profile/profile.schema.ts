import { z } from "zod";

import { ERROR_CODES } from "@/config/errors";
import { mediaSchema, optionalString, phoneSchema, requireString, strongPasswordSchema } from "@/schemas";

// ================= CREATE =================

export const createProfileSchema = z.object({
  userId: z.string().min(1),
  name: requireString,
  phone: phoneSchema,
  address: optionalString,
  image: mediaSchema.optional().nullable(),
});

// ================= UPDATE =================
export const updateProfileSchema = z.object({
  name: requireString,
  phone: phoneSchema,
  address: optionalString,
  image: mediaSchema.optional().nullable(),
});

// ================= PASSWORD =================
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, ERROR_CODES.INPUT_Required),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: ERROR_CODES.Passwords_Not_Match,
    path: ["confirmPassword"],
  });
