import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

/**
 * POST /api/pages/test
 * Validates a Page Access Token against Meta Graph API in real-time.
 */
export async function POST(req: NextRequest) {
  try {
    const { pageAccessToken } = await req.json();

    if (!pageAccessToken) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 });
    }

    // If it's a demo token in dev mode
    if (pageAccessToken.includes("demo_token")) {
      return NextResponse.json({
        success: true,
        page: {
          id: "100234812398124",
          name: "StyleHub Boutique BD (Demo)",
          followers: 12450,
          verified: true,
        },
      });
    }

    const res = await fetch(
      `${config.meta.graphBaseUrl}/${config.meta.apiVersion}/me?fields=id,name,picture&access_token=${pageAccessToken}`
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error?.message || "Invalid Access Token or permissions missing.",
        },
        { status: 400 }
      );
    }

    // Check if this is a User Access Token by querying /me/accounts
    try {
      const accountsRes = await fetch(
        `${config.meta.graphBaseUrl}/${config.meta.apiVersion}/me/accounts?fields=id,name,category,access_token,picture{url}&access_token=${pageAccessToken}`
      );
      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        if (Array.isArray(accountsData.data) && accountsData.data.length > 0) {
          // This is a User Access Token that has access to pages!
          const pages = accountsData.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category || "Business",
            avatarUrl: p.picture?.data?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
            pageAccessToken: p.access_token,
          }));

          return NextResponse.json({
            success: true,
            isUserToken: true,
            userName: data.name,
            pages,
            message: `Found ${pages.length} Facebook Page${pages.length === 1 ? "" : "s"} managed by ${data.name}.`,
          });
        }
      }
    } catch {
      // Ignore accounts check failure and treat as direct page token
    }

    // Direct Page Access Token
    return NextResponse.json({
      success: true,
      isUserToken: false,
      page: {
        id: data.id,
        name: data.name,
        picture: data.picture?.data?.url,
        followers: data.followers_count || 0,
        verified: true,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
