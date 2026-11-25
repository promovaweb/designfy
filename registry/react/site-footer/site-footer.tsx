/**
 * SiteFooter: Closes a public page with its identity, route groups and legal information.
 * Slots or React nodes: action, marquee.
 * Motion: The footer reveals once and link underlines respond to hover and focus.
 * Catalog: site-footer
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

type Action = { label: string; href: string };
type LinkGroup = { title: string; links: Action[] };

export interface SiteFooterProps {
  /** Site name and home link. */
  brand: Action;
  /** One line about the site. */
  description?: string;
  /** Named groups of footer links. */
  groups: LinkGroup[];
  /** Social profile links. */
  socials?: Action[];
  /** Accessible name of the social links. */
  socialLabel?: string;
  /** Legal or copyright line. */
  legal: string;
  /** Privacy, terms and other legal routes. */
  legalLinks?: Action[];
  /** Accessible name of the legal routes. */
  legalLabel?: string;
  /** Layout of identity and link groups. */
  variant?: "columns" | "statement" | "inline";
  /** Final action or newsletter form. */
  action?: ReactNode;
  /** Optional passive marquee above the footer. */
  marquee?: ReactNode;
  /** Additional classes on the root element. */
  className?: string;
}

/** Closes a public page with its identity, route groups and legal information. */
export function SiteFooter({
  brand,
  description,
  groups,
  socials,
  socialLabel = "Social links",
  legal,
  legalLinks,
  legalLabel = "Legal",
  variant = "columns",
  action,
  marquee,
  className,
}: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-border bg-muted/60", className)}>
      {marquee}
      <div className="df-container py-10 md:py-16">
        <div
          data-df-reveal="up"
          className={cn(
            "grid gap-8",
            variant === "columns" &&
              "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
            variant === "inline" && "lg:grid-cols-2",
          )}
        >
          <div className="min-w-0">
            <a
              href={brand.href}
              className={cn(
                "inline-flex min-h-11 items-center break-words font-heading font-semibold",
                variant === "statement" ? "text-display" : "text-title",
              )}
            >
              {brand.label}
            </a>
            {description && (
              <p className="mt-2 max-w-prose text-muted-foreground">
                {description}
              </p>
            )}
            {action && <div className="mt-5">{action}</div>}
          </div>
          <div
            className={cn(
              "grid min-w-0 gap-5 sm:grid-cols-2",
              variant !== "inline" &&
                "lg:grid-cols-[repeat(auto-fit,minmax(min(100%,9rem),1fr))]",
            )}
          >
            {groups.map((group) => (
              <nav
                key={group.title}
                aria-label={group.title}
                className="min-w-0"
              >
                <p className="font-semibold">{group.title}</p>
                <ul className="mt-1">
                  {group.links.map((entry) => (
                    <li key={entry.href}>
                      <a
                        href={entry.href}
                        className="inline-flex min-h-11 items-center break-words text-sm text-muted-foreground hover:underline"
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            {!!socials?.length && (
              <nav aria-label={socialLabel}>
                <p className="font-semibold">{socialLabel}</p>
                <ul className="mt-1">
                  {socials.map((entry) => (
                    <li key={entry.href}>
                      <a
                        href={entry.href}
                        className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:underline"
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
        <div
          data-df-reveal="fade"
          className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-sm text-muted-foreground"
        >
          <p>{legal}</p>
          {!!legalLinks?.length && (
            <nav aria-label={legalLabel}>
              <ul className="flex flex-wrap gap-x-5">
                {legalLinks.map((entry) => (
                  <li key={entry.href}>
                    <a
                      href={entry.href}
                      className="inline-flex min-h-11 items-center hover:underline"
                    >
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
