// src/app/api/cron/cleanup/route.ts
import { headers } from "next/headers";
import { cleanupExpiredTokens, cleanupUnverifiedUsers } from "@/features/cron/cleanup.service";

export async function POST() {
  const h = headers();
  const ua = (await h).get("user-agent") || "";

  // تأكيد إنه من Vercel
  if (!ua.toLowerCase().includes("vercel")) {
    return new Response("Forbidden", { status: 403 });
  }

  await cleanupExpiredTokens();
  await cleanupUnverifiedUsers();

  return Response.json({ success: true });
}
