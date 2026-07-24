"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const answersRef = useRef<(HTMLDivElement | null)[]>([]);

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 3-5 business days within the US. International shipping can take 7-14 business days depending on the destination. You will receive a tracking number once your order ships.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a hassle-free 30-day return policy. If you're not completely satisfied with your purchase, you can return unworn and unwashed items with tags still attached for a full refund or exchange.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 100 countries worldwide! Shipping costs and delivery times vary by location and will be calculated at checkout.",
    },
    {
      question: "How do I know what size to order?",
      answer:
        "You can find our detailed sizing guide on every product page. We provide exact measurements and fit recommendations (e.g., 'runs small', 'true to size') to help you make the best choice.",
    },
  ];

  // Animate answer open/close with GSAP
  const animateAnswer = useCallback(
    (index: number, isOpening: boolean) => {
      const answer = answersRef.current[index];
      if (!answer) return;

      if (isOpening) {
        gsap.set(answer, { height: "auto", opacity: 1 });
        const height = answer.offsetHeight;
        gsap.fromTo(
          answer,
          { height: 0, opacity: 0 },
          { height, opacity: 1, duration: 0.45, ease: "power3.out" }
        );
      } else {
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power3.inOut",
        });
      }
    },
    []
  );

  const handleToggle = useCallback(
    (index: number) => {
      if (openIndex === index) {
        animateAnswer(index, false);
        setOpenIndex(null);
      } else {
        if (openIndex !== null) {
          animateAnswer(openIndex, false);
        }
        animateAnswer(index, true);
        setOpenIndex(index);
      }
    },
    [openIndex, animateAnswer]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
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

      // FAQ items staggered entrance
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40, filter: "blur(3px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Set initial state of first FAQ answer
  useEffect(() => {
    answersRef.current.forEach((answer, i) => {
      if (!answer) return;
      if (i === 0) {
        gsap.set(answer, { height: "auto", opacity: 1 });
      } else {
        gsap.set(answer, { height: 0, opacity: 0 });
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black py-20 transition-colors border-y border-neutral-900"
    >
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <div ref={headerRef} className="flex flex-col items-center mb-12 text-center" style={{ willChange: "transform, opacity, filter" }}>
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-3">
            Got Questions?
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.1]">
            Frequently Asked<br className="sm:hidden" /> Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                ref={(el) => { itemsRef.current[index] = el; }}
                className={`border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen ? "bg-[#111111]" : "bg-transparent hover:bg-[#0a0a0a]"
                }`}
                style={{ willChange: "transform, opacity" }}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide pr-8">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 text-white">
                    {isOpen ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                </button>
                <div
                  ref={(el) => { answersRef.current[index] = el; }}
                  className="px-6 overflow-hidden"
                >
                  <p className="text-[13px] sm:text-sm text-gray-400 leading-relaxed pb-6">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
