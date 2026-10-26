import Link from "next/link";
import { Shield, Lock, FileText, ArrowLeft, Mail, MapPin, Building, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — BECHO (বেচো) by Nanolez Tech",
  description: "Official Privacy Policy for BECHO AI Social Sales & Support Platform.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 26, 2026";

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 selection:bg-indigo-500 selection:text-white">
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/30">
              B
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              BECHO <span className="text-xs text-indigo-400 font-normal">বেচো</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/data-deletion" className="text-indigo-400 hover:text-indigo-300 transition">
              Data Deletion
            </Link>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Page Title */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Shield className="w-3.5 h-3.5 text-pink-400" />
            <span>Meta Platform Compliant Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">
            Last Updated: <strong className="text-slate-300">{lastUpdated}</strong> • Effective for BECHO &amp; Nanolez Tech Services
          </p>
        </div>

        {/* Quick Summary Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-500/20 shadow-xl mb-12">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-emerald-400" />
            Our Privacy Commitment in Plain English
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            BECHO (<strong>&ldquo;we&rdquo;</strong>, <strong>&ldquo;our&rdquo;</strong>, or <strong>&ldquo;us&rdquo;</strong>), operated by <strong>Nanolez Tech</strong>, provides an autonomous AI conversational sales closer for Facebook Pages. We process customer messages solely to answer product questions and book Cash on Delivery (COD) orders on behalf of connected merchants. <strong>We never sell, rent, or monetize your personal data.</strong>
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">1</span>
              Who We Are &amp; Scope of this Policy
            </h2>
            <p className="mb-3">
              This Privacy Policy applies to the BECHO software platform, applications, and web services available at:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300 mb-4">
              <li><code className="text-indigo-300 bg-slate-800/80 px-2 py-0.5 rounded">https://mbot.nanolez.tech</code></li>
              <li><code className="text-indigo-300 bg-slate-800/80 px-2 py-0.5 rounded">https://mbot24.vercel.app</code></li>
            </ul>
            <p>
              It explains how Nanolez Tech collects, uses, and safeguards information when merchants connect their Facebook Pages and when social buyers interact with those connected pages via Meta Messenger.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">2</span>
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <h3 className="font-semibold text-white mb-1">A. Facebook Page Merchant Information</h3>
                <p className="text-xs text-slate-400 mb-2">
                  When a merchant authorizes BECHO via the Meta OAuth Dialog:
                </p>
                <ul className="list-disc pl-5 text-xs space-y-1 text-slate-300">
                  <li>Facebook User ID and Admin Name</li>
                  <li>Page ID, Page Name, and Category</li>
                  <li>Page Access Token (stored with AES-256 encryption)</li>
                  <li>Store configurations: currency, delivery fees, and product catalog metadata</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <h3 className="font-semibold text-white mb-1">B. End-Buyer / Customer Data via Messenger</h3>
                <p className="text-xs text-slate-400 mb-2">
                  When an end-user sends a message to an authorized Facebook Page:
                </p>
                <ul className="list-disc pl-5 text-xs space-y-1 text-slate-300">
                  <li><strong>Page-Scoped ID (PSID):</strong> A unique, pseudonymous identifier assigned by Meta.</li>
                  <li><strong>Message Content:</strong> Text questions, product photo attachments, or audio clips.</li>
                  <li><strong>Order Booking Details:</strong> Name, phone number, and delivery address voluntarily provided by the buyer to confirm a Cash on Delivery (COD) parcel delivery.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">3</span>
              How We Use Collected Information
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant AI Order Assistance:</strong> Automatically parsing incoming questions, inventory stock checks, and photo matches using AI vision.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Order Fulfillment:</strong> Recording confirmed Cash on Delivery orders into the merchant&apos;s private dashboard for courier dispatch.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Human Escalation:</strong> Pausing AI automation and alerting human store managers when a buyer requests personal support.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Service Reliability:</strong> Maintaining uptime, preventing abuse, and verifying webhook integrity.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">4</span>
              Meta Permissions &amp; Data Security
            </h2>
            <p className="mb-3">
              BECHO requests only permissions essential to its core conversational commerce function:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300 mb-4 text-xs">
              <li><code className="text-indigo-300">pages_messaging</code>: To receive incoming buyer queries and dispatch AI responses.</li>
              <li><code className="text-indigo-300">pages_manage_metadata</code>: To subscribe to webhooks and verify page status.</li>
              <li><code className="text-indigo-300">pages_read_engagement</code>: To read basic engagement metrics needed to provide context.</li>
            </ul>
            <p>
              All Page Access Tokens are protected using industry-standard <strong>AES-256 encryption</strong>. Data in transit is secured with TLS 1.3 encryption.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">5</span>
              Third-Party Processors &amp; AI Processing
            </h2>
            <p className="mb-2">
              We work with trusted infrastructure providers that adhere to rigorous data privacy standards:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300 mb-4 text-xs">
              <li><strong>Meta Platforms, Inc.:</strong> For Graph API and Messenger Platform webhook services.</li>
              <li><strong>Google Cloud (Gemini API):</strong> For conversational language understanding and multimodal photo matching. Data sent to Gemini is processed ephemerally and is <strong>NOT</strong> used to train Google&apos;s public models.</li>
              <li><strong>Hosting &amp; Cloud Databases:</strong> Secured cloud infrastructure adhering to SOC 2 Type II compliance.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">6</span>
              Data Retention &amp; User Data Deletion Rights
            </h2>
            <p className="mb-3">
              We retain merchant settings and conversation records only for as long as necessary to provide the service or until deletion is requested.
            </p>
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
              <p className="font-semibold text-white mb-1">How to Request Immediate Data Deletion:</p>
              <p className="text-xs text-slate-300 mb-3">
                In compliance with Meta Platform Policies, GDPR, and CCPA, any user or merchant can request permanent deletion of their data at any time.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/data-deletion"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                >
                  View Data Deletion Instructions →
                </Link>
                <a
                  href="mailto:support@nanolez.tech?subject=Data%20Deletion%20Request"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                >
                  Email support@nanolez.tech
                </a>
              </div>
            </div>
          </section>

          {/* Section 7: Contact / DPO */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" />
              Contact Information &amp; Data Protection Officer (DPO)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              For any privacy inquiries, data subject access requests (DSAR), or GDPR compliance questions:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-400 mb-1">Company / Developer:</div>
                <div className="font-semibold text-white">Nanolez Tech (BECHO Platform)</div>
                <div className="text-slate-400 mt-2">Designated DPO:</div>
                <div className="font-semibold text-white">Data Protection Officer, Nanolez Tech</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> Official Email:
                </div>
                <a href="mailto:support@nanolez.tech" className="text-indigo-400 hover:underline font-medium">
                  support@nanolez.tech
                </a>
                <div className="text-slate-400 mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Headquarters:
                </div>
                <div className="text-slate-300">Dhaka, Bangladesh</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© 2026 Nanolez Tech • BECHO (বেচো) Platform</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-indigo-400 font-semibold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/data-deletion" className="hover:text-slate-300">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
