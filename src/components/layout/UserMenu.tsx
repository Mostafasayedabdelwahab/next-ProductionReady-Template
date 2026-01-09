"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserMenuProps {
    user: {
        name?: string | null;
        email?: string | null;
    };
}

export default function UserMenu({ user }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => setImage(data.image))
            .catch(() => { });
    }, []);

    const initial =
        user.name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="h-9 w-9 overflow-hidden rounded-full bg-gray-200"
            >
                {image ? (

                    <Image
                        src={image}
                        alt="Avatar"
                        fill
                        className="h-full rounded-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center font-semibold text-gray-600">
                        {initial}
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg">
                    <div className="border-b px-4 py-3">
                        <p className="text-sm font-medium">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user.email}
                        </p>
                    </div>

                    <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Profile
                    </Link>

                    <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Dashboard
                    </Link>

                    <button
                        onClick={() =>
                            signOut({ callbackUrl: "/login" })
                        }
                        className="w-full border-t px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
