import { debouncer, DebounceBatch } from "./debouncer";
import { db } from "../db";
import { pgDb, isPostgresConfigured } from "../db/postgres";
import { processMultimodalSalesMessage } from "../ai/gemini";
import { MetaGraphClient } from "./client";
import { decryptToken } from "../security";

/**
 * Directly processes a single incoming message and dispatches the AI reply to Meta Messenger.
 * Essential for Serverless (Vercel) environments where background timers are frozen.
 */
export async function handleIncomingMetaMessage(
  pageId: string,
  senderPsid: string,
  text?: string,
  imageUrl?: string,
  audioUrl?: string
) {
  console.log(`[Meta Handler] Incoming message for Page: ${pageId} from PSID: ${senderPsid}`);

  let page = db.getPageByPageId(pageId);
  if (!page && isPostgresConfigured) {
    try {
      const pgPage = await pgDb.getPageByPageId(pageId);
      if (pgPage) {
        page = pgPage;
        db.savePage(pgPage); // warm local cache
      }
    } catch (e) {
      console.warn("[Meta Handler] Error querying pgDb:", e);
    }
  }

  if (!page) {
    const knownPages = db.getPages().map((p) => `${p.pageName} (${p.pageId})`).join(", ");
    console.warn(`[Meta Handler] No connected page found in DB for pageId: ${pageId}. Available pages in DB: [${knownPages}]`);
    return;
  }

  if (!page.isActive) {
    console.log(`[Meta Handler] Page ${page.pageName} (${pageId}) bot is currently disabled.`);
    return;
  }

  // 1. Log incoming customer message in DB
  db.addMessageToConversation(pageId, senderPsid, "Facebook Buyer", {
    senderType: "customer",
    messageType: imageUrl ? "image" : "text",
    content: text || (imageUrl ? "Shared a photo" : ""),
    mediaUrl: imageUrl,
  });

  // 2. Process with AI Sales Closer
  const aiResult = await processMultimodalSalesMessage(
    pageId,
    senderPsid,
    text || "",
    imageUrl ? [imageUrl] : [],
    "Facebook Buyer",
    audioUrl
  );

  if (!aiResult.replyText) {
    console.warn(`[Meta Handler] AI produced empty response for pageId: ${pageId}`);
    return;
  }

  // 3. Log AI reply in DB
  db.addMessageToConversation(pageId, senderPsid, "Facebook Buyer", {
    senderType: "ai",
    messageType: aiResult.orderCreated
      ? "receipt"
      : aiResult.matchedProduct
      ? "carousel"
      : "text",
    content: aiResult.replyText,
    mediaUrl: aiResult.matchedProduct?.images[0],
  });

  // 4. Send via Meta Graph API if pageAccessToken is valid
  if (page.pageAccessToken && !page.pageAccessToken.includes("demo_token")) {
    try {
      const rawToken = decryptToken(page.pageAccessToken);
      const metaClient = new MetaGraphClient(rawToken);

      if (aiResult.orderCreated) {
        await metaClient.sendOrderReceipt(senderPsid, aiResult.orderCreated, page.currency);
      } else if (aiResult.matchedProduct) {
        await metaClient.sendCarousel(senderPsid, [
          {
            title: aiResult.matchedProduct.title,
            subtitle: `${page.currency} ${aiResult.matchedProduct.discountPrice || aiResult.matchedProduct.price} • In Stock: ${aiResult.matchedProduct.stockQuantity}`,
            imageUrl: aiResult.matchedProduct.images[0],
            buttonTitle: "Buy Cash on Delivery",
            buttonPayload: `ORDER_${aiResult.matchedProduct.id}`,
          },
        ]);
        await metaClient.sendText(senderPsid, aiResult.replyText);
      } else {
        await metaClient.sendText(senderPsid, aiResult.replyText);
      }
      console.log(`[Meta Handler] Successfully sent AI reply to PSID: ${senderPsid}`);
    } catch (err: any) {
      console.error(`[Meta Handler] Error sending message via Meta Graph API:`, err?.message || err);
    }
  } else {
    console.warn(`[Meta Handler] Page has demo or invalid access token. Cannot dispatch to live Messenger.`);
  }
}

export function initializeMetaDebounceHandler() {
  debouncer.setHandler(async (batch: DebounceBatch) => {
    const { pageId, senderPsid, combinedText, imageUrls } = batch;
    await handleIncomingMetaMessage(pageId, senderPsid, combinedText, imageUrls[0]);
  });
}

