# 🚀 BECHO (বেচো / बेचो)
### *Autonomous AI Social Sales & Support Engine for Facebook Pages*

Built as a fullstack **Next.js 15 (TypeScript, React 19, Tailwind CSS, Vercel-ready)** platform.

---

## 🌟 Key Capabilities
1. **60-Second Zero-Friction Onboarding**: 
   - Instant 1-click connection or manual token assistant with live **Test Ping** validator.
2. **3.5s Multi-Message Burst Debouncer**:
   - Aggregates fragmented customer messages (*"Hi"*, *"is this available"*, *"size L?"*, *"delivery cost?"*) into a single coherent prompt before invoking AI.
3. **Multimodal Visual Search (Photo RAG)**:
   - Uses Gemini 2.5 Flash Vision to match customer screenshots against your product catalog.
4. **Direct In-Chat Cash-on-Delivery (COD) Order Closing**:
   - Collects customer Name, Phone, and Delivery Address directly inside Messenger without dumping external links.
5. **Live Human Handover with 1-Click Takeover**:
   - Allows store moderators to pause AI for specific customer threads and reply directly from the dashboard.

---

## 🚀 Quickstart (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local` and add your Google Gemini API key:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
META_VERIFY_TOKEN=becho_secure_verify_token_2026
```
*(Note: If `GEMINI_API_KEY` is left blank, Becho runs in built-in **Consultative Sales Simulator mode**, allowing instant local testing without an API key!)*

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📱 Navigation & App Pages

- **Landing Page & Pitch**: [http://localhost:3000/](http://localhost:3000/)
- **60s Onboarding Wizard**: [http://localhost:3000/onboarding](http://localhost:3000/onboarding)
- **Live Chat Sandbox Simulator**: [http://localhost:3000/onboarding?step=4](http://localhost:3000/onboarding?step=4)
- **Merchant Management Portal**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## ⚡ Meta Developer Webhook Setup (For Live Facebook Pages)

When deploying to Vercel:
1. In Meta Developer App $\rightarrow$ **Messenger** $\rightarrow$ **Webhooks**:
   - **Callback URL**: `https://your-domain.vercel.app/api/webhooks/meta`
   - **Verify Token**: `becho_secure_verify_token_2026`
2. Subscribe to Page Events:
   - `messages`
   - `messaging_postbacks`
   - `message_reads`
3. Generate a **Page Access Token** with `pages_messaging` permission and enter it into Becho's Onboarding wizard.

---

## 🧪 Testing Multi-Message Bursts (Simulation Script)

To simulate rapid customer bursts locally:
```bash
node scripts/simulate_webhook.js
```
Dispatches 3 rapid messages within 2 seconds to test the 3.5-second sliding-window debouncer and order generation!
