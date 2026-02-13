// src/app/profile/page.tsx
import { ProfileForm } from "@/features/profile/_components/profile-form";
import { changePasswordAction, getProfileAction, updateProfileAction } from "@/features/profile/profile.action";
import { Profile } from "@/features/profile/profile.types";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    let profileData: Profile;

    try {
        profileData = await getProfileAction();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "unknown";
        console.error("Profile Fetch Error:", message);

        // هنا نوجه لصفحة اللوجن فقط لو فعلاً مفيش سيشن
        // لكن لو غير الباسورد مش هيوصل لهنا لأننا عدلنا الجارد
        redirect("/login?callbackUrl=/profile");
    }

    // تأكدنا أن profileData موجودة الآن
    const userEmail = profileData.user?.email ?? "";

    return (
        <div className="flex min-h-[calc(100vh-84px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile information</p>
                </div>
                <hr className="border-t" />

                <ProfileForm
                    profile={profileData}
                    email={userEmail}
                    // الأكشنز هنا بتمرر كـ Props بشكل سليم و Type-safe
                    updateProfileAction={updateProfileAction}
                    changePasswordAction={changePasswordAction}
                />
            </div>
        </div>
    );
}