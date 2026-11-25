# Toque, polegar e celular

## Alvos de toque

- 44 por 44 px no mínimo (48 px é melhor em ação principal).
- 8 px entre alvos vizinhos.
- O desenho pode ser menor que o alvo: aumente a área com preenchimento
  ou com um pseudo-elemento.

```html
<button class="relative size-8 after:absolute after:-inset-2">…</button>
<a class="inline-flex min-h-11 items-center px-3">…</a>
```

- `pointer-coarse:min-h-12` aumenta em qualquer aparelho com toque.
- Links dentro de texto corrido ficam com a altura da linha: dê espaço
  entre eles e evite dois links grudados.
- Caixa de seleção e opção: o rótulo inteiro é clicável.

## Zona do polegar

Num celular segurado com uma mão, o polegar alcança bem a metade de baixo
e mal os cantos de cima.

| O quê | Onde |
| --- | --- |
| ação principal da tela | barra fixa no pé, ou logo depois do conteúdo |
| navegação entre áreas frequentes | barra inferior |
| ação destrutiva | longe da principal |
| menu, busca, conta | topo |
| fechar gaveta e diálogo | botão no topo, e arrastar para baixo em folha inferior |

## Sem hover

No toque não existe hover. Tudo o que aparece no hover precisa de outro
caminho:

| No ponteiro | No toque |
| --- | --- |
| dica com o nome do botão | rótulo visível ou nome acessível |
| ações que aparecem ao passar na linha | menu sempre visível, ou cartão com as ações |
| prévia ao passar | toque abre |
| submenu ao passar | toque abre; outro toque fora fecha |

O Tailwind 4 só aplica `hover:` em aparelho com ponteiro, então o estilo
de hover não "gruda" depois do toque. Dê resposta ao toque com `active:`.

## Gestos

- Deslizar para fechar gaveta e folha inferior, sempre com botão de
  fechar também.
- Carrossel com arrastar e `scroll-snap`, com botões de anterior e
  próximo.
- Puxar para atualizar só onde o padrão do aparelho já faz isso.
- Nenhuma ação exige gesto complexo (dois dedos, arrastar preciso): há
  sempre um toque simples que faz o mesmo.
- `touch-action: manipulation` em controles (já no tema) tira o atraso do
  toque duplo.

## Teclado virtual

O teclado cobre metade da tela.

- `type` e `inputmode` certos chamam o teclado certo (`email`, `tel`,
  `numeric`, `decimal`, `url`, `search`).
- `autocomplete` deixa o aparelho preencher.
- `enterkeyhint` rotula a tecla Enter (`next`, `send`, `search`, `done`).
- Fonte de 16 px nos campos: abaixo disso o iOS amplia a página no foco.
- O campo em foco rola para a área visível; a barra de ações fixa não
  cobre o campo (use `dvh` e teste).
- Formulário longo: um campo por linha, avanço com a tecla "próximo".
- Não abra o teclado sozinho ao carregar a página, salvo numa tela de um
  campo só.

## Áreas seguras

Aparelhos com recorte e com barra de gestos têm faixas que o conteúdo
deve respeitar:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

```css
.bottom-bar { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }
.page { padding-inline: max(1rem, env(safe-area-inset-left)); }
```

Nunca `maximum-scale=1` nem `user-scalable=no`: tiram a ampliação de quem
precisa.

## Barras fixas

- No máximo uma no topo e uma no pé.
- Altura somada abaixo de um quarto da tela.
- O conteúdo tem preenchimento igual à altura da barra do pé, para o
  último item não ficar coberto.
- Em aparelho deitado, a barra do pé deixa de ser fixa.

## Rolagem

- Uma rolagem vertical por tela. Região com rolagem própria dentro da
  página (lista em painel, tabela) tem altura clara e indicação.
- Rolagem horizontal só em região que mostra que rola: item cortado na
  borda, sombra, ou indicador.
- `overscroll-behavior: contain` em gaveta e diálogo, para a página de
  trás não rolar junto.
- Rolagem presa por animação não existe.

## Desempenho no celular

- Imagens no tamanho da tela; a do hero com prioridade.
- Menos JavaScript: ilhas com `client:visible`, fachada em vídeo.
- Fundos animados pesados dão lugar ao estático abaixo de 768 px.
- Fontes: só os pesos usados.

## Orientação

Nada trava a orientação. Deitado: menos altura, então cabeçalho menor e
conteúdo em duas colunas quando cabe.

## Conferir no aparelho real

A captura mostra o layout; o toque só se confere no dedo. Abra a tela num
celular e faça a tarefa principal com uma mão: alcançou a ação? Acertou
os alvos de primeira? O teclado cobriu o campo? Algo dependia de hover?
