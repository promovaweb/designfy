---
schemaVersion: "1.0.0"
scope: project
name: Mesa de Pedidos
description: Sistema usado pela equipe de expedição e atendimento para acompanhar pedidos de uma distribuidora regional.
surfaces: [webapp]
frameworks:
  - react-vite
tokensFile: src/styles/tokens.css
themes: [light, dark]
createdAt: 2026-11-20T08:30:00-03:00
updatedAt: "2026-11-26T16:00:00-03:00"
---

## Visão geral

Reservado a atendentes, conferentes e supervisores de expedição. A interface é compacta, com três atributos visíveis no trabalho diário: clara, previsível e cuidadosa.

- Mostre primeiro a etapa atual e a próxima ação do pedido, porque o atendimento consulta a tela com o cliente na linha. `@pessoa` {#v001}
- Mantenha o número do pedido em destaque em todas as telas de detalhe, para a conferência por telefone. `@agente` {#v002}

## Cores

A cor base é azul, com variações de luminosidade em harmonia monocromática. Os valores saem de `src/styles/tokens.css`.

- Use `primary` em “Liberar para expedição” e nas demais ações principais, para que o acento identifique a ação principal da tela. `@pessoa` {#c001}
- Use `foreground` sobre `background` nos textos de pedido; o par mediu 15,4:1 no tema claro e 14,2:1 no escuro. `@revisão` {#c002}
- Reserve `destructive` para perda de dados ou cancelamento confirmado. Atrasos usam o papel `warning` com texto visível. `@agente` {#c003}

## Tipografia

- Use `font-sans` nos textos de operação e `font-heading` nos títulos, ambos definidos no arquivo de tokens. `@agente` {#y001}
- Ative números tabulares em quantidades, preços e prazos, para comparar valores alinhados na tabela. `@revisão` {#y002}
- Dê à nota de entrega uma largura de até 65 caracteres por linha para facilitar a leitura de instruções longas. `@agente` {#y003}

## Layout

- Separe ações fixas da página das ações da seleção da tabela, para evitar alterações no conjunto errado de pedidos. `@pessoa` {#l001}
- Use a escala de espaçamento do tema para manter constantes a distância entre filtros, tabela e paginação. `@agente` {#l002}

## Fundos e profundidade

- Use `background` nas páginas e `card` nos painéis de resumo, com separação por borda `border`. `@agente` {#f001}
- Aplique sombra apenas em elementos sobrepostos, como menus e gavetas, para deixar visível qual camada recebe o foco. `@revisão` {#f002}

## Formas

- Use o raio `rounded-md` em campos e botões e `rounded-lg` em painéis, para manter as formas consistentes. `@agente` {#s001}
- Use ícones de traço uniforme acompanhados de texto nas ações que mudam a etapa do pedido. `@pessoa` {#s002}

## Movimento

- Anime a abertura da gaveta de histórico em 180 ms com a curva de saída do tema, para indicar de onde ela veio. `@agente` {#m001}
- Quando houver preferência por movimento reduzido, mostre a gaveta no estado final e mova o foco da mesma forma. `@revisão` {#m002}

## Voz e conteúdo

- Use rótulos que nomeiem o resultado, como “Confirmar separação”, para que a equipe saiba o que será registrado. `@pessoa` {#w001}
- Em falhas de atualização, informe o que foi preservado e ofereça “Tentar novamente”. `@agente` {#w002}
- Mostre datas como DD/MM/AAAA, horários em 24 horas e valores no formato brasileiro de reais, para reduzir a leitura equivocada de prazos e totais. `@pessoa` {#w003}

## Componentes

- Reutilize o Data Table do Designfy para filtros e paginação da fila de pedidos, preservando a mesma operação nas filas de expedição e atendimento. `@agente` {#k001}
- Use o Alert Dialog do shadcn para confirmar cancelamento e receba o motivo no formulário do pedido antes de abrir o diálogo. `@agente` {#k002}
- Use o componente do projeto `OrderStatus` para mostrar etapa, ícone e descrição em conjunto. `@pessoa` {#k003}

## Padrões de tela

- Abra a fila com pedidos ativos e ordene pelo prazo prometido, do mais próximo ao mais distante. `@pessoa` {#t001}
- Preserve filtros e página ao voltar do detalhe, para que a equipe retome o pedido seguinte da mesma fila. `@revisão` {#t002}
- Explique no estado vazio se a fila está livre ou se nenhum pedido combina com o filtro e ofereça a ação correspondente. `@agente` {#t003}

## Responsivo

- Abaixo de 640 px, apresente cada pedido como cartão com número, etapa, prazo e ação de abrir o detalhe. `@revisão` {#r001}
- Em celulares, mantenha alvos de toque com pelo menos 44 × 44 px para conferentes que usam luvas finas. `@pessoa` {#r002}
- Em tablets, mantenha a tabela em uma região de rolagem horizontal, com instruções visíveis e coluna de número sempre acessível. `@agente` {#r003}

## Acessibilidade

- Adote WCAG 2.2 AA e confira contraste, sequência de foco e nomes acessíveis antes de liberar uma tela. `@pessoa` {#a001}
- Ao fechar um diálogo, devolva o foco ao botão que o abriu ou ao título da página se o botão tiver saído da tela. `@revisão` {#a002}
- Anuncie a confirmação da mudança de etapa em uma região de status sem deslocar o foco da fila. `@agente` {#a003}

## Faça e não faça

- Use o texto “Em separação” no selo do pedido. Evite usar apenas uma bolinha amarela, porque o estado precisa ser legível fora da legenda. `@pessoa` {#d001}
- Mostre “Etiqueta indisponível” com uma ação de tentar novamente. Evite esconder o botão quando a transportadora estiver indisponível. `@revisão` {#d002}

## Aprendizados

- 2026-11-21 `@pessoa` Conferentes consultam o pedido com luvas finas no depósito. → {#r002}
- 2026-11-22 `@agente` A paginação compartilhada permite levar o mesmo filtro às duas filas de trabalho. → {#k001}
- 2026-11-23 `@revisão` Na captura de 390 px, o prazo prometido ficava fora da área que a pessoa conseguia ver. → {#r001}
- 2026-11-24 `@pessoa` A supervisão quer testar um resumo de devoluções no fechamento de turno. → proposta
- 2026-11-25 `@agente` A equipe testou confirmação por arraste para liberar a expedição. → descartado: o gesto atrapalhava o uso pelo teclado.
- 2026-11-26 `@revisão` A captura de 820 px mostrou que transportadora e destino competem por espaço quando o nome da cidade é longo. → proposta
