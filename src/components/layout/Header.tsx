import Image from "next/image";
import ThemeToggle from "../shared/theme-toggle";
import Link from "next/link";
import LanguageSwitcher from "../shared/language-switcher";
import { cn } from "@/utils/utils";
import { getLocalizedValue } from "@/i18n/localization-helper";
import Container from "./container";
import MobileSidebar from "./mobile-sidebar";
import { getPublicNavigation } from "./public-navigation";
import HeaderClient from "./HeaderClient";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { SiteSettingsEntity } from "@/features/site-settings";
import { getMediaUrl } from "@/utils/media";


export default async function Header({
    locale,
}: {
    locale: string;
}) {

    // 2. Fetch data via the action
    const [navigation, settings] = await Promise.all([
        getPublicNavigation(locale),
        getCachedSiteSettings()
    ]);

    const siteName = getLocalizedValue(
        settings.siteNameAr,
        settings.siteNameEn,
        locale
    );


    return (
        <header className="border-b bg-background sticky top-0 z-50">
            <Container className="flex h-16 items-center justify-between">

                {/* Logo */}
                <Link
                    href={`/${locale}`}
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
                >
                    <div
                        className={cn(
                            "h-10 w-10 flex items-center justify-center transition-all",
                            !settings.logoUrl
                                ? "bg-primary text-primary-foreground rounded-xl shadow-sm font-bold text-xl"
                                : "bg-transparent"
                        )}
                    >
                        {settings.logoUrl ? (
                            <Image
                                src={getMediaUrl(settings.logoUrl) || "./glope.svg"}
                                alt={siteName || "Logo"}
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        ) : (
                            <span>{siteName?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </Link>

                {/* Navigation (Client Part) */}
                <HeaderClient navigation={navigation} />

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <LanguageSwitcher />
                    <div className="md:hidden">
                        <MobileSidebar settings={settings as SiteSettingsEntity} navigation={navigation} />
                    </div>
                    <ThemeToggle />
                </div>

            </Container>
        </header>
    );
}