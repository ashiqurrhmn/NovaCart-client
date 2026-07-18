"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { useSession } from "@/app/lib/auth-client";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  
  if (session?.user?.role === "admin") {
    return null;
  }

  return (
    <button
      onClick={() => addToCart(product)}
      className="flex-1 flex items-center justify-center gap-3 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-4 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity"
    >
      <ShoppingCart className="w-5 h-5" />
      Add to Cart
    </button>
  );
}
