"use client";

/**
 * TableOfContents: the list of the headings of the page with the current one
 * marked.
 *
 * The rail is sticky from 1280 px and shows a marker that slides from heading
 * to heading; below that width the same list becomes a collapsible block.
 * `variant` picks "auto" (the responsive pair), "rail" or "block", for pages
 * that already own the column.
 *
 * Motion: the marker slides with a transform in --duration-base; links change
 * color in --duration-fast. The current heading comes from an
 * IntersectionObserver band under the header, and a click moves the marker
 * immediately. Under reduced motion the marker still moves, without animation.
 *
 * Catalog: table-of-contents
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@designfy/components/lib/cn";

export interface TocItem {
  /** id of the heading in the page. */
  id: string;
  /** Link text, usually the heading text. */
  label: string;
  /** Heading depth, used for the indentation. Default 2. */
  depth?: 2 | 3 | 4;
}

export interface TableOfContentsProps {
  /** Headings of the page, in reading order. */
  items: TocItem[];
  /** Accessible name of the nav. Default "On this page". */
  label?: string;
  /** Visible title of the rail and of the block. */
  title?: string;
  /** "auto" shows the block below 1280 px and the rail above it. Default "auto". */
  variant?: "auto" | "rail" | "block";
  /** Distance from the top of the viewport that marks the current heading, in px. Default 96. */
  offset?: number;
  className?: string;
}

const depthClass = (depth: TocItem["depth"]): string => (depth === 3 ? "pl-7" : depth === 4 ? "pl-10" : "pl-4");

/** Lists the headings of the page and marks the current one. */
export function TableOfContents({ items, label = "On this page", title, variant = "auto", offset = 96, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);
  const idsKey = items.map((item) => item.id).join("|");

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter((heading): heading is HTMLElement => heading !== null);
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0]!.target.id);
      },
      { rootMargin: `-${offset}px 0px -66% 0px` },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
    // The ids are the identity of the list; a new array with the same ids must not resubscribe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, offset]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const active = list.querySelector<HTMLElement>('[aria-current="location"]');
      if (!active) return;
      const marker = list.parentElement?.querySelector<HTMLElement>("[data-df-toc-marker]");
      const y = active.offsetTop + active.offsetHeight / 2 - (marker?.offsetHeight ?? 20) / 2;
      list.parentElement?.style.setProperty("--df-toc-y", `${y}px`);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [activeId, items]);

  const showBlock = variant !== "rail";
  const showRail = variant !== "block";

  const links = (inRail: boolean) =>
    items.map((item) => {
      const current = activeId === item.id;
      return (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={current ? "location" : undefined}
            onClick={() => setActiveId(item.id)}
            className={cn(
              "flex min-h-11 items-center gap-2 py-1 pr-2 text-sm transition-colors duration-(--duration-fast) ease-out-quart hover:text-foreground xl:min-h-8",
              depthClass(item.depth),
              current ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {!inRail ? (
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full bg-primary transition-opacity duration-(--duration-fast)",
                  current ? "opacity-100" : "opacity-0",
                )}
              />
            ) : null}
            <span className="min-w-0 text-pretty">{item.label}</span>
          </a>
        </li>
      );
    });

  return (
    <nav
      aria-label={label}
      className={cn("min-w-0", variant === "rail" ? "h-full" : variant === "auto" ? "xl:h-full" : undefined, className)}
    >
      {showBlock ? (
        <details
          className={cn(
            "group rounded-lg border border-border bg-muted/40 px-4 py-1",
            variant === "auto" && "xl:hidden",
          )}
        >
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            <span>{title ?? label}</span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) ease-out-quart group-open:rotate-180" />
          </summary>
          <ul className="flex flex-col gap-0.5 pb-2">{links(false)}</ul>
        </details>
      ) : null}

      {showRail ? (
        <div
          className={cn(
            "sticky top-[calc(var(--header-height)+1.5rem)] max-h-[calc(100svh-var(--header-height)-3rem)] overflow-y-auto",
            variant === "auto" && "hidden xl:block",
          )}
        >
          {title ? <p className="mb-3 text-sm font-semibold text-foreground">{title}</p> : null}
          <div className="relative">
            <span
              aria-hidden="true"
              data-df-toc-marker
              className="absolute top-0 left-0 h-5 w-px bg-primary transition-transform duration-(--duration-base) ease-out-quart"
              style={{ transform: "translate3d(0, var(--df-toc-y, 0px), 0)" }}
            />
            <ul ref={listRef} className="flex flex-col gap-0.5 border-l border-border">
              {links(true)}
            </ul>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
