"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { useTranslation } from "@/i18n/translation-provider";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    rows?: number;
    helperText?: string;
};

export default function RHFTextarea<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    rows = 4,
    helperText,
}: Props<T>) {
    const { dict } = useTranslation();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold opacity-70 uppercase tracking-wider">
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            rows={rows}
                            {...field}
                            value={(field.value as string | null) ?? ""}
                            className="min-h-30 rounded-xl bg-gray-50 dark:bg-white/3 border-none text-lg focus-visible:ring-2 focus-visible:ring-primary/20 resize-none transition-all"
                        />
                    </FormControl>
                    {(fieldState.error || helperText) && (
                        <p
                            className={`text-sm font-medium ${fieldState.error ? "text-destructive" : "text-muted-foreground"
                                }`}
                        >
                            {fieldState.error
                                ? getErrorMessage(
                                    (fieldState.error.message ?? ERROR_CODES.SERVER_ERROR) as keyof typeof ERROR_CODES,
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