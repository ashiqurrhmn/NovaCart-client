"use client";

import { Star, BadgeCheck } from "lucide-react";
import { ScrollAnimate, StaggerContainer, StaggerItem } from "@/components/scroll-animate";

export function TestimonialsSection() {
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

  return (
    <section className="w-full bg-[#f5f0eb] dark:bg-[#111111] py-20 transition-colors border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <ScrollAnimate variant="fadeUp">
          <div className="flex flex-col items-center mb-16 text-center">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-3">
              Social Proof
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-black dark:text-white leading-[1.1]">
              What Our<br className="sm:hidden" /> Customers Say
            </h2>
          </div>
        </ScrollAnimate>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10" staggerDelay={0.12}>
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id} variant="scaleUp">
              <div 
                className="bg-white dark:bg-[#151515] p-8 lg:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black dark:fill-white dark:text-white" />
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
                  <BadgeCheck className="w-5 h-5 text-black dark:text-white opacity-40" strokeWidth={1.5} />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
