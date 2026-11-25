# Publicação de versões

A versão do Designfy sai em duas partes: a tag no Git e a GitHub Release privada
com os binários. Não há publicação no npm por enquanto. A versão vem do
`package.json`, que o binário lê em tempo de build, e o histórico fica no
`CHANGELOG.md`. A edição do guia em `ebook/` acompanha a versão.

A tag `vX.Y.Z` dispara o workflow `.github/workflows/release.yml`. Ele instala
as dependências e os pacotes nativos do OpenTUI de todos os alvos, roda
`bun run validate`, compila `linux-x64`, `linux-arm64`, `darwin-x64`,
`darwin-arm64` e `windows-x64`, gera o `SHA256SUMS` e publica a GitHub Release
com as notas extraídas do changelog. O workflow não publica no npm.

## Passo a passo

Os exemplos usam `X.Y.Z` para a versão nova.

1. Confira que a `main` local está limpa e igual à remota:

   ```bash
   git status --short
   git fetch origin && git status -sb
   ```

2. Avance a versão em `package.json`. Ela é a fonte do `--version`, do `about`,
   do MCP e do OpenCLI, e precisa ser a mesma da tag. Confira:

   ```bash
   jq -r .version package.json
   ```

3. Escreva a seção `## [X.Y.Z] - AAAA-MM-DD` no topo do `CHANGELOG.md`, no
   formato Keep a Changelog. O workflow extrai as notas pelo título exato
   `## [X.Y.Z]`, então não mude o formato do cabeçalho.

4. Atualize a edição do guia. `ebook/VERSION` acompanha o `package.json` e o
   guia é reconstruído quando `docs/user/` mudou:

   ```bash
   bun run ebook
   bun run ebook:verify
   ```

   A geração exige `pandoc`, `weasyprint`, `unzip`, `xmllint`, `magick`,
   `fc-match` e `pdftohtml` instalados na máquina. O `build.json` registra a
   versão, o hash das fontes e os hashes do PDF e do EPUB.

5. Valide:

   ```bash
   bun run validate
   ```

   O `validate` roda `typecheck`, `bun test`, `skills:check`,
   `skills:sync:check`, `skills:lint`, `registry:check`, `backgrounds:check`,
   `opencli:check`, `docs:check` e `build`.

6. Faça o commit, crie a tag e envie os dois juntos. A tag é nova e não é movida
   depois:

   ```bash
   git add -A
   git commit -m "release: designfy vX.Y.Z"
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push --atomic origin HEAD:main vX.Y.Z
   ```

7. Acompanhe o workflow:

   ```bash
   gh run watch
   ```

8. Confira a release:

   ```bash
   gh release view vX.Y.Z -R promovaweb/designfy
   ```

   A release precisa ter os cinco binários e o `SHA256SUMS`. Quem baixa o
   executável depende desses anexos.

9. Atualize o gitlink do submódulo no Hub, conforme a ordem de `RELEASES.md`:
   primeiro a release do sub-repositório, depois o ponteiro, a versão, o
   changelog, a tag e a release do Hub.

## Conferência

```bash
gh release view vX.Y.Z -R promovaweb/designfy
./dist/designfy --version
```

O build local confere a identidade antes da tag:

```bash
bun run build
./dist/designfy --version
```

Uma tag publicada não é movida nem reutilizada. Correção posterior recebe uma
versão nova. Se a criação da release falhar, a publicação fica pendente até que a
release exista e seja conferida.

O build local e o detalhe dos alvos estão em [docs/release.md](docs/release.md).
