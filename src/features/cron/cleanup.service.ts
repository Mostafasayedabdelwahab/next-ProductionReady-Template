import prisma from "@/lib/prisma";

export async function cleanupExpiredTokens() {
  await prisma.emailVerificationToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
}

export async function cleanupUnverifiedUsers() {
  const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  await prisma.user.deleteMany({
    where: {
      emailVerified: null,
      createdAt: {
        lt: sevenDaysAgo,
      },
    },
  });
}
