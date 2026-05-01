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

type FormValues = {
    code: string;
};

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

            setTimeout(() => {
                window.location.reload();
                router.replace(`/${locale}/profile`);
            }, 200);

        } catch {
            showError(getErrorMessage(ERROR_CODES.SERVER_ERROR, dict));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);

        try {
            const res = await resendVerificationAction();
            showSuccess(res.message);
        } catch (error) {
            const errorKey =
                error instanceof Error && error.message in ERROR_CODES
                    ? (error.message as keyof typeof ERROR_CODES)
                    : ERROR_CODES.SERVER_ERROR;

            showError(getErrorMessage(errorKey, dict));
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Form {...form}>
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