# Princípios do movimento

## As cinco funções

Todo movimento do Designfy cumpre uma destas funções. Se não cumpre
nenhuma, não entra.

| Função | O que comunica | Exemplos |
| --- | --- | --- |
| chegada | isto acabou de entrar na tela | entrada do hero, revelação de seção, item novo na lista |
| resposta | o sistema recebeu a sua ação | hover, pressão, foco, botão com progresso |
| mudança | o estado é outro, e este é o novo | abrir e fechar, trocar de aba, ordenar, filtrar, validar |
| continuidade | isto e aquilo são a mesma coisa | indicador que desliza entre abas, capa que vira cabeçalho, transição de página |
| atenção | olhe aqui, com calma | faixa rolante, fundo que se move devagar, contador que sobe, selo de novidade |

A função de atenção é a única que roda sem ação da pessoa. Use com
moderação: um movimento contínuo por tela visível.

## Presença por padrão

O padrão do Designfy é presença calma: tudo chega, nada pula. O guia do
projeto escolhe o caráter:

| Caráter | Onde | Entrada | Distância | Laços |
| --- | --- | --- | --- | --- |
| mínimo | sistema de operação densa | 150 a 250 ms | até 8 px | nenhum, só progresso |
| calmo (padrão) | sistemas e sites | 400 a 600 ms | 16 px | um por tela, lento |
| expressivo | página de venda, lançamento, marca jovem | 600 a 900 ms | 24 a 40 px, máscaras, escala | dois por tela, com pausa |

Mesmo no caráter mínimo a tela se move: estados com transição, abrir e
fechar animados, carregamento com forma.

## Tokens

Os valores vêm do tema (`designfy theme show --group motion`).

| Token | Valor padrão | Uso |
| --- | --- | --- |
| `--duration-instant` | 100 ms | cor ao pressionar, marca de seleção |
| `--duration-fast` | 150 ms | hover, pressão, dica, troca de cor |
| `--duration-base` | 250 ms | abrir e fechar, menu, aba, sanfona |
| `--duration-slow` | 500 ms | entrada de bloco, revelação, gaveta |
| `--duration-slower` | 800 ms | visual grande, máscara, desenho de gráfico |
| `--stagger` | 60 ms | intervalo entre irmãos numa sequência |
| `--reveal-distance` | 16 px | deslocamento da entrada |

| Curva | Classe | Uso |
| --- | --- | --- |
| `--ease-out-quart` | `ease-out-quart` | resposta e mudança: rápida no começo, pousa suave |
| `--ease-out-expo` | `ease-out-expo` | chegada: entra decidida e assenta devagar |
| `--ease-in-quart` | `ease-in-quart` | partida: sai acelerando |
| `--ease-in-out-quart` | `ease-in-out-quart` | ida e volta, laços, alternância |
| `--ease-spring` | `ease-spring` | um momento de marca; nunca em estado de interface |
| linear | `ease-linear` | progresso, faixa rolante, movimento ligado à rolagem |

Regras de tempo:

- Quanto maior a área que se move, mais longa a duração. Um ícone leva
  150 ms; um painel de tela inteira, 400 a 500 ms.
- Saída mais rápida que a entrada: 60% a 75% do tempo.
- Sequência escalonada: 30 a 60 ms entre itens, 500 ms no total no máximo.
  Com mais de oito itens, os últimos entram juntos.
- Nada que a pessoa espera para poder agir passa de 300 ms.
- Movimento que a pessoa disparou começa em até 100 ms.

## Distância e escala

- Entrada por subida: 8 a 24 px. Mais que isso vira espetáculo.
- Escala de entrada: de 0.96 a 1. Escala de pressão: 0.98. Elevação de
  hover: 1 a 2 px.
- Rotação só em ícone que indica estado (seta de sanfona, 180 graus).
- Desfoque como entrada só em título de hero, uma vez, e nunca em texto
  longo.

## Coreografia

- Ordem de leitura é a ordem de entrada: título, texto, ação, visual.
- O que é mais importante entra primeiro e se move menos.
- Elementos irmãos entram em sequência; grupos diferentes entram em
  momentos diferentes, nunca tudo junto.
- Um foco por vez: enquanto um visual grande entra, o resto fica quieto.
- Origem coerente: menu abre do botão que o chamou; gaveta vem da borda
  onde mora; aviso sobe do canto onde fica.

## O que evitar

| Vício | Por quê | Em vez disso |
| --- | --- | --- |
| a mesma subida em todos os elementos da página | vira ruído | revelação por seção, sequência só em grades |
| animação que repete ao rolar para cima | cansa e esconde conteúdo | uma vez |
| quique em botão, menu ou cartão | lê como brinquedo | curva de saída |
| paralaxe de fundo e cursor personalizado | enjoa e atrapalha | profundidade por camadas estáticas |
| brilho que pulsa atrás do texto | tira a leitura | fundo parado e movimento no conteúdo |
| carrossel que troca sozinho sem pausa | a pessoa perde o que lia | troca por ação, ou pausa no hover e no foco |
| contador subindo número inventado | engana | só número real |
| esconder conteúdo esperando script | página em branco se o script falha | visível por padrão |
| tudo com 300 ms e `ease` | genérico | tokens por função |
