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
O padrão vem de `capture.viewports`, cuja configuração inicial é `mobile,desktop`.

```bash
designfy capture run http://localhost:4321/ http://localhost:4321/precos/ --viewport mobile,tablet,desktop --theme dark
designfy capture run http://localhost:4321/ --viewport mobile,desktop --theme light,dark
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
| `--theme light\|dark` | define o `colorScheme` do navegador; se repete ou aceita lista, como `--theme light,dark` |
| `--full-page` | captura a página inteira, o padrão |
| `--fold` | captura só a primeira dobra, sem preparar a página |
| `--no-scroll` | pula a rolagem e a espera por recursos antes da captura da página inteira |
| `--scroll-budget <ms>` | limita a rolagem e a espera por recursos, 15000 ms por padrão |
| `--hide <css>` | oculta os elementos do seletor; se repete, como `--hide '#chat' --hide '.floating-button'` |
| `--show-dev-overlays` | mantém visíveis os overlays de desenvolvimento |
| `--reduced-motion` | emula a preferência por movimento reduzido |
| `--wait <ms>` | espera depois do carregamento |
| `--selector <css>` | captura só o elemento que casa com o seletor |
| `--out <dir>` | troca a pasta raiz das capturas |
| `--name <run>` | nomeia a pasta da execução |

Com dois ou mais temas, cada combinação de URL, viewport e tema produz um PNG cujo
nome termina em `--<viewport>--<theme>.png`. Com um tema, termina em
`--<viewport>.png`.

### A página inteira

Antes do print da página inteira, o navegador percorre a página em passos da
altura do viewport, aguarda a rede ficar ociosa e as imagens e fontes
terminarem de carregar e volta ao topo. Isso dispara as revelações por rolagem
e as imagens preguiçosas: sem a preparação, o PNG mostra só o que já estava na
primeira dobra.

- Iframes de outra origem abaixo da dobra são fotografados durante a preparação,
  para preservar o conteúdo visível no PNG.
- Os overlays conhecidos de Astro, Vite e Next.js ficam ocultos por padrão.
  `--show-dev-overlays` mantém todos. A opção `--hide` esconde qualquer outro
  seletor.
- `--scroll-budget` limita o tempo da preparação. Quando o limite chega, a
  captura segue e o manifesto marca `scrollBudgetExhausted`.
- `--no-scroll` desliga a preparação. É útil em página curta, com animação
  infinita ou servidor lento.
- `--fold` e `--selector` também pulam a preparação, porque capturam só uma área.
- Acima de 64 Mi pixels físicos, a captura de página inteira usa a escala CSS
  para reduzir o uso de memória do Chromium.

Para revisar um componente isolado:

```bash
designfy capture run http://localhost:4321/componentes/hero-split --selector "#preview" --fold
```

O `--fold` é útil para o hero; o `--full-page` mostra a página inteira e revela
o que só aparece no fim.

## Conjunto mínimo de uma revisão

Quatro execuções cobrem a revisão: a página inteira em `mobile,tablet,desktop,wide`;
a dobra em `320x640,mobile,1280x800,desktop` com `--fold`; o tema escuro em
`mobile,desktop` com `--theme dark`; e o movimento reduzido em `mobile,desktop`
com `--reduced-motion`. Em projeto com um tema só, a terceira não existe; com
dois temas, uma execução com `--theme light,dark` cobre os dois de uma vez.
Carregando, vazio e erro também são tela: capture com um parâmetro de
desenvolvimento ou um login de teste, como descreve a referência de capturas.

## O manifesto

Cada execução grava uma pasta em `.designfy/captures/<run>/`, com os PNGs e um
`manifest.json`. O manifesto registra:

| Campo | Conteúdo |
| --- | --- |
| `name`, `createdAt`, `outDir` | nome, horário e pasta da execução |
| `urls` | as URLs visitadas |
| `viewports` | nome, largura, altura, escala, toque e modo móvel de cada viewport |
| `themes` | os temas em ordem; `theme` guarda o primeiro |
| `fullPage`, `scroll`, `scrollBudgetMs`, `showDevOverlays`, `hide`, `reducedMotion`, `waitMs`, `selector` | as options usadas |
| `shots` | uma entrada por captura |
| `errors` | falhas de captura, com URL e viewport |

Cada entrada de `shots` traz `url`, `viewport`, `theme`, `file` e o que a revisão
lê: `title`, `documentWidth`, `documentHeight`, `viewportWidth`, `overflowX`,
`consoleErrors`, `pageErrors`, `scrollSteps`, `incompleteImages`,
`scrollBudgetExhausted` e `error` quando a captura falha. `scrollSteps` informa o total de
passos da preparação; `incompleteImages` lista as imagens que ainda não tinham
carregado; `scrollBudgetExhausted` avisa que o tempo de preparação acabou antes
do fim da página. O `overflowX` é o primeiro sinal que a revisão lê. Ele indica
conteúdo mais largo que a tela, o defeito mais comum no celular. A correção
costuma ser uma tabela que rola dentro da própria caixa, uma imagem sem
`max-width` ou uma grade com largura mínima fixa.

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

`--out <dir>` aponta para outra pasta. A TUI mostra as mesmas execuções no módulo
Captures, com os arquivos, os tamanhos e o `overflowX` de cada captura.

## Como a revisão usa as capturas

A skill `designfy-review` segue um caminho fixo:

1. Lê o `manifest.json` e separa as capturas com `overflowX`, erro de console e
   erro de página.
2. Abre cada PNG, começando pelo celular, depois desktop, tablet, tela larga,
   tema escuro e movimento reduzido.
3. Compara com o guia e com o viewspec: a ação principal aparece, o contraste
   segura, o texto não corta, o foco aparece, o movimento tem função.
4. Classifica cada achado por gravidade e devolve para a especialista dona.
5. Pede uma captura nova depois das correções e repete a leitura.

A revisão não compara pixel a pixel. A skill examina a imagem junto com o manifesto e registra os achados.

## Revisões, gravidade e veredito

Cada revisão tem um nome: `<slug>-r1` para achar tudo, `<slug>-r2` para conferir
as correções e o que elas trouxeram e `<slug>-r3` para fechar o que restou. Em
cada nova revisão, confira os achados anteriores primeiro (resolvido, parcial ou
aberto) e depois olhe a tela inteira de novo. O limite é de três revisões.

A gravidade orienta a correção:

| Gravidade | O que significa | O que acontece |
| --- | --- | --- |
| alta | a tela falha no que promete ou fere uma regra sem exceção: rolagem horizontal, ação principal fora da dobra, texto ilegível, conteúdo inventado, erro de script, controle sem foco ou sem nome, contraste abaixo do mínimo | corrige antes de fechar |
| média | a tela funciona, mas parece genérica ou descuidada: tudo centralizado, seções iguais, estado vazio sem ação, movimento ausente | corrige ou registra o motivo em Notas |
| baixa | detalhe de ofício: palavra sozinha na última linha, aspas retas, sombra forte, alinhamento óptico | responde item a item |

Cada achado vai à especialista dona: `designfy-design-system` para cor, tipo,
espaço e tema; `designfy-components` para componente, estado e dependência;
`designfy-motion` para animação; `designfy-websites`, `designfy-content` e
`designfy-webapps` para a composição do tipo de tela; `designfy-responsive`
para estouro, empilhamento e toque; `designfy-accessibility` para foco, teclado,
nomes e semântica; `designfy-viewspec` para o arquivo ou uma regra do guia. O que
falta de conteúdo vai para você, pela `designfy`.

No fim, o veredito é um dos três:

| Veredito | Condição |
| --- | --- |
| aprovada | nenhum achado de gravidade alta ou média aberto; os baixos respondidos |
| aprovada com ressalvas | nenhum de gravidade alta; médios abertos com o motivo em Notas |
| reprovada | algum de gravidade alta aberto |

Só `aprovada` e `aprovada com ressalvas` permitem o estado `done` no viewspec.

## Fechar a tela

Quando a checklist está completa e a revisão terminou, o viewspec registra a
execução usada em `captures` e muda o status para `done`:

```markdown
captures:
  - 2026-11-24T14-10-00-000Z
```

Um item pendente recusa `done`. A captura que documenta o estado fica na pasta da
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
- `designfy capture run --theme light,dark` grava um PNG por viewport em cada tema.
- O manifesto registra `scrollSteps` e `scrollBudgetExhausted` da preparação.
- O manifesto tem `overflowX: false` nas capturas de celular.
- Cada achado tem gravidade e responsável. Você conferiu a correção em `r2`.
- O veredito é `aprovada` ou `aprovada com ressalvas` antes do `done`.
- O viewspec em `done` cita a execução em `captures`.
