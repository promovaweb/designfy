# Changelog

Formato baseado em Keep a Changelog. Versões seguem SemVer.

## [0.1.1] - 2026-11-24

### Adicionado

- Componentes de site no registro, em React e Astro: `site-header` (com o
  menu do celular), `site-footer`, `announcement-bar`, `hero-centered`,
  `hero-media`, `feature-grid`, `bento-grid`, `feature-split`, `steps`,
  `stats-band`, `counter`, `logo-marquee`, `marquee`, `testimonial`,
  `pricing-table`, `comparison-table`, `faq`, `cta-band`,
  `newsletter-form`, `card` e `theme-toggle`.
- Componentes de conteúdo, em React e Astro: `prose` (com
  `designfy-prose`), `article-header`, `table-of-contents`,
  `reading-progress`, `post-card`, `post-list`, `author-box`, `callout`,
  `code-block`, `figure` e `video-embed` com fachada.
- Componentes de sistema em React: `app-shell`, `page-header`,
  `stat-card`, `chart-card`, `data-table`, `filter-bar`,
  `description-list`, `activity-feed`, `form-layout`, `stepper`,
  `file-upload`, `empty-state`, `error-state`, `settings-layout`,
  `settings-section` e `auth-card`.
- Apps de exemplo que instalam os componentes pelo CLI: `examples/astro-site`
  (home, landing page e preços), `examples/astro-blog` (listagem, categorias
  e artigo), `examples/react-site` e `examples/react-system` (dashboard,
  pedidos, formulário, detalhe, configurações e entrada).
- Teste das tools do MCP por stdio (`tests/mcp-designfy.test.ts`).

### Alterado

- Guia do usuário e ebook atualizados para a TUI em menu de cartões, as onze
  skills e os itens do registro.
- README, CONTRIBUTING, AGENTS, RELEASING e avisos de terceiros escritos para
  o Designfy.
- `readOnlyHint` declarado em todas as tools de leitura herdadas do kit.

### Corrigido

- Testes da TUI com tempo de espera maior, para máquinas lentas de CI. A
  release 0.1.0 saiu sem binários por essa falha.

## [0.1.0] - 2026-11-24

Primeira versão do Designfy, o framework visual da Promovaweb para sites em
Astro e sistemas em React, criado a partir do Termfy Starter Kit 0.13.4.

### Adicionado

- Onze skills: `designfy` (orquestradora, chamada com o pedido de
  interface), `designfy-viewspec`, `designfy-design-system`,
  `designfy-components`, `designfy-motion`, `designfy-websites`,
  `designfy-content`, `designfy-systems`, `designfy-responsive`,
  `designfy-accessibility` e `designfy-review`, cada uma com referências,
  modelos e checklists.
- Viewspec, a especificação de interface: o guia `VIEWSPEC.md` na raiz do
  projeto (preferências, diretrizes, padrões e aprendizados) e um
  `viewspec/<id>-<slug>/VIEWSPEC.md` por página ou tela. Contrato em
  `docs/viewspec.md` e commands `viewspec guide`, `list`, `show`,
  `progress` e `validate`.
- Catálogo de interface com 80 componentes comuns de sites e de sistemas
  (`catalog list`, `show` e `search`), lido pelas skills para escolher os
  fragmentos de cada tela.
- Registro de componentes para React e Astro no formato do shadcn, embutido
  no binário, com `components list`, `show` e `add`. Todo item usa só os
  papéis do tema do Tailwind; `registry:check` recusa cor e fonte literais.
- Base do registro: `designfy-theme` (tokens em OKLCH no formato do shadcn),
  `designfy-motion` (animações, revelações e utilidades de movimento, com
  versão parada), `reveal`, `section`, `hero-split` e `background`.
- 314 presets de fundo (241 distintos) convertidos para os papéis do tema,
  a partir do catálogo MIT do ReactBD BG e do Pattern Craft, com galeria em
  `examples/backgrounds/`.
- Tema e paleta: `theme show` e `theme check` leem o tema do Tailwind do
  projeto e medem o contraste; `palette generate`, `wheel` e `contrast`
  geram escalas pela roda de cores, com WCAG 2.2 e APCA.
- Capturas com o Playwright em celular, tablet e desktop: `capture run` e
  `capture list`, com manifesto que aponta estouro horizontal e erros de
  console.
- Projeto: `init`, `status`, `skills list|install|update|remove` (internas
  e externas, entre elas Hallmark e shadcn), `deps list|check|install` (45
  bibliotecas em 18 grupos, com versões conferidas no npm) e
  `mcp servers|setup` para Claude Code, Codex, OpenCode, Cursor e Gemini
  CLI.
- TUI no padrão de design do Hub: Home em grade de cartões numerados com
  resumo vivo de cada módulo, faixa de próximo passo, módulos de tema,
  catálogo, componentes, skills, dependências, MCP, viewspecs e capturas,
  temas `terminal`, `night` e `day`, e quadros de referência versionados.
- Servidor MCP com 30 tools e o modo `--read-only`.
- Guia do usuário em `docs/user/` e ebook em PDF e EPUB.
- Marca em `brand/`: logo, paleta, tokens e guia de estilo.
- Scripts `skills:sync`, `skills:lint`, `registry:embed`,
  `registry:check` e `backgrounds:build`.

### Alterado

- Licença passa a GNU AGPL 3.0. Avisos de terceiros em
  `THIRD-PARTY-NOTICES.md`.
- Novo exit code 10 (`CHECK_FAILED`) para conferência reprovada.
