# Formas e profundidade

## Raios

Um token gera a família: `--radius` (10 px por padrão).

| Classe | Valor | Uso |
| --- | --- | --- |
| `rounded-sm` | raio - 4 px | selo, caixa de seleção |
| `rounded-md` | raio - 2 px | campo, botão compacto |
| `rounded-lg` | raio | botão, cartão pequeno |
| `rounded-xl` | raio + 4 px | cartão, painel, moldura de imagem |
| `rounded-2xl` | raio + 8 px | bloco grande, diálogo |
| `rounded-full` | pílula | avatar, marcador, alternador |

- Raio por nível, concêntrico: o raio de dentro é o de fora menos o
  preenchimento.
- Caráter pelo token: 4 a 6 px lê técnico e preciso; 10 a 12 px, amigável;
  16 px ou mais, lúdico. Escolha uma vez, no guia.
- Não misture pílula e canto reto no mesmo conjunto de controles.

## Bordas

- 1 px em `border-border`. Mais grosso só para estado (selecionado, erro)
  e nunca mudando a largura entre estados: troque a cor ou use `ring`.
- Borda ou sombra num cartão, não as duas.
- Divisores entre itens irmãos com `divide-border`; sem linha no primeiro e
  no último.
- Faixa lateral colorida em cartão é vício de página gerada. Para
  destacar, use o fundo, o título ou um selo com texto.

## A escada de superfícies

Antes de criar um cartão, suba os degraus na ordem:

1. espaço em branco;
2. uma linha fina;
3. uma faixa ou um bloco tingido (`bg-muted`), sem borda;
4. um cartão (`bg-card` com borda).

Cartão é para conteúdo que se repete, que é clicável ou que tem outra
natureza. Nunca cartão dentro de cartão, nem caixa com borda dentro de
bloco tingido.

## Sombras

| Nível | Classe | Uso |
| --- | --- | --- |
| nenhum | | conteúdo no plano da página |
| baixo | `shadow-xs`, `shadow-sm` | botão, cartão que precisa descolar do fundo |
| médio | `shadow-md`, `shadow-lg` | menu, dica, cartão em hover |
| alto | `shadow-xl`, `shadow-2xl` | diálogo, gaveta, moldura do visual do hero |

- A cor da sombra vem do tema: `shadow-foreground/5` a `/15`. Nada de
  sombra colorida brilhando no escuro.
- No tema escuro, elevação é superfície mais clara (`card` acima de
  `background`, `popover` acima de `card`), com sombra discreta.
- Sombra só se anima por opacidade ou por troca de classe com
  `transition-shadow`; nunca dentro de `transition-all`.

## Ícones

- Uma biblioteca por projeto. O padrão é Lucide (`lucide-react`), com
  traço de 1.5 ou 2 px.
- Tamanho de 16 px ao lado de `text-sm`, 20 px ao lado de `text-base`.
- Ícone decorativo com `aria-hidden`; ícone sozinho em botão exige nome
  acessível.
- Emoji não é ícone.
- Ícone dentro de moeda colorida acima de título, repetido em três
  colunas, é outro vício: prefira o ícone em linha com o título ou um
  visual real.

## Imagens

- Raio da moldura igual ao do cartão do mesmo nível.
- `aspect-ratio` fixo no contêiner, `object-cover` na imagem, `width` e
  `height` sempre declarados.
- Moldura de produto: borda, sombra alta e o conteúdo real dentro. Não
  desenhe barra de navegador nem janela de sistema à mão.
- Sem imagem real, a região não entra ou vira lacuna visível no viewspec.

## Foco

O tema aplica `outline: 2px solid var(--ring)` com 2 px de distância em
`:focus-visible`. Não remova. Em campo, o anel pode ser interno
(`outline-offset: -1px`). O anel aparece na hora, sem transição, e mede
3:1 contra o que está atrás.
