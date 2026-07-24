"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function VibeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Giant background text — parallax + scale on scroll
      gsap.fromTo(
        bgTextRef.current,
        { x: "10%", opacity: 0 },
        {
          x: "-5%",
          opacity: 10,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "bottom 10%",
            scrub: 1.5,
          },
        }
      );

      // Image — slide in from right with clip-path reveal
      gsap.fromTo(
        imageRef.current,
        {
          clipPath: "inset(0% 100% 0% 0%)",
          opacity: 0,
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Content text — staggered reveal
      const textElements = [
        labelRef.current,
        headingRef.current,
        descRef.current,
        ctaRef.current,
      ].filter(Boolean);

      gsap.fromTo(
        textElements,
        { opacity: 0, y: 40, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[400px] sm:h-[450px] lg:h-[550px] overflow-hidden bg-[#f5f0eb] dark:bg-[#111111] transition-colors"
    >
      {/* Background Image constrained to the right */}
      <div
        ref={imageRef}
        className="absolute inset-y-0 right-0 lg:right-[10%] w-full md:w-[50%] lg:w-[25%] z-[5]"
        style={{ willChange: "clip-path, opacity" }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/assets/vibe0.png"
            alt="New Vibes"
            fill
            className="object-cover object-left md:object-right"
            priority
          />
        </div>
      </div>

      {/* Giant Decorative Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <span
          ref={bgTextRef}
          className="text-[12rem] sm:text-[18rem] lg:text-[24rem] font-black uppercase tracking-tighter text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap select-none"
          style={{ willChange: "transform" }}
        >
          VIBES
        </span>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-sm sm:max-w-md">
            <p
              ref={labelRef}
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] mb-4 transition-colors"
              style={{ willChange: "transform, opacity, filter" }}
            >
              NEW SEASON
            </p>
            <h2
              ref={headingRef}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold uppercase tracking-tight text-[#1a1a1a] dark:text-white leading-[0.9] mb-6 transition-colors"
              style={{ willChange: "transform, opacity, filter" }}
            >
              NEW<br />VIBES
            </h2>
            <p
              ref={descRef}
              className="text-[#1a1a1a] dark:text-neutral-300 text-sm sm:text-[15px] leading-relaxed mb-8 max-w-[240px] transition-colors"
              style={{ willChange: "transform, opacity, filter" }}
            >
              Discover everything<br />new and now.
            </p>
            <Link
              ref={ctaRef}
              href="/shop"
              className="inline-flex items-center justify-center bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-[#111111] px-8 py-3.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-neutral-800 dark:hover:bg-[#ddd] transition-colors"
              style={{ willChange: "transform, opacity, filter" }}
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
