# Dashboards, contadores e gráficos

Um dashboard responde a uma pergunta de quem abre a tela: "como estamos
hoje?", "o que precisa de mim?". Ele não é um mural de tudo o que o
sistema sabe.

Preencha [assets/especificacao-de-dashboard.md](../assets/especificacao-de-dashboard.md)
antes de desenhar.

## Tipos

| Tipo | Pergunta | Composição |
| --- | --- | --- |
| operacional | o que precisa de ação agora? | contagens por estado, filas, alertas, lista do que venceu |
| analítico | como evoluímos? | indicadores com variação, tendências, comparações por dimensão |
| de registro | como está este cliente ou projeto? | resumo, indicadores do registro, atividade recente |
| inicial | por onde começo? | atalhos, pendências da pessoa, itens recentes |

## Hierarquia da tela

1. Cabeçalho da página: título, período e filtros globais, ação
   principal.
2. Faixa de contadores: os três a cinco números que respondem à pergunta.
3. Um ou dois gráficos principais.
4. Tabelas e listas de apoio.

O mais importante no canto superior esquerdo. Cinco a nove blocos por
tela; mais que isso pede abas ou outra tela.

## Contador

`stat-card`.

| Parte | Regra |
| --- | --- |
| rótulo | o que o número mede, em uma a três palavras |
| valor | grande, em `font-heading`, com algarismos tabulares e unidade |
| variação | contra o período anterior: sinal, percentual e palavra ("12% acima da semana passada") |
| contexto | meta, média ou minigráfico, quando ajudam a julgar o número |
| destino | o cartão leva ao detalhe quando há um |

- Número sem comparação não diz se é bom ou ruim. Dê a variação, a meta
  ou a série.
- Subir nem sempre é bom: a cor da variação segue o sentido do indicador
  (cancelamentos subindo é ruim). Além da cor, sinal e texto.
- Formate para leitura: `1,2 mil`, `R$ 48,3 mil`, com o valor exato na
  dica.
- Quatro em linha no desktop, dois no tablet e no celular (ou uma linha
  rolável com encaixe).
- Sem ícone decorativo em moeda colorida. Ícone só quando distingue.

Contador com meta: barra de progresso com o valor e a meta escritos.

## Gráficos

`chart-card`, sobre o `chart` do shadcn e Recharts.

| Quero mostrar | Gráfico |
| --- | --- |
| evolução no tempo | linha ou área |
| comparação entre categorias | barras (horizontais para rótulos longos) |
| composição de um total | barras empilhadas; rosca só com duas a quatro fatias |
| parte de uma meta | barra de progresso ou radial |
| distribuição | histograma |
| relação entre duas medidas | dispersão |
| um número | um contador, não um gráfico |

Regras:

- Título que diz a conclusão ou a medida ("Receita por semana").
- Eixo Y começando em zero em barras.
- Poucas marcas nos eixos; grade discreta em `border`.
- Rótulo direto na série quando há até três; legenda quando há mais.
- Cores pelos papéis `chart-1` a `chart-5`, com diferença além do matiz
  (traço, marcador, rótulo).
- Dica no hover e no foco com o valor exato e a data.
- Seletor de período e de série no cabeçalho do cartão.
- Altura fixa por faixa de largura (perto de 300 px no desktop, 220 px
  no celular).
- Nada de 3D, sombra, gradiente forte ou rosca com oito fatias.

Acessibilidade do gráfico: resumo em texto (o que ele mostra e a
tendência), alternativa em tabela com os mesmos dados e navegação por
teclado pelos pontos quando o componente oferece.

## Filtros globais

Período, e uma ou duas dimensões (unidade, equipe). No cabeçalho da
página, valendo para todos os blocos, com o estado na URL. O período
escolhido aparece escrito nos cartões que dependem dele.

## Estados por região

Cada bloco carrega e falha sozinho.

| Estado | Contador | Gráfico | Tabela |
| --- | --- | --- | --- |
| carregando | esqueleto do valor e da variação | esqueleto com a altura do gráfico | linhas de esqueleto |
| vazio | traço e "sem dados no período" | mensagem no lugar do gráfico, com a ação de mudar o período | `empty-state` |
| erro | aviso curto com tentar de novo | o mesmo | `error-state` |
| desatualizado | hora da última atualização | o mesmo | o mesmo |

Um bloco com erro não derruba a tela.

## Atualização

- Diga quando o dado foi atualizado.
- Atualização automática só onde o dado muda rápido, com intervalo
  razoável e pausa quando a aba não está visível.
- O valor que mudou é realçado por um instante; o número rola do anterior
  ao novo.

## Movimento

Contadores contam uma vez na primeira carga e rolam nas mudanças;
gráficos desenham uma vez em 600 a 800 ms e interpolam na troca de
período; indicador do período desliza; nada se repete no hover. Com
movimento reduzido, tudo pronto.

## No celular

Contadores em duas colunas; gráficos em largura total com altura menor e
menos marcas; tabelas de apoio como cartões; filtros globais numa
gaveta; a ordem dos blocos segue a importância.

## Erros comuns

- Dashboard sem pergunta: doze cartões de mesmo tamanho.
- Número sem comparação nem período.
- Gráfico de pizza para dez categorias.
- Cores diferentes para a mesma série em gráficos vizinhos.
- Tudo recarregando e piscando a cada atualização.
- Verde e vermelho como único sinal.
