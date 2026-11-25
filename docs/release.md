# Release

Toda alteração publicada sai com versão, changelog, tag e GitHub Release
privada. O passo a passo completo está em
[RELEASING.md](../RELEASING.md).

Resumo:

1. Atualize `version` em `package.json` (SemVer). O binário lê essa versão.
2. Registre a mudança em `CHANGELOG.md`, no formato Keep a Changelog, com o
   título `## [X.Y.Z] - AAAA-MM-DD`.
3. Atualize `ebook/VERSION` e rode `bun run ebook` e `bun run ebook:verify`.
4. Rode `bun run validate`.
5. Commit: `release: designfy vX.Y.Z`.
6. Tag: `git tag -a vX.Y.Z -m "vX.Y.Z"`.
7. Push da `main` e só desta tag: `git push --atomic origin HEAD:main vX.Y.Z`.
8. O workflow `release.yml` instala os pacotes nativos de todos os alvos, roda
   `bun run validate`, compila os binários para linux-x64, linux-arm64,
   darwin-x64, darwin-arm64 e windows-x64, gera o `SHA256SUMS` e publica a
   GitHub Release com as notas do changelog.
9. Confira a release em
   `https://github.com/promovaweb/designfy/releases/tag/vX.Y.Z`.
10. Atualize o gitlink do submódulo no Hub.

Não há publicação no npm por enquanto. Uma tag publicada nunca é movida.
Correção posterior recebe nova versão.

## Build local

O OpenTUI carrega um pacote nativo por plataforma. `bun run build` marca como
externos os que não estão instalados, então funciona depois de um `bun install`
comum. O build cruzado precisa dos pacotes de todos os alvos, instalados a partir
do lockfile.

```bash
bun run build          # dist/designfy para a plataforma atual
bun install --frozen-lockfile --os="*" --cpu="*" --libc="*"  # pacotes nativos de todos os alvos
bun run build:all      # dist/designfy-<plataforma> para todas
./dist/designfy --version
```
