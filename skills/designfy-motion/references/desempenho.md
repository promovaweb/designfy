# Desempenho do movimento

Movimento que engasga é pior que movimento nenhum. A meta é 60 quadros por
segundo em celular intermediário.

## O que o navegador anima sem refazer a página

| Propriedade | Custo | Use |
| --- | --- | --- |
| `transform`, `opacity` | só composição | sempre que possível |
| `filter`, `backdrop-filter`, `clip-path`, `mask` | pintura da camada | em elemento pequeno ou isolado |
| `background-position`, `background-size` | pintura | fundos e brilhos |
| `box-shadow`, `border-radius`, cores | pintura | transição curta de estado |
| `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size` | layout da página | nunca em animação |

Trocas equivalentes:

| Em vez de animar | Anime |
| --- | --- |
| `height` de um painel | `grid-template-rows` (`df-collapse`) |
| `width` de uma barra | `transform: scaleX()` com `transform-origin: left` |
| `top` e `left` | `transform: translate()` |
| `margin` para afastar | `transform` |
| sombra crescendo | opacidade de um pseudo-elemento com a sombra final |
| tamanho de fonte | `transform: scale()` |

## `transition-all`

Proibido. Anima propriedades que você não pretendia (inclusive layout),
custa mais e esconde defeitos. Liste as propriedades.

## `will-change`

Só no elemento que vai animar, pouco antes, e removido depois. Nunca numa
classe usada em dezenas de elementos: cada camada promovida consome
memória de vídeo. Na dúvida, não use; `transform` e `opacity` já promovem
quando animam.

## Muitos elementos

- Revelação: observe com um `IntersectionObserver` para todos, não um por
  elemento. O runtime do Designfy faz isso.
- Sequência escalonada: no máximo oito atrasos distintos.
- Lista com animação de layout: até algumas dezenas de itens.
- Fundo com muitas camadas e `blur` grande pesa no celular: reduza o raio
  do desfoque ou use gradiente.
- `backdrop-filter` em cabeçalho fixo é aceitável; em cartões repetidos,
  não.

## Laços

- Pare o que está fora da tela: `data-df-loop` e o runtime trocam
  `animation-play-state`.
- Laço em `requestAnimationFrame` para quando a aba fica oculta
  (`document.visibilityState`).
- Vídeo de fundo: mudo, comprimido, com `poster`, pausado fora da tela.

## Carga

- Entrada acima da dobra em CSS: roda antes do JavaScript e não atrasa a
  maior pintura.
- Não esconda a maior pintura da página esperando animação: imagem do hero
  aparece logo, com no máximo opacidade.
- Reserve o espaço de tudo que entra (imagem com dimensões, esqueleto com
  a forma), para a página não se deslocar.
- `motion/react` em site público: `LazyMotion` e ilhas com
  `client:visible`.
- Nenhuma biblioteca de animação para efeito que o CSS faz.

## Medir

- Painel de desempenho do navegador, com a CPU reduzida em 4 vezes: grave
  a rolagem da página e procure quadros longos.
- Painel de renderização: "realce de pintura" mostra o que repinta;
  "bordas de camada" mostra as camadas.
- Indicadores: deslocamento de layout acumulado perto de zero, interação
  até a próxima pintura abaixo de 200 ms.
- Em projeto Promovaweb, o
  [Pagespeedfy](https://github.com/promovaweb/pagespeedfy) mede a página
  publicada.

## Sinais de problema

| Sintoma | Causa provável |
| --- | --- |
| rolagem trava ao passar por uma seção | animação de layout, desfoque grande ou muitas camadas |
| hover atrasa | `transition-all` ou sombra pesada |
| página pisca ao carregar | conteúdo escondido esperando script |
| conteúdo pula ao aparecer | elemento sem espaço reservado |
| ventoinha liga com a página parada | laço que não pausa fora da tela |
