# Capítulo 5: Tema e paleta

Na instalação do Designfy no site da Promovaweb, a primeira consulta ao tema abriu `docs-theme.css`. As cores faziam sentido para a documentação, que tem estilo próprio. Para medir o contraste dos botões dos planos, era preciso ler o CSS do site. O ajuste foi indicar `src/styles/brand/global.css` no campo `tokensFile` do `VIEWSPEC.md` da raiz.

## Qual arquivo o theme show abriu

Rode a consulta na raiz do seu projeto. A primeira linha da resposta traz o caminho do CSS. Confira esse caminho antes de interpretar uma cor ou investigar um token ausente.

```bash
designfy theme show
```

No exemplo abaixo, a leitura começa em `app.css` e segue os imports locais até as declarações em `@theme` e `@theme inline`. Para mostrar o fundo nos dois modos, o comando procura o valor de base em `:root` e verifica se há uma substituição em `.dark`.

```text
/tmp/opencode/designfy-demo/src/styles/app.css

colors
  --color-background          light var(--background) → #f7fbfb | dark var(--background) → #061114
  --color-foreground          light var(--foreground) → #0d1b1e | dark var(--foreground) → #e7f1f0
  --color-primary             light var(--primary) → #006966 | dark var(--primary) → #4cd7c8
  ...

radius
  --radius-sm   light calc(var(--radius) - 4px) | dark calc(var(--radius) - 4px)
  --radius-lg   light var(--radius) | dark var(--radius)

motion
  --duration-base  light 250ms | dark 250ms
  --ease-out-expo  light cubic-bezier(0.16, 1, 0.3, 1) | dark cubic-bezier(0.16, 1, 0.3, 1)
```

Na linha de `--color-background`, a seta liga a declaração ao valor resolvido. O mesmo nome aponta para um fundo quase branco no claro e para um fundo escuro no outro modo. Você pode restringir a saída a um grupo ou consultar um CSS específico.

```bash
designfy theme show --group colors
designfy theme show --group motion
designfy theme show --file src/styles/app.css
```

Além de `colors` e `motion`, o filtro aceita `fonts`, `text`, `radius`, `spacing`, `shadows` e `breakpoints`. Use `--json` para investigar a origem da escolha. O campo `entryFile` identifica a entrada que importa o arquivo selecionado quando ela existe. O valor de `selection` acompanha esta ordem de preferência.

| `selection` | De onde vem o caminho |
| --- | --- |
| `--file` | Caminho indicado nesta chamada |
| `paths.theme` | Campo do `designfy.json` configurável com `init --theme-path` |
| `tokensFile` | Arquivo existente indicado pelo guia da raiz |
| `conventional entry` | Entrada como `global.css`, `app.css` ou `main.css` que importa o Tailwind em `paths.styles`, `src/styles` ou `src/app` |
| `Tailwind search` | Busca de CSS nesses diretórios, com `src/index.css` e `app/globals.css` entre os candidatos |

Na busca automática, áreas isoladas como `docs/` e `admin/` têm prioridade menor. O mesmo vale para `docs-theme.css` e `email/`. Quando a busca termina sem localizar uma folha do Tailwind, o comando retorna o código 6.

```text
error No Tailwind stylesheet found. Run "designfy components add designfy-theme". [6 NOT_FOUND]
```

Num projeto novo, a sugestão da mensagem instala o tema do registro. Num projeto com Tailwind 3, como o site da Promovaweb, confira primeiro se a entrada usa `@tailwind base` ou `@import "tailwindcss/base"`. O Designfy reconhece essas declarações e completa a leitura com o `tailwind.config.*` da raiz. O resultado indica `tailwind: 3` e identifica o `configFile` e os arquivos lidos. Rode a consulta em projetos de confiança, pois ela executa o módulo de configuração. Em caso de falha ao carregá-lo, o aviso acompanha os tokens extraídos só do CSS.

## Contraste no tema próprio do site

No tema claro da Promovaweb, o texto corrido atingiu 9,19:1 sobre o fundo da página. Os títulos chegaram a 19,22:1 e o texto de destaque a 7,03:1. O botão secundário ficou em 1,76:1. Para encontrar essa diferença, você precisa medir a combinação que aparece no botão, além da usada no corpo do texto.

```bash
designfy theme check
```

Nos projetos com escala própria, `theme check` usa o modo `custom`. Declare cada combinação em `theme.pairs` no `designfy.json`. A configuração abaixo mede o texto corrido sobre a página e exige uma razão maior para o destaque.

```json
{
  "theme": {
    "pairs": [
      { "fg": "--text-body", "bg": "--bg-page", "label": "Texto corrido" },
      { "fg": "primary-950", "bg": "white", "label": "Destaque", "min": 7 }
    ]
  }
}
```

Em `fg` e `bg`, você pode indicar uma variável CSS com o prefixo `--` ou uma cor do Tailwind pelo nome. O `label` identifica o uso na saída. A razão mínima em `min` vai de 1 a 21 e vale 4,5 por padrão. O comando repete a medida no escuro quando há uma declaração escura ou mudança de valor em pelo menos um dos tokens.

```text
Theme check passed.

Mode: custom

project uses its own color scales; shadcn roles not checked

  light --text-body on --bg-page (Texto corrido)  7.73:1 pass (min 4.5:1)
  light primary-950 on white (Destaque)           18.53:1 pass (min 7:1)
  dark --text-body on --bg-page (Texto corrido)   16.86:1 pass (min 4.5:1)
```

Na saída de exemplo, o destaque atingiu 18,53:1 para um mínimo de 7:1. Sem pares explícitos, a busca tenta `--text-body`, `--text-heading` e `--accent-text` sobre `--bg-page`, além de `--foreground` sobre `--background`. Isso explica por que vale cadastrar os botões pelo uso. No site, os textos dos botões de IA Makers (4,43:1) e do Plano Founders (4,30:1) ficaram perto de 4,5:1. Os de Creators (3,19:1) e DevOps (3,06:1) também ficaram abaixo.

## O tema shadcn no Tailwind 4

Em um projeto com Tailwind 4, os componentes do registro leem os papéis do shadcn. Uma classe como `bg-primary` consulta a cor de ação definida no tema. Para instalar os tokens junto com os estilos de movimento, copie os dois itens para o projeto.

```bash
designfy components add designfy-theme designfy-motion
```

Os arquivos ficam em `paths.styles`. No CSS de entrada, importe os estilos nesta ordem. O próprio `designfy-theme.css` já importa `tailwindcss`.

```css
@import "./designfy-theme.css";
@import "tw-animate-css";
@import "./designfy-motion.css";
```

O bloco `@theme inline` associa as variáveis às utilidades. Assim, um cartão pode usar `text-foreground` no título e `text-muted-foreground` na legenda. Os papéis abaixo identificam qual parte do tema consultar para cada ajuste.

| Grupo | Papéis |
| --- | --- |
| Superfície e texto | `background`, `foreground`, `card`, `popover`, `muted`, `muted-foreground` |
| Marca e ação | `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground` |
| Estado | `destructive`, `success`, `warning`, `info`, cada um com o `-foreground` |
| Linha e foco | `border`, `input`, `ring` |
| Séries de gráficos | `chart-1` a `chart-5` |
| Shell | `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring` |
| Forma, tipo e movimento | `radius`, `df-font-sans`, `df-font-heading`, `duration-*`, `ease-*` |

A mesma ligação atende à forma e à tipografia, por exemplo em `rounded-lg`, `font-heading` e `font-sans`. Para a superfície e a borda, use `bg-background` e `border-border`. Uma cor fixa como `bg-indigo-500` ou `text-[#123]` continuaria igual ao trocar a paleta.

O tema declara `@custom-variant dark (&:where(.dark, .dark *))`. Com a classe `dark` no `html`, os valores de `.dark` substituem os de base. Confira a superfície `muted` e o anel de foco `ring` nos dois modos. Um papel sem substituição escura conserva o valor de base. Reserve `dark:` no componente para alterações como a troca de imagem.

### Os pares medidos por theme check

O modo `shadcn` verifica os papéis obrigatórios do registro e mede pares conhecidos nos dois modos de cor. Observe `muted-foreground` no relatório completo. A legenda precisa funcionar tanto sobre `muted` quanto sobre o fundo da página.

```text
Theme check passed.

  light foreground on background               16.89:1 pass
  light primary-foreground on primary          6.27:1 pass
  light muted-foreground on muted              5.92:1 pass
  light muted-foreground on background         6.46:1 pass
  light card-foreground on card                17.61:1 pass
  light accent-foreground on accent            10.46:1 pass
  light destructive-foreground on destructive  5.13:1 pass
  dark foreground on background                16.61:1 pass
  dark primary-foreground on primary           10.59:1 pass
  dark muted-foreground on muted               6.48:1 pass
  dark muted-foreground on background          7.78:1 pass
  dark card-foreground on card                 15.29:1 pass
  dark accent-foreground on accent              8.94:1 pass
  dark destructive-foreground on destructive    6.59:1 pass
```

Nesse tema, os catorze pares ultrapassam 4,5:1. O relatório identifica pares opcionais sem token e pula a medida correspondente. Quando um par medido fica abaixo do mínimo, o comando retorna o código 10 e identifica os dois papéis envolvidos.

```text
error Theme check failed. light primary-foreground on primary (2.26:1). [10 CHECK_FAILED]
```

A mensagem situa a falha no texto da ação principal no modo claro. Antes de alterar a cor, confirme a entrada usada para a medição. Quando os estilos estão divididos, indique o arquivo que importa as partes.

```bash
designfy theme check --file src/styles/app.css
```

Sem `--file`, vale a ordem de busca do `theme show`. Um token de movimento ausente pode indicar que falta instalar `designfy-motion.css` ou importá-lo na entrada. Após o ajuste, confira se o build resolve os imports e repita a medição até obter o código 0.

## Da cor da marca às escalas do tema

Para escolher acentos a partir da marca, consulte a roda com a cor entre aspas. Ela aceita hex curto ou longo (`#RGB` ou `#RRGGBB`) e também `oklch(L C H)`.

```bash
designfy palette wheel "#2AD5BE"
```

Cada linha mostra uma harmonia em hex e OKLCH. Na linha `analogous`, os dois matizes ficam próximos da base. A linha `complementary` mostra a cor do lado oposto da roda.

```text
  Base                 #2ad5be oklch(0.78624324 0.13467707 180.88504461)
  complementary        #ff93b4 oklch(0.78624324 0.13426665 0.88504461)
  analogous            #73d28c oklch(0.78624324 0.13467707 150.88504461), #11d0ea oklch(0.78624324 0.13467707 210.88504461)
  triadic              #c7a5ff oklch(0.78624324 0.12900255 300.88504461), #f7a458 oklch(0.78624324 0.13467707 60.88504461)
  split-complementary  #eb98e1 oklch(0.78624324 0.13467707 330.88504461), #ff9a88 oklch(0.78624324 0.12475465 30.88504461)
  tetradic             #6cc3ff oklch(0.78624324 0.12019084 240.88504461), #ff93b4 oklch(0.78624324 0.13426665 0.88504461), #f7a458 oklch(0.78624324 0.13467707 60.88504461)
  monochromatic        #00453c oklch(0.35 0.06313226 180.88504461), #a3cfc6 oklch(0.82 0.04713697 180.88504461)
```

Para distinguir três papéis de peso semelhante, você pode gerar as escalas da tríade. Para variações discretas de uma mesma cor, consulte `monochromatic`. A harmonia define quais matizes entram na paleta. O contraste do texto ainda depende do tom escolhido para cada superfície.

```bash
designfy palette generate --base "#2AD5BE" --harmony triadic --format css
```

O gerador monta a escala `primary` de 50 a 950. A escala `neutral` conserva o matiz da base com pouco croma. Nos neutros das superfícies, o croma em torno de 0,004 a 0,02 dá uma leve tonalidade até aos extremos claros e escuros. A opção `--harmony` acrescenta as escalas de acento. Este trecho mostra os papéis semânticos gerados com o contraste conferido.

```css
:root {
  --background: oklch(0.985 0.00216 180.88504461);
  --foreground: oklch(0.2 0.0045 180.88504461);
  --card: oklch(0.955 0.00468 180.88504461);
  --muted: oklch(0.9 0.00774 180.88504461);
  --border: oklch(0.475 0.0144 180.88504461);
  --primary: oklch(0.475 0.08567937 180.88504461);
  --primary-foreground: oklch(0.985 0.00216 180.88504461);
  --accent: oklch(0.9 0.0554711 300.88504461);
  --ring: oklch(0.475 0.10320204 300.88504461);
}

.dark {
  --background: oklch(0.2 0.0045 180.88504461);
  --foreground: oklch(0.985 0.00216 180.88504461);
  --primary: oklch(0.655 0.11814727 180.88504461);
}
```

No formato `css`, que é o padrão, a saída inclui `@theme inline`. Para obter só o bloco `@theme`, selecione `--format tailwind`. O formato `json` serve para processamento por script. Use `--out <file>` para gravar a saída. Ao incorporá-la, substitua as cores em `:root` e `.dark` e preserve os tokens de tipografia, forma, layout e movimento.

## Medir a cor de um botão antes de editar o CSS

Com duas cores conhecidas, você pode medir um par isolado. Informe primeiro a cor do texto e depois a do fundo. A ordem também determina a polaridade na leitura APCA.

```bash
designfy palette contrast "#00161E" "#C6F4ED"
```

O resultado distingue texto normal de texto grande e de componentes de interface. Na coluna AA, os mínimos são 4,5:1 para texto normal e 3:1 para as outras duas aplicações.

```text
  Foreground    #00161e
  Background    #c6f4ed
  WCAG ratio    15.50:1
  APCA          Lc 93.0
  Normal text   AA pass, AAA pass
  Large text    AA pass, AAA pass
  UI component  AA pass, AAA N/A
```

Aqui a razão WCAG chega a 15,50:1. O valor APCA aparece separadamente como `Lc 93.0`, com sinal. Por padrão, a consulta retorna código 0 mesmo para um par de baixo contraste. Para que a CI detecte uma razão abaixo de 7:1, inclua o mínimo no comando.

```bash
designfy palette contrast "#00161E" "#C6F4ED" --min 7
```

Esse par supera o limite. Com `--min`, uma combinação abaixo do valor escolhido retorna código 10, o que permite interromper o job antes de incorporar as novas cores.
