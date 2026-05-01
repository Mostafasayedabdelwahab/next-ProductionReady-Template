import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateProfile } from "@/features/profile/profile.service";
import { ProfileForm } from "@/features/profile/_components/profile-form";
import { redirect } from "next/navigation";

import { Languages } from "@/config/enums";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { createPageMetadata } from "@/lib/page-metadata";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    const [dict, settings] = await Promise.all([
        getDictionary(locale as Languages),
        getCachedSiteSettings(),
    ]);

    const baseUrl =
        settings.domainUrl?.replace(/\/$/, "") || "https://example.com";

    const metadata = createPageMetadata(baseUrl, locale, "/profile");

    return {
        ...metadata,
        title: dict.profile.title,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function ProfilePage({ params, }: { params: Promise<{ locale: string }>; }) {
    const session = await getServerSession(authOptions);
    const { locale } = await params;
    if (!session?.user?.id) {
        redirect(`/${locale}/login`);
    }

    const profile = await getOrCreateProfile(session.user.id);
    const email = session.user.email

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
            <div className="w-full  space-y-6">
                {/* Profile Form Card */}
                <ProfileForm profile={profile} email={email} />
            </div>
        </div>
    );
}
