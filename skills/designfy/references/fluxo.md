# Fluxo da orquestração

Os estágios de uma execução, o que entra, o que sai e onde parar para a
pessoa responder.

## Estágios

| # | Estágio | Entra | Sai | Para e pergunta? |
| --- | --- | --- | --- | --- |
| 1 | Ler o projeto | pasta do projeto | framework, tema, guia, viewspecs abertos | não |
| 2 | Ler o pedido | a frase da pessoa | `surface`, `kind`, rota, ação principal, conteúdo, lacunas | só se a ação principal ou uma região obrigatória ficar sem resposta |
| 3 | Garantir o guia | tema e respostas | `VIEWSPEC.md` na raiz | na criação do guia: três perguntas sobre personalidade, densidade e movimento |
| 4 | Escolher fragmentos | `kind` e catálogo | regiões com fragmento e fonte | não |
| 5 | Montar o viewspec | tudo acima | `viewspec/<id>-<slug>/VIEWSPEC.md` em `draft` | só se houver duas estruturas plausíveis e o pedido não escolher |
| 6 | Executar | viewspec | interface implementada, itens marcados, status `in_progress` | quando uma especialista parar por falta de conteúdo ou acesso |
| 7 | Revisar | URL local da tela | capturas, achados, correções | quando um achado pedir uma escolha de produto |
| 8 | Fechar | viewspec completo | status `done`, guia atualizado, relato | não |

## Pontos de parada

São três, e só eles:

1. **Esclarecimento do pedido** (estágio 2). Uma mensagem, até três
   perguntas, cada uma com a opção recomendada primeiro.
2. **Plano da tela** (estágio 5), só quando existe mais de uma estrutura
   plausível. Mostre as regiões em ordem, o fragmento de cada uma e o que
   muda entre as opções. Sem alternativa real, mostre o plano e siga.
3. **Achado que é escolha de produto** (estágio 7). Por exemplo: a tabela
   não cabe no celular e é preciso escolher quais colunas ficam.

Fora desses pontos, o trabalho corre e a pessoa recebe marcos curtos: o que
ficou pronto, o que vem agora e como ver (URL ou comando).

## Retomar um trabalho

`designfy viewspec list --status in_progress` mostra o que está aberto.
Para retomar:

1. Leia o viewspec inteiro, com `## Notas`.
2. Continue no primeiro item pendente da checklist, com a especialista
   anotada nele.
3. Não refaça o que está marcado. Se algo marcado estiver quebrado,
   desmarque, registre o motivo em `## Notas` e passe à dona do item.

Viewspec em `blocked`: leia `blockedReason`, confira se a causa sumiu e só
então volte para `in_progress`.

## Várias telas

- Um viewspec por tela, criados todos antes da primeira implementação
  quando o pedido for um conjunto (site inteiro, módulo de sistema).
- `dependsOn` marca a ordem: o shell antes das telas, o cabeçalho e o
  rodapé antes das páginas, a listagem antes do detalhe.
- Fragmentos compartilhados (cabeçalho, rodapé, shell, cartão) são
  implementados uma vez, na primeira tela que os usa, e entram em
  `## Componentes` do guia.
- Depois da segunda tela, releia o guia: o que se repetiu vira regra em
  `## Padrões de tela`.

## Falhas

| Sintoma | O que fazer |
| --- | --- |
| build do projeto falha depois de uma especialista | devolva o erro à mesma especialista; duas falhas seguidas no mesmo ponto: pare e mostre o erro à pessoa |
| componente do registro não combina com o tema | não edite o componente para pôr cor literal; ajuste os tokens com a `designfy-design-system` ou crie uma variação pelo tema |
| captura sai com 10 | falta o Playwright: `designfy deps install testing` e `npx playwright install chromium` |
| captura sai com 5 | o servidor do projeto não responde na URL: suba o servidor ou corrija a rota |
| `viewspec validate` sai com 10 | corrija o arquivo com a `designfy-viewspec` antes de continuar |
| conteúdo essencial não existe | marque a lacuna na tela, registre em `## Notas`, leve ao relato e siga com o resto |

## O que nunca fazer para avançar

- Marcar item de checklist sem ter feito.
- Passar o viewspec para `done` sem captura registrada em `captures`.
- Inventar texto, número ou imagem para preencher região.
- Trocar regra do guia de origem `@pessoa` sem o aceite dela.
- Escrever cor ou fonte literal num componente para "resolver rápido".
