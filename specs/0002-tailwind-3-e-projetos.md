# Tailwind 3 e seleção de projeto

Status: done

## Goal

Inspecionar temas Tailwind 3 e operar projetos do Hub a partir de outra pasta.

## Surface

| Entrada | Mudança |
| --- | --- |
| `--project <dir>` / `-C`, `DESIGNFY_PROJECT` | Selecionam a pasta de trabalho. A option tem precedência. Pasta ausente retorna 6. |
| `theme show`, `theme_show` (read) | Retornam a versão do Tailwind, arquivos, avisos e tokens do CSS e da configuração. |
| `theme check`, `theme_check` (read) | Incluem papéis definidos pelo config Tailwind 3 na auditoria existente. |
| `components list`, `components show`, `components_list`, `components_show` (read) | Exibem a nota de compatibilidade quando o projeto usa Tailwind 3. |
| `components add`, `components_add` (write) | Recusam cópia no Tailwind 3 com código 10, com opção de cópia via `--allow-tailwind3` ou `allowTailwind3`. |
| `status`, `doctor`, `project_status`, `doctor` (read) | Mostram a versão detectada. O diagnóstico avisa sobre o requisito de Tailwind 4. |
| Tools MCP de projeto | Aceitam `project` para a duração da chamada. |

## Behavior

A descoberta de CSS mantém a ordem atual e reconhece as diretivas de base do
Tailwind 3. A inspeção segue os imports locais e lê as variáveis claras e escuras.
Para Tailwind 3, também lê propriedades declarativas de `theme` e `theme.extend`
em `tailwind.config.*`. Falha no import gera aviso e mantém os tokens do CSS.
A auditoria mantém os pares e os códigos de saída existentes.

O registro exige Tailwind 4. Em Tailwind 3, a navegação exibe um aviso e a
cópia exige a opção explícita, inclusive em simulações. O modo de leitura
do MCP continua excluindo as tools de escrita.

## Design

Reutilizar o tokenizer e o resolvedor de variáveis de `src/design/theme.ts`.
O CLI muda a pasta antes de executar o command. As tools MCP usam a mesma
validação de diretório e passam caminhos absolutos ao domínio. O plano de
cópia aplica a regra de compatibilidade. Sem dependências novas.

## Tasks

- [x] Estender `theme show` e `theme check` para Tailwind 3. #termfy-cli
- [x] Adicionar `--project`, `-C` e `DESIGNFY_PROJECT` e atualizar `status` e `doctor`. #termfy-cli
- [x] Aplicar o aviso e a proteção de `components list`, `components show` e `components add`. #termfy-cli
- [x] Adicionar `project` às tools de projeto e alinhar `theme_show`, `theme_check`, `components_list`, `components_show` e `components_add`. #termfy-mcp
- [x] Atualizar a documentação e regenerar o OpenCLI. #termfy-docs

## Tests

- [x] Inspecionar fixtures Tailwind 3 com variáveis de canais, tokens do config e import inválido.
- [x] Verificar o bloqueio e a cópia explícita de componentes no CLI e MCP.
- [x] Rodar `status` com option e env, testar `project` em chamadas MCP e preservar o modo de leitura.
- [x] Rodar `bun run validate` e exercitar `theme show` e `theme check` no website.

## Notes

- Escopo e aceite definidos no brief do lote R.
