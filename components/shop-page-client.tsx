"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Package, Sparkles, Star, Tag, ChevronDown, Home, Music, Smartphone, HardDrive, ChevronLeft, ChevronRight } from "lucide-react";
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

const CATEGORIES = [
  { label: "All Product", icon: Package, key: "all" },
  { label: "Men's Clothing", icon: Home, key: "men's clothing" },
  { label: "Women's Clothing", icon: Sparkles, key: "women's clothing" },
  { label: "Kids' Clothing", icon: Smartphone, key: "kids' clothing" },
];

const SIDEBAR_SECTIONS = [
  { label: "New Arrival", icon: Search },
  { label: "Best Seller", icon: Star },
  { label: "On Discount", icon: Tag },
];

export default function ShopPageClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const filteredProducts = products.filter((p) => {
    const cat = p.category?.toLowerCase() || "";
    const matchCat = activeCategory === "all" || cat === activeCategory;
    const name = (p.name || p.title || "").toLowerCase();
    const matchSearch = name.includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex-1 bg-[#f5f0eb] dark:bg-[#111111] min-h-screen overflow-x-hidden">
      {/* Hero Banner */}
      <div className="relative w-full h-[180px] sm:h-[240px] md:h-[360px] overflow-hidden">
        <Image
          src="/assets/browse-img.jpg"
          alt="Shop Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden pb-0">
          <h1 className="text-[72px] sm:text-[80px] md:text-[130px] lg:text-[360px] font-black text-white/50 uppercase tracking-wider select-none leading-none text-center translate-y-[20%]">
            Shop
          </h1>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 -mt-6 relative z-10">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">
            Give All You Need
          </h2>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto md:max-w-md">
            <div className="flex items-center gap-2 flex-1 min-w-0 bg-[#f5f5f5] dark:bg-[#252525] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border border-[#e8e8e8] dark:border-[#333]">
              <Search className="w-4 h-4 text-[#999] shrink-0" />
              <input
                type="text"
                placeholder="Search on NovaCart"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm text-[#333] dark:text-[#e0e0e0] placeholder:text-[#aaa] dark:placeholder:text-[#666] outline-none w-full min-w-0"
              />
            </div>
            <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1a1a1a] dark:bg-[#e0e0e0] text-white dark:text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] transition-colors whitespace-nowrap shrink-0">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Products */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 py-6 md:py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            {/* Category section */}
            <div className="mb-6">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <span className="text-[15px] font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">Category</span>
                <ChevronDown className={`w-4 h-4 text-[#999] transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>

              {categoryOpen && (
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const count = cat.key === "all"
                      ? products.length
                      : products.filter(p => (p.category?.toLowerCase() || "") === cat.key).length;
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.key;

                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          setActiveCategory(cat.key);
                          setCurrentPage(1);
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-[#1a1a1a] text-white dark:bg-[#e0e0e0] dark:text-[#1a1a1a] font-semibold"
                            : "text-[#555] dark:text-[#aaa] hover:bg-[#f0f0f0] dark:hover:bg-[#252525]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{cat.label}</span>
                        {isActive && (
                          <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other sidebar sections */}
            <div className="space-y-1 border-t border-[#e8e8e8] dark:border-[#333] pt-4">
              {SIDEBAR_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.label}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-[#555] dark:text-[#aaa] hover:bg-[#f0f0f0] dark:hover:bg-[#252525] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{section.label}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#bbb]" />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile category pills */}
            <div className="flex lg:hidden items-center gap-2 mb-5 overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setActiveCategory(cat.key);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap border transition-colors ${
                      isActive
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a] dark:bg-[#e0e0e0] dark:text-[#1a1a1a] dark:border-[#e0e0e0]"
                        : "bg-white text-[#555] border-[#ddd] dark:bg-[#222] dark:text-[#aaa] dark:border-[#444]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#999]">
                <Package className="w-12 h-12 mb-4 opacity-40" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">Try changing your search or filter</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-6 border-t border-[#e8e8e8] dark:border-[#333]">
                    <span className="text-sm text-[#555] dark:text-[#aaa]">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-[#555] dark:text-[#aaa] hover:text-[#1a1a1a] dark:hover:text-white border border-[#e8e8e8] dark:border-[#333] rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none px-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === i + 1 
                                ? "bg-[#1a1a1a] text-white dark:bg-[#e0e0e0] dark:text-[#1a1a1a]" 
                                : "text-[#555] dark:text-[#aaa] border border-[#e8e8e8] dark:border-[#333] hover:bg-[#f5f5f5] dark:hover:bg-[#252525]"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-[#555] dark:text-[#aaa] hover:text-[#1a1a1a] dark:hover:text-white border border-[#e8e8e8] dark:border-[#333] rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
