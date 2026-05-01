import ThemeToggle from "@/components/shared/theme-toggle";
import MobileSidebar from "./mobile-sidebar";
import type { SiteSettingsEntity } from "@/features/site-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LanguageSwitcher from "@/components/shared/language-switcher";
import type { getDictionary } from "@/i18n/get-dictionary";
type Props = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    settings: SiteSettingsEntity;
    dict: Awaited<ReturnType<typeof getDictionary>>;
};

export function Header({ user, settings, dict }: Props) {
    const nav = dict.dashboard;
    const userInitials = user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";
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
                    <Avatar className="h-8 w-8 border ring-2 ring-primary/5 transition-transform hover:scale-105">
                        {user.image && (
                            <AvatarImage
                                src={user.image}
                                alt={user.name || "User Avatar"}
                            />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>

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