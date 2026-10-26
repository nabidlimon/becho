import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { config } from "@/lib/config";
import { encryptToken } from "@/lib/security";

import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  const pages = db.getPages(session?.userId);
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const body = await req.json();
    const {
      pageId,
      pageName: inputPageName,
      pageAccessToken,
      verifyToken = config.meta.verifyToken,
      appSecret,
      personaTemplate = "fashion",
      customSystemPrompt,
      insideCityDeliveryFee = 70,
      outsideCityDeliveryFee = 130,
      currency = "BDT",
      allowDiscount = false,
      maxDiscountPercent = 5,
      codEnabled = true,
    } = body;

    if (!pageAccessToken) {
      return NextResponse.json(
        { error: "Page Access Token is required" },
        { status: 400 }
      );
    }

    let finalPageId = pageId;
    let finalPageName = inputPageName || "My Facebook Shop";
    let finalAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop";

    // Try to auto-fetch page info from Meta Graph API if it's not a demo token
    if (!pageAccessToken.includes("demo_token")) {
      try {
        const metaRes = await fetch(
          `${config.meta.graphBaseUrl}/${config.meta.apiVersion}/me?fields=id,name,picture&access_token=${pageAccessToken}`
        );
        if (metaRes.ok) {
          const metaData = await metaRes.json();
          if (metaData.id) finalPageId = metaData.id;
          if (metaData.name) finalPageName = metaData.name;
          if (metaData.picture?.data?.url) finalAvatarUrl = metaData.picture.data.url;
        }
      } catch (graphErr) {
        console.warn("Could not fetch page details from Meta Graph API, using provided inputs:", graphErr);
      }
    }

    if (!finalPageId) {
      finalPageId = "page-" + Date.now();
    }

    const savedPage = db.savePage({
      id: "page-" + Date.now(),
      userId: session?.userId,
      pageId: finalPageId,
      pageName: finalPageName,
      pageAvatarUrl: finalAvatarUrl,
      pageAccessToken: encryptToken(pageAccessToken),
      verifyToken,
      appSecret,
      isActive: true, // Activated 24/7 in the background
      personaTemplate,
      customSystemPrompt,
      insideCityDeliveryFee: Number(insideCityDeliveryFee),
      outsideCityDeliveryFee: Number(outsideCityDeliveryFee),
      currency,
      allowDiscount: Boolean(allowDiscount),
      maxDiscountPercent: Number(maxDiscountPercent),
      codEnabled: Boolean(codEnabled),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Auto-subscribe page to webhook so bot is permanently active in background
    if (!pageAccessToken.includes("demo_token")) {
      fetch(
        `https://graph.facebook.com/v20.0/${finalPageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks&access_token=${pageAccessToken}`,
        { method: "POST" }
      ).catch((e) => console.warn("[Auto-Subscribe] error:", e));
    }

    return NextResponse.json({
      success: true,
      message: `Successfully connected ${savedPage.pageName}!`,
      page: savedPage,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
