"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "fadeIn"
  | "scaleUp"
  | "blurIn"
  | "clipReveal"
  | "rotateIn";

interface ScrollAnimateProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
}

const getFromVars = (variant: AnimationVariant): gsap.TweenVars => {
  switch (variant) {
    case "fadeUp":
      return { opacity: 0, y: 60, filter: "blur(4px)" };
    case "fadeDown":
      return { opacity: 0, y: -60, filter: "blur(4px)" };
    case "fadeLeft":
      return { opacity: 0, x: -80 };
    case "fadeRight":
      return { opacity: 0, x: 80 };
    case "fadeIn":
      return { opacity: 0 };
    case "scaleUp":
      return { opacity: 0, scale: 0.88, y: 30 };
    case "blurIn":
      return { opacity: 0, filter: "blur(16px)", y: 20 };
    case "clipReveal":
      return { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" };
    case "rotateIn":
      return { opacity: 0, rotateX: 15, y: 40, transformPerspective: 800 };
    default:
      return { opacity: 0, y: 60 };
  }
};

const getToVars = (variant: AnimationVariant): gsap.TweenVars => {
  switch (variant) {
    case "fadeUp":
    case "fadeDown":
      return { opacity: 1, y: 0, filter: "blur(0px)" };
    case "fadeLeft":
    case "fadeRight":
      return { opacity: 1, x: 0 };
    case "fadeIn":
      return { opacity: 1 };
    case "scaleUp":
      return { opacity: 1, scale: 1, y: 0 };
    case "blurIn":
      return { opacity: 1, filter: "blur(0px)", y: 0 };
    case "clipReveal":
      return { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" };
    case "rotateIn":
      return { opacity: 1, rotateX: 0, y: 0, transformPerspective: 800 };
    default:
      return { opacity: 1, y: 0 };
  }
};

export function ScrollAnimate({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.9,
  className,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, getFromVars(variant));

    const tween = gsap.to(el, {
      ...getToVars(variant),
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [variant, delay, duration]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}

// Stagger container for animating children one by one
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.12,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>("[data-stagger-item]");
    if (items.length === 0) return;

    gsap.set(items, { opacity: 0, y: 50, filter: "blur(3px)" });

    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.8,
      stagger: staggerDelay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "top 15%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <div data-stagger-item className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
