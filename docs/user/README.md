# Designfy · Guia do Usuário

![Logo do Designfy](../../brand/logo/icon.png)

Na revisão do Plano Founders, uma das nove tarefas era manter o prazo da oferta logo abaixo dos botões do hero no celular. A posição ficou registrada no viewspec da tela. Depois do ajuste, a captura `founders-0001-depois` permitiu conferir a disposição dos elementos. O manifesto também registrou que o conteúdo cabia na largura da janela.

Com o Designfy, você trabalha com esses dois arquivos em momentos diferentes. O viewspec descreve o que a interface precisa fazer. A captura permite comparar o resultado com o que ficou escrito. Entre uma etapa e outra, o catálogo ajuda a escolher um padrão de interface e o registro fornece componentes React ou Astro para implementar a tela com Tailwind. Há componentes que usam shadcn e Motion.

## Capítulos do guia

Na primeira instalação, comece pelos capítulos 1 e 2 para reconhecer o projeto e conferir as bibliotecas. Num site que já tem identidade visual, vá ao capítulo 5 antes de escolher novas cores. A origem dos tokens determina qual folha de estilos entra na medição de contraste.

1. [Introdução e instalação](01-introducao-e-instalacao.md) para instalar e testar o binário.
2. [Preparar o projeto](02-preparar-o-projeto.md) para conferir o framework e trabalhar com um design existente.
3. [Skills](03-skills.md) para acionar a orquestradora ou estudar uma tela com uma especialista.
4. [Viewspec](04-viewspec.md) para escrever o guia do projeto e vincular a especificação da tela ao Astrofy ou ao Specsfy.
5. [Tema e paleta](05-tema-e-paleta.md) para localizar os tokens, explorar a roda de cores e medir contraste.
6. [Catálogo e componentes](06-catalogo-e-componentes.md) para escolher um padrão e consultar o código disponível.
7. [Fundos e movimento](07-fundos-e-movimento.md) para aplicar um preset de fundo ou ajustar uma animação.
8. [Capturas e revisão](08-capturas-e-revisao.md) para capturar a página inteira com Playwright e conferir o resultado no celular e no desktop.
9. [TUI](09-tui.md) para acompanhar o projeto pelos cartões da Home e operar os módulos pelo teclado.
10. [Agentes e MCP](10-agentes-e-mcp.md) para conectar um cliente ao binário e consultar o projeto por uma tool.
11. [Referência](11-referencia.md) para localizar um arquivo, alterar uma preferência ou interpretar o código de saída no CI.

## Edição em PDF e EPUB

Os capítulos também estão disponíveis em livro. O PDF preserva a composição das páginas para leitura e impressão. No EPUB, você ajusta a fonte e o tamanho do texto no leitor. Para conferir um download, compare o hash do arquivo com o publicado para a edição correspondente.

- [Baixar o PDF da versão 0.2.1](../../ebook/Designfy-Guia-do-Usuario-v0.2.1.pdf)
- [Baixar o EPUB da versão 0.2.1](../../ebook/Designfy-Guia-do-Usuario-v0.2.1.epub)
- [Consultar a edição e os hashes](../../ebook/README.md)

## Referência embutida e versão online

Na máquina onde você instalou o binário, `designfy --skill` imprime o manual técnico em Markdown. Para verificar uma opção da sua versão, abra a ajuda do comando com `--help`. Os arquivos que acompanham o executável documentam o contrato do viewspec, os comandos do CLI, os módulos da TUI e as tools MCP. [Documentação embutida](../../docs/README.md)

O Designfy é distribuído no npm como `@promovaweb/designfy`. O repositório público reúne o código, os binários e as notas de versão. No site da Promovaweb, você encontra a apresentação do projeto e pode ler o guia no navegador. [Repositório do Designfy](https://github.com/promovaweb/designfy) · [Portal do Designfy](https://promovaweb.com/designfy/) · [Guia e documentação online](https://promovaweb.com/docs/designfy/)
