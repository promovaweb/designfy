/**
 * NomeDoComponente: o que ele faz, em uma frase.
 *
 * Propriedades: ver a interface abaixo.
 * Movimento: o que se move, quando e por quanto tempo; como fica com
 * movimento reduzido.
 *
 * Catálogo de interface: <id da entrada>.
 */
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface NomeDoComponenteProps extends Omit<ComponentProps<"section">, "title"> {
  /** Título do bloco. Renderizado no nível de `headingLevel`. */
  title: string;
  /** Uma frase de apoio. */
  lead?: string;
  /** Nível do título. Padrão 2. */
  headingLevel?: 2 | 3;
  /** Variação visual. Padrão "plain". */
  tone?: "plain" | "muted";
  /** Itens do bloco, na ordem de leitura. */
  items: Array<{ id: string; title: string; description: string; href?: string }>;
  /** Ação exibida ao lado do título. */
  action?: ReactNode;
}

const TONE = {
  plain: "bg-background",
  muted: "bg-muted/60",
} as const;

/** Renderiza o bloco com título, apoio e a lista de itens. */
export function NomeDoComponente({
  title,
  lead,
  headingLevel = 2,
  tone = "plain",
  items,
  action,
  className,
  ...props
}: NomeDoComponenteProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  if (items.length === 0) return null;
  return (
    <section className={cn("df-section", TONE[tone], className)} {...props}>
      <div className="df-container">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4" data-df-reveal>
          <div className="flex max-w-[60ch] flex-col gap-3">
            <Heading className="font-heading text-headline font-semibold text-foreground">{title}</Heading>
            {lead ? <p className="text-lead text-muted-foreground">{lead}</p> : null}
          </div>
          {action}
        </header>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-df-stagger>
          {items.map((item) => (
            <li key={item.id} className="df-lift min-w-0 rounded-xl border border-border bg-card p-6" data-df-reveal>
              <h3 className="font-heading text-title font-semibold text-card-foreground">
                {item.href ? (
                  <a href={item.href} className="after:absolute after:inset-0">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
