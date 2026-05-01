"use client";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";


import { Sidebar } from "./sidebar";
import type { SiteSettingsEntity } from "@/features/site-settings";
import { useTranslation } from "@/i18n/translation-provider";

type Props = {
    settings: SiteSettingsEntity;
};

export default function MobileSidebar({ settings }: Props) {
    const { locale } = useTranslation();
    const isAr = locale === "ar";
    const CloseIcon = isAr ? PanelRightClose : PanelLeftClose;
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

                {/* Reusing the same Sidebar component */}
                <Sidebar settings={settings} />
            </SheetContent>
        </Sheet>
    );
}