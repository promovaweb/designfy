# Arquitetura da página

A página é uma conversa com quem chegou. Cada seção responde à pergunta
que a seção anterior deixou. A ordem sai dessas perguntas, não de um molde.

## As perguntas do visitante

| Pergunta | Seção que responde |
| --- | --- |
| O que é isto e é para mim? | hero |
| Posso confiar? | prova: logos, números, depoimento |
| O que eu ganho? | recursos, benefícios, demonstração |
| Como funciona? | passos, visual do produto, vídeo |
| Serve para o meu caso? | para quem é, casos de uso |
| Quanto custa? | preços, comparação |
| E se...? | perguntas frequentes, garantias |
| O que eu faço agora? | chamada final |

Nem toda página responde a todas. Corte a pergunta que o visitante desta
página não faz e a que o projeto não consegue responder com conteúdo real.

## Por tipo de página

### Landing page (venda ou captura)

Sem menu de navegação que tire a pessoa da página; só a marca e a ação.

1. Hero com a promessa e a ação.
2. Prova rápida (uma linha de logos ou um número), se houver.
3. O que a pessoa ganha: dois a quatro blocos, o mais forte primeiro.
4. Como funciona, com o produto à mostra.
5. Para quem é.
6. Prova aprofundada: depoimentos, caso real.
7. Preço ou oferta, com as condições.
8. Perguntas que impedem a ação.
9. Chamada final com a mesma ação.

Página de captura (lista de espera, material): hero com o formulário, o
que a pessoa recebe, quem está por trás, e de novo o formulário.

### Home de site ou portal

A home apresenta e encaminha. Cada bloco termina num destino.

1. Hero com o que o site ou produto é e a ação principal.
2. As áreas ou os produtos, em bento ou grade com pesos diferentes.
3. Um bloco de aprofundamento por área principal.
4. Conteúdo recente (artigos, lançamentos), quando existe.
5. Prova.
6. Chamada final.

### Página de produto ou serviço

1. Hero com o produto à mostra.
2. O problema que ele resolve, em uma frase forte.
3. Recursos em blocos divididos, cada um com captura real.
4. Especificações ou comparação em tabela.
5. Integrações ou requisitos.
6. Preço ou link para preços.
7. Perguntas.
8. Chamada final.

### Preços

1. Título direto e o alternador de período.
2. Os planos, com o recomendado marcado por uma palavra e pelo botão.
3. Tabela de comparação completa.
4. Perguntas sobre cobrança.
5. Contato para o caso que não cabe nos planos.

### Sobre

1. A frase do que a empresa faz e para quem.
2. A história em poucos parágrafos, com fotos reais.
3. As pessoas, com nome e função reais.
4. Números verificados.
5. Como falar com a empresa.

### Contato

1. O que acontece depois do envio e em quanto tempo.
2. O formulário curto.
3. Os outros canais, com horário.
4. Endereço e mapa, quando há local físico.

## Uma ideia por tela

- Cerca de 80 palavras por tela de 900 px, contando rótulos.
- Título de seção com seis palavras ou menos.
- Introdução de seção com uma linha.
- Lista com quatro itens; mais que isso vira tabela ou é cortada.
- Leia só os títulos e o hero: se contam a história, o resto está no
  tamanho certo.

## Massa e ritmo

Cada seção precisa de um destes: um visual com 300 px ou mais de altura,
um conjunto de três itens lado a lado, uma lista ou tabela de três linhas,
uma frase no tamanho de título.

Entre seções vizinhas, mude pelo menos uma coisa:

| Eixo | Opções |
| --- | --- |
| fundo | superfície, faixa `muted`, faixa com padrão, faixa `primary` |
| composição | dividida, grade, bento, lista, tabela, frase |
| alinhamento | à esquerda, à direita, centralizado |
| largura | container, estreita de leitura, sangrando até a borda |
| separação | só espaço, linha fina, troca de fundo |

Espaço entre seções: 96 px no desktop, 56 a 64 px no celular
(`df-section`), com variação quando o fundo muda.

## O molde a evitar

Hero, três colunas de ícone com título, uma chamada e o rodapé: é a página
que todo gerador entrega. Sinais de que a página caiu nele:

- a sequência serviria para qualquer empresa, trocando o nome;
- todas as seções têm a mesma estrutura de título centralizado e grade;
- não há nenhuma captura, foto ou dado que só este projeto tem.

A correção é o conteúdo: mostre o produto, use os substantivos do negócio
e deixe a ordem seguir as perguntas do visitante.

## Registrar

A ordem final, com a pergunta de cada seção, vai para `## Estrutura` do
viewspec. Roteiros prontos em [assets/estruturas.md](../assets/estruturas.md).
