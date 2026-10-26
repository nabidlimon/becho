"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Bot,
  User,
  Send,
  Power,
  ShieldCheck,
  MapPin,
  Phone,
  ShoppingBag,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Conversation, Order } from "@/lib/db/types";

interface InboxTabProps {
  conversations: Conversation[];
  selectedConv: Conversation | null;
  setSelectedConv: (conv: Conversation) => void;
  onToggleAi: (conv: Conversation) => void;
  onSendReply: (replyText: string) => void;
  orders: Order[];
}

export function InboxTab({
  conversations,
  selectedConv,
  setSelectedConv,
  onToggleAi,
  onSendReply,
  orders,
}: InboxTabProps) {
  const [replyInput, setReplyInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (c) =>
      c.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessagePreview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    onSendReply(replyInput.trim());
    setReplyInput("");
  };

  // Find related order for this conversation if available
  const relatedOrder = selectedConv
    ? orders.find(
        (o) =>
          o.shippingName?.toLowerCase() === selectedConv.customerName?.toLowerCase() ||
          o.customerId === selectedConv.customerId
      )
    : null;

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col md:flex-row glass rounded-3xl overflow-hidden border border-white/10 animate-slide-up">
      {/* Left Column: Conversation Directory */}
      <div className="w-full md:w-80 border-r border-slate-800/80 bg-[#080d19]/80 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Messenger Chats</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {conversations.length} Active
            </span>
          </div>
          <input
            type="text"
            placeholder="Search buyers or messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching chats found.
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = selectedConv?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  className={`p-4 transition cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "bg-indigo-950/40 border-l-4 border-indigo-500"
                      : "hover:bg-slate-900/60"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
                    {c.customerName ? c.customerName[0].toUpperCase() : "C"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white truncate">
                        {c.customerName || "Facebook Buyer"}
                      </span>
                      {c.isAiActive ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          AI
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          Human
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {c.lastMessagePreview || "No preview"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Middle Column: Chat Window & Messenger Interaction */}
      <div className="flex-1 flex flex-col bg-[#070b14]/70 min-w-0">
        {selectedConv ? (
          <>
            {/* Chat Top Header */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-sm text-white shrink-0">
                  {selectedConv.customerName ? selectedConv.customerName[0].toUpperCase() : "C"}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white flex items-center gap-2 truncate">
                    <span>{selectedConv.customerName || "Facebook Buyer"}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      PSID: {selectedConv.psid.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    {selectedConv.isAiActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 font-semibold">
                          Becho AI Closer Active (Auto-Replying in &lt;2s)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-amber-400 font-semibold">
                          Human Staff Takeover Active (AI Paused)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Takeover / Handover Button */}
              <button
                onClick={() => onToggleAi(selectedConv)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md ${
                  selectedConv.isAiActive
                    ? "bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{selectedConv.isAiActive ? "Takeover Chat (Pause AI)" : "Handover to AI Closer"}</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {selectedConv.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.senderType === "customer" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.senderType === "customer"
                        ? "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
                        : m.senderType === "ai"
                        ? "bg-gradient-to-tr from-indigo-700 to-indigo-600 text-white rounded-br-none shadow-md"
                        : "bg-pink-700 text-white rounded-br-none shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] opacity-75 mb-1 font-semibold">
                      {m.senderType === "customer" ? (
                        <>
                          <User className="w-3 h-3" />
                          <span>Customer</span>
                        </>
                      ) : m.senderType === "ai" ? (
                        <>
                          <Bot className="w-3 h-3 text-yellow-300" />
                          <span>Becho AI Sales Closer</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" />
                          <span>Human Staff</span>
                        </>
                      )}
                    </div>

                    {m.mediaUrl && (
                      <img
                        src={m.mediaUrl}
                        alt="Customer photo attachment"
                        className="w-56 h-36 rounded-xl object-cover mb-2 border border-white/10"
                      />
                    )}

                    <div className="whitespace-pre-line">{m.content}</div>

                    <div className="text-[9px] opacity-60 text-right mt-1.5">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Human Reply Box */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900/80 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={
                  selectedConv.isAiActive
                    ? "Type a manual reply (will automatically pause AI)..."
                    : "Type your reply to customer..."
                }
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
            Select a conversation on the left to view buyer history and CRM profile.
          </div>
        )}
      </div>

      {/* Right Drawer: Live CRM Profile & Order Extraction */}
      {selectedConv && (
        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-800/80 bg-[#080d19]/80 p-5 flex flex-col justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Buyer CRM Intelligence</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase">
                  Buyer Name
                </label>
                <div className="text-xs font-bold text-white mt-0.5">
                  {selectedConv.customerName || "Facebook User"}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <Phone className="w-3 h-3 text-indigo-400" /> Phone Number
                </label>
                <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                  {relatedOrder?.shippingPhone || "Captured during COD close"}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-pink-400" /> Delivery Address
                </label>
                <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {relatedOrder?.shippingAddress || "In-progress in chat"}
                </div>
              </div>

              {relatedOrder && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Closed COD Order</span>
                    <span className="font-mono">{relatedOrder.orderNumber}</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    {relatedOrder.items?.[0]?.title}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-400 mt-1">
                    ৳ {relatedOrder.totalAmount} (Cash on Delivery)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI extracts phone &amp; address automatically</span>
          </div>
        </div>
      )}
    </div>
  );
}
