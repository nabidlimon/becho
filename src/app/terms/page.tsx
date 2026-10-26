import Link from "next/link";
import { FileText, CheckCircle2, ArrowLeft, Shield, AlertTriangle, Scale, Mail } from "lucide-react";

export const metadata = {
  title: "Terms of Service — BECHO (বেচো) by Nanolez Tech",
  description: "Terms and conditions of service for the BECHO platform.",
};

export default function TermsOfServicePage() {
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
            <Link href="/privacy" className="text-slate-400 hover:text-white transition">
              Privacy Policy
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
            <Scale className="w-3.5 h-3.5 text-pink-400" />
            <span>Commercial Terms &amp; Conditions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400">
            Last Updated: <strong className="text-slate-300">{lastUpdated}</strong> • Governs all use of BECHO software &amp; APIs
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">1</span>
              Agreement to Terms
            </h2>
            <p>
              By accessing, connecting, or using BECHO (available at <code className="text-indigo-300 bg-slate-800/80 px-2 py-0.5 rounded">https://mbot.nanolez.tech</code> and <code className="text-indigo-300 bg-slate-800/80 px-2 py-0.5 rounded">https://mbot24.vercel.app</code>), you agree to be bound by these Terms of Service provided by <strong>Nanolez Tech</strong>. If you do not agree, do not authorize or use the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">2</span>
              Description of the Service
            </h2>
            <p className="mb-3">
              BECHO is an autonomous conversational social commerce tool designed for social media merchants. Key features include:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300 text-xs">
              <li>Instant 24/7 automated replies to customer inquiries on connected Facebook Pages via Meta Messenger API.</li>
              <li>Multimodal vision analysis to identify product photos sent by prospective buyers.</li>
              <li>Automated collection of delivery details (Name, Phone, Address) for Cash on Delivery (COD) order confirmation.</li>
              <li>Seamless human handover escalation when customers request personal assistance.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">3</span>
              Merchant Responsibilities &amp; Acceptable Use
            </h2>
            <p className="mb-3">
              As a merchant utilizing BECHO, you represent, warrant, and agree that:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You own or have full legal authority to grant permissions for the connected Facebook Page.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You will not promote, sell, or advertise illegal, counterfeit, restricted, or hazardous products.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You will not use automated messaging to harass, spam, or transmit deceptive deceptive content in violation of Meta&apos;s Commercial Terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You maintain sole responsibility for the actual fulfillment, shipping, warranty, and quality of goods sold to your buyers.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">4</span>
              Meta Platform Policy Compliance
            </h2>
            <p>
              BECHO operates strictly in compliance with Meta&apos;s Developer Platform Policies, Meta Commercial Terms, and Page Messaging Policies. We strictly enforce human takeover capabilities whenever requested by end users to maintain healthy, compliant customer communication.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">5</span>
              AI Disclaimer &amp; Service Availability
            </h2>
            <p className="mb-2">
              BECHO employs advanced AI language models (Google Gemini API). While the AI is trained with guardrails and merchant-specific product rules:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300 text-xs mb-3">
              <li>Merchants are advised to audit their product descriptions, stock quantities, and discount permissions periodically.</li>
              <li>BECHO does not process financial transactions directly (payments are collected via offline Cash on Delivery or third-party gateways).</li>
              <li>Services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of uninterrupted uptime.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">6</span>
              Limitation of Liability
            </h2>
            <p>
              In no event shall Nanolez Tech, its directors, or affiliates be liable for any indirect, incidental, punitive, or consequential damages resulting from lost sales, delivery failures by third-party couriers, or temporary Facebook API outages.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs">7</span>
              Termination &amp; Disconnection
            </h2>
            <p>
              You may terminate your use of BECHO at any time by disconnecting your page in the Merchant Portal or removing BECHO from your Facebook Business Integrations settings. Upon disconnection, stored page access tokens are immediately revoked.
            </p>
          </section>

          {/* Contact */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              Contact &amp; Legal Inquiries
            </h2>
            <p className="text-xs text-slate-400">
              For questions regarding these Terms, contact Nanolez Tech at:{" "}
              <a href="mailto:support@nanolez.tech" className="text-indigo-400 hover:underline font-semibold">
                support@nanolez.tech
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© 2026 Nanolez Tech • BECHO (বেচো) Platform</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="text-indigo-400 font-semibold">Terms of Service</Link>
            <Link href="/data-deletion" className="hover:text-slate-300">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
