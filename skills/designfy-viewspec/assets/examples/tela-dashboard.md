---
schemaVersion: "1.0.0"
scope: view
id: "0002"
slug: dashboard-de-vendas
title: Dashboard de vendas
summary: Visão diária de receita, pedidos e conversão para o time comercial.
status: in_progress
kind: dashboard
surface: system
framework: react-vite
route: /app/vendas
createdAt: 2026-11-24T15:00:00-03:00
updatedAt: 2026-11-24T16:20:00-03:00
skills: [designfy-systems, designfy-components, designfy-motion, designfy-responsive, designfy-accessibility, designfy-review]
components: [app-shell, stat-card, data-table, chart-area]
relatedFiles:
  - src/pages/app/vendas.tsx
priority: high
---

## Objetivo

A gerente comercial abre a tela de manhã para saber se a meta do dia está
no ritmo. A ação principal é abrir a lista de pedidos em atraso.

## Conteúdo

Receita, pedidos, ticket médio e conversão do dia e do mês, vindos de
`GET /api/sales/summary`. Tabela com os 20 pedidos mais recentes.

## Estrutura

1. Cabeçalho da página com título, período e a ação "Pedidos em atraso".
2. Quatro contadores em linha.
3. Gráfico de área da receita no período.
4. Tabela dos pedidos recentes.

## Estados

Carregando: esqueleto com a forma de cada região. Vazio: período sem
pedidos, com a ação de mudar o período. Erro: aviso na região que falhou,
com tentar de novo; as outras regiões continuam.

## Responsivo

Celular: contadores em duas colunas, gráfico com altura fixa de 220 px,
tabela como lista de cartões. Tablet: contadores em duas colunas e tabela
com rolagem horizontal contida.

## Movimento

Os contadores contam do valor anterior ao novo em 600 ms. O gráfico desenha
a área uma vez, na primeira carga. Com movimento reduzido, valores e
gráfico aparecem prontos.

## Acessibilidade

Um `h1` com o título, `h2` por região. O gráfico tem resumo em texto e a
tabela equivalente acessível por um botão.

## Checklist

- [x] Shell e cabeçalho da página `#designfy-systems` {#k2a9}
- [ ] Contadores com o estado de carregamento `#designfy-components` {#p0x4}
- [ ] Contagem animada com versão parada `#designfy-motion` {#m7d1}
- [ ] Tabela como cartões no celular `#designfy-responsive` {#r3c8}
- [ ] Resumo em texto do gráfico `#designfy-accessibility` {#a1f5}
- [ ] Capturas em celular e desktop revisadas `#designfy-review` {#v9e2}

## Notas

- 24/11/2026: período padrão definido como "hoje", a pedido do comercial.
