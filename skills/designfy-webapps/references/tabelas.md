# Tabelas de dados

A tabela é o componente mais usado de um sistema. Ela serve para achar um
registro, comparar registros e agir sobre um ou vários.

## Antes: é tabela mesmo?

| Dado | Componente |
| --- | --- |
| registros com três atributos comparáveis ou mais | tabela |
| registros com um ou dois atributos | lista |
| registros visuais (produtos, arquivos, pessoas) | grade de cartões |
| etapas de um fluxo | quadro por colunas |
| atributos de um registro só | lista de pares (`description-list`) |
| série no tempo | gráfico, com a tabela como alternativa |

Preencha [assets/especificacao-de-tabela.md](../assets/especificacao-de-tabela.md)
antes de escrever código.

## Qual implementação

| Volume e uso | Implementação |
| --- | --- |
| até cem linhas, sem ordenar | `table` do shadcn, direto |
| centenas de linhas, com ordenação, filtro e seleção | `data-table` do Designfy sobre TanStack Table |
| milhares de linhas no cliente | o mesmo, com virtualização (`@tanstack/react-virtual`) |
| dado paginado no servidor | TanStack Table em modo manual: ordenação, filtro e página viram parâmetros do pedido |
| colunas fixas, redimensionar, reordenar, agrupar | `@reui/data-grid` |

## Colunas

- Cinco a oito colunas visíveis. O resto vai para o detalhe ou para o
  seletor de colunas.
- A primeira coluna identifica o registro e leva ao detalhe.
- Ordem: identificação, estado, atributos mais consultados, datas, valor,
  ações.
- Cabeçalho curto, em caixa normal, sem quebra de linha.
- Largura: a coluna de identificação flexível; as demais com largura do
  conteúdo; a de ações com a largura do botão.

| Tipo de célula | Alinhamento | Formato |
| --- | --- | --- |
| texto | esquerda | trunca com título completo na dica |
| número, valor, quantidade | direita | algarismos tabulares, formato do público, unidade no cabeçalho |
| data | esquerda | formato curto e fixo; data relativa só com a absoluta na dica |
| estado | esquerda | selo com texto |
| pessoa | esquerda | avatar pequeno e nome |
| booleano | esquerda | texto ou ícone com nome acessível, não só cor |
| ações | direita | um botão de ícone que abre o menu |

Valor vazio: um traço, com texto para leitor de tela.

## Ordenação

- Cabeçalho ordenável é um botão dentro do `th`, com seta que indica a
  direção, e `aria-sort` no `th`.
- Uma ordenação padrão que faz sentido para a tarefa (mais recente, prazo
  mais próximo).
- Clique alterna crescente, decrescente e padrão.
- A ordenação fica na URL.

## Filtro e busca na lista

`filter-bar`, acima da tabela.

- Campo de texto para o identificador principal.
- Filtros por atributo como seletores; período como intervalo de datas.
- Filtros ativos aparecem como fichas removíveis, com "limpar tudo".
- A contagem de resultados aparece e é anunciada.
- Tudo na URL.
- No celular, os filtros vão para uma gaveta; as fichas ativas ficam à
  vista.
- Filtro sem resultado mostra a mensagem própria, com a ação de limpar.

## Seleção e ações em lote

- Caixa de seleção na primeira coluna, com "selecionar todos" no
  cabeçalho (estado misto quando parcial).
- Com seleção, aparece a barra de ações em lote com a contagem.
- "Selecionar os 1.240 resultados" quando a seleção vale além da página.
- Ação destrutiva em lote confirma, citando a contagem.

## Ações da linha

- Uma ação frequente pode ficar visível na linha; as demais num menu
  (`dropdown-menu`) aberto por um botão de três pontos com nome
  acessível.
- No máximo duas ações visíveis por linha.
- Excluir fica no menu, separado, e confirma.
- A linha inteira pode ser clicável para abrir o detalhe; nesse caso os
  controles internos param a propagação e o link real está na primeira
  coluna.

## Paginação

- Abaixo da tabela: intervalo e total ("1 a 20 de 1.240"), tamanho da
  página e navegação.
- Tamanho padrão de 20 ou 25.
- Página e tamanho na URL.
- Rolagem infinita só em lista de leitura contínua, nunca onde a pessoa
  precisa voltar a um ponto.

## Estados

| Estado | O que aparece |
| --- | --- |
| carregando (primeira vez) | linhas de esqueleto com as larguras das colunas |
| atualizando | os dados antigos ficam, com opacidade reduzida e indicador no topo |
| vazio de primeiro uso | `empty-state` dentro da área da tabela, com a ação de criar |
| sem resultado | mensagem com o filtro usado e "limpar filtros" |
| erro | `error-state` com tentar de novo; cabeçalho e filtros continuam |
| linha em ação | a linha mostra progresso; as outras seguem |
| linha nova ou alterada | realce que some em 1 s |

## Densidade

| Densidade | Altura da linha | Texto |
| --- | --- | --- |
| compacta | 36 a 40 px | `text-sm` |
| média | 44 a 48 px | `text-sm` |
| arejada | 52 a 56 px | `text-sm` ou `text-base` |

Linhas separadas por linha fina horizontal; sem zebra forte, sem bordas
verticais, sem cartão em volta de cada linha. Hover da linha com fundo
`muted/50`.

## Cabeçalho fixo e rolagem

- Cabeçalho `sticky` dentro do contêiner que rola, com borda inferior.
- Tabela larga rola na horizontal dentro da própria caixa, com a primeira
  coluna fixa e sombra indicando que há mais.
- A página nunca rola na horizontal.

## No celular

Escolha uma, e escreva em `## Responsivo` do viewspec:

| Estratégia | Quando |
| --- | --- |
| cartões | a pessoa precisa ler e agir no celular: cada linha vira um cartão com identificação, estado, dois ou três atributos e as ações |
| colunas prioritárias | três colunas essenciais ficam; as demais vão para o detalhe |
| rolagem própria com primeira coluna fixa | tabela de comparação que precisa de todas as colunas |

No `data-table` do Designfy, cada coluna declara em `meta` se aparece no
cartão. A coluna que identifica e a que age ficam sempre à vista.

## Acessibilidade

- `table`, `thead`, `tbody`, `th scope="col"`, e `th scope="row"` na
  coluna de identificação.
- `caption` ou `aria-label` com o nome da tabela.
- `aria-sort` no cabeçalho ordenado.
- Seleção anuncia a contagem numa região de status.
- Menu de ações e paginação operáveis por teclado.
- Região rolável com `tabindex="0"` e nome.
- Mudança de resultado anunciada ("42 pedidos").

## Movimento

Linhas entram com opacidade na primeira carga; a barra de lote sobe;
fichas de filtro entram e saem com escala; linha removida recolhe com
desfazer. Reordenação anima só com poucas linhas.
