"use client";

import { useState, useRef, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  description?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  rating?: { rate: number; count: number };
}

interface CollectionSectionProps {
  products: Product[];
}

const TABS = [
  "All Product",
  "Men's Clothing",
  "Women's Clothing",
  "Kids' Clothing",
];

export function CollectionSection({ products }: CollectionSectionProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter products by category
  const filteredProducts = products.filter((p) => {
    const cat = p.category?.toLowerCase() || "";
    const tabName = activeTab.toLowerCase();
    if (tabName === "all product") return true;
    return cat === tabName;
  });

  // Show up to 8 products in the horizontal strip
  const displayProducts = filteredProducts.slice(0, 8);

  // Header / tabs entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -60, filter: "blur(5px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        descRef.current,
        { opacity: 0, x: 60, filter: "blur(5px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: descRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const tabs = tabsRef.current?.querySelectorAll("button");
      if (tabs) {
        gsap.fromTo(
          tabs,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tabsRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Horizontal scroll-driven slide for the card track
  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    // Wait a frame for layout to settle
    const rafId = requestAnimationFrame(() => {
      const trackWidth = track.scrollWidth;
      const wrapperWidth = wrapper.offsetWidth;
      const distance = trackWidth - wrapperWidth;

      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
        },
      });

      // Store for cleanup
      (wrapper as HTMLDivElement & { _st?: ScrollTrigger })._st =
        tween.scrollTrigger!;
    });

    return () => {
      cancelAnimationFrame(rafId);
      const st = (wrapper as HTMLDivElement & { _st?: ScrollTrigger })._st;
      if (st) st.kill();
    };
  }, [activeTab, displayProducts.length]);

  // Staggered card entrance
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll<HTMLElement>("[data-product-card]");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, x: 100, scale: 0.92, filter: "blur(4px)" },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: track,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      },
    );
  }, [activeTab, displayProducts.length]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#f5f0eb] dark:bg-[#111111] py-16 transition-colors"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div
            ref={headerRef}
            style={{ willChange: "transform, opacity, filter" }}
          >
            <h2 className="text-4xl md:text-[3.5rem] font-black uppercase tracking-tight text-[#1a1a1a] dark:text-white leading-[0.9]">
              OUR COLLECTION
            </h2>
          </div>
          <div
            ref={descRef}
            style={{ willChange: "transform, opacity, filter" }}
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm max-w-lg lg:text-right leading-relaxed">
              Step into the world of Reflect, where each collection tells its
              own story. From minimalist essentials to bold statement pieces,
              our curated collections are designed to suit every occasion and
              style.
            </p>
          </div>
        </div>

        {/* Tabs Area */}
        <div ref={tabsRef} className="flex flex-wrap gap-3 md:gap-4 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-medium border transition-colors ${
                activeTab === tab
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a] dark:bg-white dark:text-[#111111] dark:border-white"
                  : "bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-500 dark:text-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Horizontal card strip */}
        {displayProducts.length > 0 ? (
          <div ref={wrapperRef} className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-6"
              style={{ willChange: "transform" }}
            >
              {displayProducts.map((product) => (
                <div
                  key={product._id}
                  data-product-card
                  className="w-[280px] sm:w-[300px] lg:w-[320px] shrink-0"
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-500">
            No products found for this category.
          </div>
        )}
      </div>
    </section>
  );
}
