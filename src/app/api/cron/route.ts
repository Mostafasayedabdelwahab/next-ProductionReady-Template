import { NextResponse } from "next/server";
import {
  cleanupExpiredTokens,
  cleanupUnverifiedUsers,
} from "@/features/cron/cleanup.service";

import { requireCron } from "@/lib/guards";

export async function GET(req: Request) {

  requireCron(req);
  
  await cleanupExpiredTokens();
  await cleanupUnverifiedUsers();

  return NextResponse.json({ success: true });
}
