# Capítulo 1: Introdução e instalação

Você abre o projeto Astro que acabou de clonar e roda `designfy status`. A
resposta cabe numa tela: framework `astro`, Tailwind 4, `npm` como gerenciador,
nenhuma skill de projeto instalada, `0001` como próximo viewspec e o caminho do
CSS do tema. A partir dali, cada pedido de tela ganha um arquivo de
especificação, um registro de componentes e uma captura para conferir o
resultado.

## O que o Designfy faz

Um site feito por agente costuma sair com a mesma cara: uma paleta improvisada,
tipografia padrão, um componente novo a cada página, nada se move e o celular
fica para depois. O Designfy reúne o método e as peças para a interface sair
desenhada. Ele não desenha sozinho. Ele prepara o projeto, entrega o catálogo de
fragmentos, gera a paleta, copia componentes que leem o tema e captura as telas
para a revisão.

O trabalho acontece em quatro frentes:

| Frente | O que entrega |
| --- | --- |
| Projeto | `designfy.json` com framework, gerenciador de pacotes, Tailwind, shadcn e caminhos |
| Especificação | o guia `VIEWSPEC.md` da raiz e um viewspec por tela, com checklist e estado |
| Peças | registro de componentes React e Astro, catálogo de interface, paleta e fundos |
| Conferência | `theme check`, `deps check`, `viewspec validate` e capturas com Playwright |

A skill orquestradora `designfy` recebe o pedido, lê o projeto, monta o viewspec
e chama as especialistas na ordem. O binário é a mão dela no terminal: detecta
o projeto, copia arquivos, mede contraste e abre o navegador. A mesma base
atende a pessoa no terminal, os scripts de CI e o agente por MCP.

## Três modos no mesmo executável

O `designfy` tem três formas de uso, com a mesma configuração em
`~/.designfy/`:

| Modo | Como entrar | Para quem |
| --- | --- | --- |
| TUI | `designfy` sem argumentos, num terminal interativo | pessoas |
| CLI | `designfy <command> [options]`, com texto ou `--json` | pessoas, scripts e CI |
| MCP | `designfy mcp`, servidor Model Context Protocol via stdio | agentes de IA |

O CLI devolve dados em stdout, avisos em stderr e um exit code fixo por família
de falha. Com `--json`, a resposta vem no envelope `{ ok, command, data }`, que
um script lê sem interpretar texto.

## Requisitos

- **Node.js 18.17 ou superior** para três trabalhos: o pacote do npm, que baixa
  o binário, o `npx skills`, que instala as skills, e a captura, porque o
  Playwright roda num processo Node do projeto.
- **Bun 1.4.4 ou superior** só para rodar o código-fonte ou compilar o binário.
  A versão mínima está em `package.json` e o `designfy doctor` a confere. O
  executável da release já leva o runtime.
- **Acesso ao GitHub** para o `npx skills add` buscar as skills em
  `promovaweb/designfy`, quando você instalar a skill à mão.

## Instalar com o npm

```bash
npm i -g @promovaweb/designfy
designfy --version
```

O pacote do npm é um invólucro fino. Ele baixa o binário da release da mesma
versão para `~/.designfy/bin/v<versão>/`, confere o SHA-256 e o mantém em
cache; as execuções seguintes usam o arquivo guardado. O `postinstall` adianta
o download e a primeira execução o repete se o cache estiver vazio.

## Instalar pelo binário da release

Baixe o executável da sua plataforma em
[Releases](https://github.com/promovaweb/designfy/releases): `designfy-linux-x64`,
`designfy-linux-arm64`, `designfy-darwin-x64`, `designfy-darwin-arm64` ou
`designfy-windows-x64.exe`. Confira o arquivo com o `SHA256SUMS` da mesma
release, dê permissão de execução e coloque numa pasta do `PATH`.

## Instalar a skill no agente

```bash
npx skills add promovaweb/designfy
```

O comando instala as skills que o agente lê. Dentro de um projeto, o caminho
completo é o `designfy skills install`, do capítulo 3, que escolhe as skills
compatíveis com o framework detectado.

## Do código-fonte

Para desenvolver o Designfy ou gerar o binário da sua plataforma:

```bash
git clone https://github.com/promovaweb/designfy.git
cd designfy
bun install
bun run build
./dist/designfy --version
```

O build gera `dist/designfy` para a plataforma da máquina. Para os cinco alvos
de release, use `bun run build:all`. O ambiente de desenvolvimento, os testes e
a validação estão no [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Conferir a instalação

Três comandos confirmam que o binário responde e que a pasta de dados pode ser
criada:

```bash
designfy --version
designfy about
designfy doctor
```

O `--version` imprime a versão:

```text
designfy 0.2.0
```

O `about` mostra o executável, o runtime, a plataforma, a pasta de dados, a
licença e os créditos:

```text
Designfy v0.2.0
Visual framework for web projects: design system, React and Astro components with Tailwind, shadcn and motion, skills, dependency and MCP setup, and Playwright screen captures.

Binary

  Executable  ~/.bun/bin/bun
  Runtime     Bun 1.4.4
  Platform    linux-x64
  PID         3904428
  Data        ~/.designfy
  License     AGPL-3.0-only

Project

  Author      Promovaweb
  Site        https://promovaweb.com
  Repository  https://github.com/promovaweb/designfy

Credits

  Bun                 runtime, bundler and binary compiler https://bun.sh
  OpenTUI             terminal user interface rendering https://opentui.com
  MCP TypeScript SDK  Model Context Protocol server over stdio https://modelcontextprotocol.io
  OpenCLI             standard description of the command-line interface https://opencli.org
  Zod                 schema validation for MCP tools https://zod.dev
```

O `doctor` confere o ambiente sem gravar arquivo. Numa máquina nova, a pasta
`~/.designfy/` ainda não existe e o resultado mostra `!` nas verificações que
dependem dela:

```text
✓ bun: 1.4.4; minimum 1.4.4
! stdin: Not a TTY
! stdout: Not a TTY
! directory: Not created
! settings: Not created
! master-key: none
! credentials: Not created
✓ node: /usr/bin/node
✓ npx: ~/.npm-global/bin/npx
✓ designfy.json: Project file exists
! VIEWSPEC.md: Not created
✓ tailwind-theme: /tmp/opencode/designfy-demo/src/styles/app.css
✓ binary: designfy 0.2.0
✓ platform: linux-x64
```

O `✓` é uma verificação aprovada, o `!` é um aviso e o `✗` reprova o comando
com exit code 3. Os avisos de `~/.designfy/` somem quando você grava a primeira
preferência. `VIEWSPEC.md` passa a `✓` quando o guia é criado; num projeto sem
`designfy.json` ou sem CSS do Tailwind, essas duas linhas também aparecem com
`!` até o capítulo 2.

## Ajuda embutida

Todo comando aceita `--help`, com arguments, options, exemplos e os exit codes
que ele pode devolver:

```bash
designfy capture run --help
designfy components add --help
```

O binário também carrega a documentação escrita para agentes. O
`designfy --skill` imprime tudo em Markdown; `designfy --skill cli` imprime só
a seção do CLI, com a referência gerada do registry. Os tópicos são `cli`,
`tui`, `mcp`, `config`, `exit-codes` e `reference`. A documentação viaja dentro
do executável, então o agente lê a versão exata instalada na máquina.

A pasta `docs/` do repositório é a fonte dessa documentação. Este guia é outro
texto: ele explica o uso para quem nunca viu o produto, com cenas de resultado,
enquanto `docs/` é a referência técnica do binário.

## Conferir

- `designfy --version` responde com a versão do binário.
- `designfy about` mostra runtime, plataforma, pasta de dados e licença.
- `designfy doctor` termina com exit code 0 e sem `✗`.
- `designfy --help` lista os commands e as options globais.
- `designfy --skill cli` imprime a documentação embutida do CLI.
