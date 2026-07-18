"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const heroVariants = {
  text: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  image: {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1 },
  },
  brandText: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  button: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };

export function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-56px)] min-h-[480px] max-h-[550px] sm:max-h-[720px] overflow-hidden bg-[#f5f0eb] dark:bg-[#111111] mt-13 flex items-end">
      {/* Giant background brand text */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={heroVariants.brandText}
        transition={{ ...transition, duration: 1 }}
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden mt-[8vh] sm:mt-[12vh]"
      >
        <h1 className="text-[13vw] sm:text-[14vw] font-black uppercase leading-[0.85] tracking-[-0.03em] text-[#1a1a1a] dark:text-[#f0f0f0] select-none whitespace-nowrap">
          NOVACART
        </h1>
      </motion.div>

      {/* Hero model image — in front of text */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={heroVariants.image}
        transition={{ ...transition, duration: 1, delay: 0.2 }}
        className="absolute inset-0 z-[2] flex items-end justify-center pointer-events-none"
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
      </motion.div>

      {/* Content overlay */}
      <div className="relative z-[3] w-full max-w-[1440px] mx-auto px-6 lg:px-10 pb-6 sm:pb-12 h-full flex flex-col justify-between pointer-events-none">
        {/* Top section: tagline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={heroVariants.text}
          transition={{ ...transition, delay: 0.3 }}
          className="pt-6 sm:pt-10 pointer-events-auto"
        >
          <p className="text-[10px] sm:text-[12px] font-medium tracking-[0.18em] uppercase leading-[2] text-[#1a1a1a] dark:text-[#e0e0e0] max-w-[100px]">
            Fashion
            <br />
            That Moves
            <br />
            With You.
          </p>
        </motion.div>

        {/* Bottom section */}
        <div className="flex items-end justify-between">
          {/* Bottom-left: CTA buttons */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={heroVariants.button}
            transition={{ ...transition, delay: 0.4 }}
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
          </motion.div>

          {/* Bottom-right: vertical text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={heroVariants.text}
            transition={{ ...transition, delay: 0.5 }}
            className="hidden sm:flex flex-col items-end pointer-events-auto"
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] leading-[2.2] text-right">
              New
              <br />
              Collection
              <br />
              2026
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
