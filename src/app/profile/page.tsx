// src/app/profile/page.tsx
import { ProfileForm } from "@/features/profile/_components/profile-form";
import {
    changePasswordAction,
    getProfileAction,
    updateProfileAction,
} from "@/features/profile/profile.action";
import { redirect } from "next/navigation";
import { ERROR_CODES } from "@/lib/constants/errors";

export default async function ProfilePage() {
    let profileData;

    try {
        // Fetch current user profile from server
        profileData = await getProfileAction();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "";

        // If unauthorized or session expired → redirect to login
        if (
            message === ERROR_CODES.UNAUTHORIZED ||
            message === ERROR_CODES.SESSION_EXPIRED
        ) {
            redirect("/login?callbackUrl=/profile");
        }

        // Any other error → let Next.js error boundary handle it
        throw error;
    }

    // Extract user email safely
    const userEmail = profileData.user?.email ?? "";

    return (
        <div className="flex min-h-[calc(100vh-84px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-4xl space-y-8">
                {/* Page header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your profile information and security
                    </p>
                </div>

                {/* Profile form */}
                <ProfileForm
                    profile={profileData}
                    email={userEmail}
                    updateProfileAction={updateProfileAction}
                    changePasswordAction={changePasswordAction}
                />
            </div>
        </div>
    );
}
