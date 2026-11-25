# Guia do projeto

Como criar e manter o `VIEWSPEC.md` da raiz: a base que todas as telas
seguem. O formato está em [contrato.md](contrato.md).

## De onde vem o conteúdo

O guia é escrito a partir de quatro fontes, nesta ordem de confiança:

1. **O que a pessoa disse** nesta conversa e em conversas anteriores
   registradas no próprio guia. Entra como `@pessoa`.
2. **O código**: o arquivo de tokens, os componentes existentes e as telas
   prontas. O que já é padrão no código entra como `@agente`, descrito como
   está, sem embelezar.
3. **A marca**: manual, paleta e tipografia, quando o projeto tem pasta
   `brand/` ou material do Brandfy.
4. **Os padrões do Designfy**: o que as especialistas recomendam quando as
   três fontes acima não dizem nada. Entra como `@agente`.

Projeto com documentos de design próprios (manual, `DESIGN.md`, regras no
`AGENTS.md` ou no `CLAUDE.md`, inclusive os da raiz de um monorepo) tem uma
quinta fonte, acima do código: esses documentos. Nesse caso o guia resume
cada regra em uma linha, cita o arquivo e a seção de origem num parágrafo de
contexto e declara, em `## Visão geral`, que a fonte prevalece quando os dois
divergirem. Regra que o documento atribui a uma pessoa entra como `@pessoa`,
com a data em `## Aprendizados`. Débitos que o documento registra vão para
`## Faça e não faça`, e a escala de cor que o projeto usa é descrita como
está, mesmo fora dos papéis do shadcn.

Antes de escrever, leia:

```bash
designfy theme show --json        # cores, fontes, raios, espaçamento, movimento
designfy theme check --json       # contraste medido dos pares
designfy status --json            # framework, superfícies, componentes copiados
designfy components list --json   # o que o registro oferece
```

Leia também duas ou três telas prontas do projeto, quando existirem, para
descrever o padrão real de cabeçalho, tabela, formulário e estado vazio.

## Entrevista

No máximo três perguntas, numa mensagem, com a recomendada primeiro. Só o
que o código não responde:

1. **Personalidade.** "Em três palavras, como a interface precisa parecer?"
   Ofereça três trios coerentes com a marca (por exemplo: "precisa, calma,
   técnica"; "próxima, clara, direta"; "ousada, rápida, colorida").
2. **Densidade.** "A tela é para ler com calma ou para operar o dia
   inteiro?" Arejada (sites, conteúdo), média (sistemas de uso ocasional) ou
   compacta (operação diária com muitas linhas).
3. **Movimento.** "Quanto movimento?" Presente e calmo (padrão do
   Designfy), expressivo (página de venda, marca jovem) ou mínimo (só
   resposta a ações). Movimento zero só quando a pessoa pedir.

Se a pessoa já respondeu no pedido, não repita a pergunta.

## Como escrever cada seção

| Seção | Escreva | Evite |
| --- | --- | --- |
| Visão geral | quem usa, em qual situação, as três palavras e a densidade | adjetivos sem consequência ("moderno", "clean") |
| Cores | papel de cada cor do tema, cor base e harmonia, pares de texto e fundo com o contraste medido, onde o acento pode aparecer | valores hex soltos (ficam no arquivo de tokens) |
| Tipografia | família de título e de texto pelo papel (`font-heading`, `font-sans`), escala usada, medida da linha, números tabulares | nome de fonte sem o papel |
| Layout | largura do container, grade, escala de espaçamento, distância entre seções | pixel solto fora da escala |
| Fundos e profundidade | fundo de cada tipo de seção, padrões de fundo permitidos (pelos slugs do `designfy-backgrounds`), sombra e borda | "usar gradientes" |
| Formas | raio por nível, traço dos ícones, biblioteca de ícones, tratamento de imagem | misturar duas bibliotecas de ícones |
| Movimento | caráter, durações e curvas pelos tokens, o que se move em cada tipo de tela, a versão parada | "animações suaves" |
| Voz e conteúdo | pessoa e tom dos textos de interface, verbo dos botões, formato de data, número e moeda, texto de erro e de vazio | regra de copy de marketing (fica no projeto de conteúdo) |
| Componentes | componente adotado para cada função, a fonte (Designfy, shadcn, ReUI, próprio) e as variações permitidas | lista de tudo o que existe na biblioteca |
| Padrões de tela | como este projeto resolve hero, seção, artigo, tabela, formulário, dashboard, CRUD, configurações, vazio e erro | repetir o que as especialistas já ensinam sem adaptar ao projeto |
| Responsivo | pontos de quebra, o que muda em cada faixa, alvo de toque, navegação no celular | "mobile first" sem dizer o que muda |
| Acessibilidade | nível adotado, foco, teclado, leitor de tela e as conferências obrigatórias antes de fechar uma tela | copiar a WCAG |
| Faça e não faça | pares concretos tirados do projeto | proibições genéricas |
| Aprendizados | data, origem, o que foi aprendido, destino | apagar entradas |

## Regra bem escrita

Uma regra responde a três perguntas em uma linha: o que fazer, por quê e
quem disse.

| Fraca | Forte |
| --- | --- |
| Usar boa hierarquia. | Um só `h1` por tela, com o nome da página; seções em `h2`. `@agente` {#y004} |
| Tabelas responsivas. | Tabela com mais de quatro colunas vira cartões abaixo de 640 px, com número, estado e ação. `@revisão` {#r001} |
| Animações suaves. | Entrada de seção: opacidade e 16 px de subida em 500 ms, uma vez. `@agente` {#m002} |
| Botões consistentes. | A ação principal usa `primary`; só uma por tela. Excluir fica no menu da linha. `@pessoa` {#k004} |

Sinais de regra ruim: não cabe numa conferência de captura, vale para
qualquer projeto do mundo, tem dois verbos de assuntos diferentes.

## Identificadores

Uma letra da seção e três dígitos, em sequência dentro da seção:

| Letra | Seção | Letra | Seção |
| --- | --- | --- | --- |
| `v` | Visão geral | `w` | Voz e conteúdo |
| `c` | Cores | `k` | Componentes |
| `y` | Tipografia | `t` | Padrões de tela |
| `l` | Layout | `r` | Responsivo |
| `f` | Fundos e profundidade | `a` | Acessibilidade |
| `s` | Formas | `d` | Faça e não faça |
| `m` | Movimento | | |

O identificador de uma regra retirada não é reaproveitado.

## Regras que todo guia do Designfy começa tendo

Ao criar o guia, inclua estas regras como `@agente`, ajustando os números
ao tema lido. A pessoa pode mudar qualquer uma.

- Cores, fontes, raios e espaçamento saem do tema do Tailwind; nenhum
  componente leva cor ou fonte literal. (Cores)
- Pares de texto e fundo com contraste de 4.5:1 ou mais, conferidos com
  `designfy theme check`. (Cores)
- Um `h1` por tela. (Tipografia)
- Container com largura máxima e centralizado; as margens crescem, a grade
  não. (Layout)
- Toda tela tem movimento com função, e todo movimento tem versão parada em
  `prefers-reduced-motion`. (Movimento)
- Só `transform` e `opacity` em animação; nunca `transition: all`.
  (Movimento)
- Uma ação principal por tela. (Componentes)
- Toda região que carrega dados tem carregando, vazio e erro. (Padrões de
  tela)
- Nenhuma tela rola na horizontal entre 320 e 1920 px. (Responsivo)
- Alvo de toque de 44 por 44 px no celular. (Responsivo)
- Todo elemento interativo tem foco visível, sem atraso. (Acessibilidade)
- Nada de número, depoimento ou logo inventado. (Faça e não faça)

## Manter o guia

Atualize o guia no fechamento de cada tela e sempre que a pessoa disser uma
preferência.

1. Escreva a entrada em `## Aprendizados` com a data de hoje.
2. Se virou regra, crie ou altere a regra na seção do assunto e ponha o
   `{#id}` como destino da entrada.
3. Se é escolha do agente que afeta outras telas, deixe `proposta` e leve a
   pergunta à pessoa no relato.
4. Atualize `updatedAt`.
5. `designfy viewspec validate`.

Quando uma regra muda, liste as telas que a aplicam
(`guideRules` nos viewspecs) e diga à pessoa quais precisam de ajuste. Não
altere telas prontas sem pedido.

## Guia de site e guia de sistema

Um projeto com as duas superfícies (site público e área logada) usa um
guia só, com `surfaces: [site, system]`. As seções Cores, Tipografia e
Formas valem para as duas. Em Layout, Movimento, Padrões de tela e
Responsivo, separe com um parágrafo de contexto por superfície: site é
arejado e expressivo, sistema é compacto e contido.

Exemplos completos: [guia-de-sistema.md](../assets/examples/guia-de-sistema.md)
e [guia-de-site.md](../assets/examples/guia-de-site.md).
