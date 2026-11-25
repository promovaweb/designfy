# CRUD e tela de detalhe

O CRUD é o conjunto de telas de um recurso: listar, ver, criar, editar e
excluir. As cinco operações têm caminho de ida e de volta.

## Mapa das telas

| Operação | Tela | Endereço |
| --- | --- | --- |
| listar | tabela com filtro | `/pedidos` |
| ver | detalhe | `/pedidos/1042` |
| criar | formulário | `/pedidos/novo` |
| editar | formulário | `/pedidos/1042/editar`, ou gaveta sobre a lista |
| excluir | confirmação | sem tela própria |

Um viewspec `crud` cobre o conjunto quando as telas compartilham estrutura.
Formulário com fluxo próprio em etapas ganha um viewspec `form`.

## Onde criar e editar

| Formulário | Padrão | Por quê |
| --- | --- | --- |
| até seis campos | gaveta lateral sobre a lista | a pessoa não perde o lugar |
| sete campos ou mais, ou com seções | página própria | espaço e endereço |
| um campo | edição em linha | rapidez |
| ajuste em muitos registros | edição em lote na barra de seleção | menos repetição |

Criar e editar usam o mesmo formulário. A diferença está no título, no
rótulo do botão ("Criar pedido", "Salvar alterações") e nos valores
iniciais.

## Fluxo de criar

1. Botão "Novo pedido" no cabeçalho da lista.
2. Formulário com os obrigatórios primeiro.
3. Envio com progresso.
4. Sucesso: vai para o detalhe do registro criado, ou fecha a gaveta com
   a linha nova realçada na lista.
5. "Salvar e criar outro" só quando a tarefa é cadastro em série.

## Fluxo de editar

1. Ação "Editar" no detalhe ou no menu da linha.
2. Formulário preenchido.
3. Aviso de alteração não salva ao tentar sair.
4. Sucesso: volta ao detalhe ou à lista, com os filtros e a página
   preservados, e a linha alterada realçada.
5. Conflito (outra pessoa alterou): mostra o que mudou e deixa escolher.

## Excluir

| Situação | Padrão |
| --- | --- |
| dá para desfazer | exclui na hora e mostra aviso com "Desfazer" por alguns segundos |
| não dá para desfazer | `confirm-dialog` que nomeia o registro e a consequência |
| apaga muito, ou é irreversível e grave | confirmação digitando o nome do registro |
| em lote | confirmação com a contagem |

- O botão de confirmar repete o verbo: "Excluir pedido", nunca "OK".
- O foco inicial do diálogo fica em cancelar.
- Excluir não fica ao lado da ação principal: fica no menu, separado.
- Prefira arquivar a excluir quando o negócio permite.
- Depois de excluir a partir do detalhe: volta à lista com aviso.

## Tela de detalhe

A pessoa abre o detalhe para consultar e para agir sobre um registro.

| Região | Conteúdo | Fragmento |
| --- | --- | --- |
| cabeçalho | voltar, nome ou número, estado, dados curtos, ação principal, menu | `page-header` |
| resumo | três a cinco números ou datas do registro | `stat-card` pequenos ou uma faixa |
| atributos | grupos de pares rótulo e valor | `description-list` |
| abas | conteúdo relacionado (itens, pagamentos, arquivos) | `tabs` com URL |
| histórico | o que aconteceu e quem fez | `activity-feed` |
| relacionados | tabelas curtas de registros ligados | `data-table` simples |

- O que mais se consulta aparece sem rolar.
- Atributos em grupos com título; rótulo em `muted-foreground`, valor em
  `foreground`.
- Valor copiável (código, chave, endereço) com botão de copiar.
- Valor vazio com traço.
- Edição em linha nos atributos de ajuste frequente.
- Layout comum no desktop: coluna principal com abas e conteúdo, coluna
  lateral com atributos e histórico. No celular, uma coluna, com o rótulo
  acima do valor.

## Estados do detalhe

| Estado | O que aparece |
| --- | --- |
| carregando | esqueleto do cabeçalho e dos blocos |
| não encontrado | `error-state` dizendo que o registro não existe ou foi removido, com link para a lista |
| sem permissão | o que não pode ser visto e a quem pedir |
| aba vazia | `empty-state` da aba, com a ação de adicionar |
| em processamento | selo de estado com movimento discreto e atualização automática |

## Navegação entre registros

- "Voltar" devolve a lista com filtros, ordenação, página e posição de
  rolagem.
- Anterior e próximo dentro do resultado filtrado, quando a tarefa é
  revisar em sequência.
- Abrir registro em nova aba funciona: cada detalhe tem endereço.

## Estado otimista

Para ações rápidas e seguras (marcar, mover, renomear), a interface mostra
o resultado na hora e desfaz se o servidor recusar, explicando. Para
pagamento, envio e exclusão definitiva, espere a confirmação do servidor.

## Permissões

Ação que a pessoa não pode fazer some, ou aparece desativada com o motivo
na dica, conforme o guia. Nunca um botão que falha só depois do clique.

## Movimento

Gaveta desliza da direita; linha criada ou alterada realça e some;
linha excluída recolhe; abas com indicador que desliza; troca entre
detalhe e lista com transição curta.
