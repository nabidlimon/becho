"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Package,
} from "lucide-react";
import { FacebookPage, Product, Order, Conversation } from "@/lib/db/types";

// Modular Dashboard Subcomponents
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { InboxTab } from "@/components/dashboard/InboxTab";
import { OrdersTab } from "@/components/dashboard/OrdersTab";
import { CatalogTab } from "@/components/dashboard/CatalogTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

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

  // Fetch all initial data
  const loadData = async (targetPageId?: string) => {
    setIsLoading(true);
    try {
      const [meRes, pagesRes] = await Promise.all([
        fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ authenticated: false })),
        fetch("/api/pages").then((r) => r.json()).catch(() => ({ pages: [] })),
      ]);

      if (meRes.authenticated && meRes.user) {
        setCurrentUser(meRes.user);
      }

      const fetchedPages: FacebookPage[] =
        meRes.pages && meRes.pages.length > 0 ? meRes.pages : pagesRes.pages || [];
      setPages(fetchedPages);

      const activeId = targetPageId || selectedPageId || (fetchedPages.length > 0 ? fetchedPages[0].pageId : "");
      if (activeId && activeId !== selectedPageId) {
        setSelectedPageId(activeId);
      }

      // Fetch page-scoped data
      await fetchPageData(activeId);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch page-isolated catalog, orders, and chats
  const fetchPageData = async (pageId?: string) => {
    try {
      const queryParam = pageId ? `?pageId=${pageId}` : "";
      const [prodRes, ordRes, chatRes] = await Promise.all([
        fetch(`/api/products${queryParam}`).then((r) => r.json()).catch(() => ({ products: [] })),
        fetch(`/api/orders${queryParam}`).then((r) => r.json()).catch(() => ({ orders: [] })),
        fetch(`/api/chat${queryParam}`).then((r) => r.json()).catch(() => ({ conversations: [] })),
      ]);

      setProducts(prodRes.products || []);
      setOrders(ordRes.orders || []);
      const convs = chatRes.conversations || [];
      setConversations(convs);
      if (convs.length > 0) {
        setSelectedConv((prev) => (prev ? convs.find((c: any) => c.id === prev.id) || convs[0] : convs[0]));
      } else {
        setSelectedConv(null);
      }
    } catch (err) {
      console.error("Error fetching page data:", err);
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

  // Re-fetch page data when merchant switches active Facebook page in the sidebar
  useEffect(() => {
    if (selectedPageId) {
      fetchPageData(selectedPageId);
    }
  }, [selectedPageId]);

  // Real-time polling: silently refresh orders & messages every 10 seconds
  useEffect(() => {
    if (!selectedPageId) return;
    const interval = setInterval(() => {
      const queryParam = `?pageId=${selectedPageId}`;
      Promise.all([
        fetch(`/api/orders${queryParam}`).then((r) => r.json()).catch(() => ({ orders: [] })),
        fetch(`/api/chat${queryParam}`).then((r) => r.json()).catch(() => ({ conversations: [] })),
      ]).then(([ordRes, chatRes]) => {
        if (ordRes.orders) setOrders(ordRes.orders);
        if (chatRes.conversations) {
          setConversations(chatRes.conversations);
          setSelectedConv((prev) =>
            prev ? chatRes.conversations.find((c: any) => c.id === prev.id) || prev : chatRes.conversations[0] || null
          );
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedPageId]);

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
    if (!activePage?.pageId) {
      showToast("Please connect or select a Facebook Page first.", "error");
      return;
    }
    setIsSavingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: activePage.pageId,
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
        showToast(
          data.isAiActive
            ? "Handed over to AI Closer. It will reply to incoming customer messages."
            : "Human Takeover active. AI responses paused for this customer.",
          "success"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Human Sends Reply via Dashboard
  const handleSendHumanReply = async (replyText: string) => {
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
        showToast(`Order status updated to ${status}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = conversations.filter((c) => !c.isAiActive).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase">Loading Merchant Command Center...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#070b14] text-slate-100 overflow-x-hidden">
      {/* 1. Global Modular Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pages={pages}
        selectedPageId={selectedPageId}
        setSelectedPageId={setSelectedPageId}
        currentUser={currentUser}
        onLogout={handleLogout}
        unreadCount={unreadCount}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* 2. Main Tab View Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {activeTab === "overview" && (
          <OverviewTab
            activePage={activePage}
            orders={orders}
            conversations={conversations}
            setActiveTab={setActiveTab}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onSelectConversation={(conv) => {
              setSelectedConv(conv);
              setActiveTab("inbox");
            }}
          />
        )}

        {activeTab === "inbox" && (
          <InboxTab
            conversations={conversations}
            selectedConv={selectedConv}
            setSelectedConv={setSelectedConv}
            onToggleAi={handleToggleAi}
            onSendReply={handleSendHumanReply}
            orders={orders}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            showToast={showToast}
          />
        )}

        {activeTab === "catalog" && (
          <CatalogTab
            products={products}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            activePage={activePage}
            botActive={botActive}
            setBotActive={setBotActive}
            storePersona={storePersona}
            setStorePersona={setStorePersona}
            insideFee={insideFee}
            setInsideFee={setInsideFee}
            outsideFee={outsideFee}
            setOutsideFee={setOutsideFee}
            allowDiscount={allowDiscount}
            setAllowDiscount={setAllowDiscount}
            maxDiscount={maxDiscount}
            setMaxDiscount={setMaxDiscount}
            codEnabled={codEnabled}
            setCodEnabled={setCodEnabled}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            onSaveSettings={handleSaveSettings}
            isSavingSettings={isSavingSettings}
            copiedField={copiedField}
            onCopy={handleCopy}
          />
        )}
      </main>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/10 shadow-2xl relative bg-[#090d19]">
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
