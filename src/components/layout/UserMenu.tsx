"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n/translation-provider";
import { Role } from "@/generated/prisma/enums";

interface UserMenuProps {
    user: {
        name?: string | null;
        email?: string | null;
        role?: Role;
    };
    image?: string | null;
}

export default function UserMenu({ user, image }: UserMenuProps) {

    const { dict, locale } = useTranslation();

    const initial = user.name?.charAt(0).toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-200">
                    {image ? (
                        <Image
                            src={image}
                            alt="Avatar"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center font-semibold text-gray-600">
                            {initial}
                        </div>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end" className="w-80">
                <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div dir={locale === "ar" ? "rtl" : "ltr"}>
                <DropdownMenuItem asChild>
                    <Link href={`/${locale}/profile`}>{dict.profile.title}</Link>
                </DropdownMenuItem>

                    {(user.role === "ADMIN" || user.role === "EDITOR") && (
                        <DropdownMenuItem asChild>
                            <Link href={`/${locale}/dashboard`}>
                                {dict.dashboard.title}
                            </Link>
                        </DropdownMenuItem>
                    )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-red-600"
                >
                    {dict.auth.logout.label}
                </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}