"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import CloudinaryUpload from "@/components/shared/cloudinary-upload";

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label?: string;
    buttonLabel?: string;
    uploadingText?: string;
    changeText?: string;
    removeText?: string;
    maxSizeText?: string;

    resourceType?: "image" | "video" | "auto";
    maxFileSize?: number;
    allowedFormats?: string[];
    
};

export default function RHFUpload<T extends FieldValues>({
    control,
    name,
    label,
    buttonLabel,
    uploadingText,
    changeText,
    removeText,
    maxSizeText,

    resourceType,
    maxFileSize,
    allowedFormats,

}: Props<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <CloudinaryUpload
                            value={field.value}
                            onChange={field.onChange}
                            label={buttonLabel}
                            uploadText={uploadingText}
                            changeText={changeText}
                            removeText={removeText}
                            maxSizeText={maxSizeText}

                            resourceType={resourceType}
                            maxFileSize={maxFileSize}
                            allowedFormats={allowedFormats}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}