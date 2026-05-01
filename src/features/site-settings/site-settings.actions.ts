"use server";

import { handleActionError } from "@/utils/action-helper";
import {
  getSiteSettingsService,
  updateSiteSettingsService,
} from "./site-settings.service";
import type { SiteSettingsDTO } from "./site-settings.types";
import { revalidatePath } from "next/cache"; // 2. Added for cache clearing
import { requireAdmin } from "@/guards";

/**
 * Fetch site settings
 * Accessible by authenticated users/admins to display in dashboard
 */
export async function getSiteSettingsAction() {
  try {
    // Verification: Ensure the requester is a valid user
    await requireAdmin();

    const data = await getSiteSettingsService();
    return {
      success: true as const,
      data,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Update site settings
 * STRICTLY for Admins only
 */
export async function updateSiteSettingsAction(data: SiteSettingsDTO) {
  try {
    // 1. Authorization: Only admins can perform this update
    await requireAdmin();

    // 3. Execution: Update the database via service
    const result = await updateSiteSettingsService(data);

    // 4. Cache Management: Update all pages using these settings
    revalidatePath("/", "layout");

    return {
      success: true as const,
      data: result,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
