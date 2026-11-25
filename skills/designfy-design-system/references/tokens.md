# Tokens e ligação com o Tailwind 4

O arquivo de tokens é um CSS com três blocos: os valores por tema (`:root`
e `.dark`), a ponte para o Tailwind (`@theme inline`) e os tokens que não
mudam com o tema (`@theme`). O modelo completo está em
[assets/tema-inicial.css](../assets/tema-inicial.css).

## Anatomia

```css
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: oklch(0.985 0.004 195);
  --foreground: oklch(0.21 0.02 215);
  --primary: oklch(0.47 0.085 192);
  --primary-foreground: oklch(0.985 0.01 190);
  --radius: 0.625rem;
  --df-font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
}

.dark {
  --background: oklch(0.17 0.018 215);
  --foreground: oklch(0.95 0.01 195);
  --primary: oklch(0.8 0.12 185);
  --primary-foreground: oklch(0.18 0.03 200);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius-lg: var(--radius);
  --font-sans: var(--df-font-sans);
}

@theme {
  --text-display: clamp(2.5rem, 1.6rem + 4vw, 4.5rem);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

- `:root` e `.dark` guardam os **valores**. É o único lugar com `oklch()`.
- `@theme inline` cria as utilidades (`bg-background`, `text-primary`) que
  apontam para as variáveis. O `inline` faz a utilidade ler a variável no
  ponto de uso, então a classe `.dark` troca tudo sem recompilar.
- `@theme` guarda tokens fixos: escala de títulos, curvas, animações.
- `@custom-variant dark` liga a variante `dark:` à classe `.dark`.

## Papéis de cor

Os nomes seguem o shadcn. Cada superfície tem o seu par de texto.

| Papel | Uso | Par |
| --- | --- | --- |
| `background` | fundo da página | `foreground` |
| `card` | cartão e painel | `card-foreground` |
| `popover` | menu, diálogo, dica | `popover-foreground` |
| `muted` | faixa tingida, fundo de bloco secundário | `muted-foreground` (também sobre `background`) |
| `primary` | ação principal, link, item ativo | `primary-foreground` |
| `secondary` | ação secundária preenchida | `secondary-foreground` |
| `accent` | realce de hover, destaque suave | `accent-foreground` |
| `destructive` | perda de dados, erro | `destructive-foreground` |
| `success`, `warning`, `info` | estados | `*-foreground` |
| `border` | linhas e contornos | sobre a superfície, 3:1 quando delimita um campo |
| `input` | borda de campo | sobre `background` e `card` |
| `ring` | anel de foco | 3:1 contra o que está atrás |
| `chart-1` a `chart-5` | séries de gráfico | distinguíveis entre si e de `card` |
| `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring` | shell de sistema | pares próprios |

`success`, `warning` e `info` não existem no shadcn padrão; o Designfy os
acrescenta porque toda tela de sistema precisa deles. Papel novo entra com
o seu `*-foreground`, nos dois temas, e com a linha em `@theme inline`.

## Tokens de tipo, forma, layout e movimento

| Token | Função |
| --- | --- |
| `--df-font-sans`, `--df-font-heading`, `--df-font-mono` | famílias; viram `font-sans`, `font-heading`, `font-mono` |
| `--text-display`, `--text-headline`, `--text-title`, `--text-lead` | escala fluida de títulos e do parágrafo de abertura |
| `--radius` | raio base; gera `rounded-sm` a `rounded-2xl` |
| `--container-max`, `--gutter`, `--section-space`, `--header-height` | largura, margens e ritmo; usados por `df-container` e `df-section` |
| `--duration-instant`, `--duration-fast`, `--duration-base`, `--duration-slow`, `--duration-slower` | durações |
| `--stagger`, `--reveal-distance` | intervalo entre itens e distância da entrada |
| `--ease-out-quart`, `--ease-out-expo`, `--ease-in-quart`, `--ease-in-out-quart`, `--ease-spring` | curvas; viram `ease-out-expo` e as demais |

## Ligar no projeto

### Astro

```bash
designfy deps install core vite typography
```

```js
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({ vite: { plugins: [tailwindcss()] } });
```

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/inter";
@import "@fontsource-variable/manrope";
@import "./designfy-theme.css";
@import "./designfy-motion.css";
@import "./designfy-backgrounds.css";
@plugin "@tailwindcss/typography";
```

Importe `global.css` no layout base. Para evitar o clarão de tema, um
script em linha no `<head>` aplica a classe `.dark` antes da pintura (o
componente `theme-toggle` traz esse script).

### React com Vite

O mesmo plugin `@tailwindcss/vite` em `vite.config.ts` e o mesmo CSS de
entrada, importado em `src/main.tsx`.

### Next.js

Tailwind 4 pelo PostCSS (`@tailwindcss/postcss`), com o CSS de entrada em
`app/globals.css`. As fontes podem vir de `next/font`: aponte
`--df-font-sans` e `--df-font-heading` para as variáveis que ele cria.

### Projeto que já tem shadcn

O `components.json` aponta o CSS do tema. O arquivo já tem `:root`, `.dark`
e `@theme inline` no mesmo formato. Não crie um segundo arquivo: acrescente
ao existente o que falta (`success`, `warning`, `info`, a escala de
títulos, os tokens de layout e de movimento) e registre o caminho em
`tokensFile`.

## Conferir

```bash
designfy theme show            # o que o Designfy leu do arquivo
designfy theme show --group colors
designfy theme check           # contraste dos pares e papéis que faltam
```

`theme show` segue os `@import` locais; se um papel não aparece, o arquivo
não está na cadeia de imports do CSS de entrada.

## Erros comuns

| Sintoma | Causa | Correção |
| --- | --- | --- |
| `bg-primary` não gera classe | falta a linha `--color-primary` em `@theme inline` | acrescente a linha |
| modo escuro não troca | faltou `@custom-variant dark` ou a classe está em outro elemento | declare a variante e ponha `.dark` em `<html>` |
| fonte cai no padrão do sistema | pacote de fonte não importado ou nome da família diferente | importe o pacote e use o nome que ele declara ("Inter Variable") |
| `font-sans` em laço | `--font-sans: var(--font-sans)` | os valores usam o prefixo `--df-font-*` e o `@theme inline` aponta para eles |
| cor diferente entre componentes | componente com cor literal | troque pelo papel; `bun run registry:check` aponta no registro |
