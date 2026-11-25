# Modelo: pedido de esclarecimento

Use uma única mensagem, com até três perguntas. Cada pergunta traz a opção
recomendada primeiro e aceita resposta livre. Corte as perguntas que o
projeto, o guia ou o pedido já respondem.

```text
Li o projeto ({framework}, tema {nome do tema}) e o guia. Antes de montar
o viewspec de {tela}, preciso de {n} respostas:

1. {pergunta sobre a ação principal}
   a) {opção recomendada} (recomendada: {motivo em uma frase})
   b) {outra opção}
   c) {outra opção}

2. {pergunta sobre conteúdo ou dados}
   a) {opção recomendada}
   b) {outra opção}

3. {pergunta sobre volume, público ou prova}
   a) {opção recomendada}
   b) {outra opção}

Pode responder com as letras ou do seu jeito. Sem resposta para alguma,
sigo com a recomendada e registro isso no viewspec.
```

## Perguntas que funcionam

- "Qual é a única coisa que a pessoa precisa conseguir nesta tela?"
- "De onde vêm os dados de {região}: {arquivo}, {endpoint} ou você me
  passa?"
- "Você tem {depoimentos, números, logos} reais? Sem isso a seção não
  entra."
- "Essa lista tem dezenas, milhares ou mais registros?"
- "Vale só para esta tela ou vira regra do projeto?"

## Perguntas que não se faz

- Qual framework, qual cor, qual fonte: está no projeto e no guia.
- "Quer que fique bonito?", "Quer responsivo?", "Quer acessível?": é o
  padrão.
- "Quer animação?": movimento é o padrão; a pergunta só existe quando o
  guia do projeto pede tela parada.
