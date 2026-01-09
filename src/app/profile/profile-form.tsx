"use client";

import { useState } from "react";
import type { Profile } from "@/features/profile/profile.types";
import Image from "next/image";
import { LogoutButton } from "@/components/shared/LogoutButton";
import Link from "next/link";


interface ProfileFormProps {
    profile: Profile;
    email: string | null | undefined;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
    const [name, setName] = useState(profile.name ?? "");
    const [phone, setPhone] = useState(profile.phone ?? "");
    const [address, setAddress] = useState(profile.address ?? "");
    const [image, setImage] = useState(profile?.image ?? "");
    const [message, setMessage] = useState("");

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleAvatarUpload(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload/avatar", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setImage(data.imageUrl);

            await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: data.imageUrl }),
            });
        } catch {
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    }

    async function handleRemoveAvatar() {
        setRemoving(true);

        try {
            await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: null }),
            });

            setImage("");
        } catch {
            alert("Failed to remove image");
        } finally {
            setRemoving(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage("");

        const res = await fetch("/api/profile/change-password", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setPasswordMessage(data.message);
        } else {
            setPasswordMessage("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }

        setPasswordLoading(false);
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        const res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, address, image }),
        });

        setMessage(
            res.ok
                ? "Profile updated successfully"
                : "Something went wrong"
        );

        setSaving(false);
    }


    return (
        <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* =========================
                LEFT SIDE (2 cols)
            ========================= */}
                <div className="space-y-8 lg:col-span-2">

                    {/* Profile Header */}
                    <div className="rounded-2xl bg-white p-6 shadow">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="relative h-24 w-24 shrink-0">
                                {uploading ? (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                                        <span className="animate-spin text-sm">⏳</span>
                                    </div>
                                ) : image ? (
                                    <Image
                                        src={image}
                                        alt="Avatar"
                                        fill
                                        className="rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-600">
                                        {name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}

                                {/* Upload */}
                                <label
                                    className={`absolute -bottom-1 -right-1 rounded-full p-1.5 text-xs text-white
                                ${uploading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-black cursor-pointer hover:bg-gray-800"
                                        }`}
                                >
                                    ✏️
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        disabled={uploading}
                                        onChange={handleAvatarUpload}
                                    />
                                </label>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold">
                                    {name || "Your Name"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {email}
                                </p>

                                {image && (
                                    <button
                                        type="button"
                                        disabled={removing}
                                        onClick={handleRemoveAvatar}
                                        className="mt-2 text-xs text-red-500 hover:underline disabled:opacity-50"
                                    >
                                        {removing ? "Removing..." : "Remove photo"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="rounded-2xl bg-white p-6 shadow">
                        <h3 className="mb-6 text-lg font-semibold">
                            Personal Information
                        </h3>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium">
                                    Full Name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Phone Number
                                </label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Address
                                </label>
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-black focus:outline-none"
                                />
                            </div>

                            {message && (
                                <p className="md:col-span-2 text-sm text-green-600">
                                    {message}
                                </p>
                            )}

                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    disabled={saving}
                                    className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* =========================
                RIGHT SIDE (Security)
            ========================= */}
                <div className="rounded-2xl bg-white p-6 shadow space-y-6">
                    <h3 className="text-lg font-semibold">
                        Security
                    </h3>

                    {/* Change Password */}
                    <form
                        onSubmit={handleChangePassword}
                        className="space-y-3"
                    >
                        <input
                            type="password"
                            placeholder="Current password"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {passwordMessage && (
                            <p className="text-sm text-red-500">
                                {passwordMessage}
                            </p>
                        )}

                        <button
                            disabled={passwordLoading}
                            className="w-full rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                        >
                            {passwordLoading ? "Updating..." : "Update password"}
                        </button>
                    </form>

                    {/* Forgot password */}
                    <div className="text-sm">
                        <Link
                            href="/forgot-password"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                        <p className="text-xs text-gray-400">
                            We’ll send you a reset link via email.
                        </p>
                    </div>

                    <hr />

                    {/* Logout */}
                    <div className="flex justify-end">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );


}
