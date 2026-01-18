import { NextResponse } from "next/server";
import {
  cleanupExpiredTokens,
  cleanupUnverifiedUsers,
} from "@/features/cron/cleanup.service";

export async function GET() {
  console.log("CRON HIT", new Date().toISOString());
  await cleanupExpiredTokens();
  await cleanupUnverifiedUsers();

  return NextResponse.json({ success: true });
}
