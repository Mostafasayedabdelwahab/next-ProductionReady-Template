"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { Languages as LangEnum } from "@/config/enums";
import { useTranslation } from "@/i18n/translation-provider";

export default function LanguageSwitcher() {
    const { locale } = useTranslation();

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const toggleLanguage = () => {
        const newLocale = locale === LangEnum.ARABIC ? LangEnum.ENGLISH : LangEnum.ARABIC;
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
        const segments = pathname.split("/");

        segments[1] = newLocale;
        let newPathname = segments.join("/");

        const currentParams = searchParams.toString();
        if (currentParams) {
            newPathname += `?${currentParams}`;
        }

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                router.push(newPathname);
            });
        } else {
            router.push(newPathname);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
        >
            <Languages className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
                {locale === LangEnum.ARABIC ? "English" : "العربية"}
            </span>
        </Button>
    );
}