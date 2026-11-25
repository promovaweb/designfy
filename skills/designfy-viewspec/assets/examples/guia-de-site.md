---
schemaVersion: "1.0.0"
scope: project
name: Oficina Tangará
description: Site da escola de marcenaria Oficina Tangará, para quem quer se matricular num curso presencial em Curitiba.
surfaces: [site]
frameworks: [astro]
tokensFile: src/styles/designfy-theme.css
themes: [light, dark]
createdAt: 2026-11-24T10:00:00-03:00
updatedAt: 2026-11-28T17:30:00-03:00
---

## Visão geral

Quem chega é adulto que nunca fez um móvel e quer saber se o curso cabe na
rotina e no bolso. A interface é arejada e precisa parecer artesanal,
direta e acolhedora.

- Cada página leva a uma ação: ver as turmas abertas ou falar com a escola. `@pessoa` {#v001}
- Fotos são das aulas e das peças dos alunos; nada de banco de imagens. `@pessoa` {#v002}

## Cores

A cor base é um verde de folha, com acento em harmonia complementar
dividida (âmbar de madeira). Os valores ficam em
`src/styles/designfy-theme.css`.

- Cores saem dos papéis do tema; nenhum componente leva cor literal. `@agente` {#c001}
- `primary` aparece só em botões de matrícula, links e no item ativo do menu. `@pessoa` {#c002}
- `accent` marca preço e vagas restantes, com texto sempre ao lado. `@agente` {#c003}
- `foreground` sobre `background` mede 14,8:1 no claro e 13,1:1 no escuro; `muted-foreground` sobre `background` mede 5,2:1. `@revisão` {#c004}

## Tipografia

- `font-heading` nos títulos e `font-sans` no texto e na interface. `@agente` {#y001}
- Um `h1` por página, com o nome do curso ou da página; seções em `h2`. `@agente` {#y002}
- Texto corrido com medida de 60 a 70 caracteres e altura de linha de 1,6. `@agente` {#y003}
- Preço e carga horária em números tabulares. `@revisão` {#y004}

## Layout

- Container de 1200 px centralizado; as margens crescem acima disso. `@agente` {#l001}
- Entre seções, 96 px no desktop e 56 px no celular, sempre pela escala do tema. `@agente` {#l002}
- Seções alternam texto à esquerda e à direita; nunca duas iguais em sequência. `@pessoa` {#l003}

## Fundos e profundidade

- Página em `background`; a cada três seções, uma faixa em `muted`. `@agente` {#f001}
- O hero e a chamada final usam o fundo `grid-fade` do `designfy-backgrounds`, com máscara para o texto manter o contraste. `@agente` {#f002}
- Cartões têm borda `border` e nenhuma sombra; sombra só em menu e diálogo. `@agente` {#f003}

## Formas

- Raio `rounded-lg` em cartões e imagens, `rounded-md` em botões e campos. `@agente` {#s001}
- Ícones Lucide com traço de 1,5 px, sempre ao lado de texto. `@agente` {#s002}

## Movimento

O caráter é presente e calmo: nada pula, tudo chega.

- Toda página tem movimento com função; todo movimento tem versão parada em `prefers-reduced-motion`. `@pessoa` {#m001}
- Seções entram uma vez, com opacidade e 16 px de subida em 500 ms. `@agente` {#m002}
- Animação só com `transform` e `opacity`; nunca `transition: all`. `@agente` {#m003}
- A faixa de fotos das aulas rola devagar e para no hover e no foco. `@pessoa` {#m004}

## Voz e conteúdo

- Botões dizem a ação com o verbo: "Ver turmas abertas", "Falar com a escola". `@pessoa` {#w001}
- Datas por extenso ("12 de março"), preço em reais com parcelamento na mesma linha. `@pessoa` {#w002}
- Erro de formulário diz o que aconteceu e o que fazer, sem ponto de exclamação. `@agente` {#w003}

## Componentes

- Cabeçalho e rodapé são os do registro do Designfy (`site-header` e `site-footer`), iguais em todas as páginas. `@agente` {#k001}
- Uma ação principal por página, com o botão `primary`; a secundária é um link de texto. `@agente` {#k002}
- Cartão de curso é o componente próprio `CursoCard`, com foto, nome, duração, próxima turma e preço. `@pessoa` {#k003}

## Padrões de tela

- Hero dividido: texto à esquerda e foto da oficina à direita; título, uma frase e a ação cabem em 1280 x 800. `@agente` {#t001}
- Página de curso segue a ordem: hero, para quem é, o que você faz em cada aula, turmas e preço, perguntas, chamada final. `@pessoa` {#t002}
- Depoimento só com nome, turma e foto do aluno; sem isso a seção sai. `@pessoa` {#t003}
- Formulário de contato confirma na própria página e diz o prazo de resposta. `@agente` {#t004}

## Responsivo

- Nenhuma página rola na horizontal entre 320 e 1920 px. `@agente` {#r001}
- No celular, o hero empilha com o texto primeiro e a ação em largura total. `@agente` {#r002}
- Menu vira gaveta abaixo de 1024 px; "Ver turmas abertas" continua no cabeçalho. `@revisão` {#r003}
- Alvo de toque de 44 por 44 px. `@agente` {#r004}

## Acessibilidade

- WCAG 2.2 AA; todo elemento interativo tem foco visível, sem atraso. `@agente` {#a001}
- Toda foto com informação tem texto alternativo; foto de ambiente tem `alt` vazio. `@agente` {#a002}
- Link de pular para o conteúdo é o primeiro elemento focável. `@revisão` {#a003}

## Faça e não faça

- Mostre a próxima turma com data e vagas. Evite "em breve" sem data. `@pessoa` {#d001}
- Use fotos das peças dos alunos. Evite ilustração genérica de ferramenta. `@pessoa` {#d002}
- Diga o preço na página do curso. Evite esconder o valor atrás de um formulário. `@pessoa` {#d003}

## Aprendizados

- 2026-11-24 `@pessoa` O site existe para matricular: toda página leva às turmas ou ao contato. → {#v001}
- 2026-11-24 `@pessoa` O preço aparece sempre, com parcelamento. → {#d003}
- 2026-11-25 `@agente` Faixa em `muted` a cada três seções deu ritmo sem cartões. → {#f001}
- 2026-11-26 `@revisão` Em 390 px o botão de turmas saía do cabeçalho quando o menu virava gaveta. → {#r003}
- 2026-11-27 `@pessoa` A faixa de fotos pode se mover, desde que pare quando o mouse está em cima. → {#m004}
- 2026-11-28 `@agente` Contador de alunos formados no hero da home. → proposta
