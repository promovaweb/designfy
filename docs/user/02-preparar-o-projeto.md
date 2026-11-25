# Capítulo 2: Preparar o projeto

Na instalação do Designfy no site da Promovaweb, o framework era Astro e o Tailwind ainda estava na versão 3. O primeiro `theme show` encontrou `docs-theme.css`, uma folha usada apenas na área de documentação. O caminho do arquivo explicava por que a paleta na tela do terminal parecia tão diferente da usada nas páginas públicas.

## O CSS de um site já publicado

Na adoção de um site como o da Promovaweb, parte das instruções de interface fica na raiz do monorepo. Antes de inicializar a aplicação, leia o `AGENTS.md`, o `CLAUDE.md` e o `README.md` disponíveis nos dois locais. Procure documentos com `design`, `brand`, `ui` ou `componentes` no nome para conferir a origem das orientações que entrarão no guia.

Use `designfy theme show --json` para identificar o arquivo lido. Compare a versão do Tailwind em `designfy status --json` com a configuração do projeto e verifique no CSS como o modo escuro é ativado. No site da Promovaweb, o guia reuniu 76 orientações com suas fontes. Apontar `tokensFile` para `src/styles/brand/global.css` fez a leitura alcançar o tema das páginas públicas.

Examine os componentes existentes e abra duas ou três telas de cada tipo. Com o site local em execução, registre a aparência inicial com `designfy capture run http://localhost:4321/ --viewport mobile,desktop`. A captura dá uma referência para comparar o resultado quando uma alteração chega a componentes compartilhados.

Use a skill `designfy-viewspec` no modo guia para registrar o que encontrou. Preserve a escala própria do site, inclusive nomes como `primary-500`. Com Tailwind 4 e papéis do shadcn, a cópia do registro é direta. Para uma escala própria, adapte as classes copiadas ou mapeie os papéis em `@theme inline`. Quando uma especialista indicar algo diferente da convenção local, siga o projeto e descreva a diferença em `## Aprendizados`, citando a skill. A aplicação conserva seu fluxo de sitespec ou spec, issues, validações e commits.

## A raiz usada pelos comandos

Em um monorepo, você pode trabalhar no terminal da raiz e indicar ao Designfy qual aplicação deve examinar. A opção global curta é `-C`. A forma longa, `--project`, aceita o mesmo diretório.

```bash
designfy -C ./website status
designfy --project ../app capture run http://localhost:4321/ --viewport mobile
```

O primeiro comando consulta o site em `./website`. O segundo usa a configuração de `../app` para capturar a rota local no celular. A opção explícita prevalece sobre `DESIGNFY_PROJECT`. Na ausência das duas, vale a pasta atual. Caminhos relativos como o de `theme show --file` partem da raiz escolhida. Um diretório inexistente resulta no código 6. Pelo MCP, use o argumento `project` na chamada.

## Criação do `designfy.json`

Na raiz da aplicação, o `init` lê o manifesto e procura os arquivos que identificam a estrutura do projeto. Para ver a proposta antes de gravar, acrescente `--dry-run`. Para salvar a configuração pela primeira vez, execute o comando abaixo.

```bash
designfy init
```

O retorno identifica o destino no disco e o framework reconhecido. No projeto de demonstração, o arquivo ficou ao lado do `package.json` do Astro.

```text
Wrote /tmp/opencode/designfy-demo/designfy.json (astro).
```

Confira o framework indicado entre parênteses. Para interpretar os demais valores do arquivo, veja quais sinais o comando procura no projeto.

| O que | Como |
| --- | --- |
| Framework | `astro`, `next`, `react-vite`, `react` ou `unknown` |
| Tailwind | a versão maior de `tailwindcss`, ou `null` |
| shadcn | a presença de `components.json` |
| Gerenciador | o lockfile, na ordem `bun.lock`, `bun.lockb`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`; sem lockfile, `npm` |
| TypeScript | o `tsconfig.json` ou a dependência `typescript` |

A prioridade entre lockfiles importa quando um projeto conserva arquivos de dois gerenciadores. Confira o valor de `packageManager` antes de instalar dependências. A configuração da demonstração serve de referência para localizar cada campo.

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

Os campos com ponto na tabela representam objetos no JSON. Ao mudar o destino dos componentes, edite `components` dentro de `paths`. O alias dos imports tem sua própria entrada em `aliases`.

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

Com esse JSON, o Designfy copia as peças para `src/components/designfy` e procura as especificações em `viewspec`. Num projeto Next que já concentra os componentes em `src/ui`, você pode indicar o caminho real ao criar o arquivo para preservar os imports da aplicação.

```bash
designfy init --framework next --components-path src/ui --styles-path app/styles
```

Essa chamada propõe um projeto Next com componentes em `src/ui` e estilos em `app/styles`. Quando já existe uma configuração, uma nova tentativa de gravação encontra a proteção abaixo.

```text
error designfy.json already exists. Use --force to overwrite it. [2 USAGE]
Use "designfy init --help".
```

O código 2 preserva o arquivo existente. Para trocar apenas um caminho ou alias, edite o campo no JSON. Use `--force` para substituir a configuração inteira. O erro `No package.json found in the current directory. [6 NOT_FOUND]` indica outro problema. Nesse caso, confira a raiz apontada ao `init`.

Quando você conhece o CSS de entrada antes da instalação, indique o caminho na primeira gravação.

```bash
designfy init --theme-path src/styles/tokens.css
```

A opção registra `src/styles/tokens.css` em `paths.theme`, usado pelo `theme show` e pelo `theme check` na escolha do CSS. O capítulo 5 detalha a precedência entre os caminhos configurados e a descoberta automática.

## Leitura do projeto com `status`

Depois de gravar o JSON, consulte o projeto na mesma raiz. O comando funciona sem rede e pode ser repetido após cada instalação, pois a consulta só lê os arquivos.

```bash
designfy status
```

No projeto de demonstração, procure `astro` nas duas primeiras linhas do painel. Quando elas coincidem, o framework gravado no JSON corresponde ao que o Designfy reconhece na aplicação.

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

Compare `Framework` e `Detected framework`. O primeiro respeita o JSON mesmo quando a detecção atual diverge. Aqui há uma skill disponível no projeto ou no escopo global. Ainda não há componentes copiados nem viewspecs. O próximo identificador é `0001`.

A linha `Viewspec guide` procura o guia na raiz. Já `Tailwind theme` indica o CSS encontrado. Num projeto novo com `not found`, confira esse campo após `components add designfy-theme`. Para recuperar a configuração completa num script, consulte a mesma raiz em JSON.

```bash
designfy status --json
```

A resposta traz `detected` e `project` dentro de `data`. Assim você pode comparar o resultado da leitura com os caminhos configurados antes de iniciar a cópia de componentes.

## Leitura e cópia no Tailwind 3

No Tailwind 3, o Designfy reconhece tanto `@tailwind base` quanto `@import "tailwindcss/base"`. Ele combina o CSS com `tailwind.config.*` da raiz. A configuração pode fornecer cores aninhadas e expressões como `rgb(var(--x) / <alpha-value>)` ou `hsl(var(--x))`. A leitura também abrange fontes, raios, sombras, larguras de tela, curvas de animação e keyframes.

```bash
designfy theme show
designfy status
designfy doctor
```

Confira a versão e os arquivos de origem nessas consultas. Como a leitura executa o módulo de configuração, use-a em código de confiança. Quando o módulo falha ao carregar, um aviso acompanha o resultado parcial extraído do CSS.

Os componentes do registro usam a sintaxe do Tailwind 4. Em um projeto na versão 3, `components add` termina com código 10 e orienta a migração. Para trazer os arquivos do cabeçalho e adaptar sua estrutura ao projeto, autorize a cópia explicitamente.

```bash
designfy components add site-header --allow-tailwind3
```

O aviso acompanha a cópia porque as classes ainda precisam de adaptação. Você pode usar os estados e o movimento do cabeçalho como referência. Na instalação de dependências, selecione os grupos necessários para manter a versão atual do Tailwind. A instalação padrão inclui o grupo `core` com Tailwind 4.

## Escolha dos grupos de dependências

Consulte o catálogo antes de instalar bibliotecas. Cada pacote tem uma faixa de versão e uma finalidade dentro do grupo, com um endereço oficial para consulta.

```bash
designfy deps list
```

Na linha `core / tailwindcss  ^4.3.5  ok  ^4.3.5`, a versão declarada no projeto atende à verificação. O estado `missing` indica ausência e `outdated` identifica uma versão principal anterior. Para examinar só a biblioteca de movimento, filtre pelo identificador.

```bash
designfy deps list --group motion
```

Com esse filtro, a saída mostra se a aplicação já declara Motion. Para definir o alcance de uma instalação sem argumentos, consulte a coluna *Padrão* e confira a compatibilidade do grupo com o framework do projeto.

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
| `charts` | gráficos e números animados | não |
| `feedback` | toasts, paleta de comandos e drawers | não |
| `media` | embeds de vídeo e carrossel | não |
| `astro-embed` | componentes de embed para Astro e MDX | não |
| `content` | destaque de código e renderização de Markdown | não |
| `state` | estado de URL, estado de servidor e painéis | não |
| `scroll` | rolagem suave para páginas longas | não |
| `color` | conversão de cor no código do projeto | não |
| `testing` | Playwright e auditoria de acessibilidade | não |

Um projeto Astro pode receber as integrações React e MDX pelo grupo `astro`. Para uma tabela com filtro e ordenação, selecione `tables` explicitamente. Antes de baixar os pacotes, confira as dependências dos grupos padrão e as exigidas pelos componentes já copiados.

```bash
designfy deps check
```

O `deps check` termina com 0 quando os grupos examinados estão completos. Em um projeto incompleto, a mensagem identifica os pacotes ausentes e termina com código 10.

```text
error Missing: tw-animate-css, class-variance-authority, lucide-react, @tailwindcss/vite, motion, @tailwindcss/typography, @fontsource-variable/inter, @fontsource-variable/manrope, shadcn, radix-ui, @astrojs/react, @astrojs/mdx, react, react-dom. [10 CHECK_FAILED]
```

Na saída da demonstração, as integrações do Astro aparecem junto dos pacotes de interface. Use `--group <id>` para restringir a verificação ao trabalho atual. Com `--json`, um script pode ler o resultado em `data` nas verificações bem-sucedidas.

## Plano de instalação e gerenciador de pacotes

Para conferir quais pacotes entrariam no build do site, rode a simulação na raiz da aplicação. O terminal mostra a faixa de versão de cada biblioteca e separa as ferramentas de desenvolvimento antes de iniciar qualquer download.

```bash
designfy deps install --dry-run
```

No projeto de demonstração, o gerenciador selecionado foi o npm. A simulação produziu duas linhas.

```text
npm install 'tw-animate-css@^1.4.0' 'class-variance-authority@^0.7.1' 'lucide-react@^1.79.0' '@tailwindcss/vite@^4.3.5' 'motion@^14.14.0' '@tailwindcss/typography@^0.5.20' '@fontsource-variable/inter@^5.3.0' '@fontsource-variable/manrope@^5.3.0' 'radix-ui@^1.8.1' '@astrojs/react@^7.1.9' '@astrojs/mdx@^8.1.6' 'react@^19.3.1' 'react-dom@^19.3.1'
npm install -D 'shadcn@^4.23.0'
```

A primeira linha instala as dependências de produção. A opção `-D` da segunda reserva o CLI do shadcn para desenvolvimento. Para aplicar a instalação padrão dos grupos compatíveis, execute o comando na raiz que você acabou de conferir.

```bash
designfy deps install
```

Ao executar a instalação padrão, você recebe também os pacotes de tipografia compatíveis que faltarem no projeto. Para trabalhar apenas no movimento de uma tela, informe um grupo pelo identificador ou um pacote pelo nome.

```bash
designfy deps install motion
designfy deps install tables feedback
```

A segunda chamada instala os grupos `tables` e `feedback` juntos. Para conferir qual gerenciador vai alterar o lockfile, consulte o campo `packageManager` do `designfy.json`. A opção `--pm` permite escolher outro nessa execução.

```bash
designfy deps install --pm bun
```

Nesse caso, o Bun executa a instalação. Uma falha do gerenciador produz código 5 e o campo `details` identifica o comando executado. Após uma instalação bem-sucedida, repita a consulta de dependências para conferir os pacotes na raiz escolhida.
