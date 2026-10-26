import fs from "fs";
import path from "path";
import { FacebookPage, Product, Customer, Conversation, Order, Message, User } from "./types";
import { pgDb, isPostgresConfigured } from "./postgres";

interface DataStore {
  users: User[];
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
  users: [
    {
      id: "user-admin-01",
      name: "NanoLez Admin",
      email: "admin@nanolez.tech",
      passwordHash: "$2a$10$wT02U9K4L9B8h4x5S9p1Ou7K8aP.P2h.H2wK7xK.E1a2b3c4d5e6f", // hashed 'admin123'
      avatarUrl: "https://mbot.nanolez.tech/logo.svg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
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
    {
      id: "page-nanolez-01",
      pageId: "897658663436930",
      pageName: "NanoLez Tech",
      pageAvatarUrl: "https://mbot.nanolez.tech/logo.svg",
      pageAccessToken: "fe02a9f56bca36660a2baf93:94ce7f72c3ce9aa6fe8a1addde22cc75:dec1886ae80376517fa11e12f8074ff344afb2c7401b43b0d5e63932aed0279988afd282af4bafc0f90d473b6d9308a51c7c26270e8eb149cdd46dde77602e1c5adcd1713e56859f26cc87714ce9f03d24636f19f3f8f2ed15c33ef03f0d060665d17b52c19e50a28a45855fea35d922f9d3859e67b20f6f106ee4835971022100f73e91edc101942b33a7ecc54e7b74c1089f6dbcabbfa33647e29c2c05356be634329a629745f96826ca429c18a58f0f4a077e188235e37029e300de4322b33e5cd69ad5fc014c5eeb6e187eedbf9410a3b7bafa569cb0",
      verifyToken: "becho_secure_verify_token_2026",
      isActive: true,
      personaTemplate: "gadgets",
      customSystemPrompt: "You are the top sales closer for NanoLez Tech. Be vibrant, welcoming, tech-savvy, use Bengali/English mix (Banglish) if customer speaks it, and always encourage quick Cash-on-Delivery confirmation.",
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
      id: "prod-nlz-01",
      pageId: "897658663436930",
      sku: "NLZ-SMART-ULTRA",
      title: "NanoLez Ultra 2 Smartwatch",
      description: "Premium AMOLED Always-On Display, Bluetooth HD Calling, Heart Rate & SpO2 Monitor, 7-day battery life with wireless magnetic charging.",
      category: "Smart Gadgets",
      price: 3200,
      discountPrice: 2850,
      stockQuantity: 12,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop",
      ],
      variants: {
        colors: ["Space Black", "Titanium Silver", "Ocean Blue"],
      },
      visualTraits: "smart watch square amoled digital watch fitness tracker black silicone strap",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-nlz-02",
      pageId: "897658663436930",
      sku: "NLZ-EARBUDS-PRO",
      title: "NanoLez Pods Pro Wireless Earbuds",
      description: "Active Noise Cancellation (ANC), Transparency Mode, 35hr Playtime with Type-C Fast Charging, Deep Bass Audio.",
      category: "Audio",
      price: 1950,
      discountPrice: 1650,
      stockQuantity: 20,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=800&fit=crop",
      ],
      variants: {
        colors: ["Glossy White", "Matte Black"],
      },
      visualTraits: "wireless bluetooth earbuds tws anc in ear headphones charging case",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-nlz-03",
      pageId: "897658663436930",
      sku: "NLZ-GAN-65W",
      title: "NanoLez 65W GaN Fast Charger (3-Port)",
      description: "Ultra-compact Gallium Nitride (GaN) fast charger. 2x USB-C PD 3.0 + 1x USB-A QC 4.0 ports. Charges laptops, MacBooks, iPhones & Android devices simultaneously.",
      category: "Accessories",
      price: 1550,
      discountPrice: 1350,
      stockQuantity: 15,
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=800&fit=crop",
      ],
      variants: {
        colors: ["Black", "White"],
      },
      visualTraits: "fast charger wall adapter 65w gan power delivery multi port usb-c plug",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
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
    const data = JSON.parse(content);
    if (!data.users) data.users = initialSeedData.users;
    return data;
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
  // Users
  getUsers: (): User[] => ensureStore().users || [],
  getUserByEmail: (email: string): User | undefined => {
    const users = ensureStore().users || [];
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: (id: string): User | undefined => {
    const users = ensureStore().users || [];
    return users.find((u) => u.id === id);
  },
  saveUser: (user: User): User => {
    const store = ensureStore();
    if (!store.users) store.users = [];
    const idx = store.users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      store.users[idx] = { ...store.users[idx], ...user, updatedAt: new Date().toISOString() };
    } else {
      store.users.push(user);
    }
    saveStore(store);
    if (isPostgresConfigured) {
      pgDb.saveUser(user).catch((e) => console.error("[DB Sync User]", e));
    }
    return user;
  },

  // Pages
  getPages: (userId?: string): FacebookPage[] => {
    const pages = ensureStore().pages;
    if (!userId) return pages;
    return pages.filter((p) => !p.userId || p.userId === userId);
  },
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
    if (isPostgresConfigured) {
      pgDb.savePage(page).catch((e) => console.error("[DB Sync Page]", e));
    }
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
    if (isPostgresConfigured) {
      pgDb.saveProduct(product).catch((e) => console.error("[DB Sync Product]", e));
    }
    return product;
  },
  batchAddProducts: (newProducts: Product[]): void => {
    const store = ensureStore();
    store.products.push(...newProducts);
    saveStore(store);
    if (isPostgresConfigured) {
      pgDb.batchAddProducts(newProducts).catch((e) => console.error("[DB Sync Batch Products]", e));
    }
  },
  deleteProduct: (id: string): boolean => {
    const store = ensureStore();
    const initialLen = store.products.length;
    store.products = store.products.filter((p) => p.id !== id);
    if (store.products.length !== initialLen) {
      saveStore(store);
      if (isPostgresConfigured) {
        pgDb.deleteProduct(id).catch((e) => console.error("[DB Sync Delete Product]", e));
      }
      return true;
    }
    return false;
  },
  decrementProductStock: (id: string, qty: number = 1): void => {
    const store = ensureStore();
    const prod = store.products.find((p) => p.id === id);
    if (prod) {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - qty);
      saveStore(store);
    }
    if (isPostgresConfigured) {
      pgDb.decrementProductStock(id, qty).catch((e) => console.error("[DB Decrement Stock]", e));
    }
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
    if (isPostgresConfigured) {
      pgDb.saveCustomer(customer).catch((e) => console.error("[DB Sync Customer]", e));
    }
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
    if (isPostgresConfigured) {
      pgDb.saveConversation(conv).catch((e) => console.error("[DB Sync Conversation]", e));
    }
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
    if (isPostgresConfigured) {
      pgDb.addMessageToConversation(pageId, psid, customerName, message).catch((e) =>
        console.error("[DB Sync Message]", e)
      );
    }
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
    if (isPostgresConfigured) {
      pgDb.setAiActiveState(pageId, psid, isAiActive, reason).catch((e) =>
        console.error("[DB Sync AI State]", e)
      );
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

    // Auto-decrement inventory stock quantity for each ordered item
    for (const item of order.items) {
      if (item.productId) {
        db.decrementProductStock(item.productId, item.quantity || 1);
      }
    }

    if (isPostgresConfigured) {
      pgDb.createOrder(order).catch((e) => console.error("[DB Sync Order]", e));
    }
    return order;
  },
  updateOrderStatus: (orderId: string, status: Order["status"]): Order | undefined => {
    const store = ensureStore();
    const ord = store.orders.find((o) => o.id === orderId);
    if (ord) {
      ord.status = status;
      saveStore(store);
    }
    if (isPostgresConfigured) {
      pgDb.updateOrderStatus(orderId, status).catch((e) => console.error("[DB Sync Order Status]", e));
    }
    return ord;
  },
};
