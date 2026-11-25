# Capítulo 5: Tema e paleta

O `designfy theme check` responde com catorze pares medidos e a frase
`Theme check passed.`:

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

Nenhum componente do registro carrega cor. Todos leem os papéis do tema, e o
tema mora num arquivo CSS. Este capítulo mostra como ler esse arquivo, gerar a
paleta e conferir o contraste antes de a tela existir.

## O arquivo de tokens

O Designfy usa o tema do Tailwind 4 no formato do shadcn. Um arquivo CSS com
`@import "tailwindcss"`, um bloco `@theme inline` que liga as variáveis aos
nomes do Tailwind e os blocos `:root` e `.dark` com os valores.

Para criar o arquivo completo no projeto:

```bash
designfy components add designfy-theme designfy-motion
```

O comando grava `designfy-theme.css` e `designfy-motion.css` em
`paths.styles`. Ligue os dois no CSS de entrada, nesta ordem:

```css
@import "./designfy-theme.css";
@import "tw-animate-css";
@import "./designfy-motion.css";
```

O `designfy-theme.css` já traz `@import "tailwindcss"`. Os papéis seguem os
nomes do shadcn e cobrem superfície, texto, marca, estado, linha, foco, série de
dados e shell:

| Grupo | Papéis |
| --- | --- |
| Superfície e texto | `background`, `foreground`, `card`, `popover`, `muted`, `muted-foreground` |
| Marca e ação | `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground` |
| Estado | `destructive`, `success`, `warning`, `info`, cada um com o `-foreground` |
| Linha e foco | `border`, `input`, `ring` |
| Dados | `chart-1` a `chart-5` |
| Shell | `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring` |
| Forma, tipo e movimento | `radius`, `df-font-sans`, `df-font-heading`, `duration-*`, `ease-*` |

Nenhum componente usa `bg-indigo-500` nem `text-[#123]`. O código usa
`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`,
`border-border`, `font-heading`, `font-sans` e `rounded-lg`. A utilidade lê o
papel, e a troca de tema muda a tela inteira num lugar só.

## Ler o tema do projeto

```bash
designfy theme show
```

O comando procura o CSS com `@import "tailwindcss"` em `paths.styles`,
`src/styles`, `src/app`, `src/index.css` ou `app/globals.css`, segue os imports
locais e extrai `@theme`, `@theme inline`, `:root` e `.dark`. A resposta começa
pelo arquivo lido e agrupa os tokens:

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

Cada cor aparece em dois formatos quando o valor é uma variável: a declaração
(`var(--background)`) e o valor resolvido em hex para claro e escuro. Use
`--group` para ver um assunto só, e `--file` para escolher outro CSS:

```bash
designfy theme show --group colors
designfy theme show --group motion
designfy theme show --file src/styles/app.css
```

Os grupos são `colors`, `fonts`, `text`, `radius`, `spacing`, `shadows`,
`breakpoints` e `motion`. Sem CSS do Tailwind no projeto, o comando para com
exit code 6 e a dica:

```text
error No Tailwind stylesheet found. Run "designfy components add designfy-theme". [6 NOT_FOUND]
```

## Conferir contraste

```bash
designfy theme check
```

O comando mede os pares conhecidos nos dois temas: `foreground` em
`background`, `primary-foreground` em `primary`, `muted-foreground` em `muted` e
em `background`, `card-foreground` em `card`, `accent-foreground` em `accent` e
`destructive-foreground` em `destructive`. Também confere se os papéis que o
registro usa existem no arquivo.

Um par abaixo de 4.5 reprova o comando com exit code 10:

```text
error Theme check failed. light primary-foreground on primary (2.26:1). [10 CHECK_FAILED]
```

Pares opcionais com token ausente são pulados e aparecem no resultado. O
`--file` escolhe o CSS. Quando o tema está dividido em vários arquivos, aponte
para o CSS de entrada que importa todos, porque o comando segue os imports
locais:

```bash
designfy theme check --file src/styles/app.css
```

Sem o `--file`, o comando usa o arquivo que encontrar primeiro. Se ele acusar
um token de movimento ausente, falta o `designfy-motion.css` no projeto ou no
CSS de entrada.

## A roda de cores

```bash
designfy palette wheel "#2AD5BE"
```

A resposta traz a base e uma linha por harmonia, com hex e OKLCH:

```text
  Base                 #2ad5be oklch(0.78624324 0.13467707 180.88504461)
  complementary        #ff93b4 oklch(0.78624324 0.13426665 0.88504461)
  analogous            #73d28c oklch(0.78624324 0.13467707 150.88504461), #11d0ea oklch(0.78624324 0.13467707 210.88504461)
  triadic              #c7a5ff oklch(0.78624324 0.12900255 300.88504461), #f7a458 oklch(0.78624324 0.13467707 60.88504461)
  split-complementary  #eb98e1 oklch(0.78624324 0.13467707 330.88504461), #ff9a88 oklch(0.78624324 0.12475465 30.88504461)
  tetradic             #6cc3ff oklch(0.78624324 0.12019084 240.88504461), #ff93b4 oklch(0.78624324 0.13426665 0.88504461), #f7a458 oklch(0.78624324 0.13467707 60.88504461)
  monochromatic        #00453c oklch(0.35 0.06313226 180.88504461), #a3cfc6 oklch(0.82 0.04713697 180.88504461)
```

As harmonias são `complementary`, `analogous`, `triadic`,
`split-complementary`, `tetradic` e `monochromatic`. Escolha pelo tipo de
produto: complementar para contraste entre ação e destaque, análoga para um
conjunto calmo, tríade para três papéis com a mesma força, monocromática para
uma interface discreta.

## Gerar a paleta

```bash
designfy palette generate --base "#2AD5BE" --harmony triadic --format css
```

O comando monta a escala `50` a `950` em OKLCH para `primary`, uma escala
`neutral` com o matiz da base e croma baixo e, com `--harmony`, as escalas de
acento. Também gera os tokens semânticos claros e escuros com o contraste
conferido:

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

`--format` aceita `css` (padrão), `json` e `tailwind`. O `css` imprime
variáveis no formato do shadcn com `@theme inline`; o `tailwind` imprime só o
bloco `@theme`; o `json` devolve o objeto para um script. `--out <file>` grava
no arquivo. Substitua os blocos `:root` e `.dark` do arquivo de tokens pelos
papéis gerados e mantenha os tokens de tipo, forma, layout e movimento.

Cores entram como hex (`#RGB`, `#RRGGBB`) ou `oklch(L C H)`. Use aspas no shell.

## Medir um par

```bash
designfy palette contrast "#00161E" "#C6F4ED"
```

```text
  Foreground    #00161e
  Background    #c6f4ed
  WCAG ratio    15.50:1
  APCA          Lc 93.0
  Normal text   AA pass, AAA pass
  Large text    AA pass, AAA pass
  UI component  AA pass, AAA N/A
```

O veredito separa texto normal (4.5:1), texto grande (3:1) e elemento de
interface (3:1). O APCA aparece como Lc com sinal para quem usa a métrica mais
nova. O comando sai com 0 sempre; `--min <ratio>` faz sair com 10 abaixo do
valor escolhido, o que serve para uma conferência em CI:

```bash
designfy palette contrast "#00161E" "#C6F4ED" --min 7
```

## Claro e escuro

Cada papel tem valor próprio no claro e no escuro. O escuro não é uma inversão
automática: o `primary` muda de luminosidade, o `muted` ganha outra superfície
e o `ring` acompanha o acento. Por isso um papel sem valor no `.dark` aparece
como ausente na leitura do tema.

O arquivo de tema declara `@custom-variant dark (&:where(.dark, .dark *))` e
cada papel muda sozinho quando a classe `dark` entra no `html`. Componente não
usa `dark:` para cor. O `dark:` fica só para diferença que não é de cor, como a
troca de uma imagem.

Neutros levam um pouco do matiz da base, com croma entre 0.004 e 0.02. Cinza
puro, preto absoluto e branco absoluto ficam fora das superfícies.

## Conferir

- O CSS de entrada importa o tema e o movimento, e o build resolve os dois.
- `designfy theme show --group colors` mostra claro e escuro para cada papel.
- `designfy theme check` termina com exit code 0 nos dois temas.
- `designfy palette wheel` lista as seis harmonias para a cor da marca.
- `designfy palette contrast` aprova os pares que você usa em texto e botão.
