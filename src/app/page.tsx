import Link from "next/link";
import {
  Sparkles,
  Zap,
  ShoppingBag,
  Camera,
  Mic,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { InteractiveMessengerHero } from "@/components/landing/InteractiveMessengerHero";
import { CodRoiCalculator } from "@/components/landing/CodRoiCalculator";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#070b14] overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/30">
            B
          </div>
          <div>
            <div className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              BECHO
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              বেচো • AI Sales Closer
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="#roi-calculator" className="hover:text-white transition">
            COD Calculator
          </Link>
          <Link href="#comparison" className="hover:text-white transition">
            ROI vs Human
          </Link>
          <Link href="#pricing" className="hover:text-white transition">
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Merchant Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/60 transition"
          >
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2 group"
          >
            <span>Connect Page (60s)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>The #1 Autonomous AI Social Sales Closer for Facebook Pages</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
          Turn Late-Night Facebook Chats into{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Confirmed Orders
          </span>{" "}
          in 2 Seconds.
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300/90 leading-relaxed mb-10">
          Over <strong>80% of social commerce buyers</strong> purchase from your
          competitor if you don&apos;t answer within 15 minutes. Becho responds
          instantly, understands <strong>customer photos & voice notes</strong>,
          handles 4-message bursts, and closes <strong>Cash on Delivery (COD)</strong>{" "}
          orders 24/7/365.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 text-yellow-300" />
            <span>Launch 60-Second Onboarding</span>
          </Link>
          <Link
            href="/onboarding?step=4"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-slate-800/80 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Test Live Chat Sandbox</span>
          </Link>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass p-5 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4" /> Response Speed
            </div>
            <div className="text-3xl font-extrabold text-white">&lt; 2.1s</div>
            <div className="text-xs text-slate-400">Zero missed night inquiries</div>
          </div>

          <div className="glass p-5 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold mb-1">
              <TrendingUp className="w-4 h-4" /> GMV Conversion
            </div>
            <div className="text-3xl font-extrabold text-white">+ 34%</div>
            <div className="text-xs text-slate-400">Average sales uplift</div>
          </div>

          <div className="glass p-5 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold mb-1">
              <Camera className="w-4 h-4" /> Visual AI Search
            </div>
            <div className="text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs text-slate-400">Finds items from photos</div>
          </div>

          <div className="glass p-5 rounded-2xl text-left border border-white/5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" /> Setup Time
            </div>
            <div className="text-3xl font-extrabold text-white">60 Sec</div>
            <div className="text-xs text-slate-400">Zero-code onboarding</div>
          </div>
        </div>

        {/* Live Interactive Messenger Preview */}
        <InteractiveMessengerHero />
      </section>

      {/* Feature Pillars */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 mb-3">
            Built for Real Social Shoppers
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white">
            Everything ordinary chatbots get wrong,{" "}
            <span className="text-indigo-400">Becho masters</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              3.5s Multi-Message Burst Debouncer
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Real buyers don&apos;t send one neat paragraph. They send 4 rapid
              messages: <em>&quot;Hi&quot;</em>, <em>&quot;is this blue dress in stock?&quot;</em>,{" "}
              <em>&quot;size L?&quot;</em>, <em>&quot;delivery cost?&quot;</em>
            </p>
            <p className="text-slate-300 text-sm font-medium">
              Becho buffers and aggregates all bursts into a single coherent prompt,
              replying with one structured, polite answer.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-pink-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Multimodal Visual Search (Photo RAG)
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              When a buyer screenshots a gown or watch from your Facebook feed and
              asks <em>&quot;Do you have this?&quot;</em>, ordinary bots fail.
            </p>
            <p className="text-slate-300 text-sm font-medium">
              Powered by Gemini 2.5 Flash Vision, Becho scans your inventory catalog
              and returns exact matched items, prices, and stock status in seconds.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-yellow-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Direct In-Chat COD Order Closing
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Dumping external website links kills social conversion. Customers want
              to buy directly inside Messenger without leaving the app.
            </p>
            <p className="text-slate-300 text-sm font-medium">
              Becho extracts customer name, phone number, and delivery address to
              instantly generate verified Cash-on-Delivery (COD) orders.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive COD ROI Calculator */}
      <CodRoiCalculator />

      {/* Comparison: Human Moderator vs Becho */}
      <section id="comparison" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 mb-3">
            Economic Breakdown
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Hiring Chat Moderators is Burning Your Margin
          </p>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-3 bg-slate-900/80 p-5 text-sm font-bold text-slate-300 border-b border-white/10">
            <div>Comparison Metrics</div>
            <div className="text-rose-400">Human Moderator Staff</div>
            <div className="text-indigo-400 font-extrabold">BECHO AI Closer 🔥</div>
          </div>

          <div className="divide-y divide-white/5 text-sm">
            <div className="grid grid-cols-3 p-5 items-center">
              <div className="font-semibold text-slate-300">Monthly Operating Cost</div>
              <div className="text-slate-400">$250 – $500 / month per shift</div>
              <div className="text-emerald-400 font-bold">$19 – $49 / month flat</div>
            </div>

            <div className="grid grid-cols-3 p-5 items-center">
              <div className="font-semibold text-slate-300">Working Hours</div>
              <div className="text-slate-400">8 hours/day (Misses 2 AM buyers)</div>
              <div className="text-emerald-400 font-bold">24 / 7 / 365 uninterrupted</div>
            </div>

            <div className="grid grid-cols-3 p-5 items-center">
              <div className="font-semibold text-slate-300">Average Response Time</div>
              <div className="text-slate-400">10 – 45 minutes</div>
              <div className="text-emerald-400 font-bold">&lt; 2.5 seconds</div>
            </div>

            <div className="grid grid-cols-3 p-5 items-center">
              <div className="font-semibold text-slate-300">Simultaneous Chats</div>
              <div className="text-slate-400">Max 3–4 chats before delays</div>
              <div className="text-emerald-400 font-bold">1,000+ chats at the same time</div>
            </div>

            <div className="grid grid-cols-3 p-5 items-center">
              <div className="font-semibold text-slate-300">Closing Instinct</div>
              <div className="text-slate-400">Often just answers &quot;Price is 1200&quot;</div>
              <div className="text-emerald-400 font-bold">
                SPIN selling, scarcity prompts, address capture
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 mb-3">
            Predictable Plans
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white">
            Priced to Pay for Itself in Your First 3 Orders
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Starter Plan */}
          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Starter
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">$19</div>
              <div className="text-xs text-slate-400 mb-6">per month / billed monthly</div>
              <p className="text-sm text-slate-300 mb-6">
                Perfect for solo boutique shops and dropshippers starting out.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Facebook Page connected</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 1,000 buyer chats/mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Catalog up to 50 products</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3.5s Multi-burst debouncer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated COD order collection</span>
                </li>
              </ul>
            </div>
            <Link
              href="/onboarding"
              className="w-full py-3 rounded-xl glass hover:bg-slate-800 text-center text-sm font-bold text-white transition block"
            >
              Get Started
            </Link>
          </div>

          {/* Growth Plan (Best Seller) */}
          <div className="relative glass p-8 rounded-3xl border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 flex flex-col justify-between bg-gradient-to-b from-indigo-950/40 to-slate-900/60">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-[11px] font-extrabold tracking-widest uppercase text-white shadow-md">
              Most Popular 🔥
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-2">
                Growth Plan
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">$49</div>
              <div className="text-xs text-slate-400 mb-6">per month / billed monthly</div>
              <p className="text-sm text-slate-300 mb-6">
                For busy social pages that receive dozens of inquiries daily.
              </p>
              <ul className="space-y-3 text-sm text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>2 Facebook Pages connected</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Up to 6,000 buyer chats/mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span><strong>Unlimited</strong> Product Catalog</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span><strong>Multimodal Photo Visual RAG</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Voice Note audio understanding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>1-Click Live Human Takeover Inbox</span>
                </li>
              </ul>
            </div>
            <Link
              href="/onboarding"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-center text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition block"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Scale / Agency */}
          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Scale & Agency
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">$149</div>
              <div className="text-xs text-slate-400 mb-6">per month / billed monthly</div>
              <p className="text-sm text-slate-300 mb-6">
                For e-commerce agencies and high-volume multi-brand retailers.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 8 Facebook Pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>30,000 buyer chats/mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Webhook endpoints</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom CRM / Courier sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Account Manager</span>
                </li>
              </ul>
            </div>
            <Link
              href="/onboarding"
              className="w-full py-3 rounded-xl glass hover:bg-slate-800 text-center text-sm font-bold text-white transition block"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 BECHO (বেচো) by Nanolez Tech. Autonomous Conversational Commerce.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/privacy" className="hover:text-slate-300 transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-300 transition">
            Terms of Service
          </Link>
          <Link href="/data-deletion" className="hover:text-slate-300 transition">
            Data Deletion
          </Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition">
            Merchant Portal
          </Link>
          <Link href="/onboarding" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
            Connect Page
          </Link>
        </div>
      </footer>
    </div>
  );
}
