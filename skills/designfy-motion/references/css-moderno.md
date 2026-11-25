# CSS moderno para movimento

Recursos do CSS que substituem JavaScript. Todos entram como melhoria:
navegador sem suporte mostra o conteúdo parado e completo.

## Animação ligada à rolagem

A animação anda com a rolagem, não com o tempo.

```css
/* Barra de progresso de leitura: cresce com a rolagem da página */
.reading-progress {
  transform-origin: left;
  animation: grow linear both;
  animation-timeline: scroll(root block);
}
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```

```css
/* Revelação: anima enquanto o elemento entra na área visível */
.card {
  animation: df-fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
```

- `scroll()` segue a rolagem de um contêiner; `view()` segue a posição do
  próprio elemento na área visível.
- `animation-range` recorta o trecho: `entry`, `exit`, `cover`, `contain`,
  com porcentagens.
- Curva `linear`; a rolagem já dá o ritmo.
- Só `transform`, `opacity` e `clip-path`.
- Envolva em `@supports (animation-timeline: view())` e em
  `@media (prefers-reduced-motion: no-preference)`.
- Sem suporte: reserva com `IntersectionObserver` (o runtime do Designfy)
  ou conteúdo parado.

Use para: barra de progresso, linha de passos que desenha, visual que
escala de leve ao atravessar a tela, cabeçalho que encolhe. Não use para
prender a rolagem nem para mover texto que a pessoa está lendo.

## Estado inicial de quem acabou de aparecer

```css
dialog[open] {
  opacity: 1;
  transform: none;
  transition: opacity var(--duration-base) var(--ease-out-quart),
    transform var(--duration-base) var(--ease-out-quart),
    overlay var(--duration-base) allow-discrete,
    display var(--duration-base) allow-discrete;

  @starting-style {
    opacity: 0;
    transform: scale(0.96);
  }
}
dialog:not([open]) { opacity: 0; transform: scale(0.96); }
```

`@starting-style` define de onde a transição parte quando o elemento passa
a existir ou sai de `display: none`. Com `transition-behavior:
allow-discrete`, a saída também anima. No Tailwind: `starting:` e
`transition-discrete`.

Use para diálogo e popover nativos, item acrescentado a uma lista e
mensagem de erro que aparece.

## Abrir e fechar sem animar altura

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-base) var(--ease-out-quart); }
.panel[data-df-open] { grid-template-rows: 1fr; }
.panel > * { overflow: hidden; min-height: 0; }
```

É a utilidade `df-collapse`. Funciona com conteúdo de qualquer altura e
não mede nada em JavaScript.

`<details>` com `interpolate-size: allow-keywords` e `::details-content`
também anima em navegadores recentes; trate como melhoria.

## Transição entre páginas e estados

```css
@view-transition { navigation: auto; }

.post-cover { view-transition-name: cover; }
```

- `@view-transition { navigation: auto; }` liga a transição entre páginas
  do mesmo site, sem JavaScript, em navegadores com suporte.
- `view-transition-name` igual em duas páginas faz o elemento viajar de
  uma para a outra (capa do cartão vira capa do artigo). O nome é único
  por página.
- Em página única, `document.startViewTransition(() => atualizar())`
  anima a troca de estado do DOM.
- No Astro, `<ClientRouter />` e `transition:name` fazem o mesmo com
  reserva para navegador sem suporte.
- O padrão é uma troca por opacidade; o `designfy-motion.css` ajusta a
  duração pelos tokens.

Use para navegação entre listagem e detalhe, troca de tema, ordenação de
grade. Mantenha curto (150 a 300 ms): a pessoa quer chegar.

## Âncora e rolagem

```css
html { scroll-behavior: smooth; scroll-padding-top: calc(var(--header-height) + 1rem); }
:target { animation: df-pulse-soft 1.2s 1; }
```

O tema já liga a rolagem suave fora do movimento reduzido e reserva a
altura do cabeçalho fixo. Carrossel simples sai com `scroll-snap-type` e
`scroll-snap-align`, sem biblioteca.

## Propriedades registradas

```css
@property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
.ring { background: conic-gradient(from var(--angle), var(--primary), transparent 30%); animation: turn 6s linear infinite; }
@keyframes turn { to { --angle: 360deg; } }
```

`@property` dá tipo a uma variável, e então ela pode ser animada. Serve
para gradiente que gira, borda com feixe e holofote que segue um ponto.

## Movimento ao longo de um caminho

```css
.beam { offset-path: rect(0 100% 100% 0 round 12px); animation: df-border-beam 6s linear infinite; }
```

`offset-path` e `offset-distance` movem um elemento pelo contorno de uma
caixa ou por um traçado. É a base do `animate-df-border-beam`.

## Resumo de suporte

Confira o suporte atual antes de depender de um recurso
(<https://caniuse.com> ou a página do recurso na MDN). Regra do Designfy:

| Recurso | Como usar |
| --- | --- |
| transição, animação, `transform`, `opacity` | base |
| `@starting-style`, `transition-behavior` | melhoria; sem suporte, aparece sem transição |
| animação ligada à rolagem | melhoria; reserva pelo runtime |
| transição entre páginas | melhoria; sem suporte, navegação normal |
| `@property`, `offset-path` | melhoria; sem suporte, o efeito fica parado |
