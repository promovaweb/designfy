# Designfy · Guia do Usuário

![Logo do Designfy](../../brand/logo/icon.png)

No celular, o prazo da oferta do Plano Founders precisava aparecer logo abaixo dos botões do hero. Esse era um dos nove itens do viewspec da tela. Depois do ajuste, o PNG da execução `founders-0001-depois` permitiu conferir a posição do prazo. O manifesto registrou também a largura do documento e a ausência de rolagem horizontal.

O viewspec acompanha a tela desde a escolha de um padrão de interface no catálogo até a revisão da captura. Para implementar o padrão, você pode copiar do registro um componente em React ou Astro com os estilos do Tailwind. Alguns componentes usam também o shadcn ou o Motion. Depois da implementação, compare a tela com a checklist do viewspec.

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

## Leia online ou como ebook

Para imprimir o guia com a paginação da edição, baixe o PDF. No EPUB, você pode ajustar a fonte e o tamanho do texto no leitor. O arquivo `build.json` identifica a edição vigente e traz o SHA-256 de cada formato para conferir o download.

- [Baixar o PDF da edição vigente](../../ebook/ebook-designfy.pdf)
- [Baixar o EPUB da edição vigente](../../ebook/ebook-designfy.epub)
- [Consultar a edição e os hashes](../../ebook/build.json)

## Referência embutida e versão online

Para consultar o manual técnico da versão instalada, rode `designfy --skill` no terminal. Use `--help` no comando que você pretende executar para conferir as opções disponíveis. A referência embutida também descreve o formato do viewspec e as operações que o agente pode chamar pelo MCP. [Documentação embutida](../../docs/README.md)

Você encontra o pacote `@promovaweb/designfy` no npm e as notas de cada versão junto aos binários no repositório. Para conhecer as ferramentas do projeto, abra o portal da Promovaweb. A documentação online reúne os capítulos para leitura no navegador. [Repositório do Designfy](https://github.com/promovaweb/designfy) · [Portal do Designfy](https://promovaweb.com/designfy/) · [Guia e documentação online](https://promovaweb.com/docs/designfy/)
