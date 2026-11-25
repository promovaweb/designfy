# Estados e avisos em telas de sistema

Em sistema, o caminho feliz é só um dos estados. Os outros acontecem todo
dia: a rede atrasa, a lista está vazia, o servidor recusa.

## Mapa de estados por região

Para cada região que recebe dado, escreva no viewspec:

| Estado | Pergunta que responde | Componente |
| --- | --- | --- |
| carregando | está vindo? | `skeleton` com a forma do conteúdo |
| vazio de primeiro uso | o que é isto e como começo? | `empty-state` com a ação de criar |
| vazio por filtro | por que não achei? | mensagem com o filtro e "limpar" |
| erro de carga | o que falhou e o que faço? | `error-state` com tentar de novo |
| parcial | o resto funciona? | a região com erro avisa; as outras seguem |
| sem permissão | por que não vejo? | mensagem com a quem pedir |
| desatualizado | isto é de quando? | hora da última atualização e atualizar |
| sem conexão | estou fora do ar? | faixa no topo; ações que dependem de rede esperam |
| lotado | e com muito dado? | paginação, virtualização, truncamento |

## Carregando

| Duração esperada | O que mostrar |
| --- | --- |
| até 200 ms | nada |
| 200 ms a 1 s | esqueleto |
| 1 a 10 s | esqueleto, e texto do que está carregando depois de 2 s |
| mais de 10 s | progresso com etapas ou percentual, e a opção de sair e ser avisado |

- O esqueleto tem a forma e o tamanho do conteúdo, para nada pular.
- Atualização de dado que já está na tela: mantenha o dado antigo com
  opacidade reduzida e um indicador pequeno. Não troque tudo por
  esqueleto de novo.
- Indicador giratório só dentro de botão ou em espaço pequeno.
- Região com `aria-busy`.

## Vazio

`empty-state`: ícone ou ilustração discreta, título, uma frase e a ação.

| Tipo | Texto |
| --- | --- |
| primeiro uso | "Nenhum pedido ainda. Crie o primeiro para acompanhar a entrega." com "Novo pedido" |
| filtro sem resultado | "Nenhum pedido com estado Atrasado em novembro." com "Limpar filtros" |
| tudo feito | "Nenhuma pendência. Tudo em dia." sem ação |
| sem permissão | "Você não tem acesso às faturas. Peça à administração da conta." |

O vazio fica dentro da região (o cartão, a área da tabela), não toma a
tela inteira quando o resto dela tem conteúdo.

## Erro

`error-state` na região, ou `alert` no topo dela.

Estrutura da mensagem: o que aconteceu, em linguagem simples; o que foi
preservado; o que fazer agora.

> Não foi possível salvar o pedido. O que você digitou continua aqui.
> Tente de novo em instantes.

- Sem código técnico no texto principal; o código de suporte fica em
  texto menor, copiável.
- Sem culpar a pessoa, sem "Ops", sem ponto de exclamação.
- Botão de tentar de novo, com progresso.
- Erro de validação fica no campo; erro de sistema fica no topo do
  formulário ou da região.

| Erro | Tratamento |
| --- | --- |
| 404 de registro | tela de "não encontrado" com link para a lista |
| sem permissão | explicação e a quem pedir |
| sessão expirada | leva para entrar e devolve ao ponto |
| conflito de edição | mostra a diferença e deixa escolher |
| limite do plano | diz o limite e oferece o caminho |
| falha de servidor | tentar de novo e código de suporte |
| sem rede | faixa persistente; fila do que será enviado ao voltar, quando o sistema suporta |

## Sucesso

A melhor confirmação é ver o resultado: a linha aparece, o estado muda, o
valor atualiza. Além disso:

| Situação | Confirmação |
| --- | --- |
| efeito visível na tela | nenhuma mensagem extra |
| efeito fora da tela (enviou e-mail, exportou) | aviso curto |
| ação que dá para desfazer | aviso com "Desfazer" |
| tarefa longa concluída | aviso, e marca na lista de tarefas |
| fluxo importante concluído (cadastro, pagamento) | tela de conclusão com o próximo passo |

## Qual aviso usar

| Componente | Uso | Dura |
| --- | --- | --- |
| aviso curto (`toast`) | confirmação e falha de ação pontual | some em 5 s; pausa no hover |
| alerta na região (`alert`) | condição que persiste até ser resolvida | fica |
| faixa no topo do sistema | condição global: sem rede, manutenção, cobrança pendente | fica |
| diálogo (`dialog`) | precisa de resposta antes de continuar | até responder |
| mensagem no campo | erro de validação | até corrigir |
| selo no menu | pendência que espera ação | até resolver |

- Aviso curto nunca é o único registro de um erro importante.
- Um aviso por vez sobre a mesma coisa.
- Avisos empilham no canto inferior direito no desktop e no pé, acima da
  navegação, no celular.
- `role="status"` para confirmação, `role="alert"` para erro.

## Tarefas em segundo plano

Importação, exportação e processamento longo: a pessoa inicia, vê o
progresso num indicador que acompanha a navegação (ou numa central de
tarefas) e é avisada ao terminar, com link para o resultado. Fechar a tela
não cancela sem perguntar.

## Estado em andamento de um registro

Selo com texto ("Processando") e movimento discreto, atualização
automática em intervalo razoável, e a hora da última verificação.

## Como forçar cada estado para testar

- rede lenta: limitação de rede do navegador, ou um atraso no cliente de
  dados em desenvolvimento;
- vazio: filtro sem resultado e conta nova;
- erro: resposta de erro simulada por parâmetro em desenvolvimento;
- lotado: dados de amostra com nomes longos e mil linhas;
- sem permissão: usuário de teste com papel restrito.

Capture cada estado com `designfy capture run` e leve as imagens para a
revisão.
