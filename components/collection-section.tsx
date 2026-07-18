"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";

interface Product {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  description?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  rating?: { rate: number; count: number };
}

interface CollectionSectionProps {
  products: Product[];
}

const TABS = [
  "All Product",
  "Men's Clothing",
  "Women's Clothing",
  "Kids' Clothing"
];

export function CollectionSection({ products }: CollectionSectionProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Filter products by category
  const filteredProducts = products.filter(p => {
    const cat = p.category?.toLowerCase() || "";
    const tabName = activeTab.toLowerCase();
    
    if (tabName === "all product") return true;
    
    return cat === tabName;
  });

  // Display max 4 products. If filters yield empty, fallback to first 4 for demo purposes.
  const displayProducts = filteredProducts.length > 0 ? filteredProducts.slice(0, 4) : products.slice(0, 4);

  return (
    <section className="w-full bg-[#f5f0eb] dark:bg-[#111111] py-16 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <h2 className="text-4xl md:text-[3.5rem] font-black uppercase tracking-tight text-[#1a1a1a] dark:text-white leading-[0.9]">
            OUR COLLECTION
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm max-w-lg lg:text-right leading-relaxed">
            Step into the world of Reflect, where each collection tells its own story. From minimalist essentials to bold statement pieces, our curated collections are designed to suit every occasion and style.
          </p>
        </div>

        {/* Tabs Area */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-medium border transition-colors ${
                activeTab === tab
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a] dark:bg-white dark:text-[#111111] dark:border-white"
                  : "bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-500 dark:text-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
