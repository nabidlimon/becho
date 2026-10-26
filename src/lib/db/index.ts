import fs from "fs";
import path from "path";
import { FacebookPage, Product, Customer, Conversation, Order, Message } from "./types";

interface DataStore {
  pages: FacebookPage[];
  products: Product[];
  customers: Customer[];
  conversations: Conversation[];
  orders: Order[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "becho_store.json");

// Initial Seed Data for Instant Out-of-the-Box Experience
const initialSeedData: DataStore = {
  pages: [
    {
      id: "page-demo-01",
      pageId: "100234812398124",
      pageName: "StyleHub Boutique BD",
      pageAvatarUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
      pageAccessToken: "EAAX...demo_token_StyleHub",
      verifyToken: "becho_secure_verify_token_2026",
      isActive: true,
      personaTemplate: "fashion",
      customSystemPrompt: "You are the top sales closer for StyleHub Boutique. Be vibrant, welcoming, use Bengali/English mix (Banglish) if customer speaks it, and always encourage quick Cash-on-Delivery confirmation.",
      insideCityDeliveryFee: 70,
      outsideCityDeliveryFee: 130,
      currency: "BDT",
      allowDiscount: true,
      maxDiscountPercent: 5,
      codEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  products: [
    {
      id: "prod-01",
      pageId: "100234812398124",
      sku: "SH-ROYAL-MAXI",
      title: "Royal Blue Georgette Party Maxi Dress",
      description: "Premium embroidered georgette maxi gown with matching dupatta. Breathable lining, elegant flare, perfect for wedding receptions and evening parties.",
      category: "Women's Fashion",
      price: 2450,
      discountPrice: 2200,
      stockQuantity: 8,
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
      ],
      variants: {
        sizes: ["M (38)", "L (40)", "XL (42)", "XXL (44)"],
        colors: ["Royal Blue", "Emerald Green", "Wine Red"],
      },
      visualTraits: "royal blue long maxi dress embroidered georgette gown gown full sleeve party wear",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-02",
      pageId: "100234812398124",
      sku: "SH-AIRFLEX-RUN",
      title: "AirFlex 3D Breathable Mesh Running Shoes",
      description: "Ultra-lightweight shock-absorbing sneakers with memory foam insole. High-grip rubber outsole suitable for daily gym, running, and casual wear.",
      category: "Footwear",
      price: 1850,
      discountPrice: 1650,
      stockQuantity: 15,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
      ],
      variants: {
        sizes: ["40", "41", "42", "43", "44"],
        colors: ["Sport Red", "Matte Black", "Arctic White"],
      },
      visualTraits: "red nike style sneakers athletic running shoes white sole memory foam footwear",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-03",
      pageId: "100234812398124",
      sku: "SH-GLOW-SERUM",
      title: "Radiance Niacinamide 10% + Zinc Skin Serum",
      description: "Dermatologically tested brightening facial serum. Minimizes visible pores, regulates oil production, and fades dark blemishes within 2 weeks.",
      category: "Cosmetics & Skincare",
      price: 950,
      stockQuantity: 24,
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=800&fit=crop",
      ],
      variants: {
        sizes: ["30ml Dropper Bottle"],
      },
      visualTraits: "facial serum glass dropper bottle skincare niacinamide zinc cosmetic bottle",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  customers: [
    {
      id: "cust-01",
      pageId: "100234812398124",
      psid: "psid_user_9901",
      fullName: "Tanvir Ahmed",
      profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      phoneNumber: "+8801712345678",
      deliveryAddress: "House 24, Road 7, Sector 4, Uttara, Dhaka",
      totalOrdersCount: 1,
      totalSpend: 2270,
      createdAt: new Date().toISOString(),
    },
  ],
  conversations: [
    {
      id: "conv-01",
      pageId: "100234812398124",
      customerId: "cust-01",
      psid: "psid_user_9901",
      customerName: "Tanvir Ahmed",
      customerPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      isAiActive: true,
      unreadByHuman: false,
      lastMessagePreview: "Order confirmed! Delivery via Cash on Delivery.",
      lastCustomerMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      messages: [
        {
          id: "m-1",
          conversationId: "conv-01",
          senderType: "customer",
          messageType: "text",
          content: "Hi, is the red running shoes available in size 42?",
          timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        },
        {
          id: "m-2",
          conversationId: "conv-01",
          senderType: "ai",
          messageType: "carousel",
          content: "Yes! We have the AirFlex 3D Running Shoes in Sport Red Size 42 (discounted at ৳1,650, only 4 pairs left 🔥). Would you like to confirm Cash on Delivery?",
          mediaUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
          timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
        },
        {
          id: "m-3",
          conversationId: "conv-01",
          senderType: "customer",
          messageType: "text",
          content: "Yes please book it for me. Tanvir Ahmed, 01712345678, House 24, Road 7, Uttara Sector 4, Dhaka.",
          timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
        },
        {
          id: "m-4",
          conversationId: "conv-01",
          senderType: "ai",
          messageType: "receipt",
          content: "🎉 Order Confirmed! #BC-8104. Items: AirFlex 3D Shoes (Size 42) = ৳1,650 + Delivery ৳70. Total: ৳1,720 COD.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
      ],
    },
  ],
  orders: [
    {
      id: "order-01",
      orderNumber: "BC-8104",
      pageId: "100234812398124",
      customerId: "cust-01",
      items: [
        {
          productId: "prod-02",
          title: "AirFlex 3D Breathable Mesh Running Shoes",
          quantity: 1,
          price: 1650,
          variant: "Sport Red / Size 42",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
        },
      ],
      subtotal: 1650,
      deliveryFee: 70,
      discountAmount: 0,
      totalAmount: 1720,
      shippingName: "Tanvir Ahmed",
      shippingPhone: "+8801712345678",
      shippingAddress: "House 24, Road 7, Sector 4, Uttara, Dhaka",
      paymentMethod: "COD",
      status: "confirmed",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
};

function ensureStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeedData, null, 2), "utf-8");
      return initialSeedData;
    }
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Store error:", err);
    return initialSeedData;
  }
}

function saveStore(data: DataStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save data store:", err);
  }
}

export const db = {
  // Pages
  getPages: (): FacebookPage[] => ensureStore().pages,
  getPageByPageId: (pageId: string): FacebookPage | undefined =>
    ensureStore().pages.find((p) => p.pageId === pageId),
  savePage: (page: FacebookPage): FacebookPage => {
    const store = ensureStore();
    const idx = store.pages.findIndex((p) => p.pageId === page.pageId);
    if (idx >= 0) {
      store.pages[idx] = { ...store.pages[idx], ...page, updatedAt: new Date().toISOString() };
    } else {
      store.pages.push(page);
    }
    saveStore(store);
    return page;
  },

  // Products
  getProducts: (pageId?: string): Product[] => {
    const store = ensureStore();
    if (!pageId) return store.products;
    return store.products.filter((p) => p.pageId === pageId && p.isActive);
  },
  getProductById: (id: string): Product | undefined =>
    ensureStore().products.find((p) => p.id === id),
  saveProduct: (product: Product): Product => {
    const store = ensureStore();
    const idx = store.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      store.products[idx] = { ...store.products[idx], ...product };
    } else {
      store.products.push(product);
    }
    saveStore(store);
    return product;
  },
  batchAddProducts: (newProducts: Product[]): void => {
    const store = ensureStore();
    store.products.push(...newProducts);
    saveStore(store);
  },

  // Customers
  getCustomerByPsid: (pageId: string, psid: string): Customer | undefined =>
    ensureStore().customers.find((c) => c.pageId === pageId && c.psid === psid),
  saveCustomer: (customer: Customer): Customer => {
    const store = ensureStore();
    const idx = store.customers.findIndex((c) => c.pageId === customer.pageId && c.psid === customer.psid);
    if (idx >= 0) {
      store.customers[idx] = { ...store.customers[idx], ...customer };
    } else {
      store.customers.push(customer);
    }
    saveStore(store);
    return customer;
  },

  // Conversations
  getConversations: (pageId?: string): Conversation[] => {
    const store = ensureStore();
    if (!pageId) return store.conversations;
    return store.conversations.filter((c) => c.pageId === pageId);
  },
  getConversationByPsid: (pageId: string, psid: string): Conversation | undefined =>
    ensureStore().conversations.find((c) => c.pageId === pageId && c.psid === psid),
  saveConversation: (conv: Conversation): Conversation => {
    const store = ensureStore();
    const idx = store.conversations.findIndex((c) => c.id === conv.id || (c.pageId === conv.pageId && c.psid === conv.psid));
    if (idx >= 0) {
      store.conversations[idx] = { ...store.conversations[idx], ...conv };
    } else {
      store.conversations.unshift(conv);
    }
    saveStore(store);
    return conv;
  },
  addMessageToConversation: (
    pageId: string,
    psid: string,
    customerName: string,
    message: Omit<Message, "id" | "conversationId" | "timestamp">
  ): Conversation => {
    const store = ensureStore();
    let conv = store.conversations.find((c) => c.pageId === pageId && c.psid === psid);
    const newMsg: Message = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      conversationId: conv ? conv.id : "conv-" + Date.now(),
      timestamp: new Date().toISOString(),
      ...message,
    };

    if (conv) {
      conv.messages.push(newMsg);
      conv.lastMessagePreview = newMsg.content.substring(0, 80);
      if (newMsg.senderType === "customer") {
        conv.lastCustomerMessageAt = newMsg.timestamp;
      }
    } else {
      conv = {
        id: newMsg.conversationId,
        pageId,
        customerId: "cust-" + Date.now(),
        psid,
        customerName: customerName || "Facebook Buyer",
        isAiActive: true,
        unreadByHuman: false,
        lastMessagePreview: newMsg.content.substring(0, 80),
        lastCustomerMessageAt: newMsg.timestamp,
        messages: [newMsg],
      };
      store.conversations.unshift(conv);
    }
    saveStore(store);
    return conv;
  },
  setAiActiveState: (pageId: string, psid: string, isAiActive: boolean, reason?: string): void => {
    const store = ensureStore();
    const conv = store.conversations.find((c) => c.pageId === pageId && c.psid === psid);
    if (conv) {
      conv.isAiActive = isAiActive;
      if (reason) conv.handoverTrigger = reason;
      if (!isAiActive) conv.unreadByHuman = true;
      saveStore(store);
    }
  },

  // Orders
  getOrders: (pageId?: string): Order[] => {
    const store = ensureStore();
    if (!pageId) return store.orders;
    return store.orders.filter((o) => o.pageId === pageId);
  },
  createOrder: (order: Order): Order => {
    const store = ensureStore();
    store.orders.unshift(order);
    saveStore(store);
    return order;
  },
  updateOrderStatus: (orderId: string, status: Order["status"]): Order | undefined => {
    const store = ensureStore();
    const ord = store.orders.find((o) => o.id === orderId);
    if (ord) {
      ord.status = status;
      saveStore(store);
      return ord;
    }
    return undefined;
  },
};
