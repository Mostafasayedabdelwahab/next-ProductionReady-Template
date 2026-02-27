import LoginClient from "@/features/user/_components/login-client";
import { resendVerificationAction } from "@/features/user/user.action";

export default function LoginPage() {
    return (
        <LoginClient resendVerificationAction={resendVerificationAction} />
    );
}
