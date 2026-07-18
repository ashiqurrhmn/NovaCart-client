export const dynamic = "force-dynamic";
import { Suspense } from "react";
import ShopPageClient from "@/components/shop-page-client";
import ShopLoading from "./loading";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopPageClient products={products} />
    </Suspense>
  );
}
