# Movimento por tipo de tela

O conjunto mínimo de movimento para cada `kind` de viewspec. Parta daqui
ao escrever a seção `## Movimento`. Os nomes entre crases são utilidades e
componentes do Designfy.

## Páginas de site

### `landing-page` e `home`

| Parte | Movimento | Ferramenta |
| --- | --- | --- |
| cabeçalho | fundo e borda aparecem depois de 8 px de rolagem; no celular, some ao descer e volta ao subir | classe trocada por `IntersectionObserver` num sentinela; `transition-[background-color,border-color,transform]` |
| hero | nome, título, frase e ações em sequência de 80 ms; visual sobe e ganha opacidade em 800 ms | `animate-df-fade-up` com atraso, ou `HeroSplit` |
| visual do hero | um movimento próprio e lento: estados reais do produto trocando, ou um detalhe que respira | CSS, ou `AnimatePresence` em ilha |
| fundo do hero | preset animado ou estático com máscara | `Background` |
| logos | faixa rolante com pausa | `df-marquee` |
| seções | cabeçalho da seção revela uma vez; grades em sequência | `data-df-reveal`, `data-df-stagger` |
| bento | cada bloco com um movimento pequeno ligado ao que mostra, mais elevação no hover | CSS por bloco, `df-lift` |
| passos | linha que desenha conforme a rolagem; número acende ao chegar | `animation-timeline: view()` com reserva em `IntersectionObserver` |
| números | contam uma vez ao aparecer | `data-df-count` |
| preços | valor rola ao trocar o período; plano destacado com borda que se move devagar | `@number-flow/react` em ilha, `animate-df-border-beam` |
| perguntas | painel abre por linhas de grade | `df-collapse` |
| chamada final | fundo com movimento lento; botão com pressão | `Background`, `df-press` |
| rodapé | revela com a última seção | `data-df-reveal` |

Regra do Hub para sites da Promovaweb: o movimento acompanha a página do
hero ao rodapé; nenhuma tela de rolagem fica sem algo em movimento.

### `site-page`

Hero curto com a mesma sequência do hero principal, seções com revelação e
hover nos cartões. Menos laços que a página de venda: um por página.

### `blog-index`

Cartões em sequência ao entrar; capa escala 1.03 dentro da moldura no
hover; título sublinha (`df-underline`); paginação sem animação além do
hover.

### `blog-post` e `docs-page`

| Parte | Movimento |
| --- | --- |
| barra de progresso de leitura | cresce com a rolagem (`animation-timeline: scroll()`) |
| índice | marcador desliza até a seção atual |
| capa | opacidade e escala de 1.03 para 1 em 600 ms |
| âncora | rolagem suave e destaque breve do título de destino |
| código | botão de copiar troca para a marca de feito por 1.5 s |
| imagem | aparece com opacidade ao carregar; ampliação com transição de elemento compartilhado |
| relacionados e chamada final | revelação |

O corpo do texto não se move. Nada passa atrás nem na frente do texto
enquanto a pessoa lê.

## Telas de sistema

O caráter é contido: o movimento explica o estado e não disputa atenção
com o dado.

### `dashboard`

| Parte | Movimento |
| --- | --- |
| carregamento | esqueleto com brilho lento (`df-shimmer`) na forma de cada região |
| contadores | valor conta do anterior ao novo em 600 ms; selo de variação troca com opacidade |
| gráficos | desenham uma vez na primeira carga (600 a 800 ms); mudança de período interpola; nada repete no hover |
| troca de período | indicador desliza no controle segmentado (`layoutId`) |
| atualização ao vivo | o valor que mudou pisca o fundo em `accent` por 600 ms |
| cartões | sem elevação no hover, salvo quando o cartão inteiro é um link |

### `table` e `crud`

| Parte | Movimento |
| --- | --- |
| linhas | entram com opacidade em sequência curta na primeira carga (até 10 linhas) |
| ordenação | linhas trocam de lugar com animação de layout quando são poucas; acima de 50, troca direta |
| seleção | fundo da linha em 100 ms; barra de ações em lote sobe de baixo |
| filtro | fichas entram e saem com escala e opacidade em 150 ms; contagem de resultados troca com opacidade |
| linha nova ou alterada | realce do fundo que some em 1 s |
| linha removida | recolhe por linhas de grade e opacidade, com opção de desfazer |
| gaveta de edição | desliza da direita em 300 ms; fundo escurece em 150 ms |
| menu da linha | abre do botão com escala 0.96 e opacidade em 150 ms |

### `form`

| Parte | Movimento |
| --- | --- |
| foco do campo | borda e anel em 150 ms |
| erro | mensagem desce 4 px com opacidade; campo treme uma vez (`animate-df-shake`) no envio com falha |
| seções condicionais | abrem por linhas de grade |
| envio | botão mostra progresso sem mudar de largura; depois a marca de feito desenha em 300 ms |
| etapas | o conteúdo desliza na direção do avanço; a barra de progresso cresce |
| envio de arquivo | zona reage ao arrastar; barras crescem; item assenta na lista |

### `detail`

Cabeçalho aparece com opacidade; abas com indicador que desliza; histórico
com itens novos entrando no topo.

### `settings`

Alternadores com o botão deslizando em 150 ms; "salvo" aparece ao lado do
botão e some em 2 s; troca de área com opacidade.

### `auth`

Cartão sobe e ganha opacidade na carga; troca entre entrar e cadastrar
desliza o formulário; painel de marca com fundo que se move devagar; erro
com tremor único.

## Movimento do shell de sistema

| Parte | Movimento |
| --- | --- |
| barra lateral | recolhe e expande em 200 ms por `transform` ou colunas de grade |
| item ativo | marcador desliza entre itens |
| troca de rota | área principal com opacidade em 150 ms; foco vai para o título da página |
| paleta de comandos | abre como diálogo; realce desliza entre resultados |
| avisos | sobem do canto, empilham e saem sozinhos em 5 s, pausando no hover |

## Como escrever no viewspec

Cada linha da seção `## Movimento` diz o quê, quando, quanto dura e a
versão parada. Modelo em
[assets/plano-de-movimento.md](../assets/plano-de-movimento.md).
