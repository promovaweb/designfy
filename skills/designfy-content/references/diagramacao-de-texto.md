# Diagramação de texto

O que faz um texto longo ser confortável de ler numa tela.

## Medida

A medida é o comprimento da linha. Fora da faixa, o olho se perde na
volta (linha longa) ou quebra o ritmo (linha curta).

| Contexto | Caracteres por linha |
| --- | --- |
| artigo e guia | 60 a 75 (ideal perto de 68) |
| documentação técnica | 70 a 80 |
| celular | 40 a 55, o que a tela der com margem de 16 a 20 px |
| legenda, resumo, nota lateral | 28 a 45 |
| título | 14 a 28 |

Implementação: `max-width` em `ch` no bloco de texto (`df-measure` aplica
68ch; o `prose` do registro já vem assim). O contêiner do artigo pode ser
mais largo que a medida para abrigar figura larga e índice; o texto não.

## Tamanho e altura de linha

| Texto | Tamanho | Altura de linha |
| --- | --- | --- |
| corpo de artigo | 17 a 19 px no desktop, 16 a 17 px no celular | 1.65 a 1.75 |
| corpo de documentação | 16 px | 1.6 a 1.7 |
| lead (parágrafo de abertura) | 20 a 22 px | 1.5 |
| legenda e nota | 14 px | 1.5 |
| código em bloco | 14 a 15 px | 1.6 |
| título `h2` | 28 a 32 px | 1.2 |
| título `h3` | 22 a 24 px | 1.3 |
| título `h4` | 18 a 20 px, em negrito | 1.4 |

Quanto mais longa a linha, maior a altura de linha. Fonte serifada no
corpo aceita um ponto a mais de tamanho.

## Ritmo vertical

A regra de proximidade: o espaço acima de um título é maior que o espaço
abaixo dele, para o título ficar com o texto que ele abre.

| Elemento | Espaço acima | Espaço abaixo |
| --- | --- | --- |
| parágrafo | | 1.25em |
| `h2` | 2.5em | 0.75em |
| `h3` | 2em | 0.6em |
| lista | 1.25em | 1.25em |
| item de lista | 0.4em entre itens | |
| figura, tabela, código, aviso | 2em | 2em |
| citação | 1.75em | 1.75em |

O `prose` do registro aplica essa escala. Não zere margens de um elemento
para "apertar"; mude o tamanho do `prose` (`compact`, `default`, `lg`).

## Alinhamento e quebra

- À esquerda, com a margem direita irregular. Nunca justificado na web.
- `text-wrap: pretty` nos parágrafos e `balance` nos títulos (já no tema).
- Hifenização: `hyphens: auto` com `lang` correto no documento ajuda em
  coluna estreita; desligue em títulos.
- Sem palavra sozinha na última linha de um título.

## Fonte de leitura

- Sans ou serifada, as duas funcionam. O que importa: altura de x
  generosa, itálico e negrito de verdade, algarismos bem desenhados.
- Um par só: título em `font-heading`, corpo em `font-sans`. Trocar o
  corpo por uma serifada só no artigo é uma opção do guia do projeto, com
  a variável `--df-font-sans` redefinida num seletor do artigo.
- Mono (`font-mono`) para código, comando e tecla.

## Ênfase

| Recurso | Uso |
| --- | --- |
| negrito | termo que a pessoa procura ao passar os olhos; poucas vezes por tela |
| itálico | título de obra, termo estrangeiro, ênfase de fala |
| código em linha | nome de comando, arquivo, variável |
| sublinhado | só link |
| caixa alta | sigla |
| cor | nunca para ênfase em texto corrido |

## Cor

- Corpo em `foreground`, com 7:1 ou mais sobre `background`.
- Texto secundário (data, legenda) em `muted-foreground`, com 4.5:1 ou
  mais.
- Link em `primary`, sublinhado, com cor de visitado quando o conteúdo é
  de consulta.
- Fundo do artigo: a superfície da página. Nada de padrão atrás de texto
  corrido.
- No tema escuro, texto um pouco abaixo do branco e fundo acima do preto:
  o tema já faz isso.

## Largura do artigo e colunas

| Largura da tela | Layout |
| --- | --- |
| celular | uma coluna, margem de 16 a 20 px |
| tablet | uma coluna com a medida, centralizada |
| desktop médio | uma coluna com a medida; figura larga pode passar da medida |
| desktop largo (1280 px ou mais) | medida mais índice na lateral |

Texto em duas colunas de jornal não funciona na tela: a pessoa teria de
rolar para cima no meio da leitura.

## Leitura no celular

- Tamanho do corpo igual ou maior que no desktop.
- Margens laterais de 16 px no mínimo.
- Alvos de toque dos links em linha com espaço entre si.
- Elemento largo rolando na própria caixa, com indicação de que rola
  (sombra ou corte na borda).
- Índice recolhido no topo do artigo.

## Conferir a diagramação

Conte os caracteres de três linhas cheias do corpo em 1440 px e em 390
px. Abra o artigo mais longo e leia dois minutos: se o olho se perde na
volta da linha, reduza a medida; se a leitura parece apertada, aumente a
altura de linha.
