<!-- Gerado por scripts/sync-skill-assets.ts. Não edite à mão. -->

# Catálogo de interface

Os 91 componentes comuns de interface de sites e de sistemas. É a fonte
para escolher os fragmentos de uma tela: leia a entrada antes de procurar
uma implementação. O mesmo conteúdo sai do binário, sempre atualizado:

```bash
designfy catalog list --kind dashboard
designfy catalog list --surface site --category hero
designfy catalog show data-table
designfy catalog search "contador"
```

Este arquivo é gerado de `catalog/interface.json`. Os textos das entradas
estão em inglês, como no binário.

Cada entrada informa: para que serve (`purpose`), quando usar e quando
evitar, as partes (`anatomy`), variações, estados, o comportamento por
largura, o movimento, o que conferir de acessibilidade, os papéis do tema
usados e a fonte da implementação. Fontes: `designfy:<item>` copia com
`designfy components add <item>`; `shadcn:<item>` instala com
`npx shadcn@latest add <item>`; `reui:<item>` instala com
`npx shadcn@latest add @reui/<item>`; `custom` é escrito no projeto.

## Índice por tipo de tela

| Tipo (`kind`) | Fragmentos |
| --- | --- |
| `landing-page` | `button`, `link`, `card`, `avatar`, `tabs`, `accordion`, `dropdown-menu`, `dialog`, `drawer`, `section`, `background-pattern`, `reveal`, `counter`, `theme-toggle`, `site-header`, `mobile-nav`, `announcement-bar`, `site-footer`, `hero-split`, `hero-centered`, `hero-media`, `feature-grid`, `bento-grid`, `feature-split`, `steps`, `stats-band`, `logo-strip`, `marquee`, `testimonial`, `pricing-table`, `comparison-table`, `faq`, `cta-band`, `newsletter-form`, `video-embed`, `form-field`, `toast`, `error-state`, `segmented-control`, `pixel-stage`, `hero-pixel`, `feature-rows`, `milestone-timeline`, `profile-split`, `offer-card`, `audience-fit`, `numbered-checklist`, `outcome-grid`, `detail-card`, `statement-stats` |
| `home` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `accordion`, `dropdown-menu`, `drawer`, `section`, `background-pattern`, `reveal`, `counter`, `theme-toggle`, `site-header`, `mobile-nav`, `mega-menu`, `announcement-bar`, `site-footer`, `hero-split`, `hero-centered`, `hero-media`, `feature-grid`, `bento-grid`, `feature-split`, `steps`, `stats-band`, `logo-strip`, `marquee`, `testimonial`, `pricing-table`, `faq`, `cta-band`, `newsletter-form`, `post-card`, `video-embed`, `error-state`, `pixel-stage`, `hero-pixel`, `feature-rows`, `milestone-timeline`, `profile-split` |
| `site-page` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `accordion`, `dropdown-menu`, `drawer`, `section`, `background-pattern`, `reveal`, `counter`, `theme-toggle`, `site-header`, `mobile-nav`, `mega-menu`, `announcement-bar`, `breadcrumbs`, `site-footer`, `hero-split`, `hero-media`, `feature-grid`, `bento-grid`, `feature-split`, `steps`, `stats-band`, `logo-strip`, `marquee`, `testimonial`, `pricing-table`, `comparison-table`, `faq`, `cta-band`, `newsletter-form`, `prose`, `code-block`, `figure`, `video-embed`, `alert`, `error-state`, `segmented-control`, `pixel-stage`, `hero-pixel`, `feature-rows`, `milestone-timeline`, `profile-split`, `offer-card`, `audience-fit`, `numbered-checklist`, `outcome-grid`, `detail-card`, `statement-stats` |
| `blog-index` | `button`, `link`, `card`, `badge`, `avatar`, `drawer`, `section`, `background-pattern`, `reveal`, `theme-toggle`, `site-header`, `mobile-nav`, `site-footer`, `newsletter-form`, `post-card`, `post-list`, `video-embed`, `pagination`, `empty-state`, `skeleton` |
| `blog-post` | `button`, `link`, `card`, `badge`, `avatar`, `drawer`, `section`, `reveal`, `theme-toggle`, `site-header`, `mobile-nav`, `breadcrumbs`, `site-footer`, `newsletter-form`, `article-header`, `prose`, `table-of-contents`, `reading-progress`, `post-card`, `author-box`, `callout`, `code-block`, `figure`, `video-embed`, `pull-quote` |
| `docs-page` | `button`, `link`, `card`, `badge`, `avatar`, `accordion`, `drawer`, `section`, `reveal`, `theme-toggle`, `site-header`, `mobile-nav`, `breadcrumbs`, `site-footer`, `article-header`, `prose`, `table-of-contents`, `reading-progress`, `callout`, `code-block`, `figure`, `video-embed` |
| `dashboard` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `dropdown-menu`, `tooltip`, `dialog`, `drawer`, `counter`, `theme-toggle`, `app-shell`, `sidebar-nav`, `topbar`, `page-header`, `command-palette`, `stat-card`, `chart-card`, `data-table`, `activity-feed`, `status-indicator`, `toast`, `alert`, `empty-state`, `error-state`, `skeleton`, `progress`, `segmented-control` |
| `table` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `dropdown-menu`, `tooltip`, `dialog`, `drawer`, `theme-toggle`, `pagination`, `app-shell`, `sidebar-nav`, `topbar`, `page-header`, `command-palette`, `data-table`, `filter-bar`, `bulk-actions`, `status-indicator`, `toast`, `alert`, `confirm-dialog`, `empty-state`, `error-state`, `skeleton`, `progress`, `segmented-control` |
| `form` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `dropdown-menu`, `tooltip`, `dialog`, `drawer`, `theme-toggle`, `app-shell`, `sidebar-nav`, `topbar`, `page-header`, `command-palette`, `status-indicator`, `form-layout`, `form-field`, `stepper`, `file-upload`, `toast`, `alert`, `empty-state`, `error-state`, `skeleton`, `progress`, `segmented-control` |
| `crud` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `dropdown-menu`, `tooltip`, `dialog`, `drawer`, `theme-toggle`, `breadcrumbs`, `pagination`, `app-shell`, `sidebar-nav`, `topbar`, `page-header`, `command-palette`, `data-table`, `filter-bar`, `bulk-actions`, `description-list`, `status-indicator`, `form-layout`, `form-field`, `file-upload`, `toast`, `alert`, `confirm-dialog`, `empty-state`, `error-state`, `skeleton`, `progress`, `segmented-control` |
| `detail` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `dropdown-menu`, `tooltip`, `dialog`, `drawer`, `theme-toggle`, `breadcrumbs`, `app-shell`, `sidebar-nav`, `topbar`, `page-header`, `command-palette`, `stat-card`, `chart-card`, `data-table`, `description-list`, `activity-feed`, `status-indicator`, `toast`, `alert`, `confirm-dialog`, `empty-state`, `error-state`, `skeleton`, `progress`, `segmented-control` |
| `settings` | `button`, `link`, `card`, `badge`, `avatar`, `tabs`, `accordion`, `dropdown-menu`, `tooltip`, `dialog`, `drawer`, `theme-toggle`, `breadcrumbs`, `app-shell`, `sidebar-nav`, `topbar`, `page-header`, `command-palette`, `description-list`, `status-indicator`, `form-layout`, `form-field`, `file-upload`, `toast`, `alert`, `confirm-dialog`, `empty-state`, `error-state`, `skeleton`, `progress`, `settings-layout`, `settings-section`, `danger-zone`, `segmented-control` |
| `auth` | `button`, `background-pattern`, `form-layout`, `form-field`, `stepper`, `auth-card` |

## Actions (site e webapp)

### `button` · Button

Triggers an action or submits a form.

- **Use when:** The person changes something, sends data or moves to the next step. One primary action per screen region.
- **Avoid when:** Plain navigation between pages: use a link. More than one primary button in the same region.
- **Anatomy:** label; leading or trailing icon (optional); loading indicator.
- **Variants:** primary; secondary; outline; ghost; destructive; link; icon-only; sizes sm, md, lg.
- **States:** default, hover, focus-visible, active, disabled, loading.
- **Responsive:** Height of at least 44 px on touch screens; full width inside narrow forms and stacked action groups.
- **Motion:** Background and shadow transition in 150 ms; pressed state scales to 0.98; the loading spinner replaces the icon without changing the width.
- **Accessibility:** Native <button> or <a> with the right role. Icon-only buttons carry an accessible name. Loading sets aria-busy and keeps the label readable.
- **Tokens:** `primary`, `primary-foreground`, `ring`, `radius`, `secondary`, `destructive`.
- **Sources:** `shadcn:button`. **Related:** `link`, `dropdown-menu`.

### `link` · Text link

Moves to another page or to an anchor.

- **Use when:** Navigation inside running text, lists and footers. A secondary action next to a primary button.
- **Avoid when:** Actions that change data.
- **Anatomy:** text; underline or weight change; external mark (optional).
- **Variants:** inline; standalone with arrow; muted.
- **States:** default, hover, focus-visible, visited (content pages).
- **Responsive:** Standalone links keep 44 px of touch height through padding.
- **Motion:** Underline offset or thickness animates on hover in 150 ms; the arrow of a standalone link moves 2 px.
- **Accessibility:** Link text says the destination out of context. External links announce that they open elsewhere when they do.
- **Tokens:** `primary`, `foreground`, `ring`.
- **Sources:** `custom`. **Related:** `button`.

### `dropdown-menu` · Dropdown menu

Offers a short list of actions from one trigger.

- **Use when:** Secondary actions of a record or of the account. Row actions in a table.
- **Avoid when:** The primary action. Navigation with many levels.
- **Anatomy:** trigger; menu surface; item; separator; shortcut hint.
- **Variants:** with icons; with checkbox or radio items; with submenu.
- **States:** closed, open, item hover, item disabled.
- **Responsive:** Becomes a bottom drawer on touch screens when it has more than five items.
- **Motion:** Opens from the trigger with scale 0.96 to 1 and fade in 150 ms; closes in 100 ms.
- **Accessibility:** menu and menuitem roles, arrow keys, Escape returns focus to the trigger.
- **Tokens:** `popover`, `popover-foreground`, `accent`, `border`, `radius`.
- **Sources:** `shadcn:dropdown-menu`. **Related:** `command-palette`, `drawer`.

### `theme-toggle` · Theme toggle

Switches between light, dark and system themes.

- **Use when:** Sites and systems with a dark theme.
- **Avoid when:** Projects with a single theme.
- **Anatomy:** trigger with icon; menu with three options (optional).
- **Variants:** two-state button; three-option menu.
- **States:** light, dark, system.
- **Responsive:** Lives in the header on desktop and in the mobile menu on phones.
- **Motion:** The icon cross-fades and rotates 90 degrees in 200 ms; the page does not flash.
- **Accessibility:** The button name says the action, not the current state. The choice persists and respects prefers-color-scheme by default.
- **Tokens:** `background`, `foreground`, `border`.
- **Sources:** `designfy:theme-toggle`. **Related:** `site-header`, `topbar`.

### `segmented-control` · Segmented control

Chooses one of a few options that take effect at once.

- **Use when:** View mode, period, billing cycle.
- **Avoid when:** More than five options.
- **Anatomy:** track; segments; active thumb.
- **States:** default, selected, focus-visible.
- **Responsive:** Segments share the width; labels shorten on phones.
- **Motion:** The thumb slides between segments with a layout animation in 200 ms.
- **Accessibility:** Radio group semantics with arrow keys.
- **Tokens:** `muted`, `background`, `foreground`, `ring`.
- **Sources:** `shadcn:toggle-group`. **Related:** `tabs`, `pricing-table`.

## Containers (site e webapp)

### `card` · Card

Groups one subject in a bounded surface.

- **Use when:** A list of comparable items (plans, posts, records). A self-contained block in a dashboard.
- **Avoid when:** A card inside another card. Wrapping every section of a page in a card.
- **Anatomy:** header (title, description, action); content; footer.
- **Variants:** plain; interactive (whole card is a link); with media; highlighted.
- **States:** default, hover (interactive), focus-visible (interactive), loading, selected.
- **Responsive:** Fluid width inside a grid with minmax(0, 1fr); padding steps down one level below 640 px.
- **Motion:** Interactive cards lift 2 px and strengthen the border on hover in 200 ms; entrance in a staggered reveal with the list.
- **Accessibility:** An interactive card exposes one link, with the heading as its name. Heading level follows the page outline.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`.
- **Sources:** `shadcn:card`, `designfy:card`. **Related:** `stat-card`, `post-card`, `pricing-table`.

### `accordion` · Accordion

Shows and hides sections of content in place.

- **Use when:** Questions and answers. Secondary details that most people skip.
- **Avoid when:** Content everyone needs to read. Critical form fields.
- **Anatomy:** item; trigger with heading; chevron; panel.
- **Variants:** single open; multiple open; bordered; flush.
- **States:** closed, open, hover, focus-visible.
- **Responsive:** Full width; trigger of at least 48 px.
- **Motion:** The panel opens with grid-template-rows from 0fr to 1fr in 250 ms and the chevron rotates; no height animation.
- **Accessibility:** The trigger is a button inside a heading with aria-expanded. Content stays reachable with scripting off (details/summary).
- **Tokens:** `foreground`, `muted-foreground`, `border`.
- **Sources:** `shadcn:accordion`, `designfy:faq`. **Related:** `faq`, `tabs`.

## Layout and backgrounds (site e webapp)

### `section` · Section container

Gives each block of a page the same width, gutters and vertical rhythm.

- **Use when:** Every top-level block of a page.
- **Avoid when:** Nesting sections. Per-section custom paddings.
- **Anatomy:** outer band (background); container (max width, gutters); header (title, lead); content.
- **Variants:** default; narrow (reading); wide; tinted band; with background pattern.
- **States:** default.
- **Responsive:** Gutters 16, 24 and 32 px by range; vertical padding steps from 48 to 96 px; the container is capped, the gutters grow.
- **Motion:** The header and the content reveal once when 20% of the section enters the viewport.
- **Accessibility:** A <section> with a heading, or aria-labelledby. One h2 per section.
- **Tokens:** `background`, `foreground`, `border`, `muted`, `font-heading`, `font-sans`.
- **Sources:** `designfy:section`. **Related:** `background-pattern`, `reveal`.

### `background-pattern` · Background pattern

Decorates a band or a card with a quiet, token-colored pattern.

- **Use when:** Hero and call-to-action bands. Empty states and auth screens.
- **Avoid when:** Behind long running text. More than one pattern in the same viewport.
- **Anatomy:** pattern layer (pointer-events none); mask or fade; content layer above.
- **Variants:** grid; dots; lines; radial glow; gradient mesh; noise; aurora (animated); beams (animated).
- **States:** default.
- **Responsive:** Pattern scale stays constant; masks fade the edges so content keeps contrast at every width.
- **Motion:** Animated variants loop slowly (20 s or more), pause off screen and stop under reduced motion.
- **Accessibility:** Decorative: aria-hidden. Text over the pattern keeps 4.5:1 measured on the lightest and darkest point.
- **Tokens:** `background`, `border`, `primary`, `muted`.
- **Sources:** `designfy:background`. **Related:** `section`, `hero-centered`.

### `pixel-stage` · Pixel stage

Places a pausable theme-driven pixel mosaic behind landing content.

- **Use when:** Abrir uma seção curta com movimento ambiental e texto em primeiro plano.
- **Avoid when:** Atrás de texto longo ou de outro movimento simultâneo.
- **Anatomy:** canvas decorativo; véu; conteúdo; controle de pausa.
- **Variants:** tema claro ou escuro.
- **States:** running, paused, reduced motion.
- **Responsive:** O véu protege o topo em telas estreitas e o início da linha em telas largas.
- **Motion:** Desloca pontos em uma grade com brilho localizado. Suspende o loop fora da tela, em hover, com foco, por comando e em movimento reduzido.
- **Accessibility:** Canvas oculto da árvore de acessibilidade. Controle com aria-pressed e foco visível.
- **Tokens:** `background`, `foreground`, `primary`, `accent-foreground`, `muted-foreground`, `border`, `ring`.
- **Sources:** `designfy:pixel-stage`. **Related:** `background-pattern`, `hero-pixel`.

## Motion (site e webapp)

### `reveal` · Reveal on scroll

Brings a block into view once when it enters the viewport.

- **Use when:** Section headers, grids and media below the fold.
- **Avoid when:** Content above the fold on first paint. Text the person is reading while it moves.
- **Anatomy:** wrapper; children (optionally staggered).
- **Variants:** fade up; fade; scale in; stagger children; mask reveal.
- **States:** hidden, visible.
- **Responsive:** Same effect on every width; travel distance shrinks on phones.
- **Motion:** Opacity and translate of 16 px in 500 ms with ease-out, once; stagger of 60 ms.
- **Accessibility:** Content is visible with scripting off. Under reduced motion everything is visible at once.
- **Sources:** `designfy:reveal`. **Related:** `section`.

### `counter` · Animated counter

Counts a number up to its value when it appears or changes.

- **Use when:** Real metrics in a stats band. Values that update in a dashboard.
- **Avoid when:** Invented numbers. Numbers the person needs to read immediately on every visit.
- **Anatomy:** value; prefix and suffix; label.
- **Variants:** count up once; roll on change; countdown.
- **States:** idle, counting, done.
- **Responsive:** Tabular numbers keep the width stable.
- **Motion:** Counts in 600 to 1200 ms with ease-out; on change, only the digits that differ roll.
- **Accessibility:** The final value is in the markup; the animation is presentation. Live updates use aria-live polite sparingly.
- **Tokens:** `foreground`, `muted-foreground`, `font-heading`.
- **Sources:** `designfy:counter`. **Related:** `stats-band`, `stat-card`.

## Navigation (site e webapp)

### `tabs` · Tabs

Switches between views of the same subject without leaving the page.

- **Use when:** Two to six parallel views of one record or section.
- **Avoid when:** Steps of a sequence. More views than fit: use a select or a side navigation.
- **Anatomy:** tab list; tab; active indicator; panel.
- **Variants:** underline; pill; vertical.
- **States:** default, hover, focus-visible, selected, disabled.
- **Responsive:** The list scrolls horizontally with a fade on the edge below 640 px, or becomes a select when there are more than four tabs.
- **Motion:** The active indicator slides between tabs with a layout animation in 250 ms; the panel content fades in 150 ms.
- **Accessibility:** tablist, tab and tabpanel roles with arrow key navigation. The selected tab is in the URL when it represents a place.
- **Tokens:** `foreground`, `muted-foreground`, `primary`, `border`.
- **Sources:** `shadcn:tabs`. **Related:** `segmented-control`, `accordion`.

### `breadcrumbs` · Breadcrumbs

Shows where the page sits in the hierarchy.

- **Use when:** Pages two or more levels deep.
- **Avoid when:** Flat sites.
- **Anatomy:** link per level; separator; current page.
- **States:** default.
- **Responsive:** Middle levels collapse into a menu on phones; the parent link stays.
- **Motion:** None beyond the link hover.
- **Accessibility:** <nav aria-label> with an ordered list. Current page has aria-current=page.
- **Tokens:** `muted-foreground`, `foreground`.
- **Sources:** `shadcn:breadcrumb`. **Related:** `page-header`.

### `pagination` · Pagination

Moves between pages of a list.

- **Use when:** Lists longer than one page.
- **Anatomy:** previous; page numbers with gaps; next; page size (systems).
- **Variants:** numbered; previous and next only; load more.
- **States:** default, current, disabled.
- **Responsive:** Numbers reduce to previous, current of total and next on phones.
- **Motion:** None beyond hover; the list fades while loading.
- **Accessibility:** <nav aria-label>. aria-current on the current page. Real links on sites.
- **Tokens:** `foreground`, `muted-foreground`, `border`, `primary`.
- **Sources:** `shadcn:pagination`. **Related:** `data-table`, `post-list`.

## Data display (site e webapp)

### `badge` · Badge

Labels a status, category or count in one or two words.

- **Use when:** Status of a record. Category of a post or plan.
- **Avoid when:** Long text. Color as the only carrier of meaning.
- **Anatomy:** label; icon or dot (optional).
- **Variants:** neutral; success; warning; destructive; info; outline.
- **States:** default.
- **Responsive:** Does not wrap; truncates with a title when the column is narrow.
- **Motion:** A status change cross-fades the color in 200 ms.
- **Accessibility:** Status has text, never color alone. Contrast of 4.5:1 for the label.
- **Tokens:** `secondary`, `success`, `warning`, `destructive`, `info`, `radius`.
- **Sources:** `shadcn:badge`. **Related:** `status-indicator`.

### `avatar` · Avatar

Represents a person or an organization.

- **Use when:** Author, assignee, account menu, testimonial.
- **Avoid when:** Decoration without a real person or entity.
- **Anatomy:** image; initials fallback; status mark (optional).
- **Variants:** sizes; group with overflow count; square for organizations.
- **States:** image, fallback, loading.
- **Responsive:** Sizes follow the density of the region; groups collapse to a count on narrow screens.
- **Motion:** Image fades in over the fallback in 150 ms.
- **Accessibility:** Alt text with the name, or empty alt when the name is beside it.
- **Tokens:** `muted`, `muted-foreground`, `border`.
- **Sources:** `shadcn:avatar`. **Related:** `author-box`.

### `stat-card` · Stat card

Shows one indicator with its change and context.

- **Use when:** Dashboards and record summaries.
- **Anatomy:** label; value; change against the previous period; sparkline or icon (optional); link to detail.
- **Variants:** plain; with sparkline; with progress toward a goal.
- **States:** default, loading, error, no data.
- **Responsive:** Four in a row, then two, then one or a horizontal snap row.
- **Motion:** The value counts from the previous number; the change badge fades; the sparkline draws once.
- **Accessibility:** Change has a sign and text, not only color or arrow. Label and value are associated.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `muted-foreground`, `success`, `destructive`.
- **Sources:** `designfy:stat-card`. **Related:** `counter`, `chart-card`.

### `chart-card` · Chart card

Presents one chart with its title, period and legend.

- **Use when:** Trends, comparisons and distributions in a dashboard.
- **Avoid when:** A chart where one number would do.
- **Anatomy:** title and description; period or series control; chart; legend; tooltip; table alternative.
- **Variants:** area; line; bar; stacked bar; donut; radial.
- **States:** default, loading, empty, error.
- **Responsive:** Fixed height per range; fewer axis ticks and a legend below the chart on phones.
- **Motion:** Draws once on first load in 600 ms; data changes interpolate; nothing replays on hover.
- **Accessibility:** Text summary of the chart. Series distinguished by more than color. Data available as a table.
- **Tokens:** `card`, `border`, `chart-1`, `chart-2`, `chart-3`, `chart-4`, `chart-5`, `muted-foreground`.
- **Sources:** `shadcn:chart`, `designfy:chart-card`. **Related:** `stat-card`.

### `data-table` · Data table

Lists records in rows with sorting, filtering, selection and row actions.

- **Use when:** Records with comparable attributes.
- **Avoid when:** Fewer than three columns: use a list.
- **Anatomy:** toolbar; header with sort; rows; cell types (text, number, badge, date, avatar); row actions; selection column; footer with pagination.
- **Variants:** simple; sortable; selectable with bulk actions; expandable rows; virtualized; editable cells.
- **States:** default, loading (skeleton rows), empty, no results for the filter, error, row hover, row selected.
- **Responsive:** Below 768 px either turns each row into a card with the key columns, or scrolls inside its box with the first column fixed; never scrolls the page sideways.
- **Motion:** Rows fade in on load; sort moves rows with a short layout animation when the set is small; the bulk action bar slides in.
- **Accessibility:** Real <table> with th scope and aria-sort. Row actions reachable by keyboard. Selection announces the count. Numbers right-aligned with tabular figures.
- **Tokens:** `background`, `foreground`, `muted`, `muted-foreground`, `border`.
- **Sources:** `shadcn:table`, `reui:data-grid`, `designfy:data-table`. **Related:** `filter-bar`, `pagination`, `empty-state`, `bulk-actions`.

### `filter-bar` · Filter bar

Narrows a list by text, attribute and period.

- **Use when:** Above tables and lists.
- **Anatomy:** text input; attribute filters; date range; active filter chips; clear all; view options.
- **States:** no filters, filters applied.
- **Responsive:** Filters collapse into a button that opens a drawer; active chips stay visible.
- **Motion:** Chips enter and leave with scale and fade in 150 ms; the result count updates with a cross-fade.
- **Accessibility:** Every control has a label. Result count announced politely. State kept in the URL.
- **Tokens:** `input`, `border`, `secondary`, `ring`.
- **Sources:** `designfy:filter-bar`. **Related:** `data-table`.

### `bulk-actions` · Bulk action bar

Offers actions for the selected rows.

- **Use when:** Tables with selection.
- **Anatomy:** selected count; actions; clear selection.
- **States:** default.
- **Responsive:** Fixed at the bottom on phones.
- **Motion:** Slides in when the first row is selected and out when the selection clears.
- **Accessibility:** Announces the selected count. Destructive actions confirm.
- **Tokens:** `card`, `border`, `primary`, `primary-foreground`, `ring`, `radius`.
- **Sources:** `designfy:data-table`. **Related:** `data-table`, `confirm-dialog`.

### `description-list` · Description list

Shows the attributes of one record as label and value pairs.

- **Use when:** Detail screens.
- **Anatomy:** group title; term; value; inline action (copy, edit).
- **Variants:** two columns; stacked; inside cards by group.
- **States:** default.
- **Responsive:** Label above the value on phones.
- **Motion:** Copy confirmation swaps the icon.
- **Accessibility:** <dl>, <dt>, <dd>. Empty values show a dash with a screen-reader text.
- **Tokens:** `foreground`, `muted-foreground`, `border`.
- **Sources:** `designfy:description-list`. **Related:** `page-header`.

### `activity-feed` · Activity feed

Lists what happened to a record or in the system, newest first.

- **Use when:** History, audit and comments.
- **Anatomy:** time marker; actor; action text; detail or attachment.
- **States:** default, loading, empty.
- **Responsive:** Single column at every width.
- **Motion:** New entries slide in at the top; older entries load on demand.
- **Accessibility:** Ordered list with <time> elements.
- **Tokens:** `foreground`, `muted-foreground`, `border`.
- **Sources:** `designfy:activity-feed`. **Related:** `description-list`.

### `status-indicator` · Status indicator

States the condition of a record or service.

- **Use when:** Order, payment, deploy and service states.
- **Anatomy:** mark; label.
- **Variants:** badge; dot with label; step in a timeline.
- **States:** default.
- **Responsive:** Label never hidden.
- **Motion:** An in-progress state pulses slowly; a change cross-fades.
- **Accessibility:** Text label always present.
- **Tokens:** `success`, `warning`, `destructive`, `info`, `muted-foreground`.
- **Sources:** `shadcn:badge`. **Related:** `badge`.

## Feedback and states (site e webapp)

### `tooltip` · Tooltip

Names an icon-only control or shows a short hint on hover and focus.

- **Use when:** Icon buttons. Truncated text.
- **Avoid when:** Information the person needs to complete the task. Touch-only interfaces.
- **Anatomy:** trigger; bubble.
- **States:** hidden, visible.
- **Responsive:** Not available on touch: the information also exists as a label or in the next screen.
- **Motion:** Appears after 300 ms with a 100 ms fade; no delay when moving between neighbors.
- **Accessibility:** Opens on focus as well as hover. Never the only place for essential content.
- **Tokens:** `popover`, `popover-foreground`, `radius`.
- **Sources:** `shadcn:tooltip`. **Related:** `button`.

### `dialog` · Dialog

Interrupts to ask for a decision or a short input.

- **Use when:** Confirming a destructive action. A short form that belongs to the current context.
- **Avoid when:** Long forms: use a page. Messages that do not need an answer: use a toast.
- **Anatomy:** overlay; surface; title; description; content; actions; close.
- **Variants:** confirm; form; media.
- **States:** closed, open, submitting.
- **Responsive:** Becomes a bottom sheet below 640 px, with the actions fixed at the bottom.
- **Motion:** Overlay fades in 150 ms; the surface scales from 0.96 and fades in 200 ms; exits are faster than entrances.
- **Accessibility:** Focus trapped inside and returned to the trigger. Title linked with aria-labelledby. Escape closes unless the action is in progress.
- **Tokens:** `background`, `foreground`, `border`, `radius`, `ring`.
- **Sources:** `shadcn:dialog`. **Related:** `drawer`, `confirm-dialog`.

### `drawer` · Drawer

Slides a panel from an edge for secondary content or navigation.

- **Use when:** Mobile navigation. Details or filters beside a list.
- **Avoid when:** Primary content of the page.
- **Anatomy:** overlay; panel; header; content; footer actions.
- **Variants:** left; right; bottom sheet.
- **States:** closed, open.
- **Responsive:** Side panels on desktop become bottom sheets or full-height panels on phones.
- **Motion:** Slides with transform in 300 ms with an ease-out curve; follows the finger on touch.
- **Accessibility:** Same focus rules as a dialog. The trigger exposes aria-expanded.
- **Tokens:** `background`, `foreground`, `border`.
- **Sources:** `shadcn:sheet`, `shadcn:drawer`. **Related:** `dialog`, `mobile-nav`, `filter-bar`.

### `toast` · Toast

Confirms the result of an action without interrupting.

- **Use when:** Saved, copied, sent.
- **Avoid when:** Errors that need a decision. Information the person must read.
- **Anatomy:** message; action (undo); close.
- **Variants:** neutral; success; error; with action.
- **States:** entering, visible, leaving.
- **Responsive:** Bottom center on phones, above the bottom navigation.
- **Motion:** Slides and fades in 200 ms; stacks compress; dismisses after 5 s and pauses on hover.
- **Accessibility:** role=status for success, role=alert for errors. Time enough to read; never the only record of an error.
- **Tokens:** `popover`, `popover-foreground`, `border`.
- **Sources:** `shadcn:sonner`. **Related:** `alert`.

### `alert` · Alert banner

States a condition of the page or system that stays until resolved.

- **Use when:** Validation summary, degraded service, pending action.
- **Anatomy:** icon; title; text; action; dismiss.
- **Variants:** info; success; warning; destructive.
- **States:** default.
- **Responsive:** Full width of its container.
- **Motion:** Expands into place without pushing content abruptly.
- **Accessibility:** role=alert only when it appears in response to an action. Type in text.
- **Tokens:** `info`, `warning`, `destructive`, `success`, `border`.
- **Sources:** `shadcn:alert`. **Related:** `toast`, `callout`.

### `confirm-dialog` · Confirm dialog

Asks before an action that cannot be undone.

- **Use when:** Delete, revoke, publish.
- **Avoid when:** Reversible actions: offer undo.
- **Anatomy:** title naming the action and the object; consequence; confirm with the verb; cancel.
- **Variants:** simple; type the name to confirm.
- **States:** default.
- **Responsive:** Bottom sheet on phones.
- **Motion:** Dialog motion.
- **Accessibility:** Focus starts on cancel. The confirm button repeats the verb.
- **Tokens:** `destructive`, `background`, `border`.
- **Sources:** `shadcn:alert-dialog`. **Related:** `dialog`, `danger-zone`.

### `empty-state` · Empty state

Explains why there is nothing here and what to do next.

- **Use when:** First use, no results, cleared lists.
- **Anatomy:** illustration or icon; title; sentence; primary action; secondary link.
- **Variants:** first use; no results for filter; no permission.
- **States:** default.
- **Responsive:** Centered in the region, never in the whole viewport when the region is a card.
- **Motion:** The illustration has one quiet loop; the block fades in.
- **Accessibility:** Text says the cause and the next step.
- **Tokens:** `muted`, `muted-foreground`, `primary`, `primary-foreground`, `ring`, `radius`.
- **Sources:** `designfy:empty-state`. **Related:** `data-table`, `error-state`.

### `error-state` · Error state

Says what failed and offers the way out.

- **Use when:** Failed loads, 404, 500, lost connection.
- **Anatomy:** title; plain explanation; retry or way back; support code.
- **Variants:** inline in a region; full page.
- **States:** default.
- **Responsive:** Same structure at every width.
- **Motion:** Fades in; retry shows progress.
- **Accessibility:** role=alert when it replaces content after an action. No blame, no jargon.
- **Tokens:** `destructive`, `muted-foreground`, `primary`, `primary-foreground`, `ring`, `radius`.
- **Sources:** `designfy:error-state`. **Related:** `empty-state`, `alert`.

### `skeleton` · Skeleton

Holds the shape of content while it loads.

- **Use when:** Loads longer than 300 ms.
- **Avoid when:** Spinners in the middle of a layout that could keep its shape.
- **Anatomy:** blocks with the size of the real content.
- **States:** default.
- **Responsive:** Follows the layout of each range.
- **Motion:** A slow shimmer or pulse; static under reduced motion.
- **Accessibility:** The region sets aria-busy. Skeletons are hidden from screen readers.
- **Tokens:** `muted`.
- **Sources:** `shadcn:skeleton`. **Related:** `data-table`, `stat-card`.

### `progress` · Progress

Shows how much of a task is done.

- **Use when:** Uploads, imports, multi-step flows, quotas.
- **Anatomy:** track; indicator; value label.
- **Variants:** bar; ring; steps; indeterminate.
- **States:** default.
- **Responsive:** Full width of its container.
- **Motion:** The indicator grows with a 300 ms transition on transform.
- **Accessibility:** role=progressbar with value and name.
- **Tokens:** `primary`, `muted`.
- **Sources:** `shadcn:progress`. **Related:** `stepper`, `file-upload`.

## Site navigation (site)

### `site-header` · Site header

Identifies the site and gives the main routes and the primary action.

- **Use when:** Every public page.
- **Avoid when:** More than seven top-level links.
- **Anatomy:** logo; primary links; secondary links or search-free utilities; primary action; menu button.
- **Variants:** static; sticky with shrink on scroll; transparent over the hero; floating pill.
- **States:** top of page, scrolled, menu open.
- **Responsive:** Links collapse into a drawer below 1024 px; the primary action stays visible down to 390 px.
- **Motion:** Background, border and height transition in 200 ms after 8 px of scroll; hides on scroll down and returns on scroll up when sticky.
- **Accessibility:** <header> with a <nav aria-label>. A skip link is the first focusable element. Current page marked with aria-current.
- **Tokens:** `background`, `foreground`, `border`, `primary`, `font-heading`, `font-sans`.
- **Sources:** `designfy:site-header`. **Related:** `mobile-nav`, `mega-menu`, `announcement-bar`.

### `mobile-nav` · Mobile navigation

Shows the site routes on small screens.

- **Use when:** Whenever the header links do not fit.
- **Anatomy:** trigger; panel; link groups; primary action; close.
- **Variants:** full-screen panel; side drawer; bottom sheet.
- **States:** closed, open.
- **Responsive:** Covers the viewport on phones; links are 48 px tall.
- **Motion:** Panel slides or fades in 250 ms; links stagger 30 ms.
- **Accessibility:** Focus trap, Escape and return of focus. The page behind is inert.
- **Tokens:** `background`, `foreground`, `border`.
- **Sources:** `designfy:site-header`, `shadcn:sheet`. **Related:** `site-header`, `drawer`.

### `mega-menu` · Mega menu

Opens a wide panel with grouped destinations under a header item.

- **Use when:** Sites with many products or sections that need descriptions.
- **Avoid when:** Fewer than eight destinations.
- **Anatomy:** trigger; panel; columns with title; link with description; featured area.
- **States:** closed, open.
- **Responsive:** Becomes accordion groups inside the mobile navigation.
- **Motion:** The panel fades and moves 8 px in 200 ms; moving between triggers resizes the same panel with a layout animation.
- **Accessibility:** Opens on click and on Enter, not only hover. Escape closes and returns focus.
- **Tokens:** `popover`, `popover-foreground`, `border`.
- **Sources:** `shadcn:navigation-menu`. **Related:** `site-header`.

### `announcement-bar` · Announcement bar

Carries one short, dated message above the header.

- **Use when:** A launch, an event or a deadline.
- **Avoid when:** Permanent content. More than one message.
- **Anatomy:** message; link; dismiss (optional).
- **States:** visible, dismissed.
- **Responsive:** One line; the text truncates before the link does.
- **Motion:** Slides down once on entry; a long message scrolls as a marquee that pauses on hover and focus.
- **Accessibility:** Not a live region. Dismiss button with a name.
- **Tokens:** `primary`, `primary-foreground`.
- **Sources:** `designfy:announcement-bar`. **Related:** `site-header`, `marquee`.

### `site-footer` · Site footer

Closes the page with the secondary routes, legal links and contact.

- **Use when:** Every public page.
- **Anatomy:** logo and one-line description; link columns; social links; legal line; newsletter or final action (optional).
- **Variants:** columns; single line; statement with large type; with marquee band.
- **States:** default.
- **Responsive:** Columns become a two-column grid on tablets and accordions or a single list on phones.
- **Motion:** Reveals with the last section; link hovers only.
- **Accessibility:** <footer> with labeled <nav> groups. Link text contrast of 4.5:1 on the footer background.
- **Tokens:** `background`, `foreground`, `border`, `muted-foreground`.
- **Sources:** `designfy:site-footer`. **Related:** `site-header`, `newsletter-form`.

## Hero (site)

### `hero-split` · Split hero

Opens the page with the promise on one side and proof of the product on the other.

- **Use when:** Product, portal and tool pages with a real screenshot, panel or demo.
- **Avoid when:** No real visual to show.
- **Anatomy:** product name; headline; one sentence; primary and secondary action; visual frame with real content.
- **Variants:** text left; text right; visual bleeding off the edge; interactive panel.
- **States:** default.
- **Responsive:** Stacks with the text first; the visual keeps its aspect ratio and loses decorative layers.
- **Motion:** Text enters in a short stagger; the visual fades and rises 16 px; inside the visual, one slow loop or a sequence of real states.
- **Accessibility:** One h1. The visual has alt text or is marked decorative when the text says the same.
- **Tokens:** `background`, `foreground`, `border`, `primary`, `primary-foreground`, `ring`, `radius`, `font-heading`, `font-sans`.
- **Sources:** `designfy:hero-split`. **Related:** `hero-centered`, `background-pattern`.

### `hero-centered` · Centered hero

Opens the page with one statement and one action in the middle of the screen.

- **Use when:** Landing pages with a single idea. Pages without a product visual.
- **Avoid when:** Long headlines that wrap to four lines.
- **Anatomy:** headline; one sentence; actions; supporting visual or pattern below or behind.
- **Variants:** with background pattern; with media below the fold line; with inline form.
- **States:** default.
- **Responsive:** Headline scales with clamp(); actions stack full width below 480 px.
- **Motion:** Headline reveals by line or word once; the background pattern moves slowly.
- **Accessibility:** One h1. Headline, sentence and primary action visible at 1280 x 800 without scrolling.
- **Tokens:** `background`, `foreground`, `border`, `primary`, `primary-foreground`, `ring`, `radius`, `font-heading`, `font-sans`.
- **Sources:** `designfy:hero-centered`. **Related:** `hero-split`, `newsletter-form`.

### `hero-media` · Media hero

Opens the page on a photograph or a video with the text over it.

- **Use when:** Brands with strong real imagery. Events and places.
- **Avoid when:** Stock imagery. Text that loses contrast over the image.
- **Anatomy:** media; scrim; headline; sentence; action.
- **Variants:** full-bleed image; muted looping video with poster; image with text panel.
- **States:** default.
- **Responsive:** Art direction per range (different crop on phones); video is replaced by the poster on phones and under data saver.
- **Motion:** Slow scale of the image (1 to 1.05 in 12 s) or the video itself; text fades in.
- **Accessibility:** Video has no sound and can be paused. Contrast measured over the scrim.
- **Tokens:** `background`, `foreground`, `primary`, `primary-foreground`, `ring`, `radius`.
- **Sources:** `designfy:hero-media`. **Related:** `video-embed`.

### `hero-pixel` · Pixel hero

Opens a landing with an optional aside over a pixel stage.

- **Use when:** Apresentar a promessa e até duas ações de uma landing, com resumo lateral opcional.
- **Avoid when:** Quando a imagem do produto for a prova principal da abertura.
- **Anatomy:** título e ênfase; apoio; ações; nota opcional; coluna lateral opcional.
- **Variants:** com ou sem resumo lateral.
- **States:** default, hover, focus, active, paused.
- **Responsive:** Ações em linha quando há espaço. Resumo lateral a partir de lg.
- **Motion:** O resumo entra com a revelação do Designfy; o palco tem pausa independente.
- **Accessibility:** Um H1 e ações com rótulos descritivos. Texto disponível na primeira pintura.
- **Tokens:** `background`, `foreground`, `primary`, `primary-foreground`, `muted-foreground`, `border`, `ring`.
- **Sources:** `designfy:hero-pixel`. **Related:** `pixel-stage`, `hero-split`.

## Site sections (site)

### `feature-grid` · Feature grid

Presents three to six capabilities with equal weight.

- **Use when:** Capabilities that are parallel and short.
- **Avoid when:** One capability is far more important: use a feature split or bento.
- **Anatomy:** section header; item: icon or small visual, title, two-line description, link (optional).
- **Variants:** three columns; two columns with larger visuals; with dividers instead of cards.
- **States:** default.
- **Responsive:** Three columns, then two, then one; the icon moves beside the title on phones.
- **Motion:** Items reveal in a stagger; the icon or the border reacts on hover.
- **Accessibility:** Items are a list. Icons are decorative.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `muted`, `muted-foreground`, `primary`.
- **Sources:** `designfy:feature-grid`. **Related:** `bento-grid`, `feature-split`.

### `bento-grid` · Bento grid

Shows capabilities in tiles of different sizes, each with its own small visual.

- **Use when:** Four to seven capabilities with unequal weight and a real visual each.
- **Avoid when:** Tiles filled with icons only.
- **Anatomy:** grid with spans; tile: visual, title, sentence.
- **Variants:** 2x2 with one wide tile; three-column with a tall tile.
- **States:** default.
- **Responsive:** Tiles fall into one column in reading order on phones; tall tiles take a fixed aspect ratio.
- **Motion:** Each tile has one small loop or a hover interaction tied to what it shows; tiles reveal in a stagger.
- **Accessibility:** Reading order equals DOM order. Tile visuals have text alternatives when they carry information.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `muted`, `primary`.
- **Sources:** `designfy:bento-grid`. **Related:** `feature-grid`.

### `feature-split` · Feature split

Explains one capability with text beside a large visual.

- **Use when:** A capability that needs a paragraph and a screenshot.
- **Anatomy:** title; paragraph; bullet list or action; visual.
- **Variants:** alternating sides; sticky text with scrolling visuals.
- **States:** default.
- **Responsive:** Stacks with the text first.
- **Motion:** The visual reveals with a mask or rises; the sticky variant swaps visuals as the text scrolls.
- **Accessibility:** Visual has alt text.
- **Tokens:** `background`, `foreground`, `border`, `muted`, `muted-foreground`.
- **Sources:** `designfy:feature-split`. **Related:** `feature-grid`, `steps`.

### `steps` · Steps

Shows a process in a small number of ordered steps.

- **Use when:** How it works, onboarding, installation.
- **Avoid when:** Items without a real order.
- **Anatomy:** number; title; description; connector.
- **Variants:** horizontal; vertical timeline; with code or screenshot per step.
- **States:** default.
- **Responsive:** Horizontal becomes vertical below 768 px.
- **Motion:** The connector draws as the section scrolls; each step lights up in turn.
- **Accessibility:** Ordered list. Numbers are text.
- **Tokens:** `background`, `foreground`, `border`, `primary`, `border`.
- **Sources:** `designfy:steps`. **Related:** `feature-split`, `stepper`.

### `stats-band` · Stats band

States a few real numbers in large type.

- **Use when:** Two to four verified metrics.
- **Avoid when:** Invented or rounded-up numbers.
- **Anatomy:** value; unit; label; source (optional).
- **Variants:** in line; grid with dividers.
- **States:** default.
- **Responsive:** Two columns on phones.
- **Motion:** Values count up once when visible.
- **Accessibility:** Value and label are read together (definition list).
- **Tokens:** `foreground`, `muted-foreground`, `border`, `font-heading`.
- **Sources:** `designfy:stats-band`. **Related:** `counter`.

### `logo-strip` · Logo strip

Shows the logos of real customers, partners or tools.

- **Use when:** Real, authorized logos.
- **Avoid when:** Placeholder or invented logos.
- **Anatomy:** label sentence; logos in one color.
- **Variants:** static row; marquee.
- **States:** default.
- **Responsive:** Wraps to two rows or scrolls as a marquee.
- **Motion:** Marquee at constant speed, pausing on hover and focus; static under reduced motion.
- **Accessibility:** Each logo has the company name as alt text.
- **Tokens:** `muted-foreground`, `border`.
- **Sources:** `designfy:logo-marquee`. **Related:** `marquee`, `testimonial`.

### `marquee` · Marquee

Scrolls a row of short items continuously.

- **Use when:** Logos, short tags, tool names.
- **Avoid when:** Text that must be read whole. More than two marquees on a page.
- **Anatomy:** track; duplicated item group; edge fade.
- **Variants:** left; right; two rows in opposite directions; accent com separadores em losango.
- **States:** default.
- **Responsive:** Speed in pixels per second stays constant across widths.
- **Motion:** Linear translate loop; pauses on hover, focus and when off screen.
- **Accessibility:** The duplicate group is aria-hidden. A pause control exists when the content is meaningful.
- **Tokens:** `foreground`, `muted-foreground`.
- **Sources:** `designfy:marquee`. **Related:** `logo-strip`, `announcement-bar`.

### `testimonial` · Testimonial

Quotes a real person about the product.

- **Use when:** Real quotes with name and role.
- **Avoid when:** Invented quotes.
- **Anatomy:** quote; name; role and company; photo.
- **Variants:** single large quote; grid; carousel.
- **States:** default.
- **Responsive:** Grid becomes a single column or a swipe carousel.
- **Motion:** Reveal on scroll; the carousel moves on demand, not by itself.
- **Accessibility:** blockquote with a cite or figcaption. Carousel controls have names.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `muted`, `muted-foreground`.
- **Sources:** `designfy:testimonial`. **Related:** `logo-strip`.

### `pricing-table` · Pricing table

Lets the person compare plans and choose one.

- **Use when:** Two to four plans.
- **Anatomy:** billing period switch; plan card: name, price, period, description, feature list, action; highlighted plan.
- **Variants:** cards; cards plus comparison table; single com oferta e lista de inclusões.
- **States:** monthly, yearly.
- **Responsive:** Cards stack with the recommended plan first; the comparison table becomes one plan per tab.
- **Motion:** The price rolls when the period changes; the highlighted card has a quiet moving border or glow.
- **Accessibility:** The switch is a radio group or a toggle with a name. Included and excluded features have text, not only icons.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `primary`, `primary-foreground`, `ring`, `radius`, `muted-foreground`.
- **Sources:** `designfy:pricing-table`. **Related:** `comparison-table`, `faq`.

### `comparison-table` · Comparison table

Compares options feature by feature.

- **Use when:** Plans or products with many attributes.
- **Anatomy:** header row with options; feature groups; cells with value or mark.
- **Variants:** sticky header; sticky first column.
- **States:** default.
- **Responsive:** Below 768 px shows one option at a time with a switcher, or scrolls inside its own container with the first column fixed.
- **Motion:** Row hover highlight; the sticky header gains a shadow.
- **Accessibility:** Real <table> with th scope. Marks have text alternatives.
- **Tokens:** `background`, `foreground`, `border`, `muted`.
- **Sources:** `designfy:comparison-table`. **Related:** `pricing-table`, `data-table`.

### `faq` · FAQ

Answers the questions that stop a person from acting.

- **Use when:** Real questions from sales and support.
- **Avoid when:** Hiding essential information.
- **Anatomy:** section header; accordion items.
- **Variants:** single column; two columns with intro on the left.
- **States:** default.
- **Responsive:** Single column on phones.
- **Motion:** Accordion open and close.
- **Accessibility:** Accordion rules. FAQPage structured data when the content qualifies.
- **Tokens:** `foreground`, `muted-foreground`, `border`.
- **Sources:** `designfy:faq`. **Related:** `accordion`.

### `cta-band` · Call to action band

Repeats the primary action after the page made its case.

- **Use when:** End of a page or of a long section.
- **Anatomy:** headline; sentence; action; background.
- **Variants:** full band; card inside the container; with form.
- **States:** default.
- **Responsive:** Action goes full width on phones.
- **Motion:** Background pattern or gradient moves slowly; the band reveals on scroll.
- **Accessibility:** Heading level follows the outline. Contrast measured over the background.
- **Tokens:** `primary`, `primary-foreground`, `background`, `foreground`, `border`.
- **Sources:** `designfy:cta-band`. **Related:** `newsletter-form`, `background-pattern`.

### `newsletter-form` · Inline signup form

Collects an email address in one field and one button.

- **Use when:** Newsletter, waitlist, lead capture.
- **Anatomy:** label; email input; submit; consent line; result message.
- **States:** idle, invalid, submitting, success, error.
- **Responsive:** Input and button stack below 480 px.
- **Motion:** The button shows progress; success replaces the form with a check that draws in 300 ms.
- **Accessibility:** Visible or screen-reader label. Errors linked with aria-describedby and announced. autocomplete=email.
- **Tokens:** `input`, `ring`, `primary`, `primary-foreground`, `ring`, `radius`.
- **Sources:** `designfy:newsletter-form`. **Related:** `cta-band`, `form-field`.

### `feature-rows` · Feature rows

Presents numbered benefits in aligned rows with an optional sticky introduction.

- **Use when:** Comparar benefícios, capacidades ou cenários com espaço para explicar cada item.
- **Avoid when:** Quando cada entrada precisa de mídia ou várias ações.
- **Anatomy:** título da seção; número; título do item; descrição; detalhe opcional.
- **Variants:** introdução acima; introdução lateral fixa.
- **States:** default, hover, focus, active, empty.
- **Responsive:** Número e título compartilham a primeira linha no celular; três trilhas a partir de lg.
- **Motion:** Os itens entram com o stagger do Designfy; links respondem à pressão.
- **Accessibility:** Lista ordenada nativa. Números visuais decorativos; links recebem foco nativo.
- **Tokens:** `background`, `card`, `card-foreground`, `primary`, `muted-foreground`, `border`, `ring`.
- **Sources:** `designfy:feature-rows`. **Related:** `feature-grid`, `feature-split`.

### `milestone-timeline` · Milestone timeline

Shows dated events or phases in order with a current marker and aligned outcomes.

- **Use when:** Mostrar datas e fases de uma entrega e destacar um marco vigente.
- **Avoid when:** Quando a interação altera etapas de um formulário.
- **Anatomy:** marcador; data ou fase; título; descrição; resultado opcional.
- **Variants:** cronograma com datas; etapas com resultados.
- **States:** default, current, empty.
- **Responsive:** Trilho vertical no celular; duas colunas em sm e até quatro em lg, com subgrid quando disponível.
- **Motion:** Revelação sequencial e traçado do conector em desktop; versão estática com movimento reduzido.
- **Accessibility:** Sequência em lista ordenada. Datas podem usar time; o marco atual recebe aria-current.
- **Tokens:** `muted`, `primary`, `primary-foreground`, `background`, `foreground`, `card`, `border`.
- **Sources:** `designfy:milestone-timeline`. **Related:** `steps`, `activity-feed`.

### `profile-split` · Profile split

Introduces a person with a portrait, credentials and links.

- **Use when:** Apresentar a pessoa que conduz uma oferta, com retrato, bio e credenciais verificadas.
- **Avoid when:** Para a assinatura compacta de um artigo.
- **Anatomy:** retrato; credenciais; nome; papel; biografia; links.
- **Variants:** com ou sem credenciais e links.
- **States:** default, hover, focus, active.
- **Responsive:** Texto antes do retrato no celular; duas colunas a partir de md.
- **Motion:** Revelação do texto e do retrato em sequência; links respondem à pressão.
- **Accessibility:** Retrato com dimensões e texto alternativo fornecidos. Links com rótulo e credenciais legíveis como texto.
- **Tokens:** `background`, `foreground`, `primary`, `muted-foreground`, `card`, `card-foreground`, `border`, `ring`.
- **Sources:** `designfy:profile-split`. **Related:** `author-box`, `feature-split`.

### `offer-card` · Offer card

Presents a time-limited offer with optional capacity and a primary action.

- **Use when:** Apresentar prazo e capacidade perto da ação de inscrição.
- **Avoid when:** Para comparar vários planos.
- **Anatomy:** título; apoio; prazo; relógio; capacidade; ação.
- **Variants:** tinted; stage.
- **States:** default, active, expired, focus, hover.
- **Responsive:** Uma coluna com quatro unidades de tempo de largura estável.
- **Motion:** Revelação de entrada com versão estática em movimento reduzido.
- **Accessibility:** O prazo fica legível sem JavaScript e o relógio evita anúncios por segundo.
- **Tokens:** `background`, `foreground`, `primary`, `border`.
- **Sources:** `designfy:offer-card`. **Related:** `pricing-table`.

### `audience-fit` · Audience fit

Pairs positive and negative fit criteria in two lists.

- **Use when:** Explicar para quem a oferta é indicada.
- **Avoid when:** Quando há somente uma condição simples.
- **Anatomy:** título; grupos; condições; nota.
- **Variants:** com nota; sem nota.
- **States:** default.
- **Responsive:** Os cartões empilham e passam a duas colunas de mesma altura.
- **Motion:** Revelação de entrada com versão estática em movimento reduzido.
- **Accessibility:** Os títulos identificam as listas e os símbolos são decorativos.
- **Tokens:** `background`, `foreground`, `primary`, `border`.
- **Sources:** `designfy:audience-fit`. **Related:** `comparison-table`.

### `numbered-checklist` · Numbered checklist

Lists inclusions with numbered chips and optional highlights.

- **Use when:** Enumerar entregas e destacar itens adicionais.
- **Avoid when:** Quando os itens representam etapas interativas.
- **Anatomy:** título; lista ordenada; chips; destaque.
- **Variants:** uma coluna; duas colunas.
- **States:** default.
- **Responsive:** A segunda coluna aparece quando há espaço.
- **Motion:** Revelação de entrada com versão estática em movimento reduzido.
- **Accessibility:** A lista mantém a ordem de leitura e o destaque recebe um rótulo textual.
- **Tokens:** `background`, `foreground`, `primary`, `border`.
- **Sources:** `designfy:numbered-checklist`. **Related:** `steps`.

### `outcome-grid` · Outcome grid

Presents short outcomes in a responsive grid of icon tiles.

- **Use when:** Resumir os resultados esperados em textos curtos.
- **Avoid when:** Quando cada resultado precisa de uma explicação longa.
- **Anatomy:** título; ícones; resultados; fechamento.
- **Variants:** com fechamento; sem fechamento.
- **States:** default.
- **Responsive:** Grade de duas a cinco colunas pela largura disponível.
- **Motion:** Revelação de entrada com versão estática em movimento reduzido.
- **Accessibility:** Os ícones decorativos ficam ocultos da árvore acessível.
- **Tokens:** `background`, `foreground`, `primary`, `border`.
- **Sources:** `designfy:outcome-grid`. **Related:** `feature-grid`.

### `detail-card` · Detail card

Explains a feature with an icon, paragraphs and optional checks. Includes DetailCardGrid for a two-column arrangement with a tall card.

- **Use when:** Explicar detalhes de uma entrega, com apoio opcional de uma lista.
- **Avoid when:** Quando o conteúdo cabe em uma única linha.
- **Anatomy:** ícone; rótulo; título; parágrafos; lista; nota.
- **Variants:** neutral; tinted; tall.
- **States:** default.
- **Responsive:** O helper empilha os cartões e aceita um cartão alto em duas colunas.
- **Motion:** Revelação de entrada com versão estática em movimento reduzido.
- **Accessibility:** Os parágrafos e a lista preservam a ordem do conteúdo.
- **Tokens:** `background`, `foreground`, `primary`, `border`.
- **Sources:** `designfy:detail-card`. **Related:** `bento-grid`.

### `statement-stats` · Statement stats

Pairs a two-tone statement with stacked stat notes. Compose with milestone-timeline for a dated rail.

- **Use when:** Dar contexto aos números que sustentam uma afirmação.
- **Avoid when:** Quando os números precisam de uma tabela comparativa.
- **Anatomy:** afirmação; ênfase; valores; descrições.
- **Variants:** escuro local; tema herdado.
- **States:** default.
- **Responsive:** As notas ficam abaixo do título em espaços estreitos e ao lado em espaços largos.
- **Motion:** Revelação de entrada com versão estática em movimento reduzido.
- **Accessibility:** Cada valor e sua descrição formam um par na lista de definições.
- **Tokens:** `background`, `foreground`, `primary`, `border`.
- **Sources:** `designfy:statement-stats`. **Related:** `milestone-timeline`.

## Content and articles (site)

### `article-header` · Article header

Introduces an article with title, context and authorship.

- **Use when:** Posts, guides and long pages.
- **Anatomy:** category; title; lead; author, date, reading time; cover.
- **Variants:** centered; left-aligned with cover below; cover behind title.
- **States:** default.
- **Responsive:** Meta wraps below the lead; the cover goes full width.
- **Motion:** Title and lead fade in; the cover reveals with a soft scale.
- **Accessibility:** h1 for the title. Dates in <time datetime>.
- **Tokens:** `background`, `foreground`, `border`, `muted-foreground`, `font-heading`, `font-sans`.
- **Sources:** `designfy:article-header`. **Related:** `prose`, `author-box`.

### `prose` · Prose

Sets long-form text with a comfortable measure and rhythm.

- **Use when:** Article bodies, documentation, legal text.
- **Anatomy:** paragraphs; headings h2 to h4; lists; links; quotes; tables; code; figures.
- **Variants:** default; large for essays; compact for docs.
- **States:** default.
- **Responsive:** Measure of 60 to 75 characters; wide elements (tables, code) scroll inside their own box; type steps down one size on phones.
- **Motion:** None in the text; anchors scroll smoothly and flash the target heading.
- **Accessibility:** Heading levels do not skip. Links are distinguishable without color. Line height of at least 1.5.
- **Tokens:** `foreground`, `muted-foreground`, `primary`, `border`, `font-sans`, `font-heading`, `font-mono`.
- **Sources:** `designfy:prose`. **Related:** `callout`, `code-block`, `figure`, `table-of-contents`.

### `table-of-contents` · Table of contents

Lists the headings of the page and shows the current one.

- **Use when:** Articles and docs with four or more sections.
- **Anatomy:** title; nested links; active marker.
- **Variants:** sticky side rail; collapsible block at the top.
- **States:** default.
- **Responsive:** Side rail from 1280 px; collapsible block below.
- **Motion:** The active marker slides to the current heading as the page scrolls.
- **Accessibility:** <nav aria-label>. aria-current on the active link.
- **Tokens:** `muted-foreground`, `foreground`, `primary`, `border`.
- **Sources:** `designfy:table-of-contents`. **Related:** `prose`, `reading-progress`.

### `reading-progress` · Reading progress

Shows how far the person is in a long text.

- **Use when:** Long articles.
- **Avoid when:** Short pages.
- **Anatomy:** thin bar tied to scroll.
- **States:** default.
- **Responsive:** Same on every width.
- **Motion:** Scale on the X axis driven by scroll position (scroll timeline where supported).
- **Accessibility:** Decorative: aria-hidden.
- **Tokens:** `primary`.
- **Sources:** `designfy:reading-progress`. **Related:** `table-of-contents`.

### `post-card` · Post card

Summarizes an article in a list.

- **Use when:** Blog index, related posts, home highlights.
- **Anatomy:** cover; category; title; excerpt; author and date.
- **Variants:** vertical; horizontal; featured (large); text only.
- **States:** default, hover, focus-visible.
- **Responsive:** Horizontal cards become vertical below 640 px.
- **Motion:** The cover scales to 1.03 inside its frame and the title underlines on hover.
- **Accessibility:** One link per card with the title as its name. Cover alt empty when the title says the same.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `muted-foreground`.
- **Sources:** `designfy:post-card`. **Related:** `post-list`, `card`.

### `post-list` · Post list

Lays out the posts of a blog or a category.

- **Use when:** Blog index, tag and category pages.
- **Anatomy:** featured post; grid or list of post cards; category filter as links; pagination.
- **Variants:** grid; list with dates; magazine with a featured post.
- **States:** default, empty.
- **Responsive:** Three, two, then one column.
- **Motion:** Cards reveal in a stagger as they enter.
- **Accessibility:** Filters are links to real pages. The list is a list.
- **Tokens:** `background`, `foreground`, `border`.
- **Sources:** `designfy:post-list`. **Related:** `post-card`, `pagination`.

### `author-box` · Author box

Says who wrote the content.

- **Use when:** End of an article, author pages.
- **Anatomy:** avatar; name; short bio; links.
- **States:** default.
- **Responsive:** Avatar above the text on phones.
- **Motion:** Reveal on scroll.
- **Accessibility:** Name is a heading or strong text; links have names.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `muted-foreground`.
- **Sources:** `designfy:author-box`. **Related:** `avatar`.

### `callout` · Callout

Sets a note, tip or warning apart from the running text.

- **Use when:** Information the reader should not miss.
- **Avoid when:** More than one per screen of text.
- **Anatomy:** icon; title (optional); text.
- **Variants:** note; tip; warning; danger.
- **States:** default.
- **Responsive:** Full width of the measure.
- **Motion:** None.
- **Accessibility:** The type is in the text or title, not only in color. role=note.
- **Tokens:** `muted`, `border`, `info`, `warning`, `destructive`, `success`.
- **Sources:** `designfy:callout`. **Related:** `prose`, `alert`.

### `code-block` · Code block

Shows code with highlighting and a copy button.

- **Use when:** Commands and source code in articles and docs.
- **Anatomy:** file name or language; highlighted code; copy button; line highlights.
- **Variants:** single block; tabs by language or package manager; terminal.
- **States:** default, copied.
- **Responsive:** Scrolls horizontally inside its box; never wraps commands.
- **Motion:** The copy button swaps to a check for 1.5 s.
- **Accessibility:** Copy button with a name and a polite confirmation. Contrast of the theme checked in both modes.
- **Tokens:** `muted`, `border`, `font-mono`, `radius`.
- **Sources:** `designfy:code-block`. **Related:** `prose`.

### `figure` · Figure

Places an image, diagram or table with its caption.

- **Use when:** Any media inside an article.
- **Anatomy:** media; caption; credit.
- **Variants:** in measure; wide; full bleed; zoomable.
- **States:** default.
- **Responsive:** Wide variants return to the measure on phones; images are responsive with width, height and sizes.
- **Motion:** Fades in when loaded; the zoom opens with a shared-element transition.
- **Accessibility:** Alt text describes the content; the caption adds context. Dimensions set to avoid layout shift.
- **Tokens:** `muted-foreground`, `border`, `radius`.
- **Sources:** `designfy:figure`. **Related:** `prose`, `video-embed`.

### `video-embed` · Video embed

Plays a hosted video without loading the player until the person asks.

- **Use when:** YouTube, Vimeo or self-hosted video in a page.
- **Anatomy:** poster; play button; title; player (after click); caption or transcript link.
- **Variants:** facade for YouTube and Vimeo; native video; modal player.
- **States:** poster, loading, playing.
- **Responsive:** Fixed 16:9 (or declared) aspect ratio at every width.
- **Motion:** The play button scales on hover; the poster cross-fades to the player.
- **Accessibility:** The facade is a button named with the video title. Captions available; no autoplay with sound.
- **Tokens:** `background`, `foreground`, `radius`.
- **Sources:** `designfy:video-embed`. **Related:** `figure`, `hero-media`.

### `pull-quote` · Pull quote

Lifts one sentence of the text in large type.

- **Use when:** Long essays, once or twice.
- **Anatomy:** quote; attribution.
- **States:** default.
- **Responsive:** Stays inside the measure on phones.
- **Motion:** Reveal on scroll.
- **Accessibility:** Marked so screen readers do not read the sentence twice (aria-hidden when it repeats the text).
- **Tokens:** `foreground`, `primary`, `font-heading`.
- **Sources:** `designfy:prose`. **Related:** `prose`.

## System shell (webapp)

### `app-shell` · App shell

Frames every screen of a system with navigation, context and content area.

- **Use when:** Any authenticated application.
- **Anatomy:** sidebar; topbar; main area; optional right panel.
- **Variants:** sidebar plus topbar; topbar only; collapsible icon rail.
- **States:** expanded, collapsed, mobile drawer.
- **Responsive:** The sidebar becomes a drawer below 1024 px; the main area keeps 16 px gutters on phones.
- **Motion:** The sidebar width animates with transform or grid columns in 200 ms; route changes cross-fade the main area in 150 ms.
- **Accessibility:** Landmarks: nav, header, main. Skip link to main. Focus moves to the page heading on route change.
- **Tokens:** `background`, `sidebar`, `sidebar-foreground`, `border`.
- **Sources:** `designfy:app-shell`, `shadcn:sidebar`. **Related:** `sidebar-nav`, `topbar`, `page-header`.

### `sidebar-nav` · Sidebar navigation

Lists the areas of the system.

- **Use when:** Systems with five or more areas.
- **Anatomy:** workspace or product switcher; groups with label; item with icon and label; nested items; footer with account.
- **Variants:** expanded; icon rail with tooltips; with badges.
- **States:** default, hover, active, collapsed.
- **Responsive:** Drawer on phones and tablets.
- **Motion:** The active marker slides between items; groups open with the accordion motion.
- **Accessibility:** <nav aria-label>. aria-current on the active item. Collapsed items keep their names.
- **Tokens:** `sidebar`, `sidebar-foreground`, `sidebar-accent`, `sidebar-border`.
- **Sources:** `shadcn:sidebar`. **Related:** `app-shell`, `command-palette`.

### `topbar` · Topbar

Holds global tools: sidebar toggle, breadcrumbs, command trigger, notifications and account.

- **Use when:** Inside the app shell.
- **Anatomy:** sidebar toggle; breadcrumbs; command trigger; notifications; account menu.
- **States:** default.
- **Responsive:** Breadcrumbs collapse to the parent; tools move into the account menu on phones.
- **Motion:** Gains a border or shadow after the content scrolls.
- **Accessibility:** <header> landmark. Every icon button has a name.
- **Tokens:** `background`, `foreground`, `border`.
- **Sources:** `designfy:app-shell`. **Related:** `app-shell`, `breadcrumbs`.

### `page-header` · Page header

Names the screen and holds its main actions.

- **Use when:** Top of every system screen.
- **Anatomy:** title; description; primary action; secondary actions; tabs or filters (optional).
- **Variants:** simple; with tabs; with back link; with status and meta.
- **States:** default.
- **Responsive:** Actions move below the title; secondary actions collapse into a menu on phones.
- **Motion:** None on its own; follows the route transition.
- **Accessibility:** The title is the h1 of the screen. One primary action.
- **Tokens:** `foreground`, `muted-foreground`, `border`, `font-heading`.
- **Sources:** `designfy:page-header`. **Related:** `app-shell`, `breadcrumbs`, `tabs`.

### `command-palette` · Command palette

Finds screens, records and actions from the keyboard.

- **Use when:** Systems with many screens or frequent expert users.
- **Anatomy:** input; grouped results; shortcut hints; empty result.
- **States:** closed, open, loading, empty.
- **Responsive:** Full-screen sheet on phones.
- **Motion:** Opens with the dialog motion; the highlight slides between results.
- **Accessibility:** combobox pattern. The shortcut is shown in the interface and does not override browser shortcuts.
- **Tokens:** `popover`, `popover-foreground`, `accent`, `border`.
- **Sources:** `shadcn:command`. **Related:** `sidebar-nav`.

## Forms (webapp)

### `form-layout` · Form layout

Organizes fields into sections with one clear submit.

- **Use when:** Creation and editing screens.
- **Anatomy:** section with title and description; fields; help text; actions (submit, cancel); error summary.
- **Variants:** single column; two-column label and field; sections in cards; sticky action bar.
- **States:** pristine, dirty, submitting, saved, error.
- **Responsive:** Single column on phones; the action bar sticks to the bottom.
- **Motion:** Sections reveal in order on load; the save button shows progress and then a check; invalid fields shake once, 4 px.
- **Accessibility:** One column of fields in reading order. Error summary focused after a failed submit, with links to the fields. Leaving with unsaved changes asks first.
- **Tokens:** `background`, `foreground`, `border`, `input`, `ring`, `destructive`, `primary`, `primary-foreground`, `ring`, `radius`.
- **Sources:** `designfy:form-layout`, `shadcn:form`. **Related:** `form-field`, `stepper`.

### `form-field` · Form field

One input with its label, help and error.

- **Use when:** Every input in a form.
- **Anatomy:** label; required or optional mark; control; help text; error message.
- **Variants:** text; textarea; select; combobox; checkbox; radio group; switch; date; number with unit; file.
- **States:** default, hover, focus-visible, filled, invalid, disabled, read-only.
- **Responsive:** Controls are full width in their column and 44 px tall on touch; font size of 16 px to avoid zoom on iOS.
- **Motion:** Border and ring transition in 150 ms; the error message slides down 4 px and fades in.
- **Accessibility:** Label linked to the control. Error linked with aria-describedby and aria-invalid. autocomplete and inputmode set.
- **Tokens:** `input`, `ring`, `foreground`, `muted-foreground`, `destructive`, `radius`.
- **Sources:** `shadcn:field`, `shadcn:input`, `shadcn:select`. **Related:** `form-layout`.

### `stepper` · Stepper

Splits a long task into ordered steps.

- **Use when:** Onboarding, checkout, multi-part forms.
- **Avoid when:** Forms that fit on one screen.
- **Anatomy:** step list with state; current step content; back and next; review step.
- **States:** upcoming, current, done, error.
- **Responsive:** The step list becomes 'step 2 of 4' with a progress bar on phones.
- **Motion:** Step content slides in the direction of travel in 250 ms; the progress bar grows.
- **Accessibility:** aria-current=step. Focus moves to the step heading. Data kept when going back.
- **Tokens:** `primary`, `muted`, `border`, `foreground`.
- **Sources:** `designfy:stepper`. **Related:** `form-layout`, `steps`.

### `file-upload` · File upload

Receives files by drop or by picker and shows their progress.

- **Use when:** Attachments, imports, images.
- **Anatomy:** drop zone; picker button; file list with progress; remove; limits text.
- **States:** idle, drag over, uploading, done, error.
- **Responsive:** The picker button is the main path on touch.
- **Motion:** The zone reacts to drag over; progress bars grow; finished files settle into the list.
- **Accessibility:** Works with keyboard through the native input. Progress and errors announced.
- **Tokens:** `border`, `muted`, `primary`, `destructive`.
- **Sources:** `designfy:file-upload`. **Related:** `form-field`.

## Settings (webapp)

### `settings-layout` · Settings layout

Organizes configuration into areas with a stable navigation.

- **Use when:** Account, workspace and product settings.
- **Anatomy:** settings navigation; area title; sections.
- **Variants:** side navigation; tabs; single long page with anchors.
- **States:** default.
- **Responsive:** The navigation becomes a select or a list page that drills in on phones.
- **Motion:** Area change cross-fades the content.
- **Accessibility:** Navigation is a <nav>. Each area has its own URL.
- **Tokens:** `background`, `foreground`, `border`.
- **Sources:** `designfy:settings-layout`. **Related:** `settings-section`, `tabs`.

### `settings-section` · Settings section

Groups related settings with a title, an explanation and its own save.

- **Use when:** Inside a settings area.
- **Anatomy:** title and description; fields or toggle rows; save and reset; saved confirmation.
- **Variants:** form section; toggle rows that save at once; read-only with edit.
- **States:** pristine, dirty, saving, saved, error.
- **Responsive:** Description above the fields on phones.
- **Motion:** Save shows progress and a check; toggles animate the thumb in 150 ms.
- **Accessibility:** Toggle rows are switches with label and description. Saved state announced.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `input`, `ring`.
- **Sources:** `designfy:settings-section`. **Related:** `form-layout`, `danger-zone`.

### `danger-zone` · Danger zone

Separates destructive account or workspace actions.

- **Use when:** Delete, transfer, reset.
- **Anatomy:** title; action rows: what it does, consequence, button.
- **States:** default.
- **Responsive:** Button below the text on phones.
- **Motion:** None; the confirmation dialog carries the motion.
- **Accessibility:** Each action confirms. Consequence in plain text.
- **Tokens:** `destructive`, `border`.
- **Sources:** `designfy:settings-section`. **Related:** `confirm-dialog`.

## Authentication (webapp)

### `auth-card` · Auth card

Signs a person in, up or back in after a lost password.

- **Use when:** Sign in, sign up, recover, verify.
- **Anatomy:** logo; title; provider buttons; fields; submit; link to the alternate flow; legal line.
- **Variants:** centered card; split with brand panel; with one-time code.
- **States:** idle, invalid, submitting, error, success.
- **Responsive:** The brand panel disappears on phones; the card goes edge to edge.
- **Motion:** The card fades and rises on load; switching flows slides the form; the brand panel carries a slow background pattern.
- **Accessibility:** autocomplete tokens for username, current-password, new-password and one-time-code. Errors do not say which field was wrong when that leaks information. Password visibility toggle with a name.
- **Tokens:** `card`, `card-foreground`, `border`, `radius`, `input`, `ring`, `primary`, `primary-foreground`, `ring`, `radius`.
- **Sources:** `designfy:auth-card`. **Related:** `form-field`, `background-pattern`.
