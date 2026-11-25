---
schemaVersion: "1.0.0"
scope: view
id: "0007"
slug: artigo-do-blog
title: Artigo do blog
summary: Modelo de página de artigo da Oficina Tangará, para quem chega pela busca querendo aprender uma técnica.
status: draft
kind: blog-post
surface: site
framework: astro
route: /blog/[slug]/
createdAt: 2026-11-28T14:00:00-03:00
updatedAt: 2026-11-28T14:00:00-03:00
skills: [designfy-content, designfy-components, designfy-motion, designfy-responsive, designfy-accessibility, designfy-review]
components: [site-header, breadcrumbs, article-header, prose, table-of-contents, reading-progress, figure, video-embed, callout, author-box, post-card, cta-band, site-footer]
relatedFiles: []
guideRules: [v001, y002, y003, m002, a002]
priority: medium
dependsOn: ["0001"]
---

## Objetivo

Quem chega veio da busca com uma dúvida prática ("como fazer encaixe rabo
de andorinha") e lê no celular. A página precisa entregar a resposta com
leitura confortável e, no fim, apresentar o curso ligado ao tema. A ação
principal é "Ver o curso de marcenaria básica".

## Conteúdo

- Título, resumo, data, autor, capa e corpo: coleção `blog` em Markdown (existe).
- Tempo de leitura: calculado no build a partir do corpo.
- Autor: `src/data/autores.json`, com nome, foto e uma frase (existe).
- Vídeos: endereços do YouTube no corpo do artigo (existem em 4 de 12 artigos).
- Artigos relacionados: os três mais recentes da mesma categoria.
- Curso ligado ao tema: campo `curso` no front matter do artigo (existe em 9 de 12; nos outros, a chamada final aponta para a página de cursos).

## Estrutura

1. Cabeçalho: `site-header` (`designfy:site-header`).
2. Trilha: `breadcrumbs` (`shadcn:breadcrumb`), Blog e categoria.
3. Cabeçalho do artigo: `article-header` (`designfy:article-header`), alinhado à esquerda, capa abaixo.
4. Corpo: `prose` (`designfy:prose`) na coluna central, com `figure`, `video-embed` e `callout` dentro do texto.
5. Índice: `table-of-contents` (`designfy:table-of-contents`) na coluna da direita.
6. Autoria: `author-box` (`designfy:author-box`).
7. Relacionados: três `post-card` (`designfy:post-card`).
8. Chamada final: `cta-band` (`designfy:cta-band`) com o curso do tema.
9. Rodapé: `site-footer` (`designfy:site-footer`).

## Estados

- Artigo sem capa: o cabeçalho do artigo fica só com texto e o corpo sobe.
- Artigo sem curso ligado: a chamada final usa o texto e o destino da página de cursos.
- Menos de três relacionados: a seção mostra os que houver; com nenhum, ela não aparece.
- Vídeo: fachada com a capa e o botão; o player só carrega depois do clique; sem rede, a fachada continua com o link para o YouTube.
- Carregando e erro: Não se aplica. A página é estática, gerada no build.

## Responsivo

- Celular (390): uma coluna; o índice vira um bloco recolhido logo abaixo do cabeçalho do artigo; tabelas e blocos de código rolam dentro da própria caixa; relacionados em pilha.
- Tablet (820): uma coluna com medida de 65 caracteres; índice recolhido.
- Desktop (1440): corpo com medida de 68 caracteres e índice fixo à direita a partir de 1280 px.

## Movimento

- Barra de progresso de leitura no topo, ligada à rolagem.
- Marcador do índice desliza até a seção atual.
- Capa entra com opacidade e escala de 1,03 para 1 em 600 ms.
- Relacionados e chamada final entram com a revelação da regra m002.
- Cartões relacionados: a capa escala para 1,03 dentro da moldura no hover.
- Movimento reduzido: sem barra animada, marcador troca sem deslizar, tudo visível.

## Acessibilidade

- `h1` com o título; o corpo começa em `h2` e não salta nível.
- Índice dentro de `nav` com rótulo, e `aria-current` no item atual.
- Data em `time` com `datetime`.
- Imagens do corpo com texto alternativo vindo do Markdown; capa com `alt` vazio quando repete o título.
- Fachada do vídeo é um botão com o título do vídeo no nome.
- Links do corpo sublinhados, não só coloridos.

## Checklist

- [ ] Cabeçalho do artigo com título, resumo, autoria, data e tempo de leitura `#designfy-content` {#n4c7}
- [ ] Corpo em prose com medida de 60 a 75 caracteres `#designfy-content` {#p8s1}
- [ ] Índice com a seção atual marcada e versão recolhida `#designfy-content` {#i2w9}
- [ ] Tabelas e blocos de código com rolagem própria `#designfy-content` {#x6t3}
- [ ] Vídeos com fachada `#designfy-content` {#y5h0}
- [ ] Fragmentos copiados e dependências presentes `#designfy-components` {#k7r2}
- [ ] Barra de progresso, marcador do índice e revelações `#designfy-motion` {#g3m8}
- [ ] Celular 390 e tablet 820 sem rolagem horizontal `#designfy-responsive` {#u1q4}
- [ ] Níveis de título, links distinguíveis e nomes acessíveis `#designfy-accessibility` {#d9b5}
- [ ] Capturas de um artigo curto e de um longo, em celular e desktop `#designfy-review` {#j0z6}

## Notas

