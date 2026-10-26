import { neon, Pool } from "@neondatabase/serverless";
import { FacebookPage, Product, Customer, Conversation, Order, Message, User } from "./types";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  "";

export const isPostgresConfigured = Boolean(connectionString && !connectionString.includes("placeholder"));

function getSql() {
  if (!connectionString) {
    throw new Error("No Postgres connection string provided in environment variables.");
  }
  return neon(connectionString);
}

/**
 * Automatically creates all tables and indexes if they do not exist.
 */
let schemaInitialized = false;

export async function ensurePostgresSchema(): Promise<void> {
  if (!isPostgresConfigured || schemaInitialized) return;

  try {
    const sql = getSql();

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT,
        avatar_url TEXT,
        facebook_user_id VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS facebook_pages (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
        page_id VARCHAR(100) UNIQUE NOT NULL,
        page_name VARCHAR(255) NOT NULL,
        page_avatar_url TEXT,
        page_access_token TEXT NOT NULL,
        verify_token VARCHAR(255) NOT NULL,
        app_secret TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        persona_template VARCHAR(50) DEFAULT 'gadgets',
        custom_system_prompt TEXT,
        inside_city_delivery_fee NUMERIC DEFAULT 70,
        outside_city_delivery_fee NUMERIC DEFAULT 130,
        currency VARCHAR(10) DEFAULT 'BDT',
        allow_discount BOOLEAN DEFAULT TRUE,
        max_discount_percent NUMERIC DEFAULT 5,
        cod_enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        page_id VARCHAR(100) NOT NULL,
        sku VARCHAR(100),
        title TEXT NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price NUMERIC NOT NULL,
        discount_price NUMERIC,
        stock_quantity INTEGER DEFAULT 0,
        images JSONB DEFAULT '[]'::jsonb,
        variants JSONB DEFAULT '{}'::jsonb,
        visual_traits TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(100) PRIMARY KEY,
        page_id VARCHAR(100) NOT NULL,
        psid VARCHAR(100) NOT NULL,
        full_name VARCHAR(255),
        profile_pic TEXT,
        phone_number VARCHAR(50),
        delivery_address TEXT,
        total_orders_count INTEGER DEFAULT 0,
        total_spend NUMERIC DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uq_customer_page_psid UNIQUE(page_id, psid)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(100) PRIMARY KEY,
        page_id VARCHAR(100) NOT NULL,
        customer_id VARCHAR(100),
        psid VARCHAR(100) NOT NULL,
        customer_name VARCHAR(255),
        customer_pic TEXT,
        is_ai_active BOOLEAN DEFAULT TRUE,
        handover_trigger TEXT,
        unread_by_human BOOLEAN DEFAULT FALSE,
        last_message_preview TEXT,
        last_customer_message_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uq_conv_page_psid UNIQUE(page_id, psid)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(100) PRIMARY KEY,
        conversation_id VARCHAR(100) REFERENCES conversations(id) ON DELETE CASCADE,
        sender_type VARCHAR(20) NOT NULL,
        message_type VARCHAR(20) NOT NULL,
        content TEXT,
        media_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL,
        page_id VARCHAR(100) NOT NULL,
        customer_id VARCHAR(100),
        items JSONB NOT NULL,
        subtotal NUMERIC NOT NULL,
        delivery_fee NUMERIC NOT NULL,
        discount_amount NUMERIC DEFAULT 0,
        total_amount NUMERIC NOT NULL,
        shipping_name VARCHAR(255),
        shipping_phone VARCHAR(50),
        shipping_address TEXT,
        payment_method VARCHAR(50) DEFAULT 'COD',
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    schemaInitialized = true;
    console.log("[Postgres] Schema successfully verified/initialized.");
  } catch (err: any) {
    console.error("[Postgres] Schema initialization error:", err?.message || err);
  }
}

// ==========================================
// Postgres Repository Operations
// ==========================================

export const pgDb = {
  // Users
  getUserByEmail: async (email: string): Promise<User | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`SELECT * FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      passwordHash: r.password_hash,
      avatarUrl: r.avatar_url,
      facebookUserId: r.facebook_user_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  },

  getUserById: async (id: string): Promise<User | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      passwordHash: r.password_hash,
      avatarUrl: r.avatar_url,
      facebookUserId: r.facebook_user_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  },

  saveUser: async (user: User): Promise<User> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      INSERT INTO users (id, name, email, password_hash, avatar_url, facebook_user_id, updated_at)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.passwordHash || null}, ${user.avatarUrl || null}, ${user.facebookUserId || null}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        facebook_user_id = COALESCE(EXCLUDED.facebook_user_id, users.facebook_user_id),
        updated_at = NOW();
    `;
    return user;
  },

  // Pages
  getPages: async (userId?: string): Promise<FacebookPage[]> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = userId
      ? await sql`SELECT * FROM facebook_pages WHERE user_id = ${userId} ORDER BY created_at DESC`
      : await sql`SELECT * FROM facebook_pages ORDER BY created_at DESC`;

    return rows.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      pageId: r.page_id,
      pageName: r.page_name,
      pageAvatarUrl: r.page_avatar_url,
      pageAccessToken: r.page_access_token,
      verifyToken: r.verify_token,
      appSecret: r.app_secret,
      isActive: r.is_active,
      personaTemplate: r.persona_template,
      customSystemPrompt: r.custom_system_prompt,
      insideCityDeliveryFee: Number(r.inside_city_delivery_fee),
      outsideCityDeliveryFee: Number(r.outside_city_delivery_fee),
      currency: r.currency,
      allowDiscount: r.allow_discount,
      maxDiscountPercent: Number(r.max_discount_percent),
      codEnabled: r.cod_enabled,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  },

  getPageByPageId: async (pageId: string): Promise<FacebookPage | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`SELECT * FROM facebook_pages WHERE page_id = ${pageId} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      pageId: r.page_id,
      pageName: r.page_name,
      pageAvatarUrl: r.page_avatar_url,
      pageAccessToken: r.page_access_token,
      verifyToken: r.verify_token,
      appSecret: r.app_secret,
      isActive: r.is_active,
      personaTemplate: r.persona_template,
      customSystemPrompt: r.custom_system_prompt,
      insideCityDeliveryFee: Number(r.inside_city_delivery_fee),
      outsideCityDeliveryFee: Number(r.outside_city_delivery_fee),
      currency: r.currency,
      allowDiscount: r.allow_discount,
      maxDiscountPercent: Number(r.max_discount_percent),
      codEnabled: r.cod_enabled,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  },

  savePage: async (page: FacebookPage): Promise<FacebookPage> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      INSERT INTO facebook_pages (
        id, user_id, page_id, page_name, page_avatar_url, page_access_token,
        verify_token, app_secret, is_active, persona_template, custom_system_prompt,
        inside_city_delivery_fee, outside_city_delivery_fee, currency, allow_discount,
        max_discount_percent, cod_enabled, updated_at
      ) VALUES (
        ${page.id}, ${page.userId || null}, ${page.pageId}, ${page.pageName},
        ${page.pageAvatarUrl || null}, ${page.pageAccessToken}, ${page.verifyToken},
        ${page.appSecret || null}, ${page.isActive}, ${page.personaTemplate},
        ${page.customSystemPrompt || null}, ${page.insideCityDeliveryFee},
        ${page.outsideCityDeliveryFee}, ${page.currency}, ${page.allowDiscount},
        ${page.maxDiscountPercent}, ${page.codEnabled}, NOW()
      )
      ON CONFLICT (page_id) DO UPDATE SET
        user_id = COALESCE(EXCLUDED.user_id, facebook_pages.user_id),
        page_name = EXCLUDED.page_name,
        page_avatar_url = COALESCE(EXCLUDED.page_avatar_url, facebook_pages.page_avatar_url),
        page_access_token = EXCLUDED.page_access_token,
        is_active = EXCLUDED.is_active,
        persona_template = EXCLUDED.persona_template,
        custom_system_prompt = EXCLUDED.custom_system_prompt,
        inside_city_delivery_fee = EXCLUDED.inside_city_delivery_fee,
        outside_city_delivery_fee = EXCLUDED.outside_city_delivery_fee,
        currency = EXCLUDED.currency,
        allow_discount = EXCLUDED.allow_discount,
        max_discount_percent = EXCLUDED.max_discount_percent,
        cod_enabled = EXCLUDED.cod_enabled,
        updated_at = NOW();
    `;
    return page;
  },

  // Products
  getProducts: async (pageId?: string): Promise<Product[]> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = pageId
      ? await sql`SELECT * FROM products WHERE page_id = ${pageId} AND is_active = TRUE ORDER BY created_at DESC`
      : await sql`SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC`;

    return rows.map((r: any) => ({
      id: r.id,
      pageId: r.page_id,
      sku: r.sku,
      title: r.title,
      description: r.description,
      category: r.category,
      price: Number(r.price),
      discountPrice: r.discount_price ? Number(r.discount_price) : undefined,
      stockQuantity: r.stock_quantity,
      images: Array.isArray(r.images) ? r.images : [],
      variants: r.variants || {},
      visualTraits: r.visual_traits,
      isActive: r.is_active,
      createdAt: r.created_at,
    }));
  },

  saveProduct: async (product: Product): Promise<Product> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      INSERT INTO products (
        id, page_id, sku, title, description, category, price, discount_price,
        stock_quantity, images, variants, visual_traits, is_active
      ) VALUES (
        ${product.id}, ${product.pageId}, ${product.sku || null}, ${product.title},
        ${product.description || ""}, ${product.category || "General"}, ${product.price},
        ${product.discountPrice || null}, ${product.stockQuantity},
        ${JSON.stringify(product.images || [])}::jsonb,
        ${JSON.stringify(product.variants || {})}::jsonb,
        ${product.visualTraits || null}, ${product.isActive}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        price = EXCLUDED.price,
        discount_price = EXCLUDED.discount_price,
        stock_quantity = EXCLUDED.stock_quantity,
        images = EXCLUDED.images,
        variants = EXCLUDED.variants,
        visual_traits = EXCLUDED.visual_traits,
        is_active = EXCLUDED.is_active;
    `;
    return product;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      pageId: r.page_id,
      sku: r.sku,
      title: r.title,
      description: r.description,
      category: r.category,
      price: Number(r.price),
      discountPrice: r.discount_price ? Number(r.discount_price) : undefined,
      stockQuantity: r.stock_quantity,
      images: Array.isArray(r.images) ? r.images : [],
      variants: r.variants || {},
      visualTraits: r.visual_traits,
      isActive: r.is_active,
      createdAt: r.created_at,
    };
  },

  batchAddProducts: async (newProducts: Product[]): Promise<void> => {
    for (const prod of newProducts) {
      await pgDb.saveProduct(prod);
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const res = await sql`DELETE FROM products WHERE id = ${id}`;
    return true;
  },

  decrementProductStock: async (id: string, qty: number = 1): Promise<void> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      UPDATE products
      SET stock_quantity = GREATEST(0, stock_quantity - ${qty})
      WHERE id = ${id}
    `;
  },

  // Customers
  getCustomerByPsid: async (pageId: string, psid: string): Promise<Customer | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`SELECT * FROM customers WHERE page_id = ${pageId} AND psid = ${psid} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      pageId: r.page_id,
      psid: r.psid,
      fullName: r.full_name,
      profilePic: r.profile_pic,
      phoneNumber: r.phone_number,
      deliveryAddress: r.delivery_address,
      totalOrdersCount: Number(r.total_orders_count),
      totalSpend: Number(r.total_spend),
      createdAt: r.created_at,
    };
  },

  saveCustomer: async (customer: Customer): Promise<Customer> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      INSERT INTO customers (
        id, page_id, psid, full_name, profile_pic, phone_number,
        delivery_address, total_orders_count, total_spend
      ) VALUES (
        ${customer.id}, ${customer.pageId}, ${customer.psid}, ${customer.fullName || null},
        ${customer.profilePic || null}, ${customer.phoneNumber || null},
        ${customer.deliveryAddress || null}, ${customer.totalOrdersCount || 0}, ${customer.totalSpend || 0}
      )
      ON CONFLICT (page_id, psid) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, customers.full_name),
        profile_pic = COALESCE(EXCLUDED.profile_pic, customers.profile_pic),
        phone_number = COALESCE(EXCLUDED.phone_number, customers.phone_number),
        delivery_address = COALESCE(EXCLUDED.delivery_address, customers.delivery_address),
        total_orders_count = EXCLUDED.total_orders_count,
        total_spend = EXCLUDED.total_spend;
    `;
    return customer;
  },

  // Conversations & Messages
  getConversations: async (pageId?: string): Promise<Conversation[]> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const convRows = pageId
      ? await sql`SELECT * FROM conversations WHERE page_id = ${pageId} ORDER BY last_customer_message_at DESC`
      : await sql`SELECT * FROM conversations ORDER BY last_customer_message_at DESC`;

    if (!convRows || convRows.length === 0) return [];

    const convs: Conversation[] = [];
    for (const c of convRows) {
      const msgRows = await sql`
        SELECT * FROM messages WHERE conversation_id = ${c.id} ORDER BY created_at ASC
      `;
      convs.push({
        id: c.id,
        pageId: c.page_id,
        customerId: c.customer_id,
        psid: c.psid,
        customerName: c.customer_name,
        customerPic: c.customer_pic,
        isAiActive: c.is_ai_active,
        handoverTrigger: c.handover_trigger,
        unreadByHuman: c.unread_by_human,
        lastMessagePreview: c.last_message_preview || "",
        lastCustomerMessageAt: c.last_customer_message_at,
        messages: msgRows.map((m: any) => ({
          id: m.id,
          conversationId: m.conversation_id,
          senderType: m.sender_type,
          messageType: m.message_type,
          content: m.content || "",
          mediaUrl: m.media_url,
          timestamp: m.created_at,
        })),
      });
    }
    return convs;
  },

  getConversationByPsid: async (pageId: string, psid: string): Promise<Conversation | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`SELECT * FROM conversations WHERE page_id = ${pageId} AND psid = ${psid} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const c = rows[0];
    const msgRows = await sql`
      SELECT * FROM messages WHERE conversation_id = ${c.id} ORDER BY created_at ASC
    `;
    return {
      id: c.id,
      pageId: c.page_id,
      customerId: c.customer_id,
      psid: c.psid,
      customerName: c.customer_name,
      customerPic: c.customer_pic,
      isAiActive: c.is_ai_active,
      handoverTrigger: c.handover_trigger,
      unreadByHuman: c.unread_by_human,
      lastMessagePreview: c.last_message_preview || "",
      lastCustomerMessageAt: c.last_customer_message_at,
      messages: msgRows.map((m: any) => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderType: m.sender_type,
        messageType: m.message_type,
        content: m.content || "",
        mediaUrl: m.media_url,
        timestamp: m.created_at,
      })),
    };
  },

  saveConversation: async (conv: Conversation): Promise<Conversation> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      INSERT INTO conversations (
        id, page_id, customer_id, psid, customer_name, customer_pic,
        is_ai_active, handover_trigger, unread_by_human, last_message_preview, last_customer_message_at
      ) VALUES (
        ${conv.id}, ${conv.pageId}, ${conv.customerId}, ${conv.psid}, ${conv.customerName},
        ${conv.customerPic || null}, ${conv.isAiActive}, ${conv.handoverTrigger || null},
        ${conv.unreadByHuman}, ${conv.lastMessagePreview || ""}, ${conv.lastCustomerMessageAt || new Date().toISOString()}
      )
      ON CONFLICT (page_id, psid) DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        customer_pic = COALESCE(EXCLUDED.customer_pic, conversations.customer_pic),
        is_ai_active = EXCLUDED.is_ai_active,
        handover_trigger = EXCLUDED.handover_trigger,
        unread_by_human = EXCLUDED.unread_by_human,
        last_message_preview = EXCLUDED.last_message_preview,
        last_customer_message_at = EXCLUDED.last_customer_message_at;
    `;
    return conv;
  },

  addMessageToConversation: async (
    pageId: string,
    psid: string,
    customerName: string,
    message: Omit<Message, "id" | "conversationId" | "timestamp">
  ): Promise<Conversation> => {
    await ensurePostgresSchema();
    const sql = getSql();
    let conv = await pgDb.getConversationByPsid(pageId, psid);
    const convId = conv ? conv.id : "conv-" + Date.now();
    const msgId = "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);

    if (!conv) {
      conv = {
        id: convId,
        pageId,
        customerId: "cust-" + Date.now(),
        psid,
        customerName: customerName || "Facebook Buyer",
        isAiActive: true,
        unreadByHuman: false,
        lastMessagePreview: (message.content || "").substring(0, 80),
        lastCustomerMessageAt: new Date().toISOString(),
        messages: [],
      };
      await pgDb.saveConversation(conv);
    } else {
      await sql`
        UPDATE conversations
        SET last_message_preview = ${(message.content || "").substring(0, 80)},
            last_customer_message_at = NOW()
        WHERE id = ${convId}
      `;
    }

    await sql`
      INSERT INTO messages (id, conversation_id, sender_type, message_type, content, media_url, created_at)
      VALUES (${msgId}, ${convId}, ${message.senderType}, ${message.messageType}, ${message.content || null}, ${message.mediaUrl || null}, NOW())
    `;

    return (await pgDb.getConversationByPsid(pageId, psid))!;
  },

  setAiActiveState: async (pageId: string, psid: string, isAiActive: boolean, reason?: string): Promise<void> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      UPDATE conversations
      SET is_ai_active = ${isAiActive},
          handover_trigger = ${reason || null},
          unread_by_human = ${!isAiActive}
      WHERE page_id = ${pageId} AND psid = ${psid}
    `;
  },

  // Orders
  getOrders: async (pageId?: string): Promise<Order[]> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = pageId
      ? await sql`SELECT * FROM orders WHERE page_id = ${pageId} ORDER BY created_at DESC`
      : await sql`SELECT * FROM orders ORDER BY created_at DESC`;

    return rows.map((r: any) => ({
      id: r.id,
      orderNumber: r.order_number,
      pageId: r.page_id,
      customerId: r.customer_id,
      items: typeof r.items === "string" ? JSON.parse(r.items) : (r.items || []),
      subtotal: Number(r.subtotal),
      deliveryFee: Number(r.delivery_fee),
      discountAmount: Number(r.discount_amount),
      totalAmount: Number(r.total_amount),
      shippingName: r.shipping_name,
      shippingPhone: r.shipping_phone,
      shippingAddress: r.shipping_address,
      paymentMethod: r.payment_method,
      status: r.status,
      createdAt: r.created_at,
    }));
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      orderNumber: r.order_number,
      pageId: r.page_id,
      customerId: r.customer_id,
      items: typeof r.items === "string" ? JSON.parse(r.items) : (r.items || []),
      subtotal: Number(r.subtotal),
      deliveryFee: Number(r.delivery_fee),
      discountAmount: Number(r.discount_amount),
      totalAmount: Number(r.total_amount),
      shippingName: r.shipping_name,
      shippingPhone: r.shipping_phone,
      shippingAddress: r.shipping_address,
      paymentMethod: r.payment_method,
      status: r.status,
      createdAt: r.created_at,
    };
  },

  createOrder: async (order: Order): Promise<Order> => {
    await ensurePostgresSchema();
    const sql = getSql();
    await sql`
      INSERT INTO orders (
        id, order_number, page_id, customer_id, items, subtotal, delivery_fee,
        discount_amount, total_amount, shipping_name, shipping_phone, shipping_address,
        payment_method, status, created_at
      ) VALUES (
        ${order.id}, ${order.orderNumber}, ${order.pageId}, ${order.customerId || null},
        ${JSON.stringify(order.items)}::jsonb, ${order.subtotal}, ${order.deliveryFee},
        ${order.discountAmount || 0}, ${order.totalAmount}, ${order.shippingName},
        ${order.shippingPhone}, ${order.shippingAddress}, ${order.paymentMethod || "COD"},
        ${order.status || "confirmed"}, NOW()
      )
    `;

    // Decrement stock for ordered items
    for (const item of order.items) {
      if (item.productId) {
        await pgDb.decrementProductStock(item.productId, item.quantity || 1).catch((e) =>
          console.warn("[Postgres Stock Decrement]", e)
        );
      }
    }

    return order;
  },

  updateOrderStatus: async (orderId: string, status: Order["status"]): Promise<Order | null> => {
    await ensurePostgresSchema();
    const sql = getSql();
    const rows = await sql`
      UPDATE orders SET status = ${status} WHERE id = ${orderId} RETURNING *
    `;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      orderNumber: r.order_number,
      pageId: r.page_id,
      customerId: r.customer_id,
      items: typeof r.items === "string" ? JSON.parse(r.items) : (r.items || []),
      subtotal: Number(r.subtotal),
      deliveryFee: Number(r.delivery_fee),
      discountAmount: Number(r.discount_amount),
      totalAmount: Number(r.total_amount),
      shippingName: r.shipping_name,
      shippingPhone: r.shipping_phone,
      shippingAddress: r.shipping_address,
      paymentMethod: r.payment_method,
      status: r.status,
      createdAt: r.created_at,
    };
  },
};
