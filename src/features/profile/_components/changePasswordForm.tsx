"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import RHFInput from "@/components/form/rhf-input";
import { useChangePasswordForm } from "./use-profile-form";

import { KeyRound, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n/translation-provider";
import { signOut } from "next-auth/react";

export function ChangePasswordForm() {
    const { dict, locale } = useTranslation();
    const { form, onSubmit, isPending } = useChangePasswordForm(dict, locale);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-2">

                <RHFInput
                    control={form.control}
                    name="currentPassword"
                    label={dict.auth.password.current}
                    placeholder="••••••••"
                    type="password"
                />

                <RHFInput
                    control={form.control}
                    name="newPassword"
                    label={dict.auth.password.new}
                    placeholder="••••••••"
                    type="password"
                />

                <RHFInput
                    control={form.control}
                    name="confirmPassword"
                    label={dict.auth.password.confirm}
                    placeholder="••••••••"
                    type="password"
                />

                <Button
                    disabled={isPending}
                    className="w-full rounded-xl h-11 bg-red-600 text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {dict.auth.password.updating}
                        </>
                    ) : (
                        <>
                            <KeyRound className="mr-2 h-4 w-4" />
                            {dict.auth.password.update}
                        </>
                    )}
                </Button>

                {/* Forgot password */}
                <div className="text-sm mb-1">
                    <Button
                        type="button"
                        onClick={() => signOut({
                            callbackUrl: `/${locale}/forgot-password`
                        })
                        }
                        className="bg-transparent! font-medium text-blue-600 hover:underline"
                    >
                        {dict.auth.forgotPassword.title}
                    </Button>
                </div>

            </form>
        </Form>
    );
}