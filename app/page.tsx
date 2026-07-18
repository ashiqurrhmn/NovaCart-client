export const dynamic = "force-dynamic";
import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/category-section";
import { VibeSection } from "@/components/vibe-section";
import { FeaturesSection } from "@/components/features-section";
import { FeaturedCards } from "@/components/featured-cards";
import { CollectionSection } from "@/components/collection-section";
import { MarqueeBanner } from "@/components/marquee-banner";
import { FAQSection } from "@/components/faq-section";
import { TestimonialsSection } from "@/components/testimonials-section";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col flex-1 bg-[#f5f0eb] dark:bg-[#111111] overflow-x-hidden">
      <HeroSection />
      <CategorySection />
      <CollectionSection products={products} />
      <MarqueeBanner />
      <VibeSection />
      <FeaturesSection />
      <FeaturedCards />
      <FAQSection />
      <TestimonialsSection />
    </div>
  );
}
