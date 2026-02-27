"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getErrorMessage } from "@/lib/constants/errors";
import { ActionResponse, VerificationStatusData } from "../user.types";
import { showError, showSuccess } from "@/lib/toast";

type Props = {
    resendVerificationAction: (
        email: string
    ) => Promise<ActionResponse>;

    checkVerificationStatusAction: (
        email: string
    ) => Promise<ActionResponse<VerificationStatusData>>;
};

export default function VerifyEmailInfoClient({
    resendVerificationAction,
    checkVerificationStatusAction,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    // Guard: missing email in query
    useEffect(() => {
        if (!email) {
            showError("Session expired. Please register again.");
        }
    }, [email]);

    

    /**
     * Polling to check verification status every 3 seconds
     */
    useEffect(() => {
        if (!email) return;

        const interval = setInterval(async () => {
            const result = await checkVerificationStatusAction(email);

            if (result.success && result.data?.isVerified) {
                clearInterval(interval);
                router.push("/login?verified=true");
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [checkVerificationStatusAction, email, router]);


    /**
     * Resend verification email
     */
    async function handleResend() {
        if (!email) {
            showError("Session expired. Please register again.");
            return;
        }


        try {
            setLoading(true);

            const result = await resendVerificationAction(email);

            if (!result.success) {
                showError(getErrorMessage(result.code));
                return;
            }

            showSuccess(
                "A new verification email has been sent to your inbox."
            );
        } finally {
            setLoading(false);
        }
    }


    if (!email) return null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center space-y-6">
                {/* Email icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <svg
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Verify your email
                    </h1>
                    <p className="text-gray-600">
                        We’ve sent a verification link to{" "}
                        <span className="font-semibold text-black">
                            {email || "your email"}
                        </span>
                        .
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">
                        Didn&apos;t get the email?
                    </p>

                    <button
                        onClick={handleResend}
                        disabled={loading}
                        className="text-sm font-bold text-black hover:underline disabled:opacity-50 transition"
                    >
                        {loading ? "Sending..." : "Resend verification email"}
                    </button>
                </div>

                <button
                    onClick={() => router.push("/login")}
                    className="block w-full text-xs text-gray-400 hover:text-gray-600"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
