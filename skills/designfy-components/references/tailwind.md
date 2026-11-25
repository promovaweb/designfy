# Tailwind 4 em componentes

O que muda no Tailwind 4 e como escrever classes que seguem o tema.
Confira a sintaxe na documentação atual (<https://tailwindcss.com/docs>)
antes de afirmar algo que não está aqui.

## O que é diferente da versão 3

| Tema | Tailwind 4 |
| --- | --- |
| configuração | no CSS, com `@theme`; sem `tailwind.config.js` |
| entrada | `@import "tailwindcss";` |
| build | plugin `@tailwindcss/vite` (Astro, Vite) ou `@tailwindcss/postcss` (Next.js) |
| tokens | variáveis CSS; `--color-*` vira `bg-*`, `text-*`, `border-*`; `--font-*` vira `font-*`; `--text-*` vira `text-*`; `--radius-*` vira `rounded-*`; `--ease-*` vira `ease-*`; `--animate-*` vira `animate-*`; `--breakpoint-*` vira prefixo |
| modo escuro por classe | `@custom-variant dark (&:where(.dark, .dark *));` |
| plugin | `@plugin "@tailwindcss/typography";` no CSS |
| utilidade própria | `@utility nome { ... }` |
| animações do shadcn | `tw-animate-css` no lugar de `tailwindcss-animate` |
| valor de variável em classe | `duration-(--duration-base)`, `top-(--header-height)`, `bg-(--minha-cor)` |
| consultas de contêiner | embutidas: `@container` no pai, `@md:` no filho |

## Classes de papel

| Em vez de | Use |
| --- | --- |
| `bg-white`, `bg-slate-950` | `bg-background`, `bg-card` |
| `text-gray-900` | `text-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `bg-indigo-600 text-white` | `bg-primary text-primary-foreground` |
| `border-gray-200` | `border-border` |
| `ring-indigo-500` | `ring-ring` |
| `bg-red-50 text-red-700` | `bg-destructive/10 text-destructive` |
| `bg-gray-100` | `bg-muted` ou `bg-secondary` |
| `dark:bg-slate-900` | nada: o papel já troca |
| `font-[Inter]` | `font-sans`, `font-heading` |

Opacidade de um papel: `bg-primary/10`, `border-foreground/15`,
`text-foreground/80`. Em CSS:
`color-mix(in oklab, var(--primary) 18%, transparent)`.

## Estados e variantes úteis

| Preciso | Classe |
| --- | --- |
| hover só onde existe ponteiro | `hover:` (o Tailwind 4 já aplica `@media (hover: hover)`) |
| foco de teclado | `focus-visible:` |
| estado por atributo | `data-[state=open]:`, `aria-invalid:`, `aria-selected:`, `disabled:` |
| reagir ao pai | `group` no pai e `group-hover:`, `group-data-[collapsed]:` no filho |
| reagir ao irmão | `peer` e `peer-invalid:` |
| pai que contém algo | `has-[:checked]:`, `has-[[data-slot=icon]]:` |
| movimento permitido ou reduzido | `motion-safe:`, `motion-reduce:` |
| estado inicial de uma entrada | `starting:` (gera `@starting-style`) |
| transição de `display` | `transition-discrete` |
| largura do contêiner | `@container` no pai; `@sm:`, `@md:`, `@lg:` no filho |
| ponteiro grosso (toque) | `pointer-coarse:` |

## Transições e animações

```html
<button class="transition-colors duration-(--duration-fast) ease-out-quart hover:bg-primary/90">
<div class="transition-transform duration-(--duration-base) ease-out-expo hover:-translate-y-0.5">
<div class="animate-df-fade-up [animation-delay:120ms]">
<dialog class="transition-discrete starting:opacity-0 starting:scale-95 open:opacity-100">
```

- Liste a propriedade: `transition-colors`, `transition-transform`,
  `transition-opacity`, `transition-shadow`, ou
  `transition-[transform,opacity]`. Nunca `transition-all`.
- Duração e curva pelos tokens: `duration-(--duration-base)`,
  `ease-out-expo`, `ease-out-quart`.
- As animações do Designfy têm o prefixo `animate-df-`. As do Tailwind
  (`animate-spin`, `animate-pulse`, `animate-ping`, `animate-bounce`)
  servem para carregamento; `animate-bounce` não entra em estado de
  interface.

## Layout sem surpresa

- Grade com conteúdo que pode ser largo:
  `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]` ou `min-w-0` no filho.
- Item de flex que precisa encolher: `min-w-0`; ícone e avatar:
  `shrink-0`.
- Altura de tela: `min-h-svh` ou `min-h-dvh`, não `h-screen`.
- Tamanho quadrado: `size-10`.
- Proporção: `aspect-video`, `aspect-[4/3]`.
- Truncar: `truncate` em uma linha, `line-clamp-2` em várias.
- Nada de `w-screen` nem largura em `100vw`.

## Organização das classes

- Ordem de leitura: layout, caixa, tipografia, cor, estado, movimento. O
  Prettier com o plugin do Tailwind ordena sozinho.
- Classe condicional com `cn()`:

  ```tsx
  className={cn("rounded-lg border bg-card p-6", selected && "border-primary", className)}
  ```

- Conjunto de classes que se repete vira componente, não `@apply`. Use
  `@utility` só para padrão que atravessa componentes (`df-container`,
  `df-lift`).
- Valor arbitrário (`w-[37px]`) é sinal de layout mal resolvido. Aceitável
  para medida de texto (`max-w-[60ch]`) e para ler variável.

## Detectar classes

O Tailwind lê os arquivos do projeto para achar classes. Classe montada por
concatenação (`"bg-" + cor`) não é encontrada: use um mapa de strings
completas.

```ts
const TONE = { success: "bg-success/15 text-success", warning: "bg-warning/15 text-warning" } as const;
```

Componentes fora da pasta do projeto (um pacote) precisam de
`@source "../caminho"` no CSS de entrada.
