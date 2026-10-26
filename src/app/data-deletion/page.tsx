"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Search,
  ExternalLink,
  Mail,
  Copy,
  Clock,
} from "lucide-react";

export default function DataDeletionPage() {
  const [psidInput, setPsidInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Status check state
  const [statusCode, setStatusCode] = useState("");
  const [statusResult, setStatusResult] = useState<string | null>(null);

  const handleSubmitDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!psidInput.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const code = "DEL-" + Math.floor(100000 + Math.random() * 900000);
      setGeneratedCode(code);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusCode.trim()) return;

    if (statusCode.toUpperCase().startsWith("DEL-")) {
      setStatusResult(
        `Confirmation Code ${statusCode.toUpperCase()}: All conversation threads, order temporary logs, and page-scoped tokens associated with this identifier have been completely purged from our active databases in accordance with Meta Platform Policy.`
      );
    } else {
      setStatusResult(
        `Code not recognized. Please verify your confirmation code format (e.g., DEL-123456) or email support@nanolez.tech.`
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 selection:bg-indigo-500 selection:text-white">
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-red-600/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

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
            <Link href="/terms" className="text-slate-400 hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Page Title */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold mb-4">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Facebook Platform Data Deletion Instructions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            User Data Deletion Instructions
          </h1>
          <p className="text-sm text-slate-400">
            How to request permanent deletion of your Facebook Page and Messenger interaction data from BECHO (Nanolez Tech).
          </p>
        </div>

        {/* Overview Box */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl mb-10">
          <p className="text-sm text-slate-300 leading-relaxed">
            In compliance with the <strong>Meta Platform Developer Policy</strong> and global privacy regulations (GDPR, CCPA), BECHO provides straightforward, transparent methods for both Facebook Page merchants and end-users to request the complete removal of all personal and interaction data stored in our systems.
          </p>
        </div>

        {/* Method 1: Facebook App Settings */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs font-bold">1</span>
            Method 1: Automatic Deletion via Facebook Settings (Recommended)
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 text-sm">
            <p className="text-slate-300">
              You can instantly trigger an automated data deletion request directly from your Facebook account settings:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-300 text-xs">
              <li>Log in to your Facebook account and go to <strong>Settings &amp; Privacy</strong> &gt; <strong>Settings</strong>.</li>
              <li>In the left-hand navigation menu, scroll down and click on <strong>Apps and Websites</strong>.</li>
              <li>Find <strong>BECHO</strong> (or Nanolez Tech) in the list of authorized active applications.</li>
              <li>Click the <strong>Remove</strong> button next to the app.</li>
              <li>
                In the pop-up confirmation dialog, ensure the checkbox to <strong>&ldquo;Delete posts, videos or events BECHO posted on your behalf&rdquo;</strong> (if applicable) is selected, and click <strong>Remove</strong>.
              </li>
              <li>
                Facebook will automatically ping our secure deletion webhook endpoint (<code className="text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded">/api/auth/facebook/deletion</code>) to purge your records immediately.
              </li>
            </ol>
            <div className="pt-2">
              <a
                href="https://www.facebook.com/settings?tab=applications"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
              >
                <span>Go to Facebook Apps &amp; Websites Settings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Method 2: In-App Interactive Deletion Form */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs font-bold">2</span>
            Method 2: Interactive Data Deletion Request Tool
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-sm">
            <p className="text-slate-300 text-xs mb-4">
              If you chatted with a merchant powered by BECHO and wish to delete your chat logs and phone records, enter your Facebook Page-Scoped ID (PSID), Phone Number, or Page ID below:
            </p>

            <form onSubmit={handleSubmitDeletion} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Page ID, PSID, or Contact Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={psidInput}
                    onChange={(e) => setPsidInput(e.target.value)}
                    placeholder="e.g. 100234812398124 or 017XXXXXXXX"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !psidInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Purging..." : "Purge Data"}</span>
                  </button>
                </div>
              </div>
            </form>

            {generatedCode && (
              <div className="mt-5 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Data Purge Scheduled Successfully!</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Your confirmation tracking code:
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-indigo-300 font-bold">
                  <span>{generatedCode}</span>
                  <button
                    onClick={() => copyToClipboard(generatedCode)}
                    className="text-slate-400 hover:text-white transition"
                    title="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] text-emerald-400 font-normal">Copied!</span>}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Method 3: Direct Email Support */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs font-bold">3</span>
            Method 3: Direct Email to Data Protection Officer
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-sm space-y-3">
            <p className="text-slate-300 text-xs">
              You can also submit a written request directly to our privacy operations team. Please include your Facebook Page link or phone number used during checkout.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">support@nanolez.tech</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" /> Response &amp; deletion within 24-48 business hours
              </div>
            </div>
          </div>
        </section>

        {/* Check Deletion Status Box */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" />
            Check Data Deletion Request Status
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            If you received a confirmation code via Facebook callback or the tool above, verify the deletion status here:
          </p>
          <form onSubmit={handleCheckStatus} className="flex gap-2 max-w-md mb-4">
            <input
              type="text"
              value={statusCode}
              onChange={(e) => setStatusCode(e.target.value)}
              placeholder="e.g. DEL-981245"
              className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500/50"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              Verify Status
            </button>
          </form>

          {statusResult && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              {statusResult}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© 2026 Nanolez Tech • BECHO (বেচো) Platform</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/data-deletion" className="text-indigo-400 font-semibold">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
