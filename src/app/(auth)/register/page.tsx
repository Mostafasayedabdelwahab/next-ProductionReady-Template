"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerFormSchema } from "@/features/user/user.schema";
import type { RegisterFormInput } from "@/features/user/user.types";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInput>({
        resolver: zodResolver(registerFormSchema),
    });

    async function onSubmit(data: RegisterFormInput) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword: _confirmPassword, ...payload } = data;
        setServerError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok) {
            setServerError(result.message || "Something went wrong");
            return;
        }

        // بعد التسجيل نوديه على login
        router.push("/login");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-500">
                        Sign up to get started
                    </p>
                </div>

                {/* Server error */}
                {serverError && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                {/* Name */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        {...register("name")}
                        placeholder="Your name"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        
                        {...register("email")}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="••••••••"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                {/* confirm Password */}
                <div>
                    <label className="text-sm">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full rounded border px-3 py-2"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>


                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                    {isSubmitting ? "Creating account..." : "Register"}
                </button>
            <p className="text-sm text-gray-500">
                Already have an account? <Link href="/login">Login</Link>
            </p>
            </form>
        </div>
    );
}
