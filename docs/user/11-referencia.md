# Capítulo 11: Referência

O agente errou o caminho e o comando responde com exit code 6. O script de CI
reprovou o build com exit code 10. A TUI fechou com exit code 8 porque rodou sem
terminal. Cada família de falha tem um número fixo, e este capítulo reúne os
números, as preferências, os arquivos e as mensagens que aparecem no dia a dia.
Use como consulta depois de ler os capítulos anteriores.

## Preferências

As preferências ficam em `~/.designfy/settings.json`, com permissão 0600.

| Key | Tipo | Padrão | Função |
| --- | --- | --- | --- |
| `output.format` | `text` ou `json` | `text` | formato padrão da saída do CLI |
| `output.colors` | boolean | `true` | cores ANSI na saída de texto |
| `tui.icons` | `auto`, `nerd`, `unicode`, `ascii` | `auto` | conjunto de ícones da TUI |
| `tui.initialTab` | nome de aba | `overview` | aba aberta ao iniciar |
| `tui.motion` | boolean | `true` | animações curtas de diálogos e toasts |
| `tui.mouse` | boolean | `true` | clique, hover e roda na TUI |
| `tui.theme` | `terminal`, `night`, `day` | `terminal` | paleta da TUI |
| `skills.source` | string | `promovaweb/designfy` | repositório das skills internas |
| `skills.agents` | string | `universal,claude-code,codex,opencode` | agentes de destino separados por vírgula |
| `deps.packageManager` | `auto`, `npm`, `pnpm`, `bun`, `yarn` | `auto` | gerenciador da instalação |
| `capture.viewports` | string | `mobile,desktop` | viewports separados por vírgula |
| `capture.outDir` | string | `.designfy/captures` | pasta das capturas |
| `telemetry.enabled` | boolean | `false` | reservado para projetos derivados |

```bash
designfy config list
designfy config get tui.theme
designfy config set output.format json
designfy config unset telemetry.enabled
designfy config path
designfy config schema
```

`config path` imprime a pasta e os arquivos; `config schema`, o tipo, o padrão e
a descrição de cada key. Uma key fora do schema é aceita como texto.

## O designfy.json

| Campo | Valor |
| --- | --- |
| `schemaVersion` | `1` |
| `framework` | `astro`, `next`, `react-vite`, `react` ou `unknown` |
| `typescript` | booleano |
| `packageManager` | `bun`, `pnpm`, `yarn` ou `npm` |
| `tailwind` | versão maior ou `null` |
| `shadcn` | booleano |
| `paths.components` | pasta dos componentes copiados |
| `paths.styles` | pasta dos estilos copiados e do CSS do tema |
| `paths.viewspec` | pasta dos viewspecs |
| `aliases.components` | alias que substitui `@designfy/components` |

Quando o arquivo existe, os campos definidos nele prevalecem sobre a detecção.

## Arquivos e pastas

| Caminho | Conteúdo |
| --- | --- |
| `designfy.json` | projeto detectado e caminhos |
| `VIEWSPEC.md` | guia de interface do projeto |
| `viewspec/<id>-<slug>/VIEWSPEC.md` | especificação e checklist de uma tela |
| `.designfy/captures/<run>/` | capturas e `manifest.json` |
| `~/.designfy/settings.json` | preferências |
| `~/.designfy/credentials.json` | cofre cifrado com AES-256-GCM |
| `~/.designfy/master.key` | master key em hexadecimal |
| `skills-lock.json` | versões das skills instaladas |
| `.claude/skills/`, `.agents/skills/` | skills instaladas para os agentes |
| `src/components/designfy/` | componentes copiados, por padrão |
| `src/styles/` | estilos copiados, por padrão |

A pasta `~/.designfy/` nasce com 0700. Os arquivos nascem com 0600. A master key
vem de `DESIGNFY_MASTER_KEY` quando a variável existe e, sem ela, de
`master.key`.

## Exit codes

| Código | Nome | Quando aparece |
| --- | --- | --- |
| 0 | `SUCCESS` | operação concluída |
| 1 | `GENERIC_ERROR` | falha inesperada sem classificação |
| 2 | `USAGE` | argument, option ou subcommand inválido; binário sem argumentos fora de um TTY |
| 3 | `CONFIG` | settings.json ausente, inválido ou key desconhecida |
| 4 | `CREDENTIALS` | cofre ilegível, master key ausente ou credencial não encontrada |
| 5 | `NETWORK_OR_API` | rede, API fora do esperado ou processo externo que falhou |
| 6 | `NOT_FOUND` | recurso, componente, arquivo ou guia inexistente |
| 7 | `PERMISSION` | permissão negada no sistema de arquivos |
| 8 | `NO_TTY` | a TUI exige terminal interativo |
| 9 | `MCP` | servidor MCP não iniciou ou perdeu o transporte |
| 10 | `CHECK_FAILED` | conferência reprovada: dependência, contraste ou viewspec |
| 130 | `INTERRUPTED` | entrada cancelada ou processo interrompido |

Com `--json`, o mesmo número aparece em `error.code`. Algumas conferências
entregam dados com exit code diferente de zero: confira `data.ok` no `doctor`,
`data.valid` no `viewspec validate` e `data.errors` nas consultas de viewspecs.

Um tratamento em código confere `data.ok`, `data.valid` e `data.errors` antes de
seguir.

## Variáveis de ambiente

| Variável | Efeito |
| --- | --- |
| `DESIGNFY_HOME` | troca `~/.designfy/` por outra pasta |
| `DESIGNFY_MASTER_KEY` | master key em 64 caracteres hexadecimais; dispensa `master.key` |
| `DESIGNFY_CATALOG_DIR` | pasta com os JSONs de catálogo no lugar dos embutidos |
| `DESIGNFY_REGISTRY_FILE` | JSON com os registros embutidos de React e Astro |
| `DESIGNFY_E2E` | `1` habilita o teste de captura com Playwright |
| `NO_COLOR` | desliga as cores da saída de texto |

## Solução de problemas

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| `designfy.json already exists` com exit 2 | o arquivo já está na raiz | use `--force` só para substituir, ou edite o arquivo |
| `No package.json found in the current directory` com exit 6 | comando rodou fora da raiz | entre na raiz do site ou da aplicação |
| `No Tailwind stylesheet found` com exit 6 | o projeto não tem CSS com `@import "tailwindcss"` | rode `designfy components add designfy-theme` e ligue no CSS de entrada |
| `Theme check failed` com exit 10 | par abaixo de 4.5 ou papel obrigatório ausente | meça com `designfy palette contrast` e corrija o papel no arquivo de tokens |
| `missing animate-df-marquee` com exit 10 | o CSS de movimento ficou fora do arquivo lido | importe `designfy-motion.css` e use `--file` no CSS de entrada |
| `Missing: ...` com exit 10 | pacotes ausentes no `package.json` | rode `designfy deps install` |
| `Unknown component` com exit 6 | nome errado ou framework errado | confira `designfy components list --framework <framework>` |
| `Playwright is unavailable` com exit 10 | pacote ou navegador ausente | `designfy deps install testing` e `npx playwright install chromium` |
| `One or more screenshots failed` com exit 5 | URL fora do ar ou seletor sem resultado | suba o servidor, confira a URL e o `--selector` |
| `Project guide VIEWSPEC.md is missing` com exit 6 | o projeto ainda não tem guia | rode a skill `designfy-viewspec` no modo guia |
| `Viewspec validation passed.` com `guide: missing` | o aviso não reprova | crie o guia na próxima etapa |
| A TUI encerra com exit 8 | o comando rodou sem terminal interativo | use o CLI em script e a TUI só no terminal |
| `npx skills add` falha com exit 5 | sem rede, sem acesso ao repositório privado ou agente inválido | confira o login do GitHub e o nome do agente |
| `Shadcn items` na resposta do `components add` | o item exige primitivas do shadcn | rode o comando `npx shadcn@latest add` que a resposta indica |

Quando o sintoma não está na tabela, `designfy doctor` confere o ambiente sem
alterar arquivo: runtime, terminal, pasta de dados, settings, master key, Node,
npx, `designfy.json`, CSS do Tailwind e guia. Um `✗` reprova com exit code 3; os
avisos `!` não reprovam.

## Onde encontrar o projeto

O código, os binários e as notas de versão ficam em
[promovaweb/designfy](https://github.com/promovaweb/designfy), um repositório
privado. As skills internas vêm da mesma origem, e o guia do método que sustenta
o binário fica no [Termfy](https://github.com/promovaweb/termfy).

## Conferir

- `designfy config list` mostra as keys com o valor em vigor.
- `designfy config path` aponta a pasta e os arquivos de dados.
- A tabela de exit codes deste capítulo bate com `designfy --help`.
- `designfy doctor` termina com exit code 0 e sem `✗`.
- O sintoma encontrado aparece na tabela com a ação correspondente.
