# Conversão: ações, formulários, prova e preço

Uma página converte quando a pessoa entende o que ganha, acredita e
encontra o próximo passo sem procurar.

## A ação principal

- Uma por página. O rótulo é o verbo da ação com o objeto: "Ver turmas
  abertas", "Criar conta grátis", "Instalar o CLI", "Falar com a equipe".
- O mesmo rótulo e o mesmo destino no hero, no meio da página e na chamada
  final.
- Botão preenchido em `primary`, com 44 a 52 px de altura. Só um botão
  preenchido por tela visível.
- A ação secundária é contorno ou link de texto, nunca mais forte que a
  principal.
- No cabeçalho, a ação é mais discreta que a do hero e continua visível no
  celular.
- Rótulos a evitar por serem genéricos: "Saiba mais", "Começar", "Clique
  aqui", "Enviar". Diga o que acontece.
- O botão não quebra linha em nenhuma largura.

## Para onde a ação leva

| Ação | Destino | Cuidado |
| --- | --- | --- |
| comprar ou assinar | checkout ou preços | o preço já apareceu antes do clique |
| criar conta | cadastro curto | diga se pede cartão |
| instalar | bloco de comando com copiar | comando real e testado |
| agendar ou falar | formulário curto ou canal direto | diga o prazo de resposta |
| baixar material | formulário de um campo | diga o que chega e por onde |
| ver turmas, planos, vagas | âncora na própria página | a seção existe e tem conteúdo |

Link para uma rota que não existe não entra. Sem destino, a ação aponta
para a seção da página que mais resolve e a lacuna vai para o viewspec.

## Formulários em página pública

- O menor número de campos que a operação aguenta. Cada campo a mais
  derruba respostas.
- Um campo e um botão para e-mail (`newsletter-form`); nome, contato e
  mensagem para falar com a equipe.
- Rótulo visível em todo campo. Texto de exemplo dentro do campo não é
  rótulo.
- `type`, `autocomplete` e `inputmode` certos: o teclado do celular
  acompanha.
- Erro abaixo do campo, ligado a ele, dizendo o que corrigir.
- O botão diz o que acontece: "Receber o guia", "Pedir orçamento".
- Depois do envio: confirmação na própria página, com o que acontece agora
  e em quanto tempo.
- Linha de consentimento curta, com link para a política.
- Formulário sem destino configurado não finge sucesso: valida e diz que
  ainda não está ligado. A lacuna vai para o viewspec.

O desenho de formulários longos é da `designfy-webapps`.

## Prova

A prova responde a "posso confiar?". Vale o que é verdadeiro e
verificável.

| Tipo | Forma | Regra |
| --- | --- | --- |
| logos | faixa em uma cor só | logos reais e autorizados; nome da empresa no texto alternativo |
| números | faixa com valor, unidade e rótulo | número verificado, com fonte ou data quando cabe |
| depoimento | citação com nome, função e foto | texto real, pessoa real; sem foto, sem avatar genérico |
| caso | história curta com resultado | número do caso, com a empresa citada |
| garantia | frase direta | só a que o negócio cumpre |
| quem faz | pessoas e história | nomes e fotos reais |

Proibido: número inventado, depoimento inventado, "confiado por milhares",
estrelas de avaliação sem fonte, selo de segurança decorativo, contador de
vagas falso, relógio de urgência falso.

Onde a prova entra: uma linha logo abaixo do hero (logos ou um número) e a
prova mais forte perto do preço ou da chamada final.

## Preço

- O preço aparece na página que vende. Valor, período, parcelamento e o
  que inclui, na mesma tela.
- Dois a quatro planos. Com mais, agrupe.
- O plano recomendado é marcado por uma palavra ("Mais escolhido" só se
  for verdade) e pelo botão preenchido. Os outros usam botão de contorno.
- Lista do que inclui: o que muda entre planos primeiro, com texto além do
  símbolo.
- Alternador mensal e anual com a economia dita em valor.
- Perguntas sobre cobrança logo abaixo: cancelamento, reembolso, nota
  fiscal, formas de pagamento.
- Sob consulta: diga o que define o valor e o que acontece depois do
  contato.

## Urgência e escassez

Só as verdadeiras: data real de fechamento da turma, vagas reais
restantes, preço que muda numa data. Com a fonte do dado no projeto.
Urgência inventada destrói a confiança que a página construiu.

## Objeções

Liste o que impede a ação e responda perto de onde a dúvida aparece:

- "é para mim?": seção para quem é, logo depois dos benefícios;
- "é difícil?": passos de como funciona;
- "e se não gostar?": garantia ao lado do preço;
- "posso pagar?": parcelamento na linha do preço;
- dúvidas de detalhe: perguntas frequentes antes da chamada final.

## Medir

A página pronta precisa permitir a medição: a ação principal tem um
identificador estável (`data-cta="hero"`, `data-cta="final"`), o
formulário dispara o evento do projeto ao ser enviado, e as seções têm
`id`. A ferramenta de medição é do projeto.

## Conferir

- [ ] Uma ação principal, com o mesmo rótulo em três pontos da página.
- [ ] Um botão preenchido por tela visível.
- [ ] O rótulo diz o que acontece.
- [ ] Todo destino existe.
- [ ] Toda prova é real e tem origem.
- [ ] O preço e as condições aparecem antes do clique.
- [ ] Formulário com rótulos, erros ligados aos campos e confirmação clara.
- [ ] Nenhuma urgência inventada.
