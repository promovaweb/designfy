# Designfy

`designfy`: visual framework for web projects, with a design system, React and Astro components built on Tailwind, shadcn and motion, specialist skills, dependency and MCP setup, and Playwright screen captures.

## Purpose

Quem constrói um site em Astro ou um sistema em React com um agente de código
recebe telas que funcionam e parecem geradas: paleta sem regra, tipografia
padrão, componente novo a cada página, nada se move e o celular fica para
depois. O Designfy entrega o método e as peças para a interface sair
desenhada: uma skill orquestradora que recebe o pedido e monta a
especificação da tela (o viewspec), skills especialistas por área, um
registro de componentes com movimento, o catálogo de bibliotecas e de
servidores MCP e a captura das telas em celular e desktop para a revisão. A
mesma base atende a pessoa no terminal, os scripts e os agentes.

## Audiences

| Público | Modo | Necessidade |
| --- | --- | --- |
| pessoa desenvolvedora | TUI | escolher skills internas e externas, dependências npm, componentes e servidores MCP e instalar tudo no projeto |
| pessoa desenvolvedora | CLI texto | preparar o projeto, copiar componentes, gerar paleta, capturar telas e acompanhar os viewspecs |
| scripts e CI | CLI `--json` | conferir dependências, validar viewspecs e capturar telas a cada build |
| agentes (Claude Code, Codex, OpenCode, Cursor, Gemini CLI) | skills `designfy*` e MCP | receber o pedido pela skill `designfy`, montar o viewspec, chamar as especialistas, copiar componentes e revisar as capturas |

## Out of scope

- Hospedar um registro público de componentes: o repositório é privado e o
  binário leva o registro embutido.
- Gerar imagens, ilustrações ou logos: o trabalho de marca fica com o
  [Brandfy](https://github.com/promovaweb/brandfy).
- Substituir o shadcn CLI: `designfy components add` copia os componentes do
  Designfy; os componentes do shadcn e do ReUI continuam saindo por
  `npx shadcn@latest add`, que o Designfy só orienta e confere.
- Escrever copy: o texto vem do projeto ou do
  [Inboundfy](https://github.com/promovaweb/inboundfy).
- Comparação de imagens pixel a pixel e testes visuais em CI: a captura
  alimenta a revisão feita pelo agente e pela pessoa.
- Edição de viewspec pelo binário: o arquivo é Markdown escrito pela skill
  `designfy-viewspec`; o binário só lê e valida.

## Surface

### Commands

| Command | Função |
| --- | --- |
| `init` | detecta o projeto e grava `designfy.json`, com `--theme-path <path>` para escolher o CSS do tema |
| `status` | mostra o projeto detectado, o major do Tailwind, skills, dependências, componentes e viewspecs |
| `skills list` | catálogo de skills internas e externas, com o estado no projeto |
| `skills install [names...]` | instala skills pelo `skills` CLI; `--all`, `--internal`, `--external`, `--agent`, `--global`, `--dry-run` |
| `skills update [names...]` | atualiza as skills instaladas |
| `skills remove <names...>` | remove skills do projeto |
| `deps list` | grupos de bibliotecas sugeridas, com a versão conferida e o estado no `package.json` |
| `deps check` | compara o `package.json` com o catálogo e com o que os componentes copiados pedem |
| `deps install [groups-or-packages...]` | instala pelo gerenciador do projeto (`npm`, `pnpm`, `bun`, `yarn`); `--dry-run` |
| `components list` | componentes do registro, por categoria e framework, com aviso em Tailwind 3 |
| `components show <name>` | arquivos, dependências, variações e uso de um componente, com aviso em Tailwind 3 |
| `components add <names...>` | copia para o projeto, na pasta de `designfy.json`; `--framework`, `--path`, `--overwrite`, `--dry-run`. Em Tailwind 3, exige `--allow-tailwind3` (exit code 10) |
| `mcp servers` | catálogo de servidores MCP sugeridos (Designfy, shadcn e Playwright; o ReUI entra pelo registro `@reui` no servidor do shadcn) |
| `mcp setup [servers...]` | grava a entrada nos arquivos de projeto de Claude Code, Codex, OpenCode, Cursor e Gemini CLI; `--client`, `--dry-run` |
| `palette generate` | escala OKLCH e tokens semânticos a partir de uma cor base e de uma harmonia da roda de cores; `--format css\|json\|tailwind` |
| `palette wheel <color>` | harmonias da roda de cores para uma cor |
| `palette contrast <foreground> <background>` | contraste WCAG 2.2 e APCA com o veredito por uso |
| `capture run <urls...>` | captura cada URL em celular, tablet e desktop com o Playwright; `--viewport`, `--theme`, `--full-page`, `--reduced-motion`, `--out` |
| `capture list` | execuções gravadas em `.designfy/captures/` |
| `catalog list` | catálogo de componentes comuns de interface, por superfície, categoria e tipo de tela |
| `catalog show <id>` | propósito, anatomia, variações, estados e onde está a implementação |
| `catalog search <text>` | busca no catálogo |
| `theme show` | tokens, regra de seleção e fontes do tema Tailwind 3 ou 4, incluindo config no Tailwind 3 |
| `theme check` | contraste dos pares nos modos `shadcn` e `custom` e papéis do registro ausentes em temas shadcn |
| `viewspec guide` | o guia do projeto, `VIEWSPEC.md` na raiz: seções, regras e aprendizados |
| `viewspec list` | viewspecs do projeto, com status, tipo e progresso |
| `viewspec show <id>` | um viewspec inteiro |
| `viewspec progress` | resumo por status e próximo `id` livre |
| `viewspec validate [id]` | confere o contrato sem alterar arquivos |
| `doctor` | verifica o ambiente, informa o major do Tailwind e avisa sobre a compatibilidade do registro |
| `tui`, `about`, `config`, `credentials`, `mcp`, `skill`, `completion` | herdados do starter kit |

`--project <dir>` (`-C`) seleciona a pasta de trabalho e tem precedência
sobre `DESIGNFY_PROJECT`. Caminho inexistente retorna 6.

### Screens

| Screen | Função |
| --- | --- |
| `overview` (Home) | menu em grade de cartões numerados com o resumo vivo de cada módulo e a faixa de próximo passo |
| `project` | projeto detectado: framework, gerenciador de pacotes, Tailwind e shadcn |
| `theme` | amostras de cor, tipografia, raios, espaçamento e movimento, com o modo da auditoria e os pares de contraste em `c` |
| `catalog` | catálogo de interface por categoria, com anatomia, estados e fontes |
| `skills` | lista de seleção múltipla, internas e externas, com instalar, atualizar e remover |
| `components` | registro por categoria, com prévia dos arquivos e cópia para o projeto |
| `deps` | grupos de bibliotecas, seleção múltipla e instalação |
| `mcp` | servidores e clientes, com gravação da configuração |
| `viewspecs` | viewspecs do projeto, com status, progresso e leitura do arquivo |
| `captures` | execuções de captura e os arquivos de cada uma |
| `settings`, `credentials`, `docs`, `about` | herdadas do starter kit, no shell novo |

A TUI segue o padrão de design do Hub da Promovaweb (`TUI.md`): cabeçalho
em faixa com marca e trilha, Home que é menu, chips de tecla, painéis com
título na borda, medidores e gráficos de barras, plano e progresso no
painel de detalhe e os temas `terminal`, `night` e `day`.

### MCP

| Tool | Função |
| --- | --- |
| `project_status` | projeto detectado e estado das instalações |
| `skills_list` | catálogo de skills com o estado |
| `deps_list`, `deps_check` | catálogo de bibliotecas e conferência do `package.json` |
| `components_list`, `components_show`, `components_add` | registro de componentes e cópia para o projeto. `allowTailwind3` autoriza a cópia com aviso |
| `catalog_list`, `catalog_show`, `catalog_search` | catálogo de interface que as skills leem para escolher os fragmentos |
| `theme_show`, `theme_check` | tema Tailwind 3 ou 4, regra de seleção, fontes e auditoria de contraste em `shadcn` ou `custom` |
| `doctor` | diagnóstico do ambiente e de compatibilidade do registro |
| `mcp_servers` | catálogo de servidores MCP |
| `palette_generate`, `palette_wheel`, `palette_contrast` | paleta, harmonias e contraste |
| `capture_run`, `capture_list` | capturas com o Playwright |
| `viewspec_guide`, `viewspec_list`, `viewspec_show`, `viewspec_progress`, `viewspec_validate` | leitura dos viewspecs |

Resources e prompts do starter kit seguem iguais. As tools que escrevem no
projeto (`components_add`, `capture_run`) ficam fora do modo `--read-only`.
As tools de projeto aceitam `project` para selecionar a pasta em cada chamada.

### Skills

| Skill | Função |
| --- | --- |
| `designfy` | orquestradora: chamada com o pedido da pessoa, lê o projeto, monta o viewspec e aciona as especialistas na ordem |
| `designfy-viewspec` | contrato, criação e execução do viewspec de uma página ou tela |
| `designfy-design-system` | tokens, paleta e roda de cores, tipografia, espaçamento, fundos, temas e modo escuro |
| `designfy-components` | componentização com shadcn, ReUI e Tailwind em React e Astro, estados e o registro do Designfy |
| `designfy-motion` | movimento: entrada, rolagem, hover, transições de estado, contadores e movimento reduzido |
| `designfy-websites` | sites e landing pages: estrutura, hero, seções, navegação, rodapé e conversão |
| `designfy-content` | blogs e artigos: diagramação de texto, leitura, índice, embeds de vídeo e mídia |
| `designfy-webapps` | telas de sistema: shell, tabelas, formulários, dashboards, contadores, CRUD e configurações |
| `designfy-responsive` | celular, tablet e desktop: pontos de quebra, container queries, toque e tabelas no celular |
| `designfy-accessibility` | WCAG 2.2: contraste, foco, teclado, leitores de tela, formulários e movimento |
| `designfy-review` | revisão com capturas do Playwright em celular e desktop e a lista de acabamento |

Skills externas que compõem o framework, instaladas por `skills install`:
`hallmark` ([nutlope/hallmark](https://github.com/nutlope/hallmark)),
`shadcn` ([shadcn/ui](https://github.com/shadcn-ui/ui)), a biblioteca do
[Astrofy](https://github.com/promovaweb/astrofy) em projetos Astro e a do
[Brandfy](https://github.com/promovaweb/brandfy) quando a marca ainda não
existe.

### Settings

| Key | Função |
| --- | --- |
| `skills.source` | origem das skills internas; padrão `promovaweb/designfy` |
| `skills.agents` | agentes que recebem as skills; padrão `universal,claude-code,codex,opencode` |
| `deps.packageManager` | `auto`, `npm`, `pnpm`, `bun` ou `yarn` |
| `capture.viewports` | viewports padrão de `capture run` |
| `capture.outDir` | pasta das capturas; padrão `.designfy/captures` |
| `tui.initialTab` | módulo aberto ao iniciar; `overview` (a Home) por padrão |
| `tui.theme` | `terminal`, `night` ou `day` |

### Project files

| Arquivo | Função |
| --- | --- |
| `designfy.json` | projeto detectado, framework, pasta dos componentes, alias de import, CSS opcional em `paths.theme` e pares de contraste em `theme.pairs` |
| `VIEWSPEC.md` | guia de interface do projeto: preferências, diretrizes, padrões e aprendizados que valem para todas as telas |
| `viewspec/<id>-<slug>/VIEWSPEC.md` | especificação de uma página ou tela |
| `.designfy/captures/<run>/` | capturas e `manifest.json` de cada execução |

### Storage

`~/.designfy/`: `settings.json`, `credentials.json` e `master.key`. Sem banco.
O binário não guarda segredo próprio; o cofre vem do starter kit.

## Specs

| Spec | Status | Assunto |
| --- | --- | --- |
| [0001](specs/0001-fundacao-do-framework.md) | done | catálogos, skills, dependências, MCP, componentes, paleta, capturas, viewspec, TUI e tools |
| [0002](specs/0002-tailwind-3-e-projetos.md) | done | Tailwind 3 e seleção de projeto |
| [0003](specs/0003-theme-discovery-and-contrast.md) | done | Descoberta de tema e contraste de escalas próprias |

## Notes

- O nome da especificação de interface é viewspec, em pasta visível
  (`viewspec/`), por escolha do Luiz em 24/11/2026.
- O Hallmark é MIT. O conteúdo dele entra nas skills do Designfy com o aviso
  de licença em `THIRD-PARTY-NOTICES.md`, e a skill `hallmark` continua
  instalada como parte do framework.
- Movimento é o padrão: toda tela tem algum, com versão parada para
  `prefers-reduced-motion` (Luiz, 24/11/2026).
- Todos os componentes usam os papéis do tema do Tailwind; nenhum leva cor
  ou fonte literal.
- O repositório `promovaweb/ui-components` guarda referências do Tailwind
  Plus, cuja licença não permite redistribuição. Ele serviu de mapa de
  famílias; nenhum arquivo dele entrou no registro.
- A captura roda o Playwright pelo Node do projeto. O binário compilado não
  leva o navegador.
- 2026-11-24: spec 0002 (Tailwind 3 e seleção de projeto) concluída.
- 2026-11-24: spec 0003 (Descoberta de tema e contraste de escalas próprias) concluída.
