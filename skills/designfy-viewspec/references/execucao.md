# Execução, notas e estado

Como conduzir um viewspec de `draft` até `done`.

## Começar

1. Leia o viewspec inteiro e as regras do guia listadas em `guideRules`.
2. Confira `dependsOn`: todo viewspec listado precisa estar `done`. Se não
   estiver, execute aquele primeiro ou registre o motivo de seguir.
3. Mude `status` para `in_progress` e atualize `updatedAt`.

## Um item por vez

Para cada item pendente, na ordem da checklist:

1. Passe o item à especialista anotada (`#designfy-<skill>`). Ela lê as
   seções do viewspec ligadas ao item.
2. Depois da implementação, confira no navegador ou no build. Conferência
   mínima por dona:

   | Dona | Conferência |
   | --- | --- |
   | `designfy-design-system` | `designfy theme check` com saída 0 |
   | `designfy-components` | `designfy deps check` com saída 0 e o componente renderizando |
   | `designfy-websites`, `designfy-content`, `designfy-webapps` | a região aparece com o conteúdo real e os estados descritos |
   | `designfy-motion` | o movimento roda e a versão parada funciona com movimento reduzido |
   | `designfy-responsive` | captura em 390 e 820 com `overflowX` falso |
   | `designfy-accessibility` | navegação por teclado completa e contraste medido |
   | `designfy-review` | relatório sem achado aberto de gravidade alta |

3. Marque `[x]`, acrescente os arquivos tocados a `relatedFiles` e atualize
   `updatedAt`.

Nunca marque vários itens de uma vez no fim. O arquivo precisa refletir o
ponto atual do trabalho, para outra sessão conseguir retomar.

## Notas

Escreva em `## Notas`, com data, quando:

- uma escolha foi feita durante a execução (qual e por quê);
- a checklist mudou (item novo, item cortado, item dividido);
- um item foi desmarcado;
- a tela desviou de uma regra do guia (cite o identificador);
- faltou conteúdo e a região entrou com lacuna;
- a revisão achou algo que foi adiado.

```markdown
- 24/11/2026: tabela vira cartões abaixo de 640 px com número, cliente,
  estado e total. As colunas de vendedor e canal ficam só no detalhe.
- 24/11/2026: item {#p0x4} dividido em dois; o estado de erro ganhou item
  próprio {#e7k2}.
```

## Mudar a checklist

- Item novo: acrescente no ponto certo da ordem, com dona e `{#id}` novo.
- Item que deixou de valer: não apague em silêncio. Remova a linha e
  registre em `## Notas` o texto e o motivo.
- Item grande demais: divida. O item original mantém o `{#id}`; os novos
  ganham os seus.

## Parar

- Depende de algo externo (conteúdo, endpoint, acesso): `status: blocked`
  com `blockedReason` em uma frase que diga de quem depende e o quê.
- A tela deixou de fazer sentido: `status: archived` com `archivedReason`.
- A sessão vai terminar no meio: deixe `in_progress` e escreva em
  `## Notas` o ponto exato e o próximo passo.

## Fechar

1. Todos os itens `[x]`.
2. Captura feita depois da última correção:

   ```bash
   designfy capture run <url> --viewport mobile,desktop --name <slug>-final
   ```

3. Nome da execução em `captures`.
4. `status: done` e `updatedAt`.
5. Aprendizados levados ao guia.
6. `designfy viewspec validate`.

## Reabrir

Tela pronta que recebe mudança volta para `in_progress` com itens novos na
checklist e uma nota datada. O histórico anterior fica. Mudança grande
(outra estrutura, outro objetivo) ganha um viewspec novo, com o antigo em
`archived` e `archivedReason` apontando para o novo `id`.
