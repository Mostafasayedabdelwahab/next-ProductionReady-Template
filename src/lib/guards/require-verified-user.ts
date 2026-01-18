// src/lib/guards/require-verified-user.ts
// import { requireUser } from "./require-user";

// export async function requireVerifiedUser() {
//   const user = await requireUser();

//   if (!user.emailVerified) {
//     throw new Response("Email not verified", { status: 403 });
//   }

//   return user;
// }


import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth";

export async function requireVerifiedUser() {
  // 1) هات الـ session من NextAuth
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // 2) هات الـ user الحقيقي من الداتابيز
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // 3) account enabled؟
  if (user.isActive === false) {
    throw new Response("Account disabled", { status: 403 });
  }

  // 4) email verified؟
  if (!user.emailVerified) {
    throw new Response("Email not verified", { status: 403 });
  }

  // 5) رجّع user جاهز للاستخدام
  return user;
}
