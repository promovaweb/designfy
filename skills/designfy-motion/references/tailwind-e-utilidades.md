# Tailwind 4 e as utilidades de movimento do Designfy

Fonte da sintaxe do Tailwind: <https://tailwindcss.com/docs/animation> e as
páginas de `transition-*`. Confira lá antes de usar algo fora deste
arquivo.

## Transições

| Classe | Propriedades que transitam |
| --- | --- |
| `transition` | cores, opacidade, sombra, transformações e filtros mais comuns |
| `transition-colors` | cor, fundo, borda, contorno, decoração, preenchimento e traço |
| `transition-opacity` | opacidade |
| `transition-shadow` | sombra |
| `transition-transform` | `transform`, `translate`, `scale`, `rotate` |
| `transition-[transform,opacity]` | a lista escrita |
| `transition-none` | nenhuma |
| `transition-all` | todas: **não use** |

Padrões do Tailwind quando não se declara nada: 150 ms e curva
`cubic-bezier(0.4, 0, 0.2, 1)`. No Designfy, declare a duração e a curva
pelos tokens:

```html
<a class="transition-colors duration-(--duration-fast) ease-out-quart hover:bg-muted">
<article class="transition-transform duration-(--duration-base) ease-out-expo hover:-translate-y-0.5">
<div class="transition-opacity delay-150 duration-(--duration-slow)">
```

- `duration-150`, `duration-300`, ou `duration-(--duration-base)` para ler
  o token.
- `ease-linear`, `ease-in`, `ease-out`, `ease-in-out` são do Tailwind;
  `ease-out-quart`, `ease-out-expo`, `ease-in-quart`, `ease-in-out-quart` e
  `ease-spring` vêm do tema do Designfy.
- `delay-75`, `delay-150`, `delay-[240ms]`.

### Transição de `display` e de entrada

```html
<div class="hidden opacity-0 transition-[opacity,display] transition-discrete data-[open]:block data-[open]:opacity-100 starting:data-[open]:opacity-0">
```

- `transition-discrete` deixa propriedades discretas (`display`,
  `visibility`) participarem da transição, para um elemento sair de
  `hidden` com animação.
- `starting:` gera `@starting-style`: o estado de partida de um elemento
  que acabou de aparecer. Serve para diálogo, popover e item novo, sem
  JavaScript.

### Variantes de preferência

```html
<div class="motion-safe:animate-df-float motion-reduce:animate-none">
<div class="motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
```

`motion-safe:` aplica só quando a pessoa não pediu menos movimento;
`motion-reduce:` aplica quando pediu. O CSS do Designfy já desliga
animações com movimento reduzido; as variantes servem para movimento
escrito direto na classe.

## Animações do Tailwind

| Classe | Efeito | Uso |
| --- | --- | --- |
| `animate-spin` | gira 360 graus em 1 s, sem parar | indicador de carregamento |
| `animate-ping` | escala e some, como um radar | um ponto de notificação viva |
| `animate-pulse` | opacidade vai a 50% e volta | esqueleto simples |
| `animate-bounce` | sobe e desce | não use em interface; no máximo uma seta de "role" |
| `animate-none` | desliga | com `motion-reduce:` |

Animação própria no Tailwind 4 é uma variável de tema com os quadros
dentro do `@theme`:

```css
@theme {
  --animate-wiggle: wiggle 1s ease-in-out infinite;
  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
}
```

Isso cria a classe `animate-wiggle`. Valor avulso:
`animate-[wiggle_1s_ease-in-out_infinite]` ou `animate-(--minha-animacao)`.

## Animações do Designfy

Vêm de `designfy-motion.css`. Todas respeitam movimento reduzido.

| Classe | Efeito |
| --- | --- |
| `animate-df-fade-in` | opacidade |
| `animate-df-fade-up`, `animate-df-fade-down` | opacidade e 16 px na vertical |
| `animate-df-slide-in-left`, `animate-df-slide-in-right` | opacidade e 24 px na horizontal |
| `animate-df-scale-in` | opacidade e escala de 0.96 |
| `animate-df-mask-up` | revela de baixo para cima com `clip-path` |
| `animate-df-pop` | escala com mola, para selo e marca de feito |
| `animate-df-shake` | tremor único de 4 px, para erro |
| `animate-df-draw`, `animate-df-check` | desenha um traço de SVG (`stroke-dashoffset`) |
| `animate-df-marquee`, `animate-df-marquee-reverse` | faixa rolante |
| `animate-df-shimmer` | brilho de esqueleto |
| `animate-df-pulse-soft` | opacidade respirando, para estado em andamento |
| `animate-df-float` | sobe e desce 8 px em 6 s |
| `animate-df-pan` | desloca a posição do fundo |
| `animate-df-spin-slow` | gira em 14 s |
| `animate-df-border-beam` | ponto de luz que percorre a borda |
| `animate-df-collapse-down`, `animate-df-collapse-up` | abre e fecha por linhas de grade |

Atraso e duração por valor arbitrário:

```html
<h1 class="animate-df-fade-up [animation-delay:80ms]">
<img class="animate-df-fade-up [animation-duration:var(--duration-slower)]">
```

Desenho de traço: declare o comprimento e o traço.

```html
<path class="animate-df-draw" pathLength="1" stroke-dasharray="1" style="--df-path-length: 1" />
```

## Utilidades do Designfy

| Utilidade | O que faz |
| --- | --- |
| `data-df-reveal` | entra uma vez ao aparecer; valores `up`, `down`, `left`, `right`, `scale`, `fade`, `mask` |
| `data-df-stagger` (no pai) | numera os filhos para a sequência; cada filho com `data-df-reveal` |
| `style="--df-i: 3"` | posição na sequência, quando não há pai com `data-df-stagger` |
| `data-df-count="1250"` | conta até o valor ao aparecer; `data-df-count-from`, `data-df-count-duration` |
| `data-df-loop` | marca um laço para pausar fora da tela |
| `df-marquee` | faixa rolante: o componente duplica o grupo de itens; `--df-marquee-duration`, `--df-marquee-gap`, `data-df-direction="right"` |
| `df-shimmer` | brilho de esqueleto com papéis do tema |
| `df-lift` | elevação de 2 px e borda mais forte no hover; pressão no clique |
| `df-press` | escala 0.98 ao pressionar, com transição de cor |
| `df-underline` | sublinhado que cresce da esquerda no hover e no foco |
| `df-collapse` com `data-df-open` | painel que abre por `grid-template-rows` |
| `df-keep-motion` | mantém a animação mesmo com movimento reduzido (indicador de progresso) |

O runtime (`initDesignfyMotion`) acrescenta `js` em `<html>`, marca as
revelações com `data-df-visible`, pausa laços fora da tela e roda os
contadores. Sem o runtime, a página funciona: o conteúdo fica visível e, em
navegador com animação ligada à rolagem, as revelações rodam em CSS.

## Animações do shadcn

`tw-animate-css` traz as classes que os componentes do shadcn usam
(`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-top-2`,
`animate-out`, `data-[state=open]:animate-in`). Deixe os primitivos com as
animações deles; ajuste só a duração para os tokens do tema quando
destoar.
