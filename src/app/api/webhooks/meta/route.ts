import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { verifyMetaSignature } from "@/lib/security";
import { debouncer } from "@/lib/meta/debouncer";
import { initializeMetaDebounceHandler, handleIncomingMetaMessage } from "@/lib/meta/handler";

// Ensure handler is initialized
initializeMetaDebounceHandler();

/**
 * GET /api/webhooks/meta
 * Handles Meta Webhook Verification Handshake.
 * Meta sends:
 *  - hub.mode = 'subscribe'
 *  - hub.verify_token = '<your verify token>'
 *  - hub.challenge = '<random string to echo back>'
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === config.meta.verifyToken) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse("Verification token mismatch", { status: 403 });
}

/**
 * POST /api/webhooks/meta
 * High-speed event receiver (<100ms ACK).
 * Extracts messages and pipes them into the multi-burst debouncer.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");

    // Verify HMAC-SHA256 signature
    if (!verifyMetaSignature(rawBody, signature)) {
      return new NextResponse("Invalid signature", { status: 403 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.object === "page") {
      for (const entry of payload.entry || []) {
        const pageId = entry.id;

        for (const event of entry.messaging || []) {
          const senderPsid = event.sender?.id;

          // Skip echo messages from the page itself
          if (event.message && !event.message.is_echo) {
            const text = event.message.text;
            let imageUrl: string | undefined;
            let audioUrl: string | undefined;

            if (event.message.attachments) {
              for (const att of event.message.attachments) {
                if (att.type === "image") {
                  imageUrl = att.payload?.url;
                } else if (att.type === "audio") {
                  audioUrl = att.payload?.url;
                }
              }
            }

            // Directly process and dispatch reply to Meta Graph API
            await handleIncomingMetaMessage(pageId, senderPsid, text, imageUrl, audioUrl);
          }
        }
      }

      // Fast ACK to Meta within <100ms
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
