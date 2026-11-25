# WCAG 2.2 AA na prática

A WCAG organiza a acessibilidade em quatro princípios. Aqui estão as
exigências do nível AA que mais aparecem em interface, em linguagem de
quem constrói a tela. A fonte normativa é
<https://www.w3.org/TR/WCAG22/>; consulte-a quando houver dúvida de
interpretação.

## Perceptível

| Exigência | Na tela |
| --- | --- |
| alternativa em texto (1.1.1) | imagem com informação tem texto alternativo; decorativa tem `alt=""`; ícone sozinho em botão tem nome |
| legendas e alternativas de mídia (1.2) | vídeo com fala tem legenda; áudio tem transcrição |
| informação e relações (1.3.1) | títulos, listas, tabelas, rótulos e grupos marcados no HTML |
| sequência com sentido (1.3.2) | a ordem do DOM é a ordem de leitura |
| características sensoriais (1.3.3) | instrução não depende só de forma, posição ou cor ("o botão verde à direita") |
| orientação (1.3.4) | a tela funciona em pé e deitada |
| propósito do campo (1.3.5) | `autocomplete` nos campos de dado pessoal |
| uso de cor (1.4.1) | estado, erro e link não dependem só de cor |
| contraste de texto (1.4.3) | 4.5:1; texto grande 3:1 |
| redimensionar texto (1.4.4) | funciona com texto a 200% |
| imagem de texto (1.4.5) | texto é texto, não imagem |
| refluxo (1.4.10) | a 320 px de largura, sem rolagem horizontal da página |
| contraste não textual (1.4.11) | borda de campo, ícone com função, estado e foco com 3:1 |
| espaçamento de texto (1.4.12) | nada quebra quando a pessoa aumenta espaço entre linhas, letras e parágrafos |
| conteúdo em hover ou foco (1.4.13) | dica e popover podem ser dispensados (Escape), alcançados pelo ponteiro e ficam até a pessoa sair |

## Operável

| Exigência | Na tela |
| --- | --- |
| teclado (2.1.1) | tudo funciona sem ponteiro |
| sem armadilha (2.1.2) | o foco entra e sai de todo componente |
| atalhos de uma tecla (2.1.4) | podem ser desligados ou remapeados, ou só valem com o componente em foco |
| tempo ajustável (2.2.1) | sessão e limite de tempo avisam e permitem estender |
| pausar, parar, ocultar (2.2.2) | o que se move sozinho por mais de 5 s tem controle |
| três flashes (2.3.1) | nada pisca mais de três vezes por segundo |
| pular blocos (2.4.1) | link "Pular para o conteúdo" |
| título da página (2.4.2) | `title` descreve a página |
| ordem do foco (2.4.3) | segue a lógica da tela |
| propósito do link (2.4.4) | o texto do link diz o destino |
| várias formas de chegar (2.4.5) | navegação mais índice, mapa ou links relacionados |
| títulos e rótulos (2.4.6) | descrevem o assunto |
| foco visível (2.4.7) | sempre |
| foco não encoberto (2.4.11, nova na 2.2) | o elemento em foco não fica escondido atrás de cabeçalho ou barra fixa |
| gestos de ponteiro (2.5.1) | gesto complexo tem alternativa de toque simples |
| cancelamento do ponteiro (2.5.2) | a ação dispara ao soltar, e dá para desistir arrastando para fora |
| rótulo no nome (2.5.3) | o nome acessível contém o texto visível |
| movimento do aparelho (2.5.4) | sacudir e inclinar têm alternativa |
| arrastar (2.5.7, nova na 2.2) | arrastar tem alternativa por clique (reordenar por botões, mover por menu) |
| tamanho do alvo (2.5.8, nova na 2.2) | 24 por 24 px no mínimo, ou espaço equivalente em volta |

## Compreensível

| Exigência | Na tela |
| --- | --- |
| idioma (3.1.1, 3.1.2) | `lang` no `html` e nos trechos em outro idioma |
| em foco e em entrada (3.2.1, 3.2.2) | focar ou preencher um campo não muda o contexto sem aviso |
| navegação e identificação consistentes (3.2.3, 3.2.4) | menu na mesma ordem; mesma função, mesmo nome |
| ajuda consistente (3.2.6, nova na 2.2) | o caminho para ajuda fica no mesmo lugar em todas as telas |
| identificação do erro (3.3.1) | o erro é descrito em texto, no campo |
| rótulos ou instruções (3.3.2) | todo campo tem rótulo; formato exigido é dito antes |
| sugestão de correção (3.3.3) | a mensagem diz como corrigir |
| prevenção de erro (3.3.4) | ação legal ou financeira pode ser revista, confirmada ou desfeita |
| entrada redundante (3.3.7, nova na 2.2) | o que a pessoa já informou no fluxo é preenchido ou oferecido |
| autenticação acessível (3.3.8, nova na 2.2) | entrar não exige decorar nem transcrever: permite colar e gerenciador de senhas; desafio tem alternativa |

## Robusto

| Exigência | Na tela |
| --- | --- |
| nome, função, valor (4.1.2) | todo componente expõe papel, nome e estado |
| mensagens de status (4.1.3) | resultado, erro e progresso são anunciados sem mover o foco |

## O que mais falha em interface gerada

1. Contraste de texto secundário e de texto sobre cor.
2. Foco invisível ou removido.
3. Botão de ícone sem nome.
4. `div` clicável no lugar de `button`.
5. Campo sem rótulo, só com texto de exemplo.
6. Erro de formulário só em vermelho, sem texto ligado ao campo.
7. Títulos fora de ordem, ou vários `h1`.
8. Diálogo que não prende o foco nem o devolve.
9. Imagem com informação e sem texto alternativo.
10. Animação sem versão parada.
11. Conteúdo que aparece só no hover.
12. Mudança de estado que o leitor de tela não ouve.

## Níveis

- **A**: o mínimo; sem ele, alguém não consegue usar.
- **AA**: o alvo do Designfy e a referência da maior parte das leis.
- **AAA**: melhorias pontuais que valem quando custam pouco: contraste de
  7:1 no corpo do texto, alvo de 44 px, nenhum limite de tempo.

O nível adotado pelo projeto fica em `## Acessibilidade` do guia.
