# Roteamento por tipo de tela

Para cada `kind`, a ordem das especialistas, os fragmentos do catálogo que
costumam compor a tela e o que conferir antes de fechar. Os identificadores
são os de `designfy catalog list`. A lista de fragmentos é o ponto de
partida: confirme com `designfy catalog list --kind <kind>` e corte o que a
tela não precisa.

## Ordem padrão das especialistas

1. `designfy-design-system` (só quando falta token, papel ou fonte)
2. a especialista da superfície: `designfy-websites`, `designfy-content` ou
   `designfy-systems`
3. `designfy-components`
4. `designfy-motion`
5. `designfy-responsive`
6. `designfy-accessibility`
7. `designfy-review`

## Site

### `landing-page`

- Especialistas: `designfy-websites`, `designfy-components`,
  `designfy-motion`, `designfy-responsive`, `designfy-accessibility`,
  `designfy-review`.
- Fragmentos: `site-header`, `hero-centered` ou `hero-split`, `logo-strip`
  (só com logos reais), `feature-grid` ou `bento-grid`, `feature-split`,
  `steps`, `stats-band` (só com números reais), `testimonial` (só com
  depoimento real), `pricing-table`, `faq`, `cta-band`, `site-footer`,
  `background-pattern`, `reveal`.
- Conferir: uma ação principal repetida no hero, no meio e no fim; hero
  inteiro visível em 1280 x 800; nenhuma seção de prova com dado inventado.

### `home`

- Especialistas: as mesmas de `landing-page`.
- Fragmentos: `site-header` com `mega-menu` quando há muitas áreas,
  `hero-split`, `bento-grid`, `feature-split`, `post-card` (últimos
  conteúdos), `logo-strip`, `cta-band`, `site-footer`.
- Conferir: a home encaminha para as áreas do site; cada bloco termina num
  destino real.

### `site-page`

- Especialistas: `designfy-websites`, `designfy-components`,
  `designfy-motion`, `designfy-responsive`, `designfy-accessibility`,
  `designfy-review`.
- Fragmentos: `site-header`, `breadcrumbs`, hero curto (`hero-centered` sem
  mídia ou `hero-split`), `feature-split`, `comparison-table`,
  `pricing-table`, `faq`, `newsletter-form` ou formulário de contato com
  `form-field`, `cta-band`, `site-footer`.
- Conferir: página interna herda cabeçalho, rodapé e ritmo das outras.

### `blog-index`

- Especialistas: `designfy-content`, `designfy-components`,
  `designfy-motion`, `designfy-responsive`, `designfy-accessibility`,
  `designfy-review`.
- Fragmentos: `site-header`, `post-list`, `post-card`, `pagination`,
  `newsletter-form`, `empty-state`, `site-footer`.
- Conferir: filtros de categoria são links para páginas reais; listagem com
  um item não vira página.

### `blog-post`

- Especialistas: `designfy-content`, `designfy-components`,
  `designfy-motion`, `designfy-responsive`, `designfy-accessibility`,
  `designfy-review`.
- Fragmentos: `site-header`, `breadcrumbs`, `article-header`, `prose`,
  `table-of-contents`, `reading-progress`, `figure`, `video-embed`,
  `callout`, `code-block`, `pull-quote`, `author-box`, `post-card`
  (relacionados), `newsletter-form`, `site-footer`.
- Conferir: medida de 60 a 75 caracteres; tabela e código rolam dentro da
  própria caixa; vídeo só carrega o player no clique.

### `docs-page`

- Especialistas: `designfy-content`, `designfy-components`,
  `designfy-responsive`, `designfy-accessibility`, `designfy-motion`,
  `designfy-review`.
- Fragmentos: `site-header`, navegação lateral de seções, `breadcrumbs`,
  `prose`, `table-of-contents`, `code-block`, `callout`, `tabs`,
  `pagination` (anterior e próxima).
- Conferir: três colunas no desktop viram uma no celular com a navegação em
  gaveta; âncoras em todos os títulos.

## Sistema

### `dashboard`

- Especialistas: `designfy-systems`, `designfy-components`,
  `designfy-motion`, `designfy-responsive`, `designfy-accessibility`,
  `designfy-review`.
- Fragmentos: `app-shell`, `page-header`, `segmented-control` ou seletor de
  período, `stat-card`, `chart-card`, `data-table` curta, `activity-feed`,
  `skeleton`, `empty-state`, `error-state`.
- Conferir: a pergunta que o dashboard responde está no topo; cada região
  tem carregando, vazio e erro próprios.

### `table`

- Especialistas: `designfy-systems`, `designfy-components`,
  `designfy-responsive`, `designfy-accessibility`, `designfy-motion`,
  `designfy-review`.
- Fragmentos: `app-shell`, `page-header`, `filter-bar`, `data-table`,
  `bulk-actions`, `pagination`, `dropdown-menu` (ações da linha),
  `confirm-dialog`, `empty-state`, `skeleton`, `toast`.
- Conferir: o comportamento no celular está escrito (cartões ou primeira
  coluna fixa); filtros, ordenação e página ficam na URL.

### `form`

- Especialistas: `designfy-systems`, `designfy-components`,
  `designfy-accessibility`, `designfy-responsive`, `designfy-motion`,
  `designfy-review`.
- Fragmentos: `app-shell`, `page-header`, `form-layout`, `form-field`,
  `stepper` (só em fluxo longo), `file-upload`, `alert` (resumo de erros),
  `toast`, `dialog` (sair sem salvar).
- Conferir: validação de cada campo escrita em `## Estados`; o que acontece
  depois de enviar.

### `crud`

- Especialistas: as de `table` mais a parte de formulário de
  `designfy-systems`.
- Fragmentos: os de `table`, `drawer` ou página de edição com `form-layout`
  e `form-field`, `description-list` no detalhe, `confirm-dialog`.
- Conferir: criar, ver, editar e excluir têm caminho e retorno; exclusão
  confirma ou oferece desfazer.

### `detail`

- Especialistas: `designfy-systems`, `designfy-components`,
  `designfy-responsive`, `designfy-accessibility`, `designfy-motion`,
  `designfy-review`.
- Fragmentos: `app-shell`, `breadcrumbs`, `page-header` com status,
  `tabs`, `description-list`, `stat-card`, `activity-feed`, `data-table`
  (relacionados), `dropdown-menu`.
- Conferir: os dados mais consultados aparecem sem rolar; ações perigosas
  ficam no menu, não ao lado da ação principal.

### `settings`

- Especialistas: `designfy-systems`, `designfy-components`,
  `designfy-accessibility`, `designfy-responsive`, `designfy-motion`,
  `designfy-review`.
- Fragmentos: `app-shell`, `settings-layout`, `settings-section`,
  `form-field`, `danger-zone`, `confirm-dialog`, `toast`.
- Conferir: cada seção salva sozinha e mostra que salvou; cada área tem URL.

### `auth`

- Especialistas: `designfy-systems`, `designfy-components`,
  `designfy-accessibility`, `designfy-responsive`, `designfy-motion`,
  `designfy-review`.
- Fragmentos: `auth-card`, `form-field`, `background-pattern`, `alert`.
- Conferir: `autocomplete` certo em cada campo; erro que não revela se o
  e-mail existe.

## Quando chamar a `designfy-design-system` antes de tudo

- `designfy theme show` sai com 6: o projeto não tem tema do Tailwind.
- `designfy theme check` sai com 10: falta papel de cor ou um par não
  atinge 4.5:1.
- O guia pede uma fonte, uma cor ou um fundo que os tokens ainda não têm.
- A tela precisa de um papel novo (por exemplo `--chart-1` a `--chart-5`
  num primeiro dashboard, ou `--sidebar` no primeiro shell).

## Quando a ordem muda

- Tela com formulário longo: `designfy-accessibility` antes da
  `designfy-motion`, porque rótulos, erros e ordem de foco mudam a
  estrutura.
- Tabela com muitas colunas: `designfy-responsive` antes da
  `designfy-motion`, porque o formato no celular define o componente.
- Página guiada por rolagem (narrativa com seções fixas): `designfy-motion`
  junto com a `designfy-websites`, antes dos componentes.
