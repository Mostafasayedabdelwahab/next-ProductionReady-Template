import ForgotPasswordClient from "@/features/user/_components/forgot-password-client";
import { forgotPasswordAction } from "@/features/user/user.action";

export default function ForgotPasswordPage() {
    return (
        <ForgotPasswordClient forgotPasswordAction={forgotPasswordAction} />
    );
}
