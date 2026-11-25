# Capítulo 8: Capturas e revisão

A skill `designfy-review` abre o `manifest.json` da última execução e encontra
uma linha com `overflowX: true` na captura de 390 px. A tabela de pedidos
estoura a largura do celular. Ela abre o PNG, confirma o corte, devolve o achado
para a `designfy-responsive` e pede uma captura nova depois da correção. Sem a
captura, o problema teria passado.

## Instalar o Playwright

A captura roda o Playwright num processo Node, a partir do projeto. O binário
não leva navegador. Instale o pacote pelo catálogo e baixe o Chromium:

```bash
designfy deps install testing
npx playwright install chromium
```

Sem o pacote, o comando para com exit code 10 e a dica:

```text
error Playwright is unavailable. Run designfy deps install testing. [10 CHECK_FAILED]
```

O pacote é de desenvolvimento e traz também o `@axe-core/playwright`, usado nas
auditorias de acessibilidade. Rode a instalação do navegador uma vez por máquina
ou no passo de instalação da CI.

## Capturar

```bash
designfy capture run http://localhost:4321/produto/
```

O comando abre cada URL nos viewports escolhidos e grava um PNG por combinação.
O padrão vem de `capture.viewports`, que nasce como `mobile,desktop`.

```bash
designfy capture run http://localhost:4321/ http://localhost:4321/precos/ --viewport mobile,tablet,desktop --theme dark
```

Os presets são:

| Nome | Dimensão | Toque e escala |
| --- | --- | --- |
| `mobile` | 390 × 844 | toque, escala 3 |
| `tablet` | 820 × 1180 | toque, escala 2 |
| `desktop` | 1440 × 900 | sem toque, escala 1 |
| `wide` | 1920 × 1080 | sem toque, escala 1 |

`LARGURAxALTURA` cria outra dimensão, como `1024x768`. `--viewport` se repete ou
aceita lista por vírgula.

As options cobrem o que a revisão precisa:

| Option | Efeito |
| --- | --- |
| `--theme light\|dark` | define o `colorScheme` do navegador |
| `--full-page` | captura a página inteira, o padrão |
| `--fold` | captura só a primeira dobra |
| `--reduced-motion` | emula a preferência por movimento reduzido |
| `--wait <ms>` | espera depois do carregamento |
| `--selector <css>` | captura só o elemento que casa com o seletor |
| `--out <dir>` | troca a pasta raiz das capturas |
| `--name <run>` | nomeia a pasta da execução |

Para revisar um componente isolado:

```bash
designfy capture run http://localhost:4321/componentes/hero-split --selector "#preview" --fold
```

O `--fold` é útil para o hero; o `--full-page` mostra a página inteira e revela
o que só aparece no fim.

## O manifesto

Cada execução grava uma pasta em `.designfy/captures/<run>/`, com os PNGs e um
`manifest.json`. O manifesto registra:

| Campo | Conteúdo |
| --- | --- |
| `name`, `createdAt` | nome e horário da execução |
| `urls` | as URLs visitadas |
| `viewports` | nome, largura, altura, escala, toque e modo móvel de cada viewport |
| `theme` | `light` ou `dark` |
| `fullPage`, `reducedMotion`, `waitMs`, `selector` | as options usadas |
| `shots` | uma entrada por captura, com `url`, `viewport` e `file` |
| `title` | o título da página |
| `documentWidth`, `documentHeight`, `viewportWidth` | medidas da página |
| `overflowX` | `true` quando o documento é mais largo que o viewport |
| `consoleErrors`, `pageErrors` | erros do console e da página |
| `errors` | falhas de captura, com URL e viewport |

O `overflowX` é o primeiro sinal que a revisão lê. Ele indica conteúdo mais
largo que a tela, o defeito mais comum no celular. A correção costuma ser uma
tabela que rola dentro da própria caixa, uma imagem sem `max-width` ou uma grade
com largura mínima fixa.

O manifesto é gravado mesmo quando parte das capturas falha. Uma URL que não
responde aparece em `errors` e o comando sai com exit code 5.

## Listar execuções

```bash
designfy capture list
```

A lista vem da mais recente para a mais antiga, com as URLs, os viewports e os
arquivos de cada execução. Numa pasta vazia:

```text
No capture runs found.
```

`--out <dir>` aponta para outra pasta. A TUI mostra as mesmas execuções na aba
Captures, com os arquivos, os tamanhos e o `overflowX` de cada captura.

## Como a revisão usa as capturas

A skill `designfy-review` segue um caminho fixo:

1. Lê o `manifest.json` e separa as capturas com `overflowX`, erro de console e
   erro de página.
2. Abre cada PNG em celular e desktop, na ordem da tela.
3. Compara com o guia e com o viewspec: a ação principal aparece, o contraste
   segura, o texto não corta, o foco aparece, o movimento tem função.
4. Classifica cada achado por gravidade e devolve para a especialista dona:
   `designfy-responsive` para quebra de largura, `designfy-accessibility` para
   foco e contraste, `designfy-components` para estado, `designfy-motion` para
   animação.
5. Pede uma captura nova depois das correções e repete a leitura.

A revisão não compara pixel a pixel. Ela lê a imagem e o manifesto, como uma
pessoa faria, e registra o que achou. A comparação automática de imagem fica
fora do escopo do binário.

## Fechar a tela

Quando a checklist está completa e a revisão terminou, o viewspec registra a
execução usada em `captures` e muda o status para `done`:

```markdown
captures:
  - 2026-11-24T14-10-00-000Z
```

Um item pendente recusa `done`. A captura que sustenta o estado fica na pasta da
execução e o caminho aparece no relato da skill.

## Captura em CI

O mesmo comando serve para o build:

```bash
designfy deps install testing
npx playwright install --with-deps chromium
designfy capture run http://localhost:4321/ --viewport mobile,desktop --out .designfy/captures
designfy capture list --json
```

O passo precisa do servidor de desenvolvimento ou da prévia do build no ar. O
`--json` entrega o manifesto em `data`, que o script publica como artefato do
job. O `overflowX: true` vira uma falha do job quando o script confere o campo.

O `--reduced-motion` gera uma segunda captura com a preferência ligada e serve
para conferir que a tela não depende de animação para aparecer.

## Conferir

- `designfy deps install testing` e `npx playwright install chromium` rodaram.
- `designfy capture run` grava a pasta e o `manifest.json`.
- `designfy capture list` mostra a execução mais recente.
- O manifesto tem `overflowX: false` nas capturas de celular.
- A revisão registrou os achados e as correções antes do `done`.
- O viewspec em `done` cita a execução em `captures`.
