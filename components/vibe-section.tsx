"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollAnimate } from "@/components/scroll-animate";

export function VibeSection() {
  return (
    <section className="relative w-full h-[400px] sm:h-[450px] lg:h-[550px] overflow-hidden bg-[#f5f0eb] dark:bg-[#111111] transition-colors">
      {/* Background Image constrained to the right */}
      <ScrollAnimate variant="fadeRight" duration={1} className="absolute inset-y-0 right-0 lg:right-[10%] w-full md:w-[50%] lg:w-[25%] z-[5]">
        <div className="relative w-full h-full">
          <Image
            src="/assets/vibe0.png"
            alt="New Vibes"
            fill
            className="object-cover object-left md:object-right"
            priority
          />
        </div>
      </ScrollAnimate>

      {/* Giant Decorative Background Text to fill empty space */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <span className="text-[12rem] sm:text-[18rem] lg:text-[24rem] font-black uppercase tracking-tighter text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap select-none">
          VIBES
        </span>
      </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-sm sm:max-w-md">
            <ScrollAnimate variant="fadeUp" delay={0.1}>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] mb-4 transition-colors">
                NEW SEASON
              </p>
            </ScrollAnimate>
            <ScrollAnimate variant="fadeUp" delay={0.2}>
              <h2 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold uppercase tracking-tight text-[#1a1a1a] dark:text-white leading-[0.9] mb-6 transition-colors">
                NEW<br />VIBES
              </h2>
            </ScrollAnimate>
            <ScrollAnimate variant="fadeUp" delay={0.3}>
              <p className="text-[#1a1a1a] dark:text-neutral-300 text-sm sm:text-[15px] leading-relaxed mb-8 max-w-[240px] transition-colors">
                Discover everything<br />new and now.
              </p>
            </ScrollAnimate>
            <ScrollAnimate variant="fadeUp" delay={0.4}>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-[#111111] px-8 py-3.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-neutral-800 dark:hover:bg-[#ddd] transition-colors"
              >
                EXPLORE COLLECTION
              </Link>
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </section>
  );
}
