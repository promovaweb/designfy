# Registry conventions

Rules every item of the Designfy registry follows. `bun run registry:check`
enforces the ones a script can read; review enforces the rest.

## Layout of the registry

```text
registry/
  shared/            files used by both frameworks (styles, scripts, backgrounds)
  react/
    registry.json    shadcn registry format
    lib/             cn and small helpers
    <item>/          one folder per item, kebab-case file names
  astro/
    registry.json
    <item>/          PascalCase .astro files
```

An item exists in both frameworks with the same name, the same props and the
same markup structure, unless it only makes sense in one (data table with
client state is React only; an Astro project uses it as an island).

## Theme only

- Colors, fonts, radius and motion come from `shared/styles/designfy-theme.css`.
  Use the role utilities: `bg-background`, `text-foreground`, `bg-card`,
  `text-muted-foreground`, `bg-primary text-primary-foreground`,
  `border-border`, `ring-ring`, `font-heading`, `font-sans`, `rounded-lg`.
- Never a literal color (`#fff`, `rgb()`, `oklch()`), a fixed palette class
  (`bg-indigo-500`, `text-gray-900`), an arbitrary color (`bg-[#0af]`) or a
  literal `font-family`.
- Transparency of a role: `bg-primary/10`, `border-foreground/15`, or
  `color-mix(in oklab, var(--primary) 18%, transparent)` in CSS.
- No `dark:` color overrides: the roles already change with the theme.
  `dark:` is allowed only for non-color differences (an image swap).
- Type sizes: `text-display`, `text-headline`, `text-title`, `text-lead` for
  headings and leads, Tailwind defaults for the rest.
- Spacing only from the Tailwind scale. Section rhythm with `df-section`,
  width with `df-container`, reading width with `df-measure`.

## Content comes from props

- No real-looking copy inside a component. Text, links, images and numbers
  arrive through props or slots. Required content is a required prop.
- No invented metric, testimonial, logo or person. Examples use obviously
  sample data and live in `examples/`, never in the component.
- Optional regions render nothing when their prop is missing; no empty
  wrappers, no placeholder boxes.

## Structure and semantics

- One root element per component, with `className` (React) or `class`
  (Astro) merged last through `cn`.
- Semantic HTML first: `header`, `nav`, `main`, `section`, `article`,
  `footer`, `ul`, `ol`, `dl`, `table`, `button`, `a`.
- A section takes its heading through a `title` prop and renders it at the
  level given by `headingLevel` (default 2). Never an eyebrow label above a
  heading.
- Image-bearing grid tracks use `minmax(0, 1fr)` (`grid-cols-[minmax(0,1fr)_...]`
  or `min-w-0` on the children).
- Interactive targets are at least 44 by 44 px on touch (`min-h-11`).
- Every interactive element keeps the global `:focus-visible` outline; do
  not remove outlines.
- Icons come from `lucide-react` (React) or inline SVG passed by slot
  (Astro), always `aria-hidden` when decorative.

## Motion is the default

- Every item marked `meta.motion: true` moves with a purpose: entrance,
  response to pointer and focus, state change, or scroll.
- CSS first. Use the utilities and tokens of
  `shared/styles/designfy-motion.css`: `data-df-reveal`, `data-df-stagger`,
  `animate-df-*`, `df-lift`, `df-press`, `df-underline`, `df-collapse`,
  `df-marquee`, `df-shimmer`, `ease-out-expo`, `duration-(--duration-base)`.
- React items use `motion/react` only when CSS cannot do it: layout
  animation (shared indicator, reordering), presence (exit animations),
  gesture-driven motion, number springs. Import from `motion/react`, never
  from `framer-motion`.
- Only `transform`, `opacity`, `clip-path`, `mask` and `background-position`
  animate. Never `transition-all`, never `width`, `height`, `top`, `left`,
  `margin` or `padding`.
- Content is visible without JavaScript. Reveals hide only under `.js`.
- Loops pause on hover and focus and off screen, and stop under
  `prefers-reduced-motion: reduce`. React items read
  `useReducedMotion()` and render the final state.
- One hover signal per element, on the container, never on the image alone.

## Responsive

- Mobile first. The base classes are the 390 px layout; `sm`, `md`, `lg`,
  `xl` add columns.
- No horizontal scroll from 320 to 1920 px. Wide content (tables, code)
  scrolls inside its own box.
- Use container queries (`@container`, `@md:`) for items placed in columns
  of unknown width (cards, stat cards, tables).
- The container is capped (`df-container`); grids keep their column count
  above 1440 px.

## Files and metadata

- TypeScript, typed props with JSDoc on every prop, a header comment that
  states the purpose, the props and the motion of the item.
- React: function components, named exports, no default export, `"use client"`
  only in files that use state, effects or motion.
- Astro: props through `interface Props`, slots documented in the header,
  scripts inline and idempotent (safe to run again on `astro:page-load`).
- Imports of other Designfy files use the marker `@designfy/components/...`,
  replaced with the project alias on `designfy components add`.
- Each item in `registry.json` carries `meta.catalog` (id in
  `catalog/interface.json`), `meta.motion`, `meta.surface` and, for style
  files, `meta.targetRoot: "styles"`.
- `dependencies` lists npm packages the file imports;
  `registryDependencies` lists Designfy items by name and shadcn items as
  `shadcn:<name>`.
