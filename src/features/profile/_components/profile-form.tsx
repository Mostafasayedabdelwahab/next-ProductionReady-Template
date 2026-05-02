"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail } from "lucide-react";

import RHFInput from "@/components/form/rhf-input";
import RHFUpload from "@/components/form/rhf-upload";

import { useProfileForm } from "./use-profile-form";
import type { Profile } from "@/features/profile/profile.types";

import { ChangePasswordForm } from "./changePasswordForm";
import { useTranslation } from "@/i18n/translation-provider";
import LogoutButton from "@/features/user/_components/logout-button";
import RHFPhoneInput from "@/components/form/rhf-phoneInput";

interface Props {
    profile: Profile;
    email: string | null | undefined;
}

export function ProfileForm({ profile, email }: Props) {
    const { dict } = useTranslation();
    const { form, onSubmit, isPending } = useProfileForm(profile, dict);
    const name = form.watch("name");

    return (
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-4 lg:grid-cols-3 pt-3">
            <div className="space-y-8 lg:col-span-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <Card className=" border border-border shadow rounded-2xl overflow-hidden py-2">
                            <CardContent className="px-2">
                                <div className="flex flex-col-reverse sm:flex-row items-center gap-4">
                                    <div className="relative group">
                                        <div className="relative">
                                            <RHFUpload control={form.control} name="image" />
                                        </div>
                                    </div>

                                    <div className="text-center sm:text-start space-y-1">
                                        <h2 className="text-xl font-bold">
                                            {name || dict.profile.title}
                                        </h2>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                                            <Mail size={14} />
                                            <span className="text-sm font-medium leading-none">{email ?? "-"}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className=" border border-border shadow rounded-2xl py-4">
                            <CardContent className="p-2 md:p-6 pt-0 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <RHFInput
                                        control={form.control}
                                        name="name"
                                        label={dict.auth.register.nameLabel}
                                        placeholder={dict.profile.placeholders.name}
                                    />
                                </div>

                                <RHFPhoneInput
                                    control={form.control}
                                    name="phone"
                                    label={dict.profile.phone}
                                />

                                <RHFInput
                                    control={form.control}
                                    name="address"
                                    label={dict.profile.address}
                                    placeholder={dict.profile.placeholders.address}
                                />

                                <div className="md:col-span-2 flex justify-center ">
                                    <Button
                                        disabled={isPending}
                                        className="rounded-full w-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                    >
                                        {isPending ? dict.dashboard.siteSettings.actions.saving : dict.dashboard.siteSettings.actions.save}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>

            <Card className=" border border-border shadow rounded-2xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <ShieldCheck size={20} />
                        </div>
                        <CardTitle>{dict.public.security.title}</CardTitle>
                    </div>
                    <CardDescription>{dict.public.security.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-2 md:p-6 pt-0 space-y-6">
                    <ChangePasswordForm />

                    {/* Footer Section */}
                    <footer className="border border-red-600 rounded-2xl shrink-0 ">
                        <LogoutButton />
                    </footer>
                </CardContent>
            </Card>
        </div>
    );
}