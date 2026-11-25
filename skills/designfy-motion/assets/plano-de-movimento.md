# Modelo: plano de movimento

Use para escrever a seção `## Movimento` de um viewspec. Uma linha por
movimento, na ordem de encontro pela pessoa. Cada linha responde: o que
se move, com qual gatilho, quanto dura, e para quê.

```markdown
## Movimento

- Entrada do hero: nome, título, frase e ações sobem 16 px com opacidade,
  em sequência de 80 ms, 600 ms no total, na carga. Diz a ordem de leitura.
- Visual do hero: três estados reais do painel trocam a cada 4 s, com
  pausa no hover e no foco. Mostra o produto funcionando.
- Fundo do hero: preset `signal-drift`, com a grade deslocando devagar
  (laço de 24 s).
- Seções: cabeçalho revela ao entrar 20% na tela, uma vez; grades em
  sequência de 60 ms.
- Cartões: elevação de 2 px e borda mais forte no hover e no foco, 250 ms.
- Preços: o valor rola quando o período muda (300 ms).
- Perguntas: painel abre por linhas de grade em 250 ms; seta gira 180 graus.
- Botões: pressão com escala 0.98 em 150 ms.
- Movimento reduzido: tudo aparece no estado final; o visual do hero fica
  no primeiro estado; o fundo fica parado; o valor troca sem rolar.
```

## Perguntas para montar o plano

1. O que a pessoa vê primeiro, e em qual ordem os elementos devem chegar?
2. Qual é o único movimento contínuo desta tela, e o que ele mostra?
3. O que responde ao ponteiro, ao toque e ao teclado?
4. Quais estados mudam nesta tela, e como cada mudança aparece?
5. A página é longa? O que acontece a cada tela de rolagem?
6. Como cada item fica com movimento reduzido?

## Tabela de trabalho

Antes de escrever a seção, preencha:

| Elemento | Função | Gatilho | Propriedades | Duração | Curva | Ferramenta | Parado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| título do hero | chegada | carga | opacidade, translate Y | 500 ms | `ease-out-expo` | `animate-df-fade-up` | visível |
| cartão de recurso | resposta | hover e foco | translate Y, borda | 250 ms | `ease-out-quart` | `df-lift` | só a borda |
| painel de pergunta | mudança | clique | linhas de grade | 250 ms | `ease-out-quart` | `df-collapse` | abre direto |
| indicador de aba | continuidade | troca de aba | layout | 350 ms | mola sem retorno | `layoutId` | troca direta |
| faixa de logos | atenção | contínuo | translate X | 40 s por volta | linear | `df-marquee` | parada |

A coluna "Parado" nunca fica vazia.
