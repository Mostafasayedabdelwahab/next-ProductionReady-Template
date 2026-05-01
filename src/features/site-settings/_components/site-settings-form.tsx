"use client";

// React & Hooks
import React, { useEffect } from "react";

// Lucide Icons 
import { Globe, Palette, Phone, Share2, Info } from "lucide-react";

// Shadcn UI Components
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Custom RHF Components
import RHFInput from "@/components/form/rhf-input";
import RHFColor from "@/components/form/rhf-color";
import RHFUpload from "@/components/form/rhf-upload";
import RHFSelect from "@/components/form/rhf-select";

// Logic & Types
import { useSiteSettingsForm } from "./use-site-settings-form";
import { type SiteSettingsFormValues } from "../site-settings.schema";
import { ArabicFont, EnglishFont, RadiusOption, ThemeMode } from "@/generated/prisma/enums"; // Importing RadiusOptions enum from generated Prisma enums
import { useTranslation } from "@/i18n/translation-provider";
import { motion, Variants } from "framer-motion";
import FormActions from "@/components/form/form-actions";
import { DEFAULT_THEME } from "@/config/constants";
type Props = {
    defaultValues: SiteSettingsFormValues | null;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

// Reusable Section Header with Icon
function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ size?: number }> }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
    );
}

export default function SiteSettingsForm({ defaultValues }: Props) {
    const { dict } = useTranslation();

    const { form, isPending, onSubmit } = useSiteSettingsForm(defaultValues, dict);
    const socialFields = [
        { name: "facebookUrl", label: "Facebook", ph: "https://facebook.com/..." },
        { name: "instagramUrl", label: "Instagram", ph: "https://instagram.com/..." },
        { name: "twitterUrl", label: "Twitter", ph: "https://twitter.com/..." },
        { name: "linkedinUrl", label: "LinkedIn", ph: "https://linkedin.com/..." },
        { name: "youtubeUrl", label: "YouTube", ph: "https://youtube.com/..." },
    ] as const;

    const isDirty = form.formState.isDirty;
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    return (
        <motion.section variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2">
            <h1 className="text-xl font-semibold">{dict.dashboard.siteSettings.title}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 pb-4">

                    {/* ================= BASIC INFO ================= */}
                    <motion.div variants={itemVariants} className="space-y-2">

                        <Card className="bg-card border shadow-sm">
                            <CardContent >
                                <SectionHeader title={dict.dashboard.siteSettings.basicInfo.title} icon={Info} />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                                    {/* Arabic */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-muted-foreground">
                                            {dict.dashboard.siteSettings.basicInfo.arabicContent}
                                        </h4>
                                        <RHFInput control={form.control} name="siteNameAr" label={dict.dashboard.siteSettings.basicInfo.siteNameAR} placeholder={dict.dashboard.siteSettings.basicInfo.placeholders.nameAR} />
                                        <RHFInput control={form.control} name="siteTitleAr" label={dict.dashboard.siteSettings.basicInfo.siteTitleAR} placeholder={dict.dashboard.siteSettings.basicInfo.placeholders.titleAR} />
                                        <RHFInput control={form.control} name="siteDescriptionAr" label={dict.dashboard.siteSettings.basicInfo.siteDescriptionAR} placeholder={dict.dashboard.siteSettings.basicInfo.placeholders.descriptionAR} />
                                    </div>

                                    {/* English */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-muted-foreground">
                                            {dict.dashboard.siteSettings.basicInfo.englishContent}
                                        </h4>
                                        <RHFInput control={form.control} name="siteNameEn" label={dict.dashboard.siteSettings.basicInfo.siteNameEN} placeholder={dict.dashboard.siteSettings.basicInfo.placeholders.nameEN} />
                                        <RHFInput control={form.control} name="siteTitleEn" label={dict.dashboard.siteSettings.basicInfo.siteTitleEN} placeholder={dict.dashboard.siteSettings.basicInfo.placeholders.titleEN} />
                                        <RHFInput control={form.control} name="siteDescriptionEn" label={dict.dashboard.siteSettings.basicInfo.siteDescriptionEN} placeholder={dict.dashboard.siteSettings.basicInfo.placeholders.descriptionEN} />
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* ================= BRANDING ================= */}
                        <Card className="bg-card border shadow-sm">
                            <CardContent >
                                <SectionHeader title={dict.dashboard.siteSettings.branding.title} icon={Palette} />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                                    <RHFUpload control={form.control} name="logoUrl" label={dict.dashboard.siteSettings.branding.logo} />
                                    <RHFUpload control={form.control} name="faviconUrl" label={dict.dashboard.siteSettings.branding.favicon} />
                                    <RHFUpload control={form.control} name="ogImageUrl" label={dict.dashboard.siteSettings.branding.ogImage} />
                                </div>

                                <Separator className="bg-border my-2" />

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <RHFColor control={form.control} name="primaryColor" label={dict.dashboard.siteSettings.branding.colors.primary} />
                                    <RHFColor control={form.control} name="secondaryColor" label={dict.dashboard.siteSettings.branding.colors.secondary} />
                                    <RHFColor control={form.control} name="accentColor" label={dict.dashboard.siteSettings.branding.colors.accent} />
                                    <RHFColor control={form.control} name="backgroundColor" label={dict.dashboard.siteSettings.branding.colors.background} />
                                    <RHFColor control={form.control} name="foregroundColor" label={dict.dashboard.siteSettings.branding.colors.text} />
                                    <RHFColor control={form.control} name="mutedColor" label={dict.dashboard.siteSettings.branding.colors.muted} />
                                    <RHFColor control={form.control} name="cardColor" label={dict.dashboard.siteSettings.branding.colors.card} />
                                    <RHFColor control={form.control} name="borderColor" label={dict.dashboard.siteSettings.branding.colors.border} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">{dict.dashboard.siteSettings.branding.colors.reset}</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => {
                                            form.setValue("primaryColor", DEFAULT_THEME.primaryColor, { shouldDirty: true });
                                            form.setValue("secondaryColor", DEFAULT_THEME.secondaryColor, { shouldDirty: true });
                                            form.setValue("accentColor", DEFAULT_THEME.accentColor, { shouldDirty: true });
                                            form.setValue("mutedColor", DEFAULT_THEME.mutedColor, { shouldDirty: true });
                                            form.setValue("backgroundColor", DEFAULT_THEME.backgroundColor, { shouldDirty: true });
                                            form.setValue("foregroundColor", DEFAULT_THEME.foregroundColor, { shouldDirty: true });
                                            form.setValue("cardColor", DEFAULT_THEME.cardColor, { shouldDirty: true });
                                            form.setValue("borderColor", DEFAULT_THEME.borderColor, { shouldDirty: true });
                                        }}
                                    >
                                        {dict.dashboard.siteSettings.branding.colors.reset}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-3 items-end">
                                    <RHFSelect control={form.control} name="radius" label={dict.dashboard.siteSettings.branding.ui.radius}
                                        options={Object.entries(RadiusOption).map(([key, value]) => ({
                                            label: key.charAt(0).toUpperCase() + key.slice(1),
                                            value,
                                        }))} />

                                    <RHFSelect control={form.control} name="defaultTheme" label={dict.dashboard.siteSettings.branding.ui.theme}
                                        options={Object.entries(ThemeMode).map(([key, value]) => ({
                                            label: key.charAt(0).toUpperCase() + key.slice(1),
                                            value,
                                        }))}
                                    />
                                    <RHFSelect
                                        control={form.control}
                                        name="arabicFont"
                                        label={dict.dashboard.siteSettings.branding.ui.arabicFont}
                                        options={Object.entries(ArabicFont).map(([key, value]) => ({
                                            label: key.charAt(0).toUpperCase() + key.slice(1),
                                            value,
                                        }))}
                                    />

                                    <RHFSelect
                                        control={form.control}
                                        name="englishFont"
                                        label={dict.dashboard.siteSettings.branding.ui.englishFont}
                                        options={Object.entries(EnglishFont).map(([key, value]) => ({
                                            label: key.charAt(0).toUpperCase() + key.slice(1),
                                            value,
                                        }))}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* ================= CONTACT ================= */}
                        <Card className="bg-card border shadow-sm">
                            <CardContent className="space-y-3" >
                                <SectionHeader title={dict.dashboard.siteSettings.contact.title} icon={Phone} />
                                <div className="grid grid-cols-1 gap-4 ">
                                    <RHFInput control={form.control} name="contactEmail" label={dict.dashboard.siteSettings.contact.email} placeholder="support@example.com" />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <RHFInput control={form.control} name="contactPhone" label={dict.dashboard.siteSettings.contact.phone} placeholder="+201001234567" />
                                    <RHFInput control={form.control} name="whatsappNumber" label={dict.dashboard.siteSettings.contact.whatsapp} placeholder="+201001234567" />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <RHFInput control={form.control} name="addressAr" label={dict.dashboard.siteSettings.contact.addressAR} placeholder="القاهرة, مصر" />
                                    <RHFInput control={form.control} name="addressEn" label={dict.dashboard.siteSettings.contact.addressEN} placeholder="Cairo, Egypt" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* ================= SOCIAL & SEO ================= */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Social Media Column */}
                        <Card className="bg-card border shadow-sm">
                            <CardContent className="space-y-6">
                                <SectionHeader title={dict.dashboard.siteSettings.socialSeo.socialTitle} icon={Share2} />
                                <div className="space-y-4">
                                    {socialFields.map((item) => (
                                        <RHFInput
                                            key={item.name}
                                            control={form.control}
                                            name={item.name as keyof SiteSettingsFormValues}
                                            label={item.label}
                                            placeholder={item.ph}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Column */}
                        <Card className="bg-card border shadow-sm">
                            <CardContent className="space-y-6">
                                <SectionHeader title={dict.dashboard.siteSettings.socialSeo.seoTitle} icon={Globe} />
                                <RHFInput control={form.control} name="domainUrl" label={dict.dashboard.siteSettings.socialSeo.domain} placeholder="https://yourdomain.com" helperText={dict.dashboard.siteSettings.helperText.domain} />
                                <div className="space-y-4">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{dict.dashboard.siteSettings.socialSeo.keywordsSEO}
                                    </p>
                                    <div className="grid grid-cols-1 gap-4">
                                        <RHFInput control={form.control} name="defaultKeywordsAr" label={dict.dashboard.siteSettings.socialSeo.keywordsAR} placeholder="خدمات ,شركات ,الموقع" helperText={dict.dashboard.siteSettings.helperText.keywords} />
                                        <RHFInput control={form.control} name="defaultKeywordsEn" label={dict.dashboard.siteSettings.socialSeo.keywordsEN} placeholder="services, egypt, company" helperText={dict.dashboard.siteSettings.helperText.keywords} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* ================= ACTIONS ================= */}
                    <FormActions
                        isDirty={form.formState.isDirty}
                        isPending={isPending}
                        variants={itemVariants}
                    />
                </form>
            </Form>
        </motion.section>
    );
}