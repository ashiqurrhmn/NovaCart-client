"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex-1 w-full bg-[#fcfcfc] dark:bg-[#111111] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e8e2db] dark:border-[#333] rounded-2xl p-8 md:p-12 text-center max-w-lg w-full shadow-lg">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          Thank you for your order. We've received your payment and will begin processing your delivery right away.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/shop"
            className="w-full flex items-center justify-center bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </Link>
          <Link
            href="/buyer/dashboard"
            className="w-full flex items-center justify-center bg-[#f5f0eb] dark:bg-[#222] text-[#1a1a1a] dark:text-white py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:opacity-80 transition-opacity"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
