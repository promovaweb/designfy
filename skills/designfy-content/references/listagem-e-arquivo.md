# Listagem, categorias e arquivo

## Página de listagem

`post-list` com `post-card`.

| Parte | Regra |
| --- | --- |
| título da página | `h1` com o nome do blog ou da categoria, e uma frase do que se encontra ali |
| destaque | o artigo mais recente ou o escolhido, em cartão grande, só na primeira página |
| grade | três colunas no desktop, duas no tablet, uma no celular |
| categorias | links para as páginas de categoria, com a atual marcada |
| paginação | `pagination`, com links reais |
| assinatura | `newsletter-form` depois da grade, quando o blog tem lista |

Variações da listagem: grade de cartões com capa (blog com imagem forte),
lista com data e título (blog técnico, muitos artigos), revista com um
destaque e colunas (publicação editorial).

## Cartão de artigo

| Parte | Regra |
| --- | --- |
| capa | proporção fixa (16:9 ou 3:2), `object-cover`, dimensões declaradas |
| categoria | texto pequeno, link próprio ou parte do cartão |
| título | `h2` na listagem, `h3` em relacionados; até três linhas, com corte por `line-clamp` |
| resumo | duas ou três linhas |
| autoria e data | uma linha, em `muted-foreground` |

- Um link por cartão, com o título como nome: o link do título se estende
  sobre o cartão (`after:absolute after:inset-0`).
- Capa com `alt` vazio quando só repete o título.
- Hover: a capa escala dentro da moldura e o título sublinha. Um sinal.
- Artigo sem capa: cartão de texto, sem caixa cinza no lugar da imagem.
- Todos os cartões de uma linha com a mesma altura, com a linha de
  autoria no pé.

## Categorias e etiquetas

- Cada categoria tem página própria, com título, uma frase e os artigos.
- O filtro da listagem é um conjunto de links para essas páginas, não um
  estado no cliente.
- Categoria com um artigo só não ganha página: o artigo aparece na
  listagem geral.
- Etiqueta só existe quando agrupa de verdade; poucas e estáveis.

## Paginação

- Dez a doze artigos por página.
- Endereços estáveis: `/blog/`, `/blog/2/`.
- Números com os vizinhos, primeiro e último; no celular, anterior, "2 de
  8" e próximo.
- `rel="prev"` e `rel="next"` quando o projeto usa.
- "Carregar mais" só quando também existe o endereço paginado.

## Ordem e destaque

Ordem padrão: mais recente primeiro. Artigo fixado no topo com marca de
texto ("Destaque"), nunca só com cor.

## Estado vazio

Categoria ou blog sem artigo publicado: frase dizendo que ainda não há
conteúdo ali e link para a listagem geral ou para a assinatura. Sem
cartões fantasmas.

## Página de autor

Foto, nome, uma frase, links e os artigos da pessoa, com a mesma grade da
listagem.

## Arquivo por data

Só para publicação com muito volume. Lista por ano e mês, em texto, com
contagem. Em blog pequeno, a listagem paginada resolve.

## Movimento

Cartões entram em sequência ao aparecer (`data-df-stagger`), uma vez. A
troca de página não anima além da transição entre páginas do projeto.

## Responsivo

| Largura | Listagem |
| --- | --- |
| 390 | uma coluna; cartão vertical; categorias em linha rolável |
| 820 | duas colunas; destaque na largura inteira |
| 1440 | três colunas; destaque em duas colunas com o resumo ao lado |

## Conferir

- [ ] Categorias são links para páginas reais.
- [ ] Nenhuma página de listagem com um item só.
- [ ] Cartões da mesma linha com a mesma altura.
- [ ] Paginação com endereços estáveis.
- [ ] Estado vazio escrito.
- [ ] Um link por cartão, com o título como nome.
