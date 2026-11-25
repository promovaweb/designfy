# Estudo: landing de oferta com prazo e turma limitada (Founders)

## Ficha

| Campo | Valor |
| --- | --- |
| Página | `/founders/` do site da Promovaweb, segunda turma do plano Founders |
| Tipo | landing de oferta: programa anual com turma, prazo de inscrição e vagas limitadas |
| Público | quem quer desenvolver e lançar um projeto próprio com acompanhamento |
| Ação principal | "Quero minha vaga", sempre com o mesmo rótulo, levando ao comercial |
| Ação secundária | "Ver o investimento", âncora para a seção de preço |
| Leitura | 24/11/2026, código-fonte completo e capturas em 390 e 1440 px, nos temas claro e escuro |
| Stack | Astro com Tailwind 3, componentes com escopo e BEM, camada global de revelação |

## Argumento

A página responde, na ordem, às perguntas de quem considera entrar. A
ação principal aparece no hero, em três faixas curtas espalhadas pelo
meio, no preço, na seção de vagas e no fechamento: oito vezes, sempre com
o mesmo rótulo.

| Ordem | Seção | Pergunta do visitante | Peça no Designfy |
| --- | --- | --- | --- |
| 1 | Hero sobre palco de pixels, com cartão de prazo ao lado | O que consigo fazer, quando começa e até quando posso entrar? | `hero-pixel` + `pixel-stage` + `offer-card` |
| 2 | Vídeo de apresentação | Posso entender a proposta em poucos minutos? | `video-embed` |
| 3 | Por que em turma (título fixo à esquerda, seis vantagens numeradas) | Por que construir junto com outras pessoas ajuda? | `feature-rows` (variante `split`) |
| 4 | Faixa rolante de resultados | O que pode sair de um ciclo? | `marquee` |
| 5 | Destaques em faixa escura (frase grande, dois números, trilho de datas) | Quais são os compromissos e as próximas datas? | `statement-stats` + `milestone-timeline` |
| 6 | Pontos de partida (seis linhas numeradas) | Posso entrar no estágio atual do meu projeto? | `feature-rows` |
| 7 | Três etapas e a continuidade | O que acontece em cada fase e depois de publicar? | `milestone-timeline` |
| 8 | Faixa de chamada | Já entendi, como avanço? | `cta-band` (variante curta, duas ações) |
| 9 | Rotina (cartões com ícone e lista) | Como isso cabe na minha semana? | `detail-card` |
| 10 | Apoio individual (dois cartões, um com selo de bônus) | Onde recebo orientação e qual é o limite dela? | `detail-card` |
| 11 | Faixa de chamada | Como avanço agora? | `cta-band` |
| 12 | Programa (oito linhas numeradas) | Que assuntos posso trabalhar? | `feature-rows` |
| 13 | O que está incluído (16 itens numerados, os dois últimos em destaque) e o que pode mudar (10 resultados) | O que recebo e o que pode mudar no meu projeto? | `numbered-checklist` + `outcome-grid` |
| 14 | Faixa de chamada | Onde vejo o investimento? | `cta-band` |
| 15 | Para quem é e para quem não é | O formato serve para mim? | `audience-fit` |
| 16 | Quem conduz (retrato, adesivos, bio, redes) | Quem me orienta e que experiência traz? | `profile-split` |
| 17 | Depoimentos em carrossel | Como outras pessoas aplicaram? | `testimonial` (carrossel responsivo) |
| 18 | Turma limitada (texto e cartão com o número de vagas) | Por que existe limite? | `offer-card` (destaque de capacidade) |
| 19 | Investimento (plano único) | Quanto custa, como pago, o que entra? | `pricing-table` (variante `single`) |
| 20 | Perguntas frequentes com título fixo | Que dúvidas faltam? | `faq` (variante `split` com `stickyIntro`) |
| 21 | Fechamento em faixa escura | Qual é o próximo passo e o prazo? | `cta-band` |

## Seções

### 1. Hero com prazo na primeira dobra

- **Anatomia.** Coluna de texto (rótulo curto dentro do H1, título em três
  linhas com o trecho final em acento, apoio de duas linhas, ação principal
  e link secundário com seta) e, ao lado, um cartão translúcido com o prazo
  por extenso, a condição de pagamento, a contagem regressiva em quatro
  células (dias, horas, minutos, segundos) e a mesma ação principal em
  largura total.
- **Palco.** Mosaico de pixels em canvas, mais denso à direita, com véu
  escuro atrás do texto. Fica escuro nos dois temas. O ponteiro acende os
  quadrados próximos.
- **Contagem.** Sem JavaScript, o cartão mostra a data por extenso. Depois
  do prazo, o texto troca para "inscrições encerradas" e o relógio some. Os
  dígitos usam números tabulares e `aria-live="off"`, para o leitor de tela
  não anunciar a cada segundo.
- **Celular.** O cartão de prazo desce para depois das ações: a contagem só
  aparece com rolagem. Numa oferta com prazo curto, considere uma linha de
  prazo logo abaixo das ações no celular.
- **Movimento.** O mosaico anda a no máximo 25 quadros por segundo, para de
  pintar fora da tela, tem botão de pausa que só aparece com foco de teclado
  e fica parado com `prefers-reduced-motion`.

### 3. Vantagens com título fixo

Duas colunas: à esquerda, título, apoio, ação e o prazo em letra pequena,
fixos durante a rolagem (`position: sticky` abaixo do cabeçalho); à
direita, seis vantagens numeradas com número grande e claro, ícone, título
e texto, separadas por fios. O fixo exige que nenhum ancestral tenha
`overflow: hidden`. No celular, tudo empilha.

### 4. Faixa de resultados

Faixa na cor de acento com frases curtas separadas por losangos, andando na
horizontal em 40 s. A segunda cópia da lista tem `aria-hidden`. Com
movimento reduzido, a faixa para e quebra em linhas. Falta na origem a
pausa explícita e a suspensão fora da tela; o item `marquee` do registro
tem as duas.

### 5. Destaques em faixa escura

Frase de duas linhas em tipo grande (a segunda em acento) ao lado de duas
notas tipográficas (um número curto e a explicação, separados por fio). Na
base, o trilho de datas: quatro paradas numa linha que se desenha quando a
seção entra na tela, com o ponto atual pulsando. É a peça que mais
comunica compromisso com pouco texto.

### 6, 12. Linhas numeradas

Lista ordenada dentro de um cartão com borda: número em mono na cor de
acento, título em negrito, descrição à direita, linhas separadas. Serve
para informação comparável (pontos de partida, áreas do programa). O hover
da origem fazia uma linha informativa parecer clicável; no registro, o
destaque fica só nos links reais.

### 7. Etapas com continuidade

Três etapas numeradas em círculos ligados por um fio e um quarto passo de
continuidade com círculo tracejado e sinal de mais. Cada etapa tem rótulo,
título, texto e uma linha de foco. As colunas usam `subgrid` para alinhar
rótulo, título, texto e foco entre as etapas, mesmo com textos de tamanhos
diferentes. Fecha com uma barra escura com o que vale para o plano inteiro.

### 8, 11, 14. Faixas de chamada

Faixa clara tingida com uma frase que resume o trecho lido e duas ações
(principal e âncora para o preço). Repetida três vezes, cada uma com a
frase do momento. Mantém a ação à vista sem repetir um bloco inteiro.

### 9, 10. Cartões de rotina e de apoio

Cartões com chip de ícone, título, texto e lista com marcadores de
confirmação, em duas colunas, um deles alto. Variantes tingida (acento) e
neutra. O cartão de bônus leva um rótulo pequeno acima do título e uma
nota de limite no pé ("não inclui..."), o que deixa claro o que a oferta
não faz.

### 13. Incluído e resultados

Lista numerada em duas colunas com chips de número; os dois últimos itens,
bônus, ganham chip cheio e borda de acento. Abaixo, uma grade de dez
resultados em ladrilhos tingidos com ícone de tendência, em até cinco
colunas, e um parágrafo que modera a promessa ("nem sempre avançar
significa desenvolver mais").

### 15. Para quem é

Dois cartões lado a lado: "faz sentido para" com marcas de confirmação e
"provavelmente não é para quem" com marcas de x, e uma nota de escopo. Os
volumes diferentes deixam o segundo cartão vazio no desktop; no registro,
os cartões ficam com altura igual e o conteúdo começa no topo.

### 16. Quem conduz

Retrato com dois adesivos inclinados (−4° e 3°) tirados da bio, legenda
com nome e papéis em mono e, ao lado, título, bio, ação e redes com nome
acessível. Na origem os adesivos saíam da foto; no registro ficam perto da
borda inferior.

### 17. Depoimentos

Carrossel com um, dois ou três cartões por largura, rolagem com
`scroll-snap`, cartões com citação, estrelas, nome e papel. Na origem, as
setas só apareciam com hover e os pontos não respondiam a clique; o item
`testimonial` traz controles visíveis e rotulados.

### 18, 19. Vagas e preço

A turma limitada é um cartão tingido com o número em tipo grande, a frase
de prazo e a ação. O preço é um cartão de plano único: rótulo, moeda e
valor grande com o período, parcelamento, ação, letra miúda, fio vertical
e, do outro lado, a lista do que entra. O valor exibido precisa sair da
mesma fonte do dado estruturado da oferta.

### 20. Perguntas frequentes

Título e apoio fixos à esquerda, perguntas à direita em `details` e
`summary`, com o sinal de mais girando 45° ao abrir. As mesmas perguntas
alimentam o `FAQPage`.

### 21. Fechamento

Faixa escura, como o hero, com título e apoio à esquerda e as duas ações à
direita. Repete a data de início e o prazo.

## Ritmo e sistema

- Abertura e fechamento escuros; entre eles, superfícies clara, neutra e
  tingida alternadas, sem duas seções seguidas com o mesmo fundo, e uma
  faixa escura no meio (destaques) que quebra a sequência.
- Uma cor de acento, a do plano, em títulos de duas cores, números,
  marcadores e ações. Nenhuma outra cor de destaque na página.
- Rótulo pequeno em mono e caixa alta acima de cada H2, H2 com o trecho em
  acento, apoio de até três linhas em medida curta.
- Datas absolutas ("27 de novembro") repetidas no hero, nas faixas, nas
  vagas e no fechamento: o prazo nunca sai da memória de quem lê.

## Movimento da página inteira

| Tela de rolagem | O que se move | Versão parada |
| --- | --- | --- |
| Hero | mosaico de pixels, ponteiro acendendo quadrados, dígitos da contagem | mosaico parado, dígitos trocam sem animação |
| Vantagens | entrada em cascata, fio de cada linha se desenha, número avança no hover | conteúdo visível, sem deslocamento |
| Faixa | rolagem horizontal contínua | faixa parada, frases quebradas em linhas |
| Destaques | trilho se desenha, pontos entram em sequência, ponto atual pulsa | trilho completo, sem pulso |
| Etapas | fios entre os círculos se desenham em sequência | fios completos |
| Demais seções | revelação curta ao entrar na tela (800 ms, 90 ms entre irmãos) | conteúdo visível |
| Depoimentos | rolagem por cartão | rolagem instantânea |
| FAQ | sinal de mais gira ao abrir | troca sem rotação |

## O que copiar

- O prazo na primeira dobra, ao lado do título, com a ação principal
  repetida dentro do cartão.
- A mesma ação, com o mesmo rótulo, em faixas curtas a cada dois ou três
  blocos de argumento.
- A ordem: promessa e prazo, apresentação, por que funciona, o que sai,
  datas, ponto de partida, etapas, rotina, apoio, programa, o que entra,
  para quem é, quem conduz, prova, limite, preço, dúvidas, fechamento.
- Limites ditos com clareza ("não inclui", "provavelmente não é para
  quem"): reduzem a dúvida antes do preço.
- Listas numeradas para informação comparável e `subgrid` para alinhar
  colunas de textos desiguais.
- Faixas e destaques que mostram compromisso com números verdadeiros e
  poucos textos.

## O que não copiar

- Estado de hover em linha que não é link.
- Setas de carrossel que só aparecem com o ponteiro e pontos que não
  respondem a clique.
- Cartão de prazo que cai abaixo da dobra no celular sem nenhuma linha de
  prazo acima.
- Faixa rolante sem pausa explícita e sem suspensão fora da tela.
- Revelação aplicada por seletor de classe visual (`rounded-3xl`): marque
  os alvos com atributo próprio, como `data-df-reveal`.
- Os textos, números, datas e nomes da oferta.

## Peças no registro

Itens criados ou ampliados a partir deste estudo, em Astro e React:
`pixel-stage`, `hero-pixel`, `feature-rows`, `milestone-timeline`,
`profile-split`, `offer-card`, `audience-fit`, `numbered-checklist`,
`outcome-grid`, `detail-card`, `statement-stats`, e as variantes novas de
`faq`, `cta-band`, `testimonial`, `pricing-table` e `marquee`. Veja cada um
com `designfy components show <item>`.
