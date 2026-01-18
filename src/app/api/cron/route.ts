import { NextResponse } from "next/server";
import {
  cleanupExpiredTokens,
  cleanupUnverifiedUsers,
} from "@/features/cron/cleanup.service";


export async function GET() {
  await cleanupExpiredTokens();
  await cleanupUnverifiedUsers();

  return NextResponse.json({ success: true });
}
