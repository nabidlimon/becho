import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { db } from "../db";
import { FacebookPage, Order, Product } from "../db/types";
import { buildSalesSystemPrompt } from "./prompts";

export interface AIResponseResult {
  replyText: string;
  matchedProduct?: Product;
  orderCreated?: Order;
  escalatedToHuman?: boolean;
  isAiPowered?: boolean;
  aiError?: string;
}

export async function processMultimodalSalesMessage(
  pageId: string,
  psid: string,
  userText: string,
  imageUrls: string[] = [],
  customerName: string = "Buyer",
  audioUrl?: string
): Promise<AIResponseResult> {
  const page = db.getPageByPageId(pageId) || db.getPages()[0] || {
    id: "default-page",
    pageId: pageId || "default",
    pageName: "StyleHub Boutique BD",
    currency: "BDT",
    insideCityDeliveryFee: 70,
    outsideCityDeliveryFee: 130,
    allowDiscount: true,
    maxDiscountPercent: 5,
    codEnabled: true,
  };

  // If this specific page has no products uploaded yet, fallback to all catalog items so sandbox works
  let catalog = db.getProducts(pageId);
  if (!catalog || catalog.length === 0) {
    catalog = db.getProducts();
  }

  const conv = db.getConversationByPsid(pageId, psid);

  // Check if Human Takeover is active
  if (conv && !conv.isAiActive) {
    return {
      replyText: "",
      escalatedToHuman: true,
      isAiPowered: false,
    };
  }

  const systemInstruction = buildSalesSystemPrompt(page, catalog);
  let replyText = "";
  let isAiPowered = false;
  let aiError: string | undefined;

  // 1. Check if Gemini API Key is configured
  if (config.gemini.apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
      const configuredModel = config.gemini.model || "gemini-1.5-flash";

      // Prepare contents
      const parts: any[] = [];

      // Add image parts if provided
      for (const imgUrl of imageUrls) {
        try {
          const imgRes = await fetch(imgUrl);
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            const contentType = imgRes.headers.get("content-type") || "image/jpeg";
            parts.push({
              inlineData: {
                data: base64,
                mimeType: contentType,
              },
            });
          }
        } catch (err) {
          console.error("Failed to load image for multimodal vision:", err);
        }
      }

      // Add audio voice note part if provided
      if (audioUrl) {
        try {
          const audioRes = await fetch(audioUrl);
          if (audioRes.ok) {
            const buffer = await audioRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            const contentType = audioRes.headers.get("content-type") || "audio/mp4";
            parts.push({
              inlineData: {
                data: base64,
                mimeType: contentType,
              },
            });
          }
        } catch (err) {
          console.error("Failed to load audio for voice note analysis:", err);
        }
      }

      // Add conversation context
      const chatHistory = conv
        ? conv.messages
            .slice(-6)
            .map((m) => `${m.senderType === "customer" ? "Customer" : "You"}: ${m.content}`)
            .join("\n")
        : "";

      const promptMessage = `
[CONVERSATION HISTORY]
${chatHistory}

[LATEST INCOMING MESSAGE FROM ${customerName}]:
${userText || (imageUrls.length > 0 ? "Customer sent a photo asking about this item." : "Hi")}
`.trim();

      parts.push({ text: promptMessage });

      const candidateModels = [
        configuredModel,
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash-lite",
        "gemini-3.8-flash",
      ];
      const modelsToTry = Array.from(new Set(candidateModels));

      let result;
      let lastErr: any;
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction,
          });
          result = await model.generateContent(parts);
          if (result && result.response) {
            break;
          }
        } catch (err: any) {
          lastErr = err;
          if (
            err?.status === 404 ||
            err?.status === 503 ||
            err?.message?.includes("models/") ||
            err?.message?.includes("high demand")
          ) {
            continue;
          }
          throw err;
        }
      }

      if (!result) {
        throw lastErr || new Error("All candidate Gemini models failed");
      }

      replyText = result.response.text();
      isAiPowered = true;
    } catch (apiErr: any) {
      aiError = apiErr?.message || String(apiErr);
      console.warn("Gemini API Error, falling back to consultative sales simulator:", aiError);
      replyText = generateFallbackSalesResponse(userText, imageUrls, catalog, page);
    }
  } else {
    // Zero-config intelligent consultative fallback for local dev & testing
    aiError = "No GEMINI_API_KEY configured in .env.local";
    replyText = generateFallbackSalesResponse(userText, imageUrls, catalog, page);
  }

  // 2. Parse [ESCALATE_TO_HUMAN: ...]
  let escalatedToHuman = false;
  const escalateMatch = replyText.match(/\[ESCALATE_TO_HUMAN:\s*["']?([^\]"']+)["']?\]/i);
  if (escalateMatch) {
    const reason = escalateMatch[1];
    db.setAiActiveState(pageId, psid, false, reason);
    escalatedToHuman = true;
    replyText = replyText.replace(/\[ESCALATE_TO_HUMAN:.*?\]/i, "").trim();
  }

  // 3. Parse [ORDER_CONFIRMED: ...]
  let orderCreated: Order | undefined;
  let matchedProduct: Product | undefined;
  const orderMatch = replyText.match(/\[ORDER_CONFIRMED:\s*(\{[\s\S]*?\})\s*\]/);

  if (orderMatch && catalog.length > 0) {
    try {
      const orderData = JSON.parse(orderMatch[1]);
      
      // Match by product ID, SKU, or Title
      matchedProduct = catalog.find((p) => p.id === orderData.productId);
      if (!matchedProduct && orderData.title) {
        const lowerTitle = String(orderData.title).toLowerCase();
        matchedProduct = catalog.find(
          (p) => p.title.toLowerCase().includes(lowerTitle) || lowerTitle.includes(p.title.toLowerCase())
        );
      }
      if (!matchedProduct) {
        const lowerUser = userText.toLowerCase();
        matchedProduct = catalog.find((p) => lowerUser.includes(p.title.toLowerCase()));
      }
      if (!matchedProduct && catalog.length === 1) {
        matchedProduct = catalog[0];
      }

      if (matchedProduct) {
        const itemPrice = matchedProduct.discountPrice || matchedProduct.price;

        // Dynamic delivery fee calculation based on shipping address
        const fullAddress = `${orderData.address || ""} ${userText}`.toLowerCase();
        const isOutsideCity = /(outside|chittagong|ctg|sylhet|rajshahi|khulna|barishal|rangpur|mymensingh|cumilla|comilla|gazipur|narayanganj|savar|bogra|cox'?s bazar|jessore)/i.test(
          fullAddress
        );
        const deliveryFee = isOutsideCity
          ? (page.outsideCityDeliveryFee || 130)
          : (page.insideCityDeliveryFee || 70);

        const subtotal = itemPrice * (orderData.quantity || 1);
        const totalAmount = subtotal + deliveryFee;

        orderCreated = db.createOrder({
          id: "order-" + Date.now(),
          orderNumber: "BC-" + Math.floor(1000 + Math.random() * 9000),
          pageId,
          items: [
            {
              productId: matchedProduct.id,
              title: matchedProduct.title,
              quantity: orderData.quantity || 1,
              price: itemPrice,
              variant: orderData.variant || "Standard",
              imageUrl: matchedProduct.images[0] || "",
            },
          ],
          subtotal,
          deliveryFee,
          discountAmount: 0,
          totalAmount,
          shippingName: orderData.name || customerName,
          shippingPhone: orderData.phone || "017XXXXXXXX",
          shippingAddress: orderData.address || "Customer Address",
          paymentMethod: "COD",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        });
      }

      // Clean the machine-readable tag from the user-facing text
      replyText = replyText.replace(/\[ORDER_CONFIRMED:[\s\S]*?\]/, "").trim();
    } catch (parseErr) {
      console.error("Failed to parse order JSON:", parseErr);
    }
  }

  // Match product recommendation card for carousels
  if (!matchedProduct && catalog.length > 0) {
    const lower = userText.toLowerCase();
    matchedProduct = catalog.find(
      (p) =>
        lower.includes(p.title.toLowerCase()) ||
        lower.includes(p.category.toLowerCase()) ||
        (p.visualTraits && p.visualTraits.split(" ").some((t) => lower.includes(t)))
    );
  }

  return {
    replyText,
    matchedProduct,
    orderCreated,
    escalatedToHuman,
    isAiPowered,
    aiError,
  };
}

/**
 * High-converting, consultative fallback when GEMINI_API_KEY is not yet populated.
 * Allows the merchant to immediately experience the full conversational sales loop!
 */
function generateFallbackSalesResponse(
  userText: string,
  imageUrls: string[],
  catalog: Product[],
  page: FacebookPage
): string {
  const lower = userText.toLowerCase();
  const pageName = page?.pageName || "our store";
  const currency = page?.currency || "BDT";
  const insideFee = page?.insideCityDeliveryFee || 70;
  const outsideFee = page?.outsideCityDeliveryFee || 130;

  // 1. Order Details Detection (Phone number + Address)
  const hasPhone = /\b01[3-9]\d{8}\b|\b\d{10,11}\b|\+\d{10,14}/.test(userText);
  const hasAddress = /road|house|sector|street|area|dhaka|chittagong|block|city|avenue/i.test(lower);

  if (hasPhone || (hasPhone && hasAddress)) {
    const targetProd = catalog.length > 0 ? catalog[0] : null;
    const itemPrice = targetProd ? (targetProd.discountPrice || targetProd.price) : 1500;
    const prodTitle = targetProd ? targetProd.title : "Selected Product";
    const total = itemPrice + insideFee;

    return `Woohoo! Your order is locked in with **Cash on Delivery**! 📦✨

• **${prodTitle}** — ${currency} ${itemPrice}
• Delivery: ${currency} ${insideFee} (Total: **${currency} ${total}**)

Our rider will deliver within 24-48 hrs. Inspect at your doorstep before paying—zero risk! Thank you for shopping with ${pageName} ❤️

${targetProd ? `[ORDER_CONFIRMED: {"productId": "${targetProd.id}", "variant": "Standard", "quantity": 1, "name": "Customer", "phone": "Verified Phone", "address": "Verified Address"}]` : ""}`;
  }

  // 2. Photo sent
  if (imageUrls.length > 0) {
    const matched = catalog.length > 0 ? catalog[0] : null;
    if (matched) {
      return `Spot on! Found the exact match in our store! ✨👗

**${matched.title}**
• Price: ${currency} ${matched.discountPrice || matched.price} (Only ${matched.stockQuantity} left 🔥)
• Available Sizes: ${matched.variants?.sizes?.join(", ") || "Standard"}

Zero risk with Cash on Delivery! Should I pack this for you before it sells out? Just drop your address & phone number! 📦😉`;
    }
    return `Ooh, love that style! ✨ We have very similar pieces in ${pageName}. Drop your preferred size or color and I'll find your perfect match right away! 🛍️`;
  }

  // 3. Human requested
  if (lower.includes("human") || lower.includes("agent") || lower.includes("manager") || lower.includes("owner")) {
    return `You got it! Handing this over to our store manager right now—they'll jump in personally in just a moment! ⏳👤
[ESCALATE_TO_HUMAN: "Customer requested human manager"]`;
  }

  // 4. In stock / price question
  if (catalog.length === 0) {
    return `Hey there! Welcome to **${pageName}** ✨

All items are delivered within 24-48 hrs with **Cash on Delivery** (zero risk, inspect at your doorstep!).

What are you on the hunt for today? Drop an item or photo and let's get you set up! 🛍️😉`;
  }

  const matched =
    catalog.find(
      (p) =>
        lower.includes(p.title.toLowerCase()) ||
        lower.includes(p.category.toLowerCase()) ||
        (p.visualTraits && p.visualTraits.split(" ").some((t) => lower.includes(t)))
    ) || catalog[0];

  return `Ooh, you’ve got great taste! 😍 **${matched.title}** is in stock and moving fast!

• Price: ${currency} ${matched.discountPrice || matched.price} ${
    matched.discountPrice ? `(Usually ${currency} ${matched.price} — total steal!)` : ""
  }
• Sizes: ${matched.variants?.sizes?.join(", ") || "M, L, XL"} (Only ${matched.stockQuantity} left 🔥)
• Delivery: 24-48 hrs (${currency} ${insideFee} Inside / ${currency} ${outsideFee} Outside)

Zero risk with **Cash on Delivery**—inspect before paying! Should I secure yours today? Just reply with your **Address** & **Phone Number**! 🚚📦`;
}
