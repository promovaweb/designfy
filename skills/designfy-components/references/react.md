# React

Regras para os componentes React do Designfy, em Vite, Next.js e ilhas do
Astro. React 19.

## Servidor e cliente

Em Next.js (App Router) todo componente é de servidor até pedir o
contrário. Ponha `"use client"` só no arquivo que usa estado, efeito,
evento do navegador ou `motion/react`.

- Seção estática com revelação em CSS (`data-df-reveal`): servidor.
- Componente com `motion/react`, formulário controlado, menu, tabela com
  ordenação: cliente.
- Mantenha a fronteira baixa: a página é de servidor e importa ilhas de
  cliente pequenas. Passe dado serializável pela fronteira.

Em Vite tudo é cliente; o cuidado é com o tamanho do pacote: importe
componente pesado (gráfico, editor) com `lazy`.

## Forma de um componente

```tsx
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends Omit<ComponentProps<"article">, "title"> {
  /** Nome do indicador. */
  label: string;
  /** Valor já formatado. */
  value: ReactNode;
  /** Variação contra o período anterior. */
  change?: { value: string; direction: "up" | "down" | "flat" };
}

export function StatCard({ label, value, change, className, ...props }: StatCardProps) {
  return (
    <article className={cn("rounded-xl border bg-card p-5", className)} {...props}>
      …
    </article>
  );
}
```

- Função nomeada com exportação nomeada. Sem exportação padrão.
- Propriedades tipadas, com comentário em cada uma.
- `className` mesclado por último; o resto das propriedades nativas
  repassado ao elemento raiz.
- No React 19, `ref` é propriedade comum: não precisa de `forwardRef`.
- Sem `any`. Dado de domínio com tipo próprio.

## Estado

| Tipo de estado | Onde mora |
| --- | --- |
| aberto ou fechado, aba ativa local | `useState` no componente |
| filtro, ordenação, página, aba que é lugar | URL (`nuqs`, ou os parâmetros do roteador) |
| dado do servidor | TanStack Query, ou componentes de servidor e ações |
| formulário | `react-hook-form` com esquema `zod` |
| tema claro e escuro | classe em `<html>` (`next-themes` ou script do `theme-toggle`) |
| preferência de movimento | `useReducedMotion()` de `motion/react` |

Não copie propriedade para estado. Valor que dá para calcular na
renderização não vira `useState` nem `useEffect`.

## Efeitos

`useEffect` é para sincronizar com algo de fora do React: observador,
temporizador, evento do `window`. Todo efeito limpa o que criou. Buscar
dado, derivar valor e reagir a evento de usuário não são casos de efeito.

## Listas

- `key` estável e do dado (`id`), nunca o índice quando a lista reordena.
- Lista com mais de algumas centenas de linhas: paginação ou
  virtualização (`@tanstack/react-virtual`).

## Composição com shadcn

```tsx
<Button asChild>
  <a href="/cursos/">Ver cursos</a>
</Button>
```

`asChild` passa o estilo para o elemento filho, para um botão que é link
continuar sendo `<a>`. Os primitivos expõem `data-state`, `data-slot` e
atributos ARIA: estilize por eles.

## Movimento

```tsx
"use client";
import { motion, useReducedMotion, AnimatePresence, LayoutGroup } from "motion/react";
```

- Importe de `motion/react`. O pacote é `motion`; `framer-motion` é o nome
  antigo.
- Entrada e hover simples ficam em CSS. `motion/react` entra para saída
  animada (`AnimatePresence`), indicador compartilhado (`layoutId`),
  reordenação (`layout`), gesto e número com mola.
- Sempre leia `useReducedMotion()` e renda o estado final quando for
  verdadeiro.

## Formulários

```tsx
const form = useForm<Values>({ resolver: zodResolver(schema), mode: "onBlur" });
```

Valida ao sair do campo, mostra o erro abaixo dele com `aria-invalid` e
`aria-describedby`, e no envio com falha foca o resumo de erros. A
estrutura é a do `field` do shadcn; o desenho da tela é da
`designfy-webapps`.

## Acesso a dado na tela

O componente de tela recebe os três estados e nunca rende só o caminho
feliz:

```tsx
if (query.isPending) return <OrdersSkeleton />;
if (query.isError) return <ErrorState title="Não foi possível carregar os pedidos" onRetry={query.refetch} />;
if (query.data.length === 0) return <EmptyState … />;
return <OrdersTable rows={query.data} />;
```

## Em ilha do Astro

O mesmo componente React funciona numa ilha. Ele não recebe função nem
componente como propriedade vinda do Astro (só dado serializável), e o
contexto do React não atravessa ilhas: cada ilha é uma árvore. Veja
[astro.md](astro.md).
