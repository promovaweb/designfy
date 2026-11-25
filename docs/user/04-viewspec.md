# Capítulo 4: Viewspec

O viewspec `0001-founders` reuniu nove itens para revisar o Plano Founders. Um deles tratava do prazo da oferta no celular. Outro especificava como o visitante poderia pausar a faixa animada pelo teclado. O arquivo permitiu acompanhar cada correção até a captura `founders-0001-depois`. Já as orientações aplicáveis a outras páginas ficaram no guia da raiz.

## Onde registrar uma orientação ou uma tarefa

Os dois arquivos se chamam `VIEWSPEC.md` e ficam versionados com o código. Para escolher qual abrir, observe o alcance da mudança.

| Arquivo | Alcance | O que guarda |
| --- | --- | --- |
| `VIEWSPEC.md`, na raiz | o site ou sistema inteiro | o guia de interface: preferências, diretrizes, padrões e aprendizados |
| `viewspec/<id>-<slug>/VIEWSPEC.md` | uma página ou tela | a especificação daquela interface e a checklist da execução |

A orquestradora lê o guia antes de especificar a tela. A skill `designfy-viewspec` escreve e mantém os dois documentos. O binário oferece consultas e validação, por isso você edita o Markdown para registrar uma mudança. O diretório das telas vem de `paths.viewspec`, com `viewspec/` como padrão. Dentro dele, use quatro dígitos para o identificador e kebab-case para o slug. Ambos devem coincidir com o front matter.

## O arquivo que aponta para o tema do projeto

O guia segue a proposta do formato aberto [DESIGN.md](https://github.com/google-labs-code/design.md). No Designfy, o sistema visual também descreve padrões de tela e registra a origem das orientações. No site da Promovaweb, isso permitiu reunir 76 orientações dos documentos de design e consultar a fonte de cada uma antes de alterar uma página.

```markdown
---
schemaVersion: "1.0.0"
scope: project
name: Designfy Demo
description: Landing page de um produto de exemplo usada nos testes do guia.
surfaces: [site]
frameworks: [astro]
tokensFile: src/styles/global.css
themes: [light, dark]
createdAt: 2026-11-24T09:00:00-03:00
updatedAt: 2026-11-24T09:00:00-03:00
---
```

No exemplo, `scope: project` identifica o guia de uma aplicação Astro com temas claro e escuro. Confira o caminho em `tokensFile` no projeto real. No site da Promovaweb, a descoberta automática havia escolhido o CSS da documentação. O guia apontou para `src/styles/brand/global.css`, usado pelas páginas públicas.

### Seções, identificadores e autoria

Depois do front matter, escreva as treze seções da tabela na ordem indicada e encerre com Aprendizados, a décima quarta seção. Quando um assunto não se aplica, preserve o título e escreva `Não se aplica.` com o motivo. A letra à esquerda identifica os itens da respectiva seção.

| Letra | Seção |
| --- | --- |
| `v` | Visão geral |
| `c` | Cores |
| `y` | Tipografia |
| `l` | Layout |
| `f` | Fundos e profundidade |
| `s` | Formas |
| `m` | Movimento |
| `w` | Voz e conteúdo |
| `k` | Componentes |
| `t` | Padrões de tela |
| `r` | Responsivo |
| `a` | Acessibilidade |
| `d` | Faça e não faça |

Um identificador como `{#c002}` pertence a Cores. Use uma letra seguida de três dígitos e preserve a unicidade no arquivo. Para formular a orientação, escolha algo que você consiga verificar na implementação ou em uma captura. No exemplo, o par de cores tem um valor mínimo mensurável.

```markdown
- Texto e fundo com contraste de 4.5:1 ou mais, conferido com `designfy theme check`. `@agente` {#c002}
- A página abre com a promessa em uma frase, sem slogan acima do título. `@pessoa` {#v001}
```

O marcador `@agente` identifica uma escolha feita pelo agente, sujeita a revisão registrada em Aprendizados. Use `@pessoa` para uma orientação do responsável pelo projeto e obtenha o aceite dele antes de alterá-la. O marcador `@revisão` identifica um achado de captura ou auditoria. Um parágrafo explicativo pode ficar sem identificador. A referência de uma tela a uma orientação específica precisa do ID.

Um guia novo já pode registrar que cada tela tem um único `h1` e uma ação principal. Para tabelas, indique a transformação verificável, como exibir cartões abaixo de 640 px quando houver mais de quatro colunas. As orientações iniciais de autoria `@agente` cobrem também os seguintes aspectos da interface.

| Assunto | O que conferir na tela ou no código |
| --- | --- |
| Cor | Os componentes usam papéis do tema, sem cor literal. O contraste de texto alcança 4.5:1. |
| Layout | O container tem largura máxima. Entre 320 e 1920 px, o documento cabe na horizontal. |
| Movimento | Cada animação tem uma versão parada. |
| Conteúdo | O texto vem de uma fonte identificada, sem material inventado. |
| Estados | Regiões que recebem informação externa tratam carregamento, vazio e erro. |
| Interação | O alvo de toque mede 44 px e o foco fica visível. |

### Histórico em Aprendizados

Quando uma revisão revela um problema que também pode afetar outras telas, registre a data e a origem do achado. A seta liga a entrada ao identificador criado ou alterado na seção correspondente.

```markdown
- 2026-11-24 `@pessoa` A página abre com a promessa em uma frase. → {#v001}
- 2026-11-24 `@revisão` O cartão de preço estourava a largura em 390 px. → {#r001}
```

No segundo registro, a largura de 390 px permite reproduzir o problema do cartão de preço. Se o ajuste ainda aguarda confirmação, use `proposta` como destino. Se for rejeitado, registre `descartado` com o motivo. Para corrigir uma entrada, acrescente outra que cite a anterior. Assim a seção temática mostra a orientação vigente e o histórico preserva sua origem.

## O arquivo de uma rota

O front matter de uma tela liga a rota aos componentes e arquivos que você vai alterar. Para uma entrega com várias telas, crie os viewspecs antes de iniciar a implementação. Use `dependsOn` para indicar que o shell precisa estar pronto antes da listagem ou que o detalhe depende dela.

```markdown
---
schemaVersion: "1.0.0"
scope: view
id: "0001"
slug: landing-page-do-produto
title: Landing page do produto
summary: Página única de venda que leva o visitante a pedir uma demonstração.
status: in_progress
kind: landing-page
surface: site
framework: astro
route: /produto/
createdAt: 2026-11-24T10:00:00-03:00
updatedAt: 2026-11-24T11:30:00-03:00
skills: [designfy-websites, designfy-components, designfy-motion, designfy-responsive, designfy-accessibility, designfy-review]
components: [hero-split, feature-grid, cta-band]
relatedFiles:
  - src/pages/produto.astro
guideRules: [v001, c002, m001, r001]
priority: high
---
```

Neste exemplo, a rota `/produto/` tem tipo `landing-page` e usa os itens indicados em `components`. As especialistas aparecem em `skills` na ordem de execução. Os IDs em `guideRules` remetem às orientações aplicadas diretamente. Quando a tela divergir de uma delas, registre o ID em `deviations` e explique o motivo em Notas.

| Campo | Valores ou uso |
| --- | --- |
| `kind` para páginas | `landing-page`, `home`, `site-page`, `blog-index`, `blog-post`, `docs-page` |
| `kind` para telas de trabalho | `dashboard`, `table`, `form`, `crud`, `detail`, `settings`, `auth` |
| Outro tipo | `other` |
| `surface` | `site` ou `webapp`. O leitor interpreta o valor antigo `system` como `webapp`. |
| `priority` | Prioridade opcional com valor `low`, `medium` ou `high` |
| `dependsOn` | IDs opcionais de telas que precisam estar em `done` |
| `source` | Fonte opcional da especificação |
| `blockedReason`, `archivedReason` | Motivo exigido pelo respectivo estado |
| `captures` | Execuções usadas na revisão visual |

O corpo tem nove seções em ordem fixa. Use a rota e os arquivos do front matter para descrever o que será verificável em cada uma.

| Seção | O que escrever |
| --- | --- |
| Objetivo | Público, ação principal e resultado esperado |
| Conteúdo | Textos, informações e mídias com suas fontes |
| Estrutura | Regiões do topo até o rodapé e fragmento usado em cada uma |
| Estados | Comportamento com conteúdo vazio, em carregamento, com erro, sucesso, acesso negado, resultado parcial ou volume alto |
| Responsivo | Comportamento nas larguras de 390, 820 e 1440 px |
| Movimento | Elemento animado, gatilho, finalidade e versão parada |
| Acessibilidade | Marcos da página, hierarquia de títulos, foco, nomes acessíveis e contraste |
| Checklist | Tarefas com especialista responsável e identificador |
| Notas | Histórico das escolhas e dos impedimentos durante a execução |

Para começar com os títulos corretos, abra `VIEWSPEC.guia.md` ou `VIEWSPEC.tela.md` em `assets/templates/` da skill. Em `assets/examples/`, os arquivos `guia-de-site.md` e `guia-de-sistema.md` ilustram o escopo do projeto. Para consultar a especificação de uma rota, escolha `tela-landing-page.md`, `tela-dashboard.md` ou `tela-artigo.md` conforme a interface que vai montar.

## Vínculo com a tarefa técnica

Use `trackedBy` para apontar a tarefa de outro sistema. Cada vínculo leva o tipo em `system`, o identificador em `id` e um `path` relativo à raiz do projeto. O exemplo liga a tela à especificação de cadastro de clientes.

```yaml
trackedBy:
  - system: specsfy
    id: "0007"
    path: specs/planned/0007-cadastro-de-clientes/spec.md
```

O campo `system` aceita `astrofy`, `specsfy` ou `other`. O arquivo de destino deve existir. Quando uma spec muda de pasta de estado, `designfy viewspec validate` indica o novo caminho para você corrigir o vínculo. A consulta individual e a listagem expõem esses vínculos no CLI e nas ferramentas MCP.

Consulte o bloco *Integrations* em `status` ou `doctor` para reconhecer as convenções disponíveis antes de preencher o vínculo.

```text
Integrations

  astrofy  present  sitespecDir=.sitespec  astrofyDir=.astrofy  dependency=@promovaweb/astrofy
  specsfy  absent  specsDir=specs
```

No exemplo, o leitor encontrou Astrofy. O resultado de Specsfy é `absent`. Com `status --json`, examine `integrations.astrofy` e `integrations.specsfy`. Um caminho ausente aparece como `null`. Pelo MCP, a ferramenta `project_status` oferece a mesma consulta.

### A sitespec do Astrofy

O leitor reconhece Astrofy pela estrutura `.sitespec/<id>-<slug>/SITEPEC.md`, pelo diretório `.astrofy/` ou pela dependência `@promovaweb/astrofy`. Use o documento correspondente à alteração para manter a tarefa técnica e o conteúdo aprovado acessíveis durante a montagem da interface.

| Assunto | Fica com | Arquivo |
| --- | --- | --- |
| Tarefa técnica do site, dependências e comprovação | Astrofy | `.sitespec/<id>-<slug>/SITEPEC.md` |
| Conteúdo aprovado de uma página planejada | Astrofy | `.astrofy/pages/<slug>/page-spec.json` |
| Guia de interface do projeto | Designfy | `VIEWSPEC.md` |
| Especificação da tela e checklist das especialistas | Designfy | `viewspec/<id>-<slug>/VIEWSPEC.md` |
| Rotas, SEO, marcação estruturada, imagens, build e deploy | skills `astrofy-*` | a sitespec |
| Tokens gerados pelo Astrofy | `astrofy-design-system` | `.astrofy/design/design-system.json` |

Na sitespec, registre o caminho relativo do viewspec. No viewspec, aponte a sitespec com `system: astrofy`. Cada ferramenta mantém seu próprio documento. Quando o Astrofy gera os tokens, indique o CSS gerado em `tokensFile` para o `designfy theme check` medir o contraste. Faça a correção no JSON de origem para que ela sobreviva à geração seguinte.

### A spec do Specsfy

A estrutura de estados em `specs/`, a pasta `.specsfy/` e os arquivos `DESIGNSYSTEM.MD` ou `INTERFACE.md` são sinais de Specsfy. Leia a seção Interface da spec antes de abrir o viewspec. Uma fatia marcada com `Interface para pessoas: Não` dispensa a especificação de tela.

| Assunto | Fica com | Arquivo |
| --- | --- | --- |
| O que a fatia entrega, regras de negócio, permissões, tarefas e gates | Specsfy | `specs/<estado>/<NNNN>-<slug>/spec.md` |
| Interface da fatia, na seção Interface da spec | Specsfy | a spec |
| Orientações gerais de interface do produto | Specsfy | `DESIGNSYSTEM.MD` |
| Registro de componentes, blocos e telas | Specsfy | `INTERFACE.md` |
| Guia do Designfy, citando o `DESIGNSYSTEM.MD` | Designfy | `VIEWSPEC.md` |
| Execução da interface, checklist e capturas | Designfy | `viewspec/<id>-<slug>/VIEWSPEC.md` |

Quando os dois documentos divergem, prevalece a spec. Complete nela a definição da fatia antes de levar a alteração ao viewspec. Consulte o `INTERFACE.md` para verificar se já existe um componente com a função necessária. Registre ali uma peça nova na mesma entrega. Quando um item da checklist executa uma tarefa `[CODE]`, cite o ID correspondente da spec.

## Checklist, captura e mudança de estado

Para transformar a especificação em trabalho verificável, descreva cada tarefa no formato GFM. Identifique a especialista que a executa e atribua um ID de quatro caracteres. O trecho da demonstração tem duas tarefas concluídas e duas pendentes.

```markdown
- [x] Hero com conteúdo real `#designfy-websites` {#a1b2}
- [x] Benefícios em três colunas `#designfy-components` {#c3d4}
- [ ] Cascata de entrada com versão parada `#designfy-motion` {#e5f6}
- [ ] Capturas em celular e desktop revisadas e achados resolvidos `#designfy-review` {#z9y8}
```

A caixa `[x]` indica conclusão. A caixa `[ ]` conserva o item aberto. Sem a anotação da especialista, vale a primeira entrada de `skills`. Preserve o `{#id}` mesmo quando revisar a descrição. Um identificador ausente ou repetido invalida o arquivo.

No Plano Founders, a mesma checklist cobriu o comportamento da oferta no celular e a inspeção dos componentes compartilhados em `/planos/martech/`. A captura final permitiu verificar a ausência de rolagem horizontal. Registre a execução em `captures` e altere o campo `status` no Markdown para refletir a etapa alcançada.

| Estado | Significado |
| --- | --- |
| `draft` | viewspec escrito; a execução não começou |
| `in_progress` | execução em andamento |
| `blocked` | parado por algo externo; exige `blockedReason` |
| `done` | checklist completa e revisão com capturas registrada em `captures` |
| `archived` | encerrado sem conclusão; exige `archivedReason` |

O leitor usa o estado explícito. Uma tarefa pendente impede `done` mesmo quando já há uma captura registrada. Para retomar a implementação, consulte os itens abertos e as notas da última revisão.

## Consultas do guia e das telas pelo CLI

Para conferir o arquivo da raiz, use `guide`. Para localizar uma tela pelo título e pelo progresso, consulte `list` e abra o ID com `show`. Os comandos abaixo também permitem conferir o conjunto de arquivos antes da entrega.

```bash
designfy viewspec guide
designfy viewspec list
designfy viewspec show 0001
designfy viewspec progress
designfy viewspec validate
```

A saída de `guide` mostra o front matter e as seções presentes. Os totais por seção e por origem ajudam a localizar propostas que ainda aguardam confirmação.

```text
  Visão geral            1
  Cores                  3
  Tipografia             2
  ...
Rules by origin

  @pessoa   2
  @agente   18
  @revisão  0

Pending proposals

No pending proposals.
```

Na demonstração, aparecem duas orientações de origem `@pessoa` e nenhuma proposta pendente. Para identificar o trabalho que continua aberto, leia a linha da tela na saída de `list`.

```text
  0001  Landing page do produto  |  landing-page  |  in_progress  |  2/4
```

A tela `0001` está em implementação com dois de quatro itens marcados. Use `show 0001` para ler seu front matter e o corpo completo. Ao planejar a próxima tela, consulte o resumo de `progress`.

```text
  draft        0
  in_progress  1
  blocked      0
  done         0
  archived     0
  Checklist    2/4
  Next id      0002
```

O próximo ID livre é `0002`. Para verificar se os arquivos existentes respeitam o contrato, rode `validate`. O retorno `Viewspec validation passed.` vem com código 0. Uma falha de formato localiza o trecho a corrigir.

```text
/tmp/opencode/designfy-demo/VIEWSPEC.md:80 [Aprendizados] Use YYYY-MM-DD, a valid origin, a description and → followed by the learning destination.
```

Abra o arquivo na linha 80 e confira se o registro traz a data no formato `YYYY-MM-DD`, a origem e a descrição do achado. Depois da seta, identifique o destino da alteração conforme o modelo de Aprendizados.

Quando o arquivo da raiz está ausente, `validate` informa `guide: missing` e ainda pode encerrar com 0. Use `viewspec guide` para verificar a presença do guia. Nesse caso, o comando retorna 6. A revisão da interface acontece no navegador, onde a `designfy-review` examina as capturas da rota.
