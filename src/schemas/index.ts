// src/lib/validation.ts

import { z } from "zod";
import { ERROR_CODES } from "@/config/errors";

export const requireString = z
  .string()
  .min(1, ERROR_CODES.INPUT_Required)
  .min(2, ERROR_CODES.FIELD_TOO_SHORT)
  .max(50, ERROR_CODES.FIELD_TOO_LONG);
// Optional string (accepts "", null, undefined)
export const optionalString = z
  .string()
  .trim()
  .optional()
  .nullable()
  .or(z.literal(""));

// Optional URL
export const optionalUrl = z
  .string()
  .trim()
  .url(ERROR_CODES.INVALID_URL)
  .optional()
  .nullable()
  .or(z.literal(""));

// Social URL validator
export const socialUrl = (domains: string[]) =>
  z
    .string()
    .trim()
    .url(ERROR_CODES.INVALID_URL)
    .refine((url) => domains.some((d) => url.includes(d)), {
      message: `${ERROR_CODES.INVALID_DOMAIN}:${domains.join(", ")}`,
    })
    .optional()
    .nullable()
    .or(z.literal(""));

// Phone
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^01[0125][0-9]{8}$/, ERROR_CODES.INVALID_PHONE)
  .optional()
  .nullable()
  .or(z.literal(""));

// Keywords
export const keywordsSchema = z
  .string()
  .max(300, ERROR_CODES.FIELD_TOO_LONG)
  .optional()
  .nullable()
  .or(z.literal(""));

// Hex Color
const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const hexColor = z
  .string()
  .trim()
  .regex(hexColorRegex, ERROR_CODES.INVALID_COLOR)
  .optional()
  .nullable()
  .or(z.literal(""));

export const strongPasswordSchema = z
  .string()
  .min(1, ERROR_CODES.INPUT_Required)
  .min(8, ERROR_CODES.INVALID_PASSWORD_FORMAT)
  .regex(/[a-z]/, ERROR_CODES.PASSWORD_LOWERCASE)
  .regex(/[A-Z]/, ERROR_CODES.PASSWORD_UPPERCASE)
  .regex(/[0-9]/, ERROR_CODES.PASSWORD_NUMBER)
  .regex(/[^a-zA-Z0-9]/, ERROR_CODES.PASSWORD_SPECIAL);

export const mediaSchema = z
  .object({
    url: z.string(),
    public_id: z.string(),
    resource_type: z.enum(["image", "video"]),
  })
  .nullable()
  .optional();