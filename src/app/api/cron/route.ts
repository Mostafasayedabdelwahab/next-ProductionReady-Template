import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  cleanupExpiredTokens,
  cleanupUnverifiedUsers,
} from "@/features/cron/cleanup.service";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    await cleanupExpiredTokens();
    await cleanupUnverifiedUsers();

    return NextResponse.json({
      success: true,
      message: "Cron cleanup executed",
    });
  } catch (error) {
    console.error("CRON ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Cron failed" },
      { status: 500 },
    );
  }
}