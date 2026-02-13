import { NextResponse } from "next/server";
import { changeUserPassword } from "@/features/profile/profile.service";
import { requireVerifiedUser } from "@/lib/guards";
import { handleApiError } from "@/lib/utils/api-helper";
import { ChangePasswordInput } from "@/features/profile/profile.types";

export async function PATCH(req: Request) {
  try {
    const user = await requireVerifiedUser();
    const body: ChangePasswordInput = await req.json();

    await changeUserPassword(user.id, body);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
