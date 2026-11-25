# Onde cada mudança entra

O Designfy nasceu do starter kit do [Termfy](https://github.com/promovaweb/termfy),
mas este repositório já tem identidade, marca e domínio próprios. Este mapa
mostra onde cada tipo de mudança entra. O passo a passo de desenvolvimento está
no [CONTRIBUTING.md](../CONTRIBUTING.md), e as camadas estão em
[architecture.md](architecture.md).

| Quer | Onde |
| --- | --- |
| novo command | `template/command/example.ts` → `src/cli/commands/<name>.ts`, registrar em `src/cli/commands.ts` e descrever em `docs/cli.md` |
| nova tool MCP | `template/tool/example.ts` → `src/mcp/tools/<group>.ts`, registrar em `registerAll` de `src/mcp/server.ts` e descrever em `docs/mcp.md` |
| nova tela da TUI | `template/screen/example.ts` → `src/tui/screens/<name>.ts`, registrar em `src/tui/screens/index.ts` e descrever em `docs/tui.md` |
| nova key de configuração | `SETTINGS_SCHEMA` em `src/config/settings.ts` e a tabela de `docs/configuration.md` |
| novo exit code | `src/app/exit-codes.ts`, o atalho em `src/app/errors.ts` e a tabela de `docs/exit-codes.md` |
| nova entry do catálogo de interface | `catalog/interface.json`, depois `bun run skills:sync` |
| novo item do registro | `registry/<framework>/items/`, o arquivo de origem em `registry/<framework>/` ou `registry/shared/`, `meta.catalog` e `bun run registry:embed` |
| nova skill | `skills/<name>/SKILL.md` com as cinco seções, a entry em `catalog/skills.json` e `bun run skills:lint` |
| novo preset de fundo | `skills/designfy-design-system/references/backgrounds/reactbd-bg.json` e `bun run backgrounds:build` |
| identidade, título, autor e links | `src/app/manifest.ts` e o bloco `termfy` do `package.json` |
| cores da TUI | `src/tui/theme.ts` (`terminal`, `night` e `day`) |
| contrato do viewspec | `docs/viewspec.md`, depois `bun run skills:sync` |
| marca e ativos | `brand/`, com as regras de `brand/README.md` |

## Arquivos gerados

Não edite estes arquivos à mão. Cada um sai de um script e é conferido pelo
`validate`:

| Arquivo | Script |
| --- | --- |
| `src/generated/registry.ts` e `registry/<framework>/registry.json` | `bun run registry:embed` |
| `registry/shared/backgrounds/*`, `registry/react/background/presets.ts` e os dados da galeria de `examples/backgrounds/index.html` | `bun run backgrounds:build` |
| `docs/opencli.json` | `bun run opencli` |
| `skills/designfy-viewspec/references/contrato.md`, `skills/designfy-design-system/assets/tema-inicial.css`, `skills/designfy-components/references/catalogo-de-interface.md` e `skills/designfy-components/references/bibliotecas-catalogo.md` | `bun run skills:sync` |
| `dist/` | `bun run build` |

## Skills do framework

As skills que ensinam um agente a evoluir o projeto vêm do framework
[`promovaweb/termfy`](https://github.com/promovaweb/termfy), ficam em
`.agents/skills/termfy-*` e estão registradas em `skills-lock.json`. A
atualização ou o reparo passa por `termfy-init` no modo de manutenção. Não edite
essas skills à mão.

| Skill | Uso |
| --- | --- |
| `termfy` | porta de entrada: descrever a ferramenta e deixar a skill conduzir o ciclo |
| `termfy-brand` | ajustar nome, título, descrição, autor, links, créditos e paleta |
| `termfy-clispec` | manter o `CLISPEC.md` |
| `termfy-spec` | escrever cada spec de evolução em `specs/` |
| `termfy-command-set` | família `recurso verbo` com tools e screen |
| `termfy-cli` | commands, options, saída texto e JSON, exit codes e OpenCLI |
| `termfy-tui` | telas, componentes, tema e o visual do terminal |
| `termfy-mcp` | tools, resources, prompts e teste com o Inspector |
| `termfy-config` | settings, credenciais, master key e variáveis |
| `termfy-test` | testes de CLI, MCP, TUI e configuração |
| `termfy-review` | auditoria da entrega por gravidade |
| `termfy-docs` | documentação embutida e `docs:check` |
| `termfy-release` | versão, changelog, tag e release |
| `termfy-mcp-client` | configuração nos clientes de agente |

As skills do produto, em `skills/designfy*`, são outras: elas ensinam o agente a
usar o Designfy em um projeto e são escritas à mão neste repositório.
