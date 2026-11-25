# Capítulo 10: Agentes e MCP

O agente abre a conversa e chama a tool `project_status`. Recebe o framework, o
tema, as skills instaladas e o próximo viewspec livre. Em seguida chama
`catalog_list` com `kind: "dashboard"`, escolhe os fragmentos e chama
`components_add` com `dryRun: true` para ver os arquivos antes de escrever. Nada
disso passa pelo terminal: o agente fala com o binário por MCP.

## O servidor

```bash
designfy mcp
```

O comando transforma o processo num servidor Model Context Protocol sobre
stdio. Stdout fica reservado para JSON-RPC; diagnósticos vão para stderr. O
cliente inicia o processo e conversa com ele.

A configuração no cliente:

```json
{
  "mcpServers": {
    "designfy": { "command": "designfy", "args": ["mcp"] }
  }
}
```

No Claude Code:

```bash
claude mcp add designfy -- designfy mcp
```

Para desenvolver sem compilar:

```json
{
  "mcpServers": {
    "designfy": { "command": "bun", "args": ["run", "src/main.ts", "mcp"] }
  }
}
```

As tools de projeto usam a pasta de trabalho do servidor. Abra o cliente na raiz
do site ou da aplicação.

## As tools

As tools leem o mesmo domínio que o CLI. A tabela abaixo segue os grupos do
`mcp --list`.

| Tool | Entrada | Devolve |
| --- | --- | --- |
| `project_status` | nenhuma | detecção, configuração, contagens, guia e CSS do tema |
| `skills_list` | `internal?`, `external?` | skills com estado de instalação |
| `deps_list`, `deps_check` | `group?` | grupos, faixas e estado; a conferência reprovada vem com `isError` |
| `catalog_list`, `catalog_show`, `catalog_search` | filtros, `id`, `text` | fragmentos de interface e a entrada inteira |
| `components_list`, `components_show` | filtros, `name`, `framework?`, `source?` | metadados, arquivos e conteúdo |
| `components_add` | `names`, `framework?`, `path?`, `overwrite?`, `dryRun?` | arquivos gravados e dependências |
| `theme_show`, `theme_check` | `file?`, `group?` | tokens por grupo; contraste em claro e escuro |
| `palette_generate`, `palette_wheel`, `palette_contrast` | `base`, uma cor, duas cores | escalas, harmonias e vereditos |
| `viewspec_guide`, `viewspec_list`, `viewspec_show` | filtros, `id` | guia, lista e o arquivo da tela |
| `viewspec_progress`, `viewspec_validate` | `id?` | contagem e próximo `id`; diagnósticos por arquivo e linha |
| `capture_run`, `capture_list` | `urls`, opções; `outDir?` | manifesto e imagens |
| `mcp_servers` | nenhuma | servidores sugeridos e estado por cliente |
| `doctor` | nenhuma | verificações de ambiente, sem gravar arquivo |
| `about`, `exit_codes`, `skill`, `config_list`, `config_get`, `credentials_status` | conforme a tool | identidade, tabela, documentação, settings e metadados do cofre |

As tools que escrevem no projeto são `components_add` e `capture_run`. Todas as
outras só leem. Nenhuma tool devolve valor de credencial; o cofre expõe apenas
metadados.

## Modo de leitura

Para um agente que só consulta, inicie o servidor sem as tools que gravam:

```bash
designfy mcp --read-only
```

O modo retira `components_add` e `capture_run` e mantém todas as outras. Use
numa revisão, numa auditoria ou num agente que não deve alterar arquivos.

Para ver a superfície sem iniciar o servidor:

```bash
designfy mcp --list
designfy mcp --list --read-only
designfy mcp --list --json
```

A listagem mostra cada tool com a descrição, os resources e os prompts:

```text
MCP server designfy v0.1.0

Tools:
  project_status  Use to inspect the current web project. Returns detection, effective project settings, installation counts, viewspec progress, guide counts and the Tailwind stylesheet.
  catalog_list  List candidate interface fragments for a site or system. Returns entries filtered by surface, category, and viewspec kind.
  ...
Resources:
  designfy://about  Binary identity and runtime as JSON.
  designfy://exit-codes  Exit-code table as JSON.
  designfy://skill  Full documentation in Markdown.
  designfy://skill/{topic}  One documentation section. Topics: cli, tui, mcp, config, exit-codes, reference.
Prompts:
  operate  Guides the agent to read the documentation and run a task through the CLI.
```

## Resources e prompts

| Resource | Conteúdo |
| --- | --- |
| `designfy://about` | identidade do binário em JSON |
| `designfy://exit-codes` | tabela de exit codes em JSON |
| `designfy://skill` | documentação completa em Markdown |
| `designfy://skill/{topic}` | uma seção da documentação |

O prompt `operate` recebe `task` e instrui o agente a ler `skill cli` e executar
a tarefa pelo CLI com `--json`. É o caminho para um agente que prefere o
terminal ao MCP.

## Configurar os clientes

O catálogo de servidores traz três entradas: o próprio Designfy, o shadcn e o
Playwright. O Designfy e o shadcn são recomendados; o Playwright entra com
pedido.

```bash
designfy mcp servers
```

```text
  designfy (Designfy)      claude: absent, codex: absent, opencode: absent, cursor: absent, gemini: absent
  shadcn (shadcn/ui)       claude: absent, codex: absent, opencode: absent, cursor: absent, gemini: absent
  playwright (Playwright)  claude: absent, codex: absent, opencode: absent, cursor: absent, gemini: absent
```

O `mcp setup` grava as entradas nos arquivos de projeto dos clientes:

| Cliente | Arquivo |
| --- | --- |
| `claude` | `.mcp.json` |
| `codex` | `.codex/config.toml` |
| `opencode` | `opencode.json` |
| `cursor` | `.cursor/mcp.json` |
| `gemini` | `.gemini/settings.json` |

```bash
designfy mcp setup --dry-run
```

```text
  claude / designfy  planned add · /tmp/opencode/designfy-demo/.mcp.json
  claude / shadcn    planned add · /tmp/opencode/designfy-demo/.mcp.json
```

Sem `--client`, o comando usa os clientes que já têm arquivo no projeto e, quando
nenhum tem, o `claude`. Para escolher:

```bash
designfy mcp setup designfy shadcn --client codex,opencode
```

O comando preserva as outras chaves e entradas. Uma entrada existente e
diferente exige `--force`. `--dry-run` imprime o plano. Nenhuma entrada leva
segredo: o servidor do Designfy não precisa de credencial para ler o projeto e
as tools de catálogo não chamam API externa.

## Testar

O Inspector do MCP abre uma página local para chamar tools, ler resources e
inspecionar as mensagens JSON-RPC:

```bash
npx @modelcontextprotocol/inspector designfy mcp
```

Para testar sem interface, um cliente MCP mínimo inicia o processo, pede a
listagem de tools e chama `project_status`. O retorno precisa trazer o projeto
da pasta do servidor.

## Conferir

- `designfy mcp --list` mostra as tools, resources e prompts.
- `designfy mcp --list --read-only` não lista `components_add` nem `capture_run`.
- `designfy mcp setup --dry-run` mostra os arquivos de cada cliente.
- O cliente reiniciado enxerga o servidor `designfy` e responde a
  `project_status`.
- Nenhuma resposta de tool traz valor de credencial.
