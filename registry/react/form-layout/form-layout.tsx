"use client";

/** Form sections, sticky submit bar and focusable validation summary. Motion: staggered sections, error shake and saved check. Catalog: form-layout. */
import { useCallback, useEffect, useRef, type FormEventHandler, type ReactNode } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@designfy/components/lib/cn";

export interface FormLayoutProps {
  /** Ordered sections, each with its fields. */
  sections: readonly { id: string; title: string; description?: string; fields: ReactNode }[];
  /** Heading level for each section. */
  headingLevel?: 2 | 3 | 4;
  /** Standard form handler, including react-hook-form adapters. */
  onSubmit: FormEventHandler<HTMLFormElement>;
  /** Button label. */
  submitLabel: string;
  /** Optional cancel control. */
  cancel?: ReactNode;
  /** Whether values differ from their saved state. */
  dirty?: boolean;
  /** Whether a save is in progress. */
  submitting?: boolean;
  /** Whether a save succeeded. */
  saved?: boolean;
  /** Validation issues and associated field IDs. */
  errors?: readonly { field?: string; message: string }[];
  /** Change after a failed submit, including repeated identical issues. */
  errorKey?: number;
  /** Use a bordered surface for each section. */
  boxed?: boolean;
  /** Stack sections or separate the context and fields on wide screens. */
  layout?: "stacked" | "columns";
  /** Additional classes. */
  className?: string;
}

/** Guards a document unload and returns a guard for client-side navigation. */
export function useUnsavedChanges(dirty: boolean, message = "Discard unsaved changes?") {
  useEffect(() => {
    if (!dirty) return;
    const confirmLeave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", confirmLeave);
    return () => window.removeEventListener("beforeunload", confirmLeave);
  }, [dirty]);
  return useCallback(() => !dirty || window.confirm(message), [dirty, message]);
}

/** Renders an accessible form around caller-owned fields and validation. */
export function FormLayout({ sections, headingLevel = 2, onSubmit, submitLabel, cancel, dirty, submitting, saved, errors, errorKey, boxed, layout = "columns", className }: FormLayoutProps) {
  const Heading = `h${headingLevel}` as const;
  const summary = useRef<HTMLDivElement>(null);
  const hasErrors = Boolean(errors?.length);
  useEffect(() => { if (hasErrors) summary.current?.focus(); }, [hasErrors, errorKey]);
  return <form noValidate aria-busy={submitting || undefined} onSubmit={onSubmit} className={cn("space-y-5", className)}>
    {hasErrors && <div key={errorKey} ref={summary} tabIndex={-1} className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm motion-safe:animate-df-shake">
      <p className="font-semibold text-destructive">Check the following before submitting</p>
      <ul className="ms-4 mt-2 list-disc space-y-1">{errors?.map(({ field, message }, index) => <li key={index}>
        {field ? <a href={`#${field}`} onClick={(event) => { const input = document.getElementById(field); if (input) { event.preventDefault(); input.focus(); } }} className="inline-flex min-h-11 items-center underline underline-offset-4">{message}</a> : message}
      </li>)}</ul>
    </div>}
    <div data-df-stagger className={cn("space-y-5", !boxed && "divide-y divide-border")}>
      {sections.map(({ id, title, description, fields }) => <section key={id} aria-labelledby={id} className={cn("grid min-w-0 gap-4 p-4 motion-safe:animate-df-fade-up sm:p-6 [animation-delay:calc(var(--df-i,0)*var(--stagger))]", boxed && "rounded-xl border border-border bg-card", layout === "columns" && "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-8")}>
        <div><Heading id={id} className="font-heading text-lg font-semibold">{title}</Heading>{description && <p className="mt-1 max-w-[45ch] text-sm text-muted-foreground">{description}</p>}</div>
        <div className="grid min-w-0 gap-5">{fields}</div>
      </section>)}
    </div>
    <div className="sticky bottom-0 z-[1] flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-3 py-3">
      <span role="status" className="text-sm text-muted-foreground">{submitting ? "Saving…" : saved ? <span className="inline-flex items-center gap-1.5 text-success"><Check size={16} aria-hidden className="motion-safe:animate-df-pop" />Saved</span> : dirty ? "Unsaved changes" : ""}</span>
      <div className="ms-auto flex flex-wrap gap-2">{cancel}<Button disabled={submitting} aria-busy={submitting || undefined} type="submit" className="df-press relative min-h-11"><span className={submitting ? "opacity-0" : undefined}>{submitLabel}</span>{submitting && <LoaderCircle aria-hidden size={16} className="absolute inset-0 m-auto motion-safe:animate-spin" />}</Button></div>
    </div>
  </form>;
}
