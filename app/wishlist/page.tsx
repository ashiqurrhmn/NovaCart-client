"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/app/context/wishlist-context";
import { useCart } from "@/app/context/cart-context";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollAnimate } from "@/components/scroll-animate";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect if guest or admin
  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login");
      } else if (session.user.role === "admin") {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  if (isPending || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role === "admin") {
    return null; // Will redirect
  }

  const handleMoveToCart = (item: any) => {
    addToCart(item);
    removeFromWishlist(item._id);
  };

  return (
    <div className="flex-1 w-full bg-[#f5f0eb] dark:bg-[#111111]">
      <div className="max-w-[1440px] mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-white uppercase">
            My Wishlist
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <ScrollAnimate variant="fadeUp" className="bg-white dark:bg-[#1a1a1a] border border-[#e8e2db] dark:border-[#333] rounded-2xl p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-700 mb-6" />
            <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
              Save your favorite items here while you shop. They'll be waiting for you when you're ready to buy.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-4 rounded-xl font-bold tracking-wide uppercase text-sm hover:opacity-80 transition-opacity"
            >
              Explore Products
            </Link>
          </ScrollAnimate>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item) => (
                <motion.div 
                  key={item._id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="group flex flex-col bg-white dark:bg-[#1a1a1a] rounded-sm overflow-hidden border border-[#e8e2db] dark:border-[#333333] transition-all hover:shadow-lg"
                >
                <Link href={`/product/${item._id}`} className="relative aspect-[4/5] overflow-hidden bg-[#f5f0eb] dark:bg-[#222]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item._id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/90 text-red-500 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>
                
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/product/${item._id}`} className="block group-hover:opacity-70 transition-opacity mb-2">
                    <h3 className="text-sm font-medium text-[#1a1a1a] dark:text-[#e0e0e0] line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#f0f0f0]">
                      ${item.price.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white hover:opacity-70 transition-opacity flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
