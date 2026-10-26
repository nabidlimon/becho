"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ShoppingBag,
  Package,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Bot,
  Send,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { FacebookPage, Product, Order, Conversation } from "@/lib/db/types";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "inbox" | "orders" | "catalog" | "settings">("overview");
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pagesRes, prodRes, ordRes, chatRes] = await Promise.all([
        fetch("/api/pages").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/chat").then((r) => r.json()),
      ]);

      setPages(pagesRes.pages || []);
      setProducts(prodRes.products || []);
      setOrders(ordRes.orders || []);
      setConversations(chatRes.conversations || []);
      if (chatRes.conversations?.length > 0) {
        setSelectedConv(chatRes.conversations[0]);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activePage = pages[0];

  // Toggle Human Takeover / AI Active
  const handleToggleAi = async (conv: Conversation) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: conv.pageId,
          psid: conv.psid,
          action: "toggle_ai",
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = conversations.map((c) =>
          c.id === conv.id ? { ...c, isAiActive: data.isAiActive } : c
        );
        setConversations(updated);
        if (selectedConv?.id === conv.id) {
          setSelectedConv({ ...selectedConv, isAiActive: data.isAiActive });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Human Sends Reply via Dashboard
  const handleSendHumanReply = async () => {
    if (!selectedConv || !replyText.trim()) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedConv.pageId,
          psid: selectedConv.psid,
          action: "send_message",
          messageText: replyText,
        }),
      });
      const data = await res.json();
      if (data.conversation) {
        setSelectedConv(data.conversation);
        setConversations(
          conversations.map((c) => (c.id === data.conversation.id ? data.conversation : c))
        );
        setReplyText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map((o) => (o.id === orderId ? data.order : o)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalGMV = orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.totalAmount : 0), 0);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row" suppressHydrationWarning>
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0f1d] border-b md:border-b-0 md:border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-600/30">
              B
            </div>
            <div>
              <div className="font-extrabold text-lg text-white">BECHO</div>
              <div className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">
                Merchant Portal
              </div>
            </div>
          </Link>

          {/* Connected Page Status Card */}
          {activePage && (
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 flex items-center gap-3">
              <img
                src={activePage.pageAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                alt={activePage.pageName}
                className="w-10 h-10 rounded-xl object-cover shrink-0"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {activePage.pageName}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Active 24/7</span>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Overview & Sales", icon: TrendingUp },
              { id: "inbox", label: "Live Inbox & Takeover", icon: MessageSquare, badge: conversations.length },
              { id: "orders", label: "Closed Orders", icon: Package, badge: orders.length },
              { id: "catalog", label: "Product Catalog", icon: ShoppingBag, badge: products.length },
              { id: "settings", label: "Webhook & Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
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

        {/* Bottom Fast Links */}
        <div className="pt-6 border-t border-slate-800/80">
          <Link
            href="/onboarding"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-run Onboarding</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* TAB 1: Overview & Analytics */}
        {activeTab === "overview" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Merchant Dashboard Overview</h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time performance metrics closed autonomously by Becho AI.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-indigo-400 font-semibold mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> GMV Closed by AI
                </div>
                <div className="text-3xl font-extrabold text-white">
                  ৳ {totalGMV.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">100% Cash on Delivery</div>
              </div>

              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Confirmed Orders
                </div>
                <div className="text-3xl font-extrabold text-white">{orders.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">Directly in Messenger</div>
              </div>

              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-pink-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Avg Response Speed
                </div>
                <div className="text-3xl font-extrabold text-white">1.8s</div>
                <div className="text-[11px] text-slate-400 mt-1">Sliding-window debounced</div>
              </div>

              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-yellow-400 font-semibold mb-1 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Active Catalog Items
                </div>
                <div className="text-3xl font-extrabold text-white">{products.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">Indexed for Visual RAG</div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="glass p-6 rounded-3xl border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-white">Latest Confirmed Orders</h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">
                          #{o.orderNumber}
                        </span>
                        <span className="text-xs font-bold text-white">{o.shippingName}</span>
                        <span className="text-[11px] text-slate-400">({o.shippingPhone})</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {o.items[0]?.title} • Delivery to: {o.shippingAddress}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-emerald-400">
                          ৳ {o.totalAmount}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          {o.paymentMethod}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Live Inbox & Human Takeover */}
        {activeTab === "inbox" && (
          <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col md:flex-row glass rounded-3xl border border-white/10 overflow-hidden animate-slide-up">
            {/* Conversations List */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0a0f1d] overflow-y-auto">
              <div className="p-4 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Facebook Inquiries</span>
                <span className="text-indigo-400 font-mono">{conversations.length}</span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {conversations.map((c) => {
                  const isSelected = selectedConv?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConv(c)}
                      className={`p-4 cursor-pointer transition ${
                        isSelected ? "bg-indigo-600/15 border-l-4 border-indigo-500" : "hover:bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white truncate">
                          {c.customerName}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                            c.isAiActive
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {c.isAiActive ? "AI Closer" : "Human"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {c.lastMessagePreview}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Thread & Takeover Controls */}
            {selectedConv ? (
              <div className="flex-1 flex flex-col bg-[#070b14]">
                {/* Header with Human Takeover Button */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                      {selectedConv.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{selectedConv.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          PSID: {selectedConv.psid}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Status:{" "}
                        <strong className={selectedConv.isAiActive ? "text-indigo-400" : "text-amber-400"}>
                          {selectedConv.isAiActive ? "AI Handling Chat 🤖" : "Human Agent Takeover Active 👤"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Toggle Button */}
                  <button
                    onClick={() => handleToggleAi(selectedConv)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedConv.isAiActive
                        ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                    }`}
                  >
                    {selectedConv.isAiActive ? (
                      <>
                        <User className="w-3.5 h-3.5" />
                        <span>Take Over (Pause AI)</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5" />
                        <span>Resume AI Bot 🤖</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                  {selectedConv.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.senderType === "customer" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          m.senderType === "customer"
                            ? "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
                            : m.senderType === "human"
                            ? "bg-amber-600 text-white rounded-br-none"
                            : "bg-indigo-600 text-white rounded-br-none"
                        }`}
                      >
                        <div className="text-[9px] opacity-75 mb-1 font-bold">
                          {m.senderType === "customer"
                            ? selectedConv.customerName
                            : m.senderType === "human"
                            ? "Human Store Moderator 👤"
                            : "Becho AI Closer 🤖"}
                        </div>
                        {m.mediaUrl && (
                          <img
                            src={m.mediaUrl}
                            alt="Media"
                            className="w-48 h-32 rounded-xl object-cover mb-2 border border-white/10"
                          />
                        )}
                        <div className="whitespace-pre-line">{m.content}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Human Reply Input */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type human reply to send directly to customer's Messenger..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendHumanReply()}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendHumanReply}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Select a conversation to inspect thread.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Closed Orders */}
        {activeTab === "orders" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Closed Orders Management</h1>
              <p className="text-xs text-slate-400 mt-1">
                Cash on Delivery (COD) orders collected directly by the AI in chat.
              </p>
            </div>

            <div className="glass rounded-3xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Shipping Address</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-mono font-bold text-indigo-400">
                          #{o.orderNumber}
                        </td>
                        <td className="p-4 font-bold text-white">{o.shippingName}</td>
                        <td className="p-4 font-mono text-slate-300">{o.shippingPhone}</td>
                        <td className="p-4 max-w-xs text-slate-400 truncate">
                          {o.shippingAddress}
                        </td>
                        <td className="p-4 text-slate-300">
                          {o.items.map((i) => `${i.title} (${i.quantity})`).join(", ")}
                        </td>
                        <td className="p-4 font-extrabold text-emerald-400">
                          ৳ {o.totalAmount}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              o.status === "confirmed"
                                ? "bg-indigo-500/20 text-indigo-300"
                                : o.status === "shipped"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(o.id, e.target.value as any)
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped 🚚</option>
                            <option value="delivered">Delivered ✅</option>
                            <option value="cancelled">Cancelled ❌</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Product Catalog */}
        {activeTab === "catalog" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Product Catalog</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Active products recognized by the AI for semantic search & photo matching.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="glass rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between"
                >
                  <img
                    src={p.images[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop"}
                    alt={p.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                        {p.category}
                      </div>
                      <h4 className="font-bold text-sm text-white mb-2">{p.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-base font-extrabold text-emerald-400">
                          ৳ {p.discountPrice || p.price}
                        </div>
                        {p.discountPrice && (
                          <div className="text-[10px] text-slate-500 line-through">
                            ৳ {p.price}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300">
                        In Stock: {p.stockQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Webhook & Settings */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Meta Webhook Configuration</h1>
              <p className="text-xs text-slate-400 mt-1">
                Copy these parameters into your Meta Developer App to route incoming Messenger chats.
              </p>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Callback URL (Paste into Meta Webhooks)
                </label>
                <input
                  type="text"
                  readOnly
                  value="https://your-domain.vercel.app/api/webhooks/meta"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-indigo-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Verify Token
                </label>
                <input
                  type="text"
                  readOnly
                  value="becho_secure_verify_token_2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Required Webhook Subscription Fields
                </label>
                <div className="flex flex-wrap gap-2">
                  {["messages", "messaging_postbacks", "message_reads", "message_deliveries"].map((field) => (
                    <span
                      key={field}
                      className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
