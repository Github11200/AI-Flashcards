import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { userId } = await req.json();

  await clerkClient.users.deleteUser(userId);

  return new Response(JSON.stringify({ success: true }));
}
