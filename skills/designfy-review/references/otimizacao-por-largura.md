# Otimizar celular e desktop a partir das capturas

A captura mostra o problema; esta referência liga cada sintoma à causa
mais provável e à especialista que corrige.

## Como trabalhar

1. Capture antes (`<slug>-antes`).
2. Liste os sintomas por largura, olhando as imagens.
3. Para cada sintoma, ache a causa na tabela.
4. Devolva à especialista dona, com a captura e a região.
5. Capture depois (`<slug>-depois`) e compare lado a lado.
6. Repita até a lista zerar, no máximo três rodadas.

Corrija do celular para cima: ajuste a base, depois os prefixos. Uma
correção no desktop não pode quebrar o celular; por isso toda rodada
captura todas as larguras.

## Celular: sintomas e causas

| Sintoma na captura | Causa provável | Correção | Dona |
| --- | --- | --- | --- |
| página rola na horizontal | elemento com largura fixa, trilha `1fr` com conteúdo largo, `100vw` | `minmax(0,1fr)`, `min-w-0`, `max-w-full` | `designfy-responsive` |
| ação do hero fora da primeira tela | título grande demais, visual antes do texto, preenchimento alto | reduzir o `clamp`, texto antes do visual, menos espaço | `designfy-websites` |
| título quebra palavra no meio | palavra longa em tamanho grande | limite menor no celular, `overflow-wrap` | `designfy-design-system` |
| texto pequeno | tamanho de desktop reduzido | corpo de 16 px na base | `designfy-design-system` |
| linhas de duas ou três palavras | duas colunas mantidas no celular | uma coluna na base | `designfy-responsive` |
| botões lado a lado espremidos | grupo sem quebra | empilhar em largura total | `designfy-responsive` |
| alvos pequenos e grudados | altura de 32 px, sem espaço | `min-h-11`, `gap-2` | `designfy-responsive` |
| tabela cortada | tabela de desktop sem adaptação | cartões, colunas prioritárias ou rolagem própria | `designfy-webapps`, `designfy-responsive` |
| menu ocupando três linhas | links sem recolher | gaveta abaixo do ponto de quebra | `designfy-websites` |
| página muito longa | tudo empilhado com o espaço de desktop | espaço fluido, seções fundidas | `designfy-responsive` |
| deserto entre seções | `py` fixo de desktop | `df-section` | `designfy-design-system` |
| imagem achatada ou esticada | altura fixa sem `object-cover` | `aspect-ratio` e `object-cover` | `designfy-components` |
| conteúdo que existe no desktop e some | `hidden` na base | recolher, não remover | `designfy-responsive` |
| barra fixa cobrindo o fim | sem preenchimento inferior no conteúdo | preenchimento com a altura da barra | `designfy-responsive` |
| cartões com alturas desencontradas em carrossel | conteúdo de tamanhos diferentes | altura igual e `line-clamp` | `designfy-components` |
| fundo com padrão brigando com o texto | preset forte sem máscara | `fade`, ou preset `text-safe` | `designfy-design-system` |

## Desktop: sintomas e causas

| Sintoma na captura | Causa provável | Correção | Dona |
| --- | --- | --- | --- |
| hero não fecha em 1280 x 800 | título e preenchimento grandes | reduzir o limite do título, apertar altura de linha | `designfy-websites` |
| faixa morta sob o hero | conteúdo no topo de um hero alto | centralizar na altura, aumentar o visual | `designfy-websites` |
| tudo centralizado | reflexo de composição | eixo à esquerda, no máximo dois elementos centrais | `designfy-websites` |
| seção com metade vazia | corpo estreito sem visual | alargar, acrescentar visual, ou fundir | `designfy-websites` |
| linhas de texto atravessando a tela | sem medida | `df-measure` | `designfy-design-system` |
| colunas desalinhadas entre seções | containers diferentes | `df-container` em todas | `designfy-design-system` |
| todas as seções iguais | mesma grade e mesmo fundo | variar fundo, composição, alinhamento | `designfy-websites` |
| três colunas de ícone e texto | reflexo | bento, bloco dividido, ou grade sem ícone em moeda | `designfy-websites` |
| item sozinho na última linha | contagem que não fecha | mudar a contagem ou a grade | `designfy-components` |
| títulos de seção fracos | tamanho de corpo em título | `text-headline` | `designfy-design-system` |
| cartões pesados | borda e sombra juntas, cartão em cartão | uma camada, borda ou sombra | `designfy-design-system` |
| acento por toda parte | `primary` como fundo de seção e de cartão | acento como sinal | `designfy-design-system` |
| tela larga com conteúdo esticado | container sem teto | `--container-max` | `designfy-design-system` |
| dashboard sem hierarquia | blocos de mesmo tamanho | contadores no topo, um gráfico principal | `designfy-webapps` |
| tabela com colunas demais | tudo visível | colunas prioritárias e seletor | `designfy-webapps` |
| formulário de largura total | campos esticados | coluna de 480 a 640 px | `designfy-webapps` |
| página parada | sem movimento | plano de movimento | `designfy-motion` |

## Os dois: sintomas comuns

| Sintoma | Causa provável | Dona |
| --- | --- | --- |
| texto secundário apagado | `muted-foreground` abaixo de 4.5:1 | `designfy-design-system` |
| tema escuro com bordas sumidas | `border` sem valor próprio no escuro | `designfy-design-system` |
| cores diferentes da marca em um componente | cor literal ou classe de paleta fixa | `designfy-components` |
| fonte de sistema onde deveria ter a fonte do tema | fonte não importada | `designfy-design-system` |
| texto de amostra, número ou logo inventado | conteúdo que não veio | `designfy-websites`, e pergunta à pessoa |
| imagem quebrada | caminho errado | `designfy-components` |
| conteúdo invisível na captura parada | revelação que depende de script | `designfy-motion` |
| erro de console | script ou recurso | a dona da região |
| foco invisível num recorte de estado | `outline-none` | `designfy-accessibility` |

## Metas por largura

| Largura | Meta |
| --- | --- |
| 320 | sem estouro; tarefa principal possível |
| 390 | primeira dobra com título, frase e ação; leitura confortável; alvos de 44 px |
| 820 | composição própria de duas colunas |
| 1280 | hero fechado em 800 px de altura |
| 1440 | desenho de referência; ritmo entre seções |
| 1920 | container firme; margens crescem |

## Parar de otimizar

A tela está otimizada quando: o manifesto não tem estouro nem erro, as
metas de cada largura valem, a lista do tipo de tela passa e os achados
de gravidade alta e média estão resolvidos. Ajuste além disso é gosto:
leve à pessoa como proposta, com a captura, em vez de seguir mexendo.
