/**
 * Designfy motion runtime (framework-free, about 1 KB).
 *
 * - Adds `js` to <html> so reveal styles may hide content before it enters.
 * - Marks `[data-df-reveal]` elements with `data-df-visible` once, when
 *   20% of the element is inside the viewport.
 * - Pauses looping animations (`[data-df-loop]`, `.df-marquee`) while they
 *   are off screen by toggling `data-df-paused`.
 * - Counts `[data-df-count]` numbers up once when they become visible.
 *
 * Call `initDesignfyMotion()` once per page. In Astro with view
 * transitions, call it again on `astro:page-load`.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Formats a number with the page locale, keeping the decimals of the target. */
function formatCount(value: number, decimals: number, locale: string | undefined): string {
  return value.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function countUp(el: HTMLElement): void {
  const target = Number(el.dataset.dfCount);
  if (!Number.isFinite(target)) return;
  const decimals = (el.dataset.dfCount?.split(".")[1] ?? "").length;
  const locale = el.closest("[lang]")?.getAttribute("lang") ?? undefined;
  const duration = Number(el.dataset.dfCountDuration ?? 900);
  const from = Number(el.dataset.dfCountFrom ?? 0);
  const start = performance.now();
  const step = (now: number): void => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = formatCount(from + (target - from) * eased, decimals, locale);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Starts reveals, loop pausing and counters for the current document. */
export function initDesignfyMotion(root: ParentNode = document): void {
  const html = document.documentElement;
  const reduced = window.matchMedia(REDUCED).matches;
  html.classList.add("js");

  const reveals = root.querySelectorAll<HTMLElement>("[data-df-reveal]:not([data-df-visible])");
  const counters = root.querySelectorAll<HTMLElement>("[data-df-count]:not([data-df-counted])");
  const loops = root.querySelectorAll<HTMLElement>("[data-df-loop], .df-marquee");

  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.setAttribute("data-df-visible", ""));
    counters.forEach((el) => el.setAttribute("data-df-counted", ""));
    return;
  }

  const once = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        if (el.hasAttribute("data-df-reveal")) el.setAttribute("data-df-visible", "");
        if (el.hasAttribute("data-df-count")) {
          el.setAttribute("data-df-counted", "");
          countUp(el);
        }
        observer.unobserve(el);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );
  reveals.forEach((el) => once.observe(el));
  counters.forEach((el) => once.observe(el));

  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.toggleAttribute("data-df-paused", !entry.isIntersecting);
  });
  loops.forEach((el) => visibility.observe(el));
}
