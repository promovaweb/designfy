"use client";

/** Native file picker and drop zone with abortable uploads and announced progress. Motion: zone scales, progress grows and files fade up. Catalog: file-upload. */
import { useEffect, useId, useRef, useState } from "react";
import { Check, File, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@designfy/components/lib/cn";

type Transfer = { id: string; file: File; progress: number; state: "uploading" | "done" | "error"; message?: string };

export interface FileUploadProps {
  /** Title and accessible file-picker context. */
  title: string;
  /** Level for the upload heading. */
  headingLevel?: 2 | 3 | 4;
  /** Visible file types and size limits. */
  limits: string;
  /** Native accept list, such as .csv or image/*. */
  accept?: string;
  /** Largest accepted size in bytes. */
  maxBytes?: number;
  /** Maximum number of files per transfer list. */
  maxFiles?: number;
  /** Simulated or real uploader supplied by the consumer. */
  upload: (file: File, signal: AbortSignal, progress: (percent: number) => void) => Promise<void>;
  /** Observe successful uploads and removal. */
  onFilesChange?: (files: readonly File[]) => void;
  /** Additional classes. */
  className?: string;
}

function matches(file: File, accept: string) {
  return accept.split(",").some((raw) => {
    const type = raw.trim().toLowerCase();
    return !type || (type.startsWith(".") ? file.name.toLowerCase().endsWith(type) : type.endsWith("/*") ? file.type.startsWith(type.slice(0, -1)) : file.type === type);
  });
}

/** Lets people pick or drop files and monitor each upload. */
export function FileUpload({ title, headingLevel = 2, limits, accept, maxBytes = Infinity, maxFiles = Infinity, upload, onFilesChange, className }: FileUploadProps) {
  const Heading = `h${headingLevel}` as const;
  const input = useRef<HTMLInputElement>(null);
  const controllers = useRef(new Map<string, AbortController>());
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const notified = useRef<readonly File[]>([]);
  const nextId = useRef(0);
  const [dragging, setDragging] = useState(0);
  const [alert, setAlert] = useState("");
  const id = useId();

  useEffect(() => {
    const pending = controllers.current;
    return () => { for (const controller of pending.values()) controller.abort(); pending.clear(); };
  }, []);
  useEffect(() => {
    const files = transfers.filter((item) => item.state === "done").map((item) => item.file);
    if (files.length === notified.current.length && files.every((file, index) => file === notified.current[index])) return;
    notified.current = files;
    onFilesChange?.(files);
  }, [onFilesChange, transfers]);

  function update(id: string, changes: Partial<Transfer>) {
    setTransfers((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function add(files: FileList | File[]) {
    const incoming = Array.from(files);
    const available = Math.max(0, maxFiles - transfers.length);
    setAlert(incoming.length > available ? `Only ${maxFiles} files can be added.` : "");
    for (const file of incoming.slice(0, available)) {
      const invalid = file.size > maxBytes ? "This file exceeds the size limit." : accept && !matches(file, accept) ? "This file type is unsupported." : undefined;
      const id = String(++nextId.current);
      setTransfers((items) => [...items, { id, file, progress: 0, state: invalid ? "error" : "uploading", message: invalid }]);
      if (invalid) continue;
      const controller = new AbortController();
      controllers.current.set(id, controller);
      void Promise.resolve().then(() => upload(file, controller.signal, (percent) => {
        if (!controller.signal.aborted && Number.isFinite(percent)) update(id, { progress: Math.min(100, Math.max(0, percent)) });
      })).then(() => {
        if (!controller.signal.aborted) update(id, { progress: 100, state: "done" });
      }, () => {
        if (!controller.signal.aborted) update(id, { state: "error", message: "The upload failed. Remove the file and try again." });
      }).finally(() => controllers.current.delete(id));
    }
  }

  return <section className={cn("min-w-0 space-y-3", className)}>
    <div onDragEnter={(event) => { event.preventDefault(); setDragging((value) => value + 1); }}
      onDragLeave={(event) => { event.preventDefault(); setDragging((value) => Math.max(0, value - 1)); }}
      onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }}
      onDrop={(event) => { event.preventDefault(); setDragging(0); add(event.dataTransfer.files); }}
      className={cn("grid justify-items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center transition-transform duration-(--duration-fast)", dragging > 0 && "scale-[1.01] border-primary bg-accent")}>
      <Upload className="text-primary" aria-hidden size={24} />
      <Heading className="font-heading text-lg font-semibold">{title}</Heading>
      <p id={id} className="text-sm text-muted-foreground">{limits}</p>
      <input ref={input} type="file" accept={accept} multiple={maxFiles !== 1} className="hidden" aria-describedby={id} onChange={(event) => { if (event.target.files) add(event.target.files); event.target.value = ""; }} />
      <Button type="button" variant="outline" className="df-press min-h-11" aria-describedby={id} onClick={() => input.current?.click()}>Choose files</Button>
    </div>
    {alert && <p role="alert" className="text-sm text-destructive">{alert}</p>}
    {!!transfers.length && <ul className="divide-y divide-border rounded-xl border border-border bg-card">
      {transfers.map(({ id, file, progress, state, message }) => <li key={id} className="flex min-w-0 items-start gap-3 px-3 py-2 motion-safe:animate-df-fade-up">
        <File size={18} aria-hidden className="mt-2 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1 py-1">
          <p className="wrap-anywhere text-sm font-medium">{file.name}</p>
          {state === "uploading" && <div className="mt-1.5 space-y-1">
            <p role="status" className="text-xs tabular-nums text-muted-foreground">Uploading · {Math.round(progress)}%</p>
            <div role="progressbar" aria-label={`Upload progress for ${file.name}`} aria-valuenow={Math.round(progress)} className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full origin-left rounded-full bg-primary transition-transform duration-(--duration-fast)" style={{ transform: `scaleX(${progress / 100})` }} /></div>
          </div>}
          {state === "done" && <p role="status" className="inline-flex items-center gap-1 text-xs text-success"><Check aria-hidden size={14} />Uploaded</p>}
          {state === "error" && <p role="alert" className="text-xs text-destructive">{message}</p>}
        </div>
        <Button variant="ghost" size="icon" type="button" aria-label={`Remove ${file.name}`} className="df-press size-11" onClick={() => {
          controllers.current.get(id)?.abort();
          setTransfers((items) => items.filter((item) => item.id !== id));
          setAlert("");
        }}><X aria-hidden /></Button>
      </li>)}
    </ul>}
  </section>;
}
