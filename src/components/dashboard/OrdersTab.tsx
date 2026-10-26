"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Copy,
  Printer,
  Check,
  Phone,
  MapPin,
  Truck,
  ExternalLink,
  ChevronDown,
  X,
  FileText,
} from "lucide-react";
import { Order } from "@/lib/db/types";

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}

export function OrdersTab({ orders, onUpdateStatus, showToast }: OrdersTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesQuery =
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleCopyCourierFormat = (order: Order) => {
    // Format tailored for Steadfast, RedX, Pathao bulk booking
    const courierText = `Recipient Name: ${order.shippingName}\nPhone: ${order.shippingPhone}\nAddress: ${order.shippingAddress}\nCOD Amount: ${order.totalAmount}\nItem: ${order.items?.[0]?.title || "E-Commerce Product"} (${order.items?.[0]?.variant || "Standard"})\nOrder Ref: ${order.orderNumber}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(courierText);
      setCopiedId(order.id);
      showToast(`Copied Courier Dispatch format for ${order.orderNumber}!`);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const totalCodValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <span>Cash on Delivery (COD) CRM</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Orders closed directly inside Facebook Messenger by Becho AI Closer. Ready for parcel dispatch.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl glass border border-emerald-500/20 bg-emerald-500/5 self-start sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Total COD Volume
          </div>
          <div className="text-xl font-black text-white">৳ {totalCodValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {["all", "confirmed", "pending", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order #, phone, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Delivery Address</th>
                <th className="py-3.5 px-4">Item &amp; Total</th>
                <th className="py-3.5 px-4">Courier Status</th>
                <th className="py-3.5 px-4 text-right">Courier Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No orders found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-4 px-4 font-mono font-bold text-white">
                      <div>{o.orderNumber}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-200">{o.shippingName}</div>
                      <a
                        href={`tel:${o.shippingPhone}`}
                        className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{o.shippingPhone}</span>
                      </a>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="text-slate-300 text-xs line-clamp-2 leading-relaxed flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                        <span>{o.shippingAddress}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-white font-semibold line-clamp-1">
                        {o.items?.[0]?.title || "E-Commerce Product"}
                      </div>
                      <div className="text-emerald-400 font-extrabold mt-0.5">
                        ৳ {o.totalAmount}{" "}
                        <span className="text-[10px] text-slate-500 font-normal">(COD)</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => onUpdateStatus(o.id, e.target.value as any)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition appearance-none cursor-pointer ${
                          o.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : o.status === "shipped"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                            : o.status === "delivered"
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
                            : o.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped 🚚</option>
                        <option value="delivered">Delivered ✅</option>
                        <option value="cancelled">Cancelled ❌</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1-Click Copy for Courier Booking */}
                        <button
                          onClick={() => handleCopyCourierFormat(o)}
                          title="Copy Steadfast/RedX Courier Format"
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 transition"
                        >
                          {copiedId === o.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-3.5 h-3.5" />
                              <span>Courier Copy</span>
                            </>
                          )}
                        </button>

                        {/* View/Print Packing Slip */}
                        <button
                          onClick={() => setSelectedSlipOrder(o)}
                          title="Print Packing Slip"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packing Slip Modal */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/10 shadow-2xl relative bg-[#090d19]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">COD Delivery Packing Slip</h3>
              </div>
              <button
                onClick={() => setSelectedSlipOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-white text-sm">
                    {selectedSlipOrder.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 uppercase text-[10px]">
                    CASH ON DELIVERY
                  </span>
                </div>
                <div className="text-slate-400">
                  Date: {new Date(selectedSlipOrder.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Customer Details
                  </div>
                  <div className="font-bold text-white">{selectedSlipOrder.shippingName}</div>
                  <div className="font-mono text-indigo-400 mt-0.5">
                    {selectedSlipOrder.shippingPhone}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    COD Collect Amount
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    ৳ {selectedSlipOrder.totalAmount}
                  </div>
                  <div className="text-[10px] text-slate-400">Payable at door</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Delivery Destination
                </div>
                <div className="text-slate-200 leading-relaxed">
                  {selectedSlipOrder.shippingAddress}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Package Contents
                </div>
                <div className="flex justify-between items-center text-white font-semibold">
                  <span>{selectedSlipOrder.items?.[0]?.title || "E-Commerce Product"}</span>
                  <span>1 unit</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSlipOrder(null)}
                  className="px-4 py-2 rounded-xl glass hover:bg-slate-800 text-slate-400 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
