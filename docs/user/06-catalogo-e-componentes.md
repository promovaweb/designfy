# Capítulo 6: Catálogo e componentes

O agente precisa de um cartão de indicador para o topo do dashboard. Em vez de
inventar um, ele roda `designfy catalog show stat-card` e recebe a anatomia, os
estados, o movimento, os papéis de cor e a origem da implementação:

```text
Stat card
  ID              stat-card
  Surface         system
  Category        data-display
  Purpose         Shows one indicator with its change and context.
  Use when        Dashboards and record summaries.
  Avoid when
  Anatomy         label; value; change against the previous period; sparkline or icon (optional); link to detail
  Variants        plain; with sparkline; with progress toward a goal
  States          default; loading; error; no data
  Responsive      Four in a row, then two, then one or a horizontal snap row.
  Motion          The value counts from the previous number; the change badge fades; the sparkline draws once.
  Accessibility   Change has a sign and text, not only color or arrow.; Label and value are associated.
  Tokens          card; card-foreground; border; radius; muted-foreground; success; destructive
  Viewspec kinds  dashboard; detail
  Related         counter; chart-card
  Sources         designfy:stat-card
```

A última linha diz de onde vem a peça. `designfy:stat-card` copia com o próprio
binário; `shadcn:<item>` e `reui:<item>` instalam pelo CLI do shadcn; `custom`
avisa que aquela função ainda não tem implementação pronta. O catálogo decide a
forma; o registro entrega o arquivo.

## O catálogo de interface

O catálogo tem 80 fragmentos comuns de site e de sistema, em 15 categorias e
três superfícies: 32 entradas de `site`, 22 de `system` e 26 de `both`. Cada
entrada declara propósito, quando usar, quando evitar, anatomia, variações,
estados, responsividade, movimento, acessibilidade, papéis de tema, itens
relacionados e as fontes de implementação.

```bash
designfy catalog list
designfy catalog list --surface system
designfy catalog list --kind dashboard
designfy catalog search table
```

O `--kind` usa o mesmo tipo de tela do viewspec. Para um dashboard, a lista
começa assim:

```text
  button             Button (both, actions)
  link               Text link (both, actions)
  card               Card (both, containers)
  badge              Badge (both, data-display)
  avatar             Avatar (both, data-display)
  tabs               Tabs (both, navigation)
  dropdown-menu      Dropdown menu (both, actions)
  tooltip            Tooltip (both, feedback)
  dialog             Dialog (both, feedback)
  drawer             Drawer (both, feedback)
  counter            Animated counter (both, motion)
  theme-toggle       Theme toggle (both, actions)
  app-shell          App shell (system, shell)
  ...
```

A busca não diferencia caixa nem acento:

```text
  dropdown-menu      Dropdown menu (both, actions)
  pricing-table      Pricing table (site, site-sections)
  comparison-table   Comparison table (site, site-sections)
  prose              Prose (site, content)
  table-of-contents  Table of contents (site, content)
  figure             Figure (site, content)
  chart-card         Chart card (system, data-display)
  data-table         Data table (system, data-display)
  filter-bar         Filter bar (system, data-display)
  bulk-actions       Bulk action bar (system, data-display)
  settings-layout    Settings layout (system, settings)
```

Id desconhecido sai com exit code 6. A skill `designfy-components` exige que
`useWhen` valha e `avoidWhen` não valha antes de escolher a peça.

## O registro de componentes

O registro tem dois manifestos no formato do shadcn,
`registry/react/registry.json` e `registry/astro/registry.json`, e os arquivos
de origem. O binário leva o registro embutido, gerado por
`bun run registry:embed`, então `components list` funciona sem o repositório.

```bash
designfy components list
designfy components list --framework react
designfy components list --surface system
```

O registro React tem 58 itens e o Astro tem 46. Sem `--framework`, o comando usa
o framework do `designfy.json`; `next` e `react-vite` leem o registro React. A
lista desta versão:

| Categoria | Itens |
| --- | --- |
| `layout` | `background`, `background-styles`, `section` |
| `utilities` | `cn`, `designfy-motion-runtime` |
| `styles` | `designfy-motion`, `designfy-theme`, `designfy-prose` |
| `hero` | `hero-split`, `hero-centered`, `hero-media` |
| `motion` | `reveal`, `counter` |
| `site-navigation` | `announcement-bar`, `site-footer`, `site-header` |
| `site-sections` | `bento-grid`, `comparison-table`, `cta-band`, `faq`, `feature-grid`, `feature-split`, `logo-marquee`, `marquee`, `newsletter-form`, `pricing-table`, `stats-band`, `steps`, `testimonial` |
| `containers` | `card` |
| `actions` | `theme-toggle` |
| `content` | `article-header`, `author-box`, `callout`, `code-block`, `figure`, `post-card`, `post-list`, `prose`, `reading-progress`, `table-of-contents`, `video-embed` |
| `data-display` | `activity-feed`, `description-list` no Astro; mais `chart-card`, `data-table`, `filter-bar`, `stat-card` no React |
| `shell` | `app-shell`, `page-header`, só no React |
| `auth` | `auth-card`, só no React |
| `feedback` | `empty-state`, `error-state` |
| `forms` | `file-upload`, `form-layout`, `stepper`, só no React |
| `settings` | `settings-layout`, `settings-section`, só no React |

A base do registro está nas três primeiras categorias da tabela:
`designfy-theme` traz os tokens, `designfy-motion` e `designfy-motion-runtime`
trazem o movimento e o script, `cn` combina classes, `designfy-prose` liga a
tipografia de leitura, `background` e `background-styles` trazem os padrões de
fundo e `section` fecha o ritmo das seções. Eles são arquivos de estilo e de
biblioteca, não telas, e se copiam uma vez por projeto.

## Conferir um item

```bash
designfy components show hero-split
```

```text
Split hero
Pairs a headline and actions with a framed visual in a responsive, animated layout.

  Category               hero
  Surface                site
  Motion                 Yes
  Files                  hero-split/HeroSplit.astro
  Dependencies           None
  Dev dependencies       None
  Registry dependencies  designfy-theme, designfy-motion
```

`--source` inclui o código do arquivo na resposta. Nome desconhecido sai com
exit code 6.

## Copiar para o projeto

```bash
designfy components add hero-split
```

O comando resolve os itens exigidos do Designfy em ordem, grava cada arquivo no
destino e relata o que fez:

```text
  Written               /tmp/opencode/designfy-demo/src/components/designfy/hero-split/HeroSplit.astro
  Unchanged             /tmp/opencode/designfy-demo/src/styles/designfy-theme.css
                        /tmp/opencode/designfy-demo/src/components/designfy/lib/designfy-motion.ts
                        /tmp/opencode/designfy-demo/src/styles/designfy-motion.css
  Skipped               None
  Missing npm packages  None
  Missing dev packages  None
  Install shadcn items  None
```

As categorias da resposta separam o resultado:

| Categoria | Significado |
| --- | --- |
| `Written` | arquivo novo gravado |
| `Unchanged` | o arquivo já estava igual |
| `Skipped` | o arquivo existe com conteúdo diferente e não foi tocado |
| `Missing npm packages` | pacotes de produção que o arquivo importa e o projeto não tem |
| `Missing dev packages` | pacotes de desenvolvimento que faltam |
| `Install shadcn items` | itens `shadcn:` que precisam do CLI do shadcn |

O destino segue o tipo de arquivo. Componente vai para `paths.components`;
estilo, para `paths.styles`. O marcador `@designfy/components` é trocado pelo
alias de `designfy.json`, então o import funciona com o alias do projeto. Um
arquivo existente e diferente não é sobrescrito sem `--overwrite`. Depois de
copiado, o arquivo pertence ao projeto e pode ser editado.

O `--dry-run` mostra o plano sem gravar, inclusive as dependências pendentes.
`--path <dir>` troca a pasta de destino e `--framework <framework>` escolhe o
manifesto. Sem `designfy.json`, o comando usa os padrões e avisa.

## shadcn e ReUI

O Designfy não substitui o CLI do shadcn. Os primitivos acessíveis continuam
saindo do [shadcn](https://ui.shadcn.com):

```bash
npx shadcn@latest add button card dialog
```

O [ReUI](https://reui.io) entra pelo registro `@reui` do mesmo CLI:

```bash
npx shadcn@latest add @reui/data-grid
```

Os três usam o mesmo tema: papéis do shadcn sobre o Tailwind 4. O registro do
Designfy traz composições de página, conteúdo e sistema, com movimento e com os
estados descritos no catálogo. O shadcn traz as primitivas sem estilo. O ReUI
traz blocos avançados, como grade de dados, filtros e kanban.

## A regra de tema único

Todo item do registro obedece à mesma regra: cor, fonte, raio e movimento vêm
dos papéis do tema. O item não leva cor literal, classe de paleta fixa
(`bg-indigo-500`, `text-gray-900`), cor arbitrária (`bg-[#0af]`) nem
`font-family` literal. Transparência sai do papel, como `bg-primary/10` ou
`color-mix(in oklab, var(--primary) 18%, transparent)`.

`dark:` não serve para cor, porque os papéis já mudam com o tema. `dark:` fica
para diferença que não é de cor, como trocar uma imagem. O
`bun run registry:check` recusa o item fora da regra.

O registro também exige conteúdo por propriedade. Nenhum texto com cara de real
dentro do componente; texto, link, imagem e número chegam por prop ou slot.
Região opcional sem conteúdo não renderiza nada. A peça é semântica, tem alvo
de toque de 44 px no celular, mantém o foco visível e usa uma biblioteca de
ícones só.

## Conferir

- `designfy catalog list --kind <tipo>` devolve os fragmentos do tipo de tela.
- `designfy catalog show <id>` mostra a origem da implementação.
- `designfy components list --framework react` mostra os 58 itens.
- `designfy components list --framework astro` mostra os 46 itens.
- `designfy components add <item> --dry-run` mostra os arquivos antes da cópia.
- `designfy deps check` termina com exit code 0 depois da cópia.
- Nenhum arquivo copiado tem cor literal ou `font-family`.
