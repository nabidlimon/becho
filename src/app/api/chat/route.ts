import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MetaGraphClient } from "@/lib/meta/client";
import { decryptToken } from "@/lib/security";

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get("pageId") || undefined;
  const conversations = db.getConversations(pageId);
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  try {
    const { pageId, psid, action, messageText } = await req.json();

    if (!pageId || !psid) {
      return NextResponse.json({ error: "pageId and psid are required" }, { status: 400 });
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
