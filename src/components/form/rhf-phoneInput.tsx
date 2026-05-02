"use client";

import dynamic from "next/dynamic";
import "react-phone-number-input/style.css";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "@/i18n/translation-provider";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import type { CountryCode } from "libphonenumber-js";

const PhoneInput = dynamic(
    () => import("react-phone-number-input").then((mod) => mod.default),
    { ssr: false }
);

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    helperText?: string;
    defaultCountry?: CountryCode;
};

export default function RHFPhoneInput<T extends FieldValues>({
    control,
    name,
    label,
    helperText,
    defaultCountry = "EG",
}: Props<T>) {
    const { dict } = useTranslation();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>

                    <FormControl >
                        <div dir="ltr">
                        <PhoneInput
                            international
                            defaultCountry={defaultCountry}
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder={dict.profile.placeholders.phone}
                            className="input border border-slate-400 px-3 py-2 rounded-md"
                        />
                        </div>
                    </FormControl>

                    {(fieldState.error || helperText) && (
                        <p
                            className={`text-sm font-medium ${fieldState.error
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {fieldState.error
                                ? getErrorMessage(
                                    (fieldState.error.message ??
                                        ERROR_CODES.SERVER_ERROR) as keyof typeof ERROR_CODES,
                                    dict
                                )
                                : helperText}
                        </p>
                    )}
                </FormItem>
            )}
        />
    );
}