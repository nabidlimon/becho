"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Tag,
  Sparkles,
} from "lucide-react";
import { Product } from "@/lib/db/types";

interface CatalogTabProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onDeleteProduct: (productId: string, title: string) => void;
}

export function CatalogTab({
  products,
  onOpenAddProduct,
  onDeleteProduct,
}: CatalogTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesQuery =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active products indexed in Gemini 2.5 Flash for photo visual matching, stock checking, and instant in-chat COD checkout.
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product to Catalog</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items, specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-white/5">
          <ShoppingBag className="w-12 h-12 text-indigo-400/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Products Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Add your inventory items so Becho can answer prices, compare variants, and close orders.
          </p>
          <button
            onClick={onOpenAddProduct}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Product</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="glass rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between hover:border-indigo-500/30 transition group shadow-xl"
            >
              <div className="relative overflow-hidden h-48 bg-slate-900">
                <img
                  src={
                    p.images?.[0] ||
                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop"
                  }
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10">
                  Stock: {p.stockQuantity}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{p.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2 line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
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
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Active in AI</span>
                    </span>
                    <button
                      onClick={() => onDeleteProduct(p.id, p.title)}
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
  );
}
