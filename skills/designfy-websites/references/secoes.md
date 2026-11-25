# Seções

Como escolher e compor cada seção de uma página pública. Cada uma usa um
fragmento do catálogo de interface (`designfy catalog show <id>`).

## Abrir uma seção

O título diz o assunto nas duas primeiras palavras e o que o visitante
ganha. "Três pães por manhã" em vez de "Nossos produtos".

- Título em `h2`, seis palavras ou menos, à esquerda por padrão.
- Uma linha de apoio, opcional.
- Sem linha pequena acima do título anunciando a seção.
- Outras formas de abrir, para variar: uma frase grande no lugar do
  título, um número real em tamanho gráfico, uma troca de fundo, uma
  legenda abaixo do conteúdo.

## Recursos

| Situação | Fragmento | Composição |
| --- | --- | --- |
| três a seis capacidades de mesmo peso e texto curto | `feature-grid` | grade de duas ou três colunas, com linhas divisórias ou cartões |
| capacidades de pesos diferentes, cada uma com um visual | `bento-grid` | blocos de tamanhos variados |
| uma capacidade que pede parágrafo e captura | `feature-split` | texto e visual lado a lado, alternando os lados |
| um processo com ordem | `steps` | passos numerados, na horizontal ou em linha do tempo |

Cuidados:

- Três colunas iguais de ícone, título e texto é o reflexo de toda página
  gerada. Use só quando os itens são mesmo paralelos, e troque o ícone em
  moeda colorida por um ícone em linha com o título ou por um visual
  pequeno e real.
- No bento, cada bloco mostra algo: um trecho da interface, um dado, um
  gráfico pequeno. Bloco só com ícone e texto é cartão comum.
- No bloco dividido, o visual é captura real, e os lados alternam.
- Itens são lista (`ul` ou `ol`), com título em `h3`.

## Prova

| Tenho | Fragmento |
| --- | --- |
| logos de clientes ou parceiros, autorizados | `logo-strip`, em linha ou faixa rolante |
| dois a quatro números verificados | `stats-band`, com contagem ao aparecer |
| depoimentos com nome, função e foto | `testimonial`, um grande ou uma grade |
| um caso com resultado | `feature-split` com a história e o número |

Sem o dado real, a seção não existe. Nunca logo genérico, depoimento
inventado, "mais de 10.000 clientes" sem fonte ou avatar de banco de
imagens.

Números: o valor com a unidade, o rótulo e, quando cabe, a fonte ou a
data. Um número sozinho como título só quando a página gira em torno dele.

## Como funciona

- `steps` quando há sequência real: três a cinco passos, cada um com verbo
  no título.
- Visual do produto acompanhando os passos: coluna fixa com a captura que
  troca enquanto o texto rola (no celular, captura acima de cada passo).
- Vídeo de demonstração com fachada (`video-embed`), título e duração.

## Para quem é

Dois a quatro perfis, cada um com a situação e o que muda para ele. Em
texto, com uma foto ou captura por perfil quando existe. Evite persona com
nome inventado.

## Preço

`pricing-table`:

- dois a quatro planos; o recomendado marcado por uma palavra e pelo botão
  preenchido, não por um cartão de outra cor;
- nome, preço com período, uma frase, lista curta do que inclui, botão;
- botões alinhados na base dos cartões;
- alternador de período como grupo de opções acessível, com o preço
  rolando na troca;
- condições na mesma tela: parcelamento, cancelamento, o que não inclui;
- `comparison-table` logo abaixo quando há muitos atributos.

Mostre o preço. Esconder o valor atrás de formulário só quando o projeto
de fato vende sob consulta, e então diga isso.

## Perguntas

`faq`, com as perguntas que impedem a ação, na ordem de aparição na
venda e no suporte. Respostas curtas, com link quando há página que
aprofunda. Sanfona com um item aberto por vez; conteúdo acessível sem
JavaScript.

## Conteúdo recente

Três `post-card` com os artigos ou lançamentos mais recentes e o link para
a listagem. Só entra quando há pelo menos três itens e o conteúdo é
atualizado.

## Chamada final

`cta-band`: uma frase que retoma a promessa, a mesma ação do hero e um
fundo que diferencia a faixa (padrão com máscara, ou `primary` com
`primary-foreground`). É o último conteúdo antes do rodapé.

Não feche a página com um campo de e-mail por reflexo. O fechamento é a
ação que o visitante veio fazer: comprar, agendar, instalar, falar.
Formulário de e-mail fecha a página só quando a página existe para captar
o e-mail.

## Faixas e respiros

- `marquee` para etiquetas curtas, tecnologias ou logos: uma por página,
  duas no máximo, com pausa no hover.
- Uma frase grande sozinha, em tamanho de título, serve de respiro entre
  duas seções densas.
- Faixa de aviso acima do cabeçalho só para algo datado.

## Fundo de cada seção

| Seção | Fundo comum |
| --- | --- |
| hero | padrão com máscara, ou superfície |
| prova rápida | superfície, com linha fina acima e abaixo |
| recursos | superfície |
| como funciona | faixa `muted` |
| depoimentos | superfície ou faixa `muted` |
| preço | superfície |
| perguntas | faixa `muted` |
| chamada final | padrão ou `primary` |

A regra do projeto está em `## Fundos e profundidade` do guia.

## Movimento por seção

Cabeçalho da seção revela ao entrar; grades em sequência; cartões com um
sinal de hover; números contam; passos desenham a linha; faixas rolam com
pausa. O plano fica na seção `## Movimento` do viewspec e a implementação
com a `designfy-motion`.
