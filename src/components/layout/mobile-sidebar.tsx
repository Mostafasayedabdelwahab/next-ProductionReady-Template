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
                <div className="p-4 border-b bg-linear-to-b from-primary/5 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                        <SheetTitle className="text-left font-bold text-xl tracking-tight">
                            {/* Logo Section */}
                            <div className="flex items-center gap-3">
                                {settings.logoUrl ? (
                                    <div className="relative h-10 w-10 overflow-hidden rounded-xl border bg-background p-1 shadow-sm">
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
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                                    {siteName}
                                </span>
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

                        return (
                            <SheetClose asChild key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {Icon && (
                                        <Icon
                                            className={cn(
                                                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                                                isActive
                                                    ? "text-primary-foreground"
                                                    : "text-muted-foreground/70 group-hover:text-primary"
                                            )}
                                        />
                                    )}
                                    <span className="flex-1">{item.title}</span>
                                    {isActive && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50" />
                                    )}
                                </Link>
                            </SheetClose>
                        );
                    })}
                </nav>

                {/* 3. Bottom Utility Area */}
                <div className="p-2 mt-auto border-t bg-muted/30">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-background border shadow-sm">
                        <div className="flex items-center gap-1">
                            <LanguageSwitcher />
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <ThemeToggle />
                    </div>

                    <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold">
                        © 2026 {siteName}
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}