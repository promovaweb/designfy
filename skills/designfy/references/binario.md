# Binário `designfy` e servidor MCP

Os comandos que a orquestração usa, na ordem do fluxo. Todos aceitam
`--json`, que devolve `{ ok, command, data }` ou `{ ok, command, error }`.
A referência completa está no próprio binário: `designfy --skill` e
`designfy <command> --help`.

## Códigos de saída que mudam o fluxo

| Código | Significado | O que fazer |
| --- | --- | --- |
| 0 | certo | seguir |
| 2 | argumento ou opção inválidos | corrigir a chamada |
| 5 | processo externo ou rede falhou | ler `error.details`, conferir servidor local, `npx`, acesso |
| 6 | item não existe | usar um id de `error.details.known` |
| 10 | conferência reprovada | ler a lista do que falta e corrigir antes de avançar |

## Por estágio

| Estágio | Comando | Para quê |
| --- | --- | --- |
| ler o projeto | `designfy status --json` | framework, tema, guia, contagens |
| | `designfy doctor` | ambiente e arquivos |
| preparar | `designfy init` | grava `designfy.json` |
| | `designfy deps check`, `designfy deps install [grupos]` | bibliotecas |
| | `designfy skills install` | skills internas e externas |
| | `designfy mcp setup` | servidores MCP nos clientes |
| tema | `designfy theme show [--group colors]` | tokens do Tailwind do projeto |
| | `designfy theme check` | contraste e papéis que faltam |
| | `designfy palette generate --base <cor> --harmony <tipo>` | escalas e tokens novos |
| | `designfy palette wheel <cor>` | harmonias da roda de cores |
| | `designfy palette contrast <texto> <fundo>` | um par de cores |
| guia | `designfy viewspec guide` | seções, regras e propostas do guia |
| catálogo | `designfy catalog list --kind <kind>` | fragmentos indicados para o tipo de tela |
| | `designfy catalog show <id>` | anatomia, estados, responsivo, movimento, fontes |
| | `designfy catalog search "<texto>"` | busca por função |
| componentes | `designfy components list --surface <site|system>` | itens do registro |
| | `designfy components show <nome> --source` | arquivos e conteúdo |
| | `designfy components add <nomes...>` | copia para o projeto |
| viewspec | `designfy viewspec progress` | próximo `id` e contagem |
| | `designfy viewspec list --status in_progress` | o que está aberto |
| | `designfy viewspec show <id>` | um viewspec inteiro |
| | `designfy viewspec validate [id]` | contrato da tela e do guia |
| revisão | `designfy capture run <url...> --viewport mobile,desktop` | PNG e `manifest.json` |
| | `designfy capture list` | execuções gravadas |

## `components add`

A saída diz o que aconteceu com cada arquivo: `written`, `unchanged` ou
`skipped` (o arquivo existe e é diferente; não foi tocado). Ela também
lista os pacotes npm que faltam e os itens `shadcn:` que precisam de
`npx shadcn@latest add <item>`. Leia a saída inteira e execute o que ela
pede antes de importar o componente.

Use `--overwrite` só quando a pessoa pedir a versão nova por cima da
alterada: o arquivo copiado pertence ao projeto e pode ter sido editado.

## `capture run`

```bash
designfy capture run http://localhost:4321/ http://localhost:4321/precos/ \
  --viewport mobile,desktop --name precos-revisao-1
designfy capture run http://localhost:5173/app/pedidos --theme dark --reduced-motion
designfy capture run http://localhost:4321/ --fold        # só a primeira dobra
```

Cada execução grava `.designfy/captures/<nome>/` com um PNG por URL e
viewport e o `manifest.json`. Campos que a revisão lê primeiro:
`overflowX`, `consoleErrors`, `documentHeight` e `title`.

## Pelo MCP

Com o servidor configurado (`designfy mcp setup`), as mesmas leituras
existem como tools: `project_status`, `skills_list`, `deps_list`,
`deps_check`, `catalog_list`, `catalog_show`, `catalog_search`,
`components_list`, `components_show`, `components_add`, `theme_show`,
`theme_check`, `palette_generate`, `palette_wheel`, `palette_contrast`,
`viewspec_guide`, `viewspec_list`, `viewspec_show`, `viewspec_progress`,
`viewspec_validate`, `capture_run`, `capture_list` e `mcp_servers`. As que
gravam no projeto (`components_add`, `capture_run`) ficam fora do modo
somente leitura.

Prefira a tool MCP quando ela estiver disponível: a resposta já vem
estruturada. Sem o servidor, use o CLI com `--json`.

## Sem o binário

A skill funciona lendo os arquivos: `designfy.json`, `package.json`, o CSS
do tema, `VIEWSPEC.md`, a pasta `viewspec/` e os catálogos em texto que
acompanham as especialistas (`designfy-components` traz o catálogo de
interface em `references/catalogo-de-interface.md`). Avise a pessoa que o
binário não foi encontrado e que capturas e validações ficaram manuais.
