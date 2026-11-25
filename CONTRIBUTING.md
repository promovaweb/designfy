# Contribuindo com o Designfy

Este guia é para quem desenvolve, revisa ou mantém o Designfy. Para instalar e
usar a ferramenta, leia o [README.md](README.md).

O Designfy é um binário Bun em TypeScript, criado com o starter kit do
[Termfy](https://github.com/promovaweb/termfy). O mesmo executável abre a TUI,
roda como CLI e sobe um servidor MCP por stdio. A parte que faz o Designfy ser
Designfy fica em `src/design/`: projeto, catálogos, registro de componentes,
tema, paleta, viewspecs, capturas e configuração dos clientes MCP.

## Antes de começar

Mudanças de comportamento começam por uma conversa. Use o
[Discord](https://promovaweb.com/discord) para dúvidas de uso e de direção e
abra uma [issue](https://github.com/promovaweb/designfy/issues) por mudança.
Descreva o problema, a versão (`designfy --version`), o sistema operacional e o
passo a passo para reproduzir.

Pull requests grandes sem issue discutida antes podem ficar em revisão por mais
tempo. Correções pequenas de documentação e de texto podem ir direto para o
pull request.

## Ambiente

Requisitos:

- Bun 1.4.4 ou superior. O binário roda sobre
  [Bun](https://github.com/oven-sh/bun), não sobre Node.js.
- [Node.js](https://github.com/nodejs/node) para o `npx skills`, para o
  Playwright das capturas e para gerar o ebook.
- Git.

```bash
git clone https://github.com/promovaweb/designfy.git
cd designfy
bun install
bun run dev -- --help                                 # roda o CLI pelo TypeScript
bun run dev -- status                                 # lê o projeto da pasta atual
```

Para experimentar sem tocar nos dados reais, aponte a pasta de dados para um
diretório temporário com `DESIGNFY_HOME`:

```bash
export DESIGNFY_HOME="$(mktemp -d)"
bun run dev -- config list
```

As preferências e o cofre ficam em `~/.designfy/` (`settings.json`,
`credentials.json` e `master.key`). A variável `DESIGNFY_HOME` troca essa pasta.

### Os testes não usam rede

O domínio em `src/design/` recebe o runner de processos por injeção:
`src/design/exec.ts` exporta `run` e `setRunner`, e os testes trocam o processo
real por um registrador. Nenhum teste chama `npx`, instala pacote ou abre
navegador. A exceção é o teste de captura, que roda só com `DESIGNFY_E2E=1`.
Os catálogos podem ser trocados com `DESIGNFY_CATALOG_DIR` e o registro com
`DESIGNFY_REGISTRY_FILE`.

## Organização do código

```text
src/
  main.ts             entrada: TUI sem argumentos, CLI com argumentos, mcp com subcomando
  app/                identidade do binário, exit codes e AppError
  config/             settings.json, cofre cifrado, master key e caminhos
  design/             domínio: projeto, catálogos, registro, tema, cor, viewspec, capturas e clientes MCP
  generated/          registro embutido de React e Astro, gerado por scripts/embed-registry.ts
  cli/                registry, parser, saída e um arquivo por command em cli/commands/
  mcp/                servidor, resources, prompts e um grupo de tools por arquivo
  tui/                tema, componentes, ícones e telas em tui/screens/
  skill/              documentação embutida lida por --skill
catalog/              skills, dependências, servidores MCP e catálogo de interface
registry/             fragmentos e arquivos de origem do React e do Astro, com shared/
skills/               as onze skills designfy*, seus references/ e assets/
docs/                 documentação embutida, impressa por designfy --skill
docs/user/            guia do usuário, fonte do ebook
.ebook/               gerador do PDF e do EPUB, templates, CSS e metadados
ebook/                VERSION, build.json e os artefatos da edição
examples/             sites e sistemas de exemplo, com a galeria de fundos
brand/                logo, paleta, tokens, fontes e regras da marca
scripts/              build, geração do registro e dos fundos, sincronização e checks
tests/                bun test, com fixtures e quadros de referência da TUI
template/             stubs de command, screen, tool e do banco SQLite opcional
.agents/skills/       skills do framework Termfy, instaladas por npx skills
.github/workflows/    ci.yml (validação) e release.yml (binários e GitHub Release)
dist/                 binários compilados por bun run build (gerado, fora do Git)
```

As partes que fazem o Designfy ser Designfy:

| Caminho | Responsabilidade |
| --- | --- |
| `src/design/project.ts` | detectar framework, Tailwind, shadcn, gerenciador e gravar `designfy.json` |
| `src/design/registry.ts` | ler o registro embutido, resolver itens exigidos e escrever arquivos no projeto |
| `src/design/color.ts` | sRGB, OKLab e OKLCH, escala, harmonias, WCAG 2.2 e APCA, sem dependência |
| `src/design/theme.ts` | ler o CSS do Tailwind, seguir imports, extrair tokens e conferir contraste |
| `src/design/interface-catalog.ts` | catálogo de fragmentos, filtros, busca e ids do registro |
| `src/design/viewspec.ts` | ler o guia e as telas, validar o contrato e calcular progresso |
| `src/design/capture.ts` | plano de captura, runner do Playwright e manifesto |
| `src/design/mcp-clients.ts` | gravar entradas nos cinco clientes preservando o resto do arquivo |
| `src/cli/commands/components.ts` | commands `components list`, `show` e `add` |
| `src/mcp/tools/components.ts` | tools `components_list`, `components_show` e `components_add` |
| `src/tui/screens/components.ts` | aba Components, com prévia e cópia dos marcados |

As camadas e o fluxo de execução estão em
[docs/architecture.md](docs/architecture.md). O mapa de onde cada mudança entra
está em [docs/customize-template.md](docs/customize-template.md).

## Scripts

Todos rodam da raiz do repositório.

| Script | O que faz e o que confere |
| --- | --- |
| `dev`, `start`, `tui` | `bun run src/main.ts`. Sem argumentos abre a TUI |
| `mcp` | `bun run src/main.ts mcp`, o servidor MCP por stdio |
| `build` | `scripts/build.ts`: compila `dist/designfy` para a plataforma atual |
| `build:all` | compila linux-x64, linux-arm64, darwin-x64, darwin-arm64 e windows-x64 |
| `test` | `bun test`, a suíte completa, sem rede |
| `typecheck` | `bunx tsc --noEmit` |
| `opencli` | regera `docs/opencli.json` a partir do registry de commands |
| `opencli:check` | `scripts/check-opencli.ts`: falha quando `docs/opencli.json` divergir do registry |
| `skills:install` | `npx skills add` das skills do framework Termfy em `.agents/skills/` |
| `skills:update` | `npx skills update -p` das skills do framework |
| `skills:check` | `scripts/check-skills.ts`: confere as skills `termfy-*` e o `skills-lock.json` |
| `init` | `scripts/init.ts`, a preparação de um projeto derivado do starter kit |
| `validate` | a cadeia completa de validação, descrita abaixo |
| `docs:check` | `scripts/check-docs.ts`: confere a documentação contra o código |
| `registry:embed` | `scripts/embed-registry.ts`: gera os manifestos e `src/generated/registry.ts` |
| `registry:check` | `scripts/embed-registry.ts --check`: valida os fragmentos e as saídas geradas |
| `backgrounds:build` | `scripts/build-backgrounds.ts`: gera CSS, presets, catálogo, tipo e galeria |
| `backgrounds:check` | `scripts/build-backgrounds.ts --check`: falha quando uma saída de fundo divergir |
| `skills:sync` | `scripts/sync-skill-assets.ts`: gera os arquivos que as skills carregam |
| `skills:sync:check` | `scripts/sync-skill-assets.ts --check`: falha quando um arquivo gerado divergir da fonte |
| `skills:lint` | `scripts/check-designfy-skills.ts`: confere estrutura, links, texto e comandos citados |
| `ebook` | `.ebook/build-ebook.mjs`: gera o PDF e o EPUB do guia |
| `ebook:verify` | `.ebook/build-ebook.mjs --check`: confere a edição sem gerar |

O `validate` executa, nesta ordem: `typecheck`, `bun test`, `skills:check`,
`skills:sync:check`, `skills:lint`, `registry:check`, `backgrounds:check`,
`opencli:check`, `docs:check` e `build`.

O `docs:check` exige que todo command do registry apareça em `docs/cli.md`, toda
tela em `docs/tui.md`, toda tool, resource e prompt em `docs/mcp.md`, toda key
de settings em `docs/configuration.md` e todo exit code em `docs/exit-codes.md`.

O `skills:lint` confere o frontmatter e as seções de cada skill, os links
relativos com âncora, os arquivos de `references/` e `assets/` sem link, as
famílias vetadas e o travessão, além de cada `designfy` command, option, tool e
item de catálogo citado no texto.

## Fluxo de trabalho

1. Abra ou escolha uma issue que descreva o comportamento esperado.
2. Crie um branch curto a partir da `main`.
3. Quando o pedido não for trivial, leia a spec aberta que o cobre em `specs/`.
   Se nenhuma cobrir, escreva a spec com a skill `termfy-spec` antes de
   implementar.
4. Faça a mudança em `src/` e acrescente o teste correspondente em `tests/`.
5. Se a mudança alterar a superfície do CLI, do MCP, da TUI ou da configuração,
   atualize `docs/`. Quando o registry de commands mudar, rode `bun run opencli`
   e revise o diff de `docs/opencli.json`.
6. Rode `bun run validate`. Quando o guia do usuário mudar, rode também
   `bun run ebook` e `bun run ebook:verify`.
7. Abra o pull request com a issue relacionada e a validação executada.

## Regras do código

- Código, nomes de arquivos, comandos, mensagens do binário, options,
  arguments, chaves de configuração e campos do `--json` em inglês.
  Documentação para pessoas, comentários de cabeçalho e JSDoc em português do
  Brasil, com os termos técnicos em inglês.
- Toda option, argument, tool e chave nasce documentada: `description` no
  registry, linha em `docs/` e, quando for conceito novo, um parágrafo em prosa.
  O `--skill` imprime `docs/` inteiro mais a referência gerada do registry.
- Exit codes vêm de `src/app/exit-codes.ts`. Zero é sucesso. Não invente número
  em command: acrescente a família na tabela e o atalho em `src/app/errors.ts`.
- Segredos nunca passam por argumento, log, erro, `--json` sem `--reveal`, tool
  do MCP ou frame da TUI. Leia com `getCredential()`.
- Stdout recebe dados. Stderr recebe progresso e avisos. No modo `mcp`, o stdout
  é do JSON-RPC.
- Um arquivo por command, por tela e por grupo de tools. O registro central fica
  em `src/cli/commands.ts`, `src/tui/screens/index.ts` e `src/mcp/server.ts`.
- O domínio fica em `src/design/` e não importa de `cli/`, `tui/` ou `mcp/`.
  Commands, tools e telas chamam as funções do domínio.
- Cores da TUI só em `src/tui/theme.ts`. As três paletas são `terminal`, `night`
  e `day`.
- Componente do registro usa só os papéis do tema do Tailwind: nenhuma cor
  literal, nenhuma classe de paleta fixa e nenhuma `font-family` literal.
  `registry:check` recusa o que fugir disso.
- Node e npm não entram no binário. O projeto usa Bun para rodar, testar e
  compilar. O `npx`, para as skills e para o Playwright da captura, é a única
  exceção.
- Documente o código novo ou alterado com cabeçalho explicando o propósito do
  arquivo e JSDoc em funções exportadas.
- `dist/`, `src/generated/registry.ts`, `docs/opencli.json` e os arquivos
  marcados como gerados nas skills são saída de script. Não edite à mão: rode o
  script correspondente.

## Como estender

### Um command

1. Copie `template/command/example.ts` para `src/cli/commands/<name>.ts`.
2. Preencha `name`, `description`, `arguments`, `options`, `examples` e
   `exitCodes`. Toda option precisa de `description`.
3. Implemente `run(ctx)` devolvendo `{ data, text }` e use `error.*` para as
   falhas previstas.
4. Registre o command em `src/cli/commands.ts` e descreva-o em `docs/cli.md`.
5. Rode `bun test`, `bun run opencli` e confira `docs/opencli.json`.

### Uma tool MCP

1. Copie `template/tool/example.ts` para `src/mcp/tools/<group>.ts`.
2. Declare `inputSchema` com Zod e descreva cada campo com `.describe()`.
3. Devolva `content` em texto e `structuredContent` quando a saída for
   estruturada.
4. Acrescente a tool a `catalog.tools` para o `mcp --list` e registre a função em
   `registerAll` em `src/mcp/server.ts`.
5. Descreva a tool em `docs/mcp.md` e teste por stdio.

Tools que gravam no projeto entram na lista do modo `--read-only`. Hoje ficam
fora dele `components_add` e `capture_run`.

### Uma tela da TUI

1. Siga o padrão das TUIs da Promovaweb, ensinado pela skill
   [`termfy-tui`](https://github.com/promovaweb/termfy), e
   [docs/tui.md](docs/tui.md), a referência da interface atual.
2. Copie `template/screen/example.ts` para `src/tui/screens/<name>.ts`.
3. Use os componentes de `src/tui/components.ts`, o `ScreenContext` de
   `src/tui/screen.ts` e as cores de `src/tui/theme.ts`.
4. Registre a tela em `src/tui/screens/index.ts`, com tecla, grupo e resumo para
   a Home, e descreva-a em `docs/tui.md` e em `settings.tui.initialTab`.
5. Cuide dos estados de vazio, carregando e erro, do filtro `/`, da seleção
   múltipla quando houver ação em lote e do mouse espelhando o teclado.
6. Rode `bun test tests/tui-designfy.test.ts`. Para recriar os quadros de
   referência em `tests/showcase-frames/` depois de uma mudança visual:

   ```bash
   UPDATE_SHOWCASE=1 bun test tests/tui-designfy.test.ts
   ```

A tela precisa funcionar em 100x30 e 140x40, e a barra de teclas precisa manter
`?` e `q`.

### Um item do registro

1. Leia [registry/README.md](registry/README.md) e
   [registry/CONVENTIONS.md](registry/CONVENTIONS.md).
2. Crie o item no fragmento de `registry/react/items/` ou
   `registry/astro/items/` ou acrescente ao fragmento da área. O `name` é único
   no registro.
3. Declare o arquivo de origem em `files[].path` e o destino em
   `files[].target`. Arquivo usado pelos dois frameworks fica em
   `registry/shared/`; CSS de estilo usa `meta.targetRoot: "styles"`.
4. Use só os papéis do tema, ligue o item a uma entrada do catálogo em
   `meta.catalog`, declare `meta.motion` e `meta.surface`, e liste os pacotes npm
   e os itens exigidos.
5. Rode `bun run registry:embed` e `bun run registry:check`.

O item existe nos dois frameworks com o mesmo nome, as mesmas props e a mesma
estrutura, a menos que só faça sentido em um deles.

### Uma entrada do catálogo de interface

1. Acrescente a entrada em `catalog/interface.json` com `id`, `name`, `surface`,
   `category`, `purpose`, `useWhen`, `avoidWhen`, `anatomy`, `variants`,
   `states`, `responsive`, `motion`, `accessibility`, `tokens`, `related` e
   `sources`.
2. Em `sources`, aponte onde está a implementação: `designfy:<item>`,
   `shadcn:<item>`, `reui:<item>` ou `custom`.
3. Rode `bun run skills:sync` para regerar
   `skills/designfy-components/references/catalogo-de-interface.md` e
   `bun run registry:check` para conferir os ids usados pelo registro.

### Uma skill

1. Crie `skills/<name>/SKILL.md` com o frontmatter `name` igual ao nome da pasta
   e uma `description` de até 1024 caracteres que diga quando usar.
2. Escreva as cinco seções exigidas, nesta ordem: `## Leitura prévia`,
   `## Regras`, `## Passos`, `## Marcos` e `## Saída`.
3. Coloque os textos de apoio em `references/` e os modelos em `assets/`, e
   ligue cada arquivo a partir do Markdown da própria skill.
4. Acrescente a skill a `catalog/skills.json` com `kind: "internal"` e
   `source: "promovaweb/designfy"`. Quando ela for instalada por padrão, marque
   `default: true`.
5. Não use travessão como pontuação. O `skills:lint` reprova as famílias
   vetadas pelo projeto e a construção vetada; a lista está em
   `scripts/check-designfy-skills.ts`.
6. Rode `bun run skills:lint`, `bun run skills:sync:check` e `bun run validate`.

As skills são escritas à mão. O `scripts/sync-skill-assets.ts` só gera os
arquivos que vêm de uma fonte única: o contrato do viewspec de
`docs/viewspec.md`, o tema inicial de
`registry/shared/styles/designfy-theme.css`, o catálogo de interface e o catálogo
de bibliotecas. O contrato em [docs/viewspec.md](docs/viewspec.md) é a fonte do
`skills/designfy-viewspec/references/contrato.md`; mude o contrato e rode
`bun run skills:sync`.

### Um preset de fundo

1. A fonte é `skills/designfy-design-system/references/backgrounds/reactbd-bg.json`,
   com o aviso de licença em `NOTICE.md`.
2. Rode `bun run backgrounds:build`. O script gera
   `registry/shared/backgrounds/designfy-backgrounds.css` e `presets.json`, o
   catálogo em `skills/designfy-design-system/references/backgrounds/catalogo.md`,
   o tipo em `registry/react/background/presets.ts` e os dados da galeria em
   `examples/backgrounds/index.html`.
3. Confira `bun run backgrounds:check` e abra a galeria de exemplo.

### As dependências e os servidores MCP sugeridos

`catalog/dependencies.json` guarda os grupos de bibliotecas, com faixa SemVer,
purpose e URL. `catalog/mcp.json` guarda os servidores sugeridos, com comando,
arguments e URL. Depois de mudar qualquer um dos dois, rode `bun run skills:sync`
para atualizar o catálogo que a skill carrega.

## Validar

O comando completo é:

```bash
bun run validate
```

Comandos auxiliares:

```bash
bun test tests/components.test.ts        # um arquivo de teste
bun run opencli                          # regera docs/opencli.json
bun run dev -- mcp --list                # tools, resources e prompts do servidor
bun run build:all                        # binários para as cinco plataformas
bun run ebook                            # gera PDF e EPUB do guia do usuário
bun run ebook:verify                     # confere a edição sem gerar
```

A CI em `.github/workflows/ci.yml` roda `bun install --frozen-lockfile` e
`bun run validate` a cada pull request e push na `main`.

## Documentação

| Onde | O que fica |
| --- | --- |
| `README.md` | instalação e uso |
| `docs/` | documentação embutida, impressa por `designfy --skill` |
| `docs/user/` | guia do usuário, fonte do ebook |
| `docs/architecture.md` | camadas, fluxo de execução e regras de dependência |
| `docs/customize-template.md` | onde cada mudança entra no código |
| `docs/viewspec.md` | contrato do guia e do viewspec de tela |
| `docs/release.md` | publicação de versões |
| `skills/` | instruções lidas pelo agente que usa o binário |
| `registry/README.md` e `registry/CONVENTIONS.md` | como o registro funciona e as regras de cada item |
| `brand/README.md` | logo, paleta e regras de uso da marca |

A documentação publicada no site fica em
[promovaweb.com/docs/designfy](https://promovaweb.com/docs/designfy/) e
acompanha a release. O guia do usuário em `docs/user/` é a fonte do ebook e da
versão publicada.

O `docs:check` faz parte do `validate`. Quando a mudança tocar um command, uma
tool, uma tela, uma key ou um exit code, atualize `docs/` no mesmo commit.

### Ebook

O PDF e o EPUB saem de `docs/user/`, na ordem definida em
`docs/user/reading-order.txt`. O gerador fica em `.ebook/build-ebook.mjs`, usa
`brand/logo/icon.svg` e os templates de `.ebook/`, e grava a edição em `ebook/`.
A versão em `ebook/VERSION` identifica a edição e acompanha a versão do
`package.json`.

```bash
bun run ebook
bun run ebook:verify
```

A geração precisa de `pandoc`, `weasyprint`, `unzip`, `xmllint`, `magick`
(ImageMagick), `fc-match` e `pdftohtml`. O `ebook:verify` confere versão, hash da
fonte e a edição gerada, sem gerar nada de novo.

## Commits e pull requests

Os commits seguem Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`,
`build:`). Os prefixos orientam a seção da próxima versão no `CHANGELOG.md`.

Um pull request deve trazer:

- descrição do problema e do comportamento novo;
- a issue relacionada;
- os comandos de validação executados;
- trecho de saída ou captura de tela quando a mudança for visível no terminal.

Não inclua credenciais, o conteúdo de `~/.designfy/` nem dados reais de um
projeto no pull request. Use um projeto de exemplo de `examples/` e um
`DESIGNFY_HOME` temporário.

Trabalho em lotes paralelos usa arquivos disjuntos: dois lotes ao mesmo tempo
nunca escrevem o mesmo arquivo, e o lote que integra fica com os registros
centrais, como `catalog/*.json`, `docs/opencli.json` e `package.json`.

## Releases

A versão vem do `package.json` e o histórico fica no `CHANGELOG.md`. A tag
`vX.Y.Z` dispara o workflow `release.yml`, que instala os pacotes nativos de
todos os alvos, roda `bun run validate`, compila os binários das cinco
plataformas, gera o `SHA256SUMS` e publica a GitHub Release com as notas do
changelog. O repositório é público sob a AGPL 3.0. A publicação no npm sai do
pacote em `npm/`, com a mesma versão, logo depois da release.

O passo a passo está em [RELEASING.md](RELEASING.md) e em
[docs/release.md](docs/release.md).

## Licença

Ao enviar uma contribuição, você concorda que ela entra sob a mesma licença
do projeto, a [GNU AGPL 3.0](LICENSE).
