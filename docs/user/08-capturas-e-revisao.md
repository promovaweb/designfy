# Capítulo 8: Capturas e revisão

Nas primeiras capturas de página inteira do site da Promovaweb, o PNG mostrava o hero seguido de um espaço vazio. Ao rolar a mesma página no navegador, as seções apareciam. A captura tinha ocorrido antes que o `IntersectionObserver` revelasse o conteúdo e que as imagens abaixo da dobra começassem a carregar.

## Playwright e Chromium no projeto

O Designfy inicia o Playwright em um processo Node a partir do projeto que você quer revisar. O navegador tem instalação própria. Instale as dependências de teste e baixe o Chromium na máquina que fará a captura.

```bash
designfy deps install testing
npx playwright install chromium
```

O grupo `testing` inclui `@axe-core/playwright` para auditorias de acessibilidade. A instalação do Chromium pode entrar na preparação da CI ou ser feita uma vez por máquina. Quando o processo não consegue carregar o pacote Playwright, a execução termina com o código 10.

```text
error Playwright is unavailable. Run designfy deps install testing. [10 CHECK_FAILED]
```

A mensagem indica a dependência a instalar no projeto. Com o pacote e o navegador disponíveis, deixe a prévia do site no ar e use a URL da tela como argumento de `capture run`.

## Uma imagem por URL, tamanho e tema

Para capturar uma rota local com a configuração do projeto, informe o endereço completo. O comando lê os tamanhos de `capture.viewports`, cujo valor inicial é `mobile,desktop`.

```bash
designfy capture run http://localhost:4321/produto/
```

Cada URL produz um PNG por combinação de viewport e tema. Você pode incluir duas rotas na mesma chamada ou comparar o modo claro com o escuro em dois tamanhos.

```bash
designfy capture run http://localhost:4321/ http://localhost:4321/precos/ --viewport mobile,tablet,desktop --theme dark
designfy capture run http://localhost:4321/ --viewport mobile,desktop --theme light,dark
```

Na primeira chamada, as duas rotas geram três PNGs cada, um por tamanho no tema escuro. Na segunda, cada tamanho aparece nos dois temas. Quando há mais de um tema, o arquivo termina em `--<viewport>--<theme>.png`. Com um único tema, o sufixo é `--<viewport>.png`. A tabela reúne as dimensões em pixels CSS e a escala de cada dispositivo.

| Nome | Dimensão | Toque e escala |
| --- | --- | --- |
| `mobile` | 390 × 844 | toque, escala 3 |
| `tablet` | 820 × 1180 | toque, escala 2 |
| `desktop` | 1440 × 900 | sem toque, escala 1 |
| `wide` | 1920 × 1080 | sem toque, escala 1 |

Para uma largura fora da tabela, use o formato `LARGURAxALTURA`, como `1024x768`. A opção `--viewport` aceita repetição ou valores separados por vírgula. Os demais ajustes permitem escolher desde o trecho visível até a pasta que guardará a revisão.

| Opção | Efeito |
| --- | --- |
| `--theme light\|dark` | define o `colorScheme` do navegador. Aceita repetição ou lista, como `--theme light,dark` |
| `--full-page` | captura a página inteira, o padrão |
| `--fold` | captura só a primeira dobra, sem preparar a página |
| `--no-scroll` | dispensa a rolagem de preparação da página inteira |
| `--scroll-budget <ms>` | limita a rolagem e a espera por recursos, 15000 ms por padrão |
| `--hide <css>` | oculta os elementos do seletor. Aceita repetição, como `--hide '#chat' --hide '.floating-button'` |
| `--show-dev-overlays` | mantém visíveis os overlays de desenvolvimento |
| `--reduced-motion` | emula a preferência por movimento reduzido |
| `--wait <ms>` | espera depois do carregamento |
| `--selector <css>` | captura só o elemento que casa com o seletor |
| `--out <dir>` | troca a pasta raiz das capturas |
| `--name <run>` | nomeia a pasta da execução |

O modo escuro emula a preferência de cor do navegador. Confira no PNG se o site a respeitou. Para o teste de movimento reduzido, execute outra captura com `--reduced-motion` e verifique se o conteúdo já está visível.

### A rolagem que prepara a página inteira

Por padrão, o navegador percorre a página em passos da altura do viewport. Ele aguarda a rede ficar ociosa, espera as imagens e fontes carregarem e volta ao topo antes do PNG final. Durante o percurso, fotografa também os iframes de outra origem abaixo da dobra para preservar o conteúdo visto ao rolar.

O navegador volta ao topo mesmo que a preparação atinja o limite de 15000 ms. Nesse caso, o manifesto registra `scrollBudgetExhausted`. Ajuste `--scroll-budget` quando a página precisar de mais tempo. Com `--no-scroll`, o navegador pula o percurso, mas ainda aguarda a rede por até 15 segundos. Confira no PNG se as últimas seções carregaram. Acima de 64 Mi pixels físicos, a captura inteira usa escala CSS para reduzir o consumo de memória do Chromium.

Os overlays conhecidos de Astro, Vite e Next.js ficam ocultos. Para investigar o próprio overlay, use `--show-dev-overlays`. Para ocultar um widget do projeto, indique seu seletor com `--hide`. Na revisão de um hero isolado, você pode delimitar a imagem ao elemento de prévia.

```bash
designfy capture run http://localhost:4321/componentes/hero-split --selector "#preview" --fold
```

A opção `--selector` captura o elemento indicado. Tanto ela quanto `--fold` dispensam a preparação por rolagem. Para conferir as seções depois do hero, remova o seletor e use `--full-page`.

### Capturas para revisar uma tela

No Plano Founders, a linha de prazo precisava ficar logo abaixo das ações do hero no celular. Uma captura da dobra permite ver se o prazo ainda aparece junto dos botões. A revisão da linha do tempo e do rodapé exige outro enquadramento. Use estes conjuntos conforme a parte da tela a conferir.

| Captura | Viewports e opções |
| --- | --- |
| Página inteira | `mobile,tablet,desktop,wide` |
| Primeira dobra | `320x640,mobile,1280x800,desktop` com `--fold` |
| Esquema escuro | `mobile,desktop` com `--theme dark` |
| Movimento reduzido | `mobile,desktop` com `--reduced-motion` |

Em um projeto com tema único, dispense a captura em um segundo tema. Para revisar os dois esquemas na mesma execução, use `--theme light,dark`. Para registrar carregamento, erro ou estado vazio, abra a rota com o parâmetro de desenvolvimento ou o login de teste que reproduz o estado desejado.

## A leitura do manifest.json ao lado do PNG

Cada execução grava os PNGs e um `manifest.json` em `.designfy/captures/<run>/` por padrão. A execução `founders-0001-depois` registrou a tela do Plano Founders após os ajustes. O manifesto permite localizar a imagem exata e verificar se houve rolagem horizontal naquele tamanho.

| Campo | Conteúdo |
| --- | --- |
| `name`, `createdAt`, `outDir` | nome, horário e pasta da execução |
| `urls` | as URLs visitadas |
| `viewports` | nome, largura, altura, escala, toque e modo móvel de cada viewport |
| `themes` | temas na ordem da execução (`theme` guarda o primeiro) |
| `fullPage`, `scroll`, `scrollBudgetMs`, `showDevOverlays`, `hide`, `reducedMotion`, `waitMs`, `selector` | opções da execução |
| `shots` | uma entrada por captura |
| `errors` | falhas da execução. Quando uma imagem falha, inclui URL, viewport e tema |

Localize a entrada em `shots` pela URL, pelo viewport e pelo tema. O campo `file` aponta para o PNG e `title` ajuda a confirmar a rota. O Designfy marca `overflowX` quando `documentWidth` supera `viewportWidth` em mais de um pixel CSS. Abra a imagem nesse tamanho para identificar o elemento que excede a largura. Numa grade, confira a largura mínima das colunas. Uma imagem pode precisar de `max-width` e uma tabela larga pode exigir rolagem interna.

Quando uma seção aparece em branco, compare a altura do documento em `documentHeight` com o número de passos de rolagem em `scrollSteps`. Se `scrollBudgetExhausted` for verdadeiro ou `incompleteImages` listar imagens pendentes, refaça a captura antes de aprovar a tela. Consulte também `consoleErrors` e `pageErrors` para investigar falhas de script. Uma URL inacessível produz um `error` em `shots` e uma entrada em `errors`. O comando retorna o código 5 e preserva no manifesto as capturas concluídas.

## Localizar uma execução anterior

Consulte a lista a partir do projeto. As execuções aparecem da mais recente para a mais antiga, com o nome, o número de imagens e a pasta. A opção `--out <dir>` permite ler outro diretório.

```bash
designfy capture list
```

Quando a pasta consultada não contém execuções reconhecidas pelo Designfy, o comando exibe esta mensagem no terminal.

```text
No capture runs found.
```

Confira o destino usado em `capture run` antes de refazer a captura. No módulo Captures da TUI, você pode consultar os arquivos e tamanhos, além do valor de `overflowX` de cada imagem. Na CLI, os detalhes das URLs e viewports ficam disponíveis com `--json`.

## Do achado visual à correção no viewspec

Na revisão com `designfy-review`, abra o manifesto para localizar erros de console ou de página e identificar a largura afetada. Compare o PNG do celular com o viewspec antes de examinar o desktop, o tablet e a tela larga nas variantes previstas pelo guia. Um corte de texto aparece na imagem. Para conferir as setas que surgem ao receber foco, abra a rota e percorra o carrossel pelo teclado.

O viewspec `0001-founders` tinha nove itens. Entre eles estavam as setas do carrossel visíveis ao receber foco e os indicadores de posição clicáveis. A revisão também verificou o anel de foco no resumo da FAQ. Os componentes compartilhados precisavam manter a mesma aparência em repouso em `/planos/martech/`. Na execução `founders-0001-depois`, as capturas não apresentaram estouro horizontal.

### Gravidade e destino do achado

Classifique cada defeito pelo que acontece durante o uso e registre a imagem correspondente. Quando o foco desaparece sobre um botão, fica difícil acompanhar a navegação pelo teclado. Já uma palavra isolada na última linha permite continuar a leitura e recebe gravidade baixa.

| Gravidade | O que significa | O que acontece |
| --- | --- | --- |
| alta | falha funcional ou de acesso, como rolagem horizontal, ação principal fora da dobra, texto ilegível, conteúdo inventado, erro de script, controle sem foco ou sem nome, ou contraste abaixo do mínimo | corrige antes de fechar |
| média | a tela funciona, mas parece genérica ou descuidada: tudo centralizado, seções iguais, estado vazio sem ação, movimento ausente | corrige ou registra o motivo em Notas |
| baixa | detalhe de ofício: palavra sozinha na última linha, aspas retas, sombra forte, alinhamento óptico | responde item a item |

Encaminhe cada ajuste à especialista correspondente. Para conteúdo que falta no projeto, a orquestradora `designfy` consulta você.

| Ajuste | Skill |
| --- | --- |
| Cor, tipografia, espaçamento ou tema | `designfy-design-system` |
| Componente, estado ou dependência | `designfy-components` |
| Animação | `designfy-motion` |
| Composição do site, da leitura ou do aplicativo | `designfy-websites`, `designfy-content` ou `designfy-webapps` |
| Largura, empilhamento ou toque | `designfy-responsive` |
| Foco, navegação por teclado, nome ou semântica | `designfy-accessibility` |
| Arquivo do viewspec ou orientação do guia | `designfy-viewspec` |

A primeira revisão recebe o nome `<slug>-r1`. Em `<slug>-r2`, abra a nova captura e marque cada achado anterior como resolvido, parcial ou aberto. Examine a tela inteira para localizar efeitos da correção em outras seções. A terceira e última revisão, `<slug>-r3`, trata o que restou. A avaliação combina imagem e manifesto por inspeção visual, sem comparação automática pixel a pixel.

### Veredito e fechamento da checklist

O veredito considera o que continua aberto após a revisão. Um achado médio que fique para depois exige justificativa em Notas.

| Veredito | Condição |
| --- | --- |
| aprovada | achados altos e médios resolvidos, com resposta aos baixos |
| aprovada com ressalvas | achados altos resolvidos, com justificativa em Notas para os médios abertos |
| reprovada | algum de gravidade alta aberto |

Somente `aprovada` e `aprovada com ressalvas` permitem fechar a tela. Com a checklist completa, registre em `captures` o nome da execução que documenta o resultado. O trecho abaixo ilustra o campo do viewspec.

```markdown
captures:
  - 2026-11-24T14-10-00-000Z
```

O nome aponta para a pasta que guarda o PNG e o manifesto. Um item pendente na checklist impede a mudança de status para `done`. Registre também o caminho da captura no relato da revisão para que a imagem possa ser reaberta.

## Conferência de largura na CI

Na CI, prepare o Chromium com as dependências do sistema e mantenha a prévia do build ou o servidor de desenvolvimento acessível na URL da captura. A sequência abaixo grava as imagens na pasta indicada e consulta os manifestos para o job.

```bash
designfy deps install testing
npx playwright install --with-deps chromium
designfy capture run http://localhost:4321/ --viewport mobile,desktop --out .designfy/captures
designfy capture list --json
```

Na lista em JSON, localize a execução do job em `data.captures` e examine os itens de `shots` daquele manifesto. Para reprovar o job por largura excessiva, faça o script retornar falha ao encontrar `overflowX: true`. Publique o manifesto junto dos PNGs para abrir a imagem no tamanho que apresentou o problema.
