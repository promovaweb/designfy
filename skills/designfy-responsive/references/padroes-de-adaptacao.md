# Padrões de adaptação por componente

Como cada peça muda de uma largura para outra. Use ao escrever a seção
`## Responsivo` do viewspec.

## Os sete movimentos

| Movimento | O que faz | Exemplo |
| --- | --- | --- |
| empilhar | colunas viram linhas, na ordem de leitura | hero dividido, bloco de texto e imagem |
| refluir | a grade perde colunas | 3, 2, 1 |
| recolher | o conteúdo fica atrás de um toque | menu em gaveta, filtros, índice |
| trocar de forma | outro componente para o mesmo conteúdo | tabela vira cartões, abas viram seletor |
| priorizar | o essencial fica; o resto vai para o detalhe | colunas da tabela |
| rolar dentro | a região rola na horizontal, a página não | tabela larga, código, linha de fichas |
| reposicionar | a ação muda de lugar | botão principal vai para a barra do pé |

Tirar conteúdo não é um movimento válido. Só enfeite sai.

## Site

| Componente | Celular (390) | Tablet (820) | Desktop (1440) |
| --- | --- | --- | --- |
| `site-header` | marca, ação principal e botão de menu | o mesmo, ou links principais à vista | marca, links, utilitários e ação |
| `mobile-nav` | gaveta ou painel inteiro, links de 48 px | o mesmo | não aparece |
| `hero-split` | texto primeiro, visual depois, ações em largura total | duas colunas com visual menor, ou empilhado com visual limitado | duas colunas |
| `hero-centered` | título menor por `clamp`, ações empilhadas | ações em linha | o mesmo com mais respiro |
| `feature-grid` | uma coluna, ícone ao lado do título | duas colunas | três colunas |
| `bento-grid` | uma coluna na ordem de leitura, blocos altos com proporção fixa | duas colunas | grade com blocos de tamanhos variados |
| `feature-split` | texto primeiro, visual depois (sempre nessa ordem) | o mesmo ou duas colunas | lados alternados |
| `steps` | vertical, com a linha à esquerda | vertical ou horizontal com três | horizontal ou linha do tempo |
| `stats-band` | duas colunas | quatro em linha | quatro em linha |
| `logo-strip` | faixa rolante ou duas linhas | uma linha | uma linha |
| `testimonial` | uma coluna, ou carrossel de arrastar | duas colunas | grade ou um grande |
| `pricing-table` | pilha, com o plano recomendado primeiro | duas colunas | planos lado a lado |
| `comparison-table` | um plano por vez com seletor, ou rolagem com primeira coluna fixa | rolagem com primeira coluna fixa | tabela inteira |
| `faq` | uma coluna | uma coluna | uma coluna ou duas com introdução |
| `cta-band` | texto e botão empilhados, botão em largura total | em linha | em linha |
| `site-footer` | lista única ou sanfonas | duas colunas | colunas completas |

## Conteúdo

| Componente | Celular | Tablet | Desktop |
| --- | --- | --- | --- |
| `article-header` | meta em duas linhas, capa em largura total | o mesmo | capa limitada ao container |
| `prose` | margem de 16 a 20 px, mesmo tamanho de corpo | medida centralizada | medida com índice ao lado |
| `table-of-contents` | bloco recolhido no topo | recolhido | lateral fixa a partir de 1280 px |
| `figure` larga | volta à largura da tela | passa um pouco da medida | passa da medida até o container |
| tabela no texto | rola na própria caixa | o mesmo | cabe |
| `code-block` | rola na própria caixa, fonte de 14 px | o mesmo | cabe ou rola |
| `post-list` | uma coluna | duas | três |
| `post-card` horizontal | vira vertical | horizontal | horizontal |
| `video-embed` | proporção fixa, largura total | o mesmo | na medida ou largo |

## Sistema

| Componente | Celular | Tablet | Desktop |
| --- | --- | --- | --- |
| `app-shell` | lateral em gaveta; topo com menu e título | trilho de ícones ou gaveta | lateral aberta |
| `page-header` | título em cima; ações embaixo ou em menu; principal na barra do pé | título e ações em linha, secundárias em menu | tudo em linha |
| `stat-card` | duas colunas, ou linha rolável com encaixe | duas colunas | quatro em linha |
| `chart-card` | largura total, altura de 220 px, menos marcas no eixo, legenda embaixo | largura total | grade com dois |
| `data-table` | cartões com os campos-chave, ou rolagem com primeira coluna fixa | colunas prioritárias | tabela inteira |
| `filter-bar` | busca à vista; filtros em gaveta; fichas ativas à vista | busca e dois filtros; o resto em "mais" | tudo em linha |
| `bulk-actions` | barra fixa no pé | barra acima da tabela | barra acima da tabela |
| `form-layout` | uma coluna; barra de ações fixa no pé | uma coluna | rótulo de seção ao lado, campos ao lado |
| `stepper` | "Etapa 2 de 4" com barra | lista de etapas compacta | lista de etapas completa |
| `description-list` | rótulo acima do valor | duas colunas | duas ou três colunas |
| `tabs` | linha rolável com corte na borda, ou seletor | linha | linha |
| `dialog` | folha inferior com ações fixas | diálogo | diálogo |
| `drawer` | folha inferior ou painel inteiro | lateral | lateral |
| `settings-layout` | lista de áreas que leva a cada uma | abas ou lateral estreita | lateral e conteúdo |
| `auth-card` | formulário de borda a borda; sem painel de marca | cartão central | dividido com painel de marca |
| `toast` | no pé, centralizado, acima da navegação | canto inferior | canto inferior direito |

## Tabela no celular: escolher

| Situação | Estratégia |
| --- | --- |
| a pessoa precisa ler e agir em cada registro | cartões: identificação como título, estado, dois ou três atributos, ações |
| a pessoa só confere e abre o detalhe | três colunas prioritárias; o resto no detalhe |
| comparação lado a lado é o propósito | rolagem horizontal na própria caixa, primeira coluna fixa, sombra indicando mais |
| pares de atributo e valor | lista de pares empilhada |

Escreva a escolha e os campos que ficam no viewspec.

## Navegação no celular

| Tipo | Padrão |
| --- | --- |
| site | gaveta ou painel aberto pelo botão; ação principal no cabeçalho |
| sistema com até cinco destinos | barra inferior com ícone e rótulo |
| sistema com mais destinos | gaveta com os grupos; destinos frequentes na barra inferior |
| documentação | navegação em gaveta; índice da página recolhido |

## Ações no celular

A ação principal fica onde o polegar alcança: barra fixa no pé (com
`padding-bottom: env(safe-area-inset-bottom)`), ou botão em largura total
logo depois do conteúdo que ela conclui. Ações secundárias vão para um
menu.

## Ordem

No empilhamento, a ordem é a de leitura: título, texto, ação, visual. Em
bloco dividido alternado, o texto vem sempre antes do visual no celular,
mesmo quando no desktop o visual fica à esquerda (o DOM tem o texto
primeiro e o desktop reposiciona com `lg:order-2`).
