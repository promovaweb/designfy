# Fieldnote em React

A página monta as versões React do lote de componentes de site. O conteúdo de exemplo e as ilustrações vêm do [exemplo Astro](../astro-site/).

```sh
bun install
bun run designfy:sync
bun run build
bun run preview
```

Use `bun run capture --theme dark` em outro terminal para capturar a página em 390 e 1440 px. O script inline em [index.html](index.html) aplica a preferência de tema antes da primeira pintura. O componente raiz inicia a observação de movimento após a montagem.

O CSS de entrada aponta `@source` para a pasta ignorada onde o CLI instala os componentes. Isso inclui os utilitários do registro no build do Tailwind.
