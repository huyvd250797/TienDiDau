import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE, USER_ID } from "@/lib/constants";

function b64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function verifyPassword(password: string, stored: string) {
  try {
    const [algo, salt64, hash64] = stored.split("$");
    if (algo !== "scrypt" || !salt64 || !hash64) return false;
    const expected = Buffer.from(hash64, "base64");
    const actual = scryptSync(password, Buffer.from(salt64, "base64"), expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function createSessionToken(username: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET_MISSING");
  const payload = b64url(JSON.stringify({ u: username, exp: Date.now() + SESSION_MAX_AGE * 1000 }));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) return null;
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.exp < Date.now() || data.u !== USER_ID) return null;
    return data as { u: string; exp: number };
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requirePageSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireApiSession() {
  const session = await getSession();
  return Boolean(session);
}
