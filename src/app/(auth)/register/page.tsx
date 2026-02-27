import RegisterClient from "@/features/user/_components/register-client";
import { registerAction } from "@/features/user/user.action";

export default function RegisterPage() {
    return <RegisterClient registerAction={registerAction} />;
}
