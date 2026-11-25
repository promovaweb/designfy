# 0001 Fundação do framework

Status: done

## Goal

Criar o Designfy a partir do starter kit do Termfy 0.13.4: catálogos de
skills, bibliotecas e servidores MCP, registro de componentes embutido,
paleta pela roda de cores, capturas com o Playwright e leitura dos viewspecs,
pelo CLI, pela TUI e pelo MCP, com as 11 skills `designfy*` para agentes.

## Behavior

### Projeto

- `init` roda na raiz de um projeto web. Detecta o framework pelo
  `package.json` (`astro`, `next`, `react` com `vite`, só `react`, ou
  `unknown`), a versão do Tailwind, o `components.json` do shadcn, o
  gerenciador de pacotes pelo lockfile (`bun.lock`, `bun.lockb`,
  `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, nessa ordem) e o
  TypeScript. Grava `designfy.json` na raiz. Arquivo existente exige
  `--force`; `--dry-run` imprime sem gravar. Sem `package.json`, sai com 6.
- `designfy.json`: `schemaVersion` (1), `framework`, `typescript`,
  `packageManager`, `tailwind` (versão maior ou `null`), `shadcn` (boolean),
  `paths.components` (padrão `src/components/designfy`), `paths.styles`
  (padrão `src/styles`), `paths.viewspec` (padrão `viewspec`) e
  `aliases.components` (padrão `@/components/designfy`). `init` aceita
  `--components-path`, `--styles-path` e `--framework` para corrigir a
  detecção.
- `status` devolve a detecção atual (com ou sem `designfy.json`), a contagem
  de skills instaladas, de dependências presentes, de componentes copiados e
  de viewspecs por status. Não grava nada.

### Skills

- O catálogo vem de `catalog/skills.json`, embutido. Cada entrada tem `name`,
  `title`, `kind` (`internal` ou `external`), `source`, `description`,
  `group`, `frameworks` (vazio vale para todos) e `default`.
- `skills list` cruza o catálogo com o `skills-lock.json` do projeto e com
  `~/.agents/.skill-lock.json` e mostra `installed` como `project`, `global`
  ou `no`. `--internal` e `--external` filtram.
- `skills install` sem nomes instala as marcadas `default` compatíveis com o
  framework detectado; `--all` instala todas; `--internal` e `--external`
  restringem; nomes escolhem. Agrupa por `source` e roda, para cada origem,
  `npx -y skills add <source> --skill <a> --skill <b> -a <agent>... -y`, com
  `-g` em `--global`. A origem das internas vem de `skills.source`. Nome fora
  do catálogo sai com 6 e `details.known`. `--dry-run` imprime os comandos.
  A saída do `npx` vai para stderr; falha sai com 5 e o comando em `details`.
- `skills update [names...]` roda `npx -y skills update <names> -y` com `-p`
  ou `-g`. `skills remove <names...>` roda `npx -y skills remove <names> -y`.

### Dependências

- O catálogo vem de `catalog/dependencies.json`: grupos com `id`, `title`,
  `description`, `frameworks`, `default` e `packages` (`name`, `version` como
  faixa SemVer, `dev`, `purpose`, `url`).
- `deps list` mostra cada pacote com a faixa do catálogo e o estado no
  `package.json` (`missing`, `ok`, `outdated` quando a faixa instalada é de
  versão maior anterior). `--group` filtra.
- `deps check` sai com 0 quando nada falta nos grupos `default` e nos pacotes
  exigidos pelos componentes copiados; caso contrário sai com 10 e lista o
  que falta. `--group` muda os grupos conferidos.
- `deps install` sem argumentos instala o que falta nos grupos `default`
  compatíveis com o framework; argumentos são ids de grupo ou nomes de
  pacote. Monta um comando para dependências e outro para as de
  desenvolvimento (`npm install`, `pnpm add`, `bun add`, `yarn add`, com
  `-D` ou `--dev`). `--pm` força o gerenciador; `--dry-run` imprime.

### Componentes

- O registro tem dois arquivos no formato do shadcn:
  `registry/react/registry.json` e `registry/astro/registry.json`. Cada item
  tem `name`, `type`, `title`, `description`, `categories`, `dependencies`,
  `devDependencies`, `registryDependencies` (outros itens do Designfy ou do
  shadcn, estes com o prefixo `shadcn:`) e `files` (`path` no repositório e
  `target` relativo à pasta de componentes ou de estilos). `meta.motion`
  diz se o item se move; `meta.surface` é `site`, `system` ou `both`.
- O binário leva o registro embutido em `src/generated/registry.ts`, gerado
  por `bun run registry:embed`. `bun run registry:check` falha quando o
  gerado diverge dos arquivos.
- `components list` filtra por `--framework`, `--category` e `--surface`. Sem
  `--framework`, usa o de `designfy.json`; `next` e `react-vite` leem o
  registro React.
- `components show <name>` traz descrição, arquivos, dependências, itens
  exigidos e o conteúdo com `--source`.
- `components add <names...>` resolve os itens exigidos do Designfy em
  ordem, grava cada arquivo no `target` dentro de `paths.components` ou
  `paths.styles`, troca o marcador `@designfy/components` pelo alias de
  `designfy.json` e relata arquivos gravados, pacotes npm que faltam e itens
  `shadcn:` a instalar com `npx shadcn@latest add`. Arquivo existente e
  diferente não é tocado sem `--overwrite` e aparece em `skipped`; a saída
  nesse caso é 0 com aviso. Sem `designfy.json` usa os padrões e avisa.
  `--dry-run` não grava. Nome desconhecido sai com 6.

### MCP

- O catálogo vem de `catalog/mcp.json`: `id`, `title`, `description`,
  `command`, `args`, `url` e `default`.
- `mcp servers` lista o catálogo e marca os que já estão nos arquivos do
  projeto.
- `mcp setup [servers...]` grava as entradas escolhidas (padrão: as
  `default`) nos clientes de `--client` (padrão: todos os que já têm arquivo
  no projeto, e `claude` quando nenhum tem). Arquivos: `.mcp.json` (Claude
  Code), `.codex/config.toml` (Codex), `opencode.json` (OpenCode),
  `.cursor/mcp.json` (Cursor) e `.gemini/settings.json` (Gemini CLI).
  Preserva as outras chaves e entradas. Entrada existente e diferente exige
  `--force`. `--dry-run` imprime o resultado. Nenhuma entrada leva segredo.
- `designfy mcp` sem subcommand continua iniciando o servidor stdio.

### Paleta

- Cores entram como hex (`#RGB`, `#RRGGBB`) ou `oklch(L C H)`.
- `palette generate --base <color>` monta a escala `50` a `950` em OKLCH
  para `primary`, uma escala `neutral` com o matiz da base e croma baixo e,
  com `--harmony` (`complementary`, `analogous`, `triadic`,
  `split-complementary`, `tetradic`, `monochromatic`), as escalas `accent`.
  Gera os tokens semânticos claros e escuros (`background`, `foreground`,
  `card`, `muted`, `border`, `primary`, `primary-foreground`, `accent`,
  `ring`, `destructive`, `success`, `warning`, `info`) com o contraste
  conferido. `--format css` imprime variáveis no formato do shadcn com
  `@theme inline`, `json` imprime o objeto e `tailwind` imprime só o bloco
  `@theme`. `--out <file>` grava em arquivo.
- `palette wheel <color>` devolve todas as harmonias com o hex e o OKLCH.
- `palette contrast <foreground> <background>` devolve a razão WCAG, o Lc do
  APCA e o veredito para texto normal, texto grande e elemento de interface
  (AA e AAA). Sai com 0 sempre; `--min <ratio>` faz sair com 10 abaixo do
  valor.

### Capturas

- `capture run <urls...>` abre cada URL nos viewports escolhidos e grava um
  PNG por combinação em `<outDir>/<run>/`, com `manifest.json` (URLs,
  viewports, tema, arquivos, medidas da página, estouro horizontal, erros de
  console e título). Viewports nomeados: `mobile` 390x844 com toque e escala
  3, `tablet` 820x1180 com toque e escala 2, `desktop` 1440x900, `wide`
  1920x1080; também aceita `LARGURAxALTURA`. Padrão: `mobile,desktop`.
- Options: `--viewport` (repetível ou com vírgulas), `--theme light|dark`
  (`colorScheme` do navegador), `--full-page` (padrão) e `--fold` (só a
  primeira dobra), `--reduced-motion`, `--wait <ms>`, `--selector <css>`
  (captura só o elemento), `--out <dir>` e `--name <run>`.
- O Playwright roda num processo Node: o binário grava o runner embutido
  numa pasta temporária e chama `node`, que resolve `playwright` a partir do
  projeto. Sem o pacote, sai com 10 e a dica
  `designfy deps install testing`. URL que não responde sai com 5.
- O `manifest.json` marca `overflowX: true` quando a largura do documento
  passa a do viewport: é o sinal de quebra no celular que a skill
  `designfy-review` lê primeiro.
- `capture list` mostra as execuções, mais recente primeiro.

### Viewspec

- O contrato está em `docs/viewspec.md`. `viewspec list` lê
  `<paths.viewspec>/<id>-<slug>/VIEWSPEC.md`, valida o front matter e a
  checklist e mostra `id`, título, `kind`, `status` e progresso.
  `--status` e `--kind` filtram. Arquivo inválido aparece em `errors` com o
  motivo, e a saída é 10.
- `viewspec show <id>` devolve o front matter, as seções e os itens da
  checklist. `viewspec progress` devolve a contagem por status, o total de
  itens e o `nextId`. `viewspec validate [id]` confere um ou todos e sai com
  7 quando há erro.
- O binário nunca grava viewspec.

### Catálogo de interface

- `catalog/interface.json` é o catálogo dos componentes comuns de interface
  de sites e de sistemas. É a fonte que as skills leem para escolher os
  fragmentos de uma tela, antes de olhar para qualquer implementação.
- Cada entrada tem `id`, `name`, `surface` (`site`, `system` ou
  `both`), `category`, `purpose`, `useWhen`, `avoidWhen`, `anatomy`
  (partes), `variants`, `states`, `responsive`, `motion`,
  `accessibility`, `tokens` (papéis do tema que o fragmento usa),
  `related` e `sources`: onde está a implementação (`designfy:<item>`,
  `shadcn:<item>`, `reui:<item>` ou `custom`).
- `catalog list` filtra por `--surface`, `--category` e `--kind` (tipo de
  tela do viewspec; devolve os fragmentos indicados para aquele tipo).
  `catalog show <id>` devolve a entrada inteira. `catalog search <text>`
  procura em nome, propósito e uso. Id desconhecido sai com 6.
- Todo item do registro aponta para uma entrada do catálogo em
  `meta.catalog`; `registry:check` falha quando o id não existe.

### Tema

- Todos os componentes obedecem ao mesmo design system: cores, tipografia,
  raios e espaçamento vêm do tema do Tailwind do projeto. Arquivo do
  registro não leva cor literal (hex, `rgb()`, `oklch()` fora do arquivo de
  tokens), classe de paleta fixa do Tailwind (`bg-indigo-500`,
  `text-gray-900`) nem `font-family` literal. Usa os papéis do tema
  (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`,
  `border-border`, `font-heading`, `font-sans`, `rounded-lg`).
  `registry:check` recusa o que fugir disso.
- `theme show` lê o tema do projeto: procura o CSS com
  `@import "tailwindcss"` (`paths.styles`, `src/styles`, `src/app`,
  `src/index.css`, `app/globals.css` ou `--file`), segue os `@import`
  locais e extrai as variáveis de `@theme`, `@theme inline`, `:root` e
  `.dark`. Devolve cores (com o valor resolvido em hex para claro e
  escuro), famílias de fonte, escala de texto, pesos, raios, espaçamento
  base, sombras, pontos de quebra, curvas e durações. `--group` restringe
  (`colors`, `fonts`, `text`, `radius`, `spacing`, `shadows`,
  `breakpoints`, `motion`).
- `theme check` mede o contraste dos pares conhecidos
  (`foreground` em `background`, `primary-foreground` em `primary`,
  `muted-foreground` em `muted` e `background`, `card-foreground` em
  `card`, `accent-foreground` em `accent`, `destructive-foreground` em
  `destructive`), nos dois temas, e confere se os papéis que o registro usa
  existem. Sai com 10 quando um par fica abaixo de 4.5 ou um papel falta.
- Sem CSS do Tailwind no projeto, `theme show` sai com 6 e a dica
  `designfy components add designfy-theme`.

### Guia do projeto

- `viewspec guide` lê o `VIEWSPEC.md` da raiz (contrato em
  `docs/viewspec.md`): front matter, seções presentes, regras por seção e
  por origem e aprendizados em `proposta`. Sem o arquivo, sai com 6.
- `viewspec validate` confere também o guia; a ausência dele é aviso.
- `status` informa se o guia existe e quantas regras tem.

### TUI

- A TUI segue o padrão de design do Hub (`TUI.md` na raiz do Hub): sem
  barra de abas. A Home (`overview`) é o menu, em grade de cartões
  numerados com o resumo vivo de cada módulo e uma faixa de próximo passo.
  Módulos: `theme`, `catalog`, `components`, `skills`, `deps`, `mcp`,
  `viewspecs`, `captures` e `project`, mais `settings`, `credentials`,
  `docs` e `about`. `1` a `9` e `0` abrem os módulos; `Esc` volta à Home.
- As ações que gravam mostram o plano no painel de detalhe; a mesma tecla
  executa, com progresso vivo e resultado.
- `skills`, `deps` e `mcp` são listas de seleção múltipla: `space` marca,
  `a` marca todas, `n` limpa, `i` instala as marcadas com confirmação,
  `u` atualiza (skills) e `d` remove (skills). A operação roda sem travar a
  interface e mostra o resultado num toast e no painel de detalhe.
- `components` lista por categoria, com `f` para trocar o framework, `enter`
  para ver arquivos e dependências e `i` para copiar os marcados.
- `viewspecs` e `captures` são lista e detalhe, só leitura.
- `theme` mostra o tema do Tailwind do projeto: amostras de cor em
  truecolor com o nome do papel, o valor e o contraste do par, as famílias
  de fonte, a escala de texto, os raios, o espaçamento e o movimento. `t`
  troca entre claro e escuro e `r` relê os arquivos.
- `catalog` lista o catálogo de interface por categoria, com `s` para
  alternar site e sistema e `enter` para ver anatomia, estados e fontes.

## Design

- Domínio em `src/design/`, sem importar de `cli/`, `tui/` ou `mcp/`:
  `exec.ts` (runner de processos injetável), `project.ts`, `catalog.ts`,
  `skills.ts`, `deps.ts`, `registry.ts`, `mcp-clients.ts`, `color.ts`,
  `capture.ts`, `capture-runner.mjs` (texto embutido), `viewspec.ts`,
  `interface-catalog.ts` e `theme.ts`.
  Commands, tools e screens só chamam essas funções.
- `exec.ts` exporta `run(command, args, options)` e `setRunner()` para os
  testes trocarem o processo real por um registrador. Nenhum teste chama
  `npx`, instala pacote ou abre navegador, exceto o teste de captura, que
  roda só com `DESIGNFY_E2E=1`.
- Catálogos em `catalog/*.json`, importados como JSON e validados com Zod na
  carga. `DESIGNFY_CATALOG_DIR` troca a pasta nos testes.
- `color.ts` implementa sRGB, OKLab e OKLCH, recorte de gamut por redução de
  croma, a escala por curva de luminosidade fixa, as harmonias, o contraste
  WCAG 2.2 e o APCA 0.0.98G-4g, sem dependência.
- `viewspec.ts` lê o front matter com um parser YAML restrito ao contrato
  (escalares, listas em linha e em bloco), sem dependência nova.
- `mcp-clients.ts` edita JSON preservando as outras chaves e o TOML do Codex
  por bloco `[mcp_servers.<id>]`, sem reescrever o resto do arquivo.
- `scripts/embed-registry.ts` gera `src/generated/registry.ts`;
  `validate` passa a rodar `registry:check` e `skills:lint`
  (`scripts/check-designfy-skills.ts`, que confere frontmatter, seções,
  links das referências e as famílias vetadas).
- Exit codes: usa os do starter kit; 5 para falha de processo externo ou
  rede, 6 para item desconhecido, 10 (`CHECK_FAILED`, família nova em `src/app/exit-codes.ts`) para
  conferência reprovada.
- Um arquivo por command em `src/cli/commands/`, por grupo de tools em
  `src/mcp/tools/` e por screen em `src/tui/screens/`.

## Surface

Commands `init`, `status`, `skills *`, `deps *`, `components *`,
`mcp servers`, `mcp setup`, `palette *`, `capture *`, `viewspec *`,
`catalog *` e `theme *`; screens `theme`, `catalog`, `skills`, `components`,
`deps`, `mcp`, `viewspecs` e `captures`; tools da
tabela do `CLISPEC.md`; keys `skills.source`, `skills.agents`,
`deps.packageManager`, `capture.viewports` e `capture.outDir`.

## Tasks

- [x] Bootstrap do starter kit `#termfy-init`
- [x] Catálogos de skills, bibliotecas e servidores MCP
- [x] Contrato do viewspec em `docs/viewspec.md`
- [x] `exec`, projeto, `init` e `status` `#termfy-cli`
- [x] `skills` e `deps` `#termfy-command-set`
- [x] Registro embutido e `components` `#termfy-command-set`
- [x] `mcp servers` e `mcp setup` `#termfy-cli`
- [x] `palette` `#termfy-cli`
- [x] `capture` com o runner do Playwright `#termfy-cli`
- [x] `viewspec` e o guia do projeto `#termfy-command-set`
- [x] Catálogo de interface e `catalog` `#termfy-command-set`
- [x] `theme show` e `theme check` `#termfy-cli`
- [x] Conferência de tokens e de catálogo em `registry:check`
- [x] Settings novas `#termfy-config`
- [x] Tools MCP `#termfy-mcp`
- [x] Screens `#termfy-tui`
- [x] 11 skills `designfy*` e o validador delas
- [x] Componentes do registro em React e Astro
- [x] Marca em `brand/`
- [x] Documentação embutida, README, CONTRIBUTING, guia e ebook `#termfy-docs`
- [x] Exemplos em `examples/`

## Tests

- [x] Detecção de projeto e `designfy.json` (`tests/project.test.ts`)
- [x] Planos de `skills` e `deps` com o runner trocado (`tests/skills.test.ts`, `tests/deps.test.ts`)
- [x] Registro, resolução de itens exigidos, `add`, `--overwrite` e `--dry-run` (`tests/components.test.ts`)
- [x] Gravação nos cinco clientes MCP preservando o que existia (`tests/mcp-clients.test.ts`)
- [x] Conversões de cor, escala, harmonias, WCAG e APCA com valores de referência (`tests/color.test.ts`)
- [x] Leitura, validação e progresso de viewspecs, com casos inválidos (`tests/viewspec.test.ts`)
- [x] Leitura do guia da raiz, regras, origens e aprendizados (`tests/viewspec-guide.test.ts`)
- [x] Catálogo de interface: filtros, busca e ids do registro (`tests/interface-catalog.test.ts`)
- [x] Tema: `@theme`, `:root`, `.dark`, imports, resolução de `var()` e contraste (`tests/theme.test.ts`)
- [x] Plano de captura e manifesto com o runner trocado (`tests/capture.test.ts`)
- [x] Tools MCP por stdio (`tests/mcp-designfy.test.ts`)
- [x] TUI com as abas novas em todos os tamanhos (`tests/tui-*.test.ts`)
- [x] `bun run validate` verde

## Notes

- 24/11/2026: nome viewspec, pasta visível, logo A e 11 skills escolhidos
  pelo Luiz. No mesmo dia: guia `VIEWSPEC.md` na raiz, catálogo de interface
  lido pelas skills, tema único do Tailwind, aba de tema na TUI e movimento
  como padrão de toda tela.
- 24/11/2026: spec fechada na versão 0.1.1, com os componentes de site, de
  conteúdo e de sistema no registro e os apps de exemplo.
