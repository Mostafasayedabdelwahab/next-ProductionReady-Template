"use client";

import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";

import { useTranslation } from "@/i18n/translation-provider";
import LanguageSwitcher from "@/components/shared/language-switcher";
import ThemeToggle from "@/components/shared/theme-toggle";
import type { SiteSettingsEntity } from "@/features/site-settings";
import { getLocalizedValue } from "@/i18n/localization-helper";
import Image from "next/image";
import { NavItem } from "./public-navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { ICONS } from "@/config/icons";
import { getMediaUrl } from "@/utils/media";

export default function MobileSidebar({
    settings,
    navigation
}: {
    settings: SiteSettingsEntity;
    navigation: NavItem[];
}) {

    const pathname = usePathname();
    const { locale } = useTranslation();
    const isAr = locale === "ar";
    const siteName = getLocalizedValue(settings.siteNameAr, settings.siteNameEn, locale);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-primary/5 transition-colors"
                >
                    <Menu className="h-6 w-6 text-foreground/80" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side={isAr ? "right" : "left"}
                className="w-75 p-0 flex flex-col border-none shadow-2xl"
                showCloseButton={false}
            >
                {/* 1. Header Area with Glassmorphism */}
                <div className=" p-2 border-b bg-linear-to-b from-primary/5 to-transparent">
                    <div className="flex items-center justify-between gap-2">
                        <SheetTitle className="text-left font-bold text-xl tracking-tight w-full">
                            {/* Logo Section */}
                            <div className="flex items-center justify-between gap-3">
                                {settings.logoUrl ? (
                                    <div className="relative h-15 w-15 overflow-hidden">
                                        <Image
                                            src={getMediaUrl(settings.logoUrl) || "./glope.svg"}
                                            alt={siteName}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20">
                                        {siteName?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <LanguageSwitcher />
                                    </div>
                                    <div className="h-4 w-px bg-border" />
                                    <ThemeToggle />
                                </div>
                            </div>
                        </SheetTitle>

                        <SheetClose className="rounded-full p-2 hover:bg-background shadow-sm transition-all active:scale-95 border">
                            <X className="h-4 w-4" />
                        </SheetClose>
                    </div>
                </div>

                {/* 2. Navigation Area */}
                <nav className="flex-1 px-2 overflow-y-auto space-y-1.5 custom-scrollbar">
                    {navigation.map((item) => {
                        const Icon = ICONS[item.icon as keyof typeof ICONS] || FileText;
                        const isActive = pathname === item.href;
                        const normalize = (path: string) => path.replace(/\/$/, "")
                        const isHome = normalize(item.href) === `/${locale}`;
                        return (
                            <SheetClose asChild key={item.href}>
                                {isHome ? (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="flex-1">{item.title}</span>
                                    </Link>
                                ) : ( 
                                        <button
                                            disabled={true}
                                        type="button"
                                            className="group relative flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200  text-muted-foreground opacity-60 w-full text-start cursor-not-allowed"
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="flex-1">{item.title}</span>
                                    </button>
                                )}
                            </SheetClose>
                        );
                    })}
                </nav>

                {/* 3. Bottom Utility Area */}
                <div className="p-2 mt-auto border-t bg-muted/30">
                    <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold">
                        © 2026 {siteName}
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}