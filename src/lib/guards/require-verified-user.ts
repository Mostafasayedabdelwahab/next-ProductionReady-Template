// src/lib/guards/index.ts
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth";

export async function requireVerifiedUser() {
  const session = await getServerSession(authOptions);

  // 1) تشيك السيشن الأساسي
  if (!session || !session.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  // 2) نجيب اليوزر 
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) throw new Error("UNAUTHORIZED");

  // 3) الحساب مفعل؟
  if (user.isActive === false) throw new Error("ACCOUNT_DISABLED");

  // 4) الإيميل مفعل؟
  if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");

  // 5) Session Invalidation 
  // if (user.sessionVersion !== session.user.sessionVersion) {
  //   throw new Error("SESSION_EXPIRED");
  // }

  return user;
}
