// src/app//layout.tsx
import "../globals.css";
import { CSSProperties } from "react";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import type { RadiusOption } from "@/generated/prisma/enums";
import { Toaster } from "sonner";
import NextTopLoader from 'nextjs-toploader';
import Providers from "./providers";
import { Languages } from "@/config/enums";
import { getDictionary } from "@/i18n/get-dictionary";
import { TranslationProvider } from "@/i18n/translation-provider";
import { arabicFonts, englishFonts } from "@/config/fonts";
import { cn } from "@/utils/utils";
// map radius → actual css value
const radiusMap: Record<RadiusOption, string> = {
    sharp: "0px",
    medium: "0.5rem",
    rounded: "1rem",
    pill: "9999px",
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }>; }) {

    const { locale } = await params;
    const isAr = locale === Languages.ARABIC;
    const direction = isAr ? "rtl" : "ltr";

    const [dict, settings] = await Promise.all([
        getDictionary(locale as Languages),
        getCachedSiteSettings()
    ]);

    const themeStyle: CSSProperties = {
        "--primary-base": settings.primaryColor ?? "",
        "--secondary-base": settings.secondaryColor ?? "",
        "--accent-base": settings.accentColor ?? "",
        "--background-base": settings.backgroundColor ?? "",
        "--foreground-base": settings.foregroundColor ?? "",
        "--card-base": settings.cardColor ?? "",
        "--border-base": settings.borderColor ?? "",
        "--radius": settings.radius ? radiusMap[settings.radius] : "0.5rem",
    } as CSSProperties;

    const arabicFont = arabicFonts[settings.arabicFont as keyof typeof arabicFonts];
    const englishFont = englishFonts[settings.englishFont as keyof typeof englishFonts];

    const fontClass = locale === "ar"
        ? (arabicFont?.className || "")
        : (englishFont?.className || "");
    
    return (
        <html lang={locale} dir={direction} suppressHydrationWarning style={themeStyle} className={fontClass}>
            <body className={cn("antialiased flex min-h-screen flex-col w-full", fontClass)} suppressHydrationWarning>

                {/* Background orbs */}
                <div className="background-layer hidden dark:block">
                    <div className="orb" style={{ width: 500, height: 500, background: "rgba(88,28,135,0.35)", top: -100, left: "10%", }} />
                    <div className="orb" style={{ width: 420, height: 420, background: "rgba(30,64,175,0.30)", bottom: 0, right: "5%", animationDelay: "2s", }} />
                    <div className="orb" style={{ width: 320, height: 320, background: "rgba(5,150,105,0.22)", top: "35%", left: "60%", animationDelay: "1s", }} />
                </div>

                <Providers defaultTheme={settings.defaultTheme}>
                    <TranslationProvider dict={dict} locale={locale}>
                        <NextTopLoader color="var(--primary-base)" showSpinner={false} height={3} />
                        {children}
                        <Toaster richColors position="top-center" closeButton />
                    </TranslationProvider>
                </Providers>
            </body>
        </html>
    );
}