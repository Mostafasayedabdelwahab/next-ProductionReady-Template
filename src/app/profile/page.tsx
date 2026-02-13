// src/app/profile/page.tsx
import { ProfileForm } from "@/features/profile/_components/profile-form";
import { changePasswordAction, getProfileAction, updateProfileAction } from "@/features/profile/profile.action";
import { redirect } from "next/navigation";
import { ERROR_CODES } from "@/lib/constants/errors";

export default async function ProfilePage() {
    let profileData;

    try {
        profileData = await getProfileAction();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "";

        // لو الخطأ سببه عدم وجود صلاحية أو انتهاء السيشن، نوجهه للوجن
        if (message === ERROR_CODES.UNAUTHORIZED || message === ERROR_CODES.SESSION_EXPIRED) {
            redirect("/login?callbackUrl=/profile");
        }

        // لو خطأ تاني (زي الداتابيز)، ممكن نرميه لصفحة الـ error.tsx الخاصة بـ Next.js
        throw error;
    }

    const userEmail = profileData.user?.email ?? "";

    return (
        <div className="flex min-h-[calc(100vh-84px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-4xl space-y-8"> {/* زودت الـ width شوية عشان الـ grid اللي عملناه في الفورم */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile information and security</p>
                </div>

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