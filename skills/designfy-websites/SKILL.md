---
name: designfy-websites
description: Especialista em sites e landing pages do Designfy. Define a arquitetura da página pelo argumento, compõe hero, seções de recurso, prova, preço, perguntas e chamada final, cabeçalho, navegação e rodapé, com conteúdo real, ritmo entre seções, movimento do hero ao rodapé e sem os vícios de página gerada. Use quando a pessoa pedir uma landing page, página de venda, home, página de produto, preços, sobre, contato, um hero, uma seção de site, cabeçalho ou rodapé, redesenho de página pública em Astro ou React, ou quando a skill designfy chamar esta etapa para um viewspec de site.
---

# Sites e landing pages

Uma página pública tem um trabalho: levar quem chegou a uma ação. Esta
skill monta a página como um argumento, em telas de uma ideia cada, com as
peças do catálogo de interface e o conteúdo real do projeto.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Ordenar a página pelo argumento, por tipo de página | [references/arquitetura-da-pagina.md](references/arquitetura-da-pagina.md) |
| Compor o hero e acertar a primeira dobra | [references/hero.md](references/hero.md) |
| Escolher e compor cada seção | [references/secoes.md](references/secoes.md) |
| Cabeçalho, menu do celular e rodapé | [references/navegacao-e-rodape.md](references/navegacao-e-rodape.md) |
| Ações, formulários, prova e preço | [references/conversao.md](references/conversao.md) |
| Títulos, orçamento de palavras e fatos que faltam | [references/texto-da-pagina.md](references/texto-da-pagina.md) |
| Imagens, capturas do produto e vídeo | [references/imagens-e-midia.md](references/imagens-e-midia.md) |
| O que faz uma página parecer gerada, e a correção | [references/vicios-de-pagina-gerada.md](references/vicios-de-pagina-gerada.md) |
| Conferência antes de entregar | [references/checklist.md](references/checklist.md) |
| Páginas reais estudadas por inteiro, com a ordem, a anatomia e as peças no registro | [references/estudos/README.md](references/estudos/README.md) |

Modelos em `assets/`: [estruturas.md](assets/estruturas.md) (roteiros de
página por tipo), [pagina.astro](assets/pagina.astro) e
[pagina.tsx](assets/pagina.tsx) (uma página composta com os itens do
registro).

## Regras

1. **Uma ação principal por página**, repetida no hero, no meio e no fim,
   com o mesmo rótulo. Tudo o mais leva até ela.
2. **Uma ideia por tela.** Cerca de 80 palavras por tela de 900 px. O hero
   é título, uma frase e as ações.
3. **A primeira dobra fecha.** Em 1280 x 800, o título, a frase, a ação
   principal e o foco do visual aparecem sem rolar.
4. **Conteúdo real.** Texto do projeto, números verificados, depoimentos
   com nome, logos autorizados, capturas do produto de verdade. O que não
   existe não entra: a seção sai ou a lacuna fica marcada.
5. **A ordem das seções é o argumento da página**, não um molde. Hero,
   três recursos, chamada e rodapé, nessa ordem e sem mais nada, é o molde
   que toda página gerada usa.
6. **Cada seção tem massa.** Um visual de 300 px ou mais, um conjunto de
   três, uma tabela ou uma frase em tamanho de título. Seção de um título e
   uma linha se junta à vizinha.
7. **Ritmo varia.** Alterne fundo, composição e alinhamento entre seções
   vizinhas. Duas seções seguidas com a mesma grade viram uma.
8. **Sem rótulo acima do título.** O título diz o assunto. Nada de linha
   pequena em caixa alta anunciando a seção.
9. **O movimento vai do hero ao rodapé.** Entrada no hero, revelação nas
   seções, hover nos cartões, uma faixa ou fundo vivo. A implementação fina
   é da `designfy-motion`.
10. **Fragmentos do catálogo.** Cada região usa uma entrada do catálogo de
    interface, com a fonte anotada no viewspec.
11. **Tema e mais nada.** Fundo, cor e fonte pelos papéis; fundos de seção
    pelos presets definidos no guia.
12. **Página estática por padrão.** Em Astro, só o que tem estado vira
    ilha. Em React, a página pública rende no servidor quando o framework
    permite.
13. **Mudança de endereço e página rasa seguem o guia do projeto**: página
    sem conteúdo próprio se funde a outra, e endereço que muda ganha
    redirecionamento permanente.
14. **Em site com Astrofy, a entrega técnica é do Astrofy.** Rotas, SEO,
    dados estruturados, imagens, Open Graph e build ficam com as skills
    `astrofy-*` e com a sitespec da tela; esta skill cuida da composição
    descrita no viewspec.

## Passos

### 1. Ler o viewspec e o guia

`## Objetivo` (a ação principal), `## Conteúdo` (o que existe e as
lacunas), e do guia: `## Visão geral`, `## Padrões de tela`, `## Voz e
conteúdo`, `## Fundos e profundidade`.

### 2. Montar o argumento

Com [references/arquitetura-da-pagina.md](references/arquitetura-da-pagina.md),
[assets/estruturas.md](assets/estruturas.md) e o estudo do mesmo tipo de
página em [references/estudos/](references/estudos/README.md), quando houver: escreva a pergunta que cada
seção responde, na ordem das perguntas do visitante. Corte a seção que
não responde a nada ou não tem conteúdo real.

### 3. Escolher os fragmentos

```bash
designfy catalog list --kind landing-page
designfy catalog show hero-split
```

Um fragmento por seção, conferindo `useWhen` e `avoidWhen`. Registre em
`## Estrutura` do viewspec.

### 4. Compor a primeira dobra

Com [references/hero.md](references/hero.md): composição, visual real,
ações. Confira em 1280 x 800 e em 390 x 844.

### 5. Compor as seções

Com [references/secoes.md](references/secoes.md) e
[references/conversao.md](references/conversao.md): cada seção com título
que diz o que o visitante ganha, composição com massa, fundo do ritmo e a
ação quando couber.

### 6. Fechar a página

Cabeçalho e rodapé do projeto
([references/navegacao-e-rodape.md](references/navegacao-e-rodape.md)),
chamada final, título e descrição do documento.

### 7. Conferir

[references/vicios-de-pagina-gerada.md](references/vicios-de-pagina-gerada.md)
e [references/checklist.md](references/checklist.md). Marque os itens no
viewspec e passe para `designfy-components`, `designfy-motion`,
`designfy-responsive` e `designfy-accessibility`.

## Marcos

- Argumento da página escrito, seção por seção.
- Fragmentos escolhidos e registrados no viewspec.
- Primeira dobra fechada em 1280 x 800 e no celular.
- Seções compostas com conteúdo real e ritmo variado.
- Cabeçalho, rodapé e chamada final no lugar.

## Saída

A ordem das seções com a pergunta que cada uma responde, o fragmento e a
fonte de cada uma, as seções cortadas e por quê, as lacunas de conteúdo, os
fundos usados e o que ficou para as outras especialistas.
