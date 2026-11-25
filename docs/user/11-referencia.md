# Capítulo 11: Referência

Quando o Designfy encontra a folha de estilos e reprova o contraste de um botão, o processo termina com código 10. Um caminho de arquivo inexistente produz outro resultado, o código 6. Essa diferença orienta a correção no terminal e permite que um script de CI identifique qual verificação interrompeu o build.

## Códigos de saída do CLI

O número retornado pelo processo identifica a família da falha. Consulte a mensagem para localizar o arquivo ou o valor envolvido. A tabela também está disponível em `designfy --help`.

| Código | Nome | Quando aparece |
| --- | --- | --- |
| 0 | `SUCCESS` | operação concluída |
| 1 | `GENERIC_ERROR` | falha inesperada sem classificação |
| 2 | `USAGE` | argument, option ou subcommand inválido. binário sem argumentos fora de um TTY |
| 3 | `CONFIG` | settings.json ausente, inválido ou key desconhecida |
| 4 | `CREDENTIALS` | cofre ilegível, master key ausente ou credencial não encontrada |
| 5 | `NETWORK_OR_API` | rede, API fora do esperado ou processo externo que falhou |
| 6 | `NOT_FOUND` | recurso, componente, arquivo ou guia inexistente |
| 7 | `PERMISSION` | permissão negada no sistema de arquivos |
| 8 | `NO_TTY` | a TUI exige terminal interativo |
| 9 | `MCP` | servidor MCP não iniciou ou perdeu o transporte |
| 10 | `CHECK_FAILED` | conferência reprovada: dependência, contraste ou viewspec |
| 130 | `INTERRUPTED` | entrada cancelada ou processo interrompido |

Nas respostas de erro com `--json`, o código aparece em `error.code`. Algumas verificações entregam um relatório mesmo quando o processo termina com código diferente de zero. Leia `data.ok` no resultado de `doctor` ou `data.valid` no de `viewspec validate`. Nas consultas de viewspecs, `data.errors` identifica problemas nos arquivos lidos.

## Mensagens de erro e correções

Um código 10 pode indicar tanto um pacote ausente quanto um problema no CSS. Procure a mensagem do comando na primeira coluna. No caso de contraste, confira também o modo do tema antes de editar um token.

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| `designfy.json already exists` com exit 2 | o arquivo já está na raiz | use `--force` só para substituir, ou edite o arquivo |
| `No package.json found in the current directory` com exit 6 | comando rodou fora da raiz | entre na raiz do site ou da aplicação |
| `No Tailwind stylesheet found` com exit 6 | a busca não localizou o CSS do tema | indique o CSS existente com `--file` ou, no Tailwind 4, rode `designfy components add designfy-theme` e importe o tema no CSS de entrada |
| `Theme check failed` com exit 10 | par abaixo de 4.5 ou papel obrigatório ausente | meça com `designfy palette contrast` e corrija o papel no arquivo de tokens |
| `Theme check failed` no modo `custom` | par do `theme.pairs` abaixo do `min` | ajuste os valores no `designfy.json` ou o `min` do par |
| `components add` recusa com exit 10 num projeto Tailwind 3 | o registro usa a sintaxe do Tailwind 4 | use o item como referência, migre o projeto ou copie com `--allow-tailwind3` |
| `trackedBy` aponta arquivo ausente | a spec ou a sitespec mudou de pasta de estado | atualize o `path` no front matter do viewspec |
| `missing animate-df-marquee` com exit 10 | o CSS de movimento ficou fora do arquivo lido | importe `designfy-motion.css` e use `--file` no CSS de entrada |
| `Missing: ...` com exit 10 | pacotes ausentes no `package.json` | rode `designfy deps install` |
| `Unknown component` com exit 6 | nome errado ou framework errado | confira `designfy components list --framework <framework>` |
| `Playwright is unavailable` com exit 10 | pacote ou navegador ausente | `designfy deps install testing` e `npx playwright install chromium` |
| `One or more screenshots failed` com exit 5 | URL fora do ar ou seletor sem resultado | suba o servidor, confira a URL e o `--selector` |
| `Project guide VIEWSPEC.md is missing` com exit 6 | o projeto ainda não tem guia | rode a skill `designfy-viewspec` no modo guia |
| `Viewspec validation passed.` com `guide: missing` | o aviso não reprova | crie o guia na próxima etapa |
| A TUI encerra com exit 8 | o comando rodou sem terminal interativo | use o CLI em script e a TUI só no terminal |
| `npx skills add` falha com exit 5 | sem rede ou agente inválido | confira a conexão, o nome do repositório e o nome do agente |
| `Shadcn items` na resposta do `components add` | o item exige primitivas do shadcn | rode o comando `npx shadcn@latest add` que a resposta indica |

No site da Promovaweb, o primeiro ajuste foi no arquivo lido. O tema da documentação aparecia no lugar do CSS público. Depois que `tokensFile` apontou para `src/styles/brand/global.css`, foi possível medir os pares do site. No tema claro, os títulos chegaram a 19,22:1. O botão secundário ficou em 1,76:1. O valor dos títulos ajuda a confirmar a leitura daquele par, mas o botão tem cores próprias para corrigir.

Para investigar uma falha de ambiente, rode `designfy doctor` na raiz do projeto. O diagnóstico verifica o runtime e o terminal, além da instalação do Node e do npx. Também examina as preferências locais e a origem da chave do cofre. No projeto, verifica `designfy.json`, a folha do Tailwind e o guia de interface. Um item marcado com `✗` encerra o processo com código 3. Avisos marcados com `!` permitem que a verificação termine com sucesso.

## Preferências em `settings.json`

Para mudar a tela inicial da TUI ou o formato padrão da saída do CLI, consulte as preferências do usuário. Elas ficam em `~/.designfy/settings.json`, com permissão `0600`. A coluna de padrão mostra o valor usado enquanto você ainda não gravou uma preferência própria.

| Key | Tipo | Padrão | Função |
| --- | --- | --- | --- |
| `output.format` | `text` ou `json` | `text` | formato padrão da saída do CLI |
| `output.colors` | boolean | `true` | cores ANSI na saída de texto |
| `tui.icons` | `auto`, `nerd`, `unicode`, `ascii` | `auto` | conjunto de ícones da TUI |
| `tui.initialTab` | ID de módulo | `overview` | tela aberta ao iniciar. `overview` abre a Home |
| `tui.motion` | boolean | `true` | animações curtas de diálogos e toasts |
| `tui.mouse` | boolean | `true` | clique, hover e roda na TUI |
| `tui.theme` | `terminal`, `night`, `day` | `terminal` | paleta da TUI |
| `skills.source` | string | `promovaweb/designfy` | repositório das skills internas |
| `skills.agents` | string | `universal,claude-code,codex,opencode` | agentes de destino separados por vírgula |
| `deps.packageManager` | `auto`, `npm`, `pnpm`, `bun`, `yarn` | `auto` | gerenciador da instalação |
| `capture.viewports` | string | `mobile,desktop` | viewports separados por vírgula |
| `capture.outDir` | string | `.designfy/captures` | pasta das capturas |
| `telemetry.enabled` | boolean | `false` | reservado para projetos derivados |

Use `config get` para consultar uma chave e `config set` para gravar outro valor. Os comandos abaixo são exemplos independentes. A alteração de `output.format` afeta a saída das próximas consultas. Para remover um valor salvo e recuperar o padrão, use `config unset` com a chave correspondente.

```bash
designfy config list
designfy config get tui.theme
designfy config set output.format json
designfy config unset telemetry.enabled
designfy config path
designfy config schema
```

Antes da primeira alteração, `designfy config list` já mostra as preferências efetivas. O aviso na primeira linha explica por que os valores aparecem mesmo sem um arquivo gravado.

```text
File: ~/.designfy/settings.json (not created yet; defaults)

  capture.outDir       ".designfy/captures"
  capture.viewports    "mobile,desktop"
  deps.packageManager  "auto"
  output.colors        true
  output.format        "text"
  skills.agents        "universal,claude-code,codex,opencode"
  skills.source        "promovaweb/designfy"
  telemetry.enabled    false
  tui.icons            "auto"
  tui.initialTab       "overview"
  tui.motion           true
  tui.mouse            true
  tui.theme            "terminal"
```

Use `config path` para identificar a pasta e os arquivos usados naquela instalação. Para conferir o tipo, o valor padrão e a descrição de uma chave, consulte `config schema`. Uma chave fora do schema é aceita como texto.

## Configuração do projeto em `designfy.json`

A opção global `--project` ou `-C` escolhe a raiz para uma execução. Na ausência da opção, `DESIGNFY_PROJECT` pode definir a pasta padrão. Dentro dessa raiz, os campos gravados em `designfy.json` prevalecem sobre os valores detectados no projeto.

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
| `paths.theme` | caminho opcional do CSS do tema, relativo à raiz ou absoluto. também aceito por `init --theme-path` |
| `paths.viewspec` | pasta dos viewspecs |
| `aliases.components` | alias que substitui `@designfy/components` |
| `theme.pairs` | pares de contraste do modo `custom`, com `fg` e `bg` obrigatórios. `label` e `min` são opcionais |

Use `paths.components` para indicar a pasta de destino dos componentes copiados. Para fixar a folha de estilos que o Designfy deve ler, o campo é `paths.theme`. Já `theme.pairs` descreve quais combinações de primeiro plano e fundo entram na conferência de contraste do modo `custom`.

## Arquivos do projeto e do usuário

Na revisão do Plano Founders, o guia comum ao site ficou na raiz. A checklist da tela ficou em `viewspec/0001-founders/VIEWSPEC.md`. Para confrontar um item da checklist com o resultado visual, localize a execução de captura pelo nome e abra seu manifesto.

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

Os caminhos iniciados por `~/` pertencem ao usuário. A pasta `~/.designfy/` tem permissão `0700` e seus arquivos usam `0600`. Na leitura do cofre, a variável `DESIGNFY_MASTER_KEY` fornece a chave quando está definida. Na ausência dela, a chave vem do arquivo `master.key`.

## Variáveis de ambiente do processo

Para usar outro diretório de preferências numa execução, defina `DESIGNFY_HOME` no ambiente do processo. Para trocar apenas a raiz do projeto, use `DESIGNFY_PROJECT`. A opção explícita `--project` continua tendo prioridade sobre a variável.

| Variável | Efeito |
| --- | --- |
| `DESIGNFY_HOME` | troca `~/.designfy/` por outra pasta |
| `DESIGNFY_PROJECT` | pasta do projeto por padrão no CLI e no servidor MCP. a option `--project` tem precedência |
| `DESIGNFY_MASTER_KEY` | master key em 64 caracteres hexadecimais. dispensa `master.key` |
| `DESIGNFY_CATALOG_DIR` | pasta com os JSONs de catálogo no lugar dos embutidos |
| `DESIGNFY_REGISTRY_FILE` | JSON com os registros embutidos de React e Astro |
| `DESIGNFY_E2E` | `1` habilita o teste de captura com Playwright |
| `NO_COLOR` | desliga as cores da saída de texto |

Um teste de captura que usa `DESIGNFY_E2E=1` precisa do Playwright e do navegador instalado. Quando a execução informa `Playwright is unavailable`, confira a instalação indicada na tabela de mensagens. A variável habilita o teste, mas a instalação do navegador é uma etapa própria.

## Código-fonte, distribuição e documentação

O pacote do npm é `@promovaweb/designfy`. O código, as skills, os binários e as notas de versão ficam no repositório público do projeto, sob licença AGPL 3.0. O método de construção do binário está documentado no Termfy. [Repositório do Designfy](https://github.com/promovaweb/designfy) · [Guia do Termfy](https://github.com/promovaweb/termfy)

Para consultar a edição online deste guia ou a referência técnica, use a área de documentação. O portal do Designfy apresenta o projeto e suas ferramentas. [Documentação do Designfy](https://promovaweb.com/docs/designfy/) · [Portal do Designfy](https://promovaweb.com/designfy/)
