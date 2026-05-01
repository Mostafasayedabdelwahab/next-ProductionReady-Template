import { Sidebar } from "./sidebar";
import { Header } from "./header";
import type { SiteSettingsEntity } from "@/features/site-settings";
import Container from "@/components/layout/container";
import { cn } from "@/utils/utils";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    settings: SiteSettingsEntity;
    children: React.ReactNode;
    dict: Awaited<ReturnType<typeof getDictionary>>;
    locale: string;
};

export function DashboardShell({ user, settings, children, dict, locale }: Props) {
    const isAr = locale === "ar";
    return (
        /* 1. Dynamic direction handling using dir attribute */
        <>
            {/* 2. Sidebar positioning: fixed inset-y-0 is fine, but we handle border and positioning */}
            <aside className={cn(
                "hidden md:flex h-full w-56 flex-col transition-all border-r shrink-0 fixed inset-y-0 z-50 bg-background",
                isAr ? "right-0 border-l" : "left-0 border-r"
            )}>
                <Sidebar settings={settings} />
            </aside>

            {/* 3. Main content padding: flip pl-64 to pr-64 based on locale */}
            <main className={`flex flex-1 flex-col ${isAr ? "md:pr-56" : "md:pl-56"}`}>
                <Header user={user} settings={settings} dict={dict} />

                <section id="main-content" className="flex-1  py-2 animate-page-fade">
                    <Container>
                        {children}
                    </Container>
                </section>
            </main>
        </>
    );
}