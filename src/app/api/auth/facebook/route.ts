import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/auth/facebook
 * Returns OAuth authorization URL or redirects to Facebook Login dialog.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const redirectParam = searchParams.get("redirect") === "true";

  const appId = config.meta.appId;

  // Dynamically resolve origin from request headers to prevent domain mismatches
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = forwardedHost || req.headers.get("host") || req.nextUrl.host;
  const proto = forwardedProto || (host.includes("localhost") ? "http" : "https");

  let appUrl: string;
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    appUrl = `http://${host}`;
  } else if (host.includes(".vercel.app")) {
    // Vercel deployment domains (*.vercel.app) cannot be added to Meta App Domains (public suffix).
    // Always use canonical production domain for OAuth dialogs.
    appUrl = "https://mbot.nanolez.tech";
  } else if (host && !host.includes("undefined")) {
    appUrl = `${proto}://${host}`;
  } else {
    appUrl = config.appUrl.replace(/\/$/, "");
  }

  const redirectUri = `${appUrl}/api/auth/facebook/callback`;

  const isConfigured = Boolean(appId && config.meta.appSecret);

  if (!isConfigured) {
    if (redirectParam) {
      return NextResponse.redirect(
        new URL(
          `/onboarding?error=${encodeURIComponent(
            "META_APP_ID or META_APP_SECRET is not configured in .env.local"
          )}`,
          req.url
        )
      );
    }
    return NextResponse.json({
      configured: false,
      message:
        "Meta App ID and Secret must be configured in .env.local to enable live OAuth.",
      appId: appId || null,
      redirectUri,
    });
  }

  // Meta permissions needed: user login + Messenger chat & webhook subscriptions
  const scopes = [
    "public_profile",
    "email",
    "pages_show_list",
    "pages_messaging",
    "pages_manage_metadata",
  ].join(",");

  // Construct tamper-proof signed state token containing timestamp, redirectUri, and random nonce
  const statePayload = Buffer.from(
    JSON.stringify({
      t: Date.now(),
      r: redirectUri,
      n: Math.random().toString(36).substring(2, 10),
    })
  ).toString("base64url");

  const stateSignature = crypto
    .createHmac("sha256", config.meta.appSecret || "becho_fallback_secret")
    .update(statePayload)
    .digest("hex")
    .substring(0, 16);

  const state = `${statePayload}.${stateSignature}`;

  const authUrl = `https://www.facebook.com/${config.meta.apiVersion}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}&response_type=code&state=${state}`;

  const wantsRedirect = searchParams.get("redirect") === "true";
  const wantsJson =
    searchParams.get("format") === "json" ||
    req.headers.get("accept") === "application/json" ||
    (!wantsRedirect && searchParams.get("redirect") !== "true");

  // If JSON is requested (e.g., from onboarding popup helper), return JSON with authUrl
  const response = wantsJson && !wantsRedirect
    ? NextResponse.json({
        configured: true,
        authUrl,
        redirectUri,
      })
    : NextResponse.redirect(authUrl);

  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

  response.cookies.set("becho_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !isLocal,
    sameSite: "lax",
    path: "/",
    maxAge: 900, // 15 minutes
  });

  return response;
}
