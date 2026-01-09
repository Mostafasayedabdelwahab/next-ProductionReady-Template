import { z } from "zod";

export const registerFormSchema = z
    .object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 chars"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type RegisterFormInput = z.infer<typeof registerFormSchema>;


export const registerApiSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});



export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),
});

export const resetPasswordFromSchema = z
    .object({
        token: z.string().min(1, "Token is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });


export type resetPasswordFormInput = z.infer<typeof resetPasswordFromSchema>;


export const resetPasswordApiSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8),
});