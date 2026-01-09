import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProfileForm } from "./profile-form";
import { getOrCreateProfile } from "@/features/profile/profile.service";


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const profile = await getOrCreateProfile(session.user.id);
    const email = session.user.email

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
            <div className="w-full  space-y-6">
                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Profile
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage your personal information
                    </p>
                </div>


                {/* Profile Form Card */}
                <ProfileForm profile={profile} email={email} />
            </div>
        </div>
    );
}
