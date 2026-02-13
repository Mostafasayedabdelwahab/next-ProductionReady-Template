import bcrypt from "bcryptjs";
import { ERROR_CODES } from "@/lib/constants/errors"; // استيراد الأكواد المركزية
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

/**
 * جلب البروفايل أو إنشاؤه
 */
export async function getOrCreateProfile(userId: string): Promise<Profile> {
  const existingProfile = await getProfileByUserId(userId);

  if (existingProfile) {
    return existingProfile;
  }

  const name = await getUserNameById(userId);

  // استخدام parse هنا ممكن يرمي ZodError والأكشن هيهندله
  const data: CreateProfileInput = createProfileSchema.parse({
    userId,
    name: name ?? undefined,
  });

  return createProfile(data);
}

/**
 * تحديث بيانات البروفايل
 */
export async function updateUserProfile(
  userId: string,
  input: unknown,
): Promise<Profile> {
  const data: UpdateProfileInput = updateProfileSchema.parse(input);
  return updateProfile(userId, data);
}

/**
 * تغيير كلمة المرور
 */
export async function changeUserPassword(userId: string, input: unknown) {
  // 1. التحقق من صحة المدخلات (Zod)
  const data = changePasswordSchema.parse(input);

  // 2. جلب بيانات المستخدم
  const user = await getUserById(userId);

  if (!user || !user.password) {
    throw new Error(ERROR_CODES.NOT_FOUND);
  }

  // 3. التحقق من كلمة المرور الحالية
  const isValid = await bcrypt.compare(data.currentPassword, user.password);

  if (!isValid) {
    // استخدمنا الثابت اللي ضفناه في ملف الـ constants
    throw new Error(ERROR_CODES.INVALID_CURRENT_PASSWORD);
  }

  // 4. التحقق إن الباسورد الجديد مش هو هو القديم
  const isSamePassword = await bcrypt.compare(data.newPassword, user.password);

  if (isSamePassword) {
    throw new Error(ERROR_CODES.SAME_PASSWORD_ERROR);
  }

  // 5. تشفير وحفظ الباسورد الجديد
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  // ملاحظة: بما إنك لغيت الـ sessionVersion، الـ Repository هنا بيحدث الباسورد فقط
  await updateUserPassword(userId, hashedPassword);
}
