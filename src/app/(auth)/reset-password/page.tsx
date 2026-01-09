"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/reset-password", {
            
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Something went wrong");
            setLoading(false);
            return;
        }

        router.push("/login");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg"
            >
                <h1 className="text-center text-2xl font-bold">
                    Reset your password
                </h1>

                {error && (
                    <p className="rounded bg-red-50 p-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <input
                    type="password"
                    placeholder="New password"
                    className="w-full rounded border px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full rounded border px-3 py-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="w-full rounded bg-black py-2 text-white"
                >
                    {loading ? "Saving..." : "Reset password"}
                </button>
            </form>
        </div>
    );
}
