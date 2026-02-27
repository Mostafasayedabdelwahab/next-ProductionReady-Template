"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/user/user.schema";
import type {
    LoginInput,
    ActionResponse,
} from "@/features/user/user.types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { getErrorMessage } from "@/lib/constants/errors";
import { showError, showSuccess } from "@/lib/toast";

type Props = {
    resendVerificationAction: (
        email: string
    ) => Promise<ActionResponse<void>>;
};

export default function LoginClient({
    resendVerificationAction,
}: Props) {
    const router = useRouter();

    const [needsVerification, setNeedsVerification] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    /**
     * Handle login submit
     */
    async function onSubmit(data: LoginInput) {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        // Email not verified case
        if (result?.error === "EMAIL_NOT_VERIFIED") {
            setNeedsVerification(true);
            showError("Please verify your email before logging in.");
            return;
        }

        // Generic auth error
        if (result?.error) {
            showError(getErrorMessage(result.error));
            return;
        }

        // Successful login
        showSuccess("Logged in successfully.");
        router.push("/profile");
        router.refresh();
    }

    /**
     * Resend verification email
     */
    async function handleResendVerification() {
        const email = getValues("email");

        if (!email) {
            showError("Please enter your email address first.");
            return;
        }

        try {
            setIsResending(true);

            const res = await resendVerificationAction(email);

            if (!res.success) {
                showError(getErrorMessage(res.code));
                return;
            }

            showSuccess(
                "Verification email sent! Please check your inbox."
            );
            setNeedsVerification(false);
        } finally {
            setIsResending(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="you@example.com"
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${errors.email
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:border-black focus:ring-gray-200"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-gray-400 hover:text-black"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            type="password"
                            {...register("password")}
                            placeholder="••••••••"
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${errors.password
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:border-black focus:ring-gray-200"
                                }`}
                        />

                        {errors.password && (
                            <p className="text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Resend verification button (shown only when needed) */}
                    {needsVerification && (
                        <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="text-left text-sm font-bold underline hover:text-black disabled:opacity-50"
                        >
                            {isResending
                                ? "Sending..."
                                : "Resend verification link?"}
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-black hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
