import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

interface Product {
  _id: string;
  name?: string;
  title?: string;
  price: number;
  description?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const name = product.name || product.title || "Unknown Product";
  const image = product.image || product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800";
  const price = product.price || 0;
  const category = product.category || "Uncategorized";

  return (
    <div className="group flex flex-col bg-white dark:bg-[#1a1a1a] rounded-sm overflow-hidden border border-[#e8e2db] dark:border-[#333333] transition-all hover:shadow-lg">
      <Link href={`/product/${product._id}`} className="relative aspect-[4/5] overflow-hidden bg-[#f5f0eb] dark:bg-[#222]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>
      
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <div className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666666] dark:text-[#999999] mb-1">
          {category}
        </div>
        <Link href={`/product/${product._id}`} className="block group-hover:opacity-70 transition-opacity">
          <h3 className="text-xs sm:text-sm font-medium text-[#1a1a1a] dark:text-[#e0e0e0] line-clamp-1">
            {name}
          </h3>
        </Link>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a] dark:text-[#f0f0f0]">
            ${price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              className="p-2 text-[#999] hover:text-red-500 dark:text-[#666] dark:hover:text-red-400 transition-colors flex items-center justify-center"
              aria-label="Add to wishlist"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button 
              className="p-2 bg-[#1a1a1a] dark:bg-[#e0e0e0] text-white dark:text-[#1a1a1a] rounded-sm hover:opacity-80 transition-opacity flex items-center justify-center"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
