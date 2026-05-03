// app/(admin)/layout.tsx
import type { Metadata } from "next";
import { requireEditor } from "@/guards";
import { getMediaUrl } from "@/utils/media";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { getLocalizedValue } from "@/i18n/localization-helper";
import { getDictionary } from "@/i18n/get-dictionary";
import { Languages } from "@/config/enums";

import Container from "@/components/layout/container";
import { cn } from "@/utils/utils";

import ThemeToggle from "@/components/shared/theme-toggle";
import LanguageSwitcher from "@/components/shared/language-switcher";
import UserMenu from "@/components/layout/UserMenu";
import { Role } from "@/generated/prisma/enums";
import { Sidebar } from "@/features/dashboard/_components/sidebar";
import MobileSidebar from "@/features/dashboard/_components/mobile-sidebar";


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

    const { locale } = await params;
    const [user, dict, settings] = await Promise.all([
        requireEditor(),
        getDictionary(locale as Languages),
        getCachedSiteSettings(),
    ]);


    const isAr = locale === "ar";
    const nav = dict.dashboard;
    return (
        /* 1. Dynamic direction handling using dir attribute */
        <>
            {/* 2. Sidebar positioning: fixed inset-y-0 is fine, but we handle border and positioning */}
            <aside className={cn(
                "hidden md:flex h-full w-56 flex-col transition-all border-r shrink-0 fixed inset-y-0 z-50 bg-background",
                isAr ? "right-0 border-l" : "left-0 border-r"
            )}>
                <Sidebar settings={settings} />
            </aside>

            {/* 3. Main content padding: flip pl-64 to pr-64 based on locale */}
            <main className={`flex flex-1 flex-col ${isAr ? "md:pr-56" : "md:pl-56"}`}>

                <header className="sticky top-0 z-30 flex items-center justify-between h-14 bg-background/60 backdrop-blur-md border-b shrink-0 transition-all">
                    {/* LEFT - Navigation & Breadcrumb/Title*/}
                    <div className="flex items-center gap-3">
                        <nav aria-label="Mobile Navigation">
                            <MobileSidebar/>
                        </nav>

                        <span className="text-sm font-bold tracking-tight md:text-lg select-none" role="status">
                            {nav.title}
                        </span>
                    </div>

                    {/* RIGHT - User Profile & Controls */}
                    <div className="flex items-center gap-4">
                        {/* User Info - Hidden on very small screens */}
                        <section className="hidden sm:flex flex-col items-end leading-none gap-0.5" aria-label="User Information">
                            <span className="text-sm font-semibold">{user.name || "Admin"}</span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{user.email}</span>
                        </section>

                        {/* Action Buttons Group */}
                        <div className="flex items-center gap-2 border-l pl-2 dark:border-border/40">
                            <UserMenu user={{
                                name: user.name,
                                email: user.email,
                                role: user.role as Role,
                            }} image={user.image} />

                            {/* Controls Wrapper */}
                            <div className="flex items-center gap-1">
                                <ThemeToggle />
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                </header>

                <section id="main-content" className="flex-1  py-2 animate-page-fade">
                    <Container>
                        {children}
                    </Container>
                </section>
            </main>
        </>
    );
}

