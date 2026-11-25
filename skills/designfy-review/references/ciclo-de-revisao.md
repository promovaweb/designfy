# Ciclo de revisão

```text
capturar → ler o manifesto → examinar as imagens → relatar →
devolver às especialistas → corrigir → capturar de novo → conferir → fechar
```

## Quando a revisão roda

| Momento | Alcance |
| --- | --- |
| fim de um viewspec | a tela inteira, todas as larguras e temas |
| depois da primeira dobra pronta | só o hero, em 1280 x 800 e 390 x 844, antes de construir o resto |
| pedido de "deixa melhor" numa tela existente | a tela atual, como diagnóstico, antes de mexer |
| mudança no tema ou num componente compartilhado | uma tela de cada tipo que usa a peça |
| antes de publicar | as telas principais do projeto |

Revisar o hero cedo evita construir a página inteira sobre uma primeira
dobra que não fecha.

## Olhos novos

Quem acabou de construir enxerga a intenção, não o resultado. Três
formas de ganhar distância, da melhor para a mais simples:

1. **Revisor separado.** Outro agente, sem a conversa da construção,
   recebe as imagens, o viewspec, o guia e as listas de conferência, com
   o pedido de [assets/pedido-ao-revisor.md](../assets/pedido-ao-revisor.md).
   Ele devolve os achados; quem construiu corrige.
2. **Mesma sessão, material frio.** Releia o viewspec e o guia do começo,
   abra as imagens uma a uma e percorra as listas item por item, anotando
   antes de pensar na correção.
3. **A pessoa.** Envie as capturas com duas perguntas diretas: "o que
   incomoda?" e "o que você faria primeiro nesta tela?".

Registre no relatório qual das três foi usada.

## Rodadas

| Rodada | Objetivo | Nome da execução |
| --- | --- | --- |
| 1 | achar tudo | `<slug>-r1` |
| 2 | conferir as correções e achar o que elas trouxeram | `<slug>-r2` |
| 3 | fechar o que restou | `<slug>-r3` |

Em cada rodada nova, confira os achados anteriores primeiro (resolvido,
parcial, aberto) e depois olhe a tela inteira de novo: correção num lugar
quebra outro.

Limite de três rodadas. Achado de gravidade alta que sobrevive à terceira
é sinal de problema de estrutura ou de conteúdo: pare, descreva e leve à
pessoa.

## Conferir uma correção

- Abra a imagem nova na mesma largura e no mesmo tema do achado.
- Compare com a anterior.
- Marque: **resolvido** (o defeito sumiu e nada novo apareceu),
  **parcial** (melhorou, ainda fere a regra) ou **aberto**.
- Correção que troca um defeito por outro conta como aberto, com o
  achado novo anotado.

## Veredito

| Veredito | Condição |
| --- | --- |
| aprovada | nenhum achado de gravidade alta ou média aberto; baixos respondidos |
| aprovada com ressalvas | nenhum de gravidade alta; médios abertos com motivo registrado em `## Notas` |
| reprovada | algum de gravidade alta aberto |

Só o veredito "aprovada" ou "aprovada com ressalvas" permite o estado
`done` no viewspec.

## O que a revisão entrega

- o relatório da última rodada;
- as pastas de captura (`.designfy/captures/<execução>/`);
- as entradas para `## Aprendizados` do guia;
- as perguntas que só a pessoa responde (escolha de produto, conteúdo
  que falta).

## O que a revisão não faz

- Não edita a interface.
- Não aprova por nota, média ou percentual.
- Não troca a captura por descrição do código.
- Não deixa passar achado de gravidade alta por prazo.
