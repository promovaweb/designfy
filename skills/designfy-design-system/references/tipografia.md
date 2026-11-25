# Tipografia

Duas famílias resolvem um projeto: uma para títulos (`font-heading`) e uma
para texto e interface (`font-sans`). A mono (`font-mono`) entra para
código e número medido.

## Escolher as famílias

- **Uma família só** funciona em sistema de operação e em documentação:
  menos peso de download e interface uniforme.
- **Par de título e texto** dá personalidade a site e a página de venda. O
  título pode ser geométrico, serifado ou condensado; o texto é uma sans de
  boa leitura em 16 px.
- Pares testados em [assets/pares-tipograficos.md](../assets/pares-tipograficos.md).
- Sirva a fonte do projeto, em variável: `@fontsource-variable/<fonte>`,
  ou os arquivos da marca em `woff2` com `font-display: swap`. Não
  dependa de CDN de terceiros.
- Carregue só os pesos usados. Três pesos em uso no máximo, somando título
  e texto (por exemplo 400, 500 e 700).

## Escala

O corpo é 16 px (`text-base`) e nunca menos em texto corrido. A escala de
títulos é fluida e está nos tokens:

| Papel | Classe | Tamanho | Altura de linha | Uso |
| --- | --- | --- | --- | --- |
| display | `text-display` | 40 a 72 px | 1.05 | `h1` de hero |
| headline | `text-headline` | 30 a 48 px | 1.1 | `h1` de página interna, `h2` de seção em site |
| title | `text-title` | 20 a 24 px | 1.25 | título de cartão, `h3` |
| lead | `text-lead` | 17 a 20 px | 1.6 | parágrafo de abertura |
| corpo | `text-base` | 16 px | 1.5 a 1.65 | texto |
| pequeno | `text-sm` | 14 px | 1.45 | rótulo, legenda, célula de tabela, meta |
| mínimo | `text-xs` | 12 px | 1.4 | só texto funcional curto (selo, carimbo de data) |

Em sistema, a escala desce um degrau: `h1` da tela em `text-2xl` ou
`text-3xl`, títulos de região em `text-lg`, corpo em `text-sm` nas tabelas
e `text-base` nos formulários.

Ajuste a escala à fonte: família larga pede `--text-display` menor (até
64 px); condensada aguenta maior.

## Detalhes que fazem a diferença

| Detalhe | Regra |
| --- | --- |
| espaçamento entre letras | títulos grandes com -0.02 a -0.03em; texto corrido sem ajuste; rótulo pequeno sem ajuste e sem caixa alta |
| medida | 45 a 75 caracteres por linha em texto corrido (`df-measure`); títulos com `max-w-[16ch]` a `[28ch]` |
| quebra | `text-wrap: balance` nos títulos e `pretty` nos parágrafos (já no tema) |
| números | `tabular-nums` em tabela, preço, contador e relógio |
| aspas e reticências | aspas curvas e `…`; espaço fixo entre número e unidade |
| itálico | para ênfase e título de obra; nunca uma palavra em itálico dentro de um título para "dar estilo" |
| caixa alta | não use em rótulo, menu, selo ou cabeçalho de tabela; reserve para sigla e marca |
| peso | hierarquia por tamanho e peso, com dois ou três pesos; cor de texto secundário em `muted-foreground` |
| alinhamento | à esquerda; centralizado só em bloco curto (hero central, chamada final); justificado nunca |

## Hierarquia de títulos

- Um `h1` por tela, com o nome da página.
- Seções em `h2`, itens dentro delas em `h3`. Sem saltar nível.
- O nível é semântico; o tamanho vem da classe. Um `h2` pode ser pequeno
  num painel de sistema.
- Não coloque um rótulo pequeno acima do título para anunciar a seção. O
  título diz o assunto nas duas primeiras palavras.

## Texto longo

Para artigo e documentação, use o componente `prose` do registro, que
aplica `@tailwindcss/typography` com os papéis do tema: medida de 68
caracteres, altura de linha de 1.7, espaço antes de título maior que
depois, listas, citações, tabelas e código já acertados. A especialista é a
`designfy-content`.

## Fontes no build

```css
@import "@fontsource-variable/inter";
@import "@fontsource-variable/manrope";
```

```css
:root {
  --df-font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --df-font-heading: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;
}
```

Pré-carregue só a fonte do título do hero quando ela participa da maior
pintura da página. Declare um substituto do mesmo desenho (sans por
`system-ui`, serifada por `Georgia`) para a troca não deslocar o layout.

## Conferir

- Título do hero cabe em três linhas no celular e em duas no desktop.
- Nenhum botão ou item de menu quebra linha entre 320 e 1920 px.
- Texto corrido com 16 px ou mais; nenhum texto abaixo de 12 px.
- Parágrafo longo com no máximo 75 caracteres por linha em 1440 px.
- Tabelas e preços com números alinhados.
