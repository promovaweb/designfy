# Capítulo 6: Catálogo e componentes

O estudo das 21 seções da landing page do Plano Founders rendeu onze itens para os registros React e Astro. Um deles foi `milestone-timeline`, que reúne datas, resultados e um marcador da etapa atual. Na ficha do catálogo, você encontra a função da linha do tempo. No registro do seu framework, pode consultar os arquivos que serão copiados para a tela.

## Da função da tela à ficha do catálogo

O catálogo descreve 91 padrões de interface em 15 categorias. Você pode começar pela superfície da tela ou pelo tipo já definido no viewspec. Para um dashboard, o filtro por tipo inclui tanto a estrutura do aplicativo quanto os controles compartilhados com o site.

```bash
designfy catalog list
designfy catalog list --surface webapp
designfy catalog list --kind dashboard
designfy catalog search table
```

Há 43 entradas de `site`, 22 de `webapp` e 26 de `both`. O nome antigo `system` continua aceito como `webapp`. No trecho da consulta por `--kind dashboard`, repare na superfície ao lado de cada nome.

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
  app-shell          App shell (webapp, shell)
  ...
```

Na busca por `table`, `pricing-table` descreve uma comparação de planos e `data-table` organiza registros para consulta. A busca ignora diferenças de caixa e acentuação. Ao escolher entre os resultados, observe também a superfície. O `app-shell` compõe a estrutura da aplicação, enquanto um botão marcado como `both` cabe também numa landing page.

```text
  dropdown-menu      Dropdown menu (both, actions)
  pricing-table      Pricing table (site, site-sections)
  comparison-table   Comparison table (site, site-sections)
  prose              Prose (site, content)
  table-of-contents  Table of contents (site, content)
  figure             Figure (site, content)
  chart-card         Chart card (webapp, data-display)
  data-table         Data table (webapp, data-display)
  filter-bar         Filter bar (webapp, data-display)
  bulk-actions       Bulk action bar (webapp, data-display)
  settings-layout    Settings layout (webapp, settings)
```

Para examinar uma implementação, comece pela finalidade na ficha do padrão. O comando `designfy catalog show <id>` retorna código 6 para um ID desconhecido. No caso de um indicador acompanhado da variação desde o período anterior, consulte `designfy catalog show stat-card`.

```text
Stat card
  ID              stat-card
  Surface         webapp
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

O valor do indicador aparece junto à variação desde o período anterior. Na ficha, `Accessibility` especifica como representar essa variação por sinal e texto para que a cor da seta seja dispensável. A skill `designfy-components` cruza o uso previsto em `useWhen` com as restrições de `avoidWhen`. Confira também os estados de carregamento, erro e ausência de registros antes de adotar o cartão.

O campo `Sources` indica como obter a implementação. Com `designfy:stat-card`, o próprio binário fornece os arquivos. Os prefixos `shadcn:` e `reui:` encaminham a instalação ao CLI do shadcn. Uma origem `custom` indica que você precisa implementar o padrão no projeto.

## Os componentes disponíveis para cada framework

Há 69 itens no registro React e 57 no Astro. Em cada registro, os arquivos de origem acompanham o manifesto no formato do shadcn. Você encontra os manifestos em `registry/react/registry.json` e `registry/astro/registry.json`. Como `bun run registry:embed` incorpora esses arquivos ao binário, a consulta também funciona fora de um clone do Designfy.

```bash
designfy components list
designfy components list --framework react
designfy components list --surface webapp
```

Sem `--framework`, a consulta usa o framework do `designfy.json`. Os valores `next` e `react-vite` selecionam o registro React. A tabela localiza as famílias disponíveis e identifica os itens exclusivos de React.

| Categoria | Itens |
| --- | --- |
| `layout` | `background`, `background-styles`, `pixel-stage`, `section` |
| `utilities` | `cn`, `designfy-motion-runtime` |
| `styles` | `designfy-motion`, `designfy-theme`, `designfy-prose` |
| `hero` | `hero-split`, `hero-centered`, `hero-media`, `hero-pixel` |
| `motion` | `reveal`, `counter` |
| `site-navigation` | `announcement-bar`, `site-footer`, `site-header` |
| `site-sections` | `audience-fit`, `bento-grid`, `comparison-table`, `cta-band`, `detail-card`, `faq`, `feature-grid`, `feature-rows`, `feature-split`, `logo-marquee`, `marquee`, `newsletter-form`, `numbered-checklist`, `offer-card`, `outcome-grid`, `milestone-timeline`, `pricing-table`, `profile-split`, `statement-stats`, `stats-band`, `steps`, `testimonial` |
| `containers` | `card` |
| `actions` | `theme-toggle` |
| `content` | `article-header`, `author-box`, `callout`, `code-block`, `figure`, `post-card`, `post-list`, `prose`, `reading-progress`, `table-of-contents`, `video-embed` |
| `data-display` | `activity-feed`, `description-list` nos dois registros. O React acrescenta `chart-card`, `data-table`, `filter-bar`, `stat-card` |
| `shell` | `app-shell`, `page-header`, só no React |
| `auth` | `auth-card`, só no React |
| `feedback` | `empty-state`, `error-state` |
| `forms` | `file-upload`, `form-layout`, `stepper`, só no React |
| `settings` | `settings-layout`, `settings-section`, só no React |

Na base compartilhada, `cn` combina classes e `section` define o espaçamento das seções. Instale os estilos comuns uma vez por projeto. O tema fornece os tokens, enquanto `designfy-prose` trata a tipografia de leitura. As animações usam o CSS de `designfy-motion` junto ao script de `designfy-motion-runtime`. Para fundos desenhados, o componente `background` usa a folha `background-styles`.

### Composições do Plano Founders

O `hero-pixel` pode exibir um resumo lateral. Para usar o mosaico em outra região, copie `pixel-stage` separadamente. Os onze itens do estudo estão disponíveis pelos mesmos nomes nos registros React e Astro. Consulte a ficha do seu framework para ver qual arquivo entra no projeto.

| Item | O que entrega |
| --- | --- |
| `pixel-stage` | mosaico de pixels em canvas, que lê o tema, acende com o ponteiro, pausa por teclado e tem versão parada |
| `hero-pixel` | abertura de landing sobre o palco de pixels, com resumo lateral opcional |
| `feature-rows` | vantagens numeradas em linhas alinhadas, com introdução acima ou lateral fixa |
| `milestone-timeline` | eventos datados ou etapas em ordem, com marcador do momento atual e resultados alinhados |
| `profile-split` | reúne retrato, credenciais e links de um perfil |
| `offer-card` | oferta com prazo, vagas opcionais e ação principal, nas variantes `tinted` e `stage` |
| `audience-fit` | duas listas, com perfis indicados e contraindicados, com ou sem nota |
| `numbered-checklist` | inclusões com chips numerados e destaques opcionais, em uma ou duas colunas |
| `outcome-grid` | resultados curtos numa grade responsiva de blocos com ícone |
| `detail-card` | explica um recurso com ícone, parágrafos e itens de conferência. Inclui o `DetailCardGrid` |
| `statement-stats` | frase em dois tons ao lado de estatísticas empilhadas, para compor com a linha do tempo |

Além das onze composições, o estudo ampliou cinco itens do registro. Na FAQ, a introdução pode ficar fixa à esquerda enquanto o visitante percorre as perguntas. A tabela indica a variante ou a prop que habilita cada mudança.

| Item | Variante ou prop |
| --- | --- |
| `faq` | `split` com `stickyIntro`, o título fixo à esquerda enquanto as perguntas rolam |
| `cta-band` | `secondaryAction`, a segunda ação ao lado da principal |
| `testimonial` | `carousel`, um depoimento por vez no celular e vários no desktop |
| `pricing-table` | `single`, um plano com oferta e lista de inclusões no lugar da grade |
| `marquee` | `accent`, com separadores em losango e a cor de destaque do tema |

A variante `single` acomoda uma única oferta na tabela de preços. Para descobrir quais estilos acompanham um item antes da cópia, consulte sua ficha no registro do framework em uso.

## Arquivos e dependências de hero-split

Em um projeto Astro, a ficha de `hero-split` mostra o caminho do componente e os estilos necessários. Acrescente `--source` para ler o código que entrará no projeto. Um nome desconhecido retorna o código 6.

```bash
designfy components show hero-split
```

No exemplo, `Files` identifica um arquivo Astro. As dependências do registro aparecem separadas dos pacotes de produção e desenvolvimento.

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

O hero precisa dos itens de tema e movimento mesmo com `Dependencies` vazio. Para conferir os destinos e os pacotes que faltam, use `designfy components add hero-split --dry-run`. Para gravar os arquivos, execute a mesma chamada sem a simulação.

```bash
designfy components add hero-split
```

Na saída, `Written` traz apenas o arquivo `HeroSplit.astro`. O Designfy resolveu primeiro as dependências do registro e encontrou cópias idênticas do tema, do script e do CSS de movimento. Por isso os três aparecem em `Unchanged`.

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

Ao repetir a operação depois de editar o hero localmente, procure a linha `Skipped`. Ela identifica arquivos preservados por terem conteúdo diferente. Os outros campos distinguem o material copiado das instalações que ainda cabem a você.

| Categoria | Significado |
| --- | --- |
| `Written` | arquivo gravado (novo ou substituído com `--overwrite`) |
| `Unchanged` | o arquivo já estava igual |
| `Skipped` | o arquivo existe com conteúdo diferente e mantém a versão local |
| `Missing npm packages` | pacotes de produção que o arquivo importa e o projeto não tem |
| `Missing dev packages` | pacotes de desenvolvimento que faltam |
| `Install shadcn items` | itens `shadcn:` que precisam do CLI do shadcn |

Os componentes vão para `paths.components` e os estilos para `paths.styles`. Durante a cópia, o marcador `@designfy/components` recebe o alias configurado em `designfy.json`. Sem esse arquivo, o comando avisa que usará os destinos padrão. Você pode indicar outra pasta com `--path <dir>` ou selecionar o manifesto com `--framework <framework>`.

Depois de editar `HeroSplit.astro` no projeto, use `--overwrite` apenas para repor a versão do registro. Instale os pacotes indicados na saída e rode `designfy deps check` para conferir também as dependências dos componentes copiados. O código 0 indica que a verificação passou.

## Primitivas do shadcn e blocos do ReUI

Para os controles básicos com suporte a teclado, use o CLI do shadcn. Esta chamada instala botão, cartão e diálogo no projeto que receberá a composição. [Registro do shadcn](https://ui.shadcn.com)

```bash
npx shadcn@latest add button card dialog
```

O mesmo CLI reconhece o registro `@reui`. Para obter uma grade interativa, indique o registro no nome do item. O ReUI também oferece filtros e quadros kanban. [Registro do ReUI](https://reui.io)

```bash
npx shadcn@latest add @reui/data-grid
```

As composições Designfy usam os mesmos papéis de tema do shadcn sobre o Tailwind 4. Assim, ao combinar a grade com um cabeçalho do Designfy, você consegue ajustar a tipografia e as superfícies no tema compartilhado.

## O que preservar ao editar a cópia

Cores, fontes, raios e movimento vêm do tema. Para uma superfície translúcida, use `bg-primary/10` ou `color-mix(in oklab, var(--primary) 18%, transparent)`. Classes fixas como `bg-indigo-500` e `text-gray-900` prendem o componente a uma paleta. O mesmo ocorre com `bg-[#0af]` ou uma declaração literal de `font-family`. O registro verifica essas restrições com `bun run registry:check`.

As mesmas classes de cor atendem aos modos claro e escuro porque os valores mudam no CSS. Use `dark:` quando a troca de tema exigir outra alteração, como exibir uma imagem diferente. Forneça o conteúdo por prop ou slot e omita do HTML as regiões opcionais vazias. Nos controles, confira a semântica e o foco pelo teclado. No celular, verifique se o alvo de toque alcança 44 px. Use a mesma biblioteca de ícones em toda a composição.
