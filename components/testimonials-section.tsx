"use client";

import { useRef, useEffect } from "react";
import { Star, BadgeCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah J.",
      title: "Fashion Enthusiast",
      text: "The quality of the winter collection is absolutely unmatched. The fabrics feel so premium and the fit is perfect. NovaCart has become my go-to for seasonal wardrobe updates.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael T.",
      title: "Verified Buyer",
      text: "I was looking for something versatile and stylish, and the new arrivals exceeded my expectations. Super fast shipping and excellent customer service. Highly recommended!",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily R.",
      title: "Style Blogger",
      text: "Obsessed with the aesthetics and the attention to detail. Every piece I ordered looks exactly like the photos, if not better. It's rare to find such consistent quality.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards — 3D flip-in with stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            rotateX: 10,
            scale: 0.9,
            transformPerspective: 1000,
            transformOrigin: "center bottom",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.9,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Subtle lift on hover
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -6,
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            duration: 0.35,
            ease: "power2.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            boxShadow: "0 0px 0px rgba(0,0,0,0)",
            duration: 0.35,
            ease: "power2.out",
          });
        });

        // Animate stars inside card
        const stars = card.querySelectorAll("[data-star]");
        gsap.fromTo(
          stars,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#f5f0eb] dark:bg-[#111111] py-20 transition-colors border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div
          ref={headerRef}
          className="flex flex-col items-center mb-16 text-center"
          style={{ willChange: "transform, opacity, filter" }}
        >
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-3">
            Social Proof
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-black dark:text-white leading-[1.1]">
            What Our<br className="sm:hidden" /> Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-white dark:bg-[#151515] p-8 lg:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 transition-colors flex flex-col h-full"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    data-star
                    className="w-4 h-4 fill-black text-black dark:fill-white dark:text-white"
                  />
                ))}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-[14px] sm:text-[15px] leading-relaxed mb-8 italic flex-1">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <h4 className="text-[13px] font-bold text-black dark:text-white uppercase tracking-wider mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] text-neutral-500 tracking-widest uppercase">
                    {testimonial.title}
                  </p>
                </div>
                <BadgeCheck
                  className="w-5 h-5 text-black dark:text-white opacity-40"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
