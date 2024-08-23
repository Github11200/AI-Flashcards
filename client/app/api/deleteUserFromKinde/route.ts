import { clerkClient } from "@clerk/nextjs/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Users, init } from "@kinde/management-api-js";

export async function POST(req: NextRequest, res: NextResponse) {
  init();

  const { userId } = await req.json();
  // console.log(userId);

  await fetch(`${process.env.KINDE_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      audience: "<auth_domain>/api",
      grant_type: "client_credentials",
      client_id: process.env.KINDE_CLIENT_ID as string,
      client_secret: process.env.KINDE_CLIENT_SECRET as string,
    }),
  })
    .then(async (response) => {
      return await response.json();
    })
    .then(async (data) => {
      console.log(data);
    });

  // Users.deleteUser({ id: userId, isDeleteProfile: true });

  return new Response(JSON.stringify({ success: true }));
}
