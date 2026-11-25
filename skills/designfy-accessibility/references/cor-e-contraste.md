# Cor e contraste

A medição e a correção dos pares do tema estão na
`designfy-design-system` (referência de contraste). Aqui fica o que
conferir na tela pronta.

## Limites

| Elemento | Mínimo AA |
| --- | --- |
| texto até 24 px (ou 19 px em negrito) | 4.5:1 |
| texto grande | 3:1 |
| ícone com função, sem texto ao lado | 3:1 |
| borda que delimita um campo | 3:1 |
| indicador de estado (marcado, selecionado, alternador) | 3:1 |
| anel de foco | 3:1 contra o entorno |
| partes de gráfico necessárias para entender | 3:1 |
| texto desativado, decoração, logo | sem exigência |

Meta do Designfy para o corpo do texto: 7:1.

## Medir

```bash
designfy theme check
designfy palette contrast "<texto>" "<fundo>"
node skills/designfy-accessibility/assets/axe-playwright.mjs <url>
```

- `theme check` mede os pares do tema nos dois modos.
- O axe mede o texto renderizado, mas não mede texto sobre imagem,
  gradiente ou padrão: meça à mão no ponto mais difícil.
- Meça no tema claro e no escuro.

## Onde o contraste costuma falhar

| Lugar | Correção |
| --- | --- |
| texto secundário claro demais | `muted-foreground` com 4.5:1 sobre todas as superfícies que usa |
| texto de exemplo do campo | o mesmo limite de 4.5:1 |
| texto sobre `primary` | `primary-foreground`, medido |
| cinza sobre fundo colorido | o `*-foreground` do papel |
| texto sobre imagem ou padrão | película entre os dois; medir no ponto mais claro e no mais escuro |
| borda de campo quase invisível | `--input` com 3:1 sobre o fundo |
| selo de estado em fundo tingido | texto do papel sobre o fundo tingido, medido |
| link no meio do texto | 4.5:1 com o fundo, e sublinhado |
| botão desativado | sem exigência, mas precisa parecer botão; explique o motivo |
| tema escuro | bordas e texto secundário somem; meça de novo |
| série de gráfico clara sobre cartão | 3:1 com o fundo do cartão |

## Nada só por cor

| Informação | Além da cor |
| --- | --- |
| erro no campo | ícone, mensagem e `aria-invalid` |
| obrigatório | texto ou asterisco com legenda |
| estado do registro | palavra no selo |
| link | sublinhado |
| item atual do menu | marcador, peso ou fundo, e `aria-current` |
| variação de indicador | sinal, seta com nome e palavra |
| série de gráfico | rótulo direto, traço ou marcador diferente |
| selecionado | caixa marcada, borda, ícone |
| sucesso ou falha em lista | ícone e texto |
| gráfico de calor | valor escrito na célula ou na dica |

Teste: a tela em tons de cinza ainda diz tudo?

## Daltonismo

Perto de 8% dos homens confundem vermelho e verde. Não ponha vermelho e
verde como único par de significados; use também forma, posição e texto.
Nas séries de gráfico, varie a luminosidade além do matiz. Simule nas
ferramentas do navegador (painel de renderização, deficiências de visão).

## Modos do sistema

- **Alto contraste forçado** (`forced-colors: active`): o sistema troca
  as cores. Bordas e contornos continuam; fundos e sombras somem. Estado
  indicado só por cor de fundo desaparece: garanta uma borda ou um ícone.
  Não desligue com `forced-color-adjust: none`, salvo em amostra de cor.
- **Mais contraste** (`prefers-contrast: more`): reforce bordas e texto
  secundário quando o projeto atende esse público.
- **Tema escuro**: os pares são medidos de novo.

## Transparência e sobreposição

Texto sobre superfície translúcida tem o contraste do que está atrás.
Cabeçalho com desfoque sobre conteúdo variado precisa de opacidade
suficiente (`bg-background/85` ou mais) para o texto do menu manter
4.5:1.

## Foco

O anel usa `ring`, com 3:1 contra a superfície. Em botão `primary`, o
deslocamento de 2 px deixa o anel sobre o fundo da página, onde contrasta.
Confira em cada superfície: `background`, `card`, `muted`, `primary`,
`sidebar`.
