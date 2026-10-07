import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "barbier_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD manquante dans .env.local");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createAdminSession() {
  const payload = `${Date.now() + SESSION_TTL_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(value: string | undefined) {
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;

  const expected = sign(expiresAt);
  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function isAdminAuthenticated() {
  return isValidAdminSession((await cookies()).get(COOKIE_NAME)?.value);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_TTL_SECONDS,
};
