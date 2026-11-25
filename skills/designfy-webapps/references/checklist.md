# Checklist de tela de sistema

## Propósito

- [ ] A pergunta que a tela responde ou a tarefa que cumpre está escrita no viewspec.
- [ ] Uma ação principal, no cabeçalho da página.
- [ ] Ações destrutivas em menu, com confirmação que nomeia o registro.
- [ ] Nada na tela que não ajude a responder ou a cumprir.

## Dado

- [ ] Entidades, campos, tipos, volume e origem escritos em `## Conteúdo`.
- [ ] Testado com zero, um e muitos registros, texto longo e número grande.
- [ ] Números com algarismos tabulares, à direita, com unidade e formato do público.
- [ ] Datas no formato do público; relativas com a exata na dica.

## Shell

- [ ] Item do menu atual marcado com `aria-current` e mais que cor.
- [ ] Título da tela igual ao nome no menu.
- [ ] Trilha em tela com dois níveis ou mais.
- [ ] Foco no `h1` ao trocar de rota; link de pular para o conteúdo.

## Estados

- [ ] Carregando com esqueleto na forma do conteúdo, por região.
- [ ] Vazio de primeiro uso com a ação de começar.
- [ ] Vazio por filtro com "limpar filtros".
- [ ] Erro com o que falhou, o que foi preservado e tentar de novo.
- [ ] Um bloco com erro não derruba os outros.
- [ ] Sem permissão explicado.
- [ ] Sucesso visível; aviso curto só quando o efeito não aparece.

## Tabela

- [ ] Cinco a oito colunas; a primeira identifica e leva ao detalhe.
- [ ] Ordenação com `aria-sort`; padrão que faz sentido.
- [ ] Filtros com fichas, contagem e "limpar tudo".
- [ ] Seleção com barra de ações em lote e contagem.
- [ ] No máximo duas ações visíveis por linha.
- [ ] Paginação com intervalo e total.
- [ ] Formato no celular escrito e implementado.
- [ ] Tabela larga rola na própria caixa; a página não.

## Formulário

- [ ] Uma coluna, na ordem de preenchimento.
- [ ] Rótulo visível em todo campo; opcionais marcados.
- [ ] `type`, `inputmode` e `autocomplete` certos.
- [ ] Validação ao sair do campo; erro que diz o que corrigir.
- [ ] Resumo de erros com foco no envio com falha; valores preservados.
- [ ] Botão de enviar ativo, com progresso e sem mudar de largura.
- [ ] Aviso ao sair com alteração não salva.
- [ ] Em etapas: voltar sem perder dado, revisão no fim.

## Dashboard

- [ ] Três a cinco contadores que respondem à pergunta da tela.
- [ ] Todo número com comparação, meta ou série, e o período escrito.
- [ ] Variação com sinal e texto; cor segue o sentido do indicador.
- [ ] Gráfico certo para o dado; eixo de barras em zero.
- [ ] Séries distinguíveis sem depender só do matiz.
- [ ] Resumo em texto e alternativa em tabela para cada gráfico.
- [ ] Hora da última atualização.

## URL e retorno

- [ ] Filtro, ordenação, página, aba e registro aberto na URL.
- [ ] Voltar da tela de detalhe devolve a lista no mesmo ponto.
- [ ] Recarregar a página mantém o estado.

## Densidade e texto

- [ ] Densidade do guia aplicada; área de toque de 44 px no celular.
- [ ] Mesma palavra para a mesma coisa em todas as telas.
- [ ] Botões com verbo e objeto.
- [ ] Nenhum texto abaixo de 12 px.

## Movimento

- [ ] Estados com transição; abrir e fechar animados.
- [ ] Nenhum laço decorativo na tela de trabalho.
- [ ] Versão parada com movimento reduzido.

## Celular

- [ ] Barra lateral em gaveta.
- [ ] Ação principal alcançável com o polegar.
- [ ] Tabela, filtros e formulário no formato planejado.
- [ ] Nenhuma rolagem horizontal da página.

## Fechamento

- [ ] Cada estado forçado e capturado.
- [ ] Itens marcados no viewspec.
