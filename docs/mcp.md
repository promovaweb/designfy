# MCP

`{{bin}} mcp` transforma o processo em um servidor Model Context Protocol
sobre stdio. Stdout fica reservado para JSON-RPC. Diagnósticos vão para stderr.

## Configuração no cliente

```json
{
  "mcpServers": {
    "{{bin}}": { "command": "{{bin}}", "args": ["mcp"] }
  }
}
```

Para o Claude Code: `claude mcp add {{bin}} -- {{bin}} mcp`.
Para desenvolvimento, sem compilar: `"command": "bun", "args": ["run", "src/main.ts", "mcp"]`.

## Tools

| Tool | Entrada | Saída |
| --- | --- | --- |
| `doctor` | nenhuma | `{ checks, ok }`; `isError: true` se houver `fail` |
| `about` | nenhuma | identity, runtime, platform, data directory e credits |
| `exit_codes` | nenhuma | tabela de exit codes |
| `skill` | `topic?` (`cli`, `tui`, `mcp`, `config`, `exit-codes`, `reference`) | documentação em Markdown |
| `config_list` | nenhuma | keys de settings.json em vigor e o schema |
| `config_get` | `key` | valor da key; `isError` quando não existe |
| `credentials_status` | nenhuma | file, master key source, count e names |
| `project_status` | nenhuma | detecção, configuração efetiva, contagens de instalações e viewspecs, guia e CSS do tema |
| `skills_list` | `internal?`, `external?` | skills com estado de instalação |
| `deps_list` | `group?` | grupos, faixas de versões e estado no projeto |
| `deps_check` | `group?` | pacotes ausentes ou desatualizados, com `isError` quando a conferência reprova |
| `catalog_list` | `surface?`, `category?`, `kind?` | fragmentos de interface filtrados |
| `catalog_show` | `id` | propósito, anatomia, variações, estados, tokens e fontes |
| `catalog_search` | `text` | fragmentos que correspondem à busca |
| `components_list` | `framework?`, `category?`, `surface?` | metadados dos itens do registro |
| `components_show` | `name`, `framework?`, `source?` | metadados, arquivos e conteúdo se solicitado |
| `theme_show` | `file?`, `group?` | CSS de origem e tokens por grupo |
| `theme_check` | `file?` | contraste em claro e escuro e papéis semânticos ausentes, com `isError: true` quando a conferência reprova |
| `palette_generate` | `base`, `harmony?` | escalas OKLCH, tokens claros e escuros e contraste |
| `palette_wheel` | `color` | cores de cada harmonia em hex e OKLCH |
| `palette_contrast` | `foreground`, `background` | razão WCAG, APCA e vereditos por uso |
| `viewspec_guide` | nenhuma | guia do projeto, regras e propostas |
| `viewspec_list` | `status?`, `kind?` | viewspecs com o progresso das checklists |
| `viewspec_show` | `id` | front matter, seções e checklist da tela |
| `viewspec_progress` | nenhuma | contagem por status, progresso das checklists e próximo ID livre |
| `viewspec_validate` | `id?` | estado do guia e diagnósticos dos viewspecs por arquivo e linha |
| `capture_list` | `outDir?` | manifestos de captura, do mais recente ao mais antigo |
| `mcp_servers` | nenhuma | servidores sugeridos e estado nos arquivos de cada cliente |
| `components_add` | `names`, `framework?`, `path?`, `overwrite?`, `dryRun?` | grava componentes e retorna arquivos e dependências. `dryRun` simula a cópia |
| `capture_run` | `urls`, `viewports?`, `theme?`, `fullPage?`, `reducedMotion?`, `waitMs?`, `selector?`, `outDir?`, `name?` | visita URLs e grava imagens e manifesto |

As tools de projeto usam a pasta de trabalho do servidor. `?` indica
entrada opcional. O cofre expõe pelo MCP apenas metadados.

`catalog_show`, `components_show` e `viewspec_show` retornam `isError: true`
quando o identificador solicitado não existe. A resposta em texto contém o
JSON do erro, com a lista de identificadores disponíveis em `error.details.known`.

## Modo de leitura

Inclua `--read-only` depois de `mcp` nos arguments do cliente para iniciar
o servidor sem `components_add` e `capture_run`. Todas as outras tools
continuam disponíveis. `mcp setup` configura arquivos de clientes pelo CLI.

## Resources

| URI | Conteúdo |
| --- | --- |
| `{{bin}}://about` | identity em JSON |
| `{{bin}}://exit-codes` | exit codes em JSON |
| `{{bin}}://skill` | documentação completa em Markdown |
| `{{bin}}://skill/{topic}` | uma seção; o template lista os topics |

## Prompts

| Prompt | Arguments | Função |
| --- | --- | --- |
| `operate` | `task` | instrui o agente a ler `skill cli` e executar a task pelo CLI com `--json` |

## Listar sem iniciar

```bash
{{bin}} mcp --list
{{bin}} mcp --list --json
{{bin}} mcp --list --read-only
```

## Testar

```bash
npx @modelcontextprotocol/inspector {{bin}} mcp
```

O Inspector abre uma página local para chamar tools, ler resources e
inspecionar as mensagens JSON-RPC.

## Como adicionar uma tool

1. Copie `template/tool/example.ts` para `src/mcp/tools/<name>.ts`.
2. Declare `inputSchema` com Zod e descreva cada campo com `.describe()`. A
   description da tool diz quando usar e o que ela devolve. Use
   `readOnlyHint: true` para leitura e `readOnlyHint: false` para escrita.
3. Devolva `content` em texto e, quando a saída for estruturada,
   `structuredContent` com o mesmo objeto.
4. Acrescente a tool ao `catalog.tools` para que `mcp --list` a enxergue.
5. Registre a função em `registerAll` em `src/mcp/server.ts`.
6. Teste com o Inspector e com `bun test`.

Nomes de tools usam `snake_case`. Tools que gravam ou chamam APIs externas
precisam dizer isso na description e nunca devem ecoar segredos na resposta.

A tool `doctor` usa a mesma coleta do command CLI: confere runtime, terminal,
permissões da pasta, settings, origem da chave, leitura do cofre,
Node, npx, configuração do projeto, CSS do Tailwind e guia. Não grava
arquivos e não retorna valores de credenciais. Cada check traz `name`,
`status` (`ok`, `warn` ou `fail`) e `detail`.
