# Capítulo 10: Agentes e MCP

No site da Promovaweb, o Designfy encontrou primeiro `docs-theme.css`, a folha da documentação. O guia do site indicou `src/styles/brand/global.css` em `tokensFile` para que a revisão usasse as cores das páginas públicas. Ao conectar o agente, consulte `project_status` e confira o caminho do CSS antes de interpretar as medidas de contraste.

## Ligar o cliente ao projeto

O cliente inicia `designfy mcp` e conversa com o processo pelo Model Context Protocol (MCP) via stdio. As mensagens JSON-RPC saem pela saída padrão. Os diagnósticos seguem pela saída de erro para preservar o canal usado pelo cliente.

```bash
designfy mcp
```

Ao executar o comando diretamente, o processo aguarda mensagens do cliente. Para o cliente iniciar o processo sozinho, registre o executável e o argumento no arquivo de configuração. Nos clientes que usam `mcpServers`, a entrada tem este formato.

```json
{
  "mcpServers": {
    "designfy": { "command": "designfy", "args": ["mcp"] }
  }
}
```

O nome `designfy` identifica a conexão no cliente. No Claude Code, você também pode registrar o servidor pela linha de comando.

```bash
claude mcp add designfy -- designfy mcp
```

O trecho depois de `--` indica o executável que o Claude Code vai iniciar. Durante o desenvolvimento do Designfy, você pode executar o código-fonte com Bun. A entrada abaixo pressupõe que o processo inicia na raiz do repositório do Designfy, onde existe `src/main.ts`.

```json
{
  "mcpServers": {
    "designfy": { "command": "bun", "args": ["run", "src/main.ts", "mcp"] }
  }
}
```

Com o binário instalado, a pasta de trabalho do servidor costuma ser a raiz do site ou da aplicação. Quando você abre o cliente na raiz do Hub, indique o subdiretório do site para que as tools leiam o projeto correto.

```bash
designfy mcp --project ./website
```

A opção global `--project` tem o atalho `-C` e prevalece sobre `DESIGNFY_PROJECT`. Uma tool com o argumento `project` pode escolher outra raiz só para aquela chamada. O argumento aceita caminho absoluto ou relativo à pasta do servidor. Os demais caminhos da chamada partem da raiz escolhida.

## Escolher a tool pela operação

Use `catalog_list` com `kind: "dashboard"` para localizar padrões de painel. Depois de escolher um componente do registro, envie seu nome numa lista no argumento `names` de `components_add` e inclua `dryRun: true`. A resposta mostra quais arquivos a cópia criaria e quais dependências faltam no projeto.

| Tool | Entrada | Saída |
| --- | --- | --- |
| `doctor` | `project?` | `{ checks, ok }`. `isError: true` se houver `fail` |
| `about` | nenhuma | identity, runtime, platform, data directory e credits |
| `exit_codes` | nenhuma | tabela de exit codes |
| `skill` | `topic?` (`cli`, `tui`, `mcp`, `config`, `exit-codes`, `reference`) | documentação em Markdown |
| `config_list` | nenhuma | keys de settings.json em vigor e o schema |
| `config_get` | `key` | valor da key. `isError` quando não existe |
| `credentials_status` | nenhuma | file, master key source, count e names |
| `project_status` | `project?` | detecção, configuração efetiva, totais de instalações e viewspecs, guia e CSS do tema |
| `skills_list` | `project?`, `internal?`, `external?` | skills com estado de instalação |
| `deps_list` | `project?`, `group?` | grupos, faixas de versões e estado no projeto |
| `deps_check` | `project?`, `group?` | pacotes ausentes ou desatualizados, com `isError` quando a conferência reprova |
| `catalog_list` | `surface?`, `category?`, `kind?` | fragmentos de interface filtrados |
| `catalog_show` | `id` | propósito, anatomia, variações, estados, tokens e fontes |
| `catalog_search` | `text` | fragmentos que correspondem à busca |
| `components_list` | `project?`, `framework?`, `category?`, `surface?` | metadados dos itens e aviso de compatibilidade no Tailwind 3 |
| `components_show` | `project?`, `name`, `framework?`, `source?` | metadados, arquivos, aviso de compatibilidade no Tailwind 3 e conteúdo se solicitado |
| `theme_show` | `project?`, `file?`, `group?` | major, arquivos de origem, origem da seleção (`selection`), entrada que importa o CSS selecionado (`entryFile`, quando encontrada), avisos e tokens por grupo |
| `theme_check` | `project?`, `file?` | modo `shadcn` ou `custom`, contraste, notas e papéis ausentes quando aplicável, com `isError: true` quando a checagem reprova |
| `palette_generate` | `base`, `harmony?` | escalas OKLCH, tokens claros e escuros e contraste |
| `palette_wheel` | `color` | cores de cada harmonia em hex e OKLCH |
| `palette_contrast` | `foreground`, `background` | razão WCAG, APCA e vereditos por uso |
| `viewspec_guide` | `project?` | guia do projeto, orientações e propostas |
| `viewspec_list` | `project?`, `status?`, `kind?` | viewspecs com o progresso das checklists |
| `viewspec_show` | `project?`, `id` | front matter, seções e checklist da tela |
| `viewspec_progress` | `project?` | total por status, progresso das checklists e próximo ID livre |
| `viewspec_validate` | `project?`, `id?` | estado do guia e diagnósticos dos viewspecs por arquivo e linha |
| `capture_list` | `project?`, `outDir?` | manifestos de captura, do mais recente ao mais antigo |
| `mcp_servers` | `project?` | servidores sugeridos e estado nos arquivos de cada cliente |
| `components_add` | `project?`, `names`, `framework?`, `path?`, `overwrite?`, `dryRun?`, `allowTailwind3?` | grava componentes e retorna arquivos e dependências. `dryRun` simula a cópia |
| `capture_run` | `project?`, `urls`, `viewports?`, `theme?`, `fullPage?`, `scroll?`, `scrollBudgetMs?`, `showDevOverlays?`, `hide?`, `reducedMotion?`, `waitMs?`, `selector?`, `outDir?`, `name?` | visita URLs e grava imagens e manifesto |

Numa revisão de contraste, comece por `theme_show` para conferir a origem dos tokens. No site da Promovaweb, a conferência em modo `custom` mediu 9,19:1 no texto de corpo do tema claro, mas apenas 1,76:1 no botão secundário. O resultado de `theme_check` identifica o par que precisa de ajuste, mesmo quando o texto de corpo tem contraste suficiente.

## Limitar o servidor à leitura

A tool `components_add` copia os arquivos dos componentes. A outra tool com escrita, `capture_run`, grava as imagens e o manifesto. Para uma revisão do material existente, acrescente a opção de leitura aos argumentos de inicialização do servidor.

```bash
designfy mcp --read-only
```

Com `--read-only`, essas duas tools ficam fora do catálogo oferecido ao cliente. As consultas continuam disponíveis, inclusive `credentials_status`, que informa os nomes salvos e a origem da chave do cofre. Os valores das credenciais ficam fora das respostas.

Para verificar o catálogo antes de conectar o agente, compare as duas listagens. A terceira forma entrega o resultado em JSON para uso em scripts.

```bash
designfy mcp --list
designfy mcp --list --read-only
designfy mcp --list --json
```

Na saída em texto, procure `project_status` sob `Tools` para confirmar que o servidor oferece a consulta ao projeto. O trecho também mostra os endereços do manual que o cliente pode abrir.

```text
MCP server designfy v0.2.2

Tools:
  project_status  Use to inspect the current web project. Returns detection, effective project settings, installation counts, viewspec progress, guide counts and the Tailwind stylesheet.
  catalog_list  List candidate interface fragments for a site or webapp. Returns entries filtered by surface, category, and viewspec kind.
  ...
Resources:
  designfy://about  Binary identity and runtime as JSON.
  designfy://exit-codes  Exit-code table as JSON.
  designfy://skill  Full documentation in Markdown.
  designfy://skill/{topic}  One documentation section. Topics: cli, tui, mcp, config, exit-codes, reference.
Prompts:
  operate  Guides the agent to read the documentation and run a task through the CLI.
```

Em `Tools` ficam operações que o agente chama com argumentos. Em `Resources` ficam documentos que o cliente pode abrir pelo endereço. Para consultar apenas uma parte do manual, substitua `{topic}` pelo tópico, como em `designfy://skill/cli`.

| Resource | Conteúdo |
| --- | --- |
| `designfy://about` | identidade do binário em JSON |
| `designfy://exit-codes` | tabela de exit codes em JSON |
| `designfy://skill` | documentação completa em Markdown |
| `designfy://skill/{topic}` | uma seção da documentação |

O prompt `operate` recebe o argumento `task` e orienta o agente a ler `skill cli` antes de executar a tarefa no terminal com `--json`. Para interpretar o resultado de um comando, o cliente pode consultar a tabela publicada em `designfy://exit-codes`.

## Gravar a conexão no arquivo de cada cliente

O Designfy reconhece cinco clientes. Comece pela consulta dos servidores registrados no projeto para identificar quais clientes já têm a conexão.

```bash
designfy mcp servers
```

Cada linha cruza um servidor do catálogo com os clientes reconhecidos. No exemplo, nenhum dos cinco tem uma entrada para os servidores listados.

```text
  designfy (Designfy)      claude: absent, codex: absent, opencode: absent, cursor: absent, gemini: absent
  shadcn (shadcn/ui)       claude: absent, codex: absent, opencode: absent, cursor: absent, gemini: absent
  playwright (Playwright)  claude: absent, codex: absent, opencode: absent, cursor: absent, gemini: absent
```

O estado `absent` indica que falta a entrada daquele servidor no arquivo do cliente. Por padrão, `mcp setup` propõe instalar o Designfy e o shadcn. Para incluir o Playwright, selecione-o explicitamente. A tabela mostra qual arquivo cada cliente consulta no projeto.

| Cliente | Arquivo |
| --- | --- |
| `claude` | `.mcp.json` |
| `codex` | `.codex/config.toml` |
| `opencode` | `opencode.json` |
| `cursor` | `.cursor/mcp.json` |
| `gemini` | `.gemini/settings.json` |

Antes de gravar, examine os caminhos que o comando selecionou. Sem `--client`, ele usa os clientes com arquivo no projeto. Quando nenhum tem arquivo, o destino padrão é o Claude Code.

```bash
designfy mcp setup --dry-run
```

No exemplo, `planned add` aparece ao lado dos dois servidores. Confira o caminho no fim de cada linha para verificar se as duas entradas vão para o `.mcp.json` do projeto desejado.

```text
  claude / designfy  planned add · /tmp/opencode/designfy-demo/.mcp.json
  claude / shadcn    planned add · /tmp/opencode/designfy-demo/.mcp.json
```

Para instalar as mesmas entradas no Codex e no OpenCode, indique os dois clientes no comando de gravação.

```bash
designfy mcp setup designfy shadcn --client codex,opencode
```

O comando preserva as outras chaves dos arquivos. Para substituir uma entrada de mesmo nome com configuração diferente, é preciso usar `--force`. O servidor Designfy lê o projeto localmente. A configuração dispensa credenciais e as consultas ao catálogo usam o conteúdo embutido no binário.

## Verificar a conexão com o Inspector

Reinicie o cliente após gravar a configuração e chame `project_status`. Compare o framework e a folha de estilos com o projeto aberto. Para examinar as mensagens da conexão, inicie o Inspector com o mesmo executável e argumento usados pelo cliente.

```bash
npx @modelcontextprotocol/inspector designfy mcp
```

No Inspector, liste as tools e chame `project_status`. O framework e o caminho do CSS na resposta devem corresponder ao projeto aberto. Um cliente MCP mínimo permite repetir a consulta via stdio e ler os mesmos resources. Quando a resposta aponta para outro projeto, confira a pasta de trabalho do servidor e a opção `--project`.
