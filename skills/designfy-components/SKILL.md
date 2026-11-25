---
name: designfy-components
description: Especialista em componentes do Designfy para React e Astro com Tailwind 4, shadcn e ReUI. Escolhe os fragmentos no catálogo de interface, decide a fonte (registro do Designfy, shadcn, ReUI ou componente próprio), copia e instala, compõe com o tema do projeto, cobre todos os estados e cria componentes novos nas convenções do registro. Use quando a pessoa pedir um componente, uma seção, um botão, cartão, tabela, formulário, menu, diálogo, quando for instalar shadcn ou ReUI, componentizar uma tela, padronizar componentes, sugerir bibliotecas, ou quando a skill designfy chamar esta etapa.
---

# Componentes

Um componente do Designfy é uma peça que lê o tema, traz os seus estados,
se move com função e recebe o conteúdo por propriedades. Esta skill escolhe
a peça certa para cada região da tela, traz a implementação de onde ela
está pronta e escreve o que falta nas mesmas regras.

## De onde vem cada peça

| Fonte | O que traz | Como instala |
| --- | --- | --- |
| registro do Designfy | composições de site, conteúdo e sistema, com movimento | `designfy components add <item>` |
| shadcn/ui | primitivos acessíveis: botão, campo, diálogo, menu, tabela, abas | `npx shadcn@latest add <item>` |
| ReUI | primitivos e blocos avançados no registro `@reui`: grade de dados, filtros, kanban | `npx shadcn@latest add @reui/<item>` |
| próprio | o que só este projeto tem | escrito em `paths.components`, nas convenções desta skill |

Os quatro usam o mesmo tema: papéis do shadcn sobre o Tailwind 4.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Escolher o fragmento para uma região | [references/catalogo-de-interface.md](references/catalogo-de-interface.md) |
| Escolher a fonte da implementação e instalar | [references/fontes-e-instalacao.md](references/fontes-e-instalacao.md) |
| Itens do registro do Designfy e como compor | [references/registro-designfy.md](references/registro-designfy.md) |
| shadcn e ReUI: configuração, registros, primitivos e MCP | [references/shadcn-e-reui.md](references/shadcn-e-reui.md) |
| Quando extrair, como desenhar propriedades e variações | [references/componentizacao.md](references/componentizacao.md) |
| Os estados de um componente | [references/estados.md](references/estados.md) |
| Tailwind 4 em componentes | [references/tailwind.md](references/tailwind.md) |
| React: cliente e servidor, composição, tipos | [references/react.md](references/react.md) |
| Astro: componentes, ilhas e scripts | [references/astro.md](references/astro.md) |
| Bibliotecas sugeridas por necessidade | [references/bibliotecas.md](references/bibliotecas.md) |
| Conferir um componente antes de entregar | [references/checklist.md](references/checklist.md) |

Modelos em `assets/`: [componente-react.tsx](assets/componente-react.tsx),
[Componente.astro](assets/Componente.astro) e
[variantes-cva.ts](assets/variantes-cva.ts).

## Regras

1. **Catálogo antes de código.** Para cada região, leia a entrada do
   catálogo: `useWhen` precisa valer, `avoidWhen` não. A anatomia, os
   estados e o comportamento por largura da entrada são o mínimo que a
   implementação cobre.
2. **Reaproveite antes de criar.** Ordem de busca: componente que o projeto
   já tem, registro do Designfy, shadcn, ReUI. Só então escreva um novo.
3. **Tema e mais nada.** Cores, fontes, raios e sombras pelos papéis do
   tema. Nenhuma cor literal, classe de paleta fixa, cor arbitrária ou
   `font-family`. Sem `dark:` para cor.
4. **Conteúdo por propriedade.** Nenhum texto com cara de real dentro do
   componente. Região opcional sem conteúdo não rende nada.
5. **Todos os estados.** Padrão, hover, foco visível, ativo, desativado,
   carregando e os estados de dado (vazio, erro, selecionado) que a entrada
   do catálogo lista.
6. **Movimento com função.** Use as utilidades de `designfy-motion.css`
   primeiro; `motion/react` quando o CSS não resolve. Só `transform` e
   `opacity`. Versão parada em movimento reduzido. Detalhes com a
   `designfy-motion`.
7. **HTML semântico e alvo de toque.** Elemento nativo certo, 44 px de
   área de toque no celular, foco visível preservado.
8. **Arquivo copiado pertence ao projeto.** Depois de `components add`, o
   arquivo pode ser editado. Não rode `--overwrite` sem pedido.
9. **Sem biblioteca nova por reflexo.** Dependência entra pelo catálogo
   (`designfy deps list`) ou com motivo registrado no viewspec.
10. **Uma biblioteca de ícones, uma de animação, uma de formulário** por
    projeto.
11. **Componente novo que se repete entra no guia**, em `## Componentes`.

## Passos

### 1. Ler a tela

Abra o viewspec da tela: `## Estrutura` lista as regiões e os fragmentos,
`## Estados` e `## Responsivo` dizem o que cada um precisa cobrir. Leia
`## Componentes` do guia para saber o que o projeto já adotou.

### 2. Resolver a fonte de cada fragmento

```bash
designfy catalog show <id> --json          # sources: designfy:, shadcn:, reui:, custom
designfy components list --json            # o que o registro tem para o framework
designfy components show <item> --source   # arquivos e código
```

Siga [references/fontes-e-instalacao.md](references/fontes-e-instalacao.md).

### 3. Instalar

```bash
designfy components add hero-split feature-grid cta-band
designfy deps check
npx shadcn@latest add button card dialog
```

Leia a saída de `components add`: arquivos gravados, pulados, pacotes npm
que faltam e itens `shadcn:` a instalar. Resolva tudo antes de importar.

### 4. Compor

Monte a tela com os componentes na ordem de `## Estrutura`, passando o
conteúdo real por propriedades e slots. Ajuste variações pelas
propriedades; não edite cor nem espaçamento dentro do componente para uma
tela só.

### 5. Completar os estados

Para cada componente com dado ou interação, implemente os estados de
[references/estados.md](references/estados.md) que o viewspec lista.

### 6. Criar o que falta

Com [references/componentizacao.md](references/componentizacao.md) e os
modelos de `assets/`. Um componente novo nasce com cabeçalho de
documentação, propriedades tipadas, estados, movimento e versão parada.

### 7. Conferir

[references/checklist.md](references/checklist.md), `designfy deps check`,
build do projeto e a região renderizando com o conteúdo real. Marque os
itens no viewspec.

## Marcos

- Fonte resolvida para cada fragmento da tela.
- Itens copiados e instalados, dependências presentes.
- Tela composta com conteúdo real.
- Estados implementados.
- Componentes novos documentados e registrados no guia.

## Saída

Para cada fragmento: a fonte, o arquivo no projeto e as propriedades
usadas. Depois: pacotes instalados, itens do shadcn e do ReUI adicionados,
componentes novos criados, estados cobertos e o que ficou para outra
especialista (movimento fino, ajustes de celular, acessibilidade).
