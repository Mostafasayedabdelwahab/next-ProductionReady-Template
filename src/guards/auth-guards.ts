import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Role } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/get-locale";
import { cookies } from "next/headers";

const ROLE_PRIORITY = {
  ADMIN: 3,
  EDITOR: 2,
  USER: 1,
};

async function logoutServer() {
  const c = await cookies();
  c.delete("next-auth.session-token");
  c.delete("__Secure-next-auth.session-token");
  c.delete("next-auth.csrf-token");
}

export async function requireAuthUser() {
  const locale = await getLocale();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.isActive) {
    await logoutServer();
    redirect(`/${locale}/login`);
  }

  return { user, locale };
}

export async function requireUser() {
  const { user, locale } = await requireAuthUser();

  if (!user.emailVerified) {
    redirect(`/${locale}/verify-email`);
  }

  return user;
}

async function requireRole(minRole: Role) {
  const { user, locale } = await requireAuthUser();

  if (
    ROLE_PRIORITY[minRole] === undefined ||
    ROLE_PRIORITY[user.role] < ROLE_PRIORITY[minRole]
  ) {
    redirect(`/${locale}/unauthorized`);
  }

  return user;
}

export const requireAdmin = () => requireRole(Role.ADMIN);
export const requireEditor = () => requireRole(Role.EDITOR);
