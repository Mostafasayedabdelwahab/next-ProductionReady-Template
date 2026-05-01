"use client";

import type { ThemeMode } from "@/generated/prisma/enums";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

type Props = {
    children: React.ReactNode;
    defaultTheme: ThemeMode;
};

export default function Providers({ children, defaultTheme }: Props) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme={defaultTheme}
                enableSystem
            >
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}