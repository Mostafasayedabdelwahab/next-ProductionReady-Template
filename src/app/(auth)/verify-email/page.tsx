import VerifyEmailClient from "@/features/user/_components/verify-email-client";
import { verifyEmailAction } from "@/features/user/user.action"; // الأكشن بتاعنا

import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <p>Loading...</p>
                </div>
            }
        >
            <VerifyEmailClient verifyEmailAction={verifyEmailAction} />
        </Suspense>
    );
}
