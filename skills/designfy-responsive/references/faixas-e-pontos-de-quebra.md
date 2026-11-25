# Faixas de largura e pontos de quebra

## Pontos de quebra do Tailwind 4

| Prefixo | Largura mínima | Aparelhos típicos |
| --- | --- | --- |
| (sem prefixo) | 0 | celulares |
| `sm:` | 640 px | celular grande deitado, tablet pequeno |
| `md:` | 768 px | tablet em pé |
| `lg:` | 1024 px | tablet deitado, notebook pequeno |
| `xl:` | 1280 px | notebook, desktop |
| `2xl:` | 1536 px | desktop largo |

Os prefixos valem "desta largura para cima". Para um intervalo:
`md:max-lg:flex`. Para "abaixo de": `max-md:hidden`. Ponto próprio:
`min-[900px]:grid-cols-3`, ou um token `--breakpoint-*` no `@theme`.

## Larguras de conferência do Designfy

| Nome | Tamanho | Por quê |
| --- | --- | --- |
| mínimo | 320 x 640 | o menor celular em uso; nada pode estourar |
| `mobile` | 390 x 844 | o celular mais comum |
| `tablet` | 820 x 1180 | tablet em pé |
| notebook | 1280 x 800 | a dobra do hero é conferida aqui |
| `desktop` | 1440 x 900 | o desenho de referência |
| `wide` | 1920 x 1080 | o container precisa segurar |

`designfy capture run` conhece `mobile`, `tablet`, `desktop` e `wide`, e
aceita `LARGURAxALTURA` para os demais.

## O que muda em cada faixa

| Faixa | Colunas | Navegação | Densidade | Entrada |
| --- | --- | --- | --- | --- |
| até 639 px | uma | gaveta ou barra inferior | maior espaço entre alvos | toque |
| 640 a 1023 px | duas | gaveta; alguns links à vista | intermediária | toque |
| 1024 a 1279 px | duas a três | menu completo; lateral recolhida | a do guia | ponteiro e toque |
| 1280 a 1535 px | três a quatro | completa | a do guia | ponteiro |
| 1536 px ou mais | as mesmas | completa | a do guia; margens maiores | ponteiro |

## Escolher o ponto de quebra

O ponto é do conteúdo, não do aparelho:

1. Comece no celular e alargue a janela devagar.
2. Quando a linha de texto passa de 75 caracteres, quando sobra um vazio
   que comporta outra coluna, ou quando dois blocos caberiam lado a lado,
   esse é o ponto.
3. Use o prefixo do Tailwind mais próximo. Só crie um ponto próprio se a
   diferença aparecer na captura.

Sinais de ponto mal escolhido: duas colunas espremidas com texto de
quatro palavras por linha; uma coluna só com 900 px de largura; menu que
quebra em duas linhas antes de virar gaveta.

## Faixa do meio

O tablet é a faixa esquecida. Confira em 820 px:

- grade de três colunas vira duas, não uma esticada;
- hero dividido pode continuar dividido com o visual menor, ou empilhar
  com o visual limitado em largura;
- barra lateral de sistema vira trilho de ícones ou gaveta;
- tabela ainda cabe com colunas prioritárias;
- alvos continuam de toque.

## Altura

- Use `svh` (menor altura visível) para algo que precisa caber na
  primeira tela e `dvh` para o que acompanha a barra do navegador.
  `vh` corta no celular.
- Aparelho deitado tem pouca altura: cabeçalho fixo alto e barra fixa no
  pé juntos comem a tela. Em `(max-height: 500px)`, solte um dos dois.
- A dobra do hero se confere em 1280 x 800 e em 390 x 844.

## Além da largura

| Consulta | Uso |
| --- | --- |
| `pointer-coarse:` | aumentar alvos em toque, em qualquer largura |
| `hover:` (já protegido pelo Tailwind 4) | efeito de hover só onde há ponteiro |
| `motion-reduce:` | versão parada |
| `dark:` | só para o que não é cor |
| `portrait:` e `landscape:` | ajustes de orientação |
| `print:` | versão de impressão de artigo, fatura, relatório |
| `@container` | o componente reage à largura do pai |

Tablet com teclado e notebook com tela de toque existem: não deduza a
entrada pela largura.

## Tela muito larga

- `df-container` limita a largura e centraliza; as margens crescem.
- Grades mantêm a contagem de colunas de 1440 px.
- Texto corrido continua na medida.
- Fundo e faixa de seção vão de borda a borda; o conteúdo, não.
- Em sistema, a área de trabalho pode usar a largura (tabela larga), com
  um teto em `max-w-screen-2xl` e painéis laterais para o espaço extra.
