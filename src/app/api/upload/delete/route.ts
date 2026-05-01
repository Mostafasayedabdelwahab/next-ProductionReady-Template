import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireUser } from "@/guards";

export async function POST(req: Request) {
  const user = await requireUser();

  if (user.email === process.env.ADMIN_DEMO_EMAIL) {
    return new Response("Demo not allowed", { status: 403 });
  }
  const { public_id, resource_type } = await req.json();

  if (!public_id) {
    return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
  }

  await cloudinary.uploader.destroy(public_id, {
    resource_type: resource_type || "image",
  });

  return NextResponse.json({ success: true });
}
