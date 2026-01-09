"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("SUBMIT FIRED"); // 👈

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong form page");
                return;
            }

            setMessage(
                "If this email exists, a reset link has been sent."
            );
        } catch {
            setError("Something went wrong form catch page");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Forgot your password?
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter your email to reset it
                    </p>
                </div>

                {message && (
                    <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-600">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                    {loading ? "Sending..." : "Send reset link"}
                </button>
            </form>
        </div>
    );
}
