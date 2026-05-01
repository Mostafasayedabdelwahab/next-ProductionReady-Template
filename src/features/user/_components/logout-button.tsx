"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/utils/utils";
import { useTranslation } from "@/i18n/translation-provider";

export default function LogoutButton() {
    const { dict } = useTranslation();
    const logoutDict = dict.auth.logout;
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: "/login" });
        } catch (error) {
            setIsLoading(false);
            console.error("Logout failed", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={cn(
                "flex w-full items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium transition-all duration-200",
                "text-red-500 hover:bg-red-500/10 active:scale-95 disabled:opacity-50 ",
                isLoading && "cursor-not-allowed"
            )}
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <LogOut className="h-5 w-5" />
            )}
            <span>{isLoading ? logoutDict.loading : logoutDict.label}</span>
        </button>
    );
}