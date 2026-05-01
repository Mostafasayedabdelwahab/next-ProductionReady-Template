"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/translation-provider";
import { motion, Variants } from "framer-motion";

type Props = {
    isDirty: boolean;
    isPending?: boolean;
    variants?: Variants;
};

const defaultVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export default function FormActions({
    isDirty,
    isPending,
    variants = defaultVariants,
}: Props) {

    const { dict } = useTranslation();
    return (
        <motion.div
            variants={variants}
            className="sticky bottom-4 z-50 bg-secondary/10 backdrop-blur-lg border rounded-xl shadow-lg p-3 mx-2 flex flex-col sm:flex-row gap-2 items-center justify-between"
        >
            <div className="flex flex-col">
                <p className="text-sm font-medium">
                    {isDirty ? dict.dashboard.siteSettings.actions.unsaved : dict.dashboard.siteSettings.actions.upToDate}
                </p>

                {isDirty && dict.dashboard.siteSettings.actions.unsavedHint && (
                    <span className="text-xs text-muted-foreground">
                        {dict.dashboard.siteSettings.actions.unsavedHint}
                    </span>
                )}
            </div>

            <Button
                type="submit"
                disabled={isPending || !isDirty}
                size="lg"
                className="w-full md:w-48 shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer"
            >
                {isPending ? dict.dashboard.siteSettings.actions.saving : dict.dashboard.siteSettings.actions.save}
            </Button>
        </motion.div>
    );
}