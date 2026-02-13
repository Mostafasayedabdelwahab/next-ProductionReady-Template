import bcrypt from "bcryptjs";

import {
  getUserNameById,
  getUserById,
  updateUserPassword,
} from "../user/user.repository";
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
} from "./profile.repository";

import {
  createProfileSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "./profile.schema";

import type {
  CreateProfileInput,
  UpdateProfileInput,
  Profile,
} from "./profile.types";
import { ERROR_CODES } from "@/lib/constants/errors";
/**
 * Get profile for logged-in user
 * If profile does not exist, create one
 */
export async function getOrCreateProfile(userId: string): Promise<Profile> {
  const existingProfile = await getProfileByUserId(userId);

  if (existingProfile) {
    return existingProfile;
  }

  // 👇 الاسم جاي من user.repository
  const name = await getUserNameById(userId);

  // Create empty profile on first access
  const data: CreateProfileInput = createProfileSchema.parse({
    userId,
    name: name ?? undefined,
  });

  return createProfile(data);
}

/**
 * Update profile for logged-in user
 */
export async function updateUserProfile(
  userId: string,
  input: unknown,
): Promise<Profile> {
  // Validate input (runtime safety)
  const data: UpdateProfileInput = updateProfileSchema.parse(input);

  return updateProfile(userId, data);
}

export async function changeUserPassword(userId: string, input: unknown) {
  const data = changePasswordSchema.parse(input);
  const user = await getUserById(userId);

  // تعديل: استخدام الكود الموحد لو اليوزر مش موجود
  if (!user || !user.password) {
    throw new Error(ERROR_CODES.NOT_FOUND);
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.password);

  // تعديل: هنا ممكن ترمي UNAUTHORIZED أو كود مخصص للباسورد الغلط
  if (!isValid) {
    throw new Error("INVALID_CURRENT_PASSWORD");
    // ملاحظة: روح ضيف INVALID_CURRENT_PASSWORD في ملف errors.ts عشان تترجمها
  }

  const isSamePassword = await bcrypt.compare(data.newPassword, user.password);

  if (isSamePassword) {
    throw new Error("SAME_PASSWORD_ERROR");
    // ضيفها برضه في الـ Dictionary في ملف errors.ts
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  // التحسين الأهم: تحديث الباسورد وزيادة الـ sessionVersion
  await updateUserPassword(userId, hashedPassword);
}