---
schemaVersion: "1.0.0"
scope: view
id: "0003"
slug: curso-de-marcenaria-basica
title: Curso de marcenaria básica
summary: Página de venda do curso de entrada, para quem nunca fez um móvel e quer saber datas, preço e o que vai construir.
status: in_progress
kind: landing-page
surface: site
framework: astro
route: /cursos/marcenaria-basica/
createdAt: 2026-11-26T09:00:00-03:00
updatedAt: 2026-11-27T11:40:00-03:00
skills: [designfy-websites, designfy-components, designfy-motion, designfy-responsive, designfy-accessibility, designfy-review]
components: [site-header, hero-split, feature-split, steps, pricing-table, testimonial, faq, cta-band, site-footer, background-pattern, reveal]
relatedFiles:
  - src/pages/cursos/marcenaria-basica.astro
  - src/components/CursoCard.astro
guideRules: [v001, c002, c003, f002, m002, m004, t001, t002, t003, d003]
priority: high
dependsOn: ["0001"]
---

## Objetivo

Quem chega viu um anúncio ou uma indicação e quer saber se consegue fazer
o curso sem experiência. A página precisa responder a três perguntas: o
que eu construo, quando é e quanto custa. A ação principal é "Ver turmas
abertas", que leva à seção de turmas.

## Conteúdo

- Título, frase e fotos do hero: `src/content/cursos/marcenaria-basica.md` (existe).
- Para quem é: três perfis, no mesmo arquivo (existe).
- As oito aulas, com o que se faz em cada uma: coleção `aulas` (existe).
- Turmas com data, horário, vagas e preço: `src/data/turmas.json` (existe).
- Depoimentos: dois, com nome, turma e foto, enviados pela escola (existe).
- Perguntas frequentes: sete, no arquivo do curso (existe).
- Vídeo de uma aula: **lacuna**, a escola grava em dezembro. A região entra depois.

## Estrutura

1. Cabeçalho: `site-header` (`designfy:site-header`, já no projeto).
2. Hero: `hero-split` (`designfy:hero-split`), texto à esquerda e foto da bancada à direita, sobre o fundo `grid-fade`.
3. Para quem é: `feature-split` (`designfy:feature-split`), texto à direita.
4. O que você faz em cada aula: `steps` (`designfy:steps`), oito passos na vertical com a foto da peça.
5. Turmas e preço: `pricing-table` (`designfy:pricing-table`) com o cartão próprio `CursoCard` por turma.
6. Depoimentos: `testimonial` (`designfy:testimonial`), dois lado a lado.
7. Perguntas: `faq` (`designfy:faq`).
8. Chamada final: `cta-band` (`designfy:cta-band`) com "Ver turmas abertas".
9. Rodapé: `site-footer` (`designfy:site-footer`, já no projeto).

## Estados

- Turma lotada: o cartão mostra "Lotada" no lugar das vagas e troca o botão por "Avisar da próxima turma".
- Sem turma aberta: a seção mostra a data prevista da próxima e o formulário de aviso; a ação do hero vira "Avisar da próxima turma".
- Formulário de aviso: e-mail obrigatório, validado ao sair do campo; depois do envio, a mensagem "Avisamos você por e-mail quando abrir" substitui o formulário.
- Carregando e erro de página: Não se aplica. A página é estática, gerada no build.

## Responsivo

- Celular (390): hero empilha com o texto primeiro e o botão em largura total; passos em coluna única com a foto acima do texto; turmas em pilha com a mais próxima primeiro; menu em gaveta com "Ver turmas abertas" visível no cabeçalho.
- Tablet (820): hero em duas colunas com a foto menor; turmas em duas colunas.
- Desktop (1440): container de 1200 px; turmas em três colunas; passos com a linha do tempo à esquerda.

## Movimento

- Hero: título, frase e botão sobem 16 px com opacidade, em sequência de 80 ms; a foto entra com escala de 1,04 para 1 em 700 ms.
- Seções: revelação única ao entrar 20% na tela, como manda a regra m002.
- Passos: a linha vertical desenha conforme a rolagem e cada número acende ao chegar.
- Cartões de turma: borda mais forte e subida de 2 px no hover e no foco, em 200 ms.
- Perguntas: abertura com `grid-template-rows` em 250 ms.
- Movimento reduzido: tudo aparece no estado final e a linha dos passos fica desenhada.

## Acessibilidade

- Marcos `header`, `nav`, `main` e `footer`; `h1` com o nome do curso e um `h2` por seção.
- Os oito passos são uma lista ordenada; os números são texto.
- Vagas e "Lotada" têm texto, não só a cor do acento (regra c003).
- Fotos das peças com texto alternativo que descreve a peça; foto da bancada no hero com `alt` vazio.
- Envio do formulário anuncia o resultado numa região de status.

## Checklist

- [x] Estrutura das nove regiões na ordem do argumento `#designfy-websites` {#h3k9}
- [x] Hero com título, frase e ação visíveis em 1280 x 800 `#designfy-websites` {#q7m2}
- [x] Ação principal repetida nas turmas e na chamada final `#designfy-websites` {#b4x8}
- [x] Fragmentos copiados e dependências presentes `#designfy-components` {#c1v5}
- [ ] Cartão de turma com os estados aberta, últimas vagas e lotada `#designfy-components` {#t6n3}
- [ ] Seção sem turma aberta com formulário de aviso `#designfy-websites` {#w2p7}
- [ ] Entrada do hero, revelação das seções e linha dos passos `#designfy-motion` {#m9d4}
- [ ] Celular 390 e tablet 820 sem rolagem horizontal `#designfy-responsive` {#r5j1}
- [ ] Foco visível, ordem de teclado e anúncio do formulário `#designfy-accessibility` {#a8f6}
- [ ] Capturas em celular e desktop revisadas e achados resolvidos `#designfy-review` {#v0e3}

## Notas

- 26/11/2026: a seção de vídeo ficou fora porque a gravação é em dezembro; quando chegar, entra entre os passos e as turmas, com `video-embed`.
- 27/11/2026: a escola pediu a turma mais próxima sempre em primeiro lugar, inclusive no desktop.
