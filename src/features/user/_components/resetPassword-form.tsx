"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordFromSchema } from "@/features/user/user.schema";

import { Form } from "@/components/ui/form";
import RHFInput from "@/components/form/rhf-input";
import { Button } from "@/components/ui/button";

import { showError, showSuccess } from "@/lib/toast";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { useTranslation } from "@/i18n/translation-provider";

type Props = {
    token: string | null;
};

type FormValues = {
    password: string;
    confirmPassword: string;
};

export default function ResetPasswordForm({ token }: Props) {
    const { dict, locale } = useTranslation();
    const dict_reset = dict.auth.resetPassword;

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(resetPasswordFromSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (!token) {
            showError(getErrorMessage(ERROR_CODES.INVALID_TOKEN, dict));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: values.password,
                }),
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

            showSuccess(dict.success.PASSWORD_CHANGED);

            router.push(`/${locale}/login`);
        } catch {
            showError(getErrorMessage(ERROR_CODES.SERVER_ERROR, dict));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <RHFInput
                    control={form.control}
                    name="password"
                    label={dict_reset.passwordLabel}
                    type="password"
                    placeholder="••••••••"
                />

                <RHFInput
                    control={form.control}
                    name="confirmPassword"
                    label={dict_reset.confirmPasswordLabel}
                    type="password"
                    placeholder="••••••••"
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? dict_reset.submitting : dict_reset.submit}
                </Button>

            </form>
        </Form>
    );
}