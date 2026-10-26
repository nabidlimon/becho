"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Bot,
  User,
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Send,
  RefreshCw,
} from "lucide-react";

export function InteractiveMessengerHero() {
  const [messages, setMessages] = useState<Array<{ sender: "buyer" | "becho"; text: string; image?: string; orderBadge?: boolean }>>([
    {
      sender: "buyer",
      text: "Bhai eita ki available ase? Price koto?",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    },
    {
      sender: "becho",
      text: "Ji bhai! Photo-r NanoLez Ultra 2 Smartwatch-ta ready stock ase ✨\nAMOLED Always-On Display, Bluetooth calling feature shoho. Regular price ৳3,200, kintu ajker offer price matro ৳2,850!\n\nApnar kon color-ta pochondo? Space Black naki Ocean Blue?",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scenarios = [
    {
      label: "Ask for Discount",
      buyerText: "Kisu discount hobe na bhai? 2500 tk te dewa jabe?",
      botReply:
        "Apnar jonno amader special promo code apply kore ৳150 aro komiye ৳2,700 kore dilam bhai! 🎉\nEmon price-e AMOLED Bluetooth calling watch ar paben na. Ekhon confirm korle kal-i delivery pathiye dibo. Order confirm korbo ki?",
    },
    {
      label: "Confirm COD Order",
      buyerText: "Thik ase book kore den. Name: Sakib Hasan, Phone: 01798765432, Address: House 12, Road 4, Dhanmondi, Dhaka.",
      botReply:
        "🎉 Dhonnobad Sakib bhai! Apnar Cash on Delivery (COD) order confirm hoyeche!\n\n📦 Order Ref: #BC-9201\n• Product: NanoLez Ultra 2 Smartwatch (৳2,700)\n• Delivery Fee (Inside Dhaka): ৳70\n• Total Payable at Delivery: ৳2,770 (Cash on Delivery)\n\nAmader delivery hero 24 ghontay apnar thikanay parcel pouchhe dibe. Delivery person er samne box check kore taka diben!",
      orderBadge: true,
    },
    {
      label: "Customer Photo Search",
      buyerText: "Do you have this specific model in stock?",
      buyerImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
      botReply:
        "Match found! 🎯 Eita amader NanoLez Pods Pro Wireless Earbuds (Active Noise Cancellation). Price: ৳1,650 COD. Direct Cash on Delivery-te nite caile apnar address-ta pathan!",
    },
  ];

  const handleTriggerScenario = (scenario: typeof scenarios[0]) => {
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: "buyer",
        text: scenario.buyerText,
        image: scenario.buyerImage,
      },
    ]);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "becho",
          text: scenario.botReply,
          orderBadge: scenario.orderBadge,
        },
      ]);
    }, 1200);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal("");
    setIsTyping(true);

    setMessages((prev) => [
      ...prev,
      { sender: "buyer", text: userText },
    ]);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "becho",
          text: `Ji bhai! Apnar message "${userText}" peyechi. Amader inventory theke item check kora hoyeche. Cash on Delivery (COD)-te order book korte apnar Name, Phone & Address likhe pathan! ✨`,
        },
      ]);
    }, 1100);
  };

  return (
    <div className="max-w-4xl mx-auto my-12 glass rounded-3xl border border-indigo-500/30 overflow-hidden shadow-2xl shadow-indigo-600/20 text-left">
      {/* Widget Header */}
      <div className="bg-[#0b1120] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-black text-white shadow-md">
            BE
          </div>
          <div>
            <div className="text-xs font-extrabold text-white flex items-center gap-2">
              <span>Live Facebook Messenger Preview</span>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.2 rounded-full font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Response Time: 1.8s
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Autonomous Banglish Sales Psychology &amp; Multimodal COD Closing
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Interactive Simulation</span>
        </div>
      </div>

      {/* Scenario Action Buttons */}
      <div className="bg-slate-900/60 p-3 border-b border-slate-800/60 flex flex-wrap gap-2 items-center">
        <span className="text-[10px] uppercase font-bold text-slate-400 px-2">
          Click to Test Live AI:
        </span>
        {scenarios.map((sc, i) => (
          <button
            key={i}
            onClick={() => handleTriggerScenario(sc)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Zap className="w-3 h-3 text-yellow-300" />
            <span>{sc.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Stream */}
      <div className="p-5 h-80 overflow-y-auto space-y-3 bg-[#070b14]/90">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "buyer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                m.sender === "buyer"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
              }`}
            >
              {m.image && (
                <img
                  src={m.image}
                  alt="Customer attachment"
                  className="w-48 h-32 rounded-xl object-cover mb-2 border border-white/10"
                />
              )}
              <div className="whitespace-pre-line">{m.text}</div>
              {m.orderBadge && (
                <div className="mt-2 pt-2 border-t border-emerald-500/30 flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Cash-on-Delivery Order Recorded in Dashboard!</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 rounded-2xl px-4 py-2 text-xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Becho is consulting inventory &amp; closing deal...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <form onSubmit={handleCustomSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          placeholder="Test any question in Bengali or English (e.g. 'Delivery charge koto?')..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
