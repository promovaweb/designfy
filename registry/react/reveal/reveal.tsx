"use client";

/**
 * Reveal: brings its children into view once, when they enter the viewport.
 *
 * Uses motion/react for the entrance and for staggering direct children.
 * Under prefers-reduced-motion the content renders in its final state.
 * Without JavaScript the server markup is fully visible.
 *
 * Motion: opacity plus a 16 px translate (or scale, or a clip mask) in
 * 0.5 s with an ease-out curve, once; children stagger 60 ms.
 */
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";

type RevealEffect = "up" | "down" | "left" | "right" | "scale" | "fade" | "mask";

export interface RevealProps {
  children: ReactNode;
  /** Direction or kind of the entrance. Default "up". */
  effect?: RevealEffect;
  /** Delay before the entrance, in seconds. */
  delay?: number;
  /** Seconds between the entrance of each direct child wrapped in RevealItem. */
  stagger?: number;
  /** Fraction of the element that must be visible to start. Default 0.2. */
  amount?: number;
  /** HTML tag of the wrapper. Default "div". */
  as?: "div" | "section" | "ul" | "ol" | "li" | "header" | "footer" | "article";
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const HIDDEN: Record<RevealEffect, Record<string, string | number>> = {
  up: { opacity: 0, y: 16 },
  down: { opacity: 0, y: -16 },
  left: { opacity: 0, x: -24 },
  right: { opacity: 0, x: 24 },
  scale: { opacity: 0, scale: 0.96 },
  fade: { opacity: 0 },
  mask: { clipPath: "inset(100% 0 0 0)", y: 24 },
};

const SHOWN = { opacity: 1, x: 0, y: 0, scale: 1, clipPath: "inset(0% 0 0 0)" };

/** Wraps content that enters once on scroll. */
export function Reveal({ children, effect = "up", delay = 0, stagger, amount = 0.2, as = "div", className }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const variants: Variants = {
    hidden: stagger ? {} : HIDDEN[effect],
    shown: {
      ...(stagger ? {} : SHOWN),
      transition: { duration: 0.5, ease: EASE, delay, staggerChildren: stagger, delayChildren: stagger ? delay : undefined },
    },
  };
  return (
    <Tag className={className} initial="hidden" whileInView="shown" viewport={{ once: true, amount }} variants={variants}>
      {children}
    </Tag>
  );
}

export interface RevealItemProps {
  children: ReactNode;
  effect?: RevealEffect;
  as?: "div" | "li" | "article";
  className?: string;
}

/** A child of a staggered Reveal. It inherits the timing from its parent. */
export function RevealItem({ children, effect = "up", as = "div", className }: RevealItemProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Tag = motion[as];
  return (
    <Tag className={cn(className)} variants={{ hidden: HIDDEN[effect], shown: { ...SHOWN, transition: { duration: 0.5, ease: EASE } } }}>
      {children}
    </Tag>
  );
}
