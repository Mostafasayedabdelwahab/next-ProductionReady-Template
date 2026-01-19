import prisma from "@/lib/prisma";
import { CreateUserInput } from "./user.types";

// ? User

export async function createUser(
  data: Pick<CreateUserInput, "email" | "password" | "name">,
) {
  return prisma.user.create({
    data,
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserNameById(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  return user?.name ?? null;
}

// ? Password

export async function createPasswordResetToken(data: {
  userId: string;
  token: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({ data });
}

export async function findValidPasswordResetTokenByUser(userId: string) {
  return prisma.passwordResetToken.findFirst({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
  });
}

export async function getValidResetTokens() {
  return prisma.passwordResetToken.findMany({
    where: {
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
}

export async function deletePasswordResetToken(id: string) {
  return prisma.passwordResetToken.delete({
    where: { id },
  });
}

export async function updateUserPassword(userId: string, password: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      password,
      passwordChangedAt: new Date(),
      sessionVersion: {
        increment: 1,
      },
    },
  });
}

export async function findLastPasswordResetToken(userId: string) {
  return prisma.passwordResetToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// ? EmailVerified

export async function createEmailVerificationToken(data: {
  userId: string;
  token: string;
  expiresAt: Date;
}) {
  return prisma.emailVerificationToken.create({
    data,
  });
}

export async function markUserEmailVerified(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  });
}

export async function findValidEmailVerificationTokens() {
  return prisma.emailVerificationToken.findMany({
    where: {
      expiresAt: { gt: new Date() },
    },
  });
}

export async function deleteEmailVerificationToken(id: string) {
  return prisma.emailVerificationToken.deleteMany({
    where: { id },
  });
}

export async function findLastEmailVerificationToken(userId: string) {
  return prisma.emailVerificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
