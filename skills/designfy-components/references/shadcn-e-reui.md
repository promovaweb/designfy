# shadcn e ReUI

O shadcn não é uma biblioteca instalada: é um conjunto de componentes
copiados para o projeto por um CLI, sobre primitivos acessíveis (Radix UI
ou Base UI) e Tailwind. O ReUI é um registro compatível, com primitivos e
blocos a mais. O Designfy usa os dois como camada de primitivos.

## Configurar

```bash
npx shadcn@latest init
```

Cria `components.json`. Campos que importam:

```json
{
  "tailwind": { "css": "src/styles/global.css", "cssVariables": true },
  "aliases": { "components": "@/components", "ui": "@/components/ui", "utils": "@/lib/utils" },
  "registries": {
    "@reui": "https://reui.io/r/{style}/{name}.json"
  }
}
```

- `tailwind.css` aponta o CSS de entrada que importa o arquivo de tokens do
  Designfy. `cssVariables: true` faz os componentes usarem os papéis.
- `registries` declara registros adicionais por prefixo. Com `@reui`
  declarado, `npx shadcn@latest add @reui/data-grid` funciona.
- O `init` pode escrever blocos `:root` e `.dark` no CSS. Se o tema do
  Designfy já está lá, mantenha um bloco só: os valores do Designfy e os
  papéis extras (`success`, `warning`, `info`).

Confira a documentação atual antes de afirmar uma opção do CLI:
`npx shadcn@latest --help` e <https://ui.shadcn.com/docs>.

## Adicionar

```bash
npx shadcn@latest add button input label field select dialog sheet dropdown-menu
npx shadcn@latest add table tabs accordion breadcrumb pagination skeleton sonner
npx shadcn@latest add sidebar command chart calendar
npx shadcn@latest add @reui/data-grid
```

Os arquivos vão para `src/components/ui`. Eles são do projeto, mas trate
como base: variação nova entra por `cva` no próprio arquivo; cor nova entra
no tema.

## Primitivos e o que cada um resolve

| Primitivo | Resolve | Atenção |
| --- | --- | --- |
| `button` | variações e tamanhos por `cva`, `asChild` para link | um `default` (primário) por região |
| `field`, `input`, `label`, `textarea` | campo com rótulo, ajuda e erro ligados | use `field` para a estrutura; erro com `aria-invalid` |
| `select`, `combobox` (popover mais command) | escolha em lista curta e longa | acima de sete opções, combobox com busca |
| `dialog`, `alert-dialog` | foco preso, Escape, retorno do foco | `alert-dialog` para confirmação destrutiva |
| `sheet`, `drawer` | painel lateral e folha inferior | `drawer` (Vaul) no toque |
| `dropdown-menu`, `context-menu` | menus com teclado | ações da linha de tabela |
| `tabs` | abas com setas | mantenha a aba na URL quando representa lugar |
| `accordion`, `collapsible` | abrir e fechar | um aberto por vez em perguntas |
| `table` | marcação e estilo de tabela | o comportamento vem do TanStack Table |
| `sidebar` | shell de sistema recolhível | papéis `sidebar-*` no tema |
| `command` | paleta de comandos | atalho visível na interface |
| `chart` | gráficos sobre Recharts com papéis `chart-*` | resumo em texto e alternativa em tabela |
| `sonner` | avisos curtos | sucesso visível não precisa de aviso |
| `skeleton`, `progress`, `spinner` | carregamento | esqueleto com a forma do conteúdo |
| `tooltip` | nome de botão de ícone | abre no foco também |

## Radix UI e Base UI

O shadcn oferece as duas bases. Um projeto usa uma só. O `components.json`
do projeto diz qual; não misture. A skill oficial `migrate-radix-to-base`
do shadcn conduz a troca quando a pessoa pedir.

## ReUI

- Registro: `@reui`, declarado em `components.json`.
- Itens gratuitos: os primitivos próprios (por exemplo `data-grid`, sobre
  TanStack Table e TanStack Virtual) e os exemplos básicos.
- Blocos pagos pedem licença; não instale nem copie bloco pago sem a
  pessoa confirmar que tem a licença.
- Tudo usa os mesmos papéis de tema do shadcn, então segue o tema do
  Designfy sem ajuste.

## Servidor MCP do shadcn

```bash
designfy mcp setup shadcn
```

Grava a entrada `npx shadcn@latest mcp` nos clientes do projeto. Com ele, o
agente consulta e instala itens de qualquer registro declarado em
`components.json`, inclusive o `@reui`. Depois de gravar, o cliente precisa
ser reiniciado.

## Skill oficial do shadcn

`designfy skills install shadcn` instala a skill oficial (`shadcn/ui`), que
conhece o CLI, os registros e os componentes na versão atual. Use-a para
perguntas de sintaxe do CLI e de API de componente; a escolha do que usar
em cada tela continua com esta skill e com o catálogo de interface.

## Em Astro

Os componentes do shadcn são React. Num site Astro:

- instale `@astrojs/react` (`designfy deps install astro`);
- use o componente dentro de uma ilha com a diretiva certa
  ([astro.md](astro.md));
- para conteúdo estático (botão que é link, cartão, selo), prefira a
  versão `.astro` do registro do Designfy, que não envia JavaScript.
