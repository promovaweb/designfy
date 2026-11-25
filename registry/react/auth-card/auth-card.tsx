"use client";

/** Auth forms for sign-in, sign-up, recovery and verification with an optional brand panel. Motion: initial rise and flow slide. Catalog: auth-card. */
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Background } from "@designfy/components/background/background";
import { cn } from "@designfy/components/lib/cn";

type Mode = "sign-in" | "sign-up" | "recover" | "verify";
export interface AuthCardProps {
  /** Current auth workflow. */
  mode: Mode;
  /** Main heading. */
  title: string;
  /** Supporting instructions. */
  description?: string;
  /** Heading level. */
  headingLevel?: 1 | 2 | 3;
  /** Submit label. */
  submitLabel: string;
  /** Called with values appropriate to the current workflow. */
  onSubmit: (values: { email?: string; password?: string; code?: string }) => Promise<void>;
  /** Generic rejection message shared across credential failures. */
  errorMessage?: string;
  /** Success message displayed after a successful submit. */
  successMessage?: string;
  /** Logo or wordmark. */
  logo?: ReactNode;
  /** Third-party provider buttons. */
  providers?: ReactNode;
  /** Links to alternative flows. */
  alternate?: ReactNode;
  /** Legal footer such as terms and privacy links. */
  legal?: ReactNode;
  /** When provided, open a split layout with the supplied brand and preset. */
  brand?: { content: ReactNode; preset: React.ComponentProps<typeof Background>["preset"] };
  /** Additional classes. */
  className?: string;
}

function AuthForm({ mode, submitLabel, onSubmit, errorMessage, successMessage }: Pick<AuthCardProps, "mode" | "submitLabel" | "onSubmit" | "errorMessage" | "successMessage">) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<"idle" | "invalid" | "submitting" | "error" | "success">("idle");
  const password = mode === "sign-in" || mode === "sign-up";
  const busy = state === "submitting";
  const invalid = state === "invalid";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!event.currentTarget.checkValidity()) {
      setState("invalid");
      event.currentTarget.querySelector<HTMLInputElement>(":invalid")?.focus();
      return;
    }
    const form = new FormData(event.currentTarget);
    setState("submitting");
    try {
      await onSubmit({
        email: form.has("email") ? String(form.get("email")) : undefined,
        password: password ? String(form.get("password")) : undefined,
        code: mode === "verify" ? String(form.get("code")) : undefined,
      });
      setState("success");
    } catch { setState("error"); }
  }
  return <form noValidate aria-busy={busy || undefined} onSubmit={(event) => void submit(event)} onChange={() => { if (state === "invalid" || state === "error" || state === "success") setState("idle"); }} className="grid gap-4">
    {mode !== "verify" && <div className="grid gap-2"><Label htmlFor={`${id}-email`}>Email</Label><Input required type="email" name="email" id={`${id}-email`} autoComplete="username" className="min-h-11" disabled={busy} /></div>}
    {password && <div className="grid gap-2">
      <Label htmlFor={`${id}-password`}>Password</Label>
      <div className="relative">
        <Input required minLength={mode === "sign-up" ? 8 : undefined} type={visible ? "text" : "password"} name="password" id={`${id}-password`} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} className="min-h-11 pe-12" disabled={busy} />
        <Button type="button" variant="ghost" size="icon" aria-label={visible ? "Hide password" : "Show password"} className="df-press absolute inset-e-0 top-0 size-11" onClick={() => setVisible(!visible)}>{visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}</Button>
      </div>
    </div>}
    {mode === "verify" && <div className="grid gap-2"><Label htmlFor={`${id}-code`}>One-time code</Label><Input required type="text" name="code" id={`${id}-code`} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} className="min-h-11 font-mono tracking-widest" disabled={busy} /></div>}
    {(invalid || state === "error") && <p role="alert" className="text-sm text-destructive">{invalid ? (mode === "verify" ? "Enter the six-digit code." : "Check the required fields and try again.") : errorMessage ?? "We couldn’t complete that request. Check your details and try again."}</p>}
    {state === "success" && <p role="status" className="text-sm text-success">{successMessage ?? "Request completed."}</p>}
    <Button disabled={busy} type="submit" className="df-press min-h-11 w-full" aria-busy={busy || undefined}>{busy ? "Working…" : submitLabel}</Button>
  </form>;
}

/** Provides a focused form and optional split brand treatment. */
export function AuthCard({ mode, title, description, headingLevel = 1, submitLabel, onSubmit, errorMessage, successMessage, logo, providers, alternate, legal, brand, className }: AuthCardProps) {
  const Heading = `h${headingLevel}` as const;
  return <section className={cn("grid min-h-svh min-w-0 items-center bg-background", brand && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]", className)}>
    <div className={cn("mx-auto w-full max-w-114 space-y-7 p-5 motion-safe:animate-df-fade-up sm:p-8", !brand && "sm:rounded-xl sm:border sm:border-border sm:bg-card")}>
      {logo && <div>{logo}</div>}
      <div key={mode} className="grid gap-5 motion-safe:animate-df-slide-in-right">
        <header className="space-y-2"><Heading className="font-heading text-headline font-semibold leading-tight">{title}</Heading>{description && <p className="text-sm text-muted-foreground">{description}</p>}</header>
        {providers && <div className="grid gap-2">{providers}</div>}
        <AuthForm mode={mode} submitLabel={submitLabel} onSubmit={onSubmit} errorMessage={errorMessage} successMessage={successMessage} />
        {alternate && <div className="text-sm text-muted-foreground">{alternate}</div>}
      </div>
      {legal && <footer className="border-t border-border pt-4 text-xs text-muted-foreground">{legal}</footer>}
    </div>
    {brand && <Background preset={brand.preset} fade="edges" className="hidden h-full lg:grid lg:items-center"><div className="mx-auto max-w-xl p-12">{brand.content}</div></Background>}
  </section>;
}
