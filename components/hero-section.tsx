"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sideTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      // 1. Brand text — dramatic scale + clip reveal
      tl.fromTo(
        brandRef.current,
        {
          opacity: 0,
          scale: 1.3,
          filter: "blur(12px)",
          clipPath: "inset(50% 0% 50% 0%)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.out",
        },
        0
      );

      // 2. Hero image — slide up from bottom with parallax feel
      tl.fromTo(
        imageRef.current,
        {
          opacity: 0,
          y: 120,
          scale: 1.08,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.3,
          ease: "power3.out",
        },
        0.25
      );

      // 3. Tagline — fade and slide
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 30, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
        },
        0.5
      );

      // 4. CTA buttons — stagger slide up
      const ctaButtons = ctaRef.current?.querySelectorAll("a");
      if (ctaButtons) {
        tl.fromTo(
          ctaButtons,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
          },
          0.65
        );
      }

      // 5. Side text — slide in from right
      tl.fromTo(
        sideTextRef.current,
        { opacity: 0, x: 40, filter: "blur(4px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.8,
        },
        0.7
      );

      // Parallax on scroll — brand text moves slower, image moves out
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (brandRef.current) {
            gsap.set(brandRef.current, {
              y: progress * -60,
              scale: 1 + progress * 0.1,
              opacity: 1 - progress * 0.6,
            });
          }
          if (imageRef.current) {
            gsap.set(imageRef.current, {
              y: progress * 40,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[calc(100vh-56px)] min-h-[480px] max-h-[550px] sm:max-h-[720px] overflow-hidden bg-[#f5f0eb] dark:bg-[#111111] mt-13 flex items-end"
    >
      {/* Giant background brand text */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden mt-[8vh] sm:mt-[12vh]">
        <h1
          ref={brandRef}
          className="text-[13vw] sm:text-[14vw] font-black uppercase leading-[0.85] tracking-[-0.03em] text-[#1a1a1a] dark:text-[#f0f0f0] select-none whitespace-nowrap"
          style={{ willChange: "transform, opacity, filter" }}
        >
          NOVACART
        </h1>
      </div>

      {/* Hero model image — in front of text */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-[2] flex items-end justify-center pointer-events-none"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="relative w-[75%] sm:w-[50%] md:w-[45%] lg:w-[35%] h-[95%] sm:h-full max-w-[550px]">
          <Image
            src="/assets/hero-1.png"
            alt="Fashion model"
            fill
            sizes="(max-width: 640px) 75vw, (max-width: 768px) 50vw, (max-width: 1024px) 45vw, 35vw"
            className="object-contain object-bottom drop-shadow-[0_5px_10px_rgba(90,60,30,0.4)] dark:drop-shadow-[0_5px_12px_rgba(150,160,180,0.35)]"
            priority
          />
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-[3] w-full max-w-[1440px] mx-auto px-6 lg:px-10 pb-6 sm:pb-12 h-full flex flex-col justify-between pointer-events-none">
        {/* Top section: tagline */}
        <div ref={taglineRef} className="pt-6 sm:pt-10 pointer-events-auto" style={{ willChange: "transform, opacity, filter" }}>
          <p className="text-[10px] sm:text-[12px] font-medium tracking-[0.18em] uppercase leading-[2] text-[#1a1a1a] dark:text-[#e0e0e0] max-w-[100px]">
            Fashion
            <br />
            That Moves
            <br />
            With You.
          </p>
        </div>

        {/* Bottom section */}
        <div className="flex items-end justify-between">
          {/* Bottom-left: CTA buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pointer-events-auto w-full sm:w-auto"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-4 sm:px-7 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-[#111111] text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-[#333] dark:hover:bg-[#ddd] transition-colors w-full sm:w-auto"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?section=New%20Arrival"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-4 sm:px-7 border border-[#1a1a1a] dark:border-[#e0e0e0] text-[#1a1a1a] dark:text-[#e0e0e0] text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-[#e0e0e0] dark:hover:text-[#111111] transition-colors w-full sm:w-auto"
            >
              Explore New In
            </Link>
          </div>

          {/* Bottom-right: vertical text */}
          <div
            ref={sideTextRef}
            className="hidden sm:flex flex-col items-end pointer-events-auto"
            style={{ willChange: "transform, opacity, filter" }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] leading-[2.2] text-right">
              New
              <br />
              Collection
              <br />
              2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
