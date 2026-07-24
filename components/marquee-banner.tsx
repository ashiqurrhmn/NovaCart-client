"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export function MarqueeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const marqueeTexts = [
    "NOVA CART",
    "AI POWERED",
    "NEW ARRIVALS",
    "AI GENERATED",
    "FREE SHIPPING",
    "SUMMER SALE",
  ];

  const repetitions = [...marqueeTexts, ...marqueeTexts];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Get the first half of the track for seamless loop
    const firstSet = track.querySelector<HTMLElement>("[data-set='1']");
    if (!firstSet) return;
    const distance = firstSet.offsetWidth;

    const tween = gsap.to(track, {
      x: -distance,
      duration: 22,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % distance),
      },
    });

    // Smooth speed change on hover
    const container = containerRef.current;
    const handleEnter = () => gsap.to(tween, { timeScale: 0.3, duration: 0.6, ease: "power2.out" });
    const handleLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.6, ease: "power2.out" });

    container?.addEventListener("mouseenter", handleEnter);
    container?.addEventListener("mouseleave", handleLeave);

    return () => {
      tween.kill();
      container?.removeEventListener("mouseenter", handleEnter);
      container?.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const renderItems = (prefix: string) =>
    repetitions.map((text, i) => (
      <div key={`${prefix}-${i}`} className="flex items-center">
        <span className="text-white text-sm sm:text-base font-bold tracking-[0.2em] uppercase mx-4 sm:mx-6">
          {text}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-2 sm:mx-4 shrink-0"
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    ));

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden bg-[#111111] dark:bg-black py-3 sm:py-4 flex relative select-none cursor-pointer"
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <div data-set="1" className="flex items-center">
          {renderItems("set1")}
        </div>
        <div data-set="2" className="flex items-center">
          {renderItems("set2")}
        </div>
      </div>
    </div>
  );
}
