# Publicação de versões

O Designfy distribui cinco executáveis pela GitHub Release pública. O pacote
`@promovaweb/designfy` instala o executável da mesma versão a partir desses
anexos. O download público dispensa token e confere o SHA-256 antes de gravar
o arquivo em cache.

## Preparar a versão

Na `main`, registre as mudanças da versão e escreva a seção
`## [X.Y.Z] - AAAA-MM-DD` no `CHANGELOG.md` com a data local de hoje.
Faça commit das mudanças de implementação antes de iniciar o fluxo. Troque
`X.Y.Z` pela nova versão nos comandos.

```bash
bun run release X.Y.Z --dry-run
bun run release X.Y.Z
```

O primeiro comando exibe o plano. O segundo confere a branch, a árvore de
trabalho, a tag local e o changelog. Aceita mudanças apenas nos arquivos da
versão, incluindo os artefatos gerados. Atualiza os dois manifestos e
`ebook/VERSION`, regenera o README do npm, o OpenCLI, as referências das skills
e o ebook. Depois executa `bun run validate`. Uma falha interrompe o fluxo
antes do commit e da tag. Corrija a causa e repita o comando.

Para gerar o guia, instale `pandoc`, `weasyprint`, `unzip`, `xmllint`,
`magick`, `fc-match`, `pdftohtml` e `pdftoppm`. O build verifica os arquivos
e mantém as cinco edições mais recentes.

Após a validação, o script cria o commit e a tag anotada. Para enviar a
`main` e a tag na mesma execução, acrescente `--push` ao comando de release.
Quando a tag já foi criada localmente, envie o par diretamente.

```bash
git push --atomic origin HEAD:main vX.Y.Z
```

## Conferir e publicar

1. Acompanhe o workflow Release com `gh run watch`. A tag deve coincidir com
   as versões do manifesto da raiz e do pacote npm.
2. Confira os anexos com `gh release view vX.Y.Z -R promovaweb/designfy`.
   Devem constar os executáveis para Linux x64 e arm64, macOS x64 e arm64,
   Windows x64 e o arquivo `SHA256SUMS`.
3. Na pasta `npm/`, confira que `npm whoami` retorna `contatopromovaweb` e
   publique o pacote.

   ```bash
   cd npm
   npm whoami
   npm publish --access public
   ```

4. Confira a instalação com `npx @promovaweb/designfy@X.Y.Z --version`.
   Atualize o gitlink do submódulo no Hub conforme `RELEASES.md`.

Correções após uma tag publicada recebem uma versão nova. Consulte os
[comandos de build local](docs/release.md).
