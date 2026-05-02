import ThemeToggle from "@/components/shared/theme-toggle";
import MobileSidebar from "./mobile-sidebar";
import type { SiteSettingsEntity } from "@/features/site-settings";
import LanguageSwitcher from "@/components/shared/language-switcher";
import type { getDictionary } from "@/i18n/get-dictionary";
import UserMenu from "@/components/layout/UserMenu";
import { Role } from "@/generated/prisma/enums";
type Props = {
    user: {
        name?: string | null;
        email?: string | null;
        role?: Role;
        image?: string | null;
    };
    settings: SiteSettingsEntity;
    dict: Awaited<ReturnType<typeof getDictionary>>;
};

export function Header({ user, settings, dict }: Props) {
    const nav = dict.dashboard;
    
    return (

        <header className="sticky top-0 z-30 flex items-center justify-between h-14 bg-background/60 backdrop-blur-md border-b shrink-0 transition-all">
            {/* LEFT - Navigation & Breadcrumb/Title*/}
            <div className="flex items-center gap-3">
                <nav aria-label="Mobile Navigation">
                    <MobileSidebar settings={settings} />
                </nav>

                <span className="text-sm font-bold tracking-tight md:text-lg select-none" role="status">
                    {nav.title}
                </span>
            </div>

            {/* RIGHT - User Profile & Controls */}
            <div className="flex items-center gap-4">
                {/* User Info - Hidden on very small screens */}
                <section className="hidden sm:flex flex-col items-end leading-none gap-0.5" aria-label="User Information">
                    <span className="text-sm font-semibold">{user.name || "Admin"}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{user.email}</span>
                </section>

                {/* Action Buttons Group */}
                <div className="flex items-center gap-2 border-l pl-2 dark:border-border/40">
                    <UserMenu user={{
                        name: user.name,
                        email: user.email,
                        role: user.role as Role,
                    }} image={user.image} />

                    {/* Controls Wrapper */}
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
}