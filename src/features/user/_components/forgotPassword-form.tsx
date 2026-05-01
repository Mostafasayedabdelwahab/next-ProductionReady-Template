"use client";

import { useState } from "react";
import { forgotPasswordAction } from "@/features/user/user.actions";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/features/user/user.schema";

import { Form } from "@/components/ui/form";
import RHFInput from "@/components/form/rhf-input";
import { Button } from "@/components/ui/button";

import { showError, showSuccess } from "@/lib/toast";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { useTranslation } from "@/i18n/translation-provider";

export default function ForgotPasswordForm() {
    const { dict } = useTranslation();
    const dict_fp = dict.auth.forgotPassword;

    const [loading, setLoading] = useState(false);

    const form = useForm<{ email: string }>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (values: { email: string }) => {
        setLoading(true);

        try {
            const result = await forgotPasswordAction(values.email);
            showSuccess(result.message);
        } catch (error) {
            const errorKey =
                error instanceof Error && error.message in ERROR_CODES
                    ? (error.message as keyof typeof ERROR_CODES)
                    : ERROR_CODES.SERVER_ERROR;

            showError(getErrorMessage(errorKey, dict));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <RHFInput
                    control={form.control}
                    name="email"
                    label={dict_fp.emailLabel}
                    placeholder="you@example.com"
                    type="email"
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? dict_fp.submitting : dict_fp.submit}
                </Button>

            </form>
        </Form>
    );
}