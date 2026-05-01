// src/app/[locale]/(public)/forgot-password/page.tsx

import { Languages } from "@/config/enums";
import ForgotPasswordForm from "@/features/user/_components/forgotPassword-form";
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

    const metadata = createPageMetadata(baseUrl, locale, "/forgot-password");

    return {
        ...metadata,
        title: dict.auth.forgotPassword.title,
    };
}

export default async function ForgotPasswordPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const dict = await getDictionary(locale as Languages);

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 border rounded-xl p-8 bg-card shadow-sm">

                {/* Server-rendered header */}
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {dict.auth.forgotPassword.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {dict.auth.forgotPassword.description}
                    </p>
                </div>

                {/* Client form */}
                <ForgotPasswordForm />

            </div>
        </div>
    );
}