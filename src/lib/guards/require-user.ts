// src/lib/guards/require-user.ts
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if (!user.isActive) {
    throw new Response("Account disabled", { status: 403 });
  }

  return user;
}
