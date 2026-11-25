"use client";

/**
 * Testimonial: Presents attributed testimonials as a single quote, grid or manually controlled carousel.
 * Motion: Quotes reveal on scroll; the carousel moves only when someone swipes or uses the controls.
 * Catalog: testimonial
 */
import { cn } from "@designfy/components/lib/cn";
import { useEffect, useRef } from "react";

type Quote = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  cite?: string;
  photo?: { src: string; alt: string; width: number; height: number };
};

export interface TestimonialProps {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Quotes with attribution and optional photos. */
  items: Quote[];
  /** Presentation of the quotes. */
  variant?: "single" | "grid" | "carousel";
  /** Previous quote button text. */
  previousLabel?: string;
  /** Next quote button text. */
  nextLabel?: string;
  /** Additional classes on the root element. */
  className?: string;
}

function bindTestimonial(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>("[data-testimonial-track]");
  if (!track) return;
  const abort = new AbortController();
  const controls = root.querySelectorAll<HTMLButtonElement>("[data-slide]");
  for (const control of controls) {
    control.hidden = false;
    control.addEventListener(
      "click",
      () => {
        const distance = track.clientWidth * Number(control.dataset.slide);
        track.scrollBy({
          left: track.matches(":dir(rtl)") ? -distance : distance,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      },
      { signal: abort.signal },
    );
  }
  return () => abort.abort();
}

/** Presents attributed testimonials as a single quote, grid or manually controlled carousel. */
export function Testimonial({
  title,
  lead,
  headingLevel = 2,
  items,
  variant = "single",
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
}: TestimonialProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindTestimonial(root.current);
  }, []);
  const Heading = `h${headingLevel}` as "h2";
  const carousel = variant === "carousel";
  return (
    <section
      ref={root}
      data-site-testimonial
      className={cn("df-section bg-muted/60", className)}
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
        <ul
          data-testimonial-track
          data-df-stagger
          aria-label={carousel ? title : undefined}
          tabIndex={carousel ? 0 : undefined}
          className={cn(
            "grid gap-6",
            variant === "grid" && "md:grid-cols-2",
            carousel &&
              "grid-flow-col auto-cols-[100%] snap-x snap-mandatory overflow-x-auto",
          )}
        >
          {(variant === "single" ? items.slice(0, 1) : items).map((item) => (
            <li
              key={item.name}
              data-df-reveal="up"
              className={cn(
                "min-w-0 snap-start",
                variant === "grid" && "border-t border-border pt-6",
              )}
            >
              <figure
                className={cn(
                  "max-w-4xl",
                  variant === "grid"
                    ? "max-w-xl"
                    : "border-s-2 border-primary ps-6 sm:ps-10",
                )}
              >
                <blockquote
                  cite={item.cite}
                  className={cn(
                    "text-pretty font-heading font-semibold",
                    variant === "grid" ? "text-title" : "text-headline",
                  )}
                >
                  <p>{item.quote}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4 text-sm">
                  {item.photo && (
                    <img
                      src={item.photo.src}
                      alt={item.photo.alt}
                      width={item.photo.width}
                      height={item.photo.height}
                      loading="lazy"
                      className="size-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <span className="block font-semibold">{item.name}</span>
                    {(item.role || item.company) && (
                      <span className="text-muted-foreground">
                        {[item.role, item.company].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        {carousel && items.length > 1 && (
          <div className="mt-4 flex gap-2">
            <button
              hidden
              type="button"
              data-slide="-1"
              className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm font-semibold hover:bg-muted"
            >
              {previousLabel}
            </button>
            <button
              hidden
              type="button"
              data-slide="1"
              className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm font-semibold hover:bg-muted"
            >
              {nextLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
