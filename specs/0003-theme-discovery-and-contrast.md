# Descoberta de tema e contraste de escalas próprias

Status: done

## Goal

Encontrar o CSS principal de projetos com áreas independentes e medir o
contraste de projetos Tailwind 3 e 4 que usam escalas próprias.

## Behavior

`theme show` e `theme check` respeitam `--file`, `paths.theme`,
`tokensFile` do `VIEWSPEC.md` da raiz quando existe e, por fim, a busca
por CSS Tailwind. A busca prioriza entradas convencionais e seus imports
locais e deixa áreas isoladas por último. A inspeção informa a regra de
seleção, o CSS escolhido e a entrada convencional que o importa, quando
encontrada.

O check usa `shadcn` quando encontra `background`, `foreground` e a
maioria dos seis papéis centrais (esses dois e os pares `primary` e
`muted`). Esse modo mantém a auditoria do registro. No modo `custom`,
usa `theme.pairs` ou escolhe os pares semânticos disponíveis. Mede o
tema escuro quando ao menos um token tem declaração escura ou muda de valor. Pares
sem valor ou não resolvidos são relatados. Apenas contraste abaixo do
mínimo retorna 10. A ausência de pares sugere `theme.pairs`.

## Design

O schema de `designfy.json` valida os campos opcionais. O domínio reusa
a leitura do front matter, a descoberta de imports e a resolução de
variáveis. CLI, MCP e TUI usam a mesma auditoria por projeto. Sem
dependências novas.

## Surface

| Entrada | Mudança |
| --- | --- |
| `init --theme-path <path>`, `paths.theme` | Grava o caminho opcional do CSS. |
| `theme show`, `theme_show` (read) | Incluem `selection` e `entryFile` na saída estruturada. |
| `theme check`, `theme_check` (read), `theme.pairs` | Incluem `mode`, `notes` e os resultados dos pares. Mantêm o código 10 e `isError` para reprovação. |
| Tela `theme` | Mostra o modo e abre o relatório de pares com `c`. |

## Tasks

- [x] Implementar `paths.theme`, `theme.pairs` e descoberta de CSS. #termfy-config
- [x] Expor a seleção e a auditoria em `theme show`, `theme check` e `init --theme-path`. #termfy-cli
- [x] Alinhar `theme_show` e `theme_check`. #termfy-mcp
- [x] Adaptar a tela `theme`. #termfy-tui
- [x] Documentar os campos e regenerar o OpenCLI. #termfy-docs

## Tests

- [x] Verificar a precedência de caminhos e imports com fixtures.
- [x] Medir pares configurados e automáticos e verificar códigos de saída e MCP.
- [x] Rodar `bun run validate` e registrar o smoke test no website.

## Notes

- 2026-11-24: escopo e aceite definidos no briefing do lote S.
