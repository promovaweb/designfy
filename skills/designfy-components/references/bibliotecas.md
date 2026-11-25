# Bibliotecas sugeridas

O Designfy mantém um catálogo de bibliotecas com versão conferida. Antes de
instalar qualquer pacote de interface, olhe o catálogo:

```bash
designfy deps list                 # todos os grupos e o estado no projeto
designfy deps list --group forms
designfy deps check                # o que falta nos grupos padrão e nos componentes copiados
designfy deps install forms tables # instala grupos
designfy deps install lenis        # ou um pacote do catálogo
```

## Por necessidade

| Preciso de | Grupo | Pacotes | Observação |
| --- | --- | --- | --- |
| Tailwind e utilidades de classe | `core` | `tailwindcss`, `tw-animate-css`, `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react` | padrão em todo projeto |
| Tailwind no Vite e no Astro | `vite` | `@tailwindcss/vite` | padrão em Astro e Vite |
| animação | `motion` | `motion` | importar de `motion/react`; padrão |
| texto longo e fontes | `typography` | `@tailwindcss/typography`, `@fontsource-variable/inter`, `@fontsource-variable/manrope` | padrão; troque as fontes pelo par do projeto |
| primitivos de interface | `shadcn` | `shadcn` (CLI), `radix-ui` | padrão em React e em Astro com ilhas |
| base alternativa de primitivos | `base-ui` | `@base-ui/react` | só se o projeto escolheu Base UI |
| ilhas React e MDX no Astro | `astro` | `@astrojs/react`, `@astrojs/mdx`, `react`, `react-dom` | padrão em Astro |
| formulários | `forms` | `react-hook-form`, `zod`, `@hookform/resolvers`, `input-otp`, `react-day-picker`, `date-fns` | primeira tela com formulário |
| tabelas de dados | `tables` | `@tanstack/react-table`, `@tanstack/react-virtual` | primeira tabela com ordenação ou filtro |
| gráficos e contadores | `charts` | `recharts`, `@number-flow/react` | primeiro dashboard |
| avisos, paleta de comandos, gaveta | `feedback` | `sonner`, `cmdk`, `vaul` | conforme os primitivos usados |
| vídeo e carrossel | `media` | `lite-youtube-embed`, `lite-vimeo-embed`, `embla-carousel-react` | página com vídeo ou carrossel |
| embeds em conteúdo Astro | `astro-embed` | `astro-embed` | blog em Astro |
| código e Markdown | `content` | `shiki`, `react-markdown` | blog e documentação |
| estado na URL, dado do servidor, tema, painéis | `state` | `nuqs`, `@tanstack/react-query`, `next-themes`, `react-resizable-panels` | sistemas em React |
| rolagem suave | `scroll` | `lenis` | página de venda longa; opcional |
| conversão de cor no código | `color` | `culori` | só quando a cor é calculada em tempo de execução |
| capturas e auditoria | `testing` | `playwright`, `@axe-core/playwright` | necessário para `designfy capture run` |

A tabela completa, com versões e links, está em
[bibliotecas-catalogo.md](bibliotecas-catalogo.md), gerada do catálogo. As
versões estão em `catalog/dependencies.json` e são conferidas no npm a
cada versão do Designfy. Confirme a versão atual antes de fixar:
`npm view <pacote> version`.

## Uma por função

| Função | Escolha do Designfy | Não some outra |
| --- | --- | --- |
| ícones | `lucide-react` | Heroicons, Font Awesome, Tabler juntos |
| animação | `motion` mais CSS | GSAP, AOS, Animate.css juntos |
| formulário | `react-hook-form` com `zod` | Formik, Yup juntos |
| tabela | TanStack Table | AG Grid, MUI DataGrid juntos |
| gráfico | Recharts pelo `chart` do shadcn | Chart.js, ApexCharts juntos |
| data | `date-fns` | Moment, Day.js juntos |
| primitivos | Radix UI ou Base UI | os dois, ou Headless UI junto |

Projeto que já tem outra escolha funcionando mantém a dele. O guia registra
qual é, e os componentes novos seguem.

## Antes de instalar algo fora do catálogo

1. O que ela faz não sai com CSS ou com o que já está instalado?
2. Tem manutenção recente e licença compatível com o projeto?
3. Quanto pesa no pacote do cliente?
4. Funciona com React 19, com Tailwind 4 e com renderização no servidor?
5. Lê o tema por variáveis, ou vai exigir cores próprias?

Com as cinco respostas boas, instale, registre o motivo em `## Notas` do
viewspec e acrescente a `## Componentes` do guia.

## O que não precisa de biblioteca

| Efeito | Como fazer |
| --- | --- |
| revelação ao rolar | `data-df-reveal` (CSS e o runtime do Designfy) |
| faixa rolante | `df-marquee` |
| contador que sobe | `data-df-count`, ou `@number-flow/react` quando o número muda ao vivo |
| sanfona | `details` e `summary`, ou `df-collapse` |
| rolagem suave até âncora | `scroll-behavior: smooth` (já no tema) |
| barra de progresso de leitura | animação ligada à rolagem em CSS (`animation-timeline: scroll()`) com o item `reading-progress` |
| cabeçalho que muda ao rolar | `IntersectionObserver` num sentinela |
| modo escuro | classe em `<html>` e script em linha |
| carrossel simples | `scroll-snap` em CSS |
| dica simples | `title` não serve; use o `tooltip` do shadcn, que já está no projeto |
