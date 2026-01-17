"use client";

import { useState } from "react";

export default function VerifyEmailInfoPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleResend() {
        setLoading(true);
        setMessage("");
        setError("");

        const email = localStorage.getItem("email");

        if (!email) {
            setError("Missing email. Please login again.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                // 👈 cooldown أو أي error
                setError(data.message || "Something went wrong");
                return;
            }

            setMessage(
                data.message ||
                "If your account exists, a new verification email has been sent."
            );
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow text-center space-y-4">
                <h1 className="text-2xl font-bold">
                    Verify your email
                </h1>

                <p className="text-gray-600">
                    We’ve sent a verification link to your email address.
                </p>

                <p className="text-sm text-gray-500">
                    Please check your inbox (and spam folder) and click the link to activate your account.
                </p>

                <p className="text-xs text-gray-400">
                    You won’t be able to login until your email is verified.
                </p>

                {error && (
                    <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-600">
                        {message}
                    </p>
                )}

                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
                >
                    {loading
                        ? "Sending..."
                        : "Resend verification email"}
                </button>
            </div>
        </div>
    );
}
