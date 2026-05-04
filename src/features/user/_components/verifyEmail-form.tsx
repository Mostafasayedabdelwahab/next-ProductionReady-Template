"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema } from "@/features/user/user.schema";

import { Form } from "@/components/ui/form";
import RHFInput from "@/components/form/rhf-input";
import { Button } from "@/components/ui/button";

import { showError, showSuccess } from "@/lib/toast";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { useTranslation } from "@/i18n/translation-provider";

import { resendVerificationAction } from "@/features/user/user.actions";
import { useSession } from "next-auth/react";

type FormValues = {
    code: string;
};

function maskEmail(email: string) {
    const [name, domain] = email.split("@");

    const visible = name.slice(0, 2);
    const hidden = "*".repeat(Math.max(name.length - 2, 2));

    return `${visible}${hidden}@${domain}`;
}

export default function VerifyEmailForm() {
    const { dict, locale } = useTranslation();
    const dict_verify = dict.auth.verifyEmail;

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { code: "" },
    });

    const onSubmit = async (values: FormValues) => {
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: values.code }),
            });

            const data = await res.json();

            if (!res.ok) {
                const errorKey =
                    data?.message && data.message in ERROR_CODES
                        ? data.message
                        : ERROR_CODES.SERVER_ERROR;

                showError(getErrorMessage(errorKey, dict));
                return;
            }

            showSuccess(dict.success.ACCOUNT_CREATED);

            // 🔥 forced session refresh
            await fetch("/api/auth/session", {
                cache: "no-store",
            });
            router.replace(`/${locale}/profile`);
            router.refresh();

        } catch {
            showError(getErrorMessage(ERROR_CODES.SERVER_ERROR, dict));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);

        const res = await resendVerificationAction();

        if (res.success) {
            showSuccess(dict.success.EMAIL_SENT);
        } else {
            showError(getErrorMessage(res.code || "SERVER_ERROR", dict));
        }
        setResendLoading(false);
    };

    const { data } = useSession();
    const email = data?.user?.email;

    return (
        <Form {...form}>

            <p className="text-sm text-muted-foreground text-center">
                {dict_verify.sentTo}{" "}
                <span className="font-medium text-foreground">
                    {email ? maskEmail(email) : "..."}
                </span>
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <RHFInput
                    control={form.control}
                    name="code"
                    label={dict_verify.codeLabel}
                    className="w-full text-center text-lg tracking-widest"
                    placeholder="------"
                    inputMode="numeric"
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? dict_verify.submitting : dict_verify.submit}
                </Button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-sm text-primary hover:underline w-full text-center"
                >
                    {resendLoading
                        ? dict_verify.resending
                        : dict_verify.resend}
                </button>

            </form>
        </Form>
    );
}