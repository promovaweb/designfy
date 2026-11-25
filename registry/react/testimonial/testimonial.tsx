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
  /** Show up to three quotes at a time in the carousel. */
  carouselLayout?: "single" | "responsive";
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
  const responsive = track.dataset.carouselLayout === "responsive";
  function syncBounds() {
    const offset = Math.abs(track.scrollLeft);
    const limit = track.scrollWidth - track.clientWidth;
    for (const control of controls) {
      const atBoundary =
        Number(control.dataset.slide) < 0 ? offset <= 1 : offset >= limit - 1;
      control.setAttribute("aria-disabled", String(atBoundary));
    }
  }
  const resize =
    responsive && typeof ResizeObserver === "function"
      ? new ResizeObserver(syncBounds)
      : undefined;
  if (responsive) {
    syncBounds();
    resize?.observe(track);
    track.addEventListener("scroll", syncBounds, {
      passive: true,
      signal: abort.signal,
    });
    if (!resize)
      window.addEventListener("resize", syncBounds, { signal: abort.signal });
  }
  for (const control of controls) {
    control.hidden = false;
    control.addEventListener(
      "click",
      () => {
        if (control.getAttribute("aria-disabled") === "true") return;
        const first = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const distance =
          responsive && first
            ? first.getBoundingClientRect().width + gap
            : track.clientWidth;
        const delta = distance * Number(control.dataset.slide);
        track.scrollBy({
          left: track.matches(":dir(rtl)") ? -delta : delta,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      },
      { signal: abort.signal },
    );
  }
  return () => {
    abort.abort();
    resize?.disconnect();
    for (const control of controls) control.removeAttribute("aria-disabled");
  };
}

/** Presents attributed testimonials as a single quote, grid or manually controlled carousel. */
export function Testimonial({
  title,
  lead,
  headingLevel = 2,
  items,
  variant = "single",
  carouselLayout = "single",
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
}: TestimonialProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindTestimonial(root.current);
  }, [variant, carouselLayout, items.length]);
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
          data-carousel-layout={carousel ? carouselLayout : undefined}
          data-df-stagger
          aria-label={carousel ? title : undefined}
          tabIndex={carousel ? 0 : undefined}
          className={cn(
            "grid gap-6",
            variant === "grid" && "md:grid-cols-2",
            carousel &&
              "grid-flow-col auto-cols-[100%] snap-x snap-mandatory overflow-x-auto",
            carousel &&
              carouselLayout === "responsive" &&
              "md:auto-cols-[calc((100%-1.5rem)/2)] lg:auto-cols-[calc((100%-3rem)/3)]",
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
                    variant === "grid" ||
                      (carousel && carouselLayout === "responsive")
                      ? "text-title"
                      : "text-headline",
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
              className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm font-semibold hover:bg-muted aria-disabled:opacity-50"
            >
              {previousLabel}
            </button>
            <button
              hidden
              type="button"
              data-slide="1"
              className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm font-semibold hover:bg-muted aria-disabled:opacity-50"
            >
              {nextLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
