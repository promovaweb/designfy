"use client";

/**
 * Faq: Provides native disclosure for answers and optional FAQPage metadata for eligible content.
 * Motion: The shared collapse utility animates expansion. The disclosure indicator rotates with state.
 * Catalog: faq
 */
import { cn } from "@designfy/components/lib/cn";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

type Question = { question: string; answer: string };

export interface FaqProps {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Visible questions and answers in reading order. */
  items: Question[];
  /** Centered column or two columns with the intro on the left. */
  variant?: "single" | "split";
  /** Include FAQPage JSON-LD only for content that qualifies. */
  structuredData?: boolean;
  /** Additional classes on the root element. */
  className?: string;
}

function bindFaq(root: HTMLElement) {
  const abort = new AbortController();
  root.setAttribute("data-collapse-ready", "");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  for (const details of root.querySelectorAll<HTMLDetailsElement>("details")) {
    const summary = details.querySelector("summary");
    const panel = details.querySelector<HTMLElement>("[data-answer]");
    if (!summary || !panel) continue;
    let timer = 0;
    summary.addEventListener(
      "click",
      (event) => {
        if (reduced.matches) return;
        event.preventDefault();
        clearTimeout(timer);
        if (panel.hasAttribute("data-df-open")) {
          panel.removeAttribute("data-df-open");
          timer = window.setTimeout(() => {
            details.open = false;
          }, 250);
        } else {
          details.open = true;
          panel.getBoundingClientRect();
          panel.setAttribute("data-df-open", "");
        }
      },
      { signal: abort.signal },
    );
    details.addEventListener(
      "toggle",
      () => {
        if (!details.open || reduced.matches)
          panel.toggleAttribute("data-df-open", details.open);
      },
      { signal: abort.signal },
    );
    abort.signal.addEventListener("abort", () => clearTimeout(timer), {
      once: true,
    });
  }
  return () => abort.abort();
}

/** Provides native disclosure for answers and optional FAQPage metadata for eligible content. */
export function Faq({
  title,
  lead,
  headingLevel = 2,
  items,
  variant = "single",
  structuredData = false,
  className,
}: FaqProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindFaq(root.current);
  }, []);
  const Heading = `h${headingLevel}` as "h2";
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }).replace(/</g, "\\u003c");
  return (
    <section
      ref={root}
      data-site-faq
      className={cn("df-section border-y border-border", className)}
    >
      <div
        className={cn(
          "df-container",
          variant === "split"
            ? "grid items-start gap-6 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:gap-12"
            : "max-w-4xl",
        )}
      >
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
        <div
          data-df-reveal="up"
          className="min-w-0 divide-y divide-border border-y border-border"
        >
          {items.map(({ question, answer }) => (
            <details key={question} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading font-semibold hover:text-primary [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  aria-hidden="true"
                  strokeWidth="2"
                  className="size-5 shrink-0 motion-safe:transition-transform group-open:rotate-180"
                />
              </summary>
              <div
                data-answer
                className="df-collapse [[data-site-faq]:not([data-collapse-ready])_&]:grid-rows-[1fr]"
              >
                <div>
                  <p className="max-w-prose pb-5 text-muted-foreground">
                    {answer}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      )}
    </section>
  );
}
