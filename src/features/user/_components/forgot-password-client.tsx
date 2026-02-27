"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { getErrorMessage } from "@/lib/constants/errors";
import type {
    ForgotPasswordInput,
    ActionResponse,
} from "@/features/user/user.types";
import { forgotPasswordSchema } from "@/features/user/user.schema";
import { showError, showSuccess } from "@/lib/toast";

type Props = {
    forgotPasswordAction: (
        email: string
    ) => Promise<ActionResponse<void>>;
};

export default function ForgotPasswordClient({
    forgotPasswordAction,
}: Props) {
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    /**
     * Handle forgot password submission
     */
    async function onSubmit(data: ForgotPasswordInput) {
        const result: ActionResponse<void> = await forgotPasswordAction(
            data.email
        );

        // Failure case
        if (!result.success) {
            showError(getErrorMessage(result.code));
            return;
        }

        // Success case
        showSuccess(
            "If this email exists, a reset link has been sent to your inbox."
        );

        setSent(true);
        reset();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Forgot password?
                    </h1>
                    <p className="text-sm text-gray-500">
                        No worries, we&apos;ll send you reset instructions.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email field */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Email address
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

                    <button
                        type="submit"
                        disabled={isSubmitting || sent}
                        className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Sending link..." : "Send reset link"}
                    </button>
                </form>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-gray-500 hover:text-black transition"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
