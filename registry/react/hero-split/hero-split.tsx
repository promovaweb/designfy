"use client";

/**
 * HeroSplit: opens a page with the promise on one side and proof of the
 * product on the other.
 *
 * Left: product name, headline, one sentence and up to two actions.
 * Right: a framed visual with real content (screenshot, panel, demo),
 * passed as `visual`. On phones the text comes first and the visual below.
 * Headline, sentence and primary action fit in 1280 x 800.
 *
 * Motion: the text enters in a short stagger; the visual fades and rises;
 * the primary action presses on tap. Under reduced motion everything is in
 * place from the first paint.
 */
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroSplitProps {
  /** Product or page name, shown above the headline in the body face. */
  name?: string;
  /** The h1 of the page. Seven words or fewer reads best. */
  headline: ReactNode;
  /** One sentence: what it is, for whom, the difference. */
  lead: ReactNode;
  /** The primary action. */
  primaryAction: HeroAction;
  /** A quieter second action. */
  secondaryAction?: HeroAction;
  /** Real content for the right side: screenshot, panel, demo. */
  visual: ReactNode;
  /** Side of the visual on wide screens. Default "end". */
  visualSide?: "start" | "end";
  /** Decorative layer behind the hero (a Background component). */
  background?: ReactNode;
  /** Short facts under the actions, each a real statement. */
  notes?: string[];
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Split hero for product, portal and tool pages. */
export function HeroSplit({
  name,
  headline,
  lead,
  primaryAction,
  secondaryAction,
  visual,
  visualSide = "end",
  background,
  notes,
  className,
}: HeroSplitProps) {
  const reduced = useReducedMotion();
  const item: Variants | undefined = reduced
    ? undefined
    : { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
  return (
    <section className={cn("relative isolate overflow-clip", className)}>
      {background ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {background}
        </div>
      ) : null}
      <div className="df-container grid items-center gap-10 py-14 md:py-20 lg:min-h-[min(44rem,calc(100svh-var(--header-height)))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <motion.div
          className={cn("flex flex-col items-start gap-6", visualSide === "start" && "lg:order-2")}
          initial={reduced ? false : "hidden"}
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: 0.08 } } }}
        >
          {name ? (
            <motion.p variants={item} className="text-sm font-medium text-muted-foreground">
              {name}
            </motion.p>
          ) : null}
          <motion.h1 variants={item} className="max-w-[16ch] font-heading text-display font-semibold text-foreground">
            {headline}
          </motion.h1>
          <motion.p variants={item} className="max-w-[52ch] text-lead text-muted-foreground">
            {lead}
          </motion.p>
          <motion.div variants={item} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href={primaryAction.href}
              className="df-press inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold whitespace-nowrap text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {primaryAction.label}
            </a>
            {secondaryAction ? (
              <a
                href={secondaryAction.href}
                className="df-press inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-base font-medium whitespace-nowrap text-foreground hover:bg-muted"
              >
                {secondaryAction.label}
              </a>
            ) : null}
          </motion.div>
          {notes?.length ? (
            <motion.ul variants={item} className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-6">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </motion.ul>
          ) : null}
        </motion.div>
        <motion.div
          className="relative min-w-0"
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-foreground/5">{visual}</div>
        </motion.div>
      </div>
    </section>
  );
}
