# 🚀 Project "BECHO" (বেচো / बेचो) — Autonomous AI Social Sales & Support Engine
### *Chief AI Bot Architect & Conversational Commerce Production SaaS Blueprint*

---

## 1. Executive Strategic Vision & The Unfair Advantage

**Becho** (*literally "Sell!"*) is an autonomous, high-converting social commerce AI SaaS engineered specifically for Facebook Pages and the Meta Messenger ecosystem. 

### The Market Problem: "The 15-Minute Death Clock"
In modern social commerce (fashion, electronics, cosmetics, D2C brands, boutique food):
1. **82% of customer inquiries arrive after 7:00 PM or on weekends** when business page owners and moderators are asleep or off-duty.
2. **The 15-Minute Rule**: Social buyers are impulsive and message 3–4 competing Facebook pages simultaneously. If a page does not answer within **15 minutes**, the probability of closing the sale drops by **80%**.
3. **The Multi-Media Reality**: Customers do not type formal emails. They send:
   - 4 rapid-fire fragmented text bursts in 5 seconds (*"Hi"*, *"is this available"*, *"price please"*, *"size M?"*).
   - Screenshots of dresses/watches from Instagram/FB posts asking: *"How much for this one?"*
   - 10-second casual voice notes in regional colloquial accents while on the move.
4. **Current Tools Fail Miserably**:
   - **ManyChat / Chatfuel**: Require complex visual drag-and-drop flowcharts with 50 decision nodes. Non-technical shop owners get overwhelmed and abandon setup within 20 minutes.
   - **Generic ChatGPT Wrappers**: Act like polite Wikipedia bots that give walls of text, hallucinate discounts, or link out to external websites (killing social chat conversion).
   - **SleekFlow / Respond.io**: Enterprise customer service desks that charge hefty per-seat fees ($100–$300/mo) and focus on human agent ticketing rather than autonomous sales closing.

### Becho's Unfair Advantage (The "Closer" Value Proposition)
```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           THE BECHO VALUE PROPOSITION                             │
├──────────────────────────────┬────────────────────────────────────────────────────┤
│ Traditional Chatbots         │ BECHO Autonomous Sales Closer                      │
├──────────────────────────────┼────────────────────────────────────────────────────┤
│ ❌ 2-hour complex flow setup  │ ✅ 60-second zero-code onboarding                  │
│ ❌ Dumps external web links  │ ✅ Closes orders directly inside Messenger (COD)   │
│ ❌ Breaks on multi-messages  │ ✅ 3.5s Redis sliding-window debouncing buffer     │
│ ❌ Blind to customer photos  │ ✅ Multimodal Visual RAG (Image-to-Catalog search) │
│ ❌ Deaf to audio clips       │ ✅ Real-time Voice Note transcription (STT)        │
│ ❌ Rigid FAQ responder       │ ✅ Consultative Sales Engine (SPIN/Challenger)     │
│ ❌ $300+/mo human moderators │ ✅ $29-$49/mo: 24/7/365 instant 2-second replies  │
└──────────────────────────────┴────────────────────────────────────────────────────┘
```

---

## 2. Competitive Landscape Benchmark

| Feature Matrix | ManyChat | Chatfuel | SleekFlow | Gorgias | **BECHO** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Setup Time** | 2–4 hours | 1–2 hours | 1–3 days | 1–2 days | **< 60 seconds** |
| **Non-Tech Friendly** | Medium (Complex flows) | Medium | Low (Enterprise CRM) | Low (Helpdesk) | **Ultra-High (Self-serve)** |
| **Direct In-Chat Order Closing** | Requires webview/Stripe | Limited | Manual agent link | Via Shopify link | **Native Slot-filling (COD/Prepay)** |
| **Multi-Burst Debouncer** | ❌ No (fires 4 times) | ❌ No | ❌ No | ❌ No | **✅ Native 3.5s Buffer** |
| **Customer Photo Visual Search** | ❌ No | ❌ No | ❌ No | ❌ No | **✅ Gemini 2.5 Flash Vision RAG** |
| **Audio Voice Note Handling** | ❌ No | ❌ No | ❌ No | ❌ No | **✅ Native Audio Transcription** |
| **Local Languages / Slang** | Poor | Average | Average | Average | **✅ Tuned for regional dialects** |
| **Pricing Model** | Contact-size penalty | AI token caps | High per-seat cost | High per-ticket cost | **Predictable Flat Monthly SaaS** |

---

## 3. The "60-Second Zero-Friction" Onboarding Funnel

For individual, non-technical page owners, friction is the #1 churn driver. If they need to open Meta Developer Console, create an app, configure webhooks, or verify tokens manually, 85% will abandon.

Becho provides a **Dual Onboarding Engine**:
- **Path A (One-Click Facebook Login)**: For 95% of non-tech merchants.
- **Path B (Power-User Guided Token Assistant)**: For agencies or merchants using custom Meta App credentials.

### Step-by-Step Onboarding Architecture & UX Wireframe

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 BECHO 4-STEP ONBOARDING WIZARD                         │
  ├────────────────────────────────────────────────────────────────────────┤
  │  [1. Connect Page] ──► [2. Feed Catalog] ──► [3. Sales Rules] ──► [4. Test & Launch] │
  └────────────────────────────────────────────────────────────────────────┘
```

#### Step 1: Connect Your Facebook Page (30 Seconds)
- **Path A: "Continue with Facebook" (OAuth 2.0)**:
  - User clicks single button $\rightarrow$ Meta OAuth Dialog opens.
  - Required Scopes requested: `pages_show_list`, `pages_messaging`, `pages_manage_metadata`.
  - Merchant selects which page(s) they want to automate.
  - Backend automatically retrieves the long-lived Page Access Token, generates a unique secure webhook endpoint, and subscribes to page messaging events via Meta Graph API.
- **Path B: "Manual Token / Agency Mode" (Interactive Assistant)**:
  - Simple 3-field card: `Page ID`, `Page Access Token`, `App Secret`.
  - Includes a 30-second embedded Loom/GIF showing where to copy tokens.
  - **"Test Connection" Ping**: An instant in-app validator pings Meta API `GET /{page_id}?fields=name,picture,followers_count` and displays green confirmation: *"Connected to: Sneaker Store BD (14,200 Followers) ✅"*.

#### Step 2: Feed Your Product Catalog (15 Seconds)
Merchants can choose any method that suits their current workflow:
1. **1-Click Auto-Scan (Magic Mode)**:
   - Becho reads the page's pinned posts, Meta Commerce Shop catalog, or recent photo albums with captions. Automatically extracts product titles, prices, and photos.
2. **Google Sheets / Excel Drag-and-Drop**:
   - Merchant pastes a Google Sheet URL or drops an `.xlsx`/`.csv`.
   - AI auto-detects columns: `Product Name`, `Price`, `Category`, `Sizes/Variants`, `Photo Link`, `Stock Status`.
3. **Fast Manual Card**:
   - For small boutique sellers with 5–20 items: Add item with Title, Price, Sizes, Stock, and image upload.

#### Step 3: Configure Sales Persona & Guardrails (10 Seconds)
Pre-tuned business templates with 1-click selection:
- **Preset Persona**:
  - 👗 *Fashion & Lifestyle*: Warm, trendy, uses tasteful emojis, proactively asks for sizing/measurements.
  - 📱 *Gadgets & Electronics*: Spec-focused, warranty-reassuring, confirms model numbers and accessories.
  - 💄 *Beauty & Cosmetics*: Consultative, checks skin type/allergies, emphasizes 100% authenticity.
  - 🍔 *Food & Cloud Kitchen*: Craving-inducing, checks delivery radius, asks for spice preferences.
- **Commercial Guardrails**:
  - **Delivery Fees**: Inside City (e.g., $2 / ৳70), Outside City (e.g., $4 / ৳130).
  - **Payment Options**: Cash on Delivery (COD) [Default ON], Manual Bank/bKash/UPI, or Stripe Payment Link.
  - **Negotiation Rules**: *"Can the AI offer discounts?"*
    - [Strict: No discounts]
    - [Smart: Allow up to 5% coupon only if customer asks for discount twice]

#### Step 4: Live Sandbox Test Drive & 1-Click Launch (5 Seconds)
- Before touching live Facebook customers, the merchant gets an **in-browser interactive chat simulator**:
  - Merchant tests: *"Is the blue sneakers in stock?"*
  - The AI instantly replies with product card, price, and closes: *"Yes! 3 pairs left in Size 42. Shall I book Cash-on-Delivery for you?"*
- Merchant flips the big switch: **[ 🚀 ACTIVATE BECHO ON FACEBOOK PAGE ]**.
- The bot is now live 24/7 on Facebook Messenger!

---

## 4. End-to-End System Architecture

```
                                [Customer on Facebook / Messenger]
                                                 │
                                                 │ (Sends Text / Burst / Photo / Voice)
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │    Meta Messenger Graph API Webhook   │
                             └───────────────────┬───────────────────┘
                                                 │ HTTPS POST (< 500ms ACK)
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │       FastAPI Gateway (Port 8000)     │
                             │  • Meta SHA-256 Signature Verify      │
                             │  • Fast 200 OK Response               │
                             └───────────────────┬───────────────────┘
                                                 │ Enqueue Event
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │     Redis Multi-Message Debouncer     │
                             │  • Key: chat:buffer:{page}:{user}     │
                             │  • Sliding Window: 3.5 Seconds        │
                             └───────────────────┬───────────────────┘
                                                 │ Aggregated Payload
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │     AI Agent Dispatcher & Router      │
                             └───────────────────┬───────────────────┘
                                                 │
                ┌────────────────────────────────┼────────────────────────────────┐
                ▼                                ▼                                ▼
    ┌───────────────────────┐        ┌───────────────────────┐        ┌───────────────────────┐
    │    Multimodal Vision  │        │   Audio Voice Decoder │        │  Text & Intent Parser │
    │ • Gemini 2.5 Flash    │        │ • Gemini Audio / STT  │        │ • Regional Slang      │
    │ • Visual Trait Vector │        │ • Dialect & Sentiment │        │ • Conversational Mem  │
    └───────────┬───────────┘        └───────────┬───────────┘        └───────────┬───────────┘
                │                                │                                │
                └────────────────────────────────┼────────────────────────────────┘
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │     Semantic Product RAG Engine       │
                             │  • PostgreSQL 16 + pgvector (768-dim) │
                             │  • Trigram SKU/Title Keyword Match    │
                             │  • Stock Verification Guardrail       │
                             └───────────────────┬───────────────────┘
                                                 │ Matched Inventory + Policies
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │     Sales Closer Agent (LangGraph)    │
                             │  • SPIN Sales Stage Progression       │
                             │  • Order Slot Extractor (Name, Phone, │
                             │    Address, Size, Payment Method)     │
                             │  • Dynamic Discounting Boundaries     │
                             └───────────────────┬───────────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
         [If Order Ready / Inquiry Answered]                   [If Frustration / Dispute]
                        │                                                 │
         ┌───────────────────────────────┐                 ┌─────────────────────────────┐
         │ Meta Template Builder         │                 │ Human Handover Service      │
         │ • Native Generic Carousels    │                 │ • Auto-mute AI for thread   │
         │ • Quick Reply Size/Color Chips│                 │ • Push notification to owner│
         │ • Messenger Receipt Card      │                 │ • Webhook to Live Inbox     │
         └──────────────┬────────────────┘                 └─────────────────────────────┘
                        │
                        ▼
         [Meta Graph Send API: POST /v20.0/me/messages]
                        │
                        ▼
         [Delivered to Customer in Messenger (< 2.5s)]
```

---

## 5. Production Deep-Dive: Core Engineering Modules

### 5.1. The Redis Multi-Message Debouncer (Solving the 4-Message Burst)
When customers send multiple messages rapidly:
```
T+0.0s: "Hi"
T+1.2s: "Is this watch available?"
T+2.5s: "Can I get it in silver?"
T+3.2s: "Delivery to Chittagong how much?"
```
**Engineering Implementation**:
1. When a webhook arrives, push the payload into a Redis list `chat:buffer:{page_id}:{sender_id}`.
2. Reset a Redis timer key `chat:timer:{page_id}:{sender_id}` with TTL = `3.5` seconds.
3. A background Redis Key-Expiration Listener or ARQ Delayed Task checks when the timer expires.
4. When expired, all messages in the list are atomically popped (`LPOP` / `PIPELINE`), joined with newlines, media URLs aggregated, and dispatched as a **single multimodal request** to the LLM.
5. **Result**: Zero duplicate replies, 75% savings in LLM token costs, and a coherent human-like response.

### 5.2. Visual Product RAG (Customer Photo $\rightarrow$ Exact Catalog Match)
1. **Photo Received**: Webhook `entry[0].messaging[0].message.attachments[0].payload.url`.
2. **Feature Extraction**: Download image stream, send to **Gemini 2.5 Flash Vision** with structured prompt:
   ```json
   {
     "category": "men_footwear",
     "color_primary": "navy_blue",
     "style": "running_sneakers",
     "distinguishing_marks": "white sole, mesh fabric",
     "search_query": "navy blue mesh running sneakers white sole"
   }
   ```
3. **Hybrid Search in PostgreSQL**:
   ```sql
   SELECT id, title, price, discount_price, stock_quantity, images,
          (1 - (embedding <=> :query_vector)) AS similarity
   FROM products
   WHERE page_id = :page_id AND stock_quantity > 0
   ORDER BY similarity DESC
   LIMIT 5;
   ```
4. **Messenger Presentation**: Return matched product as a native Facebook Messenger **Generic Carousel** with high-resolution photo, price, and "Order This Now 🛍️" button.

### 5.3. Audio Voice Note Decoding
1. **Audio Received**: Messenger sends `.mp4` or `.aac` audio attachment.
2. **Audio Transcription**: Pipe audio into Gemini Audio / Whisper API with language hinting (`bn-BD`, `hi-IN`, `en-US`, `es-ES`).
3. **Sentiment & Content Extraction**: Text transcript is injected into conversation context with metadata `[Customer sent 8s Voice Note: "..."]`.
4. The bot responds in text or generates a quick localized audio note if the merchant enables voice responses.

### 5.4. Frictionless Order Slot-Filling & COD Closing
The AI agent runs a deterministic slot-filling validation tool before creating an order:
```python
class OrderSlotSchema(BaseModel):
    product_id: UUID
    variant_size: Optional[str] = None
    variant_color: Optional[str] = None
    quantity: int = 1
    customer_name: str
    phone_number: str # Validated via regex for country format
    shipping_address: str # Must contain street/area + city
    payment_method: Literal["COD", "ONLINE_PAYMENT"] = "COD"
```
When slots are filled, Becho:
1. Deducts product stock in PostgreSQL.
2. Creates an `orders` record with `status: 'confirmed'`.
3. Dispatches a Meta Messenger **Receipt Template** with order number and tracking code.
4. Sends a Telegram/WhatsApp/Web-Push notification to the shop owner: *"🎉 New Order #BC-9042 from Sarah for $45.00! Delivery: Dhaka COD"*.

---

## 6. Live Human Handover & Team Inbox

AI should never be an inescapable trap. When a customer needs a human, the transition must be seamless.

### Triggers for Auto-Escalation
1. **Explicit Request**: Keywords like *"human"*, *"call me"*, *"talk to manager"*, *"agent"*, *"owner"*.
2. **Frustration / Negative Sentiment**: Customer uses hostile language, caps-lock aggression, or multiple angry emojis (😡, 🤬).
3. **Complex Dispute**: Issues regarding broken packages, delivery delays over 5 days, or refund claims.

### Handover Execution Protocol
1. Set `conversations.is_ai_active = FALSE`.
2. AI replies politely: *"I am putting you in touch with our store manager right away. They will take over this chat momentarily! ⏳"*.
3. Emit WebSocket event `handover_alert` to the Becho Merchant Web Dashboard.
4. Play audible chime on merchant's browser / send push notification to mobile phone.
5. In the dashboard live chat inbox, the merchant can type and reply directly through the Meta Graph API.
6. A single toggle button **[ Resume AI Bot 🤖 ]** re-activates automation whenever the human agent finishes.

---

## 7. Packaging, Pricing & Go-To-Market (Sellable SaaS)

To successfully sell this to business page owners, the pricing must be **dead simple**, tied to their revenue, and eliminate fear of runaway token bills.

### The Pricing Tiers

```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│       STARTER PLAN        │        GROWTH PLAN        │      SCALE / AGENCY       │
│      $19 / Month          │        $49 / Month        │       $149 / Month        │
│    (For Solo Sellers)     │    (Our Best Seller 🔥)   │   (High-Volume / Multi)   │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ • 1 Facebook Page         │ • 2 Facebook Pages        │ • Up to 8 Facebook Pages  │
│ • Up to 1,000 Chats/mo    │ • Up to 6,000 Chats/mo    │ • 30,000 Chats/mo         │
│ • Up to 50 Products       │ • Unlimited Products      │ • Unlimited Products      │
│ • 3.5s Multi-burst Engine │ • Multi-burst Engine      │ • Multi-burst Engine      │
│ • Automated COD Orders    │ • Automated COD & Online  │ • Full Custom Webhooks    │
│ • Text & Emojis Support   │ • Photo Visual Search ✨  │ • Photo + Voice Notes ✨  │
│ • Standard Support        │ • Voice Note Audio STT ✨ │ • Priority 24/7 Support   │
│                           │ • Abandoned Cart Winback  │ • Dedicated Account Rep   │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### The "Irresistible Offer" Pitch Script for Page Owners
> *"How much do you pay your chat moderators every month? $200? $400? And what happens when a customer messages at 2:00 AM while your staff is asleep? That buyer purchases from your competitor.*
> 
> *Meet **Becho**: The AI sales closer that lives on your Facebook page. It replies in 2 seconds, recognizes clothes and products from customer screenshots, understands voice notes, and closes cash-on-delivery orders directly inside Messenger.*
> 
> *Try it 100% free for 14 days. If it doesn't close at least 10 orders for your page, you pay nothing."*

---

## 8. Enterprise Production SLA & Reliability Architecture

Operating a mission-critical sales bot requires bulletproof production stability:
1. **Meta 5-Second Webhook SLA**:
   - Meta requires an HTTP `200 OK` response within 5 seconds; otherwise, it will retry exponentially and eventually disable the page webhook.
   - **FastAPI Fast-ACK**: The endpoint verifies the HMAC signature and returns `200 OK` in `< 150ms`, offloading all LLM and image processing to background Redis workers.
2. **Never-Expiring Page Access Tokens**:
   - Short-lived user tokens expire in 1–2 hours.
   - Becho's onboarding automatically exchanges short-lived tokens for **Long-Lived Page Access Tokens** (which have no expiration date unless the page admin changes their password or revokes app access).
   - Daily cron job verifies token validity using `GET /debug_token`.
3. **Graceful Degradation & Circuit Breaker**:
   - If the Gemini API experiences a latency spike (>4s), fallback to a high-speed cached intent classifier or polite hold message (*"Checking that for you right now..."*).
   - If a product image fails to load, fallback to text specs + direct purchase CTA.
4. **Data Isolation & Encryption**:
   - Multi-tenant database architecture where all queries enforce `WHERE page_id = :current_page_id`.
   - Access tokens encrypted at rest via **AES-256-GCM**.

---

## 9. Comprehensive Database Schema (Production-Grade)

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Merchant Accounts
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subscription_tier VARCHAR(50) DEFAULT 'trial', -- 'trial', 'starter', 'growth', 'scale'
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Connected Facebook Pages
CREATE TABLE facebook_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    page_id VARCHAR(64) UNIQUE NOT NULL,
    page_name VARCHAR(255) NOT NULL,
    page_avatar_url TEXT,
    page_access_token_encrypted TEXT NOT NULL, -- AES-256-GCM encrypted
    app_secret_proof VARCHAR(128),
    verify_token VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Persona & Sales Settings
    persona_template VARCHAR(50) DEFAULT 'fashion', -- 'fashion', 'gadgets', 'cosmetics', 'food', 'custom'
    custom_system_prompt TEXT,
    inside_city_delivery_fee DECIMAL(10,2) DEFAULT 70.00,
    outside_city_delivery_fee DECIMAL(10,2) DEFAULT 130.00,
    currency VARCHAR(10) DEFAULT 'BDT',
    allow_discount BOOLEAN DEFAULT FALSE,
    max_discount_percent INT DEFAULT 5,
    cod_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Catalog with Vector Embeddings
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
    sku VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 10,
    images TEXT[] NOT NULL DEFAULT '{}',
    variants JSONB DEFAULT '{"sizes": [], "colors": []}',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Visual & Textual Embeddings for Multimodal RAG
    embedding vector(768),
    visual_traits TEXT, -- AI extracted traits (e.g. "red floral long maxi dress")
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_page_id ON products(page_id);
CREATE INDEX idx_products_title_trgm ON products USING gin (title gin_trgm_ops);
CREATE INDEX idx_products_vector ON products USING hnsw (embedding vector_cosine_ops);

-- 4. Customer Directory
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
    psid VARCHAR(64) NOT NULL, -- Page-Scoped ID
    full_name VARCHAR(255),
    profile_pic TEXT,
    phone_number VARCHAR(50),
    delivery_address TEXT,
    city VARCHAR(100),
    total_orders_count INT DEFAULT 0,
    total_spend DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_id, psid)
);

-- 5. Conversations & Human Handover State
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    is_ai_active BOOLEAN DEFAULT TRUE,
    handover_trigger VARCHAR(50), -- 'sentiment_anger', 'explicit_human_request', 'dispute'
    unread_by_human BOOLEAN DEFAULT FALSE,
    last_customer_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_preview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Messages Log
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- 'customer', 'ai', 'human'
    message_type VARCHAR(20) NOT NULL, -- 'text', 'image', 'audio', 'carousel', 'receipt'
    text_content TEXT,
    media_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. "BC-10492"
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    items JSONB NOT NULL, -- [{"product_id": "...", "title": "...", "qty": 1, "price": 45.00, "variant": "Size M"}]
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'COD',
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 10. Complete Repository & Application Structure

```
becho/
├── backend/                            # FastAPI Production Core
│   ├── app/
│   │   ├── api/                        # Route Handlers
│   │   │   ├── v1/
│   │   │   │   ├── auth.py             # User signup, login, JWT
│   │   │   │   ├── pages.py            # Connect page, OAuth callback, ping test
│   │   │   │   ├── webhooks.py         # Meta Messenger Webhook receiver (<150ms ACK)
│   │   │   │   ├── products.py         # Product Catalog CRUD + CSV/Sheet Importer
│   │   │   │   ├── orders.py           # Orders list, status updates, exports
│   │   │   │   ├── chat.py             # Live inbox & Human takeover WebSocket
│   │   │   │   └── analytics.py        # GMV, conversion metrics, response speeds
│   │   ├── core/                       # Security & Database configs
│   │   │   ├── config.py               # Pydantic Settings
│   │   │   ├── database.py             # Async SQLAlchemy + pgvector pool
│   │   │   └── security.py             # AES-256 token cipher & Meta HMAC validator
│   │   ├── models/                     # SQLAlchemy Models (accounts, pages, products, etc.)
│   │   ├── services/                   # Business Logic & AI Microservices
│   │   │   ├── ai/
│   │   │   │   ├── orchestrator.py     # LangGraph conversational sales state machine
│   │   │   │   ├── prompts.py          # Consultative sales closing personas
│   │   │   │   ├── vision_search.py    # Gemini 2.5 Flash image feature extraction
│   │   │   │   ├── voice_transcribe.py # Voice note speech-to-text pipeline
│   │   │   │   └── tools.py            # Order slot-filling & catalog search tools
│   │   │   ├── meta/
│   │   │   │   ├── client.py           # Meta Graph API Send client
│   │   │   │   ├── templates.py        # Native Carousels, Quick Replies, Receipts
│   │   │   │   └── debouncer.py        # Redis sliding-window multi-message buffer
│   │   │   └── catalog/
│   │   │       ├── embeddings.py       # text-embedding-004 generator
│   │   │       └── search.py           # Hybrid vector + trigram catalog matcher
│   │   └── schemas/                    # Pydantic Schemas for requests/responses
│   ├── requirements.txt
│   ├── Dockerfile
│   └── main.py
│
├── frontend/                           # Merchant Portal (Next.js 15 + Tailwind CSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/           # Merchant Login & Registration
│   │   │   ├── onboarding/             # 4-Step 60-Second Onboarding Wizard
│   │   │   │   ├── step-1-connect/     # 1-Click FB Login + Manual Token Assistant
│   │   │   │   ├── step-2-catalog/     # CSV/Sheet Drag-and-Drop or Auto-Scan
│   │   │   │   ├── step-3-rules/       # Persona, Delivery fee & COD settings
│   │   │   │   └── step-4-sandbox/     # In-browser Live Chat Test Simulator
│   │   │   └── dashboard/              # Active Management
│   │   │       ├── overview/           # Revenue closed by AI, orders, chat volume
│   │   │       ├── products/           # Catalog manager, price updates, stock toggles
│   │   │       ├── orders/             # Order tracker, address copy, status toggle
│   │   │       ├── inbox/              # Real-time Messenger chats + [Takeover Human]
│   │   │       └── settings/           # Page credentials & AI tuning
│   │   ├── components/                 # UI components (shadcn/ui style)
│   │   └── lib/                        # WebSocket client, API fetchers
│   ├── package.json
│   └── tailwind.config.ts
│
├── docker-compose.yml                  # PostgreSQL (with pgvector), Redis, Backend, Frontend
├── plan.md                             # This master blueprint
└── README.md                           # Quickstart guide
```

---

## 11. 30-Day Execution Roadmap to Launch

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           30-DAY LAUNCH TIMELINE                              │
├────────────────────┬──────────────────────────────────────────────────────────┤
│ Week 1: Foundation │ • Setup FastAPI backend, PostgreSQL 16 + pgvector, Redis│
│                    │ • Implement Meta Webhook Gateway + HMAC validation       │
│                    │ • Build 3.5s Redis multi-burst message debouncer         │
│                    │ • Meta Send API service (Text, Carousels, Quick Replies) │
├────────────────────┼──────────────────────────────────────────────────────────┤
│ Week 2: AI Core    │ • Gemini 2.5 Flash Sales Closer Orchestrator             │
│                    │ • Multimodal Image-to-Catalog Visual Search (Vision RAG) │
│                    │ • Audio Voice Note speech-to-text pipeline               │
│                    │ • Deterministic Order Slot-Filling Engine (COD Closing)  │
├────────────────────┼──────────────────────────────────────────────────────────┤
│ Week 3: Onboarding │ • Next.js 15 Merchant Web Portal                         │
│   & Merchant UX    │ • 4-Step 60-second self-serve Onboarding Wizard          │
│                    │ • 1-Click Facebook OAuth & Token ping validation tester  │
│                    │ • In-browser Interactive Chat Simulator (Sandbox)        │
├────────────────────┼──────────────────────────────────────────────────────────┤
│ Week 4: Production │ • Live Human Handover Inbox + WebSocket push alerts      │
│   SaaS & Launch    │ • Subscription tiers & Stripe/Local payment integration  │
│                    │ • Beta onboarding with 5 pilot Facebook Pages            │
│                    │ • Public Launch & Social Commerce GTM Campaign           │
└────────────────────┴──────────────────────────────────────────────────────────┘
```
