import { Suspense } from "react";
import { resetPasswordAction } from "@/features/user/user.action";
import ResetPasswordClient from "@/features/user/_components/reset-password-client";


export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        }>
            <ResetPasswordClient resetPasswordAction={resetPasswordAction} />
        </Suspense>
    );
}
