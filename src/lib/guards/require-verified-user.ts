import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth";
import { NextResponse } from "next/server";

export async function requireVerifiedUser() {
  // 1) هات الـ session من NextAuth
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2) هات الـ user الحقيقي من الداتابيز
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 3) account enabled؟
  if (user.isActive === false) {
    return NextResponse.json({ message: "Account disabled" }, { status: 403 });
  }

  // 4) email verified؟
  if (!user.emailVerified) {
    return NextResponse.json({ message: "Email not verified" }, { status: 403 });
  }

  // 5) رجّع user جاهز للاستخدام
  return user;
}
