import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategorySection() {
  const categories = [
    {
      title: "MEN",
      description: "Elevated everyday essentials.",
      image: "/assets/stat-men.jpg",
      link: "/shop/men",
      linkText: "SHOP MEN",
    },
    {
      title: "WOMEN",
      description: "Effortless style for every you.",
      image: "/assets/stat-women.jpg",
      link: "/shop/women",
      linkText: "SHOP WOMEN",
    },
    {
      title: "KIDS",
      description: "Comfort meets cool everyday.",
      image: "/assets/stat-kid.jpg",
      link: "/shop/kids",
      linkText: "SHOP KIDS",
    },
  ];

  return (
    <section className="w-full mt-20 bg-[#111111] py-6 sm:py-10 px-6 lg:px-12 flex justify-center border-t border-white/10">
      <div className="w-full max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8">
              {/* Image */}
              <div className="relative w-[110px] sm:w-[130px] lg:w-[150px] aspect-[4/5] shrink-0 bg-neutral-800 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              
              {/* Text */}
              <div className="flex flex-col">
                <h3 className="text-white text-lg sm:text-xl font-medium tracking-widest uppercase mb-3">
                  {cat.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed mb-6 max-w-[160px]">
                  {cat.description}
                </p>
                <Link
                  href={cat.link}
                  className="inline-flex items-center gap-3 text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase text-white hover:text-neutral-300 transition-colors group"
                >
                  <span className="border-b border-white pb-1 group-hover:border-neutral-300 transition-colors">
                    {cat.linkText}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
