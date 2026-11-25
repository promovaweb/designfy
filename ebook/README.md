# Ebook do guia do usuário

![Logo do Designfy](../brand/logo/icon.png)

Esta pasta publica o conteúdo completo de `docs/user/` em PDF e EPUB, com o
título **Designfy · Guia do Usuário**. Os arquivos Markdown são a única fonte
editorial. Não edite os artefatos gerados.

## Edição vigente

A versão está em [`VERSION`](VERSION), segue SemVer e acompanha a versão do
binário, da tag Git e da GitHub Release:

- **PATCH:** correção de texto, link, exemplo ou apresentação.
- **MINOR:** capítulo novo ou ampliação material.
- **MAJOR:** reorganização incompatível do percurso.

Baixe a edição `v0.1.0`:

- [PDF do guia do usuário](Designfy-Guia-do-Usuario-v0.1.0.pdf).
- [EPUB do guia do usuário](Designfy-Guia-do-Usuario-v0.1.0.epub).

Para links permanentes, use os aliases da edição mais recente:

- [PDF vigente](ebook-designfy.pdf): `ebook-designfy.pdf`.
- [EPUB vigente](ebook-designfy.epub): `ebook-designfy.epub`.

Cada build mantém somente as cinco edições SemVer mais recentes.
[`build.json`](build.json) registra a versão, o digest das fontes, os metadados
documentais e os hashes dos dois formatos.

## Gerar

Na raiz do Designfy:

```bash
bun .ebook/build-ebook.mjs
```

O build é orquestrado em JavaScript com Bun e exige Pandoc, WeasyPrint,
`xmllint`, `pdftohtml`, ImageMagick, Fontconfig e `unzip`.
`docs/user/reading-order.txt` precisa listar cada página Markdown exatamente
uma vez. O PDF usa a capa em HTML com as fontes Inter e Manrope de
`brand/fonts/`; o EPUB usa a capa em PNG gerada no build.

## Verificar

```bash
bun .ebook/build-ebook.mjs --check
```

A verificação compara as fontes com o manifesto, recalcula hashes, valida o
XML do EPUB e confere a navegação interna dos dois formatos.

Toda mudança publicada em `docs/user/` exige uma nova versão do Designfy, novo
build, verificação automatizada e inspeção visual do PDF. O número não é
alterado apenas no ebook.
