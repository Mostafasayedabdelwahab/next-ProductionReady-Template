"use client";
import { LayoutDashboard, Menu, PanelLeftClose, PanelRightClose, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { useTranslation } from "@/i18n/translation-provider";
import Link from "next/link";
import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";


export default function MobileSidebar() {
    const { locale, dict } = useTranslation();
    const isAr = locale === "ar";
    const CloseIcon = isAr ? PanelRightClose : PanelLeftClose;
    const pathname = usePathname();

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
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>

            {/* Change side based on locale: RTL uses right, LTR uses left */}
            <SheetContent
                side={isAr ? "right" : "left"}
                className="w-64 p-0 border-none overflow-hidden"
                dir={isAr ? "rtl" : "ltr"}
                showCloseButton={false}
            >
                <SheetTitle className="sr-only">
                    Navigation Menu
                </SheetTitle>

                <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"} z-50`}>
                    <SheetClose className="flex items-center justify-center p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors outline-none">
                        <CloseIcon className="h-5 w-5" />
                    </SheetClose>
                </div>

                {/* NAV */}
                <nav className="flex-1 overflow-y-auto px-4 py-4">
                    <ul className="space-y-2">
                        {sections.map((section) => {
                            const isActive = pathname === section.href;
                            return (
                                <li key={section.id}>
                                    <Link
                                        href={section.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <section.icon className="h-5 w-5" />
                                        <span>{section.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
}