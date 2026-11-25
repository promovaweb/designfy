# Fundos

O fundo dá ritmo à página e separa seções sem precisar de caixa. O
Designfy padroniza três níveis: superfície, faixa e padrão.

## Os três níveis

| Nível | O que é | Classe ou componente |
| --- | --- | --- |
| superfície | a cor da página | `bg-background` |
| faixa | seção inteira tingida | `bg-muted/60`, `bg-card`, ou `bg-primary text-primary-foreground` numa chamada |
| padrão | desenho discreto atrás do conteúdo | componente `Background` com um preset |

Regra de uso numa página de site:

- A maior parte das seções fica na superfície.
- Uma faixa tingida a cada duas ou três seções marca mudança de assunto.
- Padrão no hero, na chamada final e, no máximo, em mais uma seção. Um
  padrão por tela visível.
- Em sistema: superfície e cartão. Padrão só em tela de entrada, estado
  vazio e página de erro.

## Componente `Background`

```bash
designfy components add background
```

Copia o componente e `designfy-backgrounds.css`. Importe o CSS uma vez no
CSS de entrada.

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

- `preset`: o slug de um dos 334 presets. O
  [catálogo](backgrounds/catalogo.md) reúne 257 desenhos distintos e indica
  a fonte, a técnica, os papéis de cor e os equivalentes por categoria.
- `fade`: `none`, `bottom`, `edges` ou `radial`. Aplica uma máscara na
  camada do padrão para o texto manter contraste.

Todos os presets leem os papéis do tema (`--background`, `--foreground`,
`--border`, `--muted`, `--primary`, `--accent`, `--chart-3` a `--chart-5`).
Trocar a paleta ou o modo escuro muda o fundo junto; nenhum preset tem cor
literal.

## Escolher o preset

| Categoria | O que traz | Combina com |
| --- | --- | --- |
| `geometric` | grades, pontos, linhas, hachuras | produto técnico, ferramenta, documentação, sistema |
| `gradients` | lavagens e brilhos radiais | página de venda, marca suave, chamada final |
| `decorative` | texturas e composições | marca com personalidade, páginas editoriais |
| `effects` | holofotes, auroras, brilhos animados | hero de lançamento; use um por página |

Cada preset tem em `presets.json` o campo `legibility`:

| Valor | Como usar |
| --- | --- |
| `text-safe` | pode ficar atrás de título e texto curto |
| `needs-fade` | use com `fade="radial"` ou `fade="bottom"` e meça o contraste |
| `decorative-only` | só em área sem texto: lateral do hero, painel de marca, rodapé |

A classificação é uma estimativa do gerador. A conferência final é a
medida de contraste no ponto mais difícil atrás do texto e a captura nos
dois temas.

Padrão geométrico com nada por baixo vira enfeite. Ele funciona quando
sugere a matéria do produto: grade para ferramenta de layout, pontos para
mapa e dado, linhas para papel e documento.

## Movimento nos fundos

Nove presets se movem (brilho que pulsa, feixe que varre, grade com foco).
Use um por página, em seção curta. Todos param com `prefers-reduced-motion`
e quando saem da tela. Fundo animado atrás de texto longo distrai: prefira
o estático e ponha o movimento no conteúdo.

## Fundos próprios

Quando nenhum preset serve, escreva um novo na mesma regra:

```css
[data-df-bg="meu-padrao"] {
  background-color: var(--background);
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px),
    radial-gradient(40rem 20rem at 80% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 60%);
  background-size: 3rem 3rem, 100% 100%;
}
```

- só papéis do tema, com transparência por `color-mix`;
- linhas e pontos entre 6% e 14% de `foreground`;
- brilhos entre 10% e 22% de `primary` ou `accent`;
- no máximo três camadas;
- registre o slug em `## Fundos e profundidade` do guia.

## Imagem e vídeo como fundo

- Imagem real do projeto, com `width`, `height`, `sizes` e prioridade alta
  quando está no hero.
- Película entre a mídia e o texto, com o contraste medido.
- Vídeo mudo, em laço, com `poster`, sem som e com pausa; no celular e com
  economia de dados, só o `poster`.

## Origem dos presets

O ReactBD BG fornece 314 presets sob a licença MIT. Boa parte dos padrões
vem do Pattern Craft de Megh Bari. Os dados originais estão em
`backgrounds/reactbd-bg.json`.

O GradientDeck fornece outros 20 presets e convida visitantes a copiar o
código para seus projetos. O site não publica licença para os padrões.
A Promovaweb escolheu incluí-los em 24 de novembro de 2026. Os dados
originais estão em `backgrounds/gradientdeck.json`.

O Designfy mantém a geometria e converte as cores das duas fontes em
papéis do tema. Os créditos e a licença MIT estão no
[aviso de terceiros](backgrounds/NOTICE.md).
