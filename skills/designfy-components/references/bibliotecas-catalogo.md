<!-- Gerado por scripts/sync-skill-assets.ts. Não edite à mão. -->

# Bibliotecas do catálogo

Grupos de dependências do catálogo, com a versão esperada, o motivo em inglês e
o link de cada pacote. Sai de `catalog/dependencies.json`; liste com `designfy deps list`.

## Core (`core`)

Instalado por padrão: sim. Frameworks: todos. Tailwind CSS 4 and the class utilities every Designfy component imports.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `tailwindcss` | `^4.3.5` | não | Utility-first CSS engine with tokens declared in @theme. | [tailwindcss.com](https://tailwindcss.com) |
| `tw-animate-css` | `^1.4.0` | não | Animation utilities used by shadcn components on Tailwind 4. | [github.com](https://github.com/Wombosvideo/tw-animate-css) |
| `clsx` | `^2.1.1` | não | Conditional class names. | [github.com](https://github.com/lukeed/clsx) |
| `tailwind-merge` | `^3.7.1` | não | Merges Tailwind classes without conflicts, behind the cn() helper. | [github.com](https://github.com/dcastil/tailwind-merge) |
| `class-variance-authority` | `^0.7.1` | não | Typed component variants. | [cva.style](https://cva.style) |
| `lucide-react` | `^1.79.0` | não | Icon set used by shadcn and by the registry. | [lucide.dev](https://lucide.dev) |

## Tailwind for Vite (`vite`)

Instalado por padrão: sim. Frameworks: `astro`, `react-vite`. Tailwind 4 plugin for Astro and React with Vite.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `@tailwindcss/vite` | `^4.3.5` | não | Vite plugin that compiles Tailwind 4. | [tailwindcss.com](https://tailwindcss.com/docs/installation/using-vite) |

## Motion (`motion`)

Instalado por padrão: sim. Frameworks: todos. Animation library behind the moving components of the registry.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `motion` | `^14.14.0` | não | Motion for React and vanilla: entrance, scroll, layout and gesture animation. Import from motion/react. | [motion.dev](https://motion.dev) |

## Typography (`typography`)

Instalado por padrão: sim. Frameworks: todos. Prose styles and the variable fonts of the default theme.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `@tailwindcss/typography` | `^0.5.20` | não | The prose classes for long-form text. | [github.com](https://github.com/tailwindlabs/tailwindcss-typography) |
| `@fontsource-variable/inter` | `^5.3.0` | não | Inter variable, self-hosted, for body text and interface. | [fontsource.org](https://fontsource.org/fonts/inter) |
| `@fontsource-variable/manrope` | `^5.3.0` | não | Manrope variable, self-hosted, for headings. | [fontsource.org](https://fontsource.org/fonts/manrope) |

## shadcn/ui (`shadcn`)

Instalado por padrão: sim. Frameworks: `react`, `react-vite`, `next`, `astro`. The shadcn CLI and the primitives its components are built on.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `shadcn` | `^4.23.0` | sim | CLI that copies components from shadcn, ReUI and any compatible registry. | [ui.shadcn.com](https://ui.shadcn.com) |
| `radix-ui` | `^1.8.1` | não | Accessible unstyled primitives used by shadcn components. | [www.radix-ui.com](https://www.radix-ui.com) |

## Base UI (`base-ui`)

Instalado por padrão: não. Frameworks: `react`, `react-vite`, `next`, `astro`. Alternative primitive library supported by shadcn and ReUI.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `@base-ui/react` | `^1.9.0` | não | Unstyled accessible primitives from the Base UI team. | [base-ui.com](https://base-ui.com) |

## Astro islands (`astro`)

Instalado por padrão: sim. Frameworks: `astro`. React islands and MDX inside an Astro site.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `@astrojs/react` | `^7.1.9` | não | Renders and hydrates React components in Astro. | [docs.astro.build](https://docs.astro.build/en/guides/integrations-guide/react/) |
| `@astrojs/mdx` | `^8.1.6` | não | MDX content with components. | [docs.astro.build](https://docs.astro.build/en/guides/integrations-guide/mdx/) |
| `react` | `^19.3.1` | não | React runtime for the islands. | [react.dev](https://react.dev) |
| `react-dom` | `^19.3.1` | não | React DOM renderer. | [react.dev](https://react.dev) |

## Forms (`forms`)

Instalado por padrão: não. Frameworks: `react`, `react-vite`, `next`, `astro`. Form state, validation and the specialized inputs.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `react-hook-form` | `^7.92.0` | não | Form state with uncontrolled inputs. | [react-hook-form.com](https://react-hook-form.com) |
| `zod` | `^4.6.7` | não | Schema validation shared by client and server. | [zod.dev](https://zod.dev) |
| `@hookform/resolvers` | `^7.0.9` | não | Connects Zod schemas to react-hook-form. | [github.com](https://github.com/react-hook-form/resolvers) |
| `input-otp` | `^1.5.0` | não | One-time code input. | [input-otp.rodz.dev](https://input-otp.rodz.dev) |
| `react-day-picker` | `^10.0.2` | não | Calendar and date range picker. | [daypicker.dev](https://daypicker.dev) |
| `date-fns` | `^4.4.0` | não | Date formatting and arithmetic. | [date-fns.org](https://date-fns.org) |

## Tables (`tables`)

Instalado por padrão: não. Frameworks: `react`, `react-vite`, `next`, `astro`. Data tables with sorting, filtering, pagination and virtual rows.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `@tanstack/react-table` | `^9.3.1` | não | Headless table engine. | [tanstack.com](https://tanstack.com/table) |
| `@tanstack/react-virtual` | `^3.14.28` | não | Row and column virtualization for long lists. | [tanstack.com](https://tanstack.com/virtual) |

## Charts and counters (`charts`)

Instalado por padrão: não. Frameworks: `react`, `react-vite`, `next`, `astro`. Charts for dashboards and animated numbers for counters.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `recharts` | `^3.11.1` | não | Chart library used by the shadcn chart component. | [recharts.org](https://recharts.org) |
| `@number-flow/react` | `^0.6.2` | não | Animated number transitions for counters and stats. | [number-flow.barvian.me](https://number-flow.barvian.me) |

## Feedback and overlays (`feedback`)

Instalado por padrão: não. Frameworks: `react`, `react-vite`, `next`, `astro`. Toasts, command palette and drawers.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `sonner` | `^2.0.8` | não | Toast notifications. | [sonner.emilkowal.ski](https://sonner.emilkowal.ski) |
| `cmdk` | `^1.1.1` | não | Command palette. | [cmdk.paco.me](https://cmdk.paco.me) |
| `vaul` | `^1.1.2` | não | Drawer for touch screens. | [vaul.emilkowal.ski](https://vaul.emilkowal.ski) |

## Media and embeds (`media`)

Instalado por padrão: não. Frameworks: todos. Video embeds that load on click and carousels.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `lite-youtube-embed` | `^0.4.0` | não | YouTube embed that loads the player only after the click. | [github.com](https://github.com/paulirish/lite-youtube-embed) |
| `lite-vimeo-embed` | `^0.3.0` | não | Vimeo embed with the same facade pattern. | [github.com](https://github.com/luwes/lite-vimeo-embed) |
| `embla-carousel-react` | `^8.6.0` | não | Carousel engine used by the shadcn carousel. | [www.embla-carousel.com](https://www.embla-carousel.com) |

## Astro embeds (`astro-embed`)

Instalado por padrão: não. Frameworks: `astro`. Embed components for Astro content.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `astro-embed` | `^0.14.0` | não | YouTube, Vimeo and link preview components for Astro and MDX. | [astro-embed.netlify.app](https://astro-embed.netlify.app) |

## Content rendering (`content`)

Instalado por padrão: não. Frameworks: todos. Code highlighting and Markdown rendering for articles and docs.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `shiki` | `^4.6.0` | não | Syntax highlighting with editor themes. | [shiki.style](https://shiki.style) |
| `react-markdown` | `^10.1.0` | não | Renders Markdown as React components. | [github.com](https://github.com/remarkjs/react-markdown) |

## State and layout (`state`)

Instalado por padrão: não. Frameworks: `react`, `react-vite`, `next`. URL state, server state, theme switch and resizable panels for system screens.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `nuqs` | `^2.10.3` | não | Filters, sorting and pagination kept in the URL. | [nuqs.dev](https://nuqs.dev) |
| `@tanstack/react-query` | `^5.108.4` | não | Server state: cache, loading and error states. | [tanstack.com](https://tanstack.com/query) |
| `next-themes` | `^0.4.6` | não | Light, dark and system theme switch without flash. | [github.com](https://github.com/pacocoursey/next-themes) |
| `react-resizable-panels` | `^4.24.2` | não | Resizable panel groups. | [github.com](https://github.com/bvaughn/react-resizable-panels) |

## Smooth scroll (`scroll`)

Instalado por padrão: não. Frameworks: todos. Smooth scrolling for long marketing pages.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `lenis` | `^1.3.28` | não | Smooth scroll that keeps native scroll semantics. | [lenis.darkroom.engineering](https://lenis.darkroom.engineering) |

## Color (`color`)

Instalado por padrão: não. Frameworks: todos. Color conversion in the project code.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `culori` | `^4.0.2` | não | Color spaces, interpolation and gamut mapping, including OKLCH. | [culorijs.org](https://culorijs.org) |

## Captures and audits (`testing`)

Instalado por padrão: não. Frameworks: todos. Browser automation for designfy capture and accessibility audits.

| Pacote | Versão | Dev | Para que serve | Link |
| --- | --- | --- | --- | --- |
| `playwright` | `^1.65.1` | sim | Runs the browsers behind designfy capture. After installing, run npx playwright install chromium. | [playwright.dev](https://playwright.dev) |
| `@axe-core/playwright` | `^4.14.1` | sim | Automated accessibility checks on the rendered page. | [github.com](https://github.com/dequelabs/axe-core-npm) |
