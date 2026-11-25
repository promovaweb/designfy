# Estouro e rolagem horizontal

A página nunca rola na horizontal. Quando rola, um elemento ficou mais
largo que a tela.

## Detectar

```bash
designfy capture run <url> --viewport 320x640,mobile,tablet --name <slug>-estouro
```

No `manifest.json`, `overflowX: true` marca a largura que estourou, com
`documentWidth` maior que `viewportWidth`.

Para achar o culpado, no console do navegador, na largura que estoura:

```js
[...document.querySelectorAll("*")]
  .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
  .map((el) => el.tagName.toLowerCase() + "." + [...el.classList].join("."));
```

Os primeiros da lista são os contêineres; o último costuma ser a causa.

## Causas e correções

| Causa | Correção |
| --- | --- |
| largura fixa em pixels (`w-[600px]`) | `w-full max-w-[600px]` |
| `w-screen` ou `100vw` (inclui a barra de rolagem) | `w-full` |
| trilha de grade em `1fr` com imagem, tabela ou palavra longa | `minmax(0, 1fr)` na trilha, ou `min-w-0` no filho |
| filho de flex que não encolhe | `min-w-0` no filho; `shrink-0` só em ícone e avatar |
| imagem sem limite | `max-w-full h-auto` (padrão do Tailwind para `img`) |
| tabela larga | invólucro com `overflow-x-auto` |
| bloco de código | `overflow-x-auto` no `pre` |
| texto sem espaço (endereço, código, e-mail longo) | `break-words` ou `break-all` no elemento |
| título grande em palavra longa | `overflow-wrap: break-word`, e limite menor no `clamp` |
| margem negativa para sangrar | compense com preenchimento no pai, ou sangre com grade |
| elemento posicionado fora (`absolute` com `right` negativo) | `overflow-x: clip` no contêiner da seção |
| transformação que desloca (`translate-x`) em repouso | parta do lugar; anime só opacidade no celular |
| `whitespace-nowrap` em texto longo | só em rótulo curto |
| linha de fichas ou abas sem quebra | `flex-wrap`, ou rolagem própria com `overflow-x-auto` |
| `gap` e preenchimento somando mais que a tela em 320 px | valores menores na base, maiores com prefixo |
| iframe de terceiro | invólucro com proporção e `max-w-full` |
| faixa rolante sem corte | `overflow: hidden` no trilho |
| animação de entrada vindo da lateral | `overflow-x: clip` na seção |

## `clip`, não `hidden`

```css
html, body { overflow-x: clip; }
```

O tema já aplica. `overflow-x: hidden` em `html` ou `body` quebra
`position: sticky` e cria um contêiner de rolagem; `clip` só corta. Isso
é rede de proteção, não correção: o elemento largo continua precisando do
ajuste, senão o conteúdo dele fica cortado.

## Região que rola de propósito

```html
<div class="overflow-x-auto overscroll-x-contain" role="region" aria-label="Tabela de planos" tabindex="0">
  <table class="min-w-[40rem]">…</table>
</div>
```

- Rola dentro da caixa, com largura mínima que mantém a leitura.
- `role="region"`, nome acessível e `tabindex="0"`, para o teclado
  alcançar.
- Indique que rola: primeira coluna fixa, sombra na borda, ou o último
  item cortado ao meio.
- `overscroll-x-contain` evita o gesto de voltar do navegador.

## Estouro vertical

- Texto que cresce além da caixa: troque `h-*` por `min-h-*`.
- Cartões de alturas diferentes na mesma linha: a grade já iguala;
  alinhe o rodapé do cartão com `mt-auto`.
- Conteúdo cortado por `overflow: hidden` no pai: confira com texto
  ampliado a 200%.
- Diálogo mais alto que a tela: altura máxima com `dvh` e rolagem
  interna, ações fixas no pé.

## Sobreposição

- Dois elementos fixos no topo: o segundo com
  `top-(--header-height)`.
- Barra fixa no pé cobrindo o fim do conteúdo: preenchimento inferior no
  conteúdo.
- Texto sob elemento posicionado: dê espaço próprio ao texto.

## Conferir em 320 px

A largura mínima de teste é 320 px. O que costuma quebrar ali: linha de
botões, título em palavra longa, tabela, grupo de fichas, preenchimento
lateral grande, cabeçalho com marca, ação e menu.
