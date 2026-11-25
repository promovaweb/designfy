"use client";

/**
 * Counter: Displays the final number in markup and animates a presentation-only value when visible.
 * Motion: An ease-out counter plays once in view. Changes can roll digits or count down.
 * Catalog: counter
 */
import { cn } from "@designfy/components/lib/cn";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export interface CounterProps {
  /** Final value. */
  value: number;
  /** Initial value for the animation. */
  from?: number;
  /** Text before the number. */
  prefix?: string;
  /** Text after the number. */
  suffix?: string;
  /** Separate metric label. */
  label?: string;
  /** BCP 47 locale used when formatting the value. */
  locale?: string;
  /** Animation duration in milliseconds, bounded to 600–1200. */
  duration?: number;
  /** Count once in view, roll changed digits, or count down from the starting value. */
  variant?: "once" | "roll" | "countdown";
  /** Politely announce changes to the final number. */
  live?: boolean;
  /** Additional classes on the root element. */
  className?: string;
}

function bindCounter(root: HTMLElement) {
  const number = root.querySelector<HTMLElement>("[data-counter-number]");
  if (!number) return;
  const target = Number(root.dataset.value);
  const startValue = Number(root.dataset.from);
  const duration = Math.min(
    1200,
    Math.max(600, Number(root.dataset.duration) || 900),
  );
  const format = new Intl.NumberFormat(root.lang, {
    maximumFractionDigits: 12,
  });
  const final = format.format(target);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (
    reduced.matches ||
    !Number.isFinite(target) ||
    !Number.isFinite(startValue)
  ) {
    root.dataset.state = "done";
    return;
  }

  let frame = 0;
  function enter() {
    if (root.dataset.variant === "roll") {
      const previous = root.dataset.previous;
      root.dataset.previous = final;
      root.dataset.state = "done";
      if (previous === undefined || previous === final || !number) return;
      const changed = Array.from(final, (char, index) => {
        const digit = document.createElement("span");
        digit.textContent = char;
        digit.className = "inline-block";
        if (
          /\d/.test(char) &&
          char !== previous[previous.length - final.length + index]
        ) {
          digit.classList.add("animate-df-fade-up");
        }
        return digit;
      });
      number.replaceChildren(...changed);
      return;
    }
    const initial =
      root.dataset.variant === "countdown"
        ? Math.max(target, startValue)
        : startValue;
    const started = performance.now();
    root.dataset.state = "counting";
    function tick(now: number) {
      if (!number) return;
      const elapsed = reduced.matches
        ? 1
        : Math.min(1, (now - started) / duration);
      const progress = 1 - (1 - elapsed) ** 4;
      number.textContent =
        elapsed === 1
          ? final
          : format.format(initial + (target - initial) * progress);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
      else root.dataset.state = "done";
    }
    frame = requestAnimationFrame(tick);
  }

  const observer =
    root.dataset.variant !== "roll" && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          enter();
          observer?.disconnect();
        })
      : undefined;
  if (observer) observer.observe(root);
  else enter();
  return () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
  };
}

/** Displays the final number in markup and animates a presentation-only value when visible. */
export function Counter({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  label,
  locale = "en",
  duration = 900,
  variant = "once",
  live = false,
  className,
}: CounterProps) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const formatted = Number.isFinite(value)
    ? value.toLocaleString(locale, { maximumFractionDigits: 12 })
    : String(value);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (reduced) {
      element.dataset.state = "done";
      element.dataset.previous = formatted;
      const number = element.querySelector("[data-counter-number]");
      if (number) number.textContent = formatted;
      return;
    }
    return bindCounter(element);
  }, [value, from, locale, duration, variant, formatted, reduced]);
  return (
    <span
      ref={root}
      data-site-counter
      data-state="idle"
      data-value={value}
      data-from={from}
      data-duration={duration}
      data-variant={variant}
      lang={locale}
      className={cn(
        "inline-flex max-w-full flex-col font-heading tabular-nums",
        className,
      )}
    >
      <span className="sr-only" aria-live={live ? "polite" : undefined}>
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span aria-hidden="true" className="inline-grid">
        <span className="invisible col-start-1 row-start-1">
          {prefix}
          {formatted}
          {suffix}
        </span>
        <span className="col-start-1 row-start-1">
          {prefix}
          <span data-counter-number>{formatted}</span>
          {suffix}
        </span>
      </span>
      {label && (
        <span className="mt-2 font-sans text-sm text-muted-foreground">
          {label}
        </span>
      )}
    </span>
  );
}
