// app/(admin)/layout.tsx
import type { Metadata } from "next";
import { DashboardShell } from "@/features/dashboard/_components/dashboard-shell";
import { requireUser } from "@/guards";
import { getMediaUrl } from "@/utils/media";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { getLocalizedValue } from "@/i18n/localization-helper";
import { getDictionary } from "@/i18n/get-dictionary";
import { Languages } from "@/config/enums";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {

    const settings = await getCachedSiteSettings();
    const { locale } = await params;
    const localized = {
        siteName: getLocalizedValue(settings.siteNameAr, settings.siteNameEn, locale),
        siteDescription: getLocalizedValue(
            settings.siteDescriptionAr,
            settings.siteDescriptionEn,
            locale
        ),
        siteTitle: getLocalizedValue(settings.siteTitleAr, settings.siteTitleEn, locale),
    };
    const siteName = localized.siteName;
    const siteDescription = localized.siteDescription;
    const siteTitle = localized.siteTitle;

    const brandName = siteName || "Nexus Solutions";
    const tagline = siteTitle || "Modern Business Solutions";

    const description =
        siteDescription ||
        `${tagline}. Professional digital solutions tailored to grow your business.`;

    return {
        robots: {
            index: false,
            follow: false,
        },
        metadataBase: new URL(settings.domainUrl || "https://example.com"),

        title: {
            default: brandName,
            template: `%s | ${brandName}`,
        },

        description,

        icons: {
            icon: getMediaUrl(settings.faviconUrl) || "/glope.svg",
        },
    };
}

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
    // 1. Authentication & Active Status Check
    // This replaces manual redirect logic and ensures data integrity
    const user = await requireUser();

    const settings = await getCachedSiteSettings();

    const { locale } = await params;
    const dict = await getDictionary(locale as Languages);
    return (
        <DashboardShell user={user} locale={locale} dict={dict} settings={settings}>
            {children}
        </DashboardShell>
    );
}

