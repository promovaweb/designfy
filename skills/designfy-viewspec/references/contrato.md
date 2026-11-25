# Contrato do VIEWSPEC.md

O viewspec tem dois níveis, os dois em Markdown:

| Arquivo | Alcance | O que guarda |
| --- | --- | --- |
| `VIEWSPEC.md`, na raiz do projeto | o site ou sistema inteiro | o guia de interface: preferências, diretrizes, padrões e aprendizados que valem para todas as telas |
| `viewspec/<id>-<slug>/VIEWSPEC.md` | uma página ou tela | a especificação daquela interface e a checklist da execução |

O guia da raiz vem primeiro: toda tela é escrita e revisada contra ele. A
skill `designfy` lê o guia antes de montar o viewspec de uma tela, e a skill
`designfy-viewspec` mantém os dois. O binário só lê e valida; nenhum command
grava viewspec.

## Guia do projeto: `VIEWSPEC.md` na raiz

O guia segue a ideia do formato aberto
[DESIGN.md](https://github.com/google-labs-code/design.md): um arquivo de
texto, versionado com o código, que registra o sistema visual para pessoas e
agentes. Ele amplia esse formato em três pontos: cobre padrões de tela (não
só tokens), dá um identificador a cada regra e guarda o histórico do que foi
aprendido.

### Princípios

1. **Os valores moram no código.** O arquivo de tokens (`tokensFile`, um
   CSS com variáveis) é a fonte dos valores. O guia nomeia os papéis, explica
   o uso e cita os valores; quando os dois divergem, o arquivo de tokens
   vale e o guia é corrigido na mesma mudança.
2. **Regra curta, com motivo e origem.** Cada regra é uma linha que cabe
   numa conferência: o que fazer, por quê e de onde veio.
3. **Toda regra tem identificador.** O viewspec de uma tela e a revisão
   citam a regra pelo `{#id}`.
4. **O guia aprende.** Preferência dita pela pessoa, escolha feita pelo
   agente e achado de revisão entram em `## Aprendizados` assim que
   aparecem e, quando viram padrão, sobem para a seção do assunto.
5. **Precedência.** O que a pessoa pede na conversa atual vale mais que o
   guia; o guia vale mais que o padrão das skills; uma regra de origem
   `pessoa` só muda com o aceite dela.

### Front matter

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `schemaVersion` | `"1.0.0"` | Sim | Versão do contrato. |
| `scope` | `project` | Sim | Diferencia o guia do viewspec de uma tela. |
| `name` | string | Sim | Nome do site ou sistema. |
| `description` | string | Sim | Uma frase sobre o produto e quem usa. |
| `surfaces` | lista | Sim | `site`, `system` ou os dois. |
| `frameworks` | lista | Sim | `astro`, `react`, `react-vite`, `next` ou `other`. |
| `tokensFile` | string | Sim | Caminho do CSS de tokens, fonte dos valores. |
| `themes` | lista | Sim | `light`, `dark` ou os dois. |
| `createdAt` | date-time | Sim | Criação. |
| `updatedAt` | date-time | Sim | Última edição. |

### Seções

Catorze seções fixas, nesta ordem e com estes títulos. As dez primeiras
acompanham a ordem do DESIGN.md. Seção sem conteúdo fica com
`Não se aplica.` e o motivo.

| Seção | Conteúdo |
| --- | --- |
| `## Visão geral` | personalidade, público, densidade (arejado ou compacto) e as três palavras que a interface precisa transmitir |
| `## Cores` | papéis de cor, cor base e harmonia da roda de cores, pares de texto e fundo com o contraste medido, uso do acento |
| `## Tipografia` | famílias, escala, pesos, medida da linha, números tabulares, regra de títulos |
| `## Layout` | container, grade, escala de espaçamento, ritmo vertical entre seções, alinhamento |
| `## Fundos e profundidade` | fundos por tipo de seção, padrões permitidos, sombras, bordas e camadas |
| `## Formas` | raios, espessura de traço, estilo dos ícones e das imagens |
| `## Movimento` | caráter, durações, curvas, o que se move em cada tipo de tela e a versão parada |
| `## Voz e conteúdo` | tom dos textos de interface, rótulos de ação, mensagens de erro e de vazio, formato de data, número e moeda |
| `## Componentes` | componentes adotados, de onde vêm (Designfy, shadcn, ReUI, próprio), variações permitidas e o que não criar de novo |
| `## Padrões de tela` | como este projeto resolve cada tipo de tela: hero, seção, artigo, tabela, formulário, dashboard, CRUD, configurações, vazio, erro |
| `## Responsivo` | pontos de quebra, o que muda em cada faixa, alvos de toque, navegação no celular |
| `## Acessibilidade` | nível adotado, foco, teclado, leitor de tela e as conferências obrigatórias |
| `## Faça e não faça` | pares curtos do que repetir e do que evitar, com exemplo real do projeto |
| `## Aprendizados` | registro datado do que a pessoa informou, do que o agente escolheu e do que a revisão achou |

Dentro de uma seção, valores podem aparecer em blocos `yaml` com as chaves
do DESIGN.md (`colors`, `typography`, `rounded`, `spacing`, `motion`,
`components`), para quem exporta o guia com as ferramentas daquele formato.
O binário não lê esses blocos.

### Regras

Uma regra é um item de lista com origem e identificador no fim:

```markdown
- Ação principal de cada tela usa o botão `primary`; só uma por tela, para a pessoa saber onde clicar. `@pessoa` {#c014}
- Tabelas com mais de seis colunas viram cartões abaixo de 640 px. `@agente` {#t003}
```

- `{#id}` é obrigatório nas regras: uma letra e três dígitos, únicos no
  arquivo. A letra segue a seção (`v` visão, `c` cores, `y` tipografia,
  `l` layout, `f` fundos, `s` formas, `m` movimento, `w` voz, `k`
  componentes, `t` padrões de tela, `r` responsivo, `a` acessibilidade,
  `d` faça e não faça).
- A origem é `@pessoa` (dito por quem responde pelo projeto), `@agente`
  (escolhido pelo agente e ainda não contestado) ou `@revisão` (achado em
  captura ou auditoria).
- Parágrafos e itens sem `{#id}` são contexto; não contam como regra.

### Aprendizados

Cada entrada tem data, origem, o que foi aprendido e o destino:

```markdown
- 2026-11-24 `@pessoa` Toda tela tem algum movimento; nada entra parado. → {#m001}
- 2026-11-25 `@revisão` O cartão de plano estourava a largura em 390 px. → {#r007}
- 2026-11-26 `@agente` Gráfico de pizza trocado por barras no dashboard: a comparação ficou legível. → proposta
```

O destino é o `{#id}` da regra criada ou alterada, `proposta` enquanto a
pessoa não confirmou, ou `descartado` com o motivo. Entrada nunca é
apagada: uma regra que muda ganha entrada nova que cita a anterior.

### Leitura pelo binário

`designfy viewspec guide` mostra o front matter, as seções presentes, a
contagem de regras por seção e por origem e os aprendizados ainda em
`proposta`. `designfy viewspec validate` confere também o guia: front
matter, ordem das seções, `{#id}` no formato e sem repetição, origem em toda
regra e destino em toda entrada de `## Aprendizados`. Projeto sem
`VIEWSPEC.md` na raiz recebe o aviso `guide: missing` e a saída continua 0.

## Viewspec de uma tela

O viewspec de uma tela é a especificação de uma interface: uma página de
site, uma landing page, a listagem ou o artigo de um blog, ou uma tela de
sistema como dashboard, tabela, formulário, CRUD e configurações. Cada um é
um diretório com um único arquivo `VIEWSPEC.md`, que uma pessoa edita no
editor e que `designfy viewspec list` e a aba Viewspecs da TUI leem do mesmo
jeito.

### Estrutura de diretórios

```text
viewspec/
  0001-landing-page-do-produto/
    VIEWSPEC.md
  0002-dashboard-de-vendas/
    VIEWSPEC.md
```

A pasta `viewspec/` fica na raiz do projeto, visível. O caminho vem de
`paths.viewspec` em `designfy.json`. O nome do diretório é `<id>-<slug>`,
com `id` e `slug` repetidos no front matter. `id` é sequencial, com quatro
dígitos (`0001`, `0002`). `designfy viewspec progress` devolve o próximo `id`
livre em `nextId`. `slug` é kebab-case e não muda depois de criado.

### Front matter

O arquivo abre com front matter YAML entre linhas `---`. O parser aceita
escalares, listas em linha (`[a, b]`) e listas em bloco (`- a`). Campo
desconhecido, enum inválido ou tipo errado recusam a leitura do arquivo.

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `schemaVersion` | `"1.0.0"` | Sim | Versão do contrato. |
| `scope` | `view` | Sim | Diferencia o viewspec de uma tela do guia do projeto. |
| `id` | string `^[0-9]{4}$` | Sim | Igual ao prefixo do diretório. |
| `slug` | string kebab-case | Sim | Igual ao sufixo do diretório. |
| `title` | string | Sim | Nome curto da página ou tela. |
| `summary` | string | Sim | Uma frase, usada nas listagens. |
| `status` | enum | Sim | `draft`, `in_progress`, `blocked`, `done` ou `archived`. |
| `kind` | enum | Sim | Tipo de interface, da tabela abaixo. |
| `surface` | enum | Sim | `site` ou `system`. |
| `framework` | enum | Sim | `astro`, `react`, `react-vite`, `next` ou `other`. |
| `route` | string | Sim | Rota ou caminho da tela, como `/precos/` ou `/app/pedidos`. |
| `createdAt` | date-time | Sim | Criação; não muda depois. |
| `updatedAt` | date-time | Sim | Atualizada a cada edição do arquivo. |
| `skills` | lista de `designfy*` | Sim | Especialistas acionadas, na ordem de execução. |
| `components` | lista de string | Sim | Componentes do registro ou do projeto usados na tela. Pode ser vazia. |
| `relatedFiles` | lista de string | Sim | Arquivos do projeto criados ou alterados. Pode ser vazia antes da execução. |
| `priority` | enum | Não | `low`, `medium` ou `high`. Padrão `medium`. |
| `dependsOn` | lista de `id` | Não | Viewspecs que precisam estar `done` antes. |
| `source` | string | Não | Origem do pedido. |
| `blockedReason` | string | Só com `status: blocked` | O que impede o trabalho. |
| `archivedReason` | string | Só com `status: archived` | Por que foi encerrado sem conclusão. |
| `captures` | lista de string | Não | Execuções de `designfy capture run` usadas na revisão. |
| `guideRules` | lista de string | Não | Regras do guia que esta tela aplica de forma direta, pelo identificador (`c014`, `t003`). |
| `deviations` | lista de string | Não | Regras do guia que esta tela não segue; cada uma tem o motivo em `## Notas`. |

Valores de `kind`:

| `kind` | `surface` | Interface |
| --- | --- | --- |
| `landing-page` | `site` | página única de venda ou captura |
| `home` | `site` | página inicial de site ou portal |
| `site-page` | `site` | página institucional, de produto, preço, contato |
| `blog-index` | `site` | listagem de artigos |
| `blog-post` | `site` | artigo ou conteúdo longo |
| `docs-page` | `site` | página de documentação |
| `dashboard` | `system` | visão geral com indicadores e gráficos |
| `table` | `system` | listagem de dados com filtro e ação |
| `form` | `system` | formulário de criação, edição ou fluxo em etapas |
| `crud` | `system` | conjunto de lista, detalhe, criação e edição de um recurso |
| `detail` | `system` | detalhe de um registro |
| `settings` | `system` | página de configurações |
| `auth` | `system` | entrada, cadastro e recuperação de acesso |
| `other` | os dois | o que não couber nos anteriores, descrito no corpo |

As datas aceitam string entre aspas ou o escalar ISO sem aspas.

### Corpo

Depois do front matter, o corpo tem nove seções fixas, nesta ordem e com
estes títulos. O leitor procura os títulos exatos. Uma seção sem conteúdo
aplicável fica com a frase `Não se aplica.` e o motivo.

#### `## Objetivo`

Quem usa a tela, o que precisa conseguir e qual é a ação principal. Uma
tela tem uma ação principal.

#### `## Conteúdo`

O que aparece: textos, dados, imagens e vídeos reais ou a origem de cada um
(arquivo, coleção, endpoint). Sem texto de exemplo inventado. Em tela de
sistema, as entidades, os campos e os volumes esperados.

#### `## Estrutura`

As regiões da tela de cima para baixo, com o componente de cada uma e a
ordem de leitura. Em site, as seções; em sistema, shell, cabeçalho da
página, área principal e painéis.

#### `## Estados`

Vazio, carregando, erro, sucesso, sem permissão, parcial e lotado, para a
tela e para cada região que carrega dados. Em formulário, a validação de
cada campo e o que acontece depois de enviar.

#### `## Responsivo`

O comportamento em celular (390), tablet (820) e desktop (1440): o que
empilha, o que some, o que vira gaveta, a ordem no celular e as áreas de
toque.

#### `## Movimento`

O que se move, quando e por quê: entrada, rolagem, hover, foco e troca de
estado, com a versão parada para `prefers-reduced-motion`.

#### `## Acessibilidade`

Marcos, hierarquia de títulos, ordem de foco, nomes acessíveis, contraste
dos pares de cor usados e avisos para leitor de tela.

#### `## Checklist`

Lista de tarefas no formato GFM, uma por linha:

```markdown
- [ ] Texto da tarefa `#designfy-components` {#a3f2}
- [x] Tarefa concluída `#designfy-review` {#9c01}
```

- `[ ]` é pendente e `[x]` é concluído.
- A anotação `` `#designfy-<skill>` `` diz qual especialista executa o
  item. É opcional; item sem anotação pertence à primeira skill de `skills`.
- `{#id}` é obrigatório: quatro caracteres `[a-z0-9]`, criados uma vez e
  mantidos. Item sem `{#id}` ou com `{#id}` repetido recusa o arquivo.
- O progresso é `concluídos / total` desta seção.

#### `## Notas`

Registro cronológico do que foi escolhido durante a execução, do que
impediu o trabalho e de por que a checklist mudou. A seção existe mesmo
vazia.

### Ciclo de vida do `status`

| Estado | Significado |
| --- | --- |
| `draft` | Viewspec escrito; a execução não começou. |
| `in_progress` | Execução em andamento. |
| `blocked` | Parado por algo externo; exige `blockedReason`. |
| `done` | Todos os itens da checklist marcados e a revisão com capturas registrada em `captures`. Item pendente recusa `done`. |
| `archived` | Encerrado sem conclusão; exige `archivedReason`. |

Quem edita o arquivo muda o estado. O leitor não infere estado.

### Exemplo

```markdown
---
schemaVersion: "1.0.0"
scope: view
id: "0002"
slug: dashboard-de-vendas
title: Dashboard de vendas
summary: Visão diária de receita, pedidos e conversão para o time comercial.
status: in_progress
kind: dashboard
surface: system
framework: react-vite
route: /app/vendas
createdAt: 2026-11-24T15:00:00-03:00
updatedAt: 2026-11-24T16:20:00-03:00
skills: [designfy-systems, designfy-components, designfy-motion, designfy-responsive, designfy-accessibility, designfy-review]
components: [app-shell, stat-card, data-table, chart-area]
relatedFiles:
  - src/pages/app/vendas.tsx
priority: high
---

## Objetivo

A gerente comercial abre a tela de manhã para saber se a meta do dia está
no ritmo. A ação principal é abrir a lista de pedidos em atraso.

## Conteúdo

Receita, pedidos, ticket médio e conversão do dia e do mês, vindos de
`GET /api/sales/summary`. Tabela com os 20 pedidos mais recentes.

## Estrutura

1. Cabeçalho da página com título, período e a ação "Pedidos em atraso".
2. Quatro contadores em linha.
3. Gráfico de área da receita no período.
4. Tabela dos pedidos recentes.

## Estados

Carregando: esqueleto com a forma de cada região. Vazio: período sem
pedidos, com a ação de mudar o período. Erro: aviso na região que falhou,
com tentar de novo; as outras regiões continuam.

## Responsivo

Celular: contadores em duas colunas, gráfico com altura fixa de 220 px,
tabela como lista de cartões. Tablet: contadores em duas colunas e tabela
com rolagem horizontal contida.

## Movimento

Os contadores contam do valor anterior ao novo em 600 ms. O gráfico desenha
a área uma vez, na primeira carga. Com movimento reduzido, valores e
gráfico aparecem prontos.

## Acessibilidade

Um `h1` com o título, `h2` por região. O gráfico tem resumo em texto e a
tabela equivalente acessível por um botão.

## Checklist

- [x] Shell e cabeçalho da página `#designfy-systems` {#k2a9}
- [ ] Contadores com o estado de carregamento `#designfy-components` {#p0x4}
- [ ] Contagem animada com versão parada `#designfy-motion` {#m7d1}
- [ ] Tabela como cartões no celular `#designfy-responsive` {#r3c8}
- [ ] Resumo em texto do gráfico `#designfy-accessibility` {#a1f5}
- [ ] Capturas em celular e desktop revisadas `#designfy-review` {#v9e2}

## Notas

- 24/11/2026: período padrão definido como "hoje", a pedido do comercial.
```

## Limites

- O binário não cria nem altera viewspec.
- `viewspec validate` confere o contrato, não a qualidade da interface: essa
  conferência é da skill `designfy-review`, com as capturas.
