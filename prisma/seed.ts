import prisma from "../src/lib/prisma";
import { Role } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_DEMO_EMAIL || "admin@demo.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: "Demo Admin",
      role: Role.ADMIN,
      isActive: true,
      emailVerified: new Date(),

      profile: {
        create: {
          name: "Demo Admin",
        },
      },
    },
  });

  console.log("✅ Admin seeded");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
