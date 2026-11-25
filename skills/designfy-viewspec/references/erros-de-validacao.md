# Erros de validação

`designfy viewspec validate` sai com 10 e lista `{ file, line, field,
message }` para cada problema. Esta tabela diz o que corrigir.

## Viewspec de tela

| Mensagem aponta para | Causa | Correção |
| --- | --- | --- |
| campo desconhecido no front matter | chave fora do contrato | remova a chave ou mova a informação para `## Notas` |
| valor fora do enum em `status`, `kind`, `surface`, `framework`, `priority` | valor digitado errado | use um valor da tabela do contrato |
| `id` ou `slug` diferente do diretório | pasta renomeada ou cópia de outro viewspec | iguale o front matter ao nome da pasta; não renomeie pasta de viewspec que já tem histórico |
| seção ausente ou fora de ordem | título alterado ou seção apagada | restaure os nove títulos exatos na ordem: Objetivo, Conteúdo, Estrutura, Estados, Responsivo, Movimento, Acessibilidade, Checklist, Notas |
| item de checklist sem `{#id}` | linha escrita à mão sem identificador | gere quatro caracteres `[a-z0-9]` e acrescente no fim da linha |
| `{#id}` repetido | linha copiada | gere um identificador novo para a cópia |
| `status: done` com item pendente | estado mudado cedo | volte para `in_progress` ou conclua os itens |
| `status: done` sem `captures` | revisão não registrada | rode a captura e registre o nome da execução |
| `blockedReason` sem `status: blocked` (ou o inverso) | estado e motivo fora de sincronia | mantenha os dois juntos; o mesmo vale para `archived` |
| `kind` incompatível com `surface` | tipo de sistema marcado como site, ou o inverso | corrija pela tabela de tipos |
| entrada de `skills` que não começa com `designfy` | nome de outra biblioteca | liste só especialistas do Designfy; skills externas ficam em `## Notas` |
| `deviations` sem texto em `## Notas` | desvio sem explicação | escreva a nota com o identificador da regra e o motivo |
| data inválida | formato fora do ISO | use `2026-11-24T15:00:00-03:00` |

## Guia da raiz

| Mensagem aponta para | Causa | Correção |
| --- | --- | --- |
| `scope` diferente de `project` | arquivo de tela copiado para a raiz | use o modelo do guia |
| seção ausente ou fora de ordem | título alterado | restaure os catorze títulos na ordem do contrato |
| `{#id}` com letra errada | regra movida de seção | dê um identificador novo com a letra da seção atual e atualize os viewspecs que citavam o antigo |
| `{#id}` repetido | regra copiada | identificador novo |
| regra sem origem | faltou `@pessoa`, `@agente` ou `@revisão` | acrescente a origem antes do `{#id}` |
| aprendizado sem data, origem ou destino | entrada incompleta | complete no formato `- AAAA-MM-DD \`@origem\` texto. → destino` |
| destino aponta para regra inexistente | regra apagada ou identificador digitado errado | corrija o identificador; se a regra saiu, escreva `descartado:` com o motivo |

## Aviso `guide: missing`

O projeto não tem `VIEWSPEC.md` na raiz. A validação continua com saída 0,
mas nenhuma tela deve começar: rode o modo guia desta skill.

## Depois de corrigir

Rode `designfy viewspec validate` de novo. Arquivo recusado não aparece em
`designfy viewspec list` nem na aba Viewspecs da TUI, então um viewspec
inválido some das contagens de progresso até ser corrigido.
