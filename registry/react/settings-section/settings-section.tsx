"use client";

/** Independent settings form, immediate switches and confirmed destructive changes. Motion: save check and switch thumb. Catalog: settings-section. */
import { useId, useRef, useState, type ReactNode } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@designfy/components/lib/cn";

export interface SettingsToggle {
  /** Stable identifier. */
  id: string;
  /** Switch name. */
  label: string;
  /** Consequence of changing the switch. */
  description?: string;
  /** Persisted state. Update after save resolves. */
  checked: boolean;
  /** Saves a requested value. */
  save: (checked: boolean) => Promise<void>;
  /** Whether changing this preference is unavailable. */
  disabled?: boolean;
}
export interface SettingsSectionProps {
  /** Section name. */
  title: string;
  /** Context for these settings. */
  description?: string;
  /** Section heading level. */
  headingLevel?: 2 | 3 | 4;
  /** Form fields or read-only content. */
  children?: ReactNode;
  /** Independent immediate-save switch rows. */
  toggles?: readonly SettingsToggle[];
  /** Whether the form has pending changes. */
  dirty?: boolean;
  /** Saves form fields. */
  onSave?: () => Promise<void>;
  /** Discards form changes. */
  onReset?: () => void;
  /** Enables editing read-only content. */
  edit?: ReactNode;
  /** Configuration for a confirmed destructive action. */
  danger?: { label: string; title: string; description: string; run: () => Promise<void> };
  /** Additional classes. */
  className?: string;
}

/** Saves one group of settings independently. */
export function SettingsSection({ title, description, headingLevel = 3, children, toggles, dirty, onSave, onReset, edit, danger, className }: SettingsSectionProps) {
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  const running = useRef(false);
  const [status, setStatus] = useState<{ state: "idle" | "saving" | "saved" | "error"; label?: string }>({ state: "idle" });
  const [confirm, setConfirm] = useState(false);

  async function save(action: () => Promise<void>, label?: string) {
    if (running.current) return;
    running.current = true;
    setStatus({ state: "saving", label });
    try { await action(); setStatus({ state: "saved", label }); setConfirm(false); }
    catch { setStatus({ state: "error", label }); }
    finally { running.current = false; }
  }
  const busy = status.state === "saving";
  const Content = onSave ? "form" : "div";
  return <section aria-labelledby={id} className={cn("min-w-0 overflow-hidden rounded-xl border border-border bg-card", danger && "border-destructive/40", className)}>
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
      <div><Heading id={id} className={cn("font-heading text-lg font-semibold", danger && "text-destructive")}>{title}</Heading>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>{edit}
    </div>
    <Content onSubmit={onSave ? (event) => { event.preventDefault(); if (dirty !== false) void save(onSave); } : undefined}>
      {children && <div className="grid gap-4 px-5 pb-5 sm:px-6">{children}</div>}
      {!!toggles?.length && <ul className="divide-y divide-border border-t border-border">
        {toggles.map((item) => <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <label htmlFor={`${id}-${item.id}`} className="flex min-h-11 min-w-0 flex-col justify-center text-sm font-medium">{item.label}
            {item.description && <span id={`${id}-${item.id}-help`} className="text-sm font-normal text-muted-foreground">{item.description}</span>}</label>
          <Switch id={`${id}-${item.id}`} aria-describedby={item.description ? `${id}-${item.id}-help` : undefined} checked={item.checked} disabled={busy || item.disabled} onCheckedChange={(checked) => void save(() => item.save(checked), item.label)} className="relative shrink-0 before:absolute before:-inset-3 before:content-['']" />
        </li>)}
      </ul>}
      {(onSave || danger || status.state !== "idle") && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3 sm:px-6">
        <div role="status" className="me-auto text-sm text-muted-foreground">
          {busy ? "Saving…" : status.state === "saved" && <span className="inline-flex items-center gap-1 text-success"><Check aria-hidden size={16} className="motion-safe:animate-df-pop" />{status.label ? `${status.label} saved` : "Saved"}</span>}
        </div>
        {status.state === "error" && !confirm && <p role="alert" className="text-sm text-destructive">Could not save. Try again.</p>}
        {onReset && <Button type="button" variant="ghost" disabled={busy || dirty === false} onClick={() => { onReset(); setStatus({ state: "idle" }); }} className="df-press min-h-11">Reset</Button>}
        {onSave && <Button type="submit" disabled={busy || dirty === false} className="df-press min-h-11">{busy && <LoaderCircle aria-hidden size={16} />}{busy ? "Saving…" : "Save changes"}</Button>}
        {danger && <AlertDialog open={confirm} onOpenChange={(open) => { if (!running.current) { setConfirm(open); setStatus({ state: "idle" }); } }}>
          <AlertDialogTrigger asChild><Button type="button" variant="destructive" className="df-press min-h-11">{danger.label}</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>{danger.title}</AlertDialogTitle><AlertDialogDescription>{danger.description}</AlertDialogDescription></AlertDialogHeader>
            {status.state === "error" && <p role="alert" className="text-sm text-destructive">The action failed. Try again.</p>}
            <AlertDialogFooter><AlertDialogCancel disabled={busy} className="min-h-11">Cancel</AlertDialogCancel>
              <Button type="button" variant="destructive" disabled={busy} className="df-press min-h-11" onClick={() => void save(danger.run)}>{busy ? "Working…" : danger.label}</Button></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>}
      </div>}
    </Content>
  </section>;
}
