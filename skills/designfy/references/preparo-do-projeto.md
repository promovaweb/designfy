# Preparo do projeto

O que fazer quando o projeto ainda não tem o Designfy. Execute os comandos
pelo agente; não entregue a lista para a pessoa rodar.

## 1. Detectar

```bash
designfy init --dry-run --json
```

A resposta traz `framework` (`astro`, `next`, `react-vite`, `react` ou
`unknown`), `typescript`, `packageManager`, `tailwind` e `shadcn`. Com
`unknown`, o projeto não é Astro nem React: pare e diga à pessoa que o
Designfy cobre esses dois.

## 2. Gravar a configuração

```bash
designfy init
```

Grava `designfy.json` na raiz. Ajuste com `--components-path`,
`--styles-path` e `--framework` quando a detecção errar. Padrões:
componentes em `src/components/designfy`, estilos em `src/styles`, viewspecs
em `viewspec`, alias `@/components/designfy`.

## 3. Dependências

```bash
designfy deps check --json      # o que falta nos grupos padrão
designfy deps install           # instala o que falta
```

Os grupos padrão cobrem Tailwind 4, utilitários de classe, Motion,
tipografia e, em projeto React ou Astro com ilhas, o shadcn. Os grupos
opcionais entram quando a tela pedir: `forms`, `tables`, `charts`,
`feedback`, `media`, `content`, `state`, `testing`. Instale por nome:
`designfy deps install tables charts`.

Projeto sem Tailwind 4: a instalação traz o pacote, mas a ligação com o
build é da especialista de tema. Passe para a `designfy-design-system`.

## 4. Tema

```bash
designfy theme show --json
```

- Sai com 6: não há CSS com `@import "tailwindcss"`. Chame a
  `designfy-design-system` para criar o arquivo de tokens. Ela usa
  `designfy palette generate` e `designfy components add designfy-theme`.
- Devolve o tema: rode `designfy theme check`. Com saída 10, a mesma
  especialista corrige os pares de contraste e os papéis que faltam.

## 5. shadcn

Projeto React ou Astro com ilhas React sem `components.json`:

```bash
npx shadcn@latest init
```

O Designfy não substitui o shadcn: os primitivos (botão, diálogo, tabela,
campo) vêm dele, e o registro do Designfy traz as composições. Para usar o
ReUI, acrescente o registro ao `components.json`:

```json
{
  "registries": {
    "@reui": "https://reui.io/r/{style}/{name}.json"
  }
}
```

Depois disso, `npx shadcn@latest add @reui/data-grid` instala itens de lá.

## 6. Skills

```bash
designfy skills list --json
designfy skills install            # as marcadas como padrão para o framework
designfy skills install --all      # todas, internas e externas
```

As internas são as 11 `designfy*`. As externas padrão são `hallmark` e
`shadcn`. Em projeto Astro, ofereça a biblioteca `astrofy`; em projeto sem
marca definida, a `brandfy`.

## 7. Servidores MCP

```bash
designfy mcp servers --json
designfy mcp setup                 # designfy e shadcn nos clientes do projeto
designfy mcp setup playwright      # opcional: navegador dirigido pelo agente
```

A gravação preserva o que já existe em `.mcp.json`, `.codex/config.toml`,
`opencode.json`, `.cursor/mcp.json` e `.gemini/settings.json`. O cliente
precisa ser reiniciado para carregar a entrada nova: avise a pessoa.

## 8. Guia

Com o tema lido, chame a `designfy-viewspec` no modo guia para criar o
`VIEWSPEC.md` da raiz. Sem ele, nenhuma tela começa.

## 9. Conferir

```bash
designfy status
designfy doctor
```

`status` precisa mostrar o framework, o tema encontrado, o guia presente e
zero dependências padrão faltando.

## O que o preparo não faz

- Não cria commit nem altera a configuração de build sem a especialista de
  tema.
- Não instala navegador do Playwright sozinho: `npx playwright install
  chromium` é um download grande e roda quando a primeira captura for
  pedida.
- Não apaga componentes que o projeto já tem. Componente existente entra em
  `## Componentes` do guia como `próprio`.
