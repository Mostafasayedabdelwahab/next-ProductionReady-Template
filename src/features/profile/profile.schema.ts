import { z } from "zod";

/**
 * Schema for creating profile
 * (usually called once)
 */
export const createProfileSchema = z.object({
    userId: z.string().min(1),
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    address: z.string().optional(),
    image: z.string().url().optional(),
});

/**
 * Schema for updating profile
 */

export const updateProfileSchema = z.object({
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
});


export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );
