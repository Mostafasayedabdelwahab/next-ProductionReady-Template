
"use client";

import { useState } from "react";
import type { ActionResponse, Profile } from "@/features/profile/profile.types";
import Image from "next/image";
import { LogoutButton } from "@/components/shared/LogoutButton";
import Link from "next/link";
// استيراد الأكشنز مباشرة

interface ProfileFormProps {
    profile: Profile;
    email: string | null | undefined;
    updateProfileAction: (
        data: unknown
    ) => Promise<ActionResponse<Profile>>;
    changePasswordAction: (
        input: unknown
    ) => Promise<ActionResponse<void>>;
}

export function ProfileForm({ profile, email, updateProfileAction, changePasswordAction }: ProfileFormProps) {
    // Personal Info States
    const [name, setName] = useState(profile.name ?? "");
    const [phone, setPhone] = useState(profile.phone ?? "");
    const [address, setAddress] = useState(profile.address ?? "");
    const [image, setImage] = useState(profile?.image ?? "");

    // Status States
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Feedback States
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [successPassword, setSuccessPassword] = useState("");

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 1. التعامل مع رفع الصورة (هنا بنحتاج fetch لأننا بنرفع ملف لـ API خارجي/Cloudinary)
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

            // بعد رفع الصورة، نحدث البروفايل باستخدام الأكشن
            const result = await updateProfileAction({ image: data.imageUrl });
            if (result.success) {
                setImage(data.imageUrl);
            } else {
                throw new Error(result.error);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Upload failed";
            alert(message);
        } finally {
            setUploading(false);
        }
    }

    // 2. حذف الصورة باستخدام الأكشن
    async function handleRemoveAvatar() {
        if (!confirm("Are you sure you want to remove your photo?")) return;
        setRemoving(true);
        try {
            const result = await updateProfileAction({ image: null });
            if (result.success) setImage("");
            else setError(result.error || "");
        } finally {
            setRemoving(false);
        }
    }

    // 3. تحديث البيانات باستخدام الأكشن (أنظف بكتير من fetch)
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        const result = await updateProfileAction({ name, phone, address, image });

        if (result.success) {
            setSuccess("Profile updated successfully ✨");
        } else {
            setError(result.error || "Something went wrong");
        }
        setSaving(false);
    }

    // 4. تغيير الباسورد باستخدام الأكشن
    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setPasswordLoading(true);
        setErrorPassword("");
        setSuccessPassword("");

        const result = await changePasswordAction({ currentPassword, newPassword, confirmPassword });

        if (result.success) {
            setSuccessPassword("Password updated successfully 🔒");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setErrorPassword(result.error || "Failed to update password");
        }
        setPasswordLoading(false);
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* LEFT SIDE: General Info */}
                <div className="space-y-8 lg:col-span-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-6">
                            <div className="relative h-24 w-24">
                                {uploading ? (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-50 border-2 border-dashed">
                                        <span className="animate-spin">🔄</span>
                                    </div>
                                ) : (
                                    <div className="relative h-24 w-24">
                                        {image ? (
                                            <Image src={image} alt="Avatar" fill className="rounded-full object-cover border-2 border-white shadow-md" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
                                                {name?.charAt(0).toUpperCase() || "U"}
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
                                <h2 className="text-xl font-bold">{name || "User Name"}</h2>
                                <p className="text-sm text-gray-500">{email}</p>
                                {image && (
                                    <button onClick={handleRemoveAvatar} disabled={removing} className="mt-2 text-xs text-red-500 font-medium hover:underline">
                                        {removing ? "Removing..." : "Remove photo"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-6 text-lg font-bold text-gray-800">Personal Information</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-1">Full Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Phone Number</label>
                                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none" placeholder="+1 234..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Address</label>
                                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none" placeholder="City, Country" />
                            </div>

                            <div className="md:col-span-2">
                                {error && <p className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-2">{error}</p>}
                                {success && <p className="p-3 bg-green-50 text-green-600 rounded-lg text-sm mb-2">{success}</p>}
                                <div className="flex justify-end">
                                    <button disabled={saving} className="rounded-xl bg-black px-8 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50">
                                        {saving ? "Saving Changes..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE: Security */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Security</h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                            <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />

                            {errorPassword && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{errorPassword}</p>}
                            {successPassword && <p className="text-xs text-green-600 bg-green-50 p-2 rounded">{successPassword}</p>}

                            <button disabled={passwordLoading} className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white transition-all hover:bg-gray-900 disabled:opacity-50">
                                {passwordLoading ? "Updating..." : "Update Password"}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t">
                            <Link href="/forgot-password" title="Reset via email" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Forgot password?
                            </Link>
                            <p className="text-xs text-gray-400 mt-1">We&apos;ll send a reset link to your email.</p>
                        </div>
                    </div>

                    <div className="flex justify-center p-2">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );
} 