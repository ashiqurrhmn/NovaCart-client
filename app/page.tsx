import { HeroSection } from "@/components/hero-section";

import { CategorySection } from "@/components/category-section";

import { VibeSection } from "@/components/vibe-section";
import { FeaturesSection } from "@/components/features-section";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-[#f5f0eb] dark:bg-[#111111]">
      <HeroSection />
      <CategorySection />
      <VibeSection />
      <FeaturesSection />
    </div>
  );
}
