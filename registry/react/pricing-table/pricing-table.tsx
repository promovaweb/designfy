"use client";

/**
 * PricingTable: Compares plan cards with a billing period switch and an optional comparison below.
 * Slots or React nodes: comparison.
 * Motion: The displayed price rolls into position when the billing period changes.
 * Catalog: pricing-table
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type Action = { label: string; href: string };
type Plan = {
  name: string;
  description?: string;
  monthly: string;
  yearly: string;
  features: Array<{ label: string; included: boolean }>;
  action: Action;
  recommended?: boolean;
};

type SingleOffer = {
  label: string;
  currency: string;
  price: string;
  period: string;
  installment?: string;
  action: Action;
  finePrint?: string;
  included: string[];
};

type PricingMode =
  | { variant: "single"; offer: SingleOffer; plans?: never; id?: string }
  | { variant?: "plans"; offer?: never; plans: Plan[]; id: string };

export type PricingTableProps = PricingMode & {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Label for the monthly period. */
  monthlyLabel?: string;
  /** Label for the yearly period. */
  yearlyLabel?: string;
  /** Accessible name of the billing group. */
  billingLabel?: string;
  /** Text next to included features. */
  includedLabel?: string;
  /** Text next to excluded features. */
  excludedLabel?: string;
  /** Text identifying the highlighted plan. */
  recommendedLabel?: string;
  /** Optional comparison table. */
  comparison?: ReactNode;
  /** Initially selected billing period. */
  initialPeriod?: "monthly" | "yearly";
  /** Additional classes on the root element. */
  className?: string;
};

function bindPricingTable(root: HTMLElement) {
  const abort = new AbortController();
  const switcher = root.querySelector<HTMLFieldSetElement>("fieldset");
  if (!switcher) return;
  switcher.hidden = false;
  switcher.addEventListener(
    "change",
    (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) return;
      root.dataset.period = input.value;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      for (const price of root.querySelectorAll<HTMLElement>("[data-price]")) {
        price.hidden = price.dataset.price !== input.value;
        if (!price.hidden && !reduced) {
          price.getAnimations().forEach((animation) => animation.cancel());
          price.animate(
            [
              { transform: "translateY(0.4em)", opacity: 0 },
              { transform: "translateY(0)", opacity: 1 },
            ],
            { duration: 250, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
          );
        }
      }
    },
    { signal: abort.signal },
  );
  return () => abort.abort();
}

/** Compares plan cards with a billing period switch and an optional comparison below. */
export function PricingTable({
  title,
  lead,
  headingLevel = 2,
  id,
  plans = [],
  variant,
  offer,
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  billingLabel = "Billing period",
  includedLabel = "Included",
  excludedLabel = "Not included",
  recommendedLabel = "Recommended",
  comparison,
  initialPeriod = "monthly",
  className,
}: PricingTableProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindPricingTable(root.current);
  }, [initialPeriod, variant]);
  const Heading = `h${headingLevel}` as "h2";
  const ItemHeading = `h${Math.min(6, headingLevel + 1)}` as "h3";
  const entries = [...plans].sort(
    (current, next) =>
      Number(Boolean(next.recommended)) - Number(Boolean(current.recommended)),
  );
  return (
    <section
      ref={root}
      data-site-pricing-table
      data-period={initialPeriod}
      className={cn("df-section", className)}
    >
      <div className="df-container">
        <header data-df-reveal="up" className="mb-10 md:mb-14">
          <Heading className="font-heading text-headline font-semibold">
            {title}
          </Heading>
          {lead && (
            <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
              {lead}
            </p>
          )}
        </header>
        {variant === "single" && offer ? (
          <article
            data-df-reveal="up"
            className="@container rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-10"
          >
            <div className="grid gap-6 @2xl:grid-cols-2">
              <div className="grid justify-items-start gap-4">
                <ItemHeading className="text-title font-semibold">
                  {offer.label}
                </ItemHeading>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span>{offer.currency}</span>
                  <strong className="font-heading text-headline tabular-nums">
                    {offer.price}
                  </strong>
                  <span>{offer.period}</span>
                </p>
                {offer.installment && (
                  <p className="text-muted-foreground">{offer.installment}</p>
                )}
                <a
                  href={offer.action.href}
                  className="df-press inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {offer.action.label}
                </a>
                {offer.finePrint && (
                  <p className="text-sm text-muted-foreground">
                    {offer.finePrint}
                  </p>
                )}
              </div>
              <ul
                role="list"
                aria-label={includedLabel}
                className="grid content-center gap-3 border-t border-border pt-6 @2xl:border-s @2xl:border-t-0 @2xl:ps-8 @2xl:pt-0"
              >
                {offer.included.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="text-primary">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ) : (
          <>
            <fieldset hidden className="mb-8 min-w-0">
              <legend className="sr-only">{billingLabel}</legend>
              <div className="inline-flex max-w-full flex-wrap rounded-xl border border-border bg-muted p-1">
                {(["monthly", "yearly"] as const).map((period) => (
                  <label
                    key={period}
                    className="df-press relative flex min-h-11 cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
                  >
                    <input
                      type="radio"
                      name={id + "-billing"}
                      value={period}
                      defaultChecked={initialPeriod === period}
                      className="sr-only"
                    />
                    {period === "monthly" ? monthlyLabel : yearlyLabel}
                  </label>
                ))}
              </div>
            </fieldset>
            <ul
              data-df-stagger
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))]"
            >
              {entries.map((plan) => (
                <li
                  key={plan.name}
                  data-df-reveal="up"
                  className={cn(
                    "group relative flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground",
                    plan.recommended && "border-primary/65 bg-primary/5",
                  )}
                >
                  {plan.recommended && (
                    <span
                      aria-hidden="true"
                      data-df-loop
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-primary/0 via-primary/65 to-primary/0 bg-size-[200%_100%] motion-safe:animate-df-pan group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
                    />
                  )}
                  <ItemHeading className="text-title font-semibold">
                    {plan.name}
                  </ItemHeading>
                  {plan.recommended && (
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {recommendedLabel}
                    </p>
                  )}
                  <div
                    aria-live="polite"
                    className="mt-6 min-w-0 overflow-hidden py-1"
                  >
                    {(["monthly", "yearly"] as const).map((period) => (
                      <div
                        key={period}
                        data-price={period}
                        hidden={initialPeriod !== period}
                        className="min-w-0 break-words [&[hidden]]:hidden!"
                      >
                        <span className="font-heading text-headline font-semibold tabular-nums">
                          {plan[period]}
                        </span>
                        <span className="ms-2 text-sm text-muted-foreground">
                          {period === "monthly" ? monthlyLabel : yearlyLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                  {plan.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  )}
                  <ul className="my-6 grid gap-3 border-t border-border pt-6 text-sm">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.label}
                        className={cn(
                          "flex min-w-0 items-start gap-2 break-words",
                          !feature.included && "text-muted-foreground",
                        )}
                      >
                        <span
                          className="shrink-0 text-primary"
                          aria-hidden="true"
                        >
                          {feature.included ? "+" : "−"}
                        </span>
                        <span>
                          <span className="sr-only">
                            {feature.included ? includedLabel : excludedLabel}
                            :{" "}
                          </span>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.action.href}
                    className={cn(
                      "mt-auto",
                      plan.recommended
                        ? "df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                        : "df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm font-semibold hover:bg-muted",
                    )}
                  >
                    {plan.action.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        {comparison && <div className="mt-10">{comparison}</div>}
      </div>
    </section>
  );
}
