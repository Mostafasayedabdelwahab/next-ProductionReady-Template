import { z } from "zod";
import * as profileSchema from "./profile.schema";

/**
 * Profile input types inferred from Zod schemas
 */
export type CreateProfileInput = z.infer<
  typeof profileSchema.createProfileSchema
>;
export type UpdateProfileInput = z.infer<
  typeof profileSchema.updateProfileSchema
>;
export type ChangePasswordInput = z.infer<
  typeof profileSchema.changePasswordSchema
>;

/**
 * Profile entity returned from database
 */
export type Profile = {
  id: string;
  userId: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Optional relation for convenience in UI
  user?: {
    email: string;
    isActive: boolean;
  };
};

/**
 * Unified action response shape (must match user.types)
 */

export type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };