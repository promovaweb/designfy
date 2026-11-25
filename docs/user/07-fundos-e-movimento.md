# Capítulo 7: Fundos e movimento

Na revisão do Plano Founders, o hover nas linhas de vantagens sugeria que elas abriam um link. A revisão retirou o efeito dessas linhas e preservou o pulso na linha do tempo, onde ele identificava a etapa atual. Depois de três ciclos, o marcador fica visível em repouso.

## Superfície, faixa e padrão de fundo

Uma mudança de assunto pode ocupar toda a largura da página. Nesse caso, tingir o fundo da seção separa os blocos sem acrescentar uma borda a cada parágrafo. O Designfy oferece três níveis de fundo para compor esse ritmo.

| Nível | O que é | Classe ou componente |
| --- | --- | --- |
| Superfície | a cor da página | `bg-background` |
| Faixa | seção inteira tingida | `bg-muted/60`, `bg-card`, ou `bg-primary text-primary-foreground` numa chamada |
| Padrão | desenho discreto atrás do conteúdo | componente `Background` com um preset |

Em um site, use a superfície na maior parte do percurso. Uma faixa a cada duas ou três seções pode marcar uma mudança de assunto. Reserve o padrão para o hero, a chamada final e no máximo uma seção adicional. Em aplicativos, prefira superfície e cartão na área de trabalho. Os padrões cabem na entrada, no estado vazio ou na tela de erro.

## Instalação e máscara de Background

O componente `Background` desenha o padrão em uma camada própria. Para usá-lo, copie o item do registro e importe a folha `designfy-backgrounds.css` uma vez no CSS de entrada.

```bash
designfy components add background
```

A cópia inclui tanto o componente quanto a folha de estilos. Em React, o exemplo envolve o hero com a grade `signal-grid`. A máscara radial atenua o desenho sem alterar a opacidade do título ou das ações.

```tsx
<Background preset="signal-grid" fade="radial">
  <HeroCentered headline="Guia do Designfy" lead="Consulte os componentes e os estilos do projeto." />
</Background>
```

Em Astro, o conteúdo pode vir de um slot. A máscara `bottom` suaviza o padrão na parte inferior, onde a abertura encontra a próxima seção.

```astro
<Background preset="studio-soft-blueprint" fade="bottom">
  <slot />
</Background>
```

O título e as ações ficam numa camada acima do padrão. Como a camada de fundo tem `aria-hidden="true"`, o leitor de tela percorre o conteúdo do hero sem anunciar o desenho.

| Prop | Valores | Efeito |
| --- | --- | --- |
| `preset` | o slug de um padrão | escolhe o desenho |
| `fade` | `none`, `bottom`, `edges`, `radial` | aplica máscara na camada do padrão |
| `className` | classes do projeto | ajuste local do container |

Nos dois frameworks, use `className` para ajustar o container. Os presets usam as cores do tema. Abra o hero nos modos claro e escuro para conferir se a máscara mantém o texto legível sobre o desenho.

## Escolha entre os 334 presets

O catálogo distribui 334 presets em quatro categorias, com 257 desenhos distintos. Para uma ferramenta de layout, uma grade pode sugerir a superfície de trabalho. Para cartografia ou estatísticas, um campo de pontos pode fazer mais sentido atrás da ilustração.

| Categoria | Presets | O que traz | Combina com |
| --- | --- | --- | --- |
| `geometric` | 125 | grades, pontos, linhas, hachuras | produto técnico, ferramenta, documentação, sistema |
| `gradients` | 64 | lavagens e brilhos radiais | página de venda, marca suave, chamada final |
| `decorative` | 66 | texturas e composições | marca com personalidade, página editorial |
| `effects` | 79 | holofotes, auroras, brilhos animados | hero de lançamento (um por página) |

A categoria descreve a aparência. Antes de colocar texto sobre o desenho, confira também a classificação de legibilidade em `presets.json`. Há presets próprios para ficar ao lado do título, fora da coluna de leitura.

| Valor | Presets | Como usar |
| --- | --- | --- |
| `text-safe` | 160 | pode ficar atrás de título e texto curto |
| `needs-fade` | 114 | use com `fade="radial"` ou `fade="bottom"` e meça o contraste |
| `decorative-only` | 60 | só em área sem texto: lateral do hero, painel de marca, rodapé |

A classificação vem de uma estimativa do gerador. Confira os pares de cor com `designfy theme check` e examine as capturas em ambos os temas. No trecho menos legível do fundo, meça o contraste com a cor local sob as letras. Uma medição sobre a cor uniforme da página pode esconder a interferência de uma faixa clara no padrão.

Nove presets têm movimento. Num hero com brilho animado, a folha de estilos desliga a animação quando o navegador indica movimento reduzido. Para pausá-la também fora da tela, envolva o `Background` num elemento com `data-df-loop` e inicialize o runtime de movimento. Reserve um único padrão animado para uma seção curta e use um fundo estático atrás de texto longo.

O ReactBD BG distribui sob licença MIT padrões do Pattern Craft de Megh Bari. A outra fonte, GradientDeck, convida à cópia dos padrões e não publica licença para eles. Na adaptação, o Designfy preservou a geometria e substituiu as cores pelos papéis do tema.

## Revelação de conteúdo e pausa fora da tela

Uma seção pode revelar o título ao entrar na tela sem atrasar a leitura de uma página estática. Siga a indicação de movimento do guia do projeto. Com `prefers-reduced-motion: reduce`, apresente o conteúdo no estado final e reserve `df-keep-motion` para um indicador de progresso que precise continuar animado. O item `designfy-motion` fornece os estilos e o script de revelação.

```bash
designfy components add designfy-motion
```

A folha `designfy-motion.css` fornece animações e utilidades. O script associado exporta `initDesignfyMotion`, que acrescenta a classe `js` ao `html` e acompanha a visibilidade dos elementos. Importe o CSS na entrada e inicialize o runtime para marcar revelações e pausar laços fora da tela.

| Utilidade | O que faz |
| --- | --- |
| `data-df-reveal` | revela o elemento uma vez ao aparecer com uma das variantes `up`, `down`, `left`, `right`, `scale`, `fade` e `mask` |
| `data-df-stagger` no pai | escalona a revelação dos filhos diretos pelo índice no CSS |
| `style="--df-i: 3"` | posição na sequência, quando não há pai com `data-df-stagger` |
| `data-df-count="1250"` | anima o número até o valor final ao aparecer, com `data-df-count-from` e `data-df-count-duration` |
| `data-df-loop` | marca um laço para pausar fora da tela |
| `animate-df-*` | animações prontas: `fade-in`, `fade-up`, `fade-down`, `slide-in-left`, `slide-in-right`, `scale-in`, `mask-up`, `pop`, `shake`, `draw`, `check`, `marquee`, `shimmer`, `pulse-soft`, `float`, `pan`, `spin-slow`, `border-beam`, `collapse-down` e `collapse-up` |
| `df-lift` | elevação de 2 px e borda mais forte no hover, com efeito de botão apertado no clique |
| `df-press` | escala 0.98 enquanto o botão estiver apertado, com transição de cor |
| `df-underline` | sublinhado que cresce da esquerda no hover e no foco |
| `df-collapse` com `data-df-open` | painel que abre por `grid-template-rows` |
| `df-marquee` | faixa rolante, com `--df-marquee-duration`, `--df-marquee-gap` e `data-df-direction="right"` |
| `df-shimmer` | brilho de esqueleto com os papéis do tema |
| `df-keep-motion` | mantém a animação com movimento reduzido, para indicador de progresso |

O CSS de `data-df-stagger` atribui `--df-i` aos filhos diretos. O primeiro recebe zero e, a partir do oitavo, os filhos compartilham o índice 7. O atraso de cada revelação corresponde a esse índice multiplicado por `--stagger`. Durante a revisão, percorra a última seção com JavaScript desativado e depois com movimento reduzido para conferir se o texto continua visível.

As durações do tema vão de `--duration-instant` (100 ms) a `--duration-slower` (800 ms). Entre elas ficam `--duration-fast` (150 ms), `--duration-base` (250 ms) e `--duration-slow` (500 ms). Para mudar o ritmo da transição mantendo a mesma duração, consulte as curvas `--ease-out-expo`, `--ease-out-quart` e `--ease-spring`.

### Hover nas linhas e pausa na faixa do Plano Founders

Nas linhas do Plano Founders, reserve o hover para o container que abre um destino. Assim, a área ao redor da imagem responde ao mesmo gesto que a imagem. Na faixa rolante, confira a pausa ao tirar a faixa da tela e ao passar o ponteiro sobre ela. Pelo teclado, leve o foco até o botão de pausa e verifique se ele aparece. Com movimento reduzido, confira a faixa em repouso.

Para uma entrada, anime `transform` ou `opacity`. Para revelar um desenho, use `clip-path`, `mask` ou `background-position`. Declare a propriedade na transição. Com `transition-all`, mudanças em `width` ou `height` também poderiam animar e deslocar o texto vizinho. Preserve as dimensões e mantenha `top`, `left`, `margin` e `padding` fora da animação.

## Entrada de um valor em React com Motion

O CSS atende a efeitos simples com pouco custo e pode funcionar antes da hidratação. Quando a composição precisa animar layout, entrada e saída, gestos ou um número com mola, a skill `designfy-motion` usa o pacote Motion. Faça a importação por `motion/react`. [Documentação do Motion](https://motion.dev)

```tsx
import { motion, useReducedMotion } from "motion/react";

export function Stat({ value }: { value: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {value}
    </motion.span>
  );
}
```

Com movimento habilitado, o número aparece ao subir 8 px em 0,25 segundo. Quando o navegador indica movimento reduzido, `useReducedMotion()` faz `initial` receber `false` para mostrar o valor já na posição final. Nos componentes existentes, confira também se a importação usa `motion/react` ao atualizar a antiga entrada `framer-motion`.
