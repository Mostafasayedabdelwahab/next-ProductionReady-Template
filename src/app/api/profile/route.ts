/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {
  getOrCreateProfile,
  updateUserProfile,
} from "@/features/profile/profile.service";
import { requireVerifiedUser } from "@/lib/guards";
import { handleApiError } from "@/lib/utils/api-helper";

/**
 * GET /api/profile
 */
export async function GET() {
  try {
    const user = await requireVerifiedUser();
    const profile = await getOrCreateProfile(user.id);
    return NextResponse.json(profile);
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/profile
 */
export async function PATCH(req: Request) {
  try {
    const user = await requireVerifiedUser();
    const body = await req.json();
    const updatedProfile = await updateUserProfile(user.id, body);
    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    return handleApiError(error);
  }
}
