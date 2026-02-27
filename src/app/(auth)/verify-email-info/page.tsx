import VerifyEmailInfoClient from "@/features/user/_components/verify-email-info-client";
import {
    resendVerificationAction,
    checkVerificationStatusAction,
} from "@/features/user/user.action";

export default function VerifyEmailInfoPage() {
    return (
        <VerifyEmailInfoClient
            resendVerificationAction={resendVerificationAction}
            checkVerificationStatusAction={checkVerificationStatusAction}
        />
    );
}
