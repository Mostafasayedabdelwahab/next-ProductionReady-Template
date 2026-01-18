// src/lib/guards/require-admin.ts
import { requireVerifiedUser } from "./require-verified-user";

export async function requireAdmin() {
  const user = await requireVerifiedUser();

  if (user.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }

  return user;
}
