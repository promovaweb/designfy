# Tema que já existe

Projetos com interface pronta raramente usam os papéis do shadcn. Têm
escalas próprias (`primary-50` a `primary-950`, `neutral-*`), variáveis
semânticas da casa (`--bg-page`, `--text-body`, `--accent-text`), às vezes
Tailwind 3 com `tailwind.config.*`, às vezes tokens gerados por outra
ferramenta. Esta referência diz como trabalhar com eles sem trocar o tema.

## Ler

```bash
designfy theme show --json
designfy theme check --json
```

- **Versão e arquivos.** `theme show` informa `tailwind: 3` ou `4`, o CSS
  lido, o arquivo de entrada quando o tema chega por `@import` e, no
  Tailwind 3, o `tailwind.config.*`. Valores como
  `rgb(var(--primary-500) / <alpha-value>)` aparecem resolvidos em hex.
- **Arquivo certo.** A escolha segue `paths.theme` do `designfy.json`,
  depois o `tokensFile` do guia, depois a busca, que prefere `global.css`,
  `app.css` e parecidos e deixa por último o CSS de áreas isoladas
  (`docs-`, `admin-`). Se o arquivo escolhido for de uma área isolada,
  grave o certo com `designfy init --theme-path <css>`.

## Medir com os pares da casa

Sem os papéis do shadcn, `theme check` entra no modo `custom`. Ele mede os
pares declarados em `theme.pairs` no `designfy.json`, ou, sem eles, os pares
semânticos comuns que encontrar (`--text-body` e `--text-heading` sobre
`--bg-page`, por exemplo). Pares de texto não bastam: declare também os
botões, o acento e os textos sobre superfícies tingidas.

```json
{
  "theme": {
    "pairs": [
      { "fg": "--text-body", "bg": "--bg-page", "label": "corpo" },
      { "fg": "--accent-text", "bg": "--bg-page", "label": "link" },
      { "fg": "white", "bg": "primary-950", "label": "botão principal" },
      { "fg": "white", "bg": "primary-500", "label": "botão de acento", "min": 3 }
    ]
  }
}
```

`min` padrão é 4.5; use 3 só para texto grande, ícone e borda. Par que
reprova é registrado no guia, em `## Faça e não faça`, como débito, até a
correção.

## Componente do registro num tema da casa

Os itens do registro usam os papéis do shadcn. Num tema com escala própria:

| Projeto | Caminho |
| --- | --- |
| Tailwind 4, escala própria | mapeie os papéis no `@theme inline` de um CSS importado depois do tema (`--color-background: var(--bg-page)`, `--color-primary: var(--color-primary-800)`) e copie os itens sem mexer neles |
| Tailwind 3 | `components add` recusa por padrão; use o item como referência de estrutura, estados e movimento e escreva a peça no padrão do projeto |
| Tokens do Astrofy (`.astrofy/design/design-system.json`) | nomeie os tokens semânticos com os papéis do shadcn no JSON, ou mapeie no `@theme inline` de um CSS autoral; o CSS gerado por `astrofy tokens build` não é editado à mão |

## O que não fazer

- Trocar a escala da casa pelos papéis do shadcn sem pedido da pessoa.
- Editar o CSS gerado por outra ferramenta.
- Dar o tema por conferido só com os pares de texto.
