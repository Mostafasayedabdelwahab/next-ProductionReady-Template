"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/user/user.schema";

import type { LoginInput } from "@/features/user/user.types";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";
import Link from "next/link";



export default function LoginPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginInput) {
        setServerError("");

        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setServerError("Invalid email or password");
            return;
        }

        router.push("/profile");
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
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500">
                        Sign in to your account
                    </p>
                </div>

                {/* Server error */}
                {serverError && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                        placeholder="you@example.com"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="">
                    <label className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        {...register("password")}
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>


                <Link
                    href="/forgot-password"
                    className="text-sm text-gray-500 hover:underline "
                >
                    Forgot your password?
                </Link>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg mt-1.5 bg-black py-2 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                    {isSubmitting ? "Signing in..." : "Login"}
                </button>
                <p className="text-sm text-gray-500">
                    Don&apos;t have an account? <Link href="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}
