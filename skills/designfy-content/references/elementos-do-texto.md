# Elementos dentro do texto

Como cada elemento se comporta dentro do corpo de um artigo. O `prose` do
registro aplica estas regras; confira com
[assets/artigo-de-teste.md](../assets/artigo-de-teste.md).

## Títulos

- `h2` para as seções, `h3` para subseções, `h4` raramente.
- Cada título com `id` e um link de âncora que aparece no hover e no
  foco.
- `scroll-margin-top` igual à altura do cabeçalho fixo mais um respiro.
- Título nunca é a última linha antes de uma quebra visual: ele fica com
  o texto que abre.

## Parágrafos e listas

- Parágrafos de três a cinco linhas na medida. Parágrafo de uma frase
  serve de ênfase, com moderação.
- Lista com marcador para itens paralelos, numerada para sequência.
- Item de lista com mais de três linhas pede subtítulo ou parágrafo.
- Lista dentro de lista: no máximo dois níveis.
- Lista de tarefas com caixa só em conteúdo de passo a passo.

## Links

- Sublinhados no corpo. Cor em `primary`.
- O texto do link diz o destino: "guia de instalação", não "clique aqui".
- Link externo abre na mesma aba por padrão. Quando abre em outra, avisa
  no texto ou com ícone que tem nome acessível.
- Link para arquivo diz o tipo e o tamanho.

## Citação

```html
<blockquote>
  <p>Texto citado.</p>
  <footer>Nome, <cite>Obra</cite></footer>
</blockquote>
```

Linha fina à esquerda em `border`, texto em `foreground`, um degrau maior
ou em itálico. Atribuição em `muted-foreground`.

Citação de destaque (`pull-quote`): uma frase do próprio texto em tamanho
de título, uma ou duas por artigo longo, com `aria-hidden` quando só
repete o que o corpo já diz.

## Aviso

`callout`, quatro tipos, com o tipo escrito: nota, dica, atenção, perigo.

- Ícone, título opcional e texto.
- Fundo tingido do papel do tipo (`bg-info/10`, `bg-warning/10`) e borda
  fina; nunca só a cor.
- Um por tela de texto. Dois avisos seguidos viram um.
- `role="note"`.

## Código

Em linha: `font-mono`, fundo `muted`, sem quebra no meio do comando.

Em bloco (`code-block`):

| Parte | Regra |
| --- | --- |
| cabeçalho | nome do arquivo ou a linguagem |
| corpo | destaque de sintaxe com tema que segue claro e escuro; fonte de 14 a 15 px |
| rolagem | horizontal dentro da caixa; o comando não quebra |
| copiar | botão com nome acessível; confirma por 1.5 s |
| linhas | numeração e realce só quando o texto cita linhas |
| abas | por linguagem ou gerenciador de pacotes, com a escolha lembrada |

- Comando de terminal sem o símbolo `$` dentro do texto copiável.
- Saída de comando separada do comando.
- Bloco muito longo com altura máxima e rolagem, ou recolhido.

## Tabela

- Marcação real: `table`, `thead`, `th` com escopo, `caption` quando
  ajuda.
- Cabeçalho em caixa normal, em negrito, sem quebra de linha.
- Só linhas horizontais; sem borda externa nem cartão em volta.
- Números à direita, com algarismos tabulares; texto à esquerda.
- A tabela rola na horizontal dentro da própria caixa quando não cabe,
  com a primeira coluna fixa em tabela de comparação.
- No celular, tabela de duas ou três colunas cabe; tabela larga rola;
  tabela de atributo e valor vira lista de pares.
- Região rolável com `tabindex="0"`, `role="region"` e nome acessível,
  para o teclado alcançar.

## Linha divisória

`hr` como linha fina em `border`, com espaço generoso. Poucas por artigo:
marca mudança de assunto, não substitui título.

## Notas de rodapé

Número em sobrescrito com link para a nota no fim e link de volta. Em
conteúdo curto, prefira parênteses.

## Teclas e termos

- Tecla: `<kbd>` com borda e fundo `muted`.
- Abreviação: `<abbr title="...">` na primeira ocorrência.
- Termo definido: negrito na primeira vez, com a definição na mesma
  frase.

## Elementos interativos dentro do artigo

Abas, sanfona e demonstração viva entram como componentes (em MDX ou
ilha). Cada um continua legível sem JavaScript: o conteúdo de todas as
abas existe no HTML.

## Matemática e diagramas

Renderize no build quando possível (imagem ou SVG com os papéis do tema),
com texto alternativo que diz o que a figura mostra.
