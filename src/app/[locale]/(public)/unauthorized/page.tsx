import type { Languages } from "@/config/enums";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

import Link from "next/link";


export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const settings = await getCachedSiteSettings();
    const baseUrl = settings.domainUrl || "https://example.com";

    const dict = await getDictionary(locale as Languages);
    const title = dict.unauthorized.title;

    const metadata = createPageMetadata(baseUrl, locale, "/unauthorized");

    return {
        ...metadata,
        title,
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function UnauthorizedPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getDictionary(locale as Languages);
    const t = dict.unauthorized;

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 text-center shadow-lg">
                {/* Title */}
                <h1 className="text-2xl font-bold text-destructive">
                    {t.title}
                </h1>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                    {t.description}
                </p>

                {/* Action */}
                <Link
                    href={`/${locale}`}
                    className="inline-block w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    {t.goBack}
                </Link>
            </div>
        </div>
    );
}