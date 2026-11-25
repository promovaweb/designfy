---
name: designfy-content
description: Especialista em páginas de conteúdo do Designfy. Diagrama blogs, artigos, guias e documentação com leitura confortável, cabeçalho de artigo, corpo em prose, índice, progresso de leitura, tabelas e código que rolam na própria caixa, imagens com legenda, embeds de vídeo com fachada, listagem, categorias, paginação, autoria e relacionados, em Astro e React. Use quando a pessoa pedir blog, página de artigo, post, listagem de posts, página de documentação, diagramação de texto, tipografia de leitura, embed de vídeo, índice de artigo, ou quando a skill designfy chamar esta etapa para um viewspec de conteúdo.
---

# Conteúdo: blogs, artigos e documentação

Uma página de conteúdo existe para ser lida. Esta skill cuida da leitura:
a medida da linha, o ritmo entre os blocos, a hierarquia dos títulos, o
comportamento de tabela, código, imagem e vídeo dentro do texto, e as
páginas ao redor (listagem, categoria, autoria).

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Medida, ritmo e hierarquia do texto longo | [references/diagramacao-de-texto.md](references/diagramacao-de-texto.md) |
| Montar a página de artigo, região por região | [references/pagina-de-artigo.md](references/pagina-de-artigo.md) |
| Listagem, categorias, paginação e relacionados | [references/listagem-e-arquivo.md](references/listagem-e-arquivo.md) |
| Elementos dentro do texto: tabela, código, citação, aviso, lista | [references/elementos-do-texto.md](references/elementos-do-texto.md) |
| Imagens, figuras e vídeos embutidos | [references/midia-e-embeds.md](references/midia-e-embeds.md) |
| Página de documentação: três colunas, navegação, busca por índice | [references/documentacao.md](references/documentacao.md) |
| Markdown e MDX: do arquivo à página | [references/markdown-e-mdx.md](references/markdown-e-mdx.md) |
| Conferência antes de entregar | [references/checklist.md](references/checklist.md) |

Modelos em `assets/`: [artigo.astro](assets/artigo.astro),
[listagem.astro](assets/listagem.astro) e
[artigo-de-teste.md](assets/artigo-de-teste.md) (um texto com todos os
elementos, para testar a diagramação).

## Regras

1. **A medida manda.** Texto corrido entre 60 e 75 caracteres por linha
   (45 no mínimo no celular). O corpo nunca ocupa a largura inteira de uma
   tela larga.
2. **Corpo de 16 px ou mais**, com altura de linha de 1.6 a 1.75 em texto
   longo. No celular, o mesmo tamanho ou maior.
3. **O texto não se move.** Nenhuma animação no corpo, nada passando atrás
   nem na frente dele. O movimento fica ao redor: progresso de leitura,
   índice, capa, relacionados.
4. **Hierarquia sem salto.** Um `h1` (o título do artigo), o corpo começa
   em `h2`, e os níveis descem um por vez. Todo título do corpo tem `id`
   para âncora.
5. **Elemento largo rola na própria caixa.** Tabela e bloco de código
   nunca alargam a página nem quebram o comando.
6. **Mídia com dimensão e alternativa.** Imagem com `width`, `height`,
   texto alternativo e legenda quando ajuda; vídeo com fachada, título e
   legendas.
7. **O player só carrega no clique.** Embed de vídeo usa fachada (capa e
   botão); nenhum script de terceiro entra antes de a pessoa pedir.
8. **Link se distingue sem cor.** Sublinhado no corpo do texto.
9. **O conteúdo vem dos arquivos.** Markdown, MDX ou o CMS do projeto. O
   componente recebe o conteúdo; não guarda texto.
10. **Categoria e tag são páginas reais.** Filtro de listagem é link, não
    estado de tela. Página de listagem com um item só não existe.
11. **Uma ação ao fim da leitura.** O artigo termina num próximo passo
    ligado ao tema: outro artigo, o produto, a inscrição.
12. **Tema e mais nada.** O `prose` lê os papéis do tema; nada de cor de
    texto própria do artigo.

## Passos

### 1. Ler o viewspec e o conteúdo real

`## Conteúdo` diz de onde vem o texto. Abra dois ou três artigos de
verdade do projeto: o mais curto, o mais longo e o que tem mais elementos
(tabela, código, vídeo). A diagramação precisa servir aos três.

### 2. Garantir a base de leitura

```bash
designfy deps install typography content
designfy components add prose article-header table-of-contents reading-progress
```

Confira a medida e a escala com
[references/diagramacao-de-texto.md](references/diagramacao-de-texto.md).

### 3. Montar a página de artigo

Com [references/pagina-de-artigo.md](references/pagina-de-artigo.md):
trilha, cabeçalho do artigo, corpo, índice, autoria, relacionados, ação
final.

### 4. Tratar os elementos do texto

Com [references/elementos-do-texto.md](references/elementos-do-texto.md) e
[references/midia-e-embeds.md](references/midia-e-embeds.md). Teste com
[assets/artigo-de-teste.md](assets/artigo-de-teste.md), que traz todos os
elementos.

### 5. Montar listagem e arquivo

Com [references/listagem-e-arquivo.md](references/listagem-e-arquivo.md):
destaque, grade, categorias como páginas, paginação, vazio.

### 6. Conferir

[references/checklist.md](references/checklist.md), com capturas do artigo
curto e do longo em celular e desktop. Marque os itens no viewspec.

## Marcos

- Base de leitura instalada, com a medida conferida.
- Página de artigo montada e testada com artigos reais.
- Tabela, código, imagem e vídeo comportados no celular.
- Listagem, categorias e paginação no ar.
- Checklist passada.

## Saída

A medida e a escala usadas, os fragmentos e a fonte de cada um, os
elementos de texto tratados, como ficam tabela e código no celular, os
artigos usados no teste e o que ficou para as outras especialistas.
