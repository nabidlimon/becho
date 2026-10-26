import { config } from "../config";
import { Order } from "../db/types";

export interface QuickReplyOption {
  title: string;
  payload: string;
}

export interface CarouselCard {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttonTitle?: string;
  buttonPayload?: string;
}

export class MetaGraphClient {
  private pageAccessToken: string;
  private apiVersion: string;

  constructor(pageAccessToken: string) {
    this.pageAccessToken = pageAccessToken;
    this.apiVersion = config.meta.apiVersion;
  }

  private async postMessage(recipientPsid: string, messagePayload: any) {
    const url = `${config.meta.graphBaseUrl}/${this.apiVersion}/me/messages?access_token=${this.pageAccessToken}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientPsid },
          messaging_type: "RESPONSE",
          message: messagePayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Meta Graph API error:", data);
      }
      return data;
    } catch (err) {
      console.error("Failed to send Meta message:", err);
      return null;
    }
  }

  /**
   * Sends a standard text message with emojis.
   */
  async sendText(recipientPsid: string, text: string) {
    return this.postMessage(recipientPsid, { text });
  }

  /**
   * Sends a message with quick reply chips (e.g., sizes, yes/no confirmation).
   */
  async sendQuickReplies(recipientPsid: string, text: string, quickReplies: QuickReplyOption[]) {
    return this.postMessage(recipientPsid, {
      text,
      quick_replies: quickReplies.map((qr) => ({
        content_type: "text",
        title: qr.title.substring(0, 20),
        payload: qr.payload,
      })),
    });
  }

  /**
   * Sends a horizontally scrollable carousel of product cards with photos and CTAs.
   */
  async sendCarousel(recipientPsid: string, cards: CarouselCard[]) {
    const elements = cards.slice(0, 10).map((card) => {
      const elem: any = {
        title: card.title.substring(0, 80),
        subtitle: card.subtitle ? card.subtitle.substring(0, 80) : undefined,
        image_url: card.imageUrl,
      };

      if (card.buttonTitle) {
        elem.buttons = [
          {
            type: "postback",
            title: card.buttonTitle.substring(0, 20),
            payload: card.buttonPayload || `BUY_${card.title}`,
          },
        ];
      }
      return elem;
    });

    return this.postMessage(recipientPsid, {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements,
        },
      },
    });
  }

  /**
   * Sends a native Facebook Messenger structured order receipt.
   */
  async sendOrderReceipt(recipientPsid: string, order: Order, currency: string = "BDT") {
    const payload = {
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: order.shippingName,
          order_number: order.orderNumber,
          currency,
          payment_method: order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
          timestamp: Math.floor(Date.now() / 1000).toString(),
          address: {
            street_1: order.shippingAddress.substring(0, 100),
            city: "City",
            postal_code: "1000",
            state: "State",
            country: "BD",
          },
          summary: {
            subtotal: order.subtotal,
            shipping_cost: order.deliveryFee,
            total_cost: order.totalAmount,
          },
          elements: order.items.map((item) => ({
            title: item.title.substring(0, 80),
            subtitle: item.variant || "Standard",
            quantity: item.quantity,
            price: item.price,
            currency,
            image_url: item.imageUrl,
          })),
        },
      },
    };

    return this.postMessage(recipientPsid, payload);
  }
}
