"use client";

/**
 * CodeBlock: a code sample with its file name, language and copy button.
 *
 * Receives plain text through `code` or pre-highlighted HTML through `html`;
 * there is no highlighter inside the component. The block scrolls inside its
 * own box, so a long command never widens the page. Lines listed in
 * `lineHighlights` get a tinted band.
 *
 * Motion: the copy button swaps to a check for 1.5 s, with the check drawing
 * in; the polite status announces the copy. No motion under reduced motion
 * beyond the swap.
 *
 * Catalog: code-block
 */
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@designfy/components/lib/cn";

export interface CodeBlockProps {
  /** Code in plain text; it is escaped here and split per line for the highlights. */
  code?: string;
  /** Pre-highlighted HTML for the code element. Takes precedence over `code`. */
  html?: string;
  /** Language shown in the header when there is no file name. */
  language?: string;
  /** File name or path shown in the header. */
  fileName?: string;
  /** Label of the copy button. Default "Copy". */
  copyLabel?: string;
  /** Label shown after copying. Default "Copied". */
  copiedLabel?: string;
  /** Sentence read by screen readers after copying. */
  copiedAnnouncement?: string;
  /** Lines to mark, counted from 1. */
  lineHighlights?: number[];
  className?: string;
}

/** Shows code with its origin and a copy button. */
export function CodeBlock({
  code,
  html,
  language,
  fileName,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  copiedAnnouncement = "Code copied to the clipboard.",
  lineHighlights,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const text = codeRef.current?.textContent ?? code ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  const marked = new Set(lineHighlights ?? []);

  return (
    <figure
      data-df-code
      data-df-copied={copied ? "" : undefined}
      className={cn("not-prose group relative min-w-0 overflow-hidden rounded-lg border border-border bg-muted/40", className)}
    >
      <figcaption className="flex min-h-11 items-center justify-between gap-3 border-b border-border px-4 py-1.5">
        <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">{fileName ?? language}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span aria-live="polite" role="status" className="sr-only">
            {copied ? copiedAnnouncement : ""}
          </span>
          <button
            type="button"
            onClick={copy}
            data-df-copy
            data-copied={copied ? "" : undefined}
            className="df-press inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors duration-(--duration-fast) hover:bg-muted hover:text-foreground sm:min-h-8"
          >
            {copied ? (
              <Check aria-hidden="true" className="size-3.5 animate-df-pop text-success" />
            ) : (
              <Copy aria-hidden="true" className="size-3.5" />
            )}
            <span>{copied ? copiedLabel : copyLabel}</span>
          </button>
        </span>
      </figcaption>
      <div className="overflow-x-auto overscroll-x-contain">
        <pre data-df-own className="min-w-full px-4 py-4 font-mono text-sm leading-relaxed">
          {html ? (
            <code ref={codeRef} data-df-own dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <code ref={codeRef} data-df-own>
              {(code ?? "").split("\n").map((line, index) => (
                <span
                  key={index}
                  className={cn(
                    "block",
                    marked.has(index + 1) && "-mx-4 border-l-2 border-primary/60 bg-primary/10 px-4",
                  )}
                >
                  {line === "" ? "\u00a0" : line}
                </span>
              ))}
            </code>
          )}
        </pre>
      </div>
    </figure>
  );
}
