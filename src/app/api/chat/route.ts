import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MetaGraphClient } from "@/lib/meta/client";
import { decryptToken } from "@/lib/security";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userPages = db.getPages(session.userId);
  const allowedPageIds = new Set(userPages.map((p) => p.pageId));

  const pageId = req.nextUrl.searchParams.get("pageId") || undefined;
  if (pageId && !allowedPageIds.has(pageId)) {
    return NextResponse.json({ error: "Forbidden: Page does not belong to user" }, { status: 403 });
  }

  const allConversations = db.getConversations(pageId);
  const conversations = pageId
    ? allConversations
    : allConversations.filter((c) => allowedPageIds.has(c.pageId));

  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId, psid, action, messageText } = await req.json();

    if (!pageId || !psid) {
      return NextResponse.json({ error: "pageId and psid are required" }, { status: 400 });
    }

    const userPages = db.getPages(session.userId);
    const allowedPageIds = new Set(userPages.map((p) => p.pageId));
    if (!allowedPageIds.has(pageId)) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to manage this page chat." }, { status: 403 });
    }

    // Action 1: Toggle AI Active / Human Takeover
    if (action === "toggle_ai") {
      const conv = db.getConversationByPsid(pageId, psid);
      const newState = conv ? !conv.isAiActive : false;
      db.setAiActiveState(pageId, psid, newState, newState ? undefined : "Manual Human Takeover");
      return NextResponse.json({
        success: true,
        isAiActive: newState,
        message: newState ? "AI bot resumed for this conversation" : "Human takeover enabled. AI is paused.",
      });
    }

    // Action 2: Human sends a reply
    if (action === "send_message" && messageText) {
      const page = db.getPageByPageId(pageId);

      // Log in local DB
      db.addMessageToConversation(pageId, psid, "Customer", {
        senderType: "human",
        messageType: "text",
        content: messageText,
      });

      // Dispatch to Facebook via Meta Graph API if active
      if (page && page.pageAccessToken && !page.pageAccessToken.includes("demo_token")) {
        const rawToken = decryptToken(page.pageAccessToken);
        const metaClient = new MetaGraphClient(rawToken);
        await metaClient.sendText(psid, messageText);
      }

      const updatedConv = db.getConversationByPsid(pageId, psid);
      return NextResponse.json({ success: true, conversation: updatedConv });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
