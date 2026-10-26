import { debouncer, DebounceBatch } from "./debouncer";
import { db } from "../db";
import { processMultimodalSalesMessage } from "../ai/gemini";
import { MetaGraphClient } from "./client";
import { decryptToken } from "../security";

export function initializeMetaDebounceHandler() {
  debouncer.setHandler(async (batch: DebounceBatch) => {
    const { pageId, senderPsid, combinedText, imageUrls } = batch;

    const page = db.getPageByPageId(pageId);
    if (!page) {
      console.warn(`No connected page found in DB for pageId: ${pageId}`);
      return;
    }

    // 1. Log incoming customer message in DB
    db.addMessageToConversation(pageId, senderPsid, "Facebook Buyer", {
      senderType: "customer",
      messageType: imageUrls.length > 0 ? "image" : "text",
      content: combinedText || (imageUrls.length > 0 ? "Shared a photo" : ""),
      mediaUrl: imageUrls[0],
    });

    // 2. Process with AI Sales Closer
    const aiResult = await processMultimodalSalesMessage(
      pageId,
      senderPsid,
      combinedText,
      imageUrls,
      "Facebook Buyer"
    );

    if (!aiResult.replyText) return;

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
      const rawToken = decryptToken(page.pageAccessToken);
      const metaClient = new MetaGraphClient(rawToken);

      if (aiResult.orderCreated) {
        // Send structured receipt
        await metaClient.sendOrderReceipt(senderPsid, aiResult.orderCreated, page.currency);
      } else if (aiResult.matchedProduct) {
        // Send generic carousel card
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
    }
  });
}
