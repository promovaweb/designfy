# Receitas de movimento

Uma receita por componente, com a ferramenta mais leve que resolve. As
classes `animate-df-*`, `df-*` e os atributos `data-df-*` vêm de
`designfy-motion.css`. Durações e curvas são tokens do tema.

## Entrada da primeira dobra

CSS puro, para rodar antes do JavaScript.

```html
<p class="animate-df-fade-up">Nome do produto</p>
<h1 class="animate-df-fade-up [animation-delay:80ms]">Título</h1>
<p class="animate-df-fade-up [animation-delay:160ms]">Uma frase.</p>
<div class="animate-df-fade-up [animation-delay:240ms]">…ações…</div>
<figure class="animate-df-fade-up [animation-delay:200ms] [animation-duration:var(--duration-slower)]">…</figure>
```

Total até 800 ms. A imagem principal não espera a animação para carregar.

## Revelação ao rolar

```html
<header data-df-reveal>…</header>
<ul data-df-stagger>
  <li data-df-reveal>…</li>
  <li data-df-reveal>…</li>
</ul>
<figure data-df-reveal="mask">…</figure>
```

Em React com Motion:

```tsx
<Reveal as="ul" stagger={0.06} className="grid gap-6 md:grid-cols-3">
  {items.map((item) => <RevealItem as="li" key={item.id}>…</RevealItem>)}
</Reveal>
```

Uma vez por elemento. Não revele o que já está na primeira dobra.

## Botão

```html
<button class="df-press bg-primary text-primary-foreground hover:bg-primary/90">Salvar</button>
```

Carregando, sem mudar de largura:

```tsx
<button aria-busy={pending} disabled={pending} className="relative …">
  <span className={pending ? "opacity-0" : undefined}>Salvar</span>
  {pending ? <Spinner className="absolute inset-0 m-auto size-4 animate-spin df-keep-motion" /> : null}
</button>
```

Marca de feito depois do envio:

```html
<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
  <path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="2"
    pathLength="1" stroke-dasharray="1" class="animate-df-check" style="--df-path-length: 1" />
</svg>
```

## Link

```html
<a class="df-underline" href="/cursos/">Ver todos os cursos</a>
```

Link com seta: a seta anda 2 px no hover (`group-hover:translate-x-0.5`
com `transition-transform`).

## Cartão clicável

```html
<article class="df-lift relative rounded-xl border border-border bg-card p-6">
  <h3><a href="…" class="after:absolute after:inset-0">Título</a></h3>
</article>
```

Com imagem: a imagem escala dentro da moldura, não o cartão.

```html
<div class="overflow-hidden rounded-lg">
  <img class="transition-transform duration-(--duration-slow) ease-out-quart group-hover:scale-[1.03]" …>
</div>
```

Um sinal por cartão: ou a elevação, ou a escala da imagem.

## Cabeçalho que reage à rolagem

```html
<div data-header-sentinel class="absolute top-0 h-2 w-px"></div>
<header class="sticky top-0 z-30 border-b border-transparent bg-background/0 transition-[background-color,border-color,box-shadow] duration-(--duration-base) data-[scrolled]:border-border data-[scrolled]:bg-background/85 data-[scrolled]:backdrop-blur">
```

```ts
const header = document.querySelector("header")!;
new IntersectionObserver(([e]) => header.toggleAttribute("data-scrolled", !e.isIntersecting))
  .observe(document.querySelector("[data-header-sentinel]")!);
```

Esconder ao descer e mostrar ao subir (celular): compare a posição da
rolagem num ouvinte passivo e alterne `data-hidden`, com
`transition-transform` e `-translate-y-full`.

## Menu, popover e dica

Com shadcn, os primitivos já animam por `data-state`. Padrão: origem no
gatilho, escala de 0.96 para 1 e opacidade em 150 ms; saída em 100 ms.

Nativo, sem JavaScript de animação:

```html
<div popover class="opacity-0 scale-95 transition-[opacity,scale,display,overlay] transition-discrete duration-(--duration-fast) open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95">
```

Dica: aparece depois de 300 ms no hover e na hora no foco.

## Diálogo e gaveta

- Fundo: opacidade em 150 ms.
- Diálogo: escala de 0.96 e opacidade em 200 ms; saída em 150 ms.
- Gaveta: desliza da borda em 300 ms com `ease-out-expo`; saída em 200 ms.
- No celular, o diálogo vira folha inferior e acompanha o dedo (Vaul).

```tsx
<AnimatePresence>
  {open ? (
    <>
      <motion.div className="fixed inset-0 bg-foreground/40" {...presence.fade} />
      <motion.aside className="fixed inset-y-0 right-0 w-full max-w-md bg-background" {...presence.drawerRight} />
    </>
  ) : null}
</AnimatePresence>
```

## Sanfona e seção condicional

```html
<button aria-expanded="false" aria-controls="p1" class="group flex w-full items-center justify-between">
  Pergunta
  <svg class="transition-transform duration-(--duration-base) group-aria-expanded:rotate-180" …/>
</button>
<div id="p1" class="df-collapse"><div>Resposta…</div></div>
```

O script alterna `aria-expanded` e `data-df-open`. Com `details`, o
conteúdo continua acessível sem JavaScript.

## Abas e controle segmentado

Indicador que desliza (React):

```tsx
{active === tab.id ? <motion.span layoutId="indicator" className="absolute inset-0 rounded-md bg-muted" transition={transition.layout} /> : null}
```

Sem Motion: o indicador é um elemento posicionado por variáveis CSS
(`--x`, `--w`) com `transition-transform`. O conteúdo do painel entra com
opacidade em 150 ms.

## Faixa rolante

```html
<div class="df-marquee" style="--df-marquee-duration: 36s; --df-marquee-gap: 3rem">
  <ul>…itens…</ul>
  <ul aria-hidden="true">…os mesmos itens…</ul>
</div>
```

Dois grupos idênticos; o segundo com `aria-hidden`. Velocidade constante em
pixels por segundo: ajuste a duração ao tamanho do grupo. Pausa no hover e
no foco, para fora da tela e com movimento reduzido.

## Contador

Uma vez, ao aparecer:

```html
<span data-df-count="12840" class="tabular-nums">12.840</span>
```

O valor final está no HTML; o runtime conta até ele. Valor que muda ao
vivo, em React:

```tsx
<NumberFlow value={revenue} format={{ style: "currency", currency: "BRL" }} />
```

Só número real.

## Esqueleto

```html
<div class="df-shimmer h-4 w-40 rounded bg-muted"></div>
```

O esqueleto tem a forma do conteúdo. Aparece depois de 200 ms de espera e
fica pelo menos 300 ms, para não piscar. Troca para o conteúdo com
opacidade em 150 ms.

## Aviso curto

Sobe 8 px com opacidade em 200 ms; empilha com escala decrescente; sai em
150 ms depois de 5 s; pausa no hover e no foco. O `sonner` faz isso; ajuste
só a duração.

## Erro de campo e de envio

```html
<p id="email-error" class="animate-df-fade-down text-sm text-destructive [--reveal-distance:4px]">Informe um e-mail válido.</p>
```

No envio com falha, o formulário treme uma vez: `animate-df-shake` no
contêiner dos campos, removido ao fim. O tremor acompanha o texto do erro;
nunca substitui.

## Linha de tabela

- Primeira carga: até dez linhas com `animate-df-fade-in` e atraso de
  30 ms por linha.
- Linha nova ou alterada: fundo em `accent` que some.

```css
@keyframes row-flash { from { background-color: var(--accent); } to { background-color: transparent; } }
.row-updated { animation: row-flash 1s var(--ease-out-quart) 1; }
```

- Linha removida: `df-collapse` de fechamento e opacidade, com aviso de
  desfazer.
- Barra de ações em lote: sobe de baixo (`presence.slideUp`).

## Gráfico

- Desenha uma vez: barras com `scaleY` a partir da base, linha com
  `animate-df-draw`, área com opacidade, em 600 a 800 ms.
- Troca de período: interpola os valores; não redesenha do zero.
- Hover: só a dica e o realce do ponto.
- Com movimento reduzido: gráfico pronto.

No Recharts, `isAnimationActive={!reduced}` e `animationDuration={700}`.

## Barra de progresso de leitura

```html
<div class="fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-primary [animation:grow_linear_both] [animation-timeline:scroll(root_block)]" aria-hidden="true"></div>
```

Sem suporte a animação ligada à rolagem, a barra fica oculta
(`@supports not (animation-timeline: scroll())`).

## Linha de passos que desenha

```css
.steps-line { transform-origin: top; animation: grow-y linear both; animation-timeline: view(); animation-range: entry 10% cover 60%; }
@keyframes grow-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
```

Cada número acende quando o passo entra (`data-df-reveal="fade"` no
marcador).

## Visual fixo com texto que rola

A coluna do visual fica `sticky`; cada bloco de texto, ao entrar no centro
da tela, define o estado ativo e o visual troca com opacidade. No celular
vira uma pilha normal: visual acima do texto de cada passo.

## Fundo que se move

```tsx
<Background preset="pulse-veil" fade="radial">…</Background>
```

Ou um deslocamento lento de um padrão estático:

```html
<div data-df-bg="signal-grid" data-df-loop class="animate-df-pan [--df-pan-x:48px] [--df-pan-y:48px]"></div>
```

Um por tela, com 20 s ou mais por volta.

## Borda com feixe

Para o plano destacado ou um cartão de novidade: um ponto de luz percorre a
borda (`animate-df-border-beam` com `offset-path`). Uma vez por página.

## Troca de tema

O ícone gira 90 graus e troca com opacidade em 200 ms. A página troca as
cores sem transição global (transição em todas as propriedades de todos os
elementos custa caro); com transições de visualização:

```ts
document.startViewTransition?.(() => root.classList.toggle("dark")) ?? root.classList.toggle("dark");
```

## Troca de página

- Astro: `<ClientRouter />` e `transition:name` nos elementos que viajam.
- Sistema em React: área principal com opacidade em 150 ms; o shell não se
  move; o foco vai para o título da nova tela.
- Lista para detalhe: a capa ou o título com o mesmo
  `view-transition-name`.

## Estado vazio

A ilustração tem um movimento só, lento (`animate-df-float`), e o bloco
entra com `animate-df-fade-in`. O botão é a parte mais viva da tela.
