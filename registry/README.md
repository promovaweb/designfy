# Registro de componentes

Cada arquivo `registry/<framework>/items/*.json` contém um array de itens.
O gerador lê os fragmentos por nome de arquivo e os itens de cada
fragmento por `name`. Ele gera os dois manifestos `registry.json` no formato
shadcn e incorpora os arquivos de origem em `src/generated/registry.ts`.

1. Crie um fragmento em `items/` ou acrescente o item ao fragmento da
   sua área. Use um `name` único no registro e siga as [convenções](CONVENTIONS.md).
2. Declare o arquivo de origem em `files[].path` e o destino em
   `files[].target`. Use `shared/` para novos arquivos usados pelos dois
   frameworks. Para CSS, use `meta.targetRoot: "styles"`.
3. Informe os pacotes npm em `dependencies` ou `devDependencies` e os outros
   itens em `registryDependencies`. Use o nome do item local ou os prefixos
   `shadcn:` e `reui:`. Vincule componentes ao catálogo por `meta.catalog`.
4. Rode `bun run registry:embed` para gerar as três saídas.
   Rode `bun run registry:check` para validar os fragmentos e conferir
   se as saídas estão atualizadas. Edite os fragmentos e os arquivos de origem.

Importe `designfy-theme.css` no CSS de entrada para carregar Tailwind 4 e
os tokens. Importe `designfy-motion.css` e `designfy-backgrounds.css` depois
do tema quando usar movimento e fundos.
