"use client";

/** Controlled search, attribute and date filters with mobile drawer and removable chips. Motion: chip presence and count fade. Catalog: filter-bar. */
import type { ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@designfy/components/lib/cn";

export interface FilterBarProps {
  /** Controlled search query. */
  query: string;
  /** Accessible search label and placeholder. */
  searchLabel?: string;
  /** Attribute labels, options and selected values. */
  attributes?: readonly { id: string; label: string; value: string; options: readonly { value: string; label: string }[] }[];
  /** Date range control; rendered in one breakpoint at a time. */
  dateRange?: ReactNode;
  /** Chips for externally managed filters such as the date range. */
  extraChips?: readonly { id: string; label: string; remove: () => void }[];
  /** Emits search and attribute changes for URL synchronization. */
  onChange: (id: string, value: string) => void;
  /** Clears search, attributes and custom filters. */
  onClear: () => void;
  /** Number of matching records. */
  resultCount: number;
  /** View controls such as display density. */
  viewOptions?: ReactNode;
  /** Additional classes. */
  className?: string;
}

/** Keeps search and applied filters visible while moving controls into a drawer on phones. */
export function FilterBar({ query, searchLabel = "Search", attributes = [], dateRange, extraChips = [], onChange, onClear, resultCount, viewOptions, className }: FilterBarProps) {
  const reduced = useReducedMotion();
  const chips = [...attributes.filter(({ value }) => value).map(({ id, label, value, options }) => ({
    id, label: `${label}: ${options.find((option) => option.value === value)?.label ?? value}`, remove: () => onChange(id, ""),
  })), ...extraChips];

  const controls = () => <>
    {attributes.map(({ id, label, value, options }) => <label className="grid gap-1 text-sm" key={id}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(id, event.target.value)} className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm">
        <option value="">{label}: All</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>)}
    {dateRange}
  </>;

  return <section aria-label="Filters" className={cn("min-w-0 space-y-3", className)}>
    <div className="flex flex-wrap items-center gap-2">
      <label className="relative min-w-32 flex-1 sm:max-w-xs">
        <span className="sr-only">{searchLabel}</span><Search aria-hidden size={16} className="pointer-events-none absolute start-3 top-3.5 text-muted-foreground" />
        <Input type="search" value={query} placeholder={searchLabel} onChange={(event) => onChange("query", event.target.value)} className="h-11 ps-9" />
      </label>
      {(attributes.length > 0 || dateRange) && <>
        <div className="hidden flex-wrap items-end gap-2 md:flex">{controls()}</div>
        <Sheet>
          <SheetTrigger asChild><Button type="button" variant="outline" className="df-press h-11 md:hidden"><SlidersHorizontal aria-hidden />Filters</Button></SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-xl"><SheetTitle className="px-5 pt-5">Filters</SheetTitle><SheetDescription className="sr-only">Narrow the list by attribute or date.</SheetDescription><div className="grid gap-3 px-5 pb-6">{controls()}</div></SheetContent>
        </Sheet>
      </>}
      {viewOptions && <div className="ms-auto">{viewOptions}</div>}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground"><span key={resultCount} className="motion-safe:animate-df-fade-in">{resultCount.toLocaleString()} {resultCount === 1 ? "result" : "results"}</span></p>
      <AnimatePresence initial={false}>
        {chips.map((chip) => <motion.button type="button" key={chip.id} aria-label={`Remove ${chip.label}`} onClick={chip.remove}
          initial={reduced ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={reduced ? undefined : { opacity: 0, scale: 0.9 }} transition={{ duration: reduced ? 0 : 0.15 }}
          className="df-press inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg bg-muted px-3 text-xs font-medium hover:bg-accent">
          <span className="truncate">{chip.label}</span><X aria-hidden size={14} />
        </motion.button>)}
      </AnimatePresence>
      {!!(chips.length || query) && <Button type="button" variant="ghost" className="df-press h-11 text-sm" onClick={onClear}>Clear all</Button>}
    </div>
  </section>;
}
