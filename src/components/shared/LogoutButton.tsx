"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export function LogoutButton() {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        await signOut({ callbackUrl: "/login" });
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
        >
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
}
