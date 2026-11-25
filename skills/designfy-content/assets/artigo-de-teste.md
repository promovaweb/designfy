---
title: Artigo de teste de diagramação
description: Texto de amostra com todos os elementos de um artigo, para conferir a diagramação antes de publicar conteúdo real.
pubDate: 2026-01-15
author: exemplo
category: amostra
draft: true
---

Este parágrafo de abertura é de amostra. Ele serve para medir a linha: conte
os caracteres de uma linha cheia no desktop e confira se o total fica entre
sessenta e setenta e cinco. No celular, a linha fica mais curta e o tamanho
do texto continua o mesmo.

O segundo parágrafo traz **um termo em negrito**, *um trecho em itálico*, um
`comando em linha` e um [link com texto que diz o destino](https://example.com/guia).
Também traz um número com unidade, como 12 MB, e uma tecla: <kbd>Ctrl</kbd> + <kbd>K</kbd>.

## Título de seção com tamanho médio

Texto logo depois do título, para conferir que o espaço acima do título é
maior que o de baixo. O título precisa parecer do bloco que ele abre.

### Subtítulo dentro da seção

Uma lista com marcadores:

- primeiro item, curto;
- segundo item, um pouco mais longo, para ver a quebra de linha com o recuo
  alinhado ao texto e não ao marcador;
- terceiro item.

Uma lista numerada:

1. Abra o terminal.
2. Rode o comando de instalação.
3. Confira a versão.

## Citação e aviso

> Uma citação de amostra, com duas linhas, para conferir a linha lateral, o
> tamanho do texto e a atribuição logo abaixo.
>
> Pessoa de Exemplo, *Obra de Exemplo*

Depois da citação, um parágrafo normal antes do aviso.

:::note
Este é um aviso de amostra do tipo nota. O tipo precisa aparecer em texto,
não só na cor.
:::

## Código

Um bloco curto:

```bash
npm install pacote-de-exemplo
```

Um bloco com linha longa, que precisa rolar dentro da caixa sem quebrar:

```ts
export function exemploDeFuncaoComNomeLongo(parametroUm: string, parametroDois: number, parametroTres: boolean): Promise<Array<Record<string, unknown>>> {
  return Promise.resolve([]);
}
```

## Tabela

Uma tabela estreita, que cabe no celular:

| Plano | Preço | Projetos |
| --- | ---: | ---: |
| Amostra A | R$ 10,00 | 1 |
| Amostra B | R$ 20,00 | 5 |

Uma tabela larga, que precisa rolar dentro da própria caixa:

| Opção | Tipo | Padrão | Descrição | Desde | Observação |
| --- | --- | --- | --- | --- | --- |
| `--saida` | texto | `./dist` | Pasta de saída do build de amostra | 1.0 | Aceita caminho relativo e absoluto |
| `--formato` | lista | `esm` | Formatos gerados, separados por vírgula | 1.2 | Valores de amostra: `esm`, `cjs` |
| `--silencioso` | booleano | `false` | Oculta as mensagens de progresso | 1.0 | Erros continuam aparecendo |

## Imagem e vídeo

![Retângulo de amostra representando uma fotografia](https://example.com/amostra.jpg)

Uma legenda de amostra fica logo abaixo da imagem, em texto menor.

O vídeo abaixo precisa aparecer como capa com botão, sem carregar o player
antes do clique.

<!-- Em MDX: <VideoEmbed provider="youtube" id="ID_DE_AMOSTRA" title="Vídeo de amostra" /> -->

---

## Fim

Depois da linha divisória, um parágrafo final curto. Abaixo dele entram a
autoria, os relacionados e a ação final da página.
