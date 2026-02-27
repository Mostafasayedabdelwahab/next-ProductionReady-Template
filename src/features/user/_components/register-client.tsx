"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { registerFormSchema } from "@/features/user/user.schema";
import type {
    RegisterFormInput,
    ActionResponse,
    SafeUser,
} from "@/features/user/user.types";
import { getErrorMessage } from "@/lib/constants/errors";
import { showError, showSuccess } from "@/lib/toast";

type Props = {
    registerAction: (
        data: RegisterFormInput
    ) => Promise<ActionResponse<SafeUser>>;
};

export default function RegisterClient({ registerAction }: Props) {
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInput>({
        resolver: zodResolver(registerFormSchema),
    });

    /**
     * Handle register form submission
     */
    async function onSubmit(data: RegisterFormInput) {
        const result = await registerAction(data);

        // Handle failure
        if (!result.success) {
            showError(getErrorMessage(result.code));
            return;
        }

        showSuccess("Account created successfully. Please verify your email.");
        setSuccess(true);

        // Redirect to verification info page
        router.push(
            `/verify-email-info?email=${encodeURIComponent(data.email)}`
        );    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-500">Sign up to get started</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            {...register("name")}
                            placeholder="John Doe"
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${errors.name
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:border-black focus:ring-gray-200"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Email Address
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

                    {/* Password row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
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

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Confirm
                            </label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${errors.confirmPassword
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-black focus:ring-gray-200"
                                    }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || success}
                        className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400 mt-2"
                    >
                        {isSubmitting ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-black hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
