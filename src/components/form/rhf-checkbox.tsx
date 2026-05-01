"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    description?: string;
};

export default function RHFCheckbox<T extends FieldValues>({
    control,
    name,
    label,
    description,
}: Props<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">

                    {/* TEXT */}
                    <div className="space-y-1">
                        <FormLabel className="text-sm font-semibold">
                            {label}
                        </FormLabel>

                        {description && (
                            <FormDescription className="text-[11px]">
                                {description}
                            </FormDescription>
                        )}
                    </div>

                    {/* CHECKBOX */}
                    <FormControl>
                        <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={(checked: boolean) =>
                                field.onChange(checked === true)
                            }
                            className="border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                        />
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}