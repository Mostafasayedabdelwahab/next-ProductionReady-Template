"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Control, FieldPath, FieldValues } from "react-hook-form";

type Option = {
    label: React.ReactNode;
    value: string;
};

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    options: Option[];

    isMulti?: boolean; // 👈 new
    max?: number;      // 👈 optional limit
};

export default function RHFSelect<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    options,
    isMulti = false,
    max,
}: Props<T>) {

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {

                const value = field.value;

                const handleChange = (val: string) => {
                    if (!isMulti) {
                        field.onChange(val === "none" ? undefined : val);
                        return;
                    }

                    const current: string[] = Array.isArray(value) ? value : [];

                    let updated;

                    if (current.includes(val)) {
                        // remove
                        updated = current.filter((v) => v !== val);
                    } else {
                        // add
                        if (max && current.length >= max) return;
                        updated = [...current, val];
                    }

                    field.onChange(updated);
                };

                const selectedValues: string[] = isMulti
                    ? (Array.isArray(value) ? value : [])
                    : [value];

                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>

                        <Select
                            onValueChange={handleChange}
                            value={isMulti ? undefined : (value ?? "none")}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue>
                                        {!isMulti ? (
                                            value === undefined ? (
                                                <span className="text-muted-foreground">
                                                    Empty
                                                </span>
                                            ) : (
                                                options.find(o => o.value === value)?.label || placeholder
                                            )
                                        ) : (
                                            selectedValues.length === 0 ? (
                                                <span className="text-muted-foreground">
                                                    {placeholder || "Select items"}
                                                </span>
                                            ) : (
                                                <span>
                                                    {selectedValues.length} selected
                                                </span>
                                            )
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                                {!isMulti && (
                                    <SelectItem value="none" className="text-muted-foreground">
                                        Empty
                                    </SelectItem>
                                )}

                                {options.map((opt) => {
                                    const isSelected = selectedValues.includes(opt.value);

                                    return (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                {isMulti && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        readOnly
                                                    />
                                                )}
                                                {opt.label}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}