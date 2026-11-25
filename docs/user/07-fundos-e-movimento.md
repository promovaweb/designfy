# Capítulo 7: Fundos e movimento

A landing page abre com o hero sobre um padrão de grade discreto, com um
desvanecimento radial que segura o texto legível. As seções seguem na
superfície, uma faixa tingida marca a virada de assunto e a chamada final repete
o padrão do hero. Enquanto você rola, os blocos entram em cascata; no fim, tudo
continua legível com o movimento reduzido ligado no sistema. Esse é o padrão que
o Designfy entrega para fundo e movimento.

## Três níveis de fundo

O fundo dá ritmo à página e separa seções sem precisar de caixa.

| Nível | O que é | Classe ou componente |
| --- | --- | --- |
| Superfície | a cor da página | `bg-background` |
| Faixa | seção inteira tingida | `bg-muted/60`, `bg-card`, ou `bg-primary text-primary-foreground` numa chamada |
| Padrão | desenho discreto atrás do conteúdo | componente `Background` com um preset |

Numa página de site, a maior parte das seções fica na superfície. Uma faixa
tingida a cada duas ou três seções marca mudança de assunto. O padrão aparece no
hero, na chamada final e, no máximo, em mais uma seção. Em sistema, o fundo é
superfície e cartão; padrão só em tela de entrada, estado vazio e página de erro.

## O componente Background

```bash
designfy components add background
```

O comando copia o componente e o `designfy-backgrounds.css`. Importe o CSS uma
vez no CSS de entrada.

```tsx
<Background preset="signal-grid" fade="radial">
  <HeroCentered … />
</Background>
```

```astro
<Background preset="studio-soft-blueprint" fade="bottom">
  <slot />
</Background>
```

As propriedades são poucas:

| Prop | Valores | Efeito |
| --- | --- | --- |
| `preset` | o slug de um padrão | escolhe o desenho |
| `fade` | `none`, `bottom`, `edges`, `radial` | aplica máscara na camada do padrão |
| `className` ou `class` | classes do projeto | ajuste local do contêiner |

O componente renderiza a camada do padrão com `aria-hidden="true"` e mantém o
conteúdo numa camada acima. Todos os presets leem os papéis do tema e mudam com
a paleta e com o modo escuro. Nenhum preset tem cor literal.

## Escolher um preset

O catálogo desta versão tem 314 presets, com 241 desenhos distintos, em quatro
categorias:

| Categoria | Presets | O que traz | Combina com |
| --- | --- | --- | --- |
| `geometric` | 119 | grades, pontos, linhas, hachuras | produto técnico, ferramenta, documentação, sistema |
| `gradients` | 61 | lavagens e brilhos radiais | página de venda, marca suave, chamada final |
| `decorative` | 57 | texturas e composições | marca com personalidade, página editorial |
| `effects` | 77 | holofotes, auroras, brilhos animados | hero de lançamento; um por página |

Cada preset declara a legibilidade em `presets.json`:

| Valor | Presets | Como usar |
| --- | --- | --- |
| `text-safe` | 151 | pode ficar atrás de título e texto curto |
| `needs-fade` | 106 | use com `fade="radial"` ou `fade="bottom"` e meça o contraste |
| `decorative-only` | 57 | só em área sem texto: lateral do hero, painel de marca, rodapé |

A classificação é uma estimativa do gerador. A conferência final é a medida de
contraste no ponto mais difícil atrás do texto e a captura nos dois temas.

Nove presets se movem, com brilho que pulsa, feixe que varre ou grade com foco.
Use um por página, em seção curta. Todos param com `prefers-reduced-motion` e
quando saem da tela. Padrão geométrico sem função vira enfeite: ele funciona
quando sugere a matéria do produto, como grade para ferramenta de layout e
pontos para mapa e dado.

Os presets vêm do catálogo MIT ReactBD BG, com origem no Pattern Craft de Megh
Bari. O Designfy converteu as cores em papéis do tema e manteve a geometria.

## Movimento é o padrão

Toda tela tem algum movimento com função: entrada, resposta ao toque, troca de
estado ou rolagem. Tela parada só quando o guia do projeto disser. Todo
movimento tem versão parada para `prefers-reduced-motion: reduce`.

```bash
designfy components add designfy-motion
```

O arquivo `designfy-motion.css` declara as animações, as utilidades e o runtime
`initDesignfyMotion`, que liga a classe `js` no `html`, marca as revelações e
pausa laços fora da tela. O CSS resolve a maior parte; o
[Motion](https://motion.dev) entra quando o CSS não dá conta.

### Utilidades de CSS

| Utilidade | O que faz |
| --- | --- |
| `data-df-reveal` | revela o elemento uma vez ao aparecer; valores `up`, `down`, `left`, `right`, `scale`, `fade` e `mask` |
| `data-df-stagger` no pai | numera os filhos e escalona a revelação |
| `style="--df-i: 3"` | posição na sequência, quando não há pai com `data-df-stagger` |
| `data-df-count="1250"` | conta até o valor ao aparecer, com `data-df-count-from` e `data-df-count-duration` |
| `data-df-loop` | marca um laço para pausar fora da tela |
| `animate-df-*` | animações prontas: `fade-in`, `fade-up`, `fade-down`, `slide-in-left`, `slide-in-right`, `scale-in`, `mask-up`, `pop`, `shake`, `draw`, `check`, `marquee`, `shimmer`, `pulse-soft`, `float`, `pan`, `spin-slow`, `border-beam`, `collapse-down` e `collapse-up` |
| `df-lift` | elevação de 2 px e borda mais forte no hover, com pressão no clique |
| `df-press` | escala 0.98 ao pressionar, com transição de cor |
| `df-underline` | sublinhado que cresce da esquerda no hover e no foco |
| `df-collapse` com `data-df-open` | painel que abre por `grid-template-rows` |
| `df-marquee` | faixa rolante, com `--df-marquee-duration`, `--df-marquee-gap` e `data-df-direction="right"` |
| `df-shimmer` | brilho de esqueleto com os papéis do tema |
| `df-keep-motion` | mantém a animação com movimento reduzido, para indicador de progresso |

A cascata usa `data-df-stagger` no pai. Os filhos recebem o índice em `--df-i` e
o atraso sai de `--stagger`. A revelação só esconde o conteúdo quando o script
adiciona `js` ao `html`; sem JavaScript e com animação por rolagem do navegador,
o conteúdo aparece.

As durações e curvas vêm do tema: `--duration-instant` (100 ms),
`--duration-fast` (150 ms), `--duration-base` (250 ms), `--duration-slow`
(500 ms) e `--duration-slower` (800 ms), com `--ease-out-expo`,
`--ease-out-quart` e `--ease-spring` entre as curvas.

### O que se move

- Só `transform`, `opacity`, `clip-path`, `mask` e `background-position`
  animam. Nunca `transition-all`, `width`, `height`, `top`, `left`, `margin` ou
  `padding`.
- Um sinal de hover por elemento, no contêiner, nunca só na imagem.
- Laço pausa no hover, no foco e fora da tela. Com movimento reduzido, o laço
  para.
- Fundo animado fica em seção curta. Atrás de texto longo, prefira o estático e
  ponha o movimento no conteúdo.
- O componente React lê `useReducedMotion()` e renderiza o estado final.

## Movimento com o Motion

Quando o CSS não resolve, a skill `designfy-motion` usa `motion/react` para
animação de layout, entrada e saída de elemento, gesto e número com mola.
Importe sempre de `motion/react`, nunca de `framer-motion`, e mantenha a versão
parada.

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

O CSS continua sendo a primeira escolha: custa menos, funciona sem JavaScript e
não depende de hidratação.

## Conferir

- O CSS de entrada importa `designfy-backgrounds.css` e `designfy-motion.css`.
- `designfy theme check` aprova o contraste do texto sobre o padrão escolhido.
- Cada seção declara um nível de fundo: superfície, faixa ou padrão.
- Todo preset usado atrás de texto é `text-safe` ou leva o `fade` indicado.
- Todo movimento tem versão parada em `prefers-reduced-motion`.
- Laços pausam no hover, no foco e fora da tela.
- Nenhum arquivo usa `transition-all` nem anima altura ou largura.
