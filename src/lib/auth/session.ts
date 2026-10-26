import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { UserSession } from "../db/types";

const SESSION_COOKIE_NAME = "becho_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.ENCRYPTION_KEY ||
    process.env.META_APP_SECRET ||
    "becho_super_secure_production_session_signing_secret_2026_xyz";
  return new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 32));
}

/**
 * Creates a signed JWT session token.
 */
export async function createSessionToken(payload: UserSession): Promise<string> {
  const secretKey = getSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and returns the session payload.
 */
export async function verifySessionToken(token?: string | null): Promise<UserSession | null> {
  if (!token) return null;
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

/**
 * Attaches the session cookie to an outgoing NextResponse.
 */
export function setSessionCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * Clears the session cookie from an outgoing NextResponse.
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Extracts and verifies the user session from an incoming NextRequest.
 */
export async function getSession(req: NextRequest): Promise<UserSession | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return await verifySessionToken(token);
}
