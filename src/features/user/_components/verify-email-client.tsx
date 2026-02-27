"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getErrorMessage } from "@/lib/constants/errors";
import { ActionResponse } from "../user.types";
import { showError, showSuccess } from "@/lib/toast";

type Props = {
    verifyEmailAction: (token: string) => Promise<ActionResponse>;
};

export default function VerifyEmailClient({ verifyEmailAction }: Props) {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );

    // Prevent duplicate requests in React strict mode
    const hasCalled = useRef(false);

    useEffect(() => {
        if (!token) return;
        if (hasCalled.current) return;

        async function verify() {
            hasCalled.current = true;

            const result = await verifyEmailAction(token!);

            if (result.success) {
                setStatus("success");

                // Show success toast
                showSuccess("Email verified successfully.");

                // Redirect after short delay
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                setStatus("error");

                // Show translated error
                showError(getErrorMessage(result.code));
            }
        }

        verify();
    }, [token, router, verifyEmailAction]);

    // Guard: invalid or missing token
    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                    <p className="text-red-600 font-medium">
                        Invalid or missing verification link.
                    </p>
                    <button
                        onClick={() => router.push("/login")}
                        className="mt-4 text-sm text-gray-500 underline"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
                {status === "loading" && (
                    <div className="space-y-4">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                        <p className="text-gray-600 font-medium">
                            Verifying your email...
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <p className="text-green-600 font-bold text-lg">
                            Email verified successfully.
                        </p>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <svg
                                className="h-6 w-6 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <p className="text-red-600 font-bold">
                            Verification failed.
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
