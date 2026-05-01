"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { showError } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import RHFInput from "@/components/form/rhf-input";
import Link from "next/link";

import { type LoginInput, loginSchema } from "@/features/user/user.schema";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { useTranslation } from "@/i18n/translation-provider";

// Helper: normalize any error into a known ERROR_CODE
function resolveErrorKey(
    maybeKey: unknown
): keyof typeof ERROR_CODES {
    if (typeof maybeKey === "string" && maybeKey in ERROR_CODES) {
        return maybeKey as keyof typeof ERROR_CODES;
    }
    return ERROR_CODES.INVALID_CREDENTIALS;
}

export default function LoginForm() {
    const { dict, locale } = useTranslation();
    const dictLogin = dict.auth.login;

    const router = useRouter();
    const searchParams = useSearchParams();

    // Preserve redirect target if provided
    const callbackUrl =
        searchParams.get("from") || `/${locale}/profile`;

    const [isLoading, setIsLoading] = useState(false);

    // Form setup with Zod validation
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    // Submit handler
    const onSubmit = async (values: LoginInput) => {
        setIsLoading(true);

        try {
            // NextAuth credentials sign-in (no redirect)
            const res = await signIn("credentials", {
                ...values,
                redirect: false,
            });

            // Handle invalid credentials
            if (!res?.ok) {
                const errorKey = resolveErrorKey(res?.error);
                showError(getErrorMessage(errorKey, dict));
                return;
            }

            // Success → navigate to callback
            router.push(callbackUrl);
            router.refresh();

        } catch {
            // Fallback server error
            showError(
                getErrorMessage(ERROR_CODES.SERVER_ERROR, dict)
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <RHFInput
                    control={form.control}
                    name="email"
                    label={dictLogin.emailLabel}
                    placeholder="example@example.com"
                    type="email"
                />

                <RHFInput
                    control={form.control}
                    name="password"
                    label={dictLogin.passwordLabel}
                    placeholder="••••••••"
                    type="password"
                />

                {/* Forgot password link */}
                <Link
                    href="/forgot-password"
                    className="font-medium text-primary hover:underline"
                >
                    {dict.auth.forgotPassword.title}
                </Link>

                {/* Submit button */}
                <Button
                    type="submit"
                    className="w-full mt-1"
                    disabled={isLoading}
                >
                    {isLoading
                        ? dictLogin.submitting
                        : dictLogin.submit}
                </Button>

                {/* Register link */}
                <p className="text-sm text-gray-500">
                    {dict.auth.login.noAccount}{" "}
                    <Link
                        className="text-primary"
                        href="/register"
                    >
                        {dict.auth.login.registerLink}
                    </Link>
                </p>
            </form>
        </Form>
    );
}