"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getErrorMessage } from "@/lib/constants/errors";
import {
    ActionResponse,
    ResetPasswordFormInput,
    ResetPasswordInput,
} from "@/features/user/user.types";
import { resetPasswordFromSchema } from "@/features/user/user.schema";
import { showError, showSuccess } from "@/lib/toast";

type Props = {
    resetPasswordAction: (
        data: ResetPasswordInput
    ) => Promise<ActionResponse<void>>;
};

export default function ResetPasswordClient({
    resetPasswordAction,
}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormInput>({
        resolver: zodResolver(resetPasswordFromSchema),
    });

    /**
     * Handle reset password submission
     */
    async function onSubmit(data: ResetPasswordFormInput) {
        if (!token) return;

        const payload: ResetPasswordInput = {
            token ,
            password: data.password,
        };

        const result = await resetPasswordAction(payload);

        // Failure case
        if (!result.success) {
            showError(getErrorMessage(result.code));
            return;
        }



        // Success case
        showSuccess("Password updated successfully.");
        router.push("/login?reset=success");
    }

    // Guard: missing token
    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                    <p className="text-red-600 font-medium">
                        Missing security token.
                    </p>
                    <button
                        onClick={() => router.push("/forgot-password")}
                        className="mt-4 text-sm underline"
                    >
                        Request new link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Set new password
                    </h1>
                    <p className="text-sm text-gray-500">
                        Must be at least 8 characters long.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            New Password
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

                    {/* Confirm password */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Confirm New Password
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Updating..." : "Reset password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
