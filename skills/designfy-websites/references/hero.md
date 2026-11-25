# Hero

A primeira dobra responde a "o que é isto e é para mim?" em cinco
segundos. Tem título, uma frase, a ação e uma coisa para ver.

## Conteúdo

| Parte | Regra |
| --- | --- |
| nome do produto ou da página | opcional, no corpo do texto, acima do título; identifica, não anuncia |
| título (`h1`) | o que a pessoa ganha ou o que o produto faz, com os substantivos do negócio; sete palavras ou menos lê melhor |
| frase | o que é, para quem e a diferença, em até vinte palavras |
| ação principal | o verbo da ação: "Ver turmas abertas", "Criar conta", "Instalar" |
| ação secundária | mais discreta; leva a entender melhor (ver como funciona, documentação) |
| visual | o produto de verdade: captura, painel, demonstração, foto real |

Fora do hero: selo de versão, linha de licença, lista de vantagens,
contador, segundo parágrafo, avaliação com estrelas inventada. Fato
importante que não cabe aqui vai para a seção seguinte.

O teste da troca: se o título servir para o concorrente, reescreva com um
substantivo que só este projeto tem.

## Composições

| Composição | Quando | Item do registro |
| --- | --- | --- |
| dividido | há um visual real do produto para mostrar | `hero-split` |
| central | a página tem uma ideia só, ou não há visual do produto | `hero-centered` com `background` |
| com mídia | a marca tem fotografia ou vídeo fortes | `hero-media` |
| com formulário | a ação é deixar um e-mail | `hero-centered` com `newsletter-form` |

### Dividido

Texto de um lado, quadro com conteúdo real do outro. É o padrão para
produto, portal e ferramenta.

- Colunas: texto com 45% a 50%, visual com o resto.
- O quadro mostra algo útil: uma tela do produto, um painel com destinos
  reais, um trecho de código que funciona.
- O centro do visual fica na altura do bloco de texto.
- No celular: texto primeiro, visual depois, com a proporção mantida.

### Central

- No máximo dois elementos no eixo central com peso (título e ação); o
  resto é discreto.
- Título com `max-w-[18ch]`, frase com `max-w-[52ch]`.
- Um fundo com padrão e máscara radial dá corpo sem competir com o texto.
- Abaixo da dobra pode entrar o visual do produto, cortado pela borda da
  tela para puxar a rolagem.

### Com mídia

- Foto real do projeto, com recorte próprio para o celular.
- Película entre a mídia e o texto, com o contraste medido no ponto mais
  claro.
- Vídeo mudo, em laço, com `poster`, sem som e com pausa; só o `poster` no
  celular.

## A dobra

Confira nos três tamanhos:

| Tamanho | O que precisa valer |
| --- | --- |
| 1280 x 800 | título, frase, ação principal e o foco do visual visíveis sem rolar |
| 1440 x 900 | o hero ocupa uma tela e só uma; a seção seguinte começa perto do fim da tela |
| 1920 x 1080 | o container continua limitado; o título não cresce além do limite; o hero ainda cabe |
| 390 x 844 | título, frase e ação visíveis; o visual pode começar abaixo |

Como ajustar quando não fecha:

- reduza o limite superior do tamanho do título (`--text-display`);
- aperte a altura de linha do título para 1.05;
- encurte a frase para duas linhas;
- reduza o preenchimento vertical;
- nunca resolva pondo mais texto, nem diminuindo a ação.

Altura: use `min-h-[min(44rem,calc(100svh-var(--header-height)))]` no
desktop. Nunca `100vh`: no celular a barra do navegador corta.

## O visual

- Mostre o produto. Se ele existe e roda, capture a tela de verdade num
  estado que diga algo (`designfy capture run` serve para isso).
- Moldura simples: borda, raio do tema e sombra alta. Não desenhe barra de
  navegador nem janela de sistema.
- Se o produto ainda não existe, monte uma amostra dentro do quadro com
  dados que leem como amostra, e registre no viewspec que precisa virar
  captura real.
- Sem nada real para mostrar: use o hero central com tipografia forte e
  fundo com padrão.
- Imagem do hero com prioridade alta de carga e dimensões declaradas.

## Fundo

Um preset de fundo com `fade` (lista em `## Fundos e profundidade` do guia)
ou a superfície simples. Nada de brilho roxo e azul, de esferas desfocadas
flutuando ou de malha colorida atrás do texto.

## Movimento

- Texto em sequência curta (80 ms entre itens), 600 ms no total.
- Visual com opacidade e subida de 24 px em 800 ms.
- Dentro do visual, um movimento próprio e lento: estados reais trocando,
  cursor digitando um comando real, gráfico desenhando.
- Fundo com movimento discreto, opcional.
- Com movimento reduzido, tudo no lugar desde a primeira pintura.

O hero do registro já traz a entrada; o movimento de dentro do visual é do
projeto.

## Acessibilidade

- Um `h1`, e só no hero.
- Visual decorativo com `alt` vazio; visual com informação com texto
  alternativo.
- As ações são links ou botões reais, com 44 px de altura ou mais.
- Contraste do texto medido sobre o fundo real, com padrão e película.

## Hero de página interna

Mais baixo: título em `text-headline`, uma frase e, se couber, a ação. A
trilha de navegação fica acima. Mantém a mesma composição do hero
principal em escala menor, para o site parecer um só.
