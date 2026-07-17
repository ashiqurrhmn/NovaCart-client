import ShopPageClient from "@/components/shop-page-client";

async function getProducts() {
  try {
    const res = await fetch("http://localhost:5000/products", {
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

  return <ShopPageClient products={products} />;
}
