# Capítulo 7: Fundos e movimento

A landing page abre com o hero sobre um padrão de grade discreto, com um
desvanecimento radial que segura o texto legível. As seções seguem na
superfície, uma faixa tingida marca a virada de assunto e a chamada final repete
o padrão do hero. Enquanto você rola, os blocos entram em cascata; no fim, tudo
continua legível com o movimento reduzido ligado no sistema. Esse é o padrão que
o Designfy entrega para fundo e movimento.

## Três níveis de fundo

O fundo dá ritmo à página e separa seções sem precisar de caixa. O Designfy
padroniza três níveis.

| Nível | O que é | Classe ou componente |
| --- | --- | --- |
| Superfície | a cor da página | `bg-background` |
| Faixa | seção inteira tingida | `bg-muted/60`, `bg-card`, ou `bg-primary text-primary-foreground` numa chamada |
| Padrão | desenho discreto atrás do conteúdo | componente `Background` com um preset |

Numa página de site, a maior parte das seções fica na superfície. Uma faixa
tingida a cada duas ou três seções marca mudança de assunto. O padrão aparece no
hero, na chamada final e, no máximo, em mais uma seção. Um padrão por tela
visível.

Em sistema, o fundo é superfície e cartão. Padrão só em tela de entrada, estado
vazio e página de erro. Grade animada atrás de tabela longa distrai e não
ajuda.

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
conteúdo numa camada acima. O padrão nunca fica por cima do texto.

Todos os presets leem os papéis do tema (`--background`, `--foreground`,
`--border`, `--muted`, `--primary`, `--accent`, `--chart-3` a `--chart-5`).
Trocar a paleta ou ligar o modo escuro muda o fundo junto. Nenhum preset tem cor
literal.

## Escolher um preset

O catálogo desta versão tem 314 entradas e 241 padrões distintos, agrupados em
quatro categorias:

| Categoria | O que traz | Combina com |
| --- | --- | --- |
| `geometric` | grades, pontos, linhas, hachuras | produto técnico, ferramenta, documentação, sistema |
| `gradients` | lavagens e brilhos radiais | página de venda, marca suave, chamada final |
| `decorative` | texturas e composições | marca com personalidade, página editorial |
| `effects` | holofotes, auroras, brilhos animados | hero de lançamento; um por página |

Cada preset declara a legibilidade em `presets.json`:

| Valor | Como usar |
| --- | --- |
| `text-safe` | pode ficar atrás de título e texto curto |
| `needs-fade` | use com `fade="radial"` ou `fade="bottom"` e meça o contraste |
| `decorative-only` | só em área sem texto: lateral do hero, painel de marca, rodapé |

A classificação é uma estimativa do gerador. A conferência final é a medida de
contraste no ponto mais difícil atrás do texto e a captura nos dois temas.

Padrão geométrico sem função vira enfeite. Ele funciona quando sugere a matéria
do produto: grade para ferramenta de layout, pontos para mapa e dado, linhas
para papel e documento.

Quando nenhum preset serve, escreva um novo na mesma regra: só papéis do tema,
linhas e pontos entre 6% e 14% de `foreground`, brilhos entre 10% e 22% de
`primary` ou `accent`, no máximo três camadas. Registre o slug em Fundos e
profundidade no guia.

Os presets vêm do catálogo MIT ReactBD BG, com origem no Pattern Craft de Megh
Bari. O Designfy converteu as cores em papéis do tema e manteve a geometria. O
aviso de licença está em `references/backgrounds/NOTICE.md`.

## Movimento é o padrão

Toda tela tem algum movimento com função: entrada, resposta ao toque, troca de
estado ou rolagem. Tela parada só quando o guia do projeto disser. Todo
movimento tem versão parada para `prefers-reduced-motion: reduce`.

O CSS de movimento vem com o tema:

```bash
designfy components add designfy-motion
```

O arquivo `designfy-motion.css` declara as animações e as utilidades. O CSS
resolve a maior parte; o [Motion](https://motion.dev) entra quando o CSS não
dá conta.

### Utilidades de CSS

| Utilidade | Efeito |
| --- | --- |
| `data-df-reveal="up"` | revela o elemento na rolagem |
| `data-df-stagger` no pai | numera os filhos e escalona a revelação |
| `animate-df-fade-up` | entrada de baixo para cima |
| `animate-df-scale-in` | entrada com escala |
| `animate-df-marquee` | faixa que corre, com pausa no hover e no foco |
| `animate-df-shimmer` | brilho de esqueleto |
| `df-lift` | cartão sobe 2 px no hover e responde ao toque |
| `df-press` | botão encolhe para 0.98 no toque |
| `df-underline` | sublinhado cresce da esquerda no hover e no foco |
| `df-collapse` | painel abre por `grid-template-rows`, nunca por altura |
| `df-marquee` | trilha de faixa com máscara nas pontas |
| `df-shimmer` | esqueleto de carregamento com os papéis do tema |

A cascata usa `data-df-stagger` no pai. Os filhos recebem um índice em `--df-i`
e o atraso é calculado por `--stagger`, que o tema define em 60 ms. A revelação
só esconde o conteúdo quando o script adiciona a classe `js` ao `html`; sem
JavaScript e com animação por rolagem do navegador, o conteúdo aparece.

As durações e curvas vêm do tema: `--duration-instant` (100 ms),
`--duration-fast` (150 ms), `--duration-base` (250 ms), `--duration-slow`
(500 ms) e `--duration-slower` (800 ms), com `--ease-out-expo`,
`--ease-out-quart` e `--ease-spring` entre as curvas.

### O que se move

- Só `transform`, `opacity`, `clip-path`, `mask` e `background-position`
  animam. Nunca `transition-all`. Nunca `width`, `height`, `top`, `left`,
  `margin` ou `padding`.
- Um sinal de hover por elemento, no contêiner, nunca só na imagem.
- Laço pausa no hover, no foco e fora da tela. Com movimento reduzido, o laço
  para.
- Fundo animado fica em seção curta. Atrás de texto longo, prefira o estático e
  ponha o movimento no conteúdo.
- O componente React lê `useReducedMotion()` e renderiza o estado final.

Nove presets de fundo se movem, com brilho que pulsa, feixe que varre ou grade
com foco. Use um por página.

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

O CSS continua sendo a primeira escolha. Ele custa menos, funciona sem
JavaScript e não depende de hidratação. O Motion entra no que o CSS não
expressa bem.

## Conferir

- O CSS de entrada importa `designfy-backgrounds.css` e `designfy-motion.css`.
- `designfy theme check` aprova o contraste do texto sobre o padrão escolhido.
- Cada seção declara um nível de fundo: superfície, faixa ou padrão.
- Todo movimento tem versão parada em `prefers-reduced-motion`.
- Laços pausam no hover, no foco e fora da tela.
- Nenhum arquivo usa `transition-all` nem anima altura ou largura.
