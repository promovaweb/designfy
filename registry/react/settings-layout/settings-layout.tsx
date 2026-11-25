/** Settings navigation with linked areas and optional tabs or inline links. Motion: active area cross-fades. Catalog: settings-layout. */
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";

export interface SettingsLayoutProps {
  /** Accessible name of the settings navigation. */
  navigationLabel?: string;
  /** Direct destinations for each settings area. */
  areas: readonly { href: string; label: string; icon?: ReactNode }[];
  /** Current area link. */
  current: string;
  /** Visible area heading. */
  title: string;
  /** Level of the area heading. */
  headingLevel?: 2 | 3;
  /** Sections within this area. */
  children: ReactNode;
  /** Alternative navigation layout. */
  variant?: "sidebar" | "tabs" | "anchors";
  /** Additional classes. */
  className?: string;
}

/** Groups settings around stable, linkable destinations. */
export function SettingsLayout({ navigationLabel = "Settings areas", areas, current, title, headingLevel = 2, children, variant = "sidebar", className }: SettingsLayoutProps) {
  const Heading = `h${headingLevel}` as const;
  return <div className={cn("grid min-w-0 gap-5", variant === "sidebar" && "md:grid-cols-[minmax(10rem,13rem)_minmax(0,1fr)] md:gap-8", className)}>
    <nav aria-label={navigationLabel} className="min-w-0">
      <ul className={cn("flex flex-wrap gap-1 border-b border-border pb-2", variant === "sidebar" && "md:sticky md:top-20 md:flex-col md:border-b-0 md:pb-0")}>
        {areas.map(({ href, label, icon }) => <li key={href}><a href={href} aria-current={href === current ? "page" : undefined}
          className="df-press flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-muted aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground">
          {icon && <span aria-hidden>{icon}</span>}{label}
        </a></li>)}
      </ul>
    </nav>
    <section key={current} className="min-w-0 space-y-4 motion-safe:animate-df-fade-in">
      <Heading className="font-heading text-title font-semibold">{title}</Heading>{children}
    </section>
  </div>;
}
