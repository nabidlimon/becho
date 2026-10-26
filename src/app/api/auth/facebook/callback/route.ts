import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/auth/facebook/callback
 * Handles OAuth code exchange with Meta Graph API, upgrades to a long-lived user token,
 * fetches all connected Facebook Pages with permanent Page Access Tokens, and returns
 * the result to the opener window or redirects to the onboarding wizard.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Dynamically resolve origin from request headers to prevent domain mismatches
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = forwardedHost || req.headers.get("host") || req.nextUrl.host;
  const proto = forwardedProto || (host.includes("localhost") ? "http" : "https");
  const appUrl = (host && !host.includes("undefined"))
    ? `${proto}://${host}`
    : config.appUrl.replace(/\/$/, "");

  const redirectUri = `${appUrl}/api/auth/facebook/callback`;

  // Handle OAuth error/cancellation from Facebook
  if (error || !code) {
    const errorMsg = errorDescription || error || "Facebook authorization was cancelled.";
    return renderHtmlResponse({
      success: false,
      error: errorMsg,
      pages: [],
    });
  }

  try {
    // 1. Exchange authorization code for short-lived User Access Token
    const tokenUrl = `${config.meta.graphBaseUrl}/${config.meta.apiVersion}/oauth/access_token?` +
      new URLSearchParams({
        client_id: config.meta.appId,
        client_secret: config.meta.appSecret,
        redirect_uri: redirectUri,
        code,
      });

    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(
        tokenData.error?.message || "Failed to exchange code for access token"
      );
    }

    const shortLivedUserToken = tokenData.access_token;

    // 2. Exchange short-lived User Token for a 60-day Long-Lived User Token
    const longLivedUrl = `${config.meta.graphBaseUrl}/${config.meta.apiVersion}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: config.meta.appId,
        client_secret: config.meta.appSecret,
        fb_exchange_token: shortLivedUserToken,
      });

    const longLivedRes = await fetch(longLivedUrl);
    const longLivedData = await longLivedRes.json();
    const longLivedUserToken = longLivedData.access_token || shortLivedUserToken;

    // 3. Fetch user's managed Facebook Pages with permanent Page Access Tokens
    const pagesUrl = `${config.meta.graphBaseUrl}/${config.meta.apiVersion}/me/accounts?` +
      new URLSearchParams({
        fields: "id,name,access_token,category,picture{url}",
        access_token: longLivedUserToken,
      });

    const pagesRes = await fetch(pagesUrl);
    const pagesData = await pagesRes.json();

    if (!pagesRes.ok) {
      throw new Error(pagesData.error?.message || "Failed to fetch Facebook Pages");
    }

    const rawPages = Array.isArray(pagesData.data) ? pagesData.data : [];

    const pages = rawPages.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category || "Business",
      avatarUrl: p.picture?.data?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      pageAccessToken: p.access_token, // Permanent page access token
    }));

    return renderHtmlResponse({
      success: true,
      pages,
    });
  } catch (err: any) {
    console.error("Facebook OAuth callback error:", err);
    return renderHtmlResponse({
      success: false,
      error: err.message || "Failed to connect Facebook account",
      pages: [],
    });
  }
}

function renderHtmlResponse(data: { success: boolean; error?: string; pages: any[] }) {
  const safeData = JSON.stringify(data);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Becho - Facebook Connection</title>
  <style>
    body {
      background-color: #070b14;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 32px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .success .icon { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .error .icon { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    h2 { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
    p { margin: 0 0 16px; color: #94a3b8; font-size: 13px; line-height: 1.5; }
  </style>
</head>
<body class="${data.success ? "success" : "error"}">
  <div class="card">
    <div class="icon">${data.success ? "✓" : "✕"}</div>
    <h2>${data.success ? "Facebook Connected!" : "Connection Failed"}</h2>
    <p>${
      data.success
        ? `Found ${data.pages.length} Facebook Page${data.pages.length === 1 ? "" : "s"}. Returning to Becho...`
        : data.error || "An error occurred while connecting."
    }</p>
  </div>
  <script>
    (function() {
      const result = ${safeData};
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'META_OAUTH_RESPONSE', ...result }, '*');
        setTimeout(function() {
          window.close();
        }, 1000);
      } else {
        setTimeout(function() {
          window.location.href = '/onboarding';
        }, 1500);
      }
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
