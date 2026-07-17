"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Trash2, Edit, Loader2, Package, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  category?: string;
  image?: string;
  imageUrl?: string;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Unable to load products. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const name = (p.title || p.name || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-1">
            Manage Products
          </h1>
          <p className="text-sm text-neutral-500">
            View, edit, or delete existing products in your catalog.
          </p>
        </div>

        <Link
          href="/admin/dashboard/add-product"
          className="px-5 py-2.5 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#333] dark:hover:bg-neutral-200 transition-colors whitespace-nowrap text-center"
        >
          Add New Product
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-[#f5f5f5] dark:bg-[#252525] rounded-lg px-3 py-2 border border-[#e8e8e8] dark:border-[#333]">
          <Search className="w-4 h-4 text-[#999] shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-[#333] dark:text-[#e0e0e0] placeholder:text-[#aaa] dark:placeholder:text-[#666] outline-none w-full min-w-0"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-4 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={fetchProducts}
            className="ml-auto text-xs font-bold underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0dbd5] dark:border-[#333] bg-[#fafafa] dark:bg-[#151515]">
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">Product</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">Category</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">Price</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5] dark:divide-[#333]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">Loading products...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">No products found</p>
                    {searchQuery && <p className="text-xs mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-[#fafafa] dark:hover:bg-[#151515] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#f0ebe5] dark:bg-[#252525] shrink-0 overflow-hidden relative">
                          <Image
                            src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80"}
                            alt={product.title || product.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[#1a1a1a] dark:text-white text-sm line-clamp-2">
                          {product.title || product.name || "Untitled Product"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0ebe5] dark:bg-[#333] text-[#1a1a1a] dark:text-[#ccc] capitalize">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#1a1a1a] dark:text-white text-sm">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/edit-product/${product._id}`}
                          className="p-2 text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white hover:bg-[#f0ebe5] dark:hover:bg-[#333] rounded-lg transition-colors inline-block"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingId === product._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
    </div>
  );
}
