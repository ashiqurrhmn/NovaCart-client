"use client";

import { ReactNode } from "react";
import { ScrollAnimate } from "@/components/scroll-animate";

type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleUp";

interface AnimatedSection {
  component: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
}

export function HomeAnimatedSections({ sections }: { sections: AnimatedSection[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <ScrollAnimate
          key={index}
          variant={section.variant || "fadeUp"}
          delay={section.delay || 0}
        >
          {section.component}
        </ScrollAnimate>
      ))}
    </>
  );
}
