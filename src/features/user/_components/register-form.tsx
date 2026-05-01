"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerFormSchema } from "@/features/user/user.schema";
import type { RegisterFormInput } from "@/features/user/user.types";

import { registerAction } from "@/features/user/user.actions";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import RHFInput from "@/components/form/rhf-input";

import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { useTranslation } from "@/i18n/translation-provider";
import { showError } from "@/lib/toast";

import Link from "next/link";

export default function RegisterForm() {
    const { dict, locale } = useTranslation();
    const dict_register = dict.auth.register;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormInput>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterFormInput) => {
        setIsLoading(true);

        try {
            // Remove confirmPassword before sending
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword: _, ...payload } = values;

            // Create user
            await registerAction(payload);

            // Auto login
            const res = await signIn("credentials", {
                ...payload,
                redirect: false,
            });

            if (!res?.ok) {
                const errorKey =
                    res?.error && res.error in ERROR_CODES
                        ? (res.error as keyof typeof ERROR_CODES)
                        : ERROR_CODES.INVALID_CREDENTIALS;

                showError(getErrorMessage(errorKey, dict));
                return;
            }

            router.push(`/${locale}/verify-email`);
            router.refresh();
        } catch (error) {
            const errorKey =
                error instanceof Error && error.message in ERROR_CODES
                    ? (error.message as keyof typeof ERROR_CODES)
                    : ERROR_CODES.SERVER_ERROR;

            showError(getErrorMessage(errorKey, dict));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <RHFInput
                    control={form.control}
                    name="name"
                    label={dict_register.nameLabel}
                    placeholder="Your name"
                />

                <RHFInput
                    control={form.control}
                    name="email"
                    label={dict_register.emailLabel}
                    placeholder="example@example.com"
                    type="email"
                />

                <RHFInput
                    control={form.control}
                    name="password"
                    label={dict_register.passwordLabel}
                    placeholder="••••••••"
                    type="password"
                />

                <RHFInput
                    control={form.control}
                    name="confirmPassword"
                    label={dict_register.confirmPasswordLabel}
                    placeholder="••••••••"
                    type="password"
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? dict_register.submitting : dict_register.submit}
                </Button>

                <p className="text-sm text-gray-500">
                    {dict_register.haveAccount}{" "}
                    <Link href="/login" className="text-primary">
                        {dict_register.loginLink}
                    </Link>
                </p>

            </form>
        </Form>
    );
}