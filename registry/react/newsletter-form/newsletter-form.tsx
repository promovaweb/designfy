"use client";

/**
 * NewsletterForm: Validates an email and submits it to a configured endpoint, with honest feedback for every result.
 * Motion: A progress message keeps button width steady and success draws a check.
 * Catalog: newsletter-form
 */
import { cn } from "@designfy/components/lib/cn";
import { useEffect, useRef } from "react";

export interface NewsletterFormProps {
  /** Unique base ID for label and feedback. */
  id: string;
  /** Email field label. */
  label: string;
  /** Submit button text. */
  submitLabel: string;
  /** POST target accepting a form-encoded email field. */
  endpoint?: string;
  /** Optional example email. */
  placeholder?: string;
  /** Consent or subscription disclosure. */
  consent?: string;
  /** Keep the label available only to assistive technology. */
  labelHidden?: boolean;
  /** Message when the email value is invalid. */
  invalidMessage?: string;
  /** Text during the request. */
  pendingMessage?: string;
  /** Confirmation shown after a successful response. */
  successMessage: string;
  /** Message on network or response failure. */
  errorMessage: string;
  /** Message when no endpoint was configured. */
  notConnectedMessage: string;
  /** Additional classes on the root element. */
  className?: string;
}

function bindNewsletterForm(root: HTMLFormElement) {
  const abort = new AbortController();
  const email = root.querySelector<HTMLInputElement>("input[type=email]");
  const submit = root.querySelector<HTMLButtonElement>("button[type=submit]");
  const fields = root.querySelector<HTMLElement>("[data-newsletter-fields]");
  const message = root.querySelector<HTMLElement>("[data-newsletter-result]");
  const check = root.querySelector<SVGElement>("svg");
  if (!email || !submit || !message || !fields || !check) return;
  root.noValidate = true;
  submit.disabled = false;
  const options = { signal: abort.signal };

  function update(state: string, text = "") {
    root.dataset.state = state;
    root.setAttribute("aria-busy", String(state === "submitting"));
    if (email) {
      email.readOnly = state === "submitting";
      email.setAttribute("aria-invalid", String(state === "invalid"));
    }
    if (submit) submit.disabled = state === "submitting";
    if (message) message.textContent = text;
    if (fields) fields.hidden = state === "success";
    if (check) check.classList.toggle("hidden", state !== "success");
  }

  if (root.dataset.state === "submitting") update("idle");

  email.addEventListener(
    "input",
    () => {
      if (root.dataset.state === "invalid" && email.validity.valid)
        update("idle");
    },
    options,
  );
  email.addEventListener(
    "blur",
    () => {
      if (root.dataset.state === "idle" && email.value && !email.validity.valid)
        update("invalid", root.dataset.invalid);
    },
    options,
  );
  root.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();
      if (
        root.dataset.state === "submitting" ||
        root.dataset.state === "success"
      )
        return;
      if (!email.validity.valid) {
        update("invalid", root.dataset.invalid);
        email.focus();
        return;
      }
      const endpoint = root.getAttribute("action");
      if (!endpoint) {
        update("error", root.dataset.disconnected);
        return;
      }
      update("submitting", root.dataset.pending);
      try {
        const body = new URLSearchParams({ email: email.value });
        const response = await fetch(endpoint, {
          method: "POST",
          body,
          signal: abort.signal,
        });
        if (!response.ok) throw new Error("Request failed");
        if (!abort.signal.aborted) {
          update("success", root.dataset.success);
          message.focus();
        }
      } catch {
        if (!abort.signal.aborted) update("error", root.dataset.error);
      }
    },
    options,
  );
  return () => abort.abort();
}

/** Validates an email and submits it to a configured endpoint, with honest feedback for every result. */
export function NewsletterForm({
  id,
  label,
  submitLabel,
  endpoint,
  placeholder,
  consent,
  labelHidden = false,
  invalidMessage = "Enter a valid email address.",
  pendingMessage = "Submitting…",
  successMessage,
  errorMessage,
  notConnectedMessage,
  className,
}: NewsletterFormProps) {
  const root = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindNewsletterForm(root.current);
  }, [endpoint]);
  return (
    <form
      ref={root}
      data-site-newsletter-form
      data-state="idle"
      data-invalid={invalidMessage}
      data-pending={pendingMessage}
      data-success={successMessage}
      data-error={errorMessage}
      data-disconnected={notConnectedMessage}
      action={endpoint}
      method="post"
      className={cn("group min-w-0 text-start", className)}
    >
      <div data-newsletter-fields>
        <label
          htmlFor={id}
          className={cn(
            "mb-2 block text-sm font-semibold",
            labelHidden && "sr-only",
          )}
        >
          {label}
        </label>
        <div className="grid gap-2 min-[480px]:grid-cols-[minmax(0,1fr)_auto]">
          <input
            id={id}
            name="email"
            required
            type="email"
            autoComplete="email"
            placeholder={placeholder}
            aria-describedby={
              consent ? id + "-consent " + id + "-result" : id + "-result"
            }
            className="min-h-12 min-w-0 rounded-lg border border-input bg-background px-4 text-foreground aria-invalid:border-destructive"
          />
          <button
            type="submit"
            disabled={!endpoint}
            className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 relative disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="group-data-[state=submitting]:opacity-0">
              {submitLabel}
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden place-items-center text-xs group-data-[state=submitting]:grid"
            >
              {pendingMessage}
            </span>
          </button>
        </div>
        {consent && (
          <p
            id={id + "-consent"}
            className="mt-2 text-sm text-muted-foreground"
          >
            {consent}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="hidden size-5 text-success"
        >
          <path
            d="m5 12 5 5L20 7"
            pathLength="1"
            strokeDasharray="1"
            className="animate-df-check"
          />
        </svg>
        <p
          data-newsletter-result
          id={id + "-result"}
          role="status"
          tabIndex={-1}
          className="mt-2 text-sm text-muted-foreground empty:mt-0 group-data-[state=error]:text-destructive group-data-[state=invalid]:text-destructive group-data-[state=success]:text-success"
        />
      </div>
      {!endpoint && (
        <noscript>
          <p className="mt-2 text-sm text-muted-foreground">
            {notConnectedMessage}
          </p>
        </noscript>
      )}
    </form>
  );
}
