import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  cleanupExpiredTokens,
  cleanupUnverifiedUsers,
} from "@/features/cron/cleanup.service";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  await cleanupExpiredTokens();
  await cleanupUnverifiedUsers();

  return NextResponse.json("Cron Job ", { status: 200 });
}
