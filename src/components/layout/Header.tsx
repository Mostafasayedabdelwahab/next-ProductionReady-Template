import Image from "next/image";
import ThemeToggle from "../shared/theme-toggle";
import Link from "next/link";
import LanguageSwitcher from "../shared/language-switcher";
import { getLocalizedValue } from "@/i18n/localization-helper";
import Container from "./container";
import MobileSidebar from "./mobile-sidebar";
import { getPublicNavigation } from "./public-navigation";
import HeaderClient from "./HeaderClient";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { SiteSettingsEntity } from "@/features/site-settings";
import { getMediaUrl } from "@/utils/media";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserMenu from "./UserMenu";
import { getDictionary } from "@/i18n/get-dictionary";
import { Languages } from "@/config/enums";
import { Button } from "../ui/button";
import { Role } from "@/generated/prisma/enums";

// components/layout/Header.tsx
export default async function Header({ locale }: { locale: string }) {
    const dict = await getDictionary(locale as Languages);
    const session = await getServerSession(authOptions);
    const [navigation, settings] = await Promise.all([
        getPublicNavigation(locale),
        getCachedSiteSettings()
    ]);

    const siteName = getLocalizedValue(settings.siteNameAr, settings.siteNameEn, locale);

    return (<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md support-[backdrop-filter]:bg-background/60">
        <Container>
            <div className="grid grid-cols-3 h-16 items-center">

                {/* 1. Left: Logo Section */}
                <div className="flex justify-start">
                    <Link href={`/${locale}`} className="flex items-center gap-2 group transition-transform active:scale-95">
                        <div className="relative h-15 w-15 overflow-hidden">
                            {settings.logoUrl ? (
                                <Image
                                    src={getMediaUrl(settings.logoUrl) || "./glope.svg"}
                                    alt={siteName}
                                    width={50}
                                    height={50}
                                    className="object-cover rounded-full"
                                />
                            ) : (
                                <span className="text-primary font-black text-xl">{siteName?.charAt(0)}</span>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="flex justify-end lg:justify-center items-center">
                    <HeaderClient navigation={navigation} locale={locale} />
                </div>

                {/* 3. Right: Actions Section */}
                <div className="flex items-center justify-end gap-2">
                    <div className="hidden sm:flex items-center lg:gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    {session?.user ? (
                        <UserMenu user={{
                            name: session.user.name,
                            email: session.user.email,
                            role: session.user.role as Role,
                        }} image={session.user.image} />
                    ) : (
                        <div className="flex items-center gap-2">
                                <Button asChild size="sm" className="hidden md:flex rounded-full">
                                <Link  href={`/${locale}/login`}>{dict.auth.login.submit}</Link>
                            </Button>
                                <Button variant="outline" asChild size="sm" className="rounded-full">
                                <Link href={`/${locale}/register`}>{dict.auth.register.submit}</Link>
                            </Button>
                        </div>
                    )}

                    <MobileSidebar settings={settings as SiteSettingsEntity} navigation={navigation} />
                </div>

            </div>
        </Container>
    </header>
    );
}