"use client";

import React from "react";
import {
  Settings,
  Sliders,
  DollarSign,
  ShieldCheck,
  Power,
  Copy,
  Check,
  Bot,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { FacebookPage } from "@/lib/db/types";

interface SettingsTabProps {
  activePage: FacebookPage | undefined;
  botActive: boolean;
  setBotActive: (active: boolean) => void;
  storePersona: string;
  setStorePersona: (persona: string) => void;
  insideFee: number;
  setInsideFee: (fee: number) => void;
  outsideFee: number;
  setOutsideFee: (fee: number) => void;
  allowDiscount: boolean;
  setAllowDiscount: (allow: boolean) => void;
  maxDiscount: number;
  setMaxDiscount: (max: number) => void;
  codEnabled: boolean;
  setCodEnabled: (enabled: boolean) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  onSaveSettings: (e: React.FormEvent) => void;
  isSavingSettings: boolean;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export function SettingsTab({
  activePage,
  botActive,
  setBotActive,
  storePersona,
  setStorePersona,
  insideFee,
  setInsideFee,
  outsideFee,
  setOutsideFee,
  allowDiscount,
  setAllowDiscount,
  maxDiscount,
  setMaxDiscount,
  codEnabled,
  setCodEnabled,
  customPrompt,
  setCustomPrompt,
  onSaveSettings,
  isSavingSettings,
  copiedField,
  onCopy,
}: SettingsTabProps) {
  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/webhooks/meta`
      : "https://mbot.nanolez.tech/api/webhooks/meta";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Store Sales Rules &amp; Bot Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tune the AI sales psychology, delivery matrices, and Cash on Delivery closing parameters for{" "}
          <strong className="text-indigo-300">{activePage?.pageName || "Your Store"}</strong>.
        </p>
      </div>

      <form onSubmit={onSaveSettings} className="space-y-6">
        {/* Card 1: 24/7 AI Autonomous Status */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Power className="w-4 h-4 text-emerald-400" />
                <span>Autonomous 24/7 Background Closer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                When active, Becho answers buyers instantly even when your browser is closed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBotActive(!botActive)}
              className={`w-14 h-7 rounded-full transition-colors relative shadow-inner ${
                botActive ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform shadow ${
                  botActive ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Card 2: Sales Persona Preset */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Sales Psychology Persona</span>
          </h3>
          <p className="text-xs text-slate-400">
            Select the voice tone and conversation style Becho uses with your Facebook customers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "gadgets",
                label: "Tech & Gadgets Specialist 📱",
                desc: "Spec-focused, fast feature explanations, warranty reassurance, high-energy Banglish.",
              },
              {
                id: "fashion",
                label: "Fashion Stylist & Boutique 👗",
                desc: "Vibrant, polite, size/color recommendations, urgent COD order booking.",
              },
              {
                id: "custom",
                label: "Custom Prompt Persona ⚙️",
                desc: "Follows your exact system instructions and custom tone guidelines below.",
              },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setStorePersona(p.id)}
                className={`p-4 rounded-2xl text-left border transition ${
                  storePersona === p.id
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">{p.label}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Delivery Fee Matrix */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Delivery Fees &amp; Order Rules</span>
          </h3>
          <p className="text-xs text-slate-400">
            Becho calculates shipping fees automatically based on the buyer's delivery district.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Inside City Delivery Fee (BDT)
              </label>
              <input
                type="number"
                value={insideFee}
                onChange={(e) => setInsideFee(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">e.g. Inside Dhaka ৳70</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Outside City Delivery Fee (BDT)
              </label>
              <input
                type="number"
                value={outsideFee}
                onChange={(e) => setOutsideFee(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">e.g. Outside Dhaka ৳130</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="codToggle"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="codToggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                Enforce Cash on Delivery (COD) Order Booking
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="discountToggle"
                checked={allowDiscount}
                onChange={(e) => setAllowDiscount(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="discountToggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                Smart Discount Leeway: Up to {maxDiscount}%
              </label>
            </div>
          </div>
        </div>

        {/* Card 4: Custom Merchant Prompt */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Store-Specific Rules &amp; Custom Instructions</span>
          </h3>
          <p className="text-xs text-slate-400">
            Tell Becho about warranties, return policies, or special campaign discounts.
          </p>
          <textarea
            rows={4}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. All smartwatches have 6 months official warranty. Mention that free replacement is available within 7 days if defective."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed placeholder:text-slate-600"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSavingSettings}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition disabled:opacity-60 flex items-center gap-2"
          >
            {isSavingSettings ? "Saving Settings..." : "Save Store Rules & Persona"}
          </button>
        </div>
      </form>

      {/* Card 5: Meta Webhook Setup & Diagnostic */}
      <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Meta Facebook App Webhook Credentials</span>
        </h3>
        <p className="text-xs text-slate-400">
          Verify that your Facebook App Webhook is configured with these credentials to route messages to Becho.
        </p>

        <div className="space-y-4 pt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Callback URL</label>
              <button
                type="button"
                onClick={() => onCopy(webhookUrl, "Callback URL")}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedField === "Callback URL" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-indigo-300 font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Verify Token</label>
              <button
                type="button"
                onClick={() =>
                  onCopy(activePage?.verifyToken || "becho_secure_verify_token_2026", "Verify Token")
                }
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedField === "Verify Token" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={activePage?.verifyToken || "becho_secure_verify_token_2026"}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
