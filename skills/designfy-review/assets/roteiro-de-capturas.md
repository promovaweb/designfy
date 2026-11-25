# Modelo: roteiro de capturas

Troque `{url}` e `{slug}`. Rode na raiz do projeto, com o servidor de
prévia no ar.

## Uma página

```bash
# 1. página inteira, quatro larguras
designfy capture run {url} --viewport mobile,tablet,desktop,wide --name {slug}-r1

# 2. primeira dobra, inclusive o mínimo e o notebook
designfy capture run {url} --viewport 320x640,mobile,1280x800,desktop --fold --name {slug}-r1-dobra

# 3. tema escuro
designfy capture run {url} --viewport mobile,desktop --theme dark --name {slug}-r1-escuro

# 4. movimento reduzido
designfy capture run {url} --viewport mobile,desktop --reduced-motion --name {slug}-r1-parado
```

## Estados de tela de sistema

```bash
designfy capture run "{url}?estado=carregando" "{url}?estado=vazio" "{url}?estado=erro" \
  --viewport mobile,desktop --name {slug}-r1-estados
```

O parâmetro é do projeto, só em desenvolvimento. Sem ele, capture os
estados numa rota de exemplo.

## Componentes de perto

```bash
designfy capture run {url} --selector "header" --viewport mobile,desktop --name {slug}-r1-cabecalho
designfy capture run {url} --selector "[data-region=tabela]" --viewport mobile --name {slug}-r1-tabela
```

## Várias páginas

```bash
designfy capture run {url-1} {url-2} {url-3} --viewport mobile,desktop --name {projeto}-r1
```

## Redesenho

```bash
designfy capture run {url} --viewport mobile,tablet,desktop,wide --name {slug}-antes
# ... trabalho ...
designfy capture run {url} --viewport mobile,tablet,desktop,wide --name {slug}-depois
```

## Depois de cada execução

```bash
designfy capture list
```

Abra `.designfy/captures/{execução}/manifest.json` e confira `overflowX`,
`consoleErrors` e `pageErrors` antes das imagens.

## Rodadas seguintes

Repita os comandos com `-r2` e `-r3` no nome. Capture todas as larguras a
cada rodada, mesmo que a correção tenha sido numa só.

## No viewspec

Ao fechar, registre a execução final:

```yaml
captures: [{slug}-r2, {slug}-r2-escuro, {slug}-r2-parado]
```
