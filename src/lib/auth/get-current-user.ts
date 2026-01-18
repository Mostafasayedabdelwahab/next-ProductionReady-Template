// src/lib/auth/get-current-user.ts
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession(); // أو getServerSession

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user;
}


