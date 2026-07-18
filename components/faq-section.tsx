"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "@/components/scroll-animate";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the US. International shipping can take 7-14 business days depending on the destination. You will receive a tracking number once your order ships.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a hassle-free 30-day return policy. If you're not completely satisfied with your purchase, you can return unworn and unwashed items with tags still attached for a full refund or exchange.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 100 countries worldwide! Shipping costs and delivery times vary by location and will be calculated at checkout.",
    },
    {
      question: "How do I know what size to order?",
      answer: "You can find our detailed sizing guide on every product page. We provide exact measurements and fit recommendations (e.g., 'runs small', 'true to size') to help you make the best choice.",
    },
  ];

  return (
    <section className="w-full bg-black py-20 transition-colors border-y border-neutral-900">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <ScrollAnimate variant="fadeUp">
          <div className="flex flex-col items-center mb-12 text-center">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-3">
              Got Questions?
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.1]">
              Frequently Asked<br className="sm:hidden" /> Questions
            </h2>
          </div>
        </ScrollAnimate>

        <StaggerContainer className="flex flex-col gap-4" staggerDelay={0.08}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <StaggerItem key={index}>
                <div 
                  className={`border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#111111]' : 'bg-transparent hover:bg-[#0a0a0a]'}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide pr-8">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0 text-white">
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
                  >
                    <p className="text-[13px] sm:text-sm text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
