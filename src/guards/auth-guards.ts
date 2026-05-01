import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Role, User } from "@/generated/prisma/client";

const ROLE_PRIORITY = {
  ADMIN: 3,
  EDITOR: 2,
  USER: 1,
};

export async function requireAuthUser(): Promise<User> {
  const session = await getServerSession(authOptions);

  // Check if session exists and contains user ID
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  // Fetch the latest user data from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Security checks
  if (!user) throw new Error("UNAUTHORIZED");
  if (!user.isActive) throw new Error("ACCOUNT_DISABLED");

  // Validate Session Version (Security: forces logout if version mismatch)
  if (user.sessionVersion !== session.user.sessionVersion) {
    throw new Error("SESSION_EXPIRED");
  }

  // Validate Password Change Timestamp (Security: invalidates old tokens after password change)
  if (
    user.passwordChangedAt &&
    session.user.passwordChangedAt &&
    new Date(user.passwordChangedAt) > new Date(session.user.passwordChangedAt)
  ) {
    throw new Error("PASSWORD_CHANGED");
  }

  return user;
}

export async function requireUser(): Promise<User> {
  const user = await requireAuthUser();

  if (!user.emailVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  return user;
}

async function requireRole(minRole: Role): Promise<User> {
  const user = await requireUser();

  if (
    ROLE_PRIORITY[user.role] === undefined ||
    ROLE_PRIORITY[minRole] === undefined ||
    ROLE_PRIORITY[user.role] < ROLE_PRIORITY[minRole]
  ) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export const requireAdmin = () => requireRole(Role.ADMIN);
export const requireEditor = () => requireRole(Role.EDITOR);
