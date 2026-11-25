"use client";

/** Application frame with grouped navigation, optional topbar tools and a right panel. Motion: rail, active marker and route entrance. Catalog: app-shell, sidebar-nav, topbar. */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { LayoutGrid, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@designfy/components/lib/cn";

export interface SidebarItem {
  /** Destination and stable identifier. */
  href: string;
  /** Visible label and accessible rail name. */
  label: string;
  /** Decorative icon. */
  icon?: ReactNode;
  /** Optional count or status badge. */
  badge?: ReactNode;
  /** Child destinations in a disclosure. */
  children?: readonly SidebarItem[];
}
export interface SidebarGroup {
  /** Name of a group of destinations. */
  label: string;
  /** Links in the group. */
  items: readonly SidebarItem[];
}
export interface AppShellProps {
  /** Product or workspace switcher. */
  brand: ReactNode;
  /** Accessible rail mark. */
  mark?: ReactNode;
  /** Name of the navigation landmark. */
  navigationLabel?: string;
  /** Omit to render a topbar-only shell. */
  groups?: readonly SidebarGroup[];
  /** Active destination, independent of the route transition. */
  activeHref?: string;
  /** Change on navigation to move focus to the new heading. */
  routeKey: string;
  /** App-level breadcrumbs in desktop and compact forms. */
  breadcrumbs?: { full: ReactNode; compact?: ReactNode };
  /** Search, command launcher or notification triggers. */
  tools?: ReactNode;
  /** Global account control, including mobile tools if applicable. */
  account?: ReactNode;
  /** Sidebar footer with account or supporting information. */
  footer?: ReactNode;
  /** Secondary content alongside the main region. */
  rightPanel?: ReactNode;
  /** Current screen. */
  children: ReactNode;
  /** Additional classes. */
  className?: string;
}

/** Focuses the current heading after navigation and leaves initial focus alone. */
export function useRouteHeadingFocus(routeKey: string, main: React.RefObject<HTMLElement | null>) {
  const previous = useRef(routeKey);
  useEffect(() => {
    if (previous.current === routeKey) return;
    previous.current = routeKey;
    const target = main.current?.querySelector<HTMLElement>("h1") ?? main.current;
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      main.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "ease-out" });
    }
    window.scrollTo(0, 0);
  }, [routeKey, main]);
}

/** Frames a routed client application. */
export function AppShell({ brand, mark, navigationLabel = "Main navigation", groups, activeHref, routeKey, breadcrumbs, tools, account, footer, rightPanel, children, className }: AppShellProps) {
  const main = useRef<HTMLElement>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [railChanged, setRailChanged] = useState(false);
  const [mobile, setMobile] = useState(false);
  const drawerRoute = useRef(routeKey);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  useRouteHeadingFocus(routeKey, main);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function navigation(rail: boolean, drawer: boolean) {
    function renderLink(item: SidebarItem, nested = false) {
      const current = item.href === activeHref;
      const isOpen = expanded[item.href] ?? Boolean(item.children?.some((child) => child.href === activeHref));
      const link = <a href={item.href} aria-label={rail ? item.label : undefined} aria-current={current ? "page" : undefined}
        onClick={() => { if (drawer) setMobile(false); }}
        className={cn("relative isolate flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg text-sm font-medium hover:bg-sidebar-accent", rail ? "justify-center" : "px-3", current && "text-sidebar-primary", nested && !rail && "pl-8")}>
        {current && (reduced ? <span className="absolute inset-0 -z-10 rounded-lg bg-sidebar-accent" /> : <motion.span layoutId="active" transition={{ duration: 0.18 }} className="absolute inset-0 -z-10 rounded-lg bg-sidebar-accent" />)}
        <span aria-hidden className="shrink-0">{item.icon ?? <LayoutGrid size={16} />}</span>
        {!rail && <><span className="min-w-0 flex-1 truncate">{item.label}</span>{item.badge}</>}
      </a>;
      return <li key={item.href}>
        <div className="flex">
          {rail ? <Tooltip><TooltipTrigger asChild>{link}</TooltipTrigger><TooltipContent side="right">{item.label}</TooltipContent></Tooltip> : link}
          {!!item.children?.length && !rail && <button type="button" aria-expanded={isOpen} aria-label={`Toggle ${item.label} links`} onClick={() => setExpanded({ ...expanded, [item.href]: !isOpen })} className="df-press min-w-11 rounded-lg hover:bg-sidebar-accent">{isOpen ? "−" : "+"}</button>}
        </div>
        {!!item.children?.length && (isOpen || rail) && <ul className="motion-safe:animate-[df-fade-up_200ms_ease-out_both]">{item.children.map((child) => renderLink(child, true))}</ul>}
      </li>;
    }

    return <TooltipProvider><LayoutGroup id={id + (drawer ? "-drawer" : "-sidebar")}>
      <div className="flex h-full min-h-0 flex-col px-3">
        <div className={cn("flex min-h-18 items-center", rail ? "justify-center" : "px-2")}>{rail ? mark ?? <LayoutGrid aria-hidden size={20} /> : brand}</div>
        <nav aria-label={navigationLabel} className="flex-1 space-y-5 overflow-y-auto py-4">
          {groups?.map((group) => <div key={group.label}>
            <p className={cn("mb-2 px-3 text-xs font-semibold text-muted-foreground", rail && "sr-only")}>{group.label}</p>
            <ul className="grid gap-1">{group.items.map((item) => renderLink(item))}</ul>
          </div>)}
        </nav>
        {footer && !rail && <div className="border-t border-sidebar-border p-3">{footer}</div>}
      </div>
    </LayoutGroup></TooltipProvider>;
  }

  const button = "df-press grid size-11 shrink-0 place-items-center rounded-lg hover:bg-muted";
  return <div className={cn("min-h-dvh bg-background text-foreground", groups?.length && (collapsed ? "lg:pl-18" : "lg:pl-60"), className)}>
    <a href={`#${id}-main`} className="sr-only z-50 rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4">Skip to main content</a>
    {!!groups?.length && <aside className={cn("fixed inset-y-0 start-0 z-20 hidden overflow-hidden border-e border-sidebar-border bg-sidebar text-sidebar-foreground lg:block", collapsed ? "w-18" : "w-60")}>
      <div key={String(collapsed)} className={cn("h-full", railChanged && (collapsed ? "motion-safe:animate-[df-slide-in-right_200ms_ease-out_both]" : "motion-safe:animate-[df-slide-in-left_200ms_ease-out_both]"))}>{navigation(collapsed, false)}</div>
    </aside>}
    <header className={cn("sticky top-0 z-10 flex min-h-16 items-center gap-2 border-b border-transparent bg-background px-4 sm:gap-3 lg:px-7", scrolled && "border-border")}>
      {!!groups?.length ? <>
        <Sheet open={mobile} onOpenChange={(open) => { if (open) drawerRoute.current = routeKey; setMobile(open); }}>
          <SheetTrigger className={cn(button, "lg:hidden")} aria-label="Open navigation"><Menu aria-hidden size={20} /></SheetTrigger>
          <SheetContent onCloseAutoFocus={(event) => { if (drawerRoute.current !== routeKey) event.preventDefault(); }} side="left" className="w-[min(18rem,90vw)] bg-sidebar text-sidebar-foreground"><SheetTitle className="sr-only">{navigationLabel}</SheetTitle><SheetDescription className="sr-only">Choose a destination.</SheetDescription>{navigation(false, true)}</SheetContent>
        </Sheet>
        <button type="button" className={cn(button, "hidden lg:grid")} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} aria-expanded={!collapsed} onClick={() => { setRailChanged(true); setCollapsed(!collapsed); }}>
          {collapsed ? <PanelLeftOpen aria-hidden size={19} /> : <PanelLeftClose aria-hidden size={19} />}
        </button>
      </> : brand}
      {breadcrumbs && <div className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
        {breadcrumbs.compact ? <><div className="md:hidden">{breadcrumbs.compact}</div><div className="hidden md:block">{breadcrumbs.full}</div></> : breadcrumbs.full}
      </div>}
      <div className="ms-auto flex items-center gap-2">{tools && <div className="hidden items-center gap-2 sm:flex">{tools}</div>}{account}</div>
    </header>
    <div className={cn("mx-auto max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-9", rightPanel && "grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)]")}>
      <main ref={main} id={`${id}-main`} tabIndex={-1} className="min-w-0">
        {children}
      </main>
      {rightPanel && <aside className="min-w-0" aria-label="Related tools">{rightPanel}</aside>}
    </div>
  </div>;
}
