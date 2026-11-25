"use client";

/**
 * AnnouncementBar: Shows a dated message and link with an optional dismiss button.
 * Motion: Slides into view. An optional continuous message pauses on hover, focus and off screen.
 * Catalog: announcement-bar
 */
import { cn } from "@designfy/components/lib/cn";
import { Marquee } from "@designfy/components/marquee/marquee";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type Action = { label: string; href: string };

export interface AnnouncementBarProps {
  /** Message content. */
  message: string;
  /** Optional short follow-up link. */
  action?: Action;
  /** Enables dismissal and labels the control. */
  dismissLabel?: string;
  /** Scroll a longer message instead of truncating. */
  scrollMessage?: boolean;
  /** Pause control name for a scrolling message. */
  pauseLabel?: string;
  /** Resume control name for a scrolling message. */
  resumeLabel?: string;
  /** Additional classes on the root element. */
  className?: string;
}

function bindAnnouncementBar(root: HTMLElement) {
  const button = root.querySelector<HTMLButtonElement>("[data-dismiss]");
  if (!button) return;
  button.hidden = false;
  const dismiss = () => {
    root.dataset.state = "dismissed";
    root.hidden = true;
    document
      .querySelector<HTMLElement>("header a[href]")
      ?.focus({ preventScroll: true });
  };
  button.addEventListener("click", dismiss);
  return () => button.removeEventListener("click", dismiss);
}

/** Shows a dated message and link with an optional dismiss button. */
export function AnnouncementBar({
  message,
  action,
  dismissLabel,
  scrollMessage = false,
  pauseLabel = "Pause announcement",
  resumeLabel = "Resume announcement",
  className,
}: AnnouncementBarProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindAnnouncementBar(root.current);
  }, []);
  return (
    <aside
      ref={root}
      data-site-announcement-bar
      data-state="visible"
      className={cn(
        "animate-df-fade-down bg-primary text-primary-foreground",
        className,
      )}
    >
      <div className="df-container flex items-center justify-center gap-3 text-sm">
        {scrollMessage ? (
          <Marquee
            items={[message]}
            pauseLabel={pauseLabel}
            resumeLabel={resumeLabel}
            className="min-w-0 flex-1 space-y-0 sm:flex sm:items-center sm:gap-3 [&>div]:flex-1 [&>button]:shrink-0"
          />
        ) : (
          <p title={message} className="min-w-0 truncate py-2">
            {message}
          </p>
        )}
        {action && (
          <a
            href={action.href}
            className="inline-flex min-h-11 shrink-0 items-center font-semibold underline underline-offset-4 "
          >
            {action.label}
          </a>
        )}
        {dismissLabel && (
          <button
            hidden
            data-dismiss
            type="button"
            aria-label={dismissLabel}
            className="df-press min-h-11 min-w-11 shrink-0 rounded-lg hover:bg-primary-foreground/10"
          >
            <X aria-hidden="true" strokeWidth="2" className="mx-auto size-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
