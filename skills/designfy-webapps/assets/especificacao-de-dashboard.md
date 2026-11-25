# Modelo: especificação de dashboard

Preencha antes de desenhar. Cole o resultado em `## Estrutura` e
`## Estados` do viewspec.

```markdown
### Dashboard: {nome}

Quem abre e quando: {papel, momento do dia}.
Pergunta que responde: {uma frase}.
Ação principal: {rótulo e destino}.
Período padrão: {hoje | 7 dias | mês}. Filtros globais: {lista}.
Atualização: {ao abrir | a cada N minutos}.

#### Contadores

| Rótulo | Medida | Origem | Formato | Compara com | Sentido bom | Destino |
| --- | --- | --- | --- | --- | --- | --- |
| Receita | soma de `total` pago | `GET /sales/summary` | moeda abreviada | período anterior | subir | `/vendas` |
| Pedidos | contagem | idem | inteiro | período anterior | subir | `/pedidos` |
| Em atraso | contagem com prazo vencido | idem | inteiro | ontem | descer | `/pedidos?status=atrasado` |
| Conversão | pedidos pagos / visitas | idem | percentual | meta de 3% | subir | |

#### Gráficos

| Título | Tipo | Eixo X | Eixo Y | Séries | Origem | Resumo em texto |
| --- | --- | --- | --- | --- | --- | --- |
| Receita por dia | área | dia | R$ | atual, período anterior | `GET /sales/daily` | "Receita de R$ X no período, Y% acima do anterior; pico em DD/MM" |
| Pedidos por canal | barras horizontais | quantidade | canal | uma | `GET /sales/by-channel` | "Loja responde por X% dos pedidos" |

#### Listas de apoio

| Bloco | Conteúdo | Linhas | Destino |
| --- | --- | --- | --- |
| Pedidos recentes | número, cliente, estado, total | 8 | `/pedidos` |
| Atividade | quem fez o quê | 6 | |

Ordem na tela (desktop): cabeçalho · 4 contadores · gráfico largo e gráfico
estreito · tabela e atividade.
Ordem no celular: contadores em 2 colunas · gráfico principal · pedidos
recentes em cartões · segundo gráfico · atividade.

Estados por bloco: carregando (esqueleto), vazio ("sem dados no período"),
erro (tentar de novo). Um bloco com erro não afeta os outros.
```

## Perguntas que a especificação responde

1. Qual pergunta a tela responde, em uma frase?
2. Se só coubessem três números, quais seriam?
3. Cada número tem comparação?
4. Para cada gráfico: qual conclusão a pessoa tira?
5. O que a pessoa faz depois de olhar?
