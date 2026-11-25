# Capítulo 1: Introdução e instalação

No site da Promovaweb, a primeira tela revisada com o Designfy foi a do Plano Founders. No celular, a linha com o prazo da oferta precisava aparecer sob os botões do hero. O agente registrou a mudança no viewspec da tela. Com o site aberto no navegador, uma captura permitiu conferir a posição do texto na largura de leitura.

## O que instalar para trabalhar numa tela

Você instala o executável para operar sobre os arquivos do projeto. Ele identifica o framework, localiza o tema e abre o navegador com Playwright quando chega a hora de fotografar a interface. O agente usa a skill `designfy` para conduzir esse trabalho. É nela que encontra as instruções para escrever a especificação e selecionar as especialistas de cada tela.

| Frente | O que entrega |
| --- | --- |
| Projeto | `designfy.json` com framework, gerenciador de pacotes, Tailwind, shadcn e caminhos |
| Especificação | o guia `VIEWSPEC.md` da raiz e um viewspec por tela, com checklist e estado |
| Peças | registro de componentes React e Astro, catálogo de interface, paleta e fundos |
| Conferência | `theme check`, `deps check`, `viewspec validate` e capturas com Playwright |

Na linha Conferência, cada comando examina uma parte diferente da entrega. O `theme check` mede contraste no tema. Para verificar a posição de um botão no celular, você precisa olhar a captura da rota indicada no viewspec.

## TUI, CLI e MCP

O executável lê a configuração de `~/.designfy/` nas três formas de acesso. Num terminal interativo, basta digitar `designfy` para abrir a TUI. Ao automatizar a mesma consulta, escolha a entrada conforme o programa que vai receber a resposta.

| Modo | Como entrar | Público |
| --- | --- | --- |
| TUI | `designfy` sem argumentos, num terminal interativo | uso interativo |
| CLI | `designfy <command> [options]`, com texto ou `--json` | uso interativo, scripts e CI |
| MCP | `designfy mcp`, servidor Model Context Protocol via stdio | agentes de IA |

No CLI, a resposta sai em stdout e os avisos em stderr. Com `--json`, uma execução bem-sucedida devolve `{ ok, command, data }`. Um script de CI pode consultar o código de saída para identificar a família da falha e ler a mensagem sem interpretar o painel do terminal.

## Instalação pelo pacote npm

O pacote usa Node.js 18.17 ou superior para baixar o executável. Essa versão do Node também atende à instalação de skills pelo `npx skills` e ao processo do Playwright que roda no projeto durante a captura. Para usar o binário da release, o runtime do Bun já vem incluído.

```bash
npm i -g @promovaweb/designfy
designfy --version
```

O `postinstall` baixa o binário da mesma versão do pacote e confere o SHA-256 antes de guardá-lo em `~/.designfy/bin/v<versão>/`. Com o cache vazio, a primeira chamada tenta o download. A versão impressa pelo segundo comando confirma qual executável respondeu.

## Binários da release por plataforma

Para instalar diretamente, escolha o arquivo da sua arquitetura na [release do Designfy](https://github.com/promovaweb/designfy/releases).

| Sistema | x64 | ARM64 |
| --- | --- | --- |
| Linux | `designfy-linux-x64` | `designfy-linux-arm64` |
| macOS | `designfy-darwin-x64` | `designfy-darwin-arm64` |
| Windows | `designfy-windows-x64.exe` | |

Confira o download com o `SHA256SUMS` da mesma release. Coloque o arquivo em uma pasta do `PATH` com o nome de chamada `designfy` (`designfy.exe` no Windows). No Linux e no macOS, dê permissão de execução antes de consultar a versão.

## Skills no ambiente do agente

O agente precisa de acesso ao GitHub para buscar as instruções no repositório da Promovaweb. Para instalar a biblioteca diretamente com o instalador de skills, use a origem do projeto.

```bash
npx skills add promovaweb/designfy
```

Dentro de uma aplicação, `designfy skills install` seleciona as skills compatíveis com o framework detectado. O capítulo 3 mostra como conferir essa seleção antes de instalar.

## Compilação a partir do repositório

Para alterar o código-fonte ou compilar sua própria cópia, use Bun 1.4.4 ou superior. O mínimo consta no `package.json` e entra na verificação do `designfy doctor`. Rode o build no clone e consulte a versão pelo caminho de saída.

```bash
git clone https://github.com/promovaweb/designfy.git
cd designfy
bun install
bun run build
./dist/designfy --version
```

O arquivo `dist/designfy` corresponde à plataforma da máquina que fez o build. Para gerar os cinco alvos de release, use `bun run build:all`. Os testes e o preparo do ambiente de desenvolvimento estão no [guia de contribuição](../../CONTRIBUTING.md).

## Leitura do diagnóstico de instalação

Em uma máquina com mais de uma instalação, confira primeiro a versão que o terminal encontra. Depois, use o relatório do executável para identificar de onde ele veio e o diagnóstico para verificar o ambiente.

```bash
designfy --version
designfy about
designfy doctor
```

No registro abaixo, a consulta curta identifica a versão usada para produzir os exemplos do guia.

```text
designfy 0.2.0
```

A mesma versão aparece no cabeçalho de `about`. Procure `Executable` para identificar o programa em execução e `Data` para localizar os arquivos locais. O relatório inclui a plataforma, a licença e os créditos das bibliotecas.

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

Nesse registro de desenvolvimento, o caminho termina em `bun` e a plataforma é `linux-x64`. Já o `doctor` examina o ambiente sem gravar arquivos. Num terminal redirecionado, as linhas de entrada e saída podem indicar `Not a TTY`, como neste diagnóstico.

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

O símbolo `✓` indica que a verificação passou. Um `!` junto de `directory` ou `settings` é esperado antes da primeira preferência gravada. O aviso de `VIEWSPEC.md` desaparece quando você cria o guia. Em uma aplicação ainda sem `designfy.json` ou CSS do Tailwind, o diagnóstico sinaliza também essas ausências. Uma falha marcada com `✗` leva ao código de saída 3. Uma execução aprovada termina com 0.

## Ajuda do comando instalado

Ao preparar uma captura no celular, você pode consultar a largura aceita pelo binário antes de abrir o navegador. A ajuda geral de `designfy --help` apresenta os comandos e as opções globais. Acrescente `--help` ao caminho da operação para consultar os argumentos, exemplos e códigos de saída específicos.

```bash
designfy capture run --help
designfy components add --help
```

A primeira consulta mostra as opções da captura, inclusive a largura do navegador. A segunda descreve a cópia de componentes. Para ler a referência técnica da versão instalada em Markdown, use `designfy --skill`. O conteúdo vem de `docs/` e acompanha o executável.

Com `designfy --skill cli`, você recebe somente a referência do CLI, gerada a partir do registro de comandos. As outras partes têm os nomes `tui`, `mcp`, `config`, `exit-codes` e `reference`. Um agente pode consultar o tópico de que precisa mesmo quando o repositório do Designfy não está na máquina.
