# Fontes e instalação

Como escolher de onde vem a implementação de um fragmento e como trazê-la
para o projeto.

## Ordem de busca

1. **O projeto já tem?** Leia `## Componentes` do guia e a pasta de
   componentes. Reaproveite e, se faltar uma variação, acrescente por
   propriedade.
2. **Registro do Designfy** (`designfy:<item>` em `sources`): composições
   prontas para o tema, com movimento e estados.
3. **shadcn** (`shadcn:<item>`): primitivos. Quase toda composição do
   Designfy em React se apoia neles.
4. **ReUI** (`reui:<item>`): quando o primitivo do shadcn é pouco (grade de
   dados com colunas fixas, filtros compostos, kanban, árvore).
5. **Próprio** (`custom`): quando nada cobre a função.

## Qual fonte para quê

| Preciso de | Fonte | Item |
| --- | --- | --- |
| botão, campo, rótulo, seleção, caixa, alternador | shadcn | `button`, `input`, `label`, `select`, `checkbox`, `switch`, `field` |
| diálogo, gaveta, menu, dica, popover | shadcn | `dialog`, `sheet`, `drawer`, `dropdown-menu`, `tooltip`, `popover` |
| abas, sanfona, trilha, paginação | shadcn | `tabs`, `accordion`, `breadcrumb`, `pagination` |
| aviso curto, alerta, esqueleto, progresso | shadcn | `sonner`, `alert`, `skeleton`, `progress` |
| barra lateral de sistema | shadcn | `sidebar` |
| paleta de comandos | shadcn | `command` |
| gráfico | shadcn | `chart` (sobre Recharts) |
| calendário e data | shadcn | `calendar`, mais `react-day-picker` |
| tabela simples | shadcn | `table` |
| tabela com ordenação, filtro, seleção, colunas fixas, virtualização | ReUI ou Designfy | `@reui/data-grid`, ou `designfy:data-table` sobre TanStack Table |
| hero, seção, grade de recursos, bento, passos, preços, perguntas, chamada final | Designfy | `hero-split`, `hero-centered`, `feature-grid`, `bento-grid`, `steps`, `pricing-table`, `faq`, `cta-band` |
| cabeçalho e rodapé de site | Designfy | `site-header`, `site-footer` |
| artigo: cabeçalho, texto, índice, mídia | Designfy | `article-header`, `prose`, `table-of-contents`, `figure`, `video-embed`, `callout`, `code-block` |
| shell, cabeçalho de página, contador, filtros, vazio, erro | Designfy | `app-shell`, `page-header`, `stat-card`, `filter-bar`, `empty-state`, `error-state` |
| revelação, contador animado, faixa rolante, fundo com padrão | Designfy | `reveal`, `counter`, `marquee`, `background` |

A lista real e atual sai de `designfy components list` e de
`designfy catalog show <id>`.

## Instalar do registro do Designfy

```bash
designfy components list --surface site
designfy components show pricing-table
designfy components add pricing-table faq --dry-run
designfy components add pricing-table faq
```

O que o comando faz:

1. resolve os itens exigidos do próprio Designfy (por exemplo `cn`,
   `designfy-theme`, `designfy-motion`, `reveal`);
2. grava cada arquivo em `paths.components` ou `paths.styles` de
   `designfy.json`;
3. troca o marcador `@designfy/components` pelo alias do projeto;
4. relata `written`, `unchanged` e `skipped`, os pacotes npm que faltam e
   os itens `shadcn:` a instalar.

Depois do comando:

```bash
designfy deps check              # o que os componentes copiados pedem
designfy deps install            # instala o que falta
npx shadcn@latest add button     # cada item shadcn: listado na saída
```

Projeto Astro recebe a versão `.astro`; projeto React, Next.js ou Vite
recebe a versão `.tsx`. Para usar a versão React numa ilha do Astro:
`designfy components add data-table --framework react`.

`skipped` quer dizer que o arquivo existe e foi alterado no projeto. Leia a
diferença com `designfy components show <item> --source` antes de pensar em
`--overwrite`.

## Instalar do shadcn

```bash
npx shadcn@latest init                 # uma vez; cria components.json
npx shadcn@latest add button card dialog
npx shadcn@latest add @reui/data-grid  # item de outro registro
```

- `components.json` aponta o CSS do tema e os aliases. Use o mesmo arquivo
  de tokens do Designfy como CSS do shadcn.
- O shadcn copia o código para `src/components/ui`. Não edite cor dentro
  desses arquivos: ajuste os papéis no tema.
- Em Astro, os primitivos do shadcn são React e rodam como ilhas. Veja
  [astro.md](astro.md).

## Componente próprio

Crie um componente novo quando as quatro condições valem:

- nenhuma fonte cobre a função, conferido no catálogo e nos registros;
- a peça aparece em mais de um lugar, ou tem estado e comportamento
  próprios;
- o conteúdo dela é do domínio do projeto (um cartão de curso, um estado de
  pedido);
- dá para descrever em uma frase o que ela faz.

Siga [componentizacao.md](componentizacao.md) e registre no guia.

## O que não fazer

- Copiar código de biblioteca paga ou de site de terceiros para dentro do
  projeto sem conferir a licença.
- Instalar uma segunda biblioteca de componentes inteira para usar um
  botão.
- Editar o arquivo copiado para pôr cor literal "só nesta tela".
- Recriar à mão um primitivo acessível que o shadcn já entrega (diálogo,
  menu, combobox): o comportamento de teclado e de foco é a parte difícil.
