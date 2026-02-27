import { z } from "zod";

export const registerFormSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 chars"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });



export const registerApiSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
});



export const loginSchema = z.object({
  email: z.string().email("Invalid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});


export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),
});

export const resetPasswordFromSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });




export const resetPasswordApiSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(6, "Password must be at least 6 characters"),
});