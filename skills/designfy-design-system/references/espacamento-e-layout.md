# Espaçamento e layout

## Escala de espaçamento

Use só a escala do Tailwind, que anda de 4 em 4 px. Os degraus mais usados:

| Classe | Valor | Uso |
| --- | --- | --- |
| `1`, `1.5`, `2` | 4, 6, 8 px | entre ícone e texto, dentro de selo |
| `3`, `4` | 12, 16 px | dentro de controle, entre campos próximos |
| `6` | 24 px | preenchimento de cartão, entre blocos de um grupo |
| `8`, `10` | 32, 40 px | entre grupos |
| `14`, `16` | 56, 64 px | entre cabeçalho de seção e conteúdo; seção no celular |
| `24` | 96 px | entre seções no desktop |

Regras:

- `gap` para irmãos; margem só para quebrar o fluxo.
- Relação de proximidade: o espaço dentro de um grupo é menor que o espaço
  entre grupos, em pelo menos um degrau da escala.
- Acima de um título, o dobro do espaço que vai abaixo dele.
- Nada de valor arbitrário (`mt-[13px]`). Se a escala não serve, o
  problema está no layout.

## Container

```html
<div class="df-container">…</div>
```

`df-container` limita a largura a `--container-max` (1200 px por padrão),
centraliza e aplica `--gutter` nas laterais (16 a 32 px, fluido). Acima de
1440 px as margens crescem e o conteúdo não. Variações:

| Conteúdo | Largura |
| --- | --- |
| texto corrido | `max-w-3xl` ou `df-measure` |
| página de site | `df-container` |
| área de trabalho de sistema | largura total com `px-4 md:px-6`, e `max-w-screen-2xl` em telas muito largas |
| formulário | `max-w-2xl` |

## Ritmo vertical

`df-section` aplica `--section-space` (56 a 96 px) acima e abaixo de cada
seção de site. Varie a separação entre seções em vez de repetir a mesma em
todas: só espaço, uma linha fina, uma faixa em `muted`, uma faixa com
fundo de padrão. Duas seções vizinhas com a mesma faixa se juntam; alterne.

Em sistema, o ritmo é menor: 24 px entre regiões, 16 px dentro delas.

## Grade

- Grid para a página e para conjuntos; flex dentro de componentes.
- Trilhas com imagem ou texto longo usam `minmax(0, 1fr)`, para o
  conteúdo não estourar a coluna: `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`
  ou `min-w-0` nos filhos.
- Doze colunas só quando há alinhamento entre seções diferentes; na
  maioria dos casos, duas a quatro colunas explícitas bastam.
- Não deixe um item sozinho na última linha de uma grade: mude a contagem
  (seis itens em 3 por 2, cinco em 2 e 3 com larguras diferentes).
- Evite três colunas iguais de ícone, título e texto como reflexo. Quando
  os itens têm pesos diferentes, use o bento ou o bloco dividido.

## Densidade

| Densidade | Onde | Controle | Linha de tabela | Preenchimento de cartão |
| --- | --- | --- | --- | --- |
| arejada | site, página de venda | 44 a 52 px | não se aplica | 24 a 32 px |
| média | sistema de uso ocasional | 40 px | 48 px | 20 a 24 px |
| compacta | operação diária | 32 a 36 px, com área de toque de 44 px | 36 a 40 px | 12 a 16 px |

A densidade é escolhida no guia e vale para o projeto inteiro. No celular,
todo controle volta a ter 44 px de área de toque.

## Alinhamento e composição

- Um eixo principal por tela: à esquerda na maioria dos casos. Centralize
  no máximo dois elementos por bloco.
- Alinhe o texto das seções pela mesma margem esquerda do container.
- O hero ocupa uma tela e só uma: título, uma frase e a ação visíveis em
  1280 x 800.
- Cerca de 80 palavras por tela de 900 px em página de site. Mais do que
  isso, divida em duas seções ou corte.
- Uma seção tem massa: um visual de 300 px ou mais, um conjunto de três
  itens, uma tabela ou uma frase em tamanho de título. Seção só com título
  e uma linha se junta à vizinha.

## Camadas

Use a escala de `z-index` do Tailwind com papéis fixos: conteúdo `z-0`,
elevado `z-10`, menu `z-20`, cabeçalho fixo `z-30`, gaveta e diálogo
`z-40`, aviso `z-50`. Dois elementos fixos no topo nunca se sobrepõem: o
segundo usa `top-(--header-height)`.

## Conferir

- `overflow-x: clip` em `html` e `body` (já no tema) e nenhuma largura em
  `100vw`.
- Nenhuma rolagem horizontal de 320 a 1920 px (`overflowX` falso nas
  capturas).
- Em 1920 px o container continua limitado e as grades não ganham colunas.
