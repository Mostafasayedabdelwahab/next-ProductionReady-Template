import { z } from "zod";
import {
  changePasswordSchema,
  createProfileSchema,
  updateProfileSchema,
} from "./profile.schema";

export type CreateProfileInput = z.infer<typeof createProfileSchema>;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Profile entity returned from database
 */
// تعديل بسيط في profile.types.ts
export type Profile = {
  id: string;
  userId: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  // أضف ده عشان الـ Autocomplete والـ Types
  user?: {
    email: string;
    isActive: boolean;
  };
};

export type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };