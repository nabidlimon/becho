"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  LogOut,
  Copy,
  Check,
  X,
  Sliders,
  Tag,
  DollarSign,
  Power,
  Trash2,
} from "lucide-react";
import { FacebookPage, Product, Order, Conversation } from "@/lib/db/types";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "inbox" | "orders" | "catalog" | "settings">("overview");
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; avatarUrl?: string } | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDiscountPrice, setNewDiscountPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Smart Gadgets");
  const [newStock, setNewStock] = useState("10");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Store Settings & Persona state
  const [botActive, setBotActive] = useState(true);
  const [storePersona, setStorePersona] = useState<string>("gadgets");
  const [insideFee, setInsideFee] = useState(70);
  const [outsideFee, setOutsideFee] = useState(130);
  const [allowDiscount, setAllowDiscount] = useState(true);
  const [maxDiscount, setMaxDiscount] = useState(5);
  const [codEnabled, setCodEnabled] = useState(true);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Fetch all initial data including authenticated user session
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [meRes, pagesRes, prodRes, ordRes, chatRes] = await Promise.all([
        fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ authenticated: false })),
        fetch("/api/pages").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/chat").then((r) => r.json()),
      ]);

      if (meRes.authenticated && meRes.user) {
        setCurrentUser(meRes.user);
      }

      const fetchedPages = (meRes.pages && meRes.pages.length > 0) ? meRes.pages : (pagesRes.pages || []);
      setPages(fetchedPages);
      if (fetchedPages.length > 0 && !selectedPageId) {
        setSelectedPageId(fetchedPages[0].pageId);
      }

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activePage = pages.find((p) => p.pageId === selectedPageId) || pages[0];

  // Sync active page settings into form state
  useEffect(() => {
    if (activePage) {
      setBotActive(activePage.isActive);
      setStorePersona(activePage.personaTemplate || "gadgets");
      setInsideFee(activePage.insideCityDeliveryFee || 70);
      setOutsideFee(activePage.outsideCityDeliveryFee || 130);
      setAllowDiscount(activePage.allowDiscount ?? true);
      setMaxDiscount(activePage.maxDiscountPercent || 5);
      setCodEnabled(activePage.codEnabled ?? true);
      setCustomPrompt(activePage.customSystemPrompt || "");
    }
  }, [activePage?.pageId]);

  // Handle Add Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;
    setIsSavingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: activePage?.pageId || "897658663436930",
          title: newTitle.trim(),
          price: Number(newPrice),
          discountPrice: newDiscountPrice ? Number(newDiscountPrice) : undefined,
          category: newCategory,
          stockQuantity: Number(newStock) || 10,
          images: newImageUrl.trim()
            ? [newImageUrl.trim()]
            : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop"],
          description: newDescription.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts([data.product, ...products]);
        setIsAddProductOpen(false);
        setNewTitle("");
        setNewPrice("");
        setNewDiscountPrice("");
        setNewDescription("");
        setNewImageUrl("");
        showToast("Product added to catalog! AI will pitch and sell it immediately.");
      } else {
        showToast(data.error || "Failed to add product.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Error adding product.", "error");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the catalog?`)) return;
    try {
      const res = await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== productId));
        showToast("Product removed from catalog.");
      } else {
        showToast(data.error || "Failed to delete product.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Error deleting product.", "error");
    }
  };

  // Handle Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePage) return;
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: activePage.pageId,
          pageName: activePage.pageName,
          pageAccessToken: activePage.pageAccessToken,
          verifyToken: activePage.verifyToken,
          isActive: botActive,
          personaTemplate: storePersona,
          customSystemPrompt: customPrompt,
          insideCityDeliveryFee: Number(insideFee),
          outsideCityDeliveryFee: Number(outsideFee),
          currency: activePage.currency || "BDT",
          allowDiscount,
          maxDiscountPercent: Number(maxDiscount),
          codEnabled,
        }),
      });
      const data = await res.json();
      if (data.success && data.page) {
        setPages(pages.map((p) => (p.pageId === data.page.pageId ? data.page : p)));
        showToast("Store settings and AI sales rules updated successfully!");
      } else {
        showToast(data.error || "Failed to update settings.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Error updating settings.", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast(`Copied ${field} to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

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

        {/* Bottom User Card & Quick Links */}
        <div className="pt-5 border-t border-slate-800/80 space-y-3">
          {pages.length > 1 && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Active Store
              </label>
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {pages.map((p) => (
                  <option key={p.pageId} value={p.pageId}>
                    {p.pageName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentUser && (
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-1">
            <Link
              href="/onboarding"
              className="flex items-center gap-1.5 hover:text-indigo-300 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Page</span>
            </Link>
            {!currentUser && (
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
                Sign In
              </Link>
            )}
          </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Product Catalog</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Active products recognized by the AI for semantic search, photo matching & instant COD checkout.
                </p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 self-start sm:self-auto transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center border border-white/5">
                <ShoppingBag className="w-12 h-12 text-indigo-400/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Products Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Add items to your catalog so Becho can answer pricing, check stock, and close orders.
                </p>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="glass rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between hover:border-indigo-500/30 transition group"
                  >
                    <div className="relative overflow-hidden h-48 bg-slate-900">
                      <img
                        src={p.images[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop"}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10">
                        Stock: {p.stockQuantity}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                          {p.category}
                        </div>
                        <h4 className="font-bold text-sm text-white mb-2 line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
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
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                            Active in AI
                          </span>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            title="Delete Product"
                            className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Store Settings & AI Personality */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-12">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Store Sales Rules & Bot Engine</h1>
              <p className="text-xs text-slate-400 mt-1">
                Configure your autonomous sales closer persona, Cash on Delivery options, and Meta webhook routing.
              </p>
            </div>

            {/* Store Persona & Sales Rules Form */}
            <form onSubmit={handleSaveSettings} className="glass p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>AI Closer Persona & Rules</span>
                  </h3>
                  <p className="text-xs text-slate-400">Applied to all customer chats on Facebook Messenger</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-medium">Bot Status:</span>
                  <button
                    type="button"
                    onClick={() => setBotActive(!botActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      botActive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{botActive ? "Active 24/7" : "Paused"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Store Industry Persona
                  </label>
                  <select
                    value={storePersona}
                    onChange={(e) => setStorePersona(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gadgets">Tech & Electronics (Specs, Fast Charging, Warranties)</option>
                    <option value="fashion">Boutique & Fashion (Sizes, Fabrics, Matching Gowns)</option>
                    <option value="cosmetics">Cosmetics & Skincare (Ingredients, Skin Types)</option>
                    <option value="food">Food & Gourmet (Ingredients, Freshness, Delivery)</option>
                    <option value="custom">General Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Max Discount Allowed for Deal Closing (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Delivery Fee: Inside City (BDT)
                  </label>
                  <input
                    type="number"
                    value={insideFee}
                    onChange={(e) => setInsideFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Delivery Fee: Outside City (BDT)
                  </label>
                  <input
                    type="number"
                    value={outsideFee}
                    onChange={(e) => setOutsideFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Custom AI Sales Pitch Instructions
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Always emphasize our 1-year official warranty, speak a friendly mix of Banglish, and suggest Cash on Delivery directly."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codEnabled}
                      onChange={(e) => setCodEnabled(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Cash on Delivery (COD) Enabled</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowDiscount}
                      onChange={(e) => setAllowDiscount(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Allow AI to Offer Closing Discounts</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition disabled:opacity-60"
                >
                  {isSavingSettings ? "Saving..." : "Save Store Settings"}
                </button>
              </div>
            </form>

            {/* Meta Webhook Live Parameters */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Live Meta Webhook Routing</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Ensure these exact credentials are saved in your Meta Developer App under <strong>Webhooks &gt; Page</strong>.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Callback URL
                  </label>
                  <button
                    onClick={() =>
                      handleCopy(
                        `${typeof window !== "undefined" ? window.location.origin : "https://mbot.nanolez.tech"}/api/webhooks/meta`,
                        "Callback URL"
                      )
                    }
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
                  value={`${typeof window !== "undefined" ? window.location.origin : "https://mbot.nanolez.tech"}/api/webhooks/meta`}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-indigo-300 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Verify Token
                  </label>
                  <button
                    onClick={() => handleCopy("becho_secure_verify_token_2026", "Verify Token")}
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
                  value="becho_secure_verify_token_2026"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Subscribed Webhook Fields
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

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>Add Product to Catalog</span>
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NanoLez Ultra 2 Smartwatch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Regular Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Discount Price (BDT)
                  </label>
                  <input
                    type="number"
                    placeholder="2200"
                    value={newDiscountPrice}
                    onChange={(e) => setNewDiscountPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Smart Gadgets">Smart Gadgets</option>
                    <option value="Audio">Audio & Earbuds</option>
                    <option value="Fashion">Women's Fashion</option>
                    <option value="Men">Men's Wear</option>
                    <option value="Footwear">Footwear & Sneakers</option>
                    <option value="Cosmetics">Cosmetics & Skincare</option>
                    <option value="General">General Goods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Image URL (for visual AI matching)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description & Features
                </label>
                <textarea
                  rows={2}
                  placeholder="Key specs, sizes, colors, material details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl glass hover:bg-slate-800 text-xs font-semibold text-slate-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSavingProduct ? "Saving..." : "Add to AI Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl backdrop-blur-xl text-xs font-semibold animate-slide-up">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span className={toast.type === "success" ? "text-slate-100" : "text-red-300"}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
