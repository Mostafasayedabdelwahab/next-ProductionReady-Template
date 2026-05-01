import { getSiteSettingsAction, } from "@/features/site-settings";
import { Languages } from "@/config/enums";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { requireAdmin } from "@/guards";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Metadata } from "next";
import { Media } from "@/types/upload.type";
import SiteSettingsForm from "@/features/site-settings/_components/site-settings-form";

export const metadata: Metadata = {
    title: "Site Settings",
};

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // 1. Double-check Authorization before doing anything
    await requireAdmin();

    // 2. Fetch data via the action
    const [dict, result] = await Promise.all([
        getDictionary(locale as Languages),
        getSiteSettingsAction()
    ]);

    function fromPrismaJson<T>(value: unknown): T | null {
        if (!value) return null;
        return value as T;
    }

    // 3. Handle data fetching errors
    if (result.success === false) {
        return (
            <section className="p-4 text-destructive bg-destructive/10 rounded-md">
                {getErrorMessage((result.code as keyof typeof ERROR_CODES) || ERROR_CODES.SERVER_ERROR, dict)}
            </section>
        );
    }

    const settings = result.data;
    const formDefaults = {
        ...settings,
        logoUrl: fromPrismaJson<Media>(settings.logoUrl),
        faviconUrl: fromPrismaJson<Media>(settings.faviconUrl),
        ogImageUrl: fromPrismaJson<Media>(settings.ogImageUrl),
    };
    return (
        <section className="space-y-2">
            {/* Pass current settings to the form */}
            <SiteSettingsForm defaultValues={formDefaults} />
        </section>
    );
}