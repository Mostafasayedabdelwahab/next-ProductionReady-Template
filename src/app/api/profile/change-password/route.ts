/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { changeUserPassword } from "@/features/profile/profile.service";
import { requireVerifiedUser } from "@/lib/guards";
import { handleApiError } from "@/lib/utils/api-helper";

export async function PATCH(req: Request) {
  try {
    // 1. الحماية: التأكد من اليوزر وصلاحيته
    const user = await requireVerifiedUser();

    // 2. استلام البيانات
    const body = await req.json();

    // 3. تنفيذ العملية من خلال السيرفس
    await changeUserPassword(user.id, body);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // 4. هندلة الخطأ بشكل موحد
    return handleApiError(error);
  }
}
