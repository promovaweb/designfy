# Texto da página

O Designfy não escreve a copy do projeto: ela vem da pessoa, do conteúdo
do repositório ou de uma ferramenta de conteúdo como o
[Inboundfy](https://github.com/promovaweb/inboundfy). Esta referência
cuida do que a interface exige do texto: tamanho, hierarquia, rótulos e o
que fazer quando falta um fato.

## Orçamento

| Peça | Limite |
| --- | --- |
| título do hero | sete palavras |
| frase do hero | vinte palavras |
| título de seção | seis palavras |
| introdução de seção | uma linha |
| título de item | três a cinco palavras |
| descrição de item | duas linhas, perto de quinze palavras |
| lista | quatro itens; cinco em passos |
| parágrafo | duas frases curtas |
| tela de 900 px | perto de 80 palavras |
| rótulo de botão | duas a quatro palavras |

Texto acima do limite não se resolve diminuindo a fonte: corta-se, ou a
seção vira duas.

O teste: leia só o hero e os títulos das seções. Eles precisam contar a
página inteira.

## Títulos

- Dizem o que o visitante vê ou ganha, com os substantivos do negócio:
  "Aula prática toda terça", não "Nossa metodologia".
- Evitam rótulo de categoria sozinho: "Recursos", "Sobre nós", "Por que
  nós".
- Um peso, um estilo e uma cor. Nada de uma palavra em outra cor, em
  itálico ou com fundo para "dar destaque".
- Ênfase se faz com quebra de linha ou com uma segunda linha em tamanho
  menor.
- Tamanho pelo comprimento: até 20 caracteres aguenta o tamanho máximo; de
  21 a 50, o tamanho de display normal; acima de 50, um degrau abaixo ou
  uma quebra no ponto de sentido; acima de 90, reescreva.
- Quebra manual (`<br>`) só entre frases, conferida no celular.

## Rótulos de interface

- No corpo do texto, um degrau menor, em caixa normal e sem espaçamento
  entre letras. Vale para menu, selo, legenda, cabeçalho de tabela e
  etiqueta.
- Caixa alta só em sigla e na marca.
- Fonte mono só para código, comando e número medido.

## Pontuação e sinais que denunciam página gerada

- Travessão usado como pausa em frase: troque por vírgula, dois-pontos,
  ponto ou parênteses.
- Vários itens ligados por ponto mediano ("A · B · C"): use quebra de
  linha, colunas ou linha fina.
- Seta colada no texto do link ("Saiba mais →"): o rótulo é um verbo; se
  há seta, ela é um ícone separado e decorativo.
- Bolinha colorida antes de rótulo como enfeite.
- Três adjetivos em sequência ("rápido, simples, poderoso").
- A cadência "Não é X. É Y." repetida.
- Abertura vazia: "No mundo de hoje", "Feito para times modernos".
- Palavras de enchimento de marketing: revolucionário, robusto, de ponta,
  sem esforço, líder de mercado.
- Emoji no lugar de ícone.

A lista completa de termos e construções que o projeto veta fica no
contrato editorial do próprio projeto; o guia aponta para ele em `## Voz e
conteúdo`.

## Fatos que faltam

Nunca invente para preencher.

| Falta | O que fazer |
| --- | --- |
| um fato pontual (data, preço, endereço) | marcador visível de lacuna no lugar do valor ("Data a definir"), em `muted-foreground` com contorno tracejado; no máximo dois por página; listado no viewspec |
| o conteúdo de uma seção inteira | a seção sai, ou vira título com uma linha do que virá e um marcador |
| um endereço de link | aponta para a seção da página que mais resolve; a URL pendente vai para o viewspec |
| depoimento, número, logo | a seção de prova não entra |
| imagem | foto real pedida no viewspec; enquanto não vem, a seção usa tipografia ou o produto montado |

Toda lacuna aparece em `## Conteúdo` do viewspec como `**lacuna**`, com
quem precisa fornecer, e no relato final.

## Texto de exemplo nos exemplos

Em página de demonstração, dado de amostra precisa ler como amostra:
"Empresa Exemplo", valores redondos, domínio `example.com`. Nunca um
número que o visitante possa tomar por afirmação real.

## Microtexto

| Onde | Como |
| --- | --- |
| botão | verbo da ação |
| campo | rótulo curto; ajuda só quando evita erro |
| erro | o que aconteceu e o que fazer; sem "Ops" e sem ponto de exclamação |
| vazio | o que está vazio e a ação para começar |
| confirmação | o que foi feito e o que acontece agora |
| carregando | o que está carregando, quando passa de 2 s |
| link | diz o destino fora do contexto |

## Formato

Datas, números e moeda no formato do público (no Brasil: `24/11/2026` ou
"24 de novembro", `1.250,00`, `R$ 97,00`). Espaço fixo entre o número e a
unidade. Aspas curvas. Reticências com o caractere próprio.

## Documento

- `lang` no `html`.
- `title` com as palavras da página, não o nome do arquivo.
- Descrição de uma frase.
- Um `h1`; níveis sem salto.
- Texto alternativo em toda imagem com informação.
