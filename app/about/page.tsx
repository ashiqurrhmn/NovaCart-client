import { Metadata } from "next";
import Image from "next/image";
import { Sparkles, Leaf, Shield, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | NovaCart",
  description: "Learn more about NovaCart and our mission to redefine modern commerce.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-[#111111] text-[#1a1a1a] dark:text-[#f0f0f0]">
      {/* Combined Hero & Story Section */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute right-13 top-0 bottom-100 pointer-events-none opacity-[0.04] dark:opacity-[0.02] flex items-center translate-x-12 md:translate-x-20">
           <h1 className="text-[120px] sm:text-[180px] md:text-[250px] lg:text-[300px] font-black uppercase tracking-tighter leading-none select-none" style={{ writingMode: 'vertical-rl' }}>
             NOVA
           </h1>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-28 pb-16 md:pt-32 md:pb-20 lg:pt-36 lg:pb-24 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <p className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-neutral-500">
              Est. 2026 • Global Reach
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Redefining <br/> Modern Commerce
            </h1>
            <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium mt-6">
              NovaCart is a premium destination for curated lifestyle products. We blend aesthetic design with seamless functionality to bring you an unparalleled shopping experience.
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-200 dark:bg-[#1a1a1a] group">
          <Image 
            src="/assets/browse-img.jpg" 
            alt="Our Story" 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/0" />
        </div>
        
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Our Story</h2>
          <div className="space-y-6 text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
            <p>
              Born from a vision to simplify digital commerce without compromising on elegance. NovaCart started as a passion project and evolved into a platform that connects global creators with discerning consumers.
            </p>
            <p>
              We believe that every product tells a story, and every purchase is a vote for the kind of world you want to live in. That's why we meticulously curate our collection, ensuring the highest standards of quality, aesthetics, and design.
            </p>
          </div>
          
          <div className="pt-8 border-t border-neutral-300 dark:border-neutral-800 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-4xl font-black mb-2">50K+</h3>
              <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-500">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-4xl font-black mb-2">120+</h3>
              <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-500">Global Brands</p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white dark:bg-[#151515] py-24 lg:py-32 rounded-t-[3rem] lg:rounded-t-[5rem]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Core Values</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium">The principles that guide everything we build and curate.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {[
              {
                icon: Sparkles,
                title: "Quality First",
                desc: "We never compromise on the quality of our products and services."
              },
              {
                icon: Leaf,
                title: "Sustainable",
                desc: "Committed to eco-friendly practices and sustainable sourcing."
              },
              {
                icon: Shield,
                title: "Secure",
                desc: "Your data and transactions are protected by industry-leading security."
              },
              {
                icon: Globe,
                title: "Accessible",
                desc: "Designed to be inclusive and easy to use for everyone, everywhere."
              }
            ].map((value, idx) => (
              <div key={idx} className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-4 sm:space-y-5 group">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#f5f0eb] dark:bg-[#111111] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-neutral-200 dark:border-neutral-800">
                  <value.icon className="w-8 h-8 text-[#1a1a1a] dark:text-[#f0f0f0]" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wide mb-2">{value.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium text-sm sm:text-base">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
