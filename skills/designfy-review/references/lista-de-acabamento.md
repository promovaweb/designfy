# Lista de acabamento

Os detalhes de ofício que separam a tela pronta da tela bem acabada. Cada
item é respondido: corrigido, ou mantido com o motivo. A lista absorve as
conferências de acabamento do
[Hallmark](https://github.com/nutlope/hallmark) (licença MIT), adaptadas
ao Designfy.

## Tipografia

- [ ] Aspas curvas e reticências com o caractere próprio na prosa.
- [ ] Nenhum título termina com uma palavra sozinha; nenhum parágrafo deixa uma palavra na última linha em 390 e em 1280 px.
- [ ] Números que se comparam usam algarismos tabulares.
- [ ] No máximo três pesos de fonte em uso.
- [ ] Nenhum nível de título pulado.
- [ ] Espaço fixo entre número e unidade.
- [ ] Nenhum rótulo em caixa alta com letras espaçadas.
- [ ] Texto justificado não existe.

## Cor e superfície

- [ ] Um só botão preenchido por tela visível.
- [ ] Borda ou sombra em cada cartão, nunca as duas.
- [ ] A mesma receita de contêiner não se repete em seis lugares diferentes.
- [ ] Raio coerente por nível; raio interno menor que o externo.
- [ ] Sombra na cor do tema, discreta.
- [ ] Seleção de texto, cursor de texto e barra de rolagem seguem o tema.
- [ ] Nenhum ícone em moeda colorida por reflexo.
- [ ] Ícones de uma biblioteca só, no mesmo traço.

## Layout

- [ ] Bordas esquerdas do conteúdo alinhadas de uma seção à outra.
- [ ] Linha de elementos de alturas diferentes centralizada na vertical.
- [ ] Nenhuma grade deixa um item sozinho na última linha.
- [ ] Nenhum bloco de texto espremido numa faixa estreita.
- [ ] Mais grupos de título alinhados à esquerda que centralizados.
- [ ] Largura do container, espaço entre colunas e raio iguais em todas as seções.
- [ ] Espaço dentro de um grupo menor que o espaço entre grupos.
- [ ] Logos em linha com a quantidade dividida por igual.

## Componentes

- [ ] Campo e botão vizinhos com a mesma altura.
- [ ] Largura da borda do campo igual em todos os estados.
- [ ] Texto de ajuda com espaço reservado, para o erro não deslocar o formulário.
- [ ] Botões alinhados na base dos cartões de plano.
- [ ] Cabeçalhos de tabela em uma linha.
- [ ] Sublinhado de link com espessura e distância discretas.
- [ ] Estados de hover, foco, ativo e desativado em todo controle.

## Conteúdo

- [ ] Nenhum fato repetido em quatro seções.
- [ ] Nenhuma última linha de seção repetindo o título.
- [ ] Datas, números e moeda no formato do público.
- [ ] Mesma palavra para a mesma coisa na tela inteira.
- [ ] Nenhum texto de amostra esquecido.

## Mídia

- [ ] Toda imagem com dimensões e arquivo que existe.
- [ ] Nenhum avatar de banco de imagens no lugar de pessoa real.
- [ ] Capturas do produto num estado que diz algo.
- [ ] Nenhuma moldura de aparelho desenhada à mão.

## Movimento

- [ ] Um padrão de movimento ligado à rolagem por página, não vários.
- [ ] Nenhum laço além do previsto no viewspec.
- [ ] Durações e curvas pelos tokens.
- [ ] Animação em CSS onde o CSS resolve.

## Documento

- [ ] `lang`, `title` e descrição.
- [ ] Ícone do site e imagem de compartilhamento.
- [ ] Nenhum erro no console.

## Celular

- [ ] Nada do desktop some no celular, além de enfeite.
- [ ] Tabela não abre com colunas fora da tela.
- [ ] Texto adjacente ao corpo (meta, links de menu) com tamanho de toque.

## Como responder

No relatório, cada item reprovado vira uma linha:

```markdown
| Item | Onde | Resposta |
| --- | --- | --- |
| palavra sozinha no título | hero, 390 px | corrigido: quebra manual no ponto de sentido |
| dois botões preenchidos | cabeçalho e hero, 1440 px | mantido: o do cabeçalho virou contorno |
| item sozinho na grade | recursos, 820 px | corrigido: grade de duas colunas com seis itens |
```

Acabamento não impede o fechamento da tela, mas item sem resposta impede:
todo achado é corrigido ou justificado.
