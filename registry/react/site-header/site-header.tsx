"use client";

/**
 * SiteHeader: Provides public site navigation and a modal menu for small screens.
 * Slots or React nodes: brandVisual, utilities, mobileUtilities.
 * Motion: Sticky variants retract on downward scroll and return on upward scroll; the mobile panel slides in.
 * Catalog: site-header, mobile-nav
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

type Route = { label: string; href: string; current?: boolean };
type Group = { label: string; links: Route[] };

export interface SiteHeaderProps {
  /** Brand name and home link. */
  brand: Route;
  /** Optional decorative brand mark. */
  brandVisual?: ReactNode;
  /** Primary navigation routes. */
  links: Route[];
  /** Secondary route groups, available in the mobile menu. */
  secondary?: Group[];
  /** Primary link, also visible on mobile. */
  primaryAction?: Route;
  /** Header utilities, such as a theme switch. */
  utilities?: ReactNode;
  /** Utilities inside the mobile menu. */
  mobileUtilities?: ReactNode;
  /** Position and initial treatment of the header. */
  variant?: "static" | "sticky" | "transparent" | "floating";
  /** Mobile menu placement. */
  mobileVariant?: "full" | "side" | "bottom";
  /** Accessible name of the navigation. */
  navLabel?: string;
  /** Unique ID for the mobile dialog. */
  menuId?: string;
  /** Name and text for the menu trigger. */
  menuLabel?: string;
  /** Name and text for the close button. */
  closeLabel?: string;
  /** Title of the skip link. */
  skipLabel?: string;
  /** Fragment pointing at the main landmark. */
  skipHref?: string;
  /** Additional classes on the root element. */
  className?: string;
}

function bindSiteHeader(root: HTMLElement) {
  const abort = new AbortController();
  const settings = { signal: abort.signal };
  const trigger = root.querySelector<HTMLButtonElement>("[data-menu-trigger]");
  const panel = root.querySelector<HTMLDialogElement>("dialog");
  const viewport = matchMedia("(min-width: 1024px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (!panel || !trigger) return;
  root.setAttribute("data-menu-ready", "");
  trigger.addEventListener(
    "click",
    () => {
      panel.showModal();
      trigger.setAttribute("aria-expanded", "true");
      root.removeAttribute("data-retracted");
    },
    settings,
  );
  panel.addEventListener(
    "close",
    () => {
      trigger.setAttribute("aria-expanded", "false");
      if (!viewport.matches) trigger.focus({ preventScroll: true });
    },
    settings,
  );
  panel.addEventListener(
    "click",
    (event) => {
      if (
        event.target === panel ||
        (event.target instanceof Element && event.target.closest("a[href]"))
      )
        panel.close();
    },
    settings,
  );
  panel.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          "a[href], button, input, select, textarea, summary, [tabindex]",
        ),
      ).filter((node) => {
        const closed = node.closest("details:not([open])");
        const isDisclosure =
          node.localName === "summary" && node.parentElement === closed;
        return (
          (!closed || isDisclosure) &&
          node.tabIndex >= 0 &&
          !node.matches(":disabled") &&
          node.getClientRects().length > 0
        );
      });
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first && last) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last && first) {
        event.preventDefault();
        first.focus();
      }
    },
    settings,
  );
  viewport.addEventListener(
    "change",
    () => {
      if (viewport.matches && panel.open) panel.close();
    },
    settings,
  );
  let previous = Math.max(0, scrollY);
  function update() {
    const current = Math.max(0, scrollY);
    root.toggleAttribute("data-scrolled", current > 8);
    if (root.hasAttribute("data-sticky")) {
      const hide =
        !reduced.matches &&
        current > 64 &&
        current > previous &&
        !panel?.open &&
        !root.matches(":focus-within");
      root.toggleAttribute("data-retracted", hide);
    }
    previous = current;
  }
  window.addEventListener("scroll", update, { passive: true, ...settings });
  reduced.addEventListener("change", update, settings);
  update();
  return () => {
    abort.abort();
    if (panel.open) panel.close();
  };
}

/** Provides public site navigation and a modal menu for small screens. */
export function SiteHeader({
  brand,
  brandVisual,
  links,
  secondary,
  primaryAction,
  utilities,
  mobileUtilities,
  variant = "sticky",
  mobileVariant = "full",
  navLabel = "Main navigation",
  menuId = "site-mobile-navigation",
  menuLabel = "Menu",
  closeLabel = "Close",
  skipLabel = "Skip to main content",
  skipHref = "#main",
  className,
}: SiteHeaderProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindSiteHeader(root.current);
  }, []);
  const floating = variant === "floating";
  const transparent = variant === "transparent";
  const movable = variant === "sticky" || floating;
  return (
    <header
      ref={root}
      data-site-site-header
      data-sticky={movable || undefined}
      className={cn(
        "group z-30 motion-safe:transition-transform motion-safe:duration-200 data-retracted:-translate-y-full focus-within:translate-y-0",
        movable && "sticky top-0",
        transparent && "relative h-0 overflow-visible",
        floating && "top-2",
        className,
      )}
    >
      <a
        href={skipHref}
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-3"
      >
        {skipLabel}
      </a>
      <div
        className={cn(
          "border-b border-border bg-background",
          transparent && "border-transparent bg-background/85",
          floating && "df-container rounded-2xl border border-border",
        )}
      >
        <div
          className={cn(
            "df-container flex min-h-16 items-center gap-2 sm:gap-4",
            floating && "px-3",
            movable && "group-data-scrolled:min-h-14",
          )}
        >
          <a
            href={brand.href}
            className="flex min-h-11 min-w-0 shrink-0 items-center gap-2 font-heading text-lg font-bold"
          >
            {brandVisual}
            <span className="max-w-24 truncate sm:max-w-48">{brand.label}</span>
          </a>
          <nav
            aria-label={navLabel}
            className="ms-6 hidden flex-1 items-center gap-6 lg:flex"
          >
            {links.map((route) => (
              <a
                key={route.href}
                href={route.href}
                aria-current={route.current ? "page" : undefined}
                className="inline-flex min-h-11 items-center border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-primary aria-[current=page]:border-primary aria-[current=page]:text-foreground"
              >
                {route.label}
              </a>
            ))}
          </nav>
          <div className="ms-auto flex min-w-0 items-center gap-2 sm:gap-3">
            {utilities && (
              <div className="hidden items-center gap-2 lg:flex">
                {utilities}
              </div>
            )}
            {primaryAction && (
              <a
                href={primaryAction.href}
                className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 px-3 sm:px-5"
              >
                {primaryAction.label}
              </a>
            )}
            <button
              data-menu-trigger
              aria-controls={menuId}
              aria-expanded="false"
              type="button"
              className="df-press hidden min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-border px-2 text-sm font-semibold group-data-menu-ready:inline-flex lg:!hidden"
            >
              {menuLabel}
            </button>
          </div>
        </div>
        <nav
          aria-label={navLabel}
          className="df-container flex flex-wrap gap-x-4 group-data-menu-ready:hidden lg:hidden"
        >
          {links.map((route) => (
            <a
              key={route.href}
              href={route.href}
              aria-current={route.current ? "page" : undefined}
              className="inline-flex min-h-11 items-center text-sm aria-[current=page]:font-semibold"
            >
              {route.label}
            </a>
          ))}
        </nav>
      </div>
      <dialog
        id={menuId}
        aria-label={navLabel}
        className={cn(
          "fixed inset-0 z-40 m-0 max-h-dvh max-w-none overflow-auto bg-background text-foreground backdrop:bg-foreground/25 motion-safe:open:animate-df-fade-down",
          mobileVariant === "full" && "h-dvh w-full",
          mobileVariant === "side" &&
            "inset-s-auto h-dvh w-full max-w-sm motion-safe:open:animate-df-slide-in-right",
          mobileVariant === "bottom" &&
            "inset-t-auto w-full rounded-t-2xl motion-safe:open:animate-df-fade-up",
        )}
      >
        <div className="df-container grid gap-6 py-6">
          <form method="dialog" className="flex justify-end">
            <button
              className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm font-semibold hover:bg-muted"
              type="submit"
            >
              {closeLabel}
            </button>
          </form>
          <nav aria-label={navLabel} className="grid gap-6">
            <ul className="divide-y divide-border border-y border-border">
              {links.map((route, index) => (
                <li
                  key={route.href}
                  style={{ "--menu-delay": index * 30 + "ms" } as CSSProperties}
                  className="motion-safe:animate-df-fade-up [animation-delay:var(--menu-delay)]"
                >
                  <a
                    href={route.href}
                    aria-current={route.current ? "page" : undefined}
                    className="flex min-h-12 items-center py-2 font-heading text-title font-semibold aria-[current=page]:text-primary"
                  >
                    {route.label}
                  </a>
                </li>
              ))}
            </ul>
            {secondary?.map((group) => (
              <div key={group.label} role="group" aria-label={group.label}>
                <p className="font-semibold">{group.label}</p>
                <ul className="mt-2 grid">
                  {group.links.map((route) => (
                    <li key={route.href}>
                      <a
                        href={route.href}
                        aria-current={route.current ? "page" : undefined}
                        className="inline-flex min-h-12 items-center text-muted-foreground hover:text-primary"
                      >
                        {route.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {primaryAction && (
            <a
              href={primaryAction.href}
              className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 "
            >
              {primaryAction.label}
            </a>
          )}
          {mobileUtilities}
        </div>
      </dialog>
    </header>
  );
}
