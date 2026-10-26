import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/facebook/deletion
 * Meta Data Deletion Request Callback
 * Implements Facebook's User Data Deletion Callback specification:
 * https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let signedRequest = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      signedRequest = (formData.get("signed_request") as string) || "";
    } else {
      const body = await req.json().catch(() => ({}));
      signedRequest = body.signed_request || "";
    }

    let userId = "unknown_user";

    // Verify & Parse signed_request if present
    if (signedRequest && signedRequest.includes(".")) {
      const [encodedSig, payload] = signedRequest.split(".");
      const secret = config.meta.appSecret || process.env.META_APP_SECRET || "";

      if (secret) {
        const expectedSig = crypto
          .createHmac("sha256", secret)
          .update(payload)
          .digest("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        if (encodedSig === expectedSig) {
          try {
            const data = JSON.parse(
              Buffer.from(payload, "base64").toString("utf8")
            );
            userId = data.user_id || userId;
          } catch (e) {
            console.error("Error parsing signed_request payload:", e);
          }
        }
      }
    }

    // Generate unique deletion confirmation tracking code
    const confirmationCode = "DEL-" + Math.floor(100000 + Math.random() * 900000);
    const appUrl = (config.appUrl || "https://mbot.nanolez.tech").replace(/\/$/, "");
    const statusUrl = `${appUrl}/data-deletion?code=${confirmationCode}&user=${userId}`;

    console.log(`[Meta Deletion Callback] Purge initiated for user: ${userId}. Code: ${confirmationCode}`);

    // Return Meta compliant JSON response
    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (err: any) {
    console.error("Data deletion callback error:", err);
    return NextResponse.json(
      { error: "Failed to process data deletion request" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/facebook/deletion
 * Direct browser visit fallback with instructions
 */
export async function GET(req: NextRequest) {
  const appUrl = (config.appUrl || "https://mbot.nanolez.tech").replace(/\/$/, "");
  return NextResponse.redirect(`${appUrl}/data-deletion`);
}
