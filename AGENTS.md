# Instruções para agentes

Este repositório é o `designfy`, o framework visual da Promovaweb para projetos
web. É um binário em Bun, criado com o starter kit do framework
[Termfy](https://github.com/promovaweb/termfy), com três modos no mesmo
executável: sem argumentos abre a TUI; com argumentos roda como CLI com saída em
texto ou `--json`; `designfy mcp` vira servidor Model Context Protocol via
stdio.

O Designfy entrega catálogos de skills, bibliotecas e servidores MCP, um registro
de componentes React e Astro sobre Tailwind, shadcn e Motion, um catálogo de
fragmentos comuns de interface, paleta pela roda de cores, presets de fundo,
capturas com o Playwright e o viewspec, o guia de interface do projeto e de cada
tela. O domínio fica em `src/design/`; os commands, as tools e as telas só chamam
essas funções. As onze skills `designfy*` ficam em `skills/` e são a porta de
entrada dos agentes que usam o framework. O repositório é privado e o registro
de componentes viaja embutido em `src/generated/registry.ts`.

As skills que ensinam a evoluir este projeto vêm do framework
[`promovaweb/termfy`](https://github.com/promovaweb/termfy) e estão instaladas em
`.agents/skills/termfy-*` (com links em `.claude/skills/`), registradas em
`skills-lock.json`. Para setup ou manutenção dessas skills, use `termfy-init` no
modo correspondente. Execute os comandos internos pelo agente; não transfira esse
trabalho ao usuário.

## Idioma

- Todo o código é em inglês: nomes de arquivos, identificadores, comentários,
  mensagens do binário, commands, options, arguments, keys de configuração,
  campos do `--json` e nomes de tools MCP.
- Documentação para pessoas (`README.md`, `docs/`, `CHANGELOG.md`, este
  arquivo) é em português do Brasil, com os termos técnicos em inglês
  preservados (`build`, `stdin`, `flag`, `tool`, `resource`, `command`).
- As skills de `skills/` são em português do Brasil. O frontmatter usa `name` e
  `description`, e o nome repete o da pasta.
- Respostas ao usuário em português do Brasil.

## Especificação

O binário não lê nem edita specs: elas são Markdown puro, mantidas pelo agente
com as skills do framework. São dois tipos de documento:

- `CLISPEC.md`, único, na raiz: a visão macro do binário (identidade,
  propósito, públicos, fora de escopo, superfície entregue e índice das
  specs). A skill `termfy-clispec` o escreve em entrevista com a pessoa.
- `specs/NNNN-slug.md`, um por evolução: status, mudanças de superfície, como o
  binário vai funcionar (`Behavior`), como o código deve ser feito (`Design`),
  tarefas e testes em checklist. A skill `termfy-spec` escreve cada spec em
  entrevista com a pessoa.

Antes de implementar qualquer command, screen ou tool, leia a spec aberta que
cobre o pedido; se nenhuma cobrir, rode a skill `termfy-spec` primeiro. Siga o
`Behavior` e o `Design` da spec, marque os itens da checklist ao concluir cada
entrega e, com tudo marcado, atualize a superfície e o índice do `CLISPEC.md` e
mude o status da spec para `done`.

O contrato do viewspec não é uma spec do binário: ele é produto do framework e
vive em `docs/viewspec.md`. O binário só lê e valida viewspec; quem escreve é a
skill `designfy-viewspec`.

## Ordem de leitura

1. Este arquivo.
2. `CLISPEC.md` e a spec aberta em `specs/`, quando existirem.
3. `docs/architecture.md` para entender as camadas e o fluxo de execução.
4. `docs/viewspec.md` quando a tarefa tocar no guia do projeto, no viewspec de
   uma tela ou no comando `viewspec`.
5. `registry/README.md` e `registry/CONVENTIONS.md` quando a tarefa tocar em
   componente do registro ou no catálogo de interface.
6. As skills `designfy*` em `skills/`, que descrevem o comportamento que o
   binário e os catálogos precisam sustentar.
7. A skill compatível com a tarefa em `.agents/skills/`. Quando a pessoa
   descrever a ferramenta em linguagem natural sem nomear uma skill, use
   `termfy`, a porta de entrada, que orquestra as demais na ordem do guia:
   - `termfy`: porta de entrada; conduz o ciclo inteiro;
   - `termfy-init`: personalizar o starter kit e manter as skills instaladas;
   - `termfy-brand`: nome, título, descrição, autor, links, créditos e paleta;
   - `termfy-clispec`: descrever o binário e manter o `CLISPEC.md`;
   - `termfy-spec`: escrever cada spec de evolução em `specs/`;
   - `termfy-database`: banco SQLite, só quando a pessoa pede armazenamento;
   - `termfy-api-import`: converter a documentação de uma API em spec;
   - `termfy-config`: settings, credenciais e variáveis;
   - `termfy-api`: client HTTP de serviço externo;
   - `termfy-cli`: commands, options, saída e exit codes;
   - `termfy-command-set`: família `recurso verbo` com tools e screen;
   - `termfy-mcp`: tools, resources e prompts;
   - `termfy-tui`: screens, tema e interação por teclado;
   - `termfy-test`: testes nos três modos;
   - `termfy-review`: auditoria da entrega, sem editar;
   - `termfy-docs`: melhorar a documentação embutida em `docs/`;
   - `termfy-release`: versão, changelog, tag e release;
   - `termfy-mcp-client`: configuração nos clientes de agente.
8. As `references/` indicadas pela skill. Citar uma referência não substitui
   abri-la.

## Regras que valem para toda mudança

- Toda option, argument, subcommand, tool e key de configuração nasce
  documentada: `description` no registry, linha na tabela de `docs/` e, quando
  for conceito novo, parágrafo em prosa. O `--skill` imprime `docs/` inteiro
  mais a referência gerada do registry, então `docs/` precisa continuar correto
  para quem lê o binário sem o repositório.
- Exit codes vêm de `src/app/exit-codes.ts`. Zero é sucesso. Não invente números
  em commands; acrescente a família na tabela e o atalho em `src/app/errors.ts`.
- Segredos nunca passam por argument, log, erro, `--json` sem `--reveal`, tool
  MCP ou frame da TUI. Leia com `getCredential()`.
- Stdout recebe dados; stderr recebe progresso e avisos. Em `mcp`, stdout é do
  JSON-RPC.
- Um arquivo por command, por screen e por grupo de tools. Registro central em
  `src/cli/commands.ts`, `src/tui/screens/index.ts` e `src/mcp/server.ts`.
- O domínio fica em `src/design/` e não importa de `cli/`, `tui/` ou `mcp/`.
  Commands, tools e telas chamam as funções do domínio.
- Cores da TUI só em `src/tui/theme.ts`.
- Componente do registro usa só os papéis do tema do Tailwind. Nenhuma cor
  literal, nenhuma classe de paleta fixa e nenhuma `font-family` literal;
  `registry:check` recusa o que fugir disso. A regra completa está em
  `registry/CONVENTIONS.md`.
- Todo item de componente do registro aponta para uma entrada de
  `catalog/interface.json` em `meta.catalog`, e todo id usado precisa existir.
  Itens `registry:lib` e `registry:style` podem omitir o vínculo.
  `registry:check` confere.
- O contrato de `docs/viewspec.md` é a fonte do
  `skills/designfy-viewspec/references/contrato.md`. Mude o contrato e rode
  `bun run skills:sync`; não edite o arquivo gerado à mão.
- As skills de `skills/` são escritas à mão e passam pelo `skills:lint`, que
  confere frontmatter, as seções `Leitura prévia`, `Regras`, `Passos`, `Marcos` e
  `Saída`, os links, os arquivos sem referência, as famílias vetadas e cada
  command, option, tool e item de catálogo citado.
- A TUI segue `/home/luizeof/hub/TUI.md`, o padrão das TUIs da Promovaweb, além
  de `docs/tui.md`. Tela nova entra na Home em menu, na barra de teclas e nos
  quadros de referência de `tests/showcase-frames/`.
- Lotes paralelos de subagentes trabalham em arquivos disjuntos. Dois lotes ao
  mesmo tempo nunca escrevem o mesmo arquivo; os registros centrais
  (`catalog/*.json`, `docs/opencli.json`, `package.json`, índices e manifestos)
  ficam com o lote que integra.
- Node e npm não entram no binário: o projeto usa Bun para rodar, testar e
  compilar. O `npx`, para as skills e para o Playwright da captura, é a única
  exceção.
- Documente código novo ou alterado com cabeçalho explicando o propósito do
  arquivo e JSDoc em funções exportadas, em inglês.
- Não edite `.agents/skills/termfy-*`. Mudança de skill do framework acontece no
  framework; aqui ela chega pela manutenção conduzida por `termfy-init`.
- Não edite à mão `src/generated/registry.ts`, `registry/*/registry.json`,
  `registry/shared/backgrounds/*`, `docs/opencli.json`, os dados da galeria de
  `examples/backgrounds/index.html` nem os arquivos de skill marcados como
  gerados. Rode `registry:embed`, `backgrounds:build`, `opencli` ou `skills:sync`.

## Validação antes de concluir

```bash
bun run validate
```

Encadeia `typecheck`, `bun test`, `skills:check`, `skills:sync:check`,
`skills:lint`, `registry:check`, `backgrounds:check`, `opencli:check`,
`docs:check` e `build`. `docs:check` exige que todo command, screen, tool,
resource, prompt, key e exit code do código apareça em `docs/`. Quando o registry
de commands mudar, rode `bun run opencli` antes e revise o diff de
`docs/opencli.json`. Quando `docs/user/` mudar, rode `bun run ebook` e
`bun run ebook:verify`. Confira `git status --short` ao final e preserve mudanças
que já existiam.

## Publicação

Toda alteração publicada sai com versão em `package.json`, entrada em
`CHANGELOG.md`, tag `vX.Y.Z` e GitHub Release privada com os binários. O guia do
usuário é reconstruído quando `docs/user/` muda, e a edição fica em `ebook/`. O
fluxo está em `RELEASING.md` e em `docs/release.md`. Tags não são movidas. Sem
publicação no npm por enquanto. Depois da release, o gitlink do submódulo é
atualizado no Hub.

## Status das tarefas no ClickUp

Após cada commit bem-sucedido, marque como `pronto` a tarefa ou subtarefa vinculada à entrega. Após o push bem-sucedido desse commit, marque-a como `publicado`. Registre repositório, SHA e destino do push na tarefa e confirme o status pelo ClickUpfy.

| Status | Quando usar |
| --- | --- |
| `nao iniciado` | Demanda registrada que ainda não foi priorizada. |
| `triagem` | Esclareça o pedido, confira duplicidades e identifique o responsável. |
| `proxima etapa` | Trabalho priorizado que já tem próxima ação e condição de aceite. |
| `em andamento` | Há alguém executando a tarefa, com plano e cronômetro. |
| `refazer` | A revisão pediu ajustes. Registre o que corrigir e retome em `em andamento` ao começar. |
| `revisar` | A entrega está disponível e validada para revisão. Registre como conferi-la. |
| `pronto` | O commit da entrega foi criado. Registre o repositório e o SHA. |
| `publicado` | O push do commit foi confirmado. Registre remoto, branch e versão ou release quando aplicável. |
| `concluido` | Encerramento por orientação do usuário após conferir a entrega em produção ou o aceite da entrega interna. |
