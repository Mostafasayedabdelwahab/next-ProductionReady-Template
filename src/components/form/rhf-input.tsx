"use client";

import { useState } from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { useTranslation } from "@/i18n/translation-provider";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    helperText?: string;
    className?: string;
};

export default function RHFInput<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    inputMode,
    helperText,
    className,
}: Props<T>) {
    const { dict } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type={inputType}
                                inputMode={inputMode}
                                placeholder={placeholder}
                                {...field}
                                value={(field.value as string | null) ?? ""}
                                className={`border border-slate-400 ${isPassword ? "pe-10" : ""} ${className}`}
                            />

                            {isPassword && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute inset-e-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                    onClick={togglePassword}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </div>
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