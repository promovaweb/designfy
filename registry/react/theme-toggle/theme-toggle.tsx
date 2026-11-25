"use client";

/**
 * ThemeToggle: Switches the theme and persists a light, dark or system preference.
 * Motion: Sun and moon cross-fade and rotate as the effective theme switches.
 * Catalog: theme-toggle
 */
import { cn } from "@designfy/components/lib/cn";
import { Sun, Moon } from "lucide-react";
import { useEffect, useRef } from "react";

/** Place this inline script before the theme stylesheet in the document head. */
export const themeScript = `(() => {
  let theme;
  try { theme = localStorage.getItem("designfy-theme"); } catch {}
  const dark = theme === "dark" || (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
})();`;

export interface ThemeToggleProps {
  /** Two-state shortcut or all three preferences. */
  variant?: "button" | "menu";
  /** Accessible name of the theme choices. */
  label?: string;
  /** Light option text. */
  lightLabel?: string;
  /** Dark option text. */
  darkLabel?: string;
  /** System option text. */
  systemLabel?: string;
  /** Action label when the two-state button is currently light. */
  switchToDark?: string;
  /** Action label when the two-state button is currently dark. */
  switchToLight?: string;
  /** Additional classes on the root element. */
  className?: string;
}

function bindThemeToggle(root: HTMLDivElement) {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const system = matchMedia("(prefers-color-scheme: dark)");
  const shortcut = root.querySelector<HTMLButtonElement>(
    "[data-theme-shortcut]",
  );
  const choices = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-theme-choice]"),
  );
  const panel = root.querySelector("details");
  let preference = "system";
  try {
    preference = localStorage.getItem("designfy-theme") ?? "system";
  } catch {}

  function sync() {
    const dark =
      preference === "dark" || (preference !== "light" && system.matches);
    document.documentElement.classList.toggle("dark", dark);
    root.dataset.theme = dark ? "dark" : "light";
    if (shortcut)
      shortcut.setAttribute(
        "aria-label",
        (dark ? shortcut.dataset.light : shortcut.dataset.dark) ?? "",
      );
    for (const button of choices)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeChoice === preference),
      );
  }

  function choose(value: string) {
    preference = value;
    try {
      localStorage.setItem("designfy-theme", value);
    } catch {}
    window.dispatchEvent(new CustomEvent("designfy:theme", { detail: value }));
    if (panel?.open) {
      panel.open = false;
      panel.querySelector("summary")?.focus();
    }
  }

  for (const button of choices)
    button.addEventListener(
      "click",
      () => choose(button.dataset.themeChoice ?? "system"),
      options,
    );
  shortcut?.addEventListener(
    "click",
    () => choose(root.dataset.theme === "dark" ? "light" : "dark"),
    options,
  );
  panel?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && panel.open) {
        panel.open = false;
        panel.querySelector("summary")?.focus();
      }
    },
    options,
  );
  window.addEventListener(
    "designfy:theme",
    (event) => {
      preference = (event as CustomEvent<string>).detail;
      sync();
    },
    options,
  );
  window.addEventListener(
    "storage",
    (event) => {
      if (event.key !== null && event.key !== "designfy-theme") return;
      preference = event.newValue ?? "system";
      sync();
    },
    options,
  );
  system.addEventListener("change", sync, options);
  sync();
  return () => abort.abort();
}

/** Switches the theme and persists a light, dark or system preference. */
export function ThemeToggle({
  variant = "menu",
  label = "Choose theme",
  lightLabel = "Light",
  darkLabel = "Dark",
  systemLabel = "System",
  switchToDark = "Switch to dark theme",
  switchToLight = "Switch to light theme",
  className,
}: ThemeToggleProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindThemeToggle(root.current);
  }, []);
  return (
    <div
      ref={root}
      data-site-theme-toggle
      className={cn("relative", className)}
    >
      {variant === "button" ? (
        <button
          type="button"
          data-theme-shortcut
          data-dark={switchToDark}
          data-light={switchToLight}
          aria-label={switchToDark}
          className="df-press grid size-11 place-items-center rounded-lg border border-border hover:bg-muted"
        >
          <span className="relative block size-5 shrink-0" aria-hidden="true">
            <Sun
              strokeWidth="1.75"
              className="absolute inset-0 size-5 motion-safe:transition-[transform,opacity] motion-safe:duration-200 dark:rotate-90 dark:opacity-0"
            />
            <Moon
              strokeWidth="1.75"
              className="absolute inset-0 size-5 -rotate-90 opacity-0 motion-safe:transition-[transform,opacity] motion-safe:duration-200 dark:rotate-0 dark:opacity-100"
            />
          </span>
        </button>
      ) : (
        <details className="relative">
          <summary
            aria-label={label}
            className="df-press grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-border hover:bg-muted [&::-webkit-details-marker]:hidden"
          >
            <span className="relative block size-5 shrink-0" aria-hidden="true">
              <Sun
                strokeWidth="1.75"
                className="absolute inset-0 size-5 motion-safe:transition-[transform,opacity] motion-safe:duration-200 dark:rotate-90 dark:opacity-0"
              />
              <Moon
                strokeWidth="1.75"
                className="absolute inset-0 size-5 -rotate-90 opacity-0 motion-safe:transition-[transform,opacity] motion-safe:duration-200 dark:rotate-0 dark:opacity-100"
              />
            </span>
          </summary>
          <div
            role="group"
            aria-label={label}
            className="absolute end-0 z-50 mt-2 grid min-w-36 animate-df-fade-down rounded-xl border border-border bg-popover p-1 text-popover-foreground"
          >
            {[
              { value: "light", text: lightLabel },
              { value: "dark", text: darkLabel },
              { value: "system", text: systemLabel },
            ].map(({ value, text }) => (
              <button
                key={value}
                type="button"
                data-theme-choice={value}
                aria-pressed={value === "system"}
                className="df-press min-h-11 rounded-lg px-3 text-start text-sm hover:bg-muted aria-pressed:bg-accent aria-pressed:font-semibold aria-pressed:text-accent-foreground"
              >
                {text}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
