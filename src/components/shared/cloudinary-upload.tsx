"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/toast";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import type { CloudinaryUploadResult, SignatureResponse } from "@/types/upload.type";
import { cn } from "@/utils/utils";
import { useTranslation } from "@/i18n/translation-provider";
import { getSuccessMessage, SUCCESS_CODES } from "@/config/success";
import { getOptimizedImageUrl } from "@/utils/media";
import { useSession } from "next-auth/react";

type Media = {
    url: string;
    public_id: string;
    resource_type: "image" | "video";
};

type Props = {
    value?: Media | null;
    onChange: (value: Media | null) => void;
    label?: string;
    uploadText?: string;
    changeText?: string;
    removeText?: string;
    maxSizeText?: string;


    resourceType?: "image" | "video" | "auto";
    maxFileSize?: number;
    allowedFormats?: string[];
};


let cloudinaryPromise: Promise<void> | null = null;

const loadCloudinaryScript = () => {
    if (cloudinaryPromise) return cloudinaryPromise;

    cloudinaryPromise = new Promise<void>((resolve) => {
        if ((window).cloudinary) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.async = true;

        script.onload = () => resolve();

        document.body.appendChild(script);
    });

    return cloudinaryPromise;
};


function getComputedColor(variable: string) {
    const el = document.createElement("div");
    el.style.color = `var(${variable})`;
    document.body.appendChild(el);

    const color = getComputedStyle(el).color;

    document.body.removeChild(el);
    return color;
}

export default function CloudinaryUpload({
    value,
    onChange,
    label,
    uploadText,
    changeText,
    removeText,
    maxSizeText,
    resourceType,
    maxFileSize,
    allowedFormats,
}: Props) {
    const { data: session } = useSession();
    const isDemoUser = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_DEMO_EMAIL;
    const [isUploading, setIsUploading] = useState(false);
    const { dict } = useTranslation();

    const finalResourceType = resourceType || "image";

    const finalMaxSize = maxFileSize || 2 * 1024 * 1024; // 2MB

    const finalFormats =
        allowedFormats ||
        (finalResourceType === "video"
            ? ["mp4", "webm"]
            : finalResourceType === "image"
                ? ["png", "jpg", "jpeg", "webp"]
                : ["png", "jpg", "jpeg", "webp", "mp4", "webm"]);

    const handleUpload = useCallback(async () => {
        if (isDemoUser) {
            showError("Demo mode: upload disabled");
            return;
        }

        try {
            setIsUploading(true);

            await loadCloudinaryScript();

            // ensure widget exists
            if (!window.cloudinary) {
                showError(getErrorMessage(ERROR_CODES.SERVER_ERROR, dict));
                setIsUploading(false);
                return;
            }

            // get signature
            const res = await fetch("/api/upload/signature", {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.code || ERROR_CODES.SERVER_ERROR);
            }

            const data: SignatureResponse = await res.json();

            document.body.style.pointerEvents = "auto";

            const primary = getComputedColor("--primary");
            const background = getComputedColor("--background");
            const border = getComputedColor("--border");
            const widget = window.cloudinary.createUploadWidget(
                {
                    cloudName: data.cloudName,
                    apiKey: data.apiKey,
                    uploadSignature: data.signature,
                    uploadSignatureTimestamp: data.timestamp,
                    folder: data.folder,
                    sources: ["local", "url", "camera", "unsplash"],
                    multiple: false,
                    resourceType: finalResourceType,
                    clientAllowedFormats: finalFormats,
                    maxFileSize: finalMaxSize,
                    language: "en",
                    text: {
                        en: {
                            menu: {
                                files: "My Photos"
                            },
                            local: {
                                browse: "Select from computer"
                            }
                        }
                    },
                    styles: {
                        palette: {
                            window: background,
                            sourceBg: background,
                            windowBorder: border,

                            tabIcon: primary,
                            menuIcons: primary,
                            link: primary,
                            action: primary,
                            inProgress: primary,

                            complete: "rgb(34,197,94)",
                            error: "rgb(239,68,68)",
                        },
                    }
                },
                (error: unknown, result: CloudinaryUploadResult) => {
                    if (error) {
                        showError(getErrorMessage(ERROR_CODES.UPLOAD_FAILED, dict));
                        setIsUploading(false);
                        return;
                    }
                    if (result?.event === "success" && result.info?.secure_url) {
                        const oldPublicId = value?.public_id;
                        const oldType = value?.resource_type;

                        const newFile = {
                            url: result.info.secure_url,
                            public_id: result.info.public_id || "",
                            resource_type: (result.info.resource_type as "image" | "video") || "image",
                        };

                        onChange(newFile);

                        if (oldPublicId) {
                            fetch("/api/upload/delete", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    public_id: oldPublicId,
                                    resource_type: oldType,
                                }),
                            });
                        }
                        showSuccess(
                            getSuccessMessage(SUCCESS_CODES.UPLOAD_COMPLETE, dict)
                        );
                        document.body.style.pointerEvents = ""; // restore
                        setIsUploading(false);
                    }

                    if (result?.event === "close") {
                        document.body.style.pointerEvents = ""; // restore
                        setIsUploading(false);
                    }
                }
            );


            widget.open();
        } catch (err: unknown) {
            document.body.style.pointerEvents = ""; // restore
            let message = getErrorMessage(ERROR_CODES.UPLOAD_FAILED, dict);

            if (err instanceof Error) {
                const errorCode = err.message as keyof typeof ERROR_CODES;
                if (ERROR_CODES[errorCode]) {
                    message = getErrorMessage(err.message as keyof typeof ERROR_CODES, dict);
                }
            }

            showError(message);
            setIsUploading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dict, onChange, value]);

    const handleRemove = async () => {
        if (isDemoUser) {
            showError("Demo mode: delete disabled");
            return;
        }
        if (value?.public_id) {
            await fetch("/api/upload/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    public_id: value.public_id,
                    resource_type: value.resource_type,
                }),
            });
        }
        onChange(null);
        showSuccess(
            getSuccessMessage(SUCCESS_CODES.IMAGE_REMOVED, dict)
        );
    };

    const imageUrl = value?.url;

    const isVideo = value?.resource_type === "video";

    useEffect(() => {
        const timer = setTimeout(() => {
            loadCloudinaryScript();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className="w-full flex flex-col justify-center items-center gap-2">
            {/* ================= PREVIEW CONTAINER ================= */}
            <div
                className={cn(
                    "relative group w-full aspect-video md:aspect-square max-w-40 rounded-full overflow-hidden border-2 border-dashed transition-all duration-300",
                    "min-w-25 min-h-25 w-full max-w-25 aspect-square rounded-full",
                    value ? "border-primary/20 shadow-sm" : "border-muted-foreground/20 bg-muted/50 hover:bg-muted hover:border-primary/40"
                )}
            >
                {isUploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-muted animate-pulse">
                        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">{uploadText || dict.dashboard.siteSettings.actions.uploading}</span>
                    </div>
                ) : value ? (
                    <>

                        {isVideo ? (
                            <video
                                src={imageUrl}
                                className="w-full h-full object-cover"
                                controls
                            />
                        ) : (
                            <Image
                                src={getOptimizedImageUrl(imageUrl || "", { width: 400 })}
                                alt="Preview"
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        )}

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                            <div className="relative transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleUpload}
                                    className="h-9 px-4 rounded-full text-white shadow-xl hover:scale-105 transition-transform cursor-pointer"
                                >
                                    <RefreshCw className="w-4 h-4 mr-1 " />
                                    <span className="text-xs">
                                        {changeText || dict.dashboard.siteSettings.actions.changeImage}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={handleUpload}
                        type="button"
                        className="flex flex-col items-center justify-center w-full h-full space-y-2 text-muted-foreground transition-colors"
                    >
                        <div className="p-3 bg-background rounded-full shadow-sm">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium">{label || dict.dashboard.siteSettings.actions.uploadImage}</span>
                    </button>
                )}
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex items-center gap-2">
                {!value ? (
                    <p className="text-[11px] text-muted-foreground italic">
                        {maxSizeText || dict.dashboard.siteSettings.actions.maxSizeNote}
                    </p>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemove}
                        disabled={isUploading}
                        className="h-8 text-destructive hover:text-destructive gap-1.5 px-2 cursor-pointer mt-2"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-xs">{removeText || dict.dashboard.siteSettings.actions.removeImage}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}