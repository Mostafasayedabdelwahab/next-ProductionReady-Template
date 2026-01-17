"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailClient() {
    const token = useSearchParams().get("token");
    const [message, setMessage] = useState("Verifying...");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            return;
        }

        fetch("/api/auth/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setMessage(data.message);
                    setTimeout(() => {
                        router.push("/login");
                    }, 1500);
                } else {
                    setError("Verification failed");
                }
            })
            .catch(() => setError("Something went wrong"));
    }, [token, router]);


    // ✅ validation برا الـ effect
    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-600">Invalid verification link</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="rounded bg-white p-6 shadow">
                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <p>{message}</p>
                )}
            </div>
        </div>
    );
}
