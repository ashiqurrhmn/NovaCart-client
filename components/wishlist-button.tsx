"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/app/context/wishlist-context";
import { useSession } from "@/app/lib/auth-client";

interface WishlistButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export function WishlistButton({ product }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { data: session } = useSession();
  
  if (session?.user?.role === "admin") {
    return null;
  }

  const inWishlist = isInWishlist(product._id);

  return (
    <button
      onClick={() => toggleWishlist(product)}
      className="flex items-center justify-center gap-3 bg-white dark:bg-[#1a1a1a] border-2 border-[#e8e2db] dark:border-[#333] text-[#1a1a1a] dark:text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#f5f0eb] dark:hover:bg-[#252525] transition-colors"
    >
      <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
      Wishlist
    </button>
  );
}
