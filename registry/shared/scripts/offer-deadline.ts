/** Enhances a readable deadline with a per-instance, four-unit clock. */
export function bindDeadline(root: HTMLElement): () => void {
  const end = Date.parse(root.dataset.deadline ?? "");
  const fallback = root.querySelector("time");
  const clock = root.querySelector<HTMLElement>("[data-clock]");
  const closed = root.querySelector<HTMLElement>("[data-closed]");
  const digits = root.querySelectorAll<HTMLElement>("[data-digit]");
  let timer: ReturnType<typeof setTimeout>;
  function update() {
    if (!fallback || !clock || !closed) return;
    const remaining = end - Date.now();
    const seconds = Math.ceil(remaining / 1000);
    closed.hidden = !(seconds <= 0);
    fallback.hidden = !closed.hidden;
    clock.hidden = !(seconds > 0);
    if (clock.hidden) return;
    const values = [
      Math.floor(seconds / 86400),
      Math.floor(seconds / 3600) % 24,
      Math.floor(seconds / 60) % 60,
      seconds % 60,
    ];
    digits.forEach((digit, i) => {
      digit.textContent = String(values[i]).padStart(2, "0");
    });
    timer = setTimeout(update, remaining % 1000 || 1000);
  }
  update();
  return () => clearTimeout(timer);
}
