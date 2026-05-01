// src/app/[locale]/(public)/reset-password/page.tsx

import { Languages } from "@/config/enums";
import ResetPasswordForm from "@/features/user/_components/resetPassword-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { createPageMetadata } from "@/lib/page-metadata";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    const [dict, settings] = await Promise.all([
        getDictionary(locale as Languages),
        getCachedSiteSettings(),
    ]);

    const baseUrl =
        settings.domainUrl?.replace(/\/$/, "") || "https://example.com";

    const metadata = createPageMetadata(baseUrl, locale, "/reset-password");

    return {
        ...metadata,
        title: dict.auth.resetPassword.title,
    };
}

export default async function ResetPasswordPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ token?: string }>;
}) {
    const { locale } = await params;
    const { token } = await searchParams;

    const dict = await getDictionary(locale as Languages);

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 border rounded-xl p-8 bg-card shadow-sm">

                {/* Server-rendered header */}
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {dict.auth.resetPassword.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {dict.auth.resetPassword.description}
                    </p>
                </div>

                {/* Pass token to client */}
                <ResetPasswordForm token={token ?? null} />

            </div>
        </div>
    );
}