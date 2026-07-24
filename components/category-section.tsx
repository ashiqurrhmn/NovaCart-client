"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CategorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const categories = [
    {
      title: "MEN",
      description: "Elevated everyday essentials.",
      image: "/assets/stat-men.jpg",
      link: "/shop?category=men's%20clothing",
      linkText: "SHOP MEN",
    },
    {
      title: "WOMEN",
      description: "Effortless style for every you.",
      image: "/assets/stat-women.jpg",
      link: "/shop?category=women's%20clothing",
      linkText: "SHOP WOMEN",
    },
    {
      title: "KIDS",
      description: "Comfort meets cool everyday.",
      image: "/assets/stat-kid.jpg",
      link: "/shop?category=kids'%20clothing",
      linkText: "SHOP KIDS",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return;

        const image = item.querySelector("[data-cat-image]");
        const text = item.querySelector("[data-cat-text]");

        // Image — clip-path reveal from bottom
        if (image) {
          gsap.fromTo(
            image,
            { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 0.9,
              delay: i * 0.18,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Text — fade and slide from right
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, x: 30, filter: "blur(4px)" },
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 0.8,
              delay: i * 0.18 + 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full mt-20 bg-[#111111] dark:bg-black py-6 sm:py-10 px-6 lg:px-12 flex justify-center border-t border-neutral-200 dark:border-white/10 transition-colors"
    >
      <div className="w-full max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              ref={(el) => { itemsRef.current[idx] = el; }}
              className="flex items-center gap-6 sm:gap-8"
            >
              {/* Image */}
              <div
                data-cat-image
                className="relative w-[110px] sm:w-[130px] lg:w-[150px] aspect-[4/5] shrink-0 bg-neutral-800 overflow-hidden"
                style={{ willChange: "clip-path, opacity" }}
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 110px, (max-width: 1024px) 130px, 150px"
                />
              </div>

              {/* Text */}
              <div data-cat-text className="flex flex-col" style={{ willChange: "transform, opacity, filter" }}>
                <h3 className="text-white text-lg sm:text-xl font-medium tracking-widest uppercase mb-3 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed mb-6 max-w-[160px] transition-colors">
                  {cat.description}
                </p>
                <Link
                  href={cat.link}
                  className="inline-flex items-center gap-3 text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase text-white hover:text-neutral-300 transition-colors group"
                >
                  <span className="border-b border-white pb-1 group-hover:border-neutral-300 transition-colors">
                    {cat.linkText}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
