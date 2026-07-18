import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, ShieldCheck, ArrowLeftRight } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";

interface Product {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  imageUrl?: string;
  rating?: {
    rate: number;
    count: number;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    // Adding no-store to always fetch the latest details
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch product");
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const name = product.title || product.name || "Unknown Product";
  const image = product.image || product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800";
  const category = product.category || "Uncategorized";
  const price = product.price || 0;
  const description = product.description || "No description available for this product.";
  const rating = product.rating || { rate: 4.5, count: 128 }; // Fallback rating for display

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f0eb] dark:bg-[#111111] pt-6 pb-8 flex flex-col justify-center">
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 xl:px-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </nav>

        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative w-full max-w-[550px] mx-auto aspect-square lg:aspect-[4/5] bg-[#f5f0eb] dark:bg-[#222] rounded-2xl overflow-hidden border border-[#e8e2db] dark:border-[#333]">
              <Image
                src={image}
                alt={name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Category & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="inline-block px-3 py-1 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] text-[11px] font-bold tracking-wider uppercase rounded-full">
                {category}
              </span>
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white">{rating.rate}</span>
                <span className="text-sm">({rating.count} reviews)</span>
              </div>
            </div>

            {/* Title & Price */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] dark:text-white mb-4 leading-tight">
              {name}
            </h1>
            <p className="text-3xl font-bold text-[#1a1a1a] dark:text-white mb-8">
              ${price.toFixed(2)}
            </p>

            {/* Description */}
            <div className="prose prose-sm dark:prose-invert text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              <p>{description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <AddToCartButton 
                product={{
                  _id: product._id,
                  name: name,
                  price: price,
                  image: image,
                }} 
              />
              <WishlistButton
                product={{
                  _id: product._id,
                  name: name,
                  price: price,
                  image: image,
                }}
              />
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#e8e2db] dark:border-[#333]">
              <div className="flex flex-col gap-2">
                <Truck className="w-6 h-6 text-neutral-400" />
                <h4 className="font-semibold text-sm text-[#1a1a1a] dark:text-white">Free Delivery</h4>
                <p className="text-xs text-neutral-500">Orders over $50</p>
              </div>
              <div className="flex flex-col gap-2">
                <ArrowLeftRight className="w-6 h-6 text-neutral-400" />
                <h4 className="font-semibold text-sm text-[#1a1a1a] dark:text-white">Easy Returns</h4>
                <p className="text-xs text-neutral-500">30 days return policy</p>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-6 h-6 text-neutral-400" />
                <h4 className="font-semibold text-sm text-[#1a1a1a] dark:text-white">Secure Payment</h4>
                <p className="text-xs text-neutral-500">100% safe checkout</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
