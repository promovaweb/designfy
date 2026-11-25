# Markdown e MDX: do arquivo à página

## De onde vem o texto

| Fonte | Como chega à página |
| --- | --- |
| Markdown em coleção de conteúdo (Astro) | `render(entry)` devolve `Content` e `headings` |
| MDX | o mesmo, com componentes dentro do texto |
| CMS que entrega HTML | o HTML entra no `prose` depois de limpo |
| CMS que entrega Markdown | `react-markdown` ou o processador do projeto |
| CMS que entrega blocos | cada bloco vira um componente; o texto corrido usa o `prose` |

O componente de página não guarda texto. Ele recebe o conteúdo e os
metadados.

## Front matter

Campos que a página de artigo usa. Defina o esquema na coleção, para o
build falhar quando faltar o obrigatório.

| Campo | Uso | Obrigatório |
| --- | --- | --- |
| `title` | `h1` e `title` | sim |
| `description` | resumo, descrição e cartão | sim |
| `pubDate` | data | sim |
| `updatedDate` | data de atualização | não |
| `author` | referência à pessoa | sim |
| `category` | categoria | sim |
| `tags` | etiquetas | não |
| `cover`, `coverAlt` | capa e texto alternativo | não |
| `draft` | fora da listagem e do build de produção | não |

## Envolver com `prose`

```astro
---
import Prose from "@/components/designfy/prose/Prose.astro";
const { Content, headings } = await render(post);
---
<Prose><Content /></Prose>
```

O `prose` do registro aplica as classes de `@tailwindcss/typography`
ligadas aos papéis do tema (`designfy-prose.css`): cor de texto, de
título, de link, de borda, de código e de citação vêm do tema e trocam
com o modo escuro, sem `dark:prose-invert`.

Tamanhos: `size="default"`, `"lg"` para ensaio, `"compact"` para
documentação.

Componente dentro do texto que não deve herdar o estilo de prosa usa
`not-prose`.

## Componentes no lugar de elementos

Em MDX e no Astro, troque elementos do Markdown por componentes:

```astro
<Content components={{ img: Figure, pre: CodeBlock, table: ScrollTable, a: SmartLink, blockquote: Quote }} />
```

| Elemento | Componente | Ganho |
| --- | --- | --- |
| `img` | `figure` | legenda, dimensões, carga tardia |
| `pre` | `code-block` | nome do arquivo, copiar |
| `table` | invólucro com rolagem | não alarga a página |
| `a` | link que marca os externos | consistência |
| `blockquote` | citação ou aviso | tipos de aviso |
| `h2`, `h3` | título com âncora | link direto |

## Títulos e índice

- O processador gera `id` para cada título a partir do texto.
- `headings` alimenta o `table-of-contents`.
- O artigo não usa `h1` no corpo: o `h1` é o título do front matter.
  Configure o processador ou a revisão para barrar `#` no corpo.

## Destaque de código

No build, com Shiki (`designfy deps install content`): tema claro e
escuro por variáveis CSS, para trocar com o tema da página sem recarregar.
Nada de destaque no cliente em site estático.

## Vídeo e embeds no Markdown

Um endereço sozinho numa linha não vira player por conta própria. Use um
componente em MDX (`<VideoEmbed ... />`) ou uma diretiva que o
processador troca pela fachada.

## Imagens do conteúdo

Imagens ao lado do arquivo de conteúdo ou numa pasta de mídia, referidas
por caminho relativo, para o build gerar tamanhos e dimensões. Texto
alternativo obrigatório no Markdown: `![descrição](arquivo.jpg)`.

## Limpeza de HTML de terceiros

HTML vindo de CMS passa por limpeza antes de renderizar: remove `script`,
`style` em linha, atributos de evento, classes de editor e fontes
embutidas. O `prose` cuida do estilo.

## Tempo de leitura

Conte as palavras do texto sem código e divida por 200. Arredonde para
cima, com mínimo de um minuto.

## Rascunho e data futura

Artigo com `draft: true` ou data futura não entra na listagem, no feed
nem no mapa do site em produção. Em desenvolvimento aparece com a marca
"Rascunho".

## Feed

Blog com feed RSS aponta o `link rel="alternate"` no `head`. A geração é
do projeto.
