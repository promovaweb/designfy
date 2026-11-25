# Capítulo 2: Preparar o projeto

O `init` roda na raiz de um projeto Astro e grava um arquivo pequeno:

```text
Wrote /tmp/opencode/designfy-demo/designfy.json (astro).
```

A partir desse arquivo, o binário sabe qual framework ler, onde copiar
componentes, onde procurar o CSS do tema e qual alias usar nos imports. O
`status` mostra a mesma detecção em forma de painel, com o que já está
instalado e o que falta. Sem esses dois comandos, cada comando seguinte
adivinharia caminhos e o agente repetiria a mesma leitura a cada pedido.

## Rodar o init

```bash
designfy init
```

O `init` lê o `package.json` e detecta:

| O que | Como |
| --- | --- |
| Framework | `astro`, `next`, `react-vite`, `react` ou `unknown` |
| Tailwind | a versão maior de `tailwindcss`, ou `null` |
| shadcn | a presença de `components.json` |
| Gerenciador | o lockfile, na ordem `bun.lock`, `bun.lockb`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`; sem lockfile, `npm` |
| TypeScript | o `tsconfig.json` ou a dependência `typescript` |

O arquivo gravado tem os campos abaixo.

| Campo | Valor no exemplo |
| --- | --- |
| `schemaVersion` | `1` |
| `framework` | `astro` |
| `typescript` | `false` |
| `packageManager` | `npm` |
| `tailwind` | `4` |
| `shadcn` | `false` |
| `paths.components` | `src/components/designfy` |
| `paths.styles` | `src/styles` |
| `paths.viewspec` | `viewspec` |
| `aliases.components` | `@/components/designfy` |

O `designfy.json` do projeto de exemplo fica assim:

```json
{
  "framework": "astro",
  "typescript": false,
  "packageManager": "npm",
  "tailwind": 4,
  "shadcn": false,
  "schemaVersion": 1,
  "paths": {
    "components": "src/components/designfy",
    "styles": "src/styles",
    "viewspec": "viewspec"
  },
  "aliases": {
    "components": "@/components/designfy"
  }
}
```

Três options corrigem a detecção ou o destino:

```bash
designfy init --framework next --components-path src/ui --styles-path app/styles
```

O `--dry-run` imprime a proposta sem gravar. Um `designfy.json` existente faz o
comando parar com exit code 2:

```text
error designfy.json already exists. Use --force to overwrite it. [2 USAGE]
Use "designfy init --help".
```

Use `--force` só quando quiser substituir o arquivo inteiro. Sem `package.json`
na pasta, a resposta é `error No package.json found in the current directory.
[6 NOT_FOUND]`. Rode o comando na raiz do site ou da aplicação, não numa pasta
interna.

Depois do primeiro `init`, edite o `designfy.json` à mão quando o projeto mudar
de pasta de componentes ou de alias. O arquivo é a fonte dos caminhos para o
`components add`, para o `theme show` e para o `viewspec`.

## Ler o estado

```bash
designfy status
```

A saída do projeto de exemplo:

```text
  Framework             astro
  Detected framework    astro
  TypeScript            no
  Package manager       npm
  Tailwind major        4
  shadcn                no
  Skills installed      1
  Dependencies present  3
  Components copied     0
  Viewspecs             0
    draft               0
    in_progress         0
    blocked             0
    done                0
    archived            0
  Next viewspec ID      0001
  Viewspec guide        not found
  Tailwind theme        not found
```

O painel separa a detecção atual (`Detected framework`) da configuração em
vigor, que vem do `designfy.json`. Quando os dois divergem, o arquivo vale.
`Skills installed` conta as skills do catálogo já instaladas no projeto ou no
escopo global. `Components copied` conta os arquivos do registro que já estão
na pasta do projeto. `Viewspec guide` diz se o `VIEWSPEC.md` da raiz existe. `Tailwind theme` mostra
`not found` até o tema ser copiado; depois do `components add designfy-theme`,
ela aponta o CSS de entrada.

O `status --json` entrega o mesmo conteúdo em `data`, com os objetos `detected`
e `project` completos. Um agente usa essa forma para não reler o
`designfy.json`:

```bash
designfy status --json
```

O `status` não grava nada e não precisa de rede. Rode depois de cada
instalação para confirmar o efeito.

## Bibliotecas sugeridas

O catálogo de dependências agrupa os pacotes por assunto. Cada grupo tem um
identificador, um título e a lista de pacotes com a faixa de versão, o motivo e
a URL oficial.

```bash
designfy deps list
```

Cada linha traz o grupo, o pacote, a faixa do catálogo, o estado no
`package.json` e a versão instalada. Uma linha aprovada do exemplo é
`core / tailwindcss  ^4.3.5  ok  ^4.3.5`. Os estados são `ok`, `missing` e
`outdated`. `outdated` aparece quando a versão
instalada é de uma versão maior anterior. O `--group <id>` restringe a lista:

```bash
designfy deps list --group motion
```

Os grupos desta versão são:

| Grupo | Assunto | Padrão |
| --- | --- | --- |
| `core` | Tailwind 4, `cn`, variantes e ícones | sim |
| `vite` | plugin do Tailwind para Astro e React com Vite | sim |
| `motion` | [Motion](https://motion.dev) para React e vanilla | sim |
| `typography` | classes de prosa e as fontes Inter e Manrope | sim |
| `shadcn` | o CLI do [shadcn](https://ui.shadcn.com) e as primitivas Radix | sim |
| `base-ui` | primitivas do Base UI, alternativa ao Radix | não |
| `astro` | ilhas React e MDX dentro do Astro | sim |
| `forms` | estado de formulário, validação e campos especiais | não |
| `tables` | tabelas com ordenação, filtro e virtualização | não |
| `charts` | gráficos e contadores animados | não |
| `feedback` | toasts, paleta de comandos e drawers | não |
| `media` | embeds de vídeo e carrossel | não |
| `astro-embed` | componentes de embed para Astro e MDX | não |
| `content` | destaque de código e renderização de Markdown | não |
| `state` | estado de URL, estado de servidor e painéis | não |
| `scroll` | rolagem suave para páginas longas | não |
| `color` | conversão de cor no código do projeto | não |
| `testing` | Playwright e auditoria de acessibilidade | não |

## Conferir o que falta

```bash
designfy deps check
```

O `deps check` compara o `package.json` com os grupos padrão compatíveis com o
framework e com os pacotes exigidos pelos componentes já copiados. Quando falta
algo, a saída resume a lista e termina com exit code 10:

```text
error Missing: tw-animate-css, class-variance-authority, lucide-react, @tailwindcss/vite, motion, @tailwindcss/typography, @fontsource-variable/inter, @fontsource-variable/manrope, shadcn, radix-ui, @astrojs/react, @astrojs/mdx, react, react-dom. [10 CHECK_FAILED]
```

Um `deps check` com exit code 0 significa que os grupos conferidos estão
completos. Use `--group <id>` para conferir um grupo só, e `--json` para ler
`data` num script.

## Instalar

```bash
designfy deps install
```

Sem argumentos, o comando instala o que falta nos grupos padrão compatíveis com
o framework. Com argumentos, aceita identificadores de grupo ou nomes de
pacote:

```bash
designfy deps install motion
designfy deps install tables feedback
```

O gerenciador vem do `designfy.json`, com `--pm` para forçar outro:

```bash
designfy deps install --pm bun
```

O plano aparece antes de qualquer download:

```bash
designfy deps install --dry-run
```

```text
npm install 'tw-animate-css@^1.4.0' 'class-variance-authority@^0.7.1' 'lucide-react@^1.79.0' '@tailwindcss/vite@^4.3.5' 'motion@^14.14.0' '@tailwindcss/typography@^0.5.20' '@fontsource-variable/inter@^5.3.0' '@fontsource-variable/manrope@^5.3.0' 'radix-ui@^1.8.1' '@astrojs/react@^7.1.9' '@astrojs/mdx@^8.1.6' 'react@^19.3.1' 'react-dom@^19.3.1'
npm install -D 'shadcn@^4.23.0'
```

O comando separa dependências de produção das de desenvolvimento, como mostra
a linha com `-D`. Uma falha do gerenciador sai com exit code 5 e devolve o
comando executado em `details`.

## Conferir

- `designfy.json` existe na raiz e `designfy status` mostra o framework certo.
- `designfy status --json` traz `detected` e `project` em `data`.
- `designfy deps list` mostra `ok` para os pacotes centrais que o projeto já tem.
- `designfy deps check` termina com exit code 0 ou lista exatamente o que falta.
- `designfy deps install --dry-run` imprime os comandos antes de instalar.
