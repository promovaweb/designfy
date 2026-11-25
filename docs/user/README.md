# Designfy · Guia do Usuário

![Logo do Designfy](../../brand/logo/icon.png)

O Designfy é um framework visual para projetos web. Ele reúne o método e as
peças para uma interface sair desenhada: uma skill orquestradora que recebe o
pedido, o viewspec que especifica cada tela, um catálogo de fragmentos, um
registro de componentes React e Astro sobre Tailwind, shadcn e Motion, a paleta
pela roda de cores e a captura das telas em celular e desktop para a revisão. O
mesmo binário atende a pessoa no terminal, os scripts de CI e o agente por MCP.

Este guia acompanha a versão 0.1.0. Os exemplos usam comandos reais do binário.
Cada option citada existe no `designfy --help` da mesma versão.

## Leia online ou como ebook

Os capítulos deste diretório também formam o ebook
**Designfy · Guia do Usuário**. O PDF preserva a diagramação para leitura e
impressão. O EPUB deixa você ajustar fonte e tamanho no leitor digital.

- [Baixe o PDF](../../ebook/Designfy-Guia-do-Usuario-v0.1.0.pdf).
- [Baixe o EPUB](../../ebook/Designfy-Guia-do-Usuario-v0.1.0.epub).
- [Consulte a edição e os hashes](../../ebook/README.md).

## Percurso

Leia na ordem na primeira vez. Depois, cada capítulo funciona como consulta:

1. [Introdução e instalação](01-introducao-e-instalacao.md)
2. [Preparar o projeto](02-preparar-o-projeto.md)
3. [Skills](03-skills.md)
4. [Viewspec](04-viewspec.md)
5. [Tema e paleta](05-tema-e-paleta.md)
6. [Catálogo e componentes](06-catalogo-e-componentes.md)
7. [Fundos e movimento](07-fundos-e-movimento.md)
8. [Capturas e revisão](08-capturas-e-revisao.md)
9. [TUI](09-tui.md)
10. [Agentes e MCP](10-agentes-e-mcp.md)
11. [Referência](11-referencia.md)

Os capítulos 1 e 2 levam você da instalação ao projeto preparado, com as
bibliotecas conferidas. O 3 apresenta as skills e mostra como chamar a
orquestradora. O 4 explica o guia da raiz e o viewspec de cada tela. O 5 e o 6
cuidam do tema, da paleta, do catálogo e dos componentes. O 7 cobre fundos e
movimento. O 8 mostra a captura com Playwright e a revisão. O 9 percorre a Home
em menu e os módulos da TUI. O 10 liga o binário ao agente por MCP. O 11 reúne
preferências, arquivos, exit codes e solução de problemas.

## Documentação técnica

A pasta [docs/](../../docs/README.md) guarda a documentação que viaja dentro do
executável, com o contrato do viewspec, a referência do CLI, os módulos da TUI e as
tools MCP. O `designfy --skill` imprime essa documentação em Markdown.

## Onde encontrar o projeto

O código, os binários e as notas de cada versão ficam no repositório privado
[promovaweb/designfy](https://github.com/promovaweb/designfy). A versão online
deste guia fica em
`https://github.com/promovaweb/designfy/tree/main/docs/user`.
