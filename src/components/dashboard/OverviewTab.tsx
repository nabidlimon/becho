"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Zap,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Sliders,
  Sparkles,
} from "lucide-react";
import { FacebookPage, Order, Conversation } from "@/lib/db/types";

interface OverviewTabProps {
  activePage: FacebookPage | undefined;
  orders: Order[];
  conversations: Conversation[];
  setActiveTab: (tab: "overview" | "inbox" | "orders" | "catalog" | "settings") => void;
  onOpenAddProduct: () => void;
  onSelectConversation: (conv: Conversation) => void;
}

export function OverviewTab({
  activePage,
  orders,
  conversations,
  setActiveTab,
  onOpenAddProduct,
  onSelectConversation,
}: OverviewTabProps) {
  // Aggregate real numbers
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const confirmedOrders = orders.filter((o) => o.status === "confirmed" || o.status === "shipped" || o.status === "delivered");
  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Top Banner / Store Status Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Facebook Messenger Automation Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activePage?.pageName || "My Facebook Shop"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
              Becho is autonomously qualifying buyer inquiries, handling photo searches, and closing Cash on Delivery (COD) orders 24/7 in fluent Banglish &amp; English.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className="px-4 py-2.5 rounded-xl glass hover:bg-slate-800 text-slate-200 font-bold text-xs border border-white/10 transition flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Tune Sales Persona</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition">
          <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Total GMV Closed
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              100% COD
            </span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            ৳ {totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Generated inside Facebook Messenger</div>
        </div>

        {/* Metric 2 */}
        <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-pink-500/30 transition">
          <div className="flex items-center justify-between text-pink-400 text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" /> Confirmed Orders
            </span>
            <span className="text-[10px] bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full font-bold">
              {pendingOrders.length} pending
            </span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {confirmedOrders.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Ready for courier dispatch</div>
        </div>

        {/* Metric 3 */}
        <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-yellow-500/30 transition">
          <div className="flex items-center justify-between text-yellow-400 text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Response Speed
            </span>
            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
              Autonomous
            </span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">&lt; 2.1s</div>
          <div className="text-xs text-slate-400 mt-1">Zero missed late-night buyers</div>
        </div>

        {/* Metric 4 */}
        <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Conversion Lift
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              AI Sales
            </span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">+ 34%</div>
          <div className="text-xs text-slate-400 mt-1">Vs human moderator delays</div>
        </div>
      </div>

      {/* Two Column Grid: Recent In-Chat Activity & Quick COD Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent In-Chat Feed */}
        <div className="glass rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Recent Messenger Inquiries</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Live buyer interactions handled by AI</p>
            </div>
            <button
              onClick={() => setActiveTab("inbox")}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No conversations yet. Send a test message to your connected page!
              </div>
            ) : (
              conversations.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectConversation(c);
                    setActiveTab("inbox");
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {c.customerName ? c.customerName[0].toUpperCase() : "C"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2 truncate">
                        <span>{c.customerName}</span>
                        {c.isAiActive ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                            AI Active
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                            Human Takeover
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {c.lastMessagePreview || "Chat initiated..."}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent COD Orders Closed */}
        <div className="glass rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Recent Cash on Delivery Orders</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Captured directly inside chat</p>
            </div>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              <span>Manage CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No orders captured yet. Test the COD closing flow in the simulator!
              </div>
            ) : (
              orders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  onClick={() => setActiveTab("orders")}
                  className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-emerald-500/30 transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{o.orderNumber}</span>
                      <span
                        className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                          o.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {o.shippingName} • {o.items?.[0]?.title || "E-Commerce Item"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-emerald-400">৳ {o.totalAmount}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">COD</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
