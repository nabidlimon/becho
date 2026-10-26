"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  ShoppingBag,
  Sliders,
  Play,
  ShieldCheck,
  Send,
  Plus,
  RefreshCw,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Lock,
  Layers,
} from "lucide-react";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [tokenTestResult, setTokenTestResult] = useState<any>(null);

  // Step 1: Facebook Page State
  const [pageId, setPageId] = useState("100234812398124");
  const [pageName, setPageName] = useState("StyleHub Boutique BD");
  const [pageAccessToken, setPageAccessToken] = useState("EAAX...demo_token_StyleHub");
  const [verifyToken, setVerifyToken] = useState("becho_secure_verify_token_2026");

  // Facebook 1-Click OAuth States
  const [isConnectingFacebook, setIsConnectingFacebook] = useState(false);
  const [fetchedPages, setFetchedPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("100234812398124");
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [showAdvancedManual, setShowAdvancedManual] = useState(false);

  // Step 2: Catalog State
  const [products, setProducts] = useState<any[]>([
    {
      id: "prod-1",
      title: "Royal Blue Georgette Party Maxi Dress",
      category: "Women's Fashion",
      price: 2200,
      stockQuantity: 8,
      sizes: "M, L, XL",
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
    },
    {
      id: "prod-2",
      title: "AirFlex 3D Mesh Running Shoes",
      category: "Footwear",
      price: 1650,
      stockQuantity: 15,
      sizes: "40, 41, 42, 43, 44",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Fashion");

  // Step 3: Persona & Rules State
  const [persona, setPersona] = useState<"fashion" | "gadgets" | "cosmetics" | "food" | "custom">("fashion");
  const [currency, setCurrency] = useState("BDT");
  const [insideCityFee, setInsideCityFee] = useState(70);
  const [outsideCityFee, setOutsideCityFee] = useState(130);
  const [codEnabled, setCodEnabled] = useState(true);
  const [allowDiscount, setAllowDiscount] = useState(true);
  const [maxDiscount, setMaxDiscount] = useState(5);

  // Step 4: Sandbox Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; media?: string }>>([
    {
      sender: "bot",
      text: "Hello! Welcome to StyleHub Boutique ✨. How can I help you find the perfect outfit today? 🛍️",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ isAiPowered?: boolean; aiError?: string } | null>(null);

  // Listen for Meta OAuth Popup Callback message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin to prevent cross-origin injection attacks
      if (typeof window !== "undefined" && event.origin !== window.location.origin) {
        return;
      }

      if (event.data && event.data.type === "META_OAUTH_RESPONSE") {
        setIsConnectingFacebook(false);
        if (event.data.success && Array.isArray(event.data.pages) && event.data.pages.length > 0) {
          setFetchedPages(event.data.pages);
          const first = event.data.pages[0];
          setPageId(first.id);
          setPageName(first.name);
          setPageAccessToken(first.pageAccessToken);
          setSelectedPageId(first.id);
          setTokenTestResult({
            success: true,
            page: {
              name: first.name,
              id: first.id,
              picture: first.avatarUrl,
              category: first.category,
              verified: true,
            },
          });
        } else if (event.data.error) {
          setTokenTestResult({
            success: false,
            error: event.data.error,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Initiate 1-Click Facebook Connection
  const handleConnectFacebook = async () => {
    setIsConnectingFacebook(true);
    setTokenTestResult(null);
    try {
      const res = await fetch("/api/auth/facebook");
      const data = await res.json();

      if (data.configured && data.authUrl) {
        const width = 640;
        const height = 750;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          data.authUrl,
          "FacebookLogin",
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1`
        );
      } else {
        // App ID/Secret not in .env.local: show interactive modal for setup / demo selector
        setOauthModalOpen(true);
        setIsConnectingFacebook(false);
      }
    } catch (err: any) {
      setTokenTestResult({ success: false, error: "Failed to reach authorization service" });
      setIsConnectingFacebook(false);
    }
  };

  // Helper to select a page from OAuth list or Demo list
  const handleSelectPage = (page: { id: string; name: string; pageAccessToken: string; avatarUrl?: string; category?: string }) => {
    setSelectedPageId(page.id);
    setPageId(page.id);
    setPageName(page.name);
    setPageAccessToken(page.pageAccessToken);
    setTokenTestResult({
      success: true,
      page: {
        name: page.name,
        id: page.id,
        picture: page.avatarUrl,
        category: page.category,
        verified: true,
      },
    });
  };

  // Handle Token Ping Test
  const handleTestToken = async () => {
    setIsTestingToken(true);
    setTokenTestResult(null);
    try {
      const res = await fetch("/api/pages/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageAccessToken }),
      });
      const data = await res.json();
      setTokenTestResult(data);
      if (data.success && data.isUserToken && Array.isArray(data.pages) && data.pages.length > 0) {
        setFetchedPages(data.pages);
        const first = data.pages[0];
        handleSelectPage(first);
      } else if (data.success && data.page) {
        setPageName(data.page.name);
        setPageId(data.page.id);
      }
    } catch (err: any) {
      setTokenTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingToken(false);
    }
  };

  // Add Product to list
  const handleAddProduct = () => {
    if (!newTitle || !newPrice) return;
    setProducts([
      ...products,
      {
        id: "prod-" + Date.now(),
        title: newTitle,
        category: newCategory,
        price: Number(newPrice),
        stockQuantity: 10,
        sizes: "Standard",
        imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop",
      },
    ]);
    setNewTitle("");
    setNewPrice("");
  };

  // Save Page Settings to Backend
  const savePageConfig = async () => {
    try {
      await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          pageName,
          pageAccessToken,
          verifyToken,
          personaTemplate: persona,
          insideCityDeliveryFee: insideCityFee,
          outsideCityDeliveryFee: outsideCityFee,
          currency,
          allowDiscount,
          maxDiscountPercent: maxDiscount,
          codEnabled,
        }),
      });
    } catch (err) {
      console.error("Save config error:", err);
    }
  };

  // Save Catalog to Backend
  const saveCatalogConfig = async () => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: products.map((p) => ({
            ...p,
            pageId,
          })),
        }),
      });
    } catch (err) {
      console.error("Save catalog error:", err);
    }
  };

  // Sandbox Chat Send
  const handleSendChatMessage = async (presetText?: string, imageUrl?: string) => {
    const textToSend = presetText !== undefined ? presetText : inputMessage;
    if (!textToSend.trim() && !imageUrl) return;

    const newMsgs = [...chatMessages, { sender: "user" as const, text: textToSend, media: imageUrl }];
    setChatMessages(newMsgs);
    setInputMessage("");
    setIsBotThinking(true);

    try {
      const res = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          userText: textToSend,
          imageUrls: imageUrl ? [imageUrl] : [],
        }),
      });

      const data = await res.json();
      if (data.isAiPowered !== undefined) {
        setAiStatus({ isAiPowered: data.isAiPowered, aiError: data.aiError });
      }
      if (data.replyText) {
        setChatMessages([
          ...newMsgs,
          {
            sender: "bot",
            text: data.replyText,
            media: data.matchedProduct?.images?.[0],
          },
        ]);
      } else {
        setChatMessages([
          ...newMsgs,
          {
            sender: "bot",
            text: `Hello! Yes, we have this item in stock with Cash on Delivery (24-48 hrs delivery). Would you like to confirm your order with your address and phone number? 🛍️`,
          },
        ]);
      }
    } catch (err) {
      console.error("Sandbox error:", err);
      setChatMessages([
        ...newMsgs,
        {
          sender: "bot",
          text: `Hello! Yes, we are available to assist you. All items can be ordered with Cash on Delivery! Feel free to share your delivery details. 📦✨`,
        },
      ]);
    } finally {
      setIsBotThinking(false);
    }
  };

  // Rapid Burst Simulator: sends 3 rapid messages
  const handleRapidBurstTest = async () => {
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: "Hi! Is the blue maxi dress in stock?" },
      { sender: "user", text: "Do you have size L?" },
      { sender: "user", text: "How much is delivery to Uttara Sector 4?" },
    ]);
    setIsBotThinking(true);

    try {
      const res = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          userText: "Hi! Is the blue maxi dress in stock?\nDo you have size L?\nHow much is delivery to Uttara Sector 4?",
        }),
      });

      const data = await res.json();
      if (data.isAiPowered !== undefined) {
        setAiStatus({ isAiPowered: data.isAiPowered, aiError: data.aiError });
      }
      if (data.replyText) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.replyText,
            media: data.matchedProduct?.images?.[0],
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBotThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col" suppressHydrationWarning>
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 px-6 h-16 flex items-center justify-between glass">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
            B
          </div>
          <span className="font-extrabold text-lg text-white">BECHO</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            60s Setup Wizard
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          Skip to Dashboard →
        </Link>
      </header>

      {/* Stepper Header */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-8 pb-4">
        <div className="flex items-center justify-between relative mb-6">
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
          {[
            { num: 1, label: "Connect Page", icon: Zap },
            { num: 2, label: "Feed Catalog", icon: ShoppingBag },
            { num: 3, label: "Sales Rules", icon: Sliders },
            { num: 4, label: "Test & Launch", icon: Play },
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                className="relative z-10 flex flex-col items-center cursor-pointer"
                onClick={() => setCurrentStep(s.num)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : isCurrent
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-4 ring-indigo-500/20"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isCurrent ? "text-indigo-400 font-bold" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pb-16">
        {/* STEP 1: Connect Facebook Page */}
        {currentStep === 1 && (
          <div className="glass p-8 rounded-3xl border border-white/10 animate-slide-up">
            <div className="mb-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                Step 1 of 4
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Connect Your Facebook Page
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Connect your business page in 1 click. Zero technical jargon or manual token copying needed.
              </p>
            </div>

            {/* PRIMARY: 1-Click Facebook OAuth Connect */}
            <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/60 p-6 rounded-2xl border border-blue-500/30 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                <div className="max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-300" /> Recommended for Shop Owners
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-2">
                    1-Click Facebook Login
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Log in with your Facebook account. We automatically retrieve your page and configure a{" "}
                    <strong className="text-emerald-300">permanent, never-expiring</strong> Page Access Token.
                  </p>
                </div>

                <button
                  onClick={handleConnectFacebook}
                  disabled={isConnectingFacebook}
                  className="px-6 py-3.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2.5 transition shrink-0"
                >
                  {isConnectingFacebook ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Connect with Facebook</span>
                    </>
                  )}
                </button>
              </div>

              {/* Fetched Pages List from OAuth */}
              {fetchedPages.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-300 block mb-2.5">
                    Select Your Page ({fetchedPages.length} found):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fetchedPages.map((p) => {
                      const isSelected = selectedPageId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelectPage(p)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                            isSelected
                              ? "bg-blue-950/60 border-blue-400 ring-2 ring-blue-500/20"
                              : "bg-slate-900/60 border-slate-700/80 hover:border-slate-500"
                          }`}
                        >
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                            <p className="text-[10px] text-slate-400">{p.category || "Facebook Page"}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CURRENTLY CONNECTED PAGE STATUS CARD */}
            {tokenTestResult?.success && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{tokenTestResult.page?.name || pageName}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Verified & Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Page ID: <span className="font-mono text-slate-200">{tokenTestResult.page?.id || pageId}</span> • Token:{" "}
                      <span className="text-emerald-300 font-semibold">Permanent (Never Expires)</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTestToken}
                  disabled={isTestingToken}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition flex items-center gap-1.5"
                >
                  {isTestingToken ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                  <span>Re-verify</span>
                </button>
              </div>
            )}

            {/* INSTANT DEMO STORES (For instant testing without a real page) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">
                    No Live Page Yet? Test Instantly With a Demo Store:
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "100234812398124",
                    name: "StyleHub Boutique BD",
                    category: "Fashion & Clothing",
                    token: "EAAX...demo_token_StyleHub",
                    persona: "fashion" as const,
                    avatar: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop",
                  },
                  {
                    id: "100889218374829",
                    name: "TechBazaar BD",
                    category: "Gadgets & Electronics",
                    token: "EAAX...demo_token_TechBazaar",
                    persona: "gadgets" as const,
                    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop",
                  },
                  {
                    id: "100554192837461",
                    name: "Organic Glow Cosmetics",
                    category: "Beauty & Skincare",
                    token: "EAAX...demo_token_Glow",
                    persona: "cosmetics" as const,
                    avatar: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop",
                  },
                ].map((demo) => {
                  const isActive = pageId === demo.id;
                  return (
                    <button
                      key={demo.id}
                      onClick={() => {
                        handleSelectPage({
                          id: demo.id,
                          name: demo.name,
                          pageAccessToken: demo.token,
                          avatarUrl: demo.avatar,
                          category: demo.category,
                        });
                        setPersona(demo.persona);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                        isActive
                          ? "bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/20"
                          : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <img
                        src={demo.avatar}
                        alt={demo.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{demo.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{demo.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLLAPSIBLE: Developer & Manual Token Settings */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvancedManual(!showAdvancedManual)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Developer Mode: Manual Access Token & Webhook Credentials</span>
                </div>
                {showAdvancedManual ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvancedManual && (
                <div className="mt-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 animate-slide-up">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Page Access Token (Long-Lived EAAB...)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={pageAccessToken}
                        onChange={(e) => setPageAccessToken(e.target.value)}
                        placeholder="EAABw..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        onClick={handleTestToken}
                        disabled={isTestingToken}
                        className="px-4 py-2 rounded-xl glass hover:bg-slate-800 text-xs font-bold text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 transition shrink-0"
                      >
                        {isTestingToken ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                        <span>Test Ping</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Facebook Page Name
                      </label>
                      <input
                        type="text"
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Meta Page ID
                      </label>
                      <input
                        type="text"
                        value={pageId}
                        onChange={(e) => setPageId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Webhook Verify Token
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={verifyToken}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  savePageConfig();
                  setCurrentStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* HELPER MODAL FOR FACEBOOK OAUTH SETUP */}
        {oauthModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Enable 1-Click Facebook Login</h3>
                  <p className="text-xs text-slate-400">One-time app configuration</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 mb-6">
                <p>
                  To enable live Facebook Login for your shop owners, add your Meta App credentials to{" "}
                  <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    .env.local
                  </code>
                  :
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-slate-500"># In .env.local:</span>
                  <br />
                  META_APP_ID=your_facebook_app_id
                  <br />
                  META_APP_SECRET=your_facebook_app_secret
                </div>
                <p className="text-slate-400">
                  Once added, merchants can connect their pages with a single click and receive permanent tokens automatically!
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    setOauthModalOpen(false);
                    // Select default demo store
                    handleSelectPage({
                      id: "100234812398124",
                      name: "StyleHub Boutique BD",
                      pageAccessToken: "EAAX...demo_token_StyleHub",
                      avatarUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop",
                      category: "Fashion & Clothing",
                    });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition text-center"
                >
                  Continue with Demo Store
                </button>
                <button
                  onClick={() => setOauthModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Feed Product Catalog */}
        {currentStep === 2 && (
          <div className="glass p-8 rounded-3xl border border-white/10 animate-slide-up">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                  Step 2 of 4
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  Feed Your Product Catalog
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Becho uses this catalog to answer questions, match photos, and close COD orders.
                </p>
              </div>
            </div>

            {/* Current Products List */}
            <div className="space-y-3 mb-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{p.title}</div>
                      <div className="text-xs text-slate-400">
                        {p.category} • In Stock: {p.stockQuantity} • Sizes: {p.sizes}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-400">
                    ৳ {p.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Product Form */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                + Add Another Product
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Product Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500"
                />
                <input
                  type="number"
                  placeholder="Price (e.g. 1500)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500"
                />
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Catalog</span>
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl glass hover:bg-slate-800 text-xs font-bold text-slate-400 transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={async () => {
                  await saveCatalogConfig();
                  setCurrentStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <span>Save Catalog & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Sales Persona & Guardrails */}
        {currentStep === 3 && (
          <div className="glass p-8 rounded-3xl border border-white/10 animate-slide-up">
            <div className="mb-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                Step 3 of 4
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Configure Sales Persona & Guardrails
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Set how the bot communicates, delivery fees, and discount boundaries.
              </p>
            </div>

            {/* Persona Preset Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Industry Persona Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "fashion", label: "Fashion Boutique 👗" },
                  { id: "gadgets", label: "Tech & Gadgets 📱" },
                  { id: "cosmetics", label: "Beauty & Skin 💄" },
                  { id: "food", label: "Food & Kitchen 🍔" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersona(p.id as any)}
                    className={`p-3 rounded-xl text-xs font-bold text-center border transition ${
                      persona === p.id
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Fees & Policies */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Inside City Delivery Fee ({currency})
                </label>
                <input
                  type="number"
                  value={insideCityFee}
                  onChange={(e) => setInsideCityFee(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Outside City Delivery Fee ({currency})
                </label>
                <input
                  type="number"
                  value={outsideCityFee}
                  onChange={(e) => setOutsideCityFee(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-white/5 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Cash on Delivery (COD)</div>
                  <div className="text-xs text-slate-400">
                    Allows the bot to book orders with payment on delivery.
                  </div>
                </div>
                <button
                  onClick={() => setCodEnabled(!codEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    codEnabled ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      codEnabled ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Smart Discounting</div>
                  <div className="text-xs text-slate-400">
                    Allows up to {maxDiscount}% discount only if buyer asks twice or hesitates.
                  </div>
                </div>
                <button
                  onClick={() => setAllowDiscount(!allowDiscount)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    allowDiscount ? "bg-indigo-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      allowDiscount ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl glass hover:bg-slate-800 text-xs font-bold text-slate-400 transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => {
                  savePageConfig();
                  setCurrentStep(4);
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <span>Save Rules & Launch Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Live Interactive Sandbox Test Drive */}
        {currentStep === 4 && (
          <div className="glass p-8 rounded-3xl border border-white/10 animate-slide-up">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                  Step 4 of 4
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  Interactive Live Sandbox Test Drive
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Chat with your AI Sales Closer right here before going live on Facebook!
                </p>
              </div>

              {!isActivated ? (
                <button
                  onClick={async () => {
                    await savePageConfig();
                    await saveCatalogConfig();
                    setIsActivated(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Activate on Facebook</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Bot is Live 24/7 on Facebook!</span>
                </div>
              )}
            </div>

            {/* Quick Test Prompt Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={handleRapidBurstTest}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span>Simulate 3 Rapid Bursts</span>
              </button>
              <button
                onClick={() =>
                  handleSendChatMessage(
                    "Do you have this dress?",
                    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop"
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Simulate Customer Photo</span>
              </button>
              <button
                onClick={() =>
                  handleSendChatMessage(
                    "Please book it for me! Name: Tanvir Ahmed, Phone: 01712345678, Address: House 24, Road 7, Uttara Sector 4, Dhaka."
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Simulate COD Order Closing</span>
              </button>
            </div>

            {/* AI Engine Status Alert */}
            {aiStatus && !aiStatus.isAiPowered && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-slide-up">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-300">
                    Fallback Rule Mode Active (Random/Static Responses)
                  </div>
                  <div className="text-[11px] text-amber-200/80 leading-relaxed">
                    Google Gemini returned: <span className="font-mono text-amber-300">{aiStatus.aiError || "API_KEY_INVALID"}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    To activate dynamic, generative AI sales conversations, replace <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">GEMINI_API_KEY</code> in <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">.env.local</code> with a free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline text-indigo-400 hover:text-indigo-300">Google AI Studio</a>.
                  </div>
                </div>
              </div>
            )}

            {aiStatus && aiStatus.isAiPowered && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-slide-up">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">⚡ Google Gemini AI Active: Real-time autonomous sales reasoning enabled!</span>
              </div>
            )}

            {/* Chat Simulator Window */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[420px]">
              {/* Chat Header */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white">
                  SH
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{pageName}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Becho AI Sales Closer Active
                  </div>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
                      }`}
                    >
                      {msg.media && (
                        <img
                          src={msg.media}
                          alt="Attachment"
                          className="w-48 h-32 rounded-xl object-cover mb-2 border border-white/10"
                        />
                      )}
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                  </div>
                ))}
                {isBotThinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-400 rounded-2xl px-4 py-2 text-xs flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span>Becho is consulting inventory & preparing reply...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a customer inquiry or test rapid enter hits..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl glass hover:bg-slate-800 text-xs font-bold text-slate-400 transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Adjust Settings</span>
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <span>Go to Merchant Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
