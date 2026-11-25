/** Draws a decorative, theme-driven mosaic and manages its animation lifecycle. */

const CELL = 12;
const STEP = 40;
const ROLES = [
  "--df-pixel-primary",
  "--df-pixel-highlight",
  "--df-pixel-accent",
  "--df-pixel-detail",
];

function seed(column: number, row: number, salt: number) {
  const value =
    Math.sin(column * 12.9898 + row * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function smooth(value: number) {
  const fraction = Math.min(1, Math.max(0, value));
  return fraction * fraction * (3 - 2 * fraction);
}

function snap(value: number, span: number) {
  return Math.floor((((value % span) + span) % span) / CELL) * CELL;
}

type Pixel = {
  x: number;
  y: number;
  tone: number;
  phase: number;
  speedX: number;
  speedY: number;
  radius: number;
};

/** Mounts one stage, returning a disposer for client navigation or component unmount. */
export function bindPixelStage(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>(":scope > canvas");
  const control = root.querySelector<HTMLButtonElement>(
    ":scope > [data-df-pixel-control]",
  );
  const context = canvas?.getContext("2d");
  if (!canvas || !control || !context) return;

  const abort = new AbortController();
  const listeners = { signal: abort.signal };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  let visible = !("IntersectionObserver" in window);
  let paused = false;
  let hovering = false;
  let focused = root.matches(":focus-within");
  let width = 0;
  let height = 0;
  let spanX = 0;
  let spanY = 0;
  let frame = 0;
  let pointerFrame = 0;
  let last = 0;
  let elapsed = 0;
  let pixels: Pixel[] = [];
  let colors: string[] = [];
  let pointer: { x: number; y: number } | undefined;

  function density(x: number, y: number) {
    return width < 640
      ? 0.05 + smooth(y * 0.8 + x * 0.4 - 0.35) * 0.85
      : 0.04 + smooth((x - 0.3) / 0.7) * 0.96;
  }

  function paint() {
    if (!context || !width || !height) return;
    context.clearRect(0, 0, width, height);
    const seconds = elapsed / 1000;

    for (const pixel of pixels) {
      const angle = pixel.phase + seconds;
      const x = snap(
        pixel.x + pixel.speedX * seconds + Math.cos(angle) * pixel.radius,
        spanX,
      );
      const y = snap(
        pixel.y + pixel.speedY * seconds + Math.sin(angle) * pixel.radius,
        spanY,
      );
      const weight = density(x / width, y / height);
      const shimmer = 0.25 + (Math.sin(angle * 1.2) + 1) * 0.24;
      const glow = pointer
        ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 110)
        : 0;
      const color = colors[glow > 0.35 ? 1 : pixel.tone];
      if (!color) continue;
      context.fillStyle = color;
      context.globalAlpha = Math.min(0.95, weight * (shimmer + glow * 0.6));
      context.fillRect(x, y, CELL - 3, CELL - 3);
    }
    context.globalAlpha = 1;
  }

  function readTheme() {
    const styles = getComputedStyle(root);
    colors = ROLES.map((role) => {
      const value = styles.getPropertyValue(role).trim();
      return CSS.supports("color", value) ? value : styles.color;
    });
    paint();
  }

  function resize() {
    if (!canvas || !context) return;
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    if (!width || !height) return;
    const ratio = Math.min(
      devicePixelRatio || 1,
      2,
      4096 / Math.max(width, height),
    );
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(
      canvas.width / width,
      0,
      0,
      canvas.height / height,
      0,
      0,
    );
    const columns = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    spanX = columns * CELL;
    spanY = rows * CELL;
    pixels = [];

    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        if (seed(column, row, 1) > density(column / columns, row / rows) * 0.7)
          continue;
        const tone = seed(column, row, 2);
        const direction = (Math.floor(seed(column, row, 3) * 8) * Math.PI) / 4;
        const speed = 5 + seed(column, row, 4) * 16;
        pixels.push({
          x: column * CELL,
          y: row * CELL,
          tone: tone < 0.58 ? 0 : tone < 0.84 ? 1 : tone < 0.96 ? 2 : 3,
          phase: seed(column, row, 5) * Math.PI * 2,
          speedX: Math.cos(direction) * speed,
          speedY: Math.sin(direction) * speed,
          radius: seed(column, row, 6) > 0.5 ? CELL * 2 : 0,
        });
      }
    }
    paint();
  }

  function canAnimate() {
    return (
      visible &&
      !document.hidden &&
      !reducedMotion.matches &&
      !paused &&
      !focused &&
      !hovering
    );
  }

  function tick(time: number) {
    frame = 0;
    if (!canAnimate()) return;
    if (time - last >= STEP) {
      elapsed += last ? Math.min(time - last, STEP * 2) : 0;
      last = time;
      paint();
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (canAnimate()) {
      if (!frame) frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }
  }

  function syncPreference() {
    if (!control) return;
    control.hidden = reducedMotion.matches;
    if (reducedMotion.matches) pointer = undefined;
    paint();
    sync();
  }

  control.addEventListener(
    "click",
    () => {
      paused = !paused;
      control.setAttribute("aria-pressed", String(paused));
      pointer = undefined;
      paint();
      sync();
    },
    listeners,
  );
  root.addEventListener(
    "focusin",
    () => {
      focused = true;
      pointer = undefined;
      paint();
      sync();
    },
    listeners,
  );
  root.addEventListener(
    "focusout",
    (event) => {
      focused =
        event.relatedTarget instanceof Node &&
        root.contains(event.relatedTarget);
      sync();
    },
    listeners,
  );
  root.addEventListener(
    "pointerenter",
    (event) => {
      if (event.pointerType === "touch") return;
      hovering = true;
      sync();
    },
    listeners,
  );
  root.addEventListener(
    "pointermove",
    (event) => {
      if (
        event.pointerType === "touch" ||
        paused ||
        focused ||
        reducedMotion.matches
      )
        return;
      hovering = true;
      sync();
      const rect = root.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (!pointerFrame) {
        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0;
          if (visible && !document.hidden) paint();
        });
      }
    },
    listeners,
  );
  root.addEventListener(
    "pointerleave",
    () => {
      hovering = false;
      pointer = undefined;
      if (visible) paint();
      sync();
    },
    listeners,
  );
  reducedMotion.addEventListener("change", syncPreference, listeners);
  systemTheme.addEventListener("change", readTheme, listeners);
  document.addEventListener("visibilitychange", sync, listeners);

  const size =
    typeof ResizeObserver === "function"
      ? new ResizeObserver(resize)
      : undefined;
  size?.observe(canvas);
  if (!size) window.addEventListener("resize", resize, listeners);
  const intersection =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        })
      : undefined;
  intersection?.observe(root);
  const theme = new MutationObserver(readTheme);
  for (
    let scope: HTMLElement | null = root;
    scope;
    scope = scope.parentElement
  ) {
    theme.observe(scope, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
  }

  readTheme();
  resize();
  syncPreference();
  return () => {
    abort.abort();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(pointerFrame);
    size?.disconnect();
    intersection?.disconnect();
    theme.disconnect();
    control.hidden = true;
    control.setAttribute("aria-pressed", "false");
  };
}
