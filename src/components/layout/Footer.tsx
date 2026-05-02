import type { SiteSettingsEntity } from "@/features/site-settings";
import { Mail, Phone, ArrowUpRight, Globe, MessageCircleMore } from "lucide-react";
import SocialLinks from "../shared/social-links";
import Image from "next/image";
import Link from "next/link";
import { getLocalizedValue } from "@/i18n/localization-helper";
import Container from "./container";
import { cn } from "@/utils/utils";
import type { NavItem } from "./public-navigation";
import { getMediaUrl } from "@/utils/media";
import { getDictionary } from "@/i18n/get-dictionary";
import { Languages } from "@/config/enums";


type Props = {
    settings: SiteSettingsEntity;
    navigation: NavItem[];
    locale: string;
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
        <Link
            prefetch={false}
            href={href}
            className="group flex items-center gap-1 text-foreground hover:text-primary transition-all duration-300 w-fit"
        >
            <span>{children}</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
        </Link>
    </li>
);

export default async function Footer({ settings, navigation, locale }: Props) {
    const dict = await getDictionary(locale as Languages);

    const nav = dict.navigation;
    const footerUi = dict.footer;

    const siteName = getLocalizedValue(settings.siteNameAr, settings.siteNameEn, locale);
    const siteDescription = getLocalizedValue(settings.siteDescriptionAr, settings.siteDescriptionEn, locale);
    const firstLetter = siteName?.charAt(0).toUpperCase() || "N";

    const visiblePages = navigation.slice(0, 8);

    const mid = Math.ceil(visiblePages.length / 2);

    const quickLinks = visiblePages.slice(0, mid);
    const overviewLinks = visiblePages.slice(mid);

    return (
        <footer className="relative border-t bg-card overflow-hidden mt-5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            <Container>
                <div className="grid py-8 gap-y-12 gap-x-8 lg:grid-cols-12">

                    <div className="lg:col-span-4 md:col-span-6 space-y-6">
                        <Link href={`/${locale}`} className="flex items-center gap-3 group w-fit">
                            <div className={cn(
                                "flex items-center justify-center transition-transform duration-700 group-hover:rotate-360",
                                settings.logoUrl ? "h-12 w-12" : "h-11 w-11 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex shrink-0"
                            )}>
                                {settings.logoUrl ? (
                                    <Image src={getMediaUrl(settings.logoUrl) || "./glope.svg"} alt={`${siteName} logo`} width={48} height={48} className="object-contain" />
                                ) : (
                                    <span className="text-lg font-bold text-primary-foreground">{firstLetter}</span>
                                )}
                            </div>
                            <span className="font-bold text-2xl tracking-tighter text-foreground">{siteName}</span>
                        </Link>

                        {siteDescription && (
                            <p className="text-foreground leading-relaxed max-w-sm text-[15px] line-clamp-3 italic opacity-90">
                                {siteDescription}
                            </p>
                        )}

                        <div className="pt-2">
                            <SocialLinks settings={settings} />
                        </div>
                    </div>

                    {/* Dynamic Links Sections */}
                    <div className="lg:col-span-4 md:col-span-6 grid grid-cols-2 gap-8">
                        {/* Column 1: Quick Links */}
                        <div className="space-y-5">
                            <h4 className="font-bold text-foreground text-sm uppercase tracking-[0.2em]">{footerUi.quickLinks}</h4>
                            <ul className="space-y-3">
                                {quickLinks.map((item) => (
                                    <FooterLink key={item.href} href={item.href}>
                                        {item.title}
                                    </FooterLink>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2: Overview */}
                        <div className="space-y-5">
                            <h4 className="font-bold text-foreground text-sm uppercase tracking-[0.2em]">{footerUi.overview}</h4>
                            <ul className="space-y-3">
                                {overviewLinks.map((item) => (
                                    <FooterLink key={item.href} href={item.href}>
                                        {item.title}
                                    </FooterLink>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-4 md:col-span-12 space-y-6">
                        <h4 className="font-bold text-foreground text-sm uppercase tracking-[0.2em]">{nav.contact}</h4>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            {settings.contactEmail && (
                                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-4 p-3.5 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/5 transition-all group">
                                    <div className="p-2.5 rounded-xl bg-background text-primary shadow-sm group-hover:scale-110 transition-transform">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] uppercase font-bold text-foreground/60 tracking-wider">Email</span>
                                        <span className="text-sm truncate font-medium">{settings.contactEmail}</span>
                                    </div>
                                </a>
                            )}

                            {settings.contactPhone && (
                                <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-4 p-3.5 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/5 transition-all group">
                                    <div className="p-2.5 rounded-xl bg-background text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">Call</span>
                                        <span className="text-sm font-medium">{settings.contactPhone}</span>
                                    </div>
                                </a>
                            )}

                            {settings.whatsappNumber && (
                                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" className="flex items-center gap-4 p-3.5 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/5 transition-all group lg:col-span-1 sm:col-span-2">
                                    <div className="p-2.5 rounded-xl bg-background text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                                        <MessageCircleMore className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-green-800 tracking-wider">WhatsApp</span>
                                        <span className="text-sm font-medium">{footerUi.whatsapp}</span>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className=" py-4 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium opacity-60">
                        © {new Date().getFullYear()} {siteName}. {footerUi.copyRight}
                    </p>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-6 opacity-60">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter">
                            <Globe className="w-3 h-3" /> Global Reach
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
}