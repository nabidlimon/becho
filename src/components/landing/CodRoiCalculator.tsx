"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, DollarSign, Clock, Users, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export function CodRoiCalculator() {
  const [dailyMessages, setDailyMessages] = useState<number>(60);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(2200);

  // Conversion math for social commerce in South Asia:
  // - Delayed responses (>15 min) lose approx 35% of high-intent buyers (especially 11 PM - 3 AM).
  // - Becho instant replies (<2.1s) recover ~70% of those lost leads.
  const monthlyInquiries = dailyMessages * 30;
  const standardConversionRate = 0.12; // 12% standard baseline
  const lostLeadsDueToDelay = Math.round(monthlyInquiries * 0.32);
  const recoveredOrdersMonthly = Math.round(lostLeadsDueToDelay * 0.22);
  const recoveredRevenueMonthly = recoveredOrdersMonthly * avgOrderValue;
  const staffSalarySavedMonthly = dailyMessages > 80 ? 35000 : 20000;
  const netMonthlyBenefit = recoveredRevenueMonthly + staffSalarySavedMonthly;

  return (
    <section id="roi-calculator" className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Interactive Economic Model</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Calculate Your Lost Midnight Revenue
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          When buyers ask for prices at 1:30 AM and you reply at 10 AM, they have already bought from your competitor. See how much Becho recovers for you.
        </p>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Controls Column */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Daily Messenger Inquiries
              </label>
              <span className="text-base font-extrabold text-indigo-400 font-mono">
                {dailyMessages} inquiries / day
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={300}
              step={5}
              value={dailyMessages}
              onChange={(e) => setDailyMessages(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>15 (Solo Boutique)</span>
              <span>150 (Busy Store)</span>
              <span>300+ (High Volume)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Average Product Price (BDT)
              </label>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                ৳ {avgOrderValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={800}
              max={6000}
              step={100}
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>৳ 800</span>
              <span>৳ 3,000</span>
              <span>৳ 6,000</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Assumes 32% of inquiries arrive outside office hours (nights/weekends).</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sub-2.1s instant replies recover over 22% of those drop-offs.</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl space-y-6">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-indigo-300">
              Recovered COD Revenue
            </div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight mt-1">
              + ৳ {recoveredRevenueMonthly.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              From ~{recoveredOrdersMonthly} extra orders closed monthly
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Night Moderator Staff Saved:</span>
              <span className="text-white font-bold font-mono">+ ৳ {staffSalarySavedMonthly.toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Monthly Economic Uplift:</span>
              <span className="text-emerald-400 font-extrabold font-mono text-sm">
                ৳ {netMonthlyBenefit.toLocaleString()} / mo
              </span>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm text-center shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 block"
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>Connect Page &amp; Capture These Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
