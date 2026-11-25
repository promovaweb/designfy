# Vícios de página gerada

Os sinais que fazem uma página parecer saída de um gerador, e a correção
de cada um. Esta lista absorve a lista de revisão do
[Hallmark](https://github.com/nutlope/hallmark) (licença MIT), adaptados
ao tema do Designfy. A skill `hallmark` continua disponível como
especialista externa: `designfy skills install hallmark`.

Há três graus:

- **Piso**: nunca passa. Corrija antes de entregar.
- **Reflexo**: é o padrão de todo gerador. Corrija, ou registre em
  `## Notas` do viewspec o motivo real para manter.
- **Acabamento**: detalhe de ofício. Responda item a item.

O guia do projeto vale mais que esta lista: uma preferência registrada
pela pessoa em `VIEWSPEC.md` prevalece sobre um reflexo.

## Cor e superfície

| Grau | Sinal | Correção |
| --- | --- | --- |
| piso | gradiente de roxo para azul, roxo para rosa ou ciano sobre escuro, inclusive em texto | um matiz âncora e tinta sólida |
| piso | cor ou `font-family` literal fora do arquivo de tokens | papel do tema |
| piso | texto, ícone, anel de foco ou borda de campo abaixo do contraste | ajuste o par e meça |
| piso | texto de botão quase da cor do fundo; cinza sobre superfície colorida | o `*-foreground` do papel |
| reflexo | texto em gradiente de qualquer cor | tinta sólida; peso ou fonte de título |
| reflexo | preto e branco absolutos em superfície; cinza sem matiz ao lado de cor | neutro tingido pelo matiz da base |
| reflexo | acento ocupando grande parte da tela sem regra | acento como sinal: ação, link, foco, item ativo |
| reflexo | brilho e lavagem: manchas desfocadas atrás do texto, esferas flutuando, halo colorido, sombra que brilha no escuro | superfície sólida ou preset de fundo com máscara; elevação por luminosidade |
| reflexo | paleta padrão do framework (`indigo-500`, `slate-900`) | cor do tema |
| reflexo | papel creme, serifa de alto contraste e acento terracota, sem a marca pedir | mude um eixo: o acento primeiro |

## Tipografia

| Grau | Sinal | Correção |
| --- | --- | --- |
| piso | uma palavra em itálico dentro de um título reto | quebra de linha, ou o título inteiro de um jeito |
| piso | rótulo, legenda, menu, selo ou cabeçalho de tabela em caixa alta ou com letras espaçadas | corpo do texto, um degrau menor, caixa normal |
| piso | título em caixa alta que quebra com altura de linha abaixo de 1 | 1.02 a 1.08 |
| reflexo | fonte de sistema ou a mais comum do momento como título, sem escolha | um par de `pares-tipograficos.md` |
| reflexo | texto corrido fora de 45 a 75 caracteres por linha | `df-measure` |
| reflexo | mais de três famílias | título, texto e uma exceção |
| reflexo | uma palavra do título em outra cor, peso ou com fundo | um título, um estilo |
| reflexo | mono como fantasia em rótulos e legendas | mono só para código e número medido |
| reflexo | texto abaixo de 12 px; prosa com altura de linha abaixo de 1.3 | corpo de 16 px a 1.5 ou mais |

## Estrutura e layout

| Grau | Sinal | Correção |
| --- | --- | --- |
| piso | cartão dentro de cartão | uma camada de contenção |
| piso | hero medido em `vh` | `svh` ou `dvh` |
| piso | rolagem horizontal em alguma largura de 320 a 1920; `100vw` | `overflow-x: clip` em `html` e `body`, larguras em `%` |
| piso | título, frase, ação e foco do visual fora da tela em 1280 x 800 | reduza o título, aperte a altura de linha, encurte a frase |
| piso | em 1920 o container sem limite ou a grade ganhando colunas | container limitado e centralizado |
| piso | trilha de grade com imagem em `1fr` puro; título sem `overflow-wrap` | `minmax(0, 1fr)`; `break-word` |
| piso | mais de cerca de 80 palavras numa tela de 900 px; hero com mais de dois blocos de texto antes das ações | título, uma frase, ações |
| piso | linha pequena acima do título anunciando a seção | abra a seção de outro jeito |
| piso | dois elementos fixos no topo se sobrepondo | o segundo com `top` igual à altura do primeiro |
| reflexo | três colunas iguais de ícone acima de título; ícone em moeda arredondada; faixa lateral colorida em cartão | larguras e alturas variadas, ícone em linha, borda fina |
| reflexo | hero com título, frase, ação e marca todos no eixo central | no máximo dois centralizados |
| reflexo | o molde: hero, três recursos, chamada, rodapé | monte pelo argumento da página |
| reflexo | todas as seções separadas do mesmo jeito | varie fundo, linha e espaço |
| reflexo | espaço entre seções abaixo de 96 px no desktop, ou todos iguais | 96 px ou mais, variando |
| reflexo | título de seção colado no que vem antes | o dobro do espaço acima em relação ao de baixo |
| reflexo | texto colado na borda de uma caixa; texto a menos de 16 px da borda do celular | preenchimento; margem de 16 px |
| reflexo | seção magra: corpo estreito com metade da tela vazia, ou sem massa | alargue, acrescente um visual, uma frase grande, ou junte |
| reflexo | títulos de seção pequenos sob um hero enorme | `text-headline` |
| reflexo | faixa morta: mais de 160 px vazios entre o conteúdo do hero e a dobra | centralize e aumente o visual; nunca mais texto |
| reflexo | ilustração desenhada de objeto, pessoa ou cenário | foto real, o produto, ou tipografia |
| reflexo | quadro vazio com gradiente onde iria a imagem | a imagem, o produto montado, ou nada |
| reflexo | fileira de marcas idênticas para representar quantidade | o número em tipografia |
| reflexo | parede de fotos de banco abaixo do hero | poucas imagens fortes e o resto no material do tema |
| reflexo | produto falso desenhado quando o produto existe | captura real |
| reflexo | fechar com campo de e-mail sem a página ser de captação | fechar com a ação que o visitante veio fazer |

## Elementos e texto

| Grau | Sinal | Correção |
| --- | --- | --- |
| piso | nome de exemplo, empresa genérica, palavra de enchimento, travessão em frase, abertura vazia, segunda ação genérica | os substantivos do projeto |
| piso | número, depoimento, parede de logos ou contagem de casos inventados | o dado da pessoa, uma lacuna, ou nada |
| piso | barra de navegador ou janela de sistema desenhadas à mão | captura real numa figura, ou sem moldura |
| piso | itens ligados por ponto mediano, seta colada no texto do link, bolinha decorativa antes de rótulo | quebra de linha, colunas, verbo no rótulo |
| piso | formulário que responde "Enviado" sem pedido por trás | sem estado de sucesso até ser ligado; diga que não está conectado |
| piso | emoji no lugar de ícone | uma biblioteca de ícones |
| piso | imagem quebrada; foto de banco sem crédito | o arquivo real; crédito |
| piso | texto pintado embaixo de outro elemento | espaço próprio |
| piso | rótulo de botão ou link do menu quebrando linha | encurte; `whitespace-nowrap` |
| reflexo | cabeçalho e rodapé de gerador (marca, links, botão; quatro colunas, redes, direitos) sem escolha | monte com o que o projeto tem |
| reflexo | número solto como único título do hero | acompanhe com a frase que diz o que ele mede |
| reflexo | moldura de celular, notebook, terminal ou editor | uma moldura, com conteúdo real, ou nenhuma |
| reflexo | texto de enfeite: rótulo girado na vertical, "role para baixo", selo de versão no hero, faixa de cidade e clima, "01 / 04" em blocos | apague; fato perdido vira legenda |
| reflexo | página de quadros vazios: seis retratos em branco, quatro telas cinza | componha em texto; um ou dois quadros com conteúdo real |
| reflexo | eco: o mesmo fato (preço, data) em quatro seções; última linha repetindo o título | cada fato uma vez, onde trabalha |

## Movimento e interação

| Grau | Sinal | Correção |
| --- | --- | --- |
| piso | `transition: all`; animação de `width`, `height`, `top`, `left` | liste as propriedades; `transform` e `opacity` |
| piso | anel de foco que aparece com transição | na hora |
| piso | elemento interativo sem foco visível | anel de 2 px com 3:1 |
| piso | animação sem versão para movimento reduzido | acrescente |
| piso | conteúdo escondido esperando JavaScript | visível por padrão; esconder só sob `.js` |
| piso | conteúdo que troca sozinho sem pausa no hover e no foco | pausa, e controle visível acima de 5 s |
| piso | vídeo em reprodução automática sem `muted`; carga tardia na maior imagem | `autoplay muted loop playsinline`; prioridade alta |
| piso | campo cuja borda muda de largura entre estados; desativado só por opacidade | borda constante, `outline` no foco, três sinais no desativado |
| reflexo | a mesma elevação em todos os cartões; vários efeitos no mesmo elemento; hover em elemento não interativo | um sinal por elemento, no contêiner |
| reflexo | quique em estado de interface | curva de saída |
| reflexo | aviso comemorando um efeito que a pessoa já vê | sucesso silencioso |
| reflexo | altura de controle fora de 44 a 52 px em página pública | o número |
| reflexo | paralaxe de fundo, cursor personalizado, rastro do ponteiro | camadas estáticas |

No Designfy, movimento é o padrão: a ausência de movimento também é
defeito. Toda tela de rolagem tem algo que se move com função.

## Acabamento

- Aspas retas em prosa; três pontos no lugar das reticências.
- Mais de um botão preenchido na mesma tela.
- Números grandes sem algarismos tabulares.
- A mesma receita de contêiner em seis seletores ou mais.
- Superfícies do navegador sem tema (seleção, cursor de texto, barra de
  rolagem).
- Bloco de texto espremido numa faixa estreita.
- Mais de três pesos de fonte em uso.
- Grade que deixa um item sozinho na última linha.
- Nível de título pulado.
- Documento sem `lang`, `title` ou descrição.
- Borda fina sob sombra larga na mesma superfície.
- Conteúdo que o celular não recebe: texto mostrado no desktop e escondido
  em 390 px; tabela abrindo com colunas fora da tela.
- Parágrafo que deixa uma palavra sozinha na última linha.

## Como usar esta lista

1. Rode antes de entregar a página, com as capturas abertas.
2. Corrija todo item de piso.
3. Para cada reflexo encontrado: corrija, ou escreva em `## Notas` a razão
   desta página para manter.
4. Responda os itens de acabamento.
5. A `designfy-review` repete a conferência com olhos novos.

Com a skill `hallmark` instalada e o Node disponível, o script dela confere
boa parte desta lista em HTML e CSS estáticos. Rode como apoio; a
conferência do Designfy é a das capturas.
