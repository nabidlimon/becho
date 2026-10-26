import { NextRequest, NextResponse } from "next/server";
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
  const appUrl = (host && !host.includes("undefined"))
    ? `${proto}://${host}`
    : config.appUrl.replace(/\/$/, "");

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

  // Meta permissions needed to manage Messenger chat & webhook subscriptions
  const scopes = [
    "pages_show_list",
    "pages_messaging",
    "pages_manage_metadata",
  ].join(",");

  const state = Math.random().toString(36).substring(2, 15);

  const authUrl = `https://www.facebook.com/${config.meta.apiVersion}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}&response_type=code&state=${state}`;

  if (redirectParam) {
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.json({
    configured: true,
    authUrl,
    redirectUri,
  });
}
