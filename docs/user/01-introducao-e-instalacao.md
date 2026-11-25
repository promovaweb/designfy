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

- **Bun 1.4.4 ou superior** para rodar o código e compilar o binário. A versão
  mínima está em `package.json` e o `designfy doctor` a confere.
- **Node.js** para dois trabalhos: o `npx skills`, que instala as skills, e a
  captura, porque o Playwright roda num processo Node do projeto.
- **Acesso ao repositório privado** `promovaweb/designfy`. O registro de
  componentes é embutido no binário e o projeto ainda não é público.
- **Acesso ao GitHub** para o `npx skills add` buscar as skills internas em
  `promovaweb/designfy`.

## Instalar a partir do repositório privado

Clone o repositório e instale as dependências com Bun:

```bash
git clone git@github.com:promovaweb/designfy.git
cd designfy
bun install
```

Durante o desenvolvimento, o comando completo é `bun run src/main.ts`, com os
argumentos depois de `--`:

```bash
bun run dev -- --help
bun run dev -- status
```

Para ter um executável, compile com o Bun:

```bash
bun run build
./dist/designfy --version
```

O build gera `dist/designfy` para a plataforma da máquina. Copie o arquivo para
uma pasta do `PATH` quando quiser chamar `designfy` de qualquer projeto. Para
gerar os cinco alvos de release, use `bun run build:all`.

Não há pacote npm publicado deste binário. A instalação é a do repositório
privado, com o clone ou com o executável compilado.

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
designfy 0.1.0
```

O `about` mostra o executável, o runtime, a plataforma, a pasta de dados, a
licença e os créditos:

```text
Designfy v0.1.0
Visual framework for web projects: design system, React and Astro components with Tailwind, shadcn and motion, skills, dependency and MCP setup, and Playwright screen captures.

Binary

  Executable  /home/luizeof/.bun/bin/bun
  Runtime     Bun 1.4.4
  Platform    linux-x64
  PID         3904428
  Data        /home/luizeof/.designfy
  License     AGPL-3.0-only
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
✓ npx: /home/luizeof/.npm-global/bin/npx
✓ designfy.json: Project file exists
! VIEWSPEC.md: Not created
✓ tailwind-theme: /tmp/opencode/designfy-demo/src/styles/global.css
✓ binary: designfy 0.1.0
✓ platform: linux-x64
```

O `✓` é uma verificação aprovada, o `!` é um aviso e o `✗` reprova o comando
com exit code 3. Os avisos de `~/.designfy/` somem quando você grava a primeira
preferência. Os avisos de `designfy.json` e `VIEWSPEC.md` somem quando o
projeto é preparado, como mostra o próximo capítulo.

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
