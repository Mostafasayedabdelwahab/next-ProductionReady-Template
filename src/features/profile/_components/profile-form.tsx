"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
    ActionResponse,
    Profile,
    UpdateProfileInput,
    ChangePasswordInput
} from "@/features/profile/profile.types";
import { updateProfileSchema, changePasswordSchema } from "@/features/profile/profile.schema";
import { LogoutButton } from "@/components/shared/LogoutButton";

interface ProfileFormProps {
    profile: Profile;
    email: string | null | undefined;
    updateProfileAction: (data: UpdateProfileInput) => Promise<ActionResponse<Profile>>;
    changePasswordAction: (input: ChangePasswordInput) => Promise<ActionResponse<void>>;
}

export function ProfileForm({
    profile,
    email,
    updateProfileAction,
    changePasswordAction
}: ProfileFormProps) {
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const [removing, setRemoving] = useState(false);

    

    // 1. Personal Info Form - Typed with UpdateProfileInput
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting: isSaving }
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: profile.name ?? "",
            phone: profile.phone ?? "",
            address: profile.address ?? "",
            image: profile.image ?? "",
        }
    });

    const currentImage = watch("image");

    // 2. Password Form - Typed with ChangePasswordInput
    const {
        register: registerPass,
        handleSubmit: handleSubmitPass,
        reset: resetPass,
        formState: { errors: errorsPass, isSubmitting: isPassLoading }
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    // Handle Avatar Upload
    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload/avatar", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed");

            // هنا updateProfileAction تتوقع UpdateProfileInput
            const result = await updateProfileAction({ image: data.imageUrl });
            if (result.success) {
                setValue("image", data.imageUrl);
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    }

    async function handleRemoveAvatar() {
        if (!confirm("Are you sure you want to remove your profile photo?")) return;

        setRemoving(true);
        try {
            const res = await fetch("/api/upload/avatar", { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete image from storage");

            // تحديث الداتابيز: نبعت image كـ string فارغ أو null
            const result = await updateProfileAction({ image: "" });

            if (result.success) {
                setValue("image", ""); // تحديث الحالة في الفورم فوراً
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error removing photo";
            alert(msg);
        } finally {
            setRemoving(false);
        }
    }

    // Submit Handlers with explicit types
    const onProfileSubmit: SubmitHandler<UpdateProfileInput> = async (data) => {
        setStatus(null);
        const result = await updateProfileAction(data);
        if (result.success) setStatus({ type: 'success', msg: "Profile updated successfully ✨" });
        else setStatus({ type: 'error', msg: result.error });
    };

    const onPassSubmit: SubmitHandler<ChangePasswordInput> = async (data) => {
        setPassStatus(null);
        const result = await changePasswordAction(data);
        if (result.success) {
            setPassStatus({ type: 'success', msg: "Password updated successfully 🔒" });
            resetPass();
        } else {
            setPassStatus({ type: 'error', msg: result.error });
        }
    };

    return (
        <div className="mx-auto max-w-6xl p-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    {/* Header Card */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-6">
                            <div className="relative h-24 w-24">
                                {uploading ? (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-50 border-2 border-dashed animate-spin">🔄</div>
                                ) : (
                                    <div className="relative h-24 w-24">
                                        {currentImage ? (
                                            <Image src={currentImage} alt="Avatar" fill className="rounded-full object-cover border-2 border-white shadow-md" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
                                                {watch("name")?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                        <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
                                            📸
                                            <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{watch("name") || "User Name"}</h2>
                                <p className="text-sm text-gray-500">{email}</p>
                                {currentImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        disabled={removing || uploading}
                                        className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:text-red-700 disabled:opacity-50"
                                    >
                                        {removing ? "Removing..." : "Remove Photo"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Info Form */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-6 text-lg font-bold text-gray-800">Personal Information</h3>
                        <form onSubmit={handleSubmit(onProfileSubmit)} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-1">Full Name</label>
                                <input {...register("name")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Phone Number</label>
                                <input {...register("phone")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none" />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Address</label>
                                <input {...register("address")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none" />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message as string}</p>}
                            </div>

                            <div className="md:col-span-2">
                                {status && <p className={`p-3 rounded-lg text-sm mb-2 ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{status.msg}</p>}
                                <div className="flex justify-end">
                                    <button disabled={isSaving} className="rounded-xl bg-black px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50">
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security Section */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Security</h3>
                        <form onSubmit={handleSubmitPass(onPassSubmit)} className="space-y-4">
                            <input type="password" placeholder="Current password" {...registerPass("currentPassword")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                            {errorsPass.currentPassword && <p className="text-red-500 text-[10px]">{errorsPass.currentPassword.message as string}</p>}

                            <input type="password" placeholder="New password" {...registerPass("newPassword")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                            {errorsPass.newPassword && <p className="text-red-500 text-[10px]">{errorsPass.newPassword.message as string}</p>}

                            <input type="password" placeholder="Confirm new password" {...registerPass("confirmPassword")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                            {errorsPass.confirmPassword && <p className="text-red-500 text-[10px]">{errorsPass.confirmPassword.message as string}</p>}

                            {passStatus && <p className={`text-xs p-2 rounded ${passStatus.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{passStatus.msg}</p>}

                            <button disabled={isPassLoading} className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white hover:bg-gray-900 disabled:opacity-50">
                                {isPassLoading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                    <div className="flex justify-center p-2">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}