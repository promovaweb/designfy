# Capítulo 8: Capturas e revisão

As primeiras capturas de página inteira do site da Promovaweb mostravam o hero e um espaço vazio no lugar das seções seguintes. No navegador, o conteúdo aparecia durante a rolagem. A diferença estava no momento da captura. O `IntersectionObserver` ainda não tinha disparado as revelações e as imagens abaixo da dobra aguardavam a aproximação do viewport para carregar.

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

A primeira chamada gera seis imagens no escuro. A segunda gera quatro nos dois temas. Com vários temas, o nome termina em `--<viewport>--<theme>.png`. Com apenas um, termina em `--<viewport>.png`. Os tamanhos predefinidos incluem a escala física e a emulação de toque.

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
| `--no-scroll` | pula a rolagem e a espera por recursos antes da captura da página inteira |
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

A preparação tem um limite de 15000 ms, ajustável com `--scroll-budget`. Ao atingir o limite, a captura prossegue e registra `scrollBudgetExhausted` no manifesto. Em páginas curtas ou com animação contínua, `--no-scroll` permite dispensar o percurso e a espera mesmo com um servidor lento. Confira nesse caso se as últimas seções apareceram. Acima de 64 Mi pixels físicos, a captura inteira usa escala CSS para reduzir o consumo de memória do Chromium.

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
| `errors` | falhas de captura, com URL e viewport |

Em `shots`, identifique a captura por `url`, `viewport`, `theme` e `file`. O título em `title` ajuda a conferir a rota. Quando `overflowX` for verdadeiro, compare `documentWidth` com `viewportWidth` e abra a imagem para localizar o trecho mais largo. Uma tabela pode precisar de rolagem interna. Para uma imagem, confira `max-width`. Numa grade, procure uma largura mínima que exceda o espaço disponível.

Para investigar um trecho em branco, consulte `documentHeight` e os passos percorridos em `scrollSteps`. A lista `incompleteImages` aponta imagens ainda pendentes. A marca `scrollBudgetExhausted` indica que o tempo de preparação terminou. Leia também `consoleErrors` e `pageErrors` antes de atribuir o defeito ao layout. Em caso de falha, a captura tem o campo `error`. Uma URL inacessível entra em `errors` e o comando retorna o código 5, mas o manifesto preserva as capturas concluídas.

## Localizar uma execução anterior

Consulte a lista a partir do projeto. As execuções aparecem da mais recente para a mais antiga, com o nome, o número de imagens e a pasta. A opção `--out <dir>` permite ler outro diretório.

```bash
designfy capture list
```

Na ausência de execuções na pasta consultada, a saída informa que a lista está vazia.

```text
No capture runs found.
```

Confira o destino usado em `capture run` antes de refazer a captura. No módulo Captures da TUI, você pode consultar os arquivos e tamanhos, além do valor de `overflowX` de cada imagem. Na CLI, os detalhes das URLs e viewports ficam disponíveis com `--json`.

## Do achado visual à correção no viewspec

A skill `designfy-review` começa pelo manifesto para localizar estouros de largura e erros de console ou de página. Depois abre as imagens a partir do celular. Seguem-se desktop, tablet e tela larga, além das variantes de tema e movimento. A revisão compara o que aparece no PNG com o guia e com o viewspec. A imagem ajuda a verificar um corte de texto. Para conferir um controle que só aparece ao receber foco, reproduza o estado pelo teclado.

O viewspec `0001-founders` tinha nove itens. Entre eles estavam as setas do carrossel visíveis ao receber foco e os indicadores de posição clicáveis. A revisão também verificou o anel de foco no resumo da FAQ. Os componentes compartilhados precisavam manter a mesma aparência em repouso em `/planos/martech/`. Na execução `founders-0001-depois`, as capturas não apresentaram estouro horizontal.

### Gravidade e destino do achado

Registre o defeito junto à imagem e classifique a gravidade pelo efeito na tela. Uma ação sem foco visível impede seu acompanhamento pelo teclado. Uma palavra isolada na última linha permite outra prioridade de correção.

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

A lista em JSON traz os manifestos em `data.captures`. Publique a pasta com o manifesto e as imagens como artefato do job. Para reprovar a execução por largura excessiva, o script da CI precisa examinar `shots` e retornar falha quando encontrar `overflowX: true`.
