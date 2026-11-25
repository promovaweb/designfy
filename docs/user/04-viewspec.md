# Capítulo 4: Viewspec

Você abre o projeto pela manhã e roda `designfy viewspec progress`. A tela
responde que existe um viewspec em `in_progress`, com `2/4` itens marcados, e
que o próximo `id` livre é `0002`. O agente que retoma o trabalho lê o
`VIEWSPEC.md` da tela, vê a checklist e continua do item seguinte. Esse é o
efeito do viewspec, a especificação de interface do Designfy.

## Dois níveis de arquivo

O viewspec tem dois níveis, os dois em Markdown e os dois versionados com o
código.

| Arquivo | Alcance | O que guarda |
| --- | --- | --- |
| `VIEWSPEC.md`, na raiz | o site ou sistema inteiro | o guia de interface: preferências, diretrizes, padrões e aprendizados |
| `viewspec/<id>-<slug>/VIEWSPEC.md` | uma página ou tela | a especificação daquela interface e a checklist da execução |

Toda tela é escrita e revisada contra o guia da raiz. A skill `designfy` lê o
guia antes de montar o viewspec da tela, a `designfy-viewspec` mantém os dois e
o binário só lê e valida. Nenhum command grava viewspec.

A pasta `viewspec/` fica visível na raiz. O caminho vem de `paths.viewspec` no
`designfy.json`. O nome do diretório é `<id>-<slug>`, com o `id` de quatro
dígitos e o `slug` em kebab-case repetidos no front matter.

## O guia do projeto

O guia segue a ideia do formato aberto
[DESIGN.md](https://github.com/google-labs-code/design.md): um arquivo de texto
que registra o sistema visual para pessoas e agentes. O Designfy acrescenta
padrões de tela, um identificador por regra e o histórico do que foi aprendido.

O front matter declara o escopo, o nome, as superfícies, os frameworks, o
arquivo de tokens e os temas:

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

Depois vêm catorze seções fixas, nesta ordem: Visão geral, Cores, Tipografia,
Layout, Fundos e profundidade, Formas, Movimento, Voz e conteúdo, Componentes,
Padrões de tela, Responsivo, Acessibilidade, Faça e não faça e Aprendizados. Uma
seção sem conteúdo aplicável fica com `Não se aplica.` e o motivo.

## Regras com origem e identificador

Uma regra é um item de lista que cabe numa conferência: o que fazer, por quê e
de onde veio. O identificador e a origem ficam no fim da linha:

```markdown
- Texto e fundo com contraste de 4.5:1 ou mais, conferido com `designfy theme check`. `@agente` {#c002}
- A página abre com a promessa em uma frase, sem slogan acima do título. `@pessoa` {#v001}
```

O `{#id}` é obrigatório e único no arquivo. Uma letra e três dígitos, com a
letra seguindo a seção:

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

A origem é `@pessoa` (dita por quem responde pelo projeto), `@agente`
(escolhida pelo agente e ainda não contestada) ou `@revisão` (achado em captura
ou auditoria). Parágrafo ou item sem `{#id}` é contexto, não regra. Uma regra
`@pessoa` só muda com o aceite dela; uma `@agente` pode ser revista, com entrada
nova em Aprendizados.

## Aprendizados

Aprendizados guarda o histórico com data, origem, o que foi aprendido e o
destino: o `{#id}` da regra criada ou alterada, `proposta` enquanto a pessoa não
confirmou, ou `descartado` com o motivo.

```markdown
- 2026-11-24 `@pessoa` A página abre com a promessa em uma frase. → {#v001}
- 2026-11-24 `@revisão` O cartão de preço estourava a largura em 390 px. → {#r001}
```

Entrada nunca é apagada: a mudança ganha entrada nova que cita a anterior.
Quando um aprendizado vira padrão, ele sobe para a seção do assunto e recebe o
identificador.

## O viewspec de uma tela

O arquivo de uma tela abre com front matter e nove seções fixas. O exemplo:

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

`kind` é o tipo de interface: `landing-page`, `home`, `site-page`, `blog-index`,
`blog-post`, `docs-page`, `dashboard`, `table`, `form`, `crud`, `detail`,
`settings`, `auth` ou `other`. `surface` é `site` ou `system`. `skills` lista as
especialistas na ordem de execução. `guideRules` registra as regras do guia que
a tela aplica de forma direta e `deviations` registra as que ela não segue, com
o motivo em Notas.

As nove seções do corpo são Objetivo (quem usa, o que precisa conseguir e a ação
principal), Conteúdo (o que aparece e a origem de cada texto, dado e mídia),
Estrutura (as regiões de cima para baixo, com o fragmento de cada uma), Estados
(vazio, carregando, erro, sucesso, sem permissão, parcial e lotado), Responsivo
(o comportamento em 390, 820 e 1440 px), Movimento (o que se move, quando e por
quê, com a versão parada), Acessibilidade (marcos, títulos, foco, nomes e
contraste), Checklist (as tarefas, com dona e identificador) e Notas (o registro
cronológico das escolhas e dos impedimentos).

## A checklist

Cada item é uma tarefa GFM com a especialista e um identificador de quatro
caracteres:

```markdown
- [x] Hero com conteúdo real `#designfy-websites` {#a1b2}
- [x] Benefícios em três colunas `#designfy-components` {#c3d4}
- [ ] Cascata de entrada com versão parada `#designfy-motion` {#e5f6}
- [ ] Capturas em celular e desktop revisadas e achados resolvidos `#designfy-review` {#z9y8}
```

`[ ]` é pendente e `[x]` é concluído. A anotação `` `#designfy-<skill>` `` diz
qual especialista executa o item; sem anotação, o item pertence à primeira skill
de `skills`. O `{#id}` é criado uma vez e mantido. Item sem `{#id}` ou com
`{#id}` repetido recusa o arquivo.

## O ciclo do status

| Estado | Significado |
| --- | --- |
| `draft` | viewspec escrito; a execução não começou |
| `in_progress` | execução em andamento |
| `blocked` | parado por algo externo; exige `blockedReason` |
| `done` | checklist completa e revisão com capturas registrada em `captures` |
| `archived` | encerrado sem conclusão; exige `archivedReason` |

Quem edita o arquivo muda o estado. O leitor não infere estado. Item pendente
recusa `done`.

## Ler e validar

```bash
designfy viewspec guide
designfy viewspec list
designfy viewspec show 0001
designfy viewspec progress
designfy viewspec validate
```

O `guide` mostra o front matter, as seções presentes, a contagem de regras por
seção e por origem e as propostas pendentes:

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

O `list` mostra uma linha por tela, com `id`, título, `kind`, `status` e
progresso:

```text
  0001  Landing page do produto  |  landing-page  |  in_progress  |  2/4
```

O `progress` resume por estado e devolve o próximo `id`:

```text
  draft        0
  in_progress  1
  blocked      0
  done         0
  archived     0
  Checklist    2/4
  Next id      0002
```

O `show <id>` imprime o front matter e o corpo inteiro. O `validate` confere o
contrato dos dois níveis e, quando está tudo certo, responde
`Viewspec validation passed.` com exit code 0. Um arquivo inválido aparece com
caminho e linha:

```text
/tmp/opencode/designfy-demo/VIEWSPEC.md:80 [Aprendizados] Use YYYY-MM-DD, a valid origin, a description and → followed by the learning destination.
```

Sem `VIEWSPEC.md` na raiz, o `validate` mostra `guide: missing` e continua com
exit code 0; o `viewspec guide` para com exit code 6. A qualidade da interface
fica com a `designfy-review`, com as capturas na mão.

## Conferir

- O `VIEWSPEC.md` da raiz tem as catorze seções e regras com `{#id}`.
- `designfy viewspec validate` termina com exit code 0.
- `designfy viewspec progress` devolve o próximo `id` livre.
- O viewspec da tela tem as nove seções e a checklist com dona e `{#id}`.
- O `status` da tela reflete o trabalho real, com `captures` quando fecha.
