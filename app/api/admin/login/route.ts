import { NextResponse } from "next/server";
import { adminCookie, createAdminSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const password = (await req.json().catch(() => null))?.password;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) return NextResponse.json({ error: "Configuration admin manquante" }, { status: 500 });
  if (typeof password !== "string" || password !== expected) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie.name, createAdminSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  return response;
}
