import { NextRequest, NextResponse } from "next/server";
import { processMultimodalSalesMessage } from "@/lib/ai/gemini";
import { db } from "@/lib/db";

/**
 * POST /api/sandbox
 * Simulates a customer chat with the AI bot without needing a live Facebook Page.
 */
export async function POST(req: NextRequest) {
  try {
    const { pageId = "100234812398124", userText, imageUrls = [], customerName = "Test Shopper" } = await req.json();

    const sandboxPsid = "sandbox_tester_" + (pageId || "default");

    // 1. Log customer message
    db.addMessageToConversation(pageId, sandboxPsid, customerName, {
      senderType: "customer",
      messageType: imageUrls.length > 0 ? "image" : "text",
      content: userText || (imageUrls.length > 0 ? "Sent a photo" : ""),
      mediaUrl: imageUrls[0],
    });

    // 2. Process with AI sales closer
    const aiResult = await processMultimodalSalesMessage(
      pageId,
      sandboxPsid,
      userText,
      imageUrls,
      customerName
    );

    // 3. Log AI reply
    db.addMessageToConversation(pageId, sandboxPsid, customerName, {
      senderType: "ai",
      messageType: aiResult.orderCreated ? "receipt" : aiResult.matchedProduct ? "carousel" : "text",
      content: aiResult.replyText,
      mediaUrl: aiResult.matchedProduct?.images[0],
    });

    return NextResponse.json({
      success: true,
      replyText: aiResult.replyText,
      matchedProduct: aiResult.matchedProduct,
      orderCreated: aiResult.orderCreated,
      escalatedToHuman: aiResult.escalatedToHuman,
      isAiPowered: aiResult.isAiPowered ?? false,
      aiError: aiResult.aiError,
    });
  } catch (err: any) {
    console.error("Sandbox simulation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
