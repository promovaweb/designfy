# Fluidez, consultas de contêiner e grade

## Tipografia e espaço fluidos

Valores que crescem com a tela, entre um mínimo e um máximo, sem ponto de
quebra:

```css
--text-display: clamp(2.5rem, 1.6rem + 4vw, 4.5rem);
--gutter: clamp(1rem, 4vw, 2rem);
--section-space: clamp(3.5rem, 8vw, 6rem);
```

- `clamp(mínimo, preferido, máximo)`. O preferido mistura `rem` e `vw`,
  para o texto respeitar o tamanho de fonte que a pessoa configurou.
- Nunca só `vw` em texto: não acompanha a ampliação do navegador.
- Fluido para títulos, margens e espaço entre seções. O corpo do texto
  fica fixo (16 a 18 px).
- Os tokens fluidos do Designfy estão no tema: `text-display`,
  `text-headline`, `text-title`, `text-lead`, `--gutter`,
  `--section-space`.

Em classe: `text-display`, `px-(--gutter)`, `py-(--section-space)`, ou as
utilidades `df-container` e `df-section`.

## Consultas de contêiner

O componente reage à largura do lugar onde foi posto, não à da tela.

```html
<div class="@container">
  <article class="grid gap-4 @md:grid-cols-[8rem_minmax(0,1fr)] @2xl:gap-6">
    …
  </article>
</div>
```

- `@container` no pai; `@sm:`, `@md:`, `@lg:`, `@xl:` no filho.
- Tamanhos do contêiner no Tailwind 4: `@3xs` 256 px, `@2xs` 288, `@xs`
  320, `@sm` 384, `@md` 448, `@lg` 512, `@xl` 576, `@2xl` 672, `@3xl`
  768, e assim por diante.
- Contêiner com nome quando há aninhamento: `@container/card` e
  `@md/card:flex-row`.
- Valor avulso: `@min-[500px]:grid-cols-2`.

Use consulta de contêiner em: cartão que vive em grade e em lateral,
cartão de indicador, tabela dentro de painel redimensionável, bloco de
mídia e texto, formulário dentro de gaveta.

Use consulta de tela em: layout da página, cabeçalho, navegação, shell.

## Grade que se ajusta sozinha

Sem ponto de quebra, a grade decide quantas colunas cabem:

```html
<ul class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
```

- `auto-fit` com `minmax(18rem, 1fr)`: tantas colunas de pelo menos 18rem
  quantas couberem.
- `min(100%, 18rem)` evita estouro quando a tela é menor que o mínimo.
- Serve para grade de cartões de mesmo peso. Para composição com pesos
  diferentes (bento, hero), use colunas explícitas por faixa.

`auto-fill` mantém as colunas vazias; `auto-fit` estica os itens para
ocupar a linha.

## Trilhas que não estouram

```html
<div class="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
```

`1fr` puro tem mínimo igual ao conteúdo: uma imagem, uma tabela ou uma
palavra longa empurra a coluna além da tela. `minmax(0, 1fr)` zera o
mínimo. Em flex, o equivalente é `min-w-0` no filho que precisa encolher.

## Flex que quebra

```html
<div class="flex flex-wrap items-center gap-3">
```

Grupo de ações, fichas e meta quebram linha com `flex-wrap` e `gap`. O
texto do botão não quebra (`whitespace-nowrap`); quem quebra é o grupo.

## Imagens por largura

```html
<img src="foto-800.webp" srcset="foto-480.webp 480w, foto-800.webp 800w, foto-1200.webp 1200w, foto-1600.webp 1600w"
  sizes="(min-width: 1024px) 50vw, 100vw" width="1600" height="1067" alt="…">
```

- `sizes` diz a largura que a imagem ocupa em cada faixa; o navegador
  escolhe o arquivo.
- Recorte diferente por faixa com `<picture>` e `media`.
- `aspect-ratio` no contêiner e `object-cover` na imagem.
- Em Astro, `<Image widths sizes>` gera tudo.

## Proporção e tamanho mínimo

- `aspect-video`, `aspect-square`, `aspect-[4/3]` reservam o espaço.
- `min-h` em vez de `h` em blocos com texto: o texto pode crescer.
- Altura de tela com `min-h-svh`.
- `max-w` em linha de texto, em formulário e em visual que usa `vw`.

## Unidades

| Unidade | Uso |
| --- | --- |
| `rem` | tipografia, espaço, largura de componente |
| `ch` | medida de texto |
| `%`, `fr` | colunas e larguras relativas |
| `svh`, `dvh`, `lvh` | altura de tela |
| `vw` | dentro de `clamp`, junto com `rem` |
| `cqi` | relativo à largura do contêiner, dentro de `@container` |
| `px` | bordas, sombras, deslocamentos pequenos |

## Texto que não cabe

- Título com `overflow-wrap: break-word` e `min-width: 0` (já no tema).
- `text-wrap: balance` em títulos.
- Uma linha com reticências: `truncate`, com o texto completo acessível.
- Várias linhas: `line-clamp-2`.
- Palavra longa sem espaço (endereço, código): `break-all` só naquele
  elemento.
- Idioma com palavras longas aumenta o texto em até um terço: teste.

## Ampliação

A página funciona com o texto do navegador em 200% e com a tela ampliada
a 400% (equivale a 320 px de largura): sem perda de conteúdo e sem
rolagem em dois eixos. Tamanhos em `rem` e layout fluido resolvem.
