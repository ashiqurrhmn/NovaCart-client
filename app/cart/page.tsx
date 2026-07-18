"use client";

import { useCart } from "@/app/context/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f5f0eb] dark:bg-[#111111] py-20 px-4">
        <div className="w-24 h-24 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-sm mb-6">
          <ShoppingBag className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] dark:text-white mb-3">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8 max-w-sm text-center">
          Looks like you haven&apos;t added anything to your cart yet. Discover our latest products and find something you love.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-3.5 rounded-full font-bold text-sm tracking-wide uppercase hover:opacity-80 transition-opacity"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f5f0eb] dark:bg-[#111111] pt-6 pb-16">
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a1a] dark:text-white uppercase tracking-tight">
            Shopping Cart
          </h1>
          <span className="text-sm font-medium text-neutral-500 bg-white dark:bg-[#1a1a1a] px-3 py-1 rounded-full shadow-sm">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white dark:bg-[#1a1a1a] p-4 sm:p-5 rounded-2xl border border-[#e8e2db] dark:border-[#333] shadow-sm relative group"
              >
                {/* Item Image */}
                <Link href={`/product/${item._id}`} className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#f5f0eb] dark:bg-[#222] rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                </Link>

                {/* Item Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <Link href={`/product/${item._id}`} className="inline-block hover:opacity-70 transition-opacity mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] dark:text-white line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-semibold text-[#1a1a1a] dark:text-neutral-300 mb-4">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#e8e2db] dark:border-[#333] rounded-lg bg-[#f9f7f5] dark:bg-[#151515]">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-[#1a1a1a] dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="hidden sm:block text-sm font-bold text-[#1a1a1a] dark:text-white ml-auto mr-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors absolute sm:static top-2 right-2 sm:top-auto sm:right-auto"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#e8e2db] dark:border-[#333] p-6 sm:p-8 rounded-2xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-6 uppercase tracking-tight border-b border-[#e8e2db] dark:border-[#333] pb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1a1a1a] dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-[#1a1a1a] dark:text-white">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-[#e8e2db] dark:border-[#333] pt-4 mb-8 flex justify-between items-end">
                <span className="text-base font-bold text-[#1a1a1a] dark:text-white uppercase">Total</span>
                <span className="text-2xl font-extrabold text-[#1a1a1a] dark:text-white">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:opacity-80 transition-opacity"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <p className="mt-4 text-xs text-center text-neutral-500">
                Secure checkout powered by Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
