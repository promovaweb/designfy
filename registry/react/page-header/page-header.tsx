/** Page heading with optional navigation, status, metadata and action slots. Motion: route entrance and press feedback. Catalog: page-header. */
import type { ReactNode } from "react";
import { ArrowLeft, Ellipsis } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@designfy/components/lib/cn";

export interface PageHeaderProps {
  /** Visible screen name. */
  title: string;
  /** Supporting sentence. */
  description?: string;
  /** Heading level. Defaults to the page heading. */
  headingLevel?: 1 | 2 | 3;
  /** Link to the parent screen. */
  back?: { href: string; label: string };
  /** Context badge or status. */
  status?: ReactNode;
  /** Record metadata beside the status. */
  meta?: ReactNode;
  /** Main action or control. */
  primaryAction?: ReactNode;
  /** Secondary controls for wide screens. */
  secondaryActions?: ReactNode;
  /** Dropdown menu items for those controls on phones. */
  mobileActions?: ReactNode;
  /** Tabs or filters below the title. */
  tabs?: ReactNode;
  /** Additional classes. */
  className?: string;
}

/** Renders a page introduction with one primary action. */
export function PageHeader({ title, description, headingLevel = 1, back, status, meta, primaryAction, secondaryActions, mobileActions, tabs, className }: PageHeaderProps) {
  const Heading = `h${headingLevel}` as const;
  return <header className={cn("min-w-0 space-y-5", className)}>
    {back && <a href={back.href} className="df-press inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden size={16} />{back.label}</a>}
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Heading className="break-words font-heading text-headline font-semibold leading-tight">{title}</Heading>
          {status}
        </div>
        {description && <p className="max-w-[65ch] wrap-anywhere text-sm text-muted-foreground sm:text-base">{description}</p>}
        {meta && <div className="text-sm text-muted-foreground">{meta}</div>}
      </div>
      {(primaryAction || secondaryActions || mobileActions) && <div className="flex shrink-0 flex-wrap items-center gap-2">
        {secondaryActions && <div className={cn("flex flex-wrap gap-2", mobileActions && "hidden md:flex")}>{secondaryActions}</div>}
        {mobileActions && <DropdownMenu><DropdownMenuTrigger aria-label="More actions" className="df-press grid size-11 place-items-center rounded-lg border border-border hover:bg-muted md:hidden"><Ellipsis aria-hidden size={20} /></DropdownMenuTrigger><DropdownMenuContent align="start">{mobileActions}</DropdownMenuContent></DropdownMenu>}
        {primaryAction}
      </div>}
    </div>
    {tabs && <div className="border-b border-border">{tabs}</div>}
  </header>;
}
