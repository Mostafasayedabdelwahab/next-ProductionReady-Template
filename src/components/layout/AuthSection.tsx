"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

export default function AuthSection() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />;
    }

    if (!session) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm hover:underline">
                    Login
                </Link>
                <Link
                    href="/register"
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                >
                    Get Started
                </Link>
            </div>
        );
    }

    return <UserMenu user={session.user} />;
}
