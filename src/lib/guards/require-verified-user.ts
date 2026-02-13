// src/lib/guards/index.ts
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth";
import { ERROR_CODES } from "@/lib/constants/errors";

export async function requireVerifiedUser() {
  const session = await getServerSession(authOptions);

  // 1) تشيك السيشن الأساسي
  if (!session || !session.user?.id) {
    throw new Error(ERROR_CODES.UNAUTHORIZED);
  }

  // 2) جلب اليوزر من الداتابيز
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error(ERROR_CODES.UNAUTHORIZED);
  }

  // 3) الحساب معطل؟
  if (user.isActive === false) {
    throw new Error(ERROR_CODES.ACCOUNT_DISABLED);
  }

  // 4) الإيميل غير مفعل؟
  if (!user.emailVerified) {
    throw new Error(ERROR_CODES.EMAIL_NOT_VERIFIED);
  }

  // رجوع اليوزر بكل بياناته لاستخدامها في الأكشنز
  return user;
}
