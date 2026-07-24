"use client";

import { useRef, useEffect } from "react";
import { Truck, Package, BadgeCheck, Lock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: <Truck className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "FAST DELIVERY",
      description: "Quick & safe delivery",
    },
    {
      icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "EASY RETURNS",
      description: "Within 15 days",
    },
    {
      icon: <BadgeCheck className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "QUALITY ASSURED",
      description: "Best fashion, best quality",
    },
    {
      icon: <Lock className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "SECURE PAYMENT",
      description: "100% secure checkout",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return;

        const icon = item.querySelector("[data-feature-icon]");
        const text = item.querySelector("[data-feature-text]");

        // Icon — pop in with rotation
        if (icon) {
          gsap.fromTo(
            icon,
            { opacity: 0, scale: 0, rotation: -90 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.7,
              delay: i * 0.12,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Text — slide up
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.12 + 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
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
      className="w-full bg-[#111111] dark:bg-black py-12 sm:py-16 border-y border-neutral-800 dark:border-neutral-800 transition-colors"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="flex items-center gap-4 justify-start lg:justify-center"
            >
              <div
                data-feature-icon
                className="text-white dark:text-white"
                style={{ willChange: "transform, opacity" }}
              >
                {feature.icon}
              </div>
              <div data-feature-text className="flex flex-col" style={{ willChange: "transform, opacity" }}>
                <h3 className="text-[11px] sm:text-[12px] font-bold uppercase tracking-widest text-white dark:text-white mb-1 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-gray-400 dark:text-gray-400 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
