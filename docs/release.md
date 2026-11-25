# Release

A distribuição usa uma GitHub Release pública e o pacote npm
`@promovaweb/designfy`. O launcher procura o executável no cache da versão.
No primeiro uso, baixa o binário da plataforma e confere o `SHA256SUMS`.

| Comando | Efeito |
| --- | --- |
| `bun run release X.Y.Z --dry-run` | Mostra as etapas da preparação e publicação. |
| `bun run release X.Y.Z` | Atualiza a versão, regenera os arquivos, valida, cria o commit e a tag local. |
| `bun run release X.Y.Z --push` | Executa a preparação e envia a main e a nova tag em um push atômico. |
| `bun run npm:readme` | Gera o README do pacote a partir do README da raiz. |

O changelog precisa conter a seção da versão com a data de hoje. A publicação
no npm ocorre após a conferência dos cinco anexos executáveis e do arquivo de
checksums. O procedimento com a conta `contatopromovaweb` está no
[guia de publicação](../RELEASING.md).

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
