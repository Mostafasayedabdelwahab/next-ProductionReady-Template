// src/app/api/cron/cleanup/route.ts
import {
  cleanupExpiredTokens,
  cleanupUnverifiedUsers,
} from "@/features/cron/cleanup.service";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  await cleanupExpiredTokens();
  await cleanupUnverifiedUsers();

  return Response.json({
    success: true,
    ranAt: new Date().toISOString(),
  });
}
