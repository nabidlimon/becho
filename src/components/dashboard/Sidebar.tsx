"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  MessageSquare,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Bot,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { FacebookPage } from "@/lib/db/types";

interface SidebarProps {
  activeTab: "overview" | "inbox" | "orders" | "catalog" | "settings";
  setActiveTab: (tab: "overview" | "inbox" | "orders" | "catalog" | "settings") => void;
  pages: FacebookPage[];
  selectedPageId: string;
  setSelectedPageId: (pageId: string) => void;
  currentUser: { id: string; name: string; email: string; avatarUrl?: string } | null;
  onLogout: () => void;
  unreadCount?: number;
  pendingOrdersCount?: number;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  pages,
  selectedPageId,
  setSelectedPageId,
  currentUser,
  onLogout,
  unreadCount = 0,
  pendingOrdersCount = 0,
}: SidebarProps) {
  const activePage = pages.find((p) => p.pageId === selectedPageId) || pages[0];

  const navItems = [
    {
      id: "overview" as const,
      label: "Overview",
      icon: TrendingUp,
      badge: null,
    },
    {
      id: "inbox" as const,
      label: "Live Messenger Inbox",
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: "bg-indigo-500",
    },
    {
      id: "orders" as const,
      label: "COD Orders CRM",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
      badgeColor: "bg-pink-500",
    },
    {
      id: "catalog" as const,
      label: "Product Catalog",
      icon: Package,
      badge: null,
    },
    {
      id: "settings" as const,
      label: "Bot Persona & Settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0a0f1d]/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 backdrop-blur-xl">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
                <span>BECHO</span>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                  AI
                </span>
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Sales Closer
              </div>
            </div>
          </Link>

          <Link
            href="/onboarding"
            title="Connect New Facebook Page"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Layers className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Store Switcher */}
        <div className="p-4 border-b border-slate-800/60">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
            Active Connected Store
          </label>
          {pages.length > 0 ? (
            <div className="relative">
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full appearance-none bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-white pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer transition"
              >
                {pages.map((p) => (
                  <option key={p.pageId} value={p.pageId}>
                    {p.pageName} ({p.pageId.slice(-4)})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No Facebook page linked</div>
          )}

          {/* 24/7 AI Beacon Status */}
          <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                AI Closer 24/7 Active
              </span>
            </div>
            <Sparkles className="w-3 h-3 text-emerald-400" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full text-white font-extrabold ${
                      item.badgeColor || "bg-indigo-500"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Session & Logout Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : "M"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {currentUser?.name || "Store Merchant"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser?.email || "merchant@becho.ai"}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log out of Becho"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
