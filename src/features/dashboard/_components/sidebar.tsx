"use client";
import Link from "next/link";
import {
    LayoutDashboard,
    Settings,
} from "lucide-react";

import LogoutButton from "@/features/user/_components/logout-button";
import Image from "next/image";
import { cn } from "@/utils/utils";
import { getLocalizedValue } from "@/i18n/localization-helper";
import { getMediaUrl } from "@/utils/media";
import { useTranslation } from "@/i18n/translation-provider";
import { usePathname } from "next/navigation";
import type{ SiteSettingsEntity } from "@/features/site-settings";

interface SidebarProps {
    settings: SiteSettingsEntity;
}

export function Sidebar({ settings }: SidebarProps) {

    const { locale, dict } = useTranslation();
    const pathname = usePathname();
    const siteName = getLocalizedValue(
        settings.siteNameAr,
        settings.siteNameEn,
        locale
    );

    const sections = [
        {
            id: "overview",
            title: dict.dashboard.sidebar.overview,
            href: `/${locale}/dashboard`,
            icon: LayoutDashboard,
        },
        {
            id: "settings",
            title: dict.dashboard.sidebar.settings,
            href: `/${locale}/dashboard/admin/settings`,
            icon: Settings,
        },
    ];

    return (
        <>
            {/* Logo Section */}
            <header className="flex h-14 items-center px-4 border-b shrink-0">
                <Link href={`/${locale}/`} className="flex items-center gap-3 font-bold text-xl tracking-tight text-primary hover:opacity-90 transition-opacity">
                    <div className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center transition-all",
                        !settings.logoUrl ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "bg-transparent"
                    )}>
                        {settings.logoUrl ? (
                            <Image src={getMediaUrl(settings.logoUrl) || "./glope.svg"} alt={siteName} width={36} height={36} className="object-contain" />
                        ) : (
                            <span className="text-sm font-bold uppercase">{siteName.charAt(0)}</span>
                        )}
                    </div>
                    <span className="block max-w-37.5 truncate text-base font-medium">{siteName}</span>
                </Link>
            </header>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                <ul className="space-y-2">
                    {sections.map((section) => {
                        const isActive = pathname === section.href;
                        return (
                            <li key={section.id}>
                                <Link
                                    href={section.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <section.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                                    <span>{section.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer Section */}
            <footer className="border-t shrink-0 p-2">
                <LogoutButton />
            </footer>
        </>
    );
}