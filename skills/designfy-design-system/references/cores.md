# Cores: base, roda de cores e paleta

A paleta de um projeto sai de uma cor base e de uma relação da roda de
cores. O binário faz a conta em OKLCH; esta referência ensina a escolher.

## OKLCH em três números

`oklch(L C H)`: luminosidade de 0 a 1, croma de 0 a cerca de 0.37 e matiz
em graus.

| Matiz | Cor | Matiz | Cor |
| --- | --- | --- | --- |
| 20 a 40 | vermelho | 180 a 200 | turquesa |
| 50 a 75 | laranja e âmbar | 220 a 260 | azul |
| 85 a 110 | amarelo | 270 a 300 | violeta |
| 130 a 160 | verde | 320 a 350 | magenta e rosa |

A luminosidade é perceptual: duas cores com o mesmo `L` têm o mesmo peso
visual, o que não acontece em HSL. Por isso a escala de 50 a 950 e os
pares de contraste ficam previsíveis.

## Escolher a cor base

1. A marca tem cor: use a dela (`brand/colors/palette.json`, manual, logo).
2. Sem marca: escolha pelo que o produto precisa transmitir, em
   [assets/paletas.md](../assets/paletas.md), e leve três opções à pessoa.
3. Confira a base contra branco e contra o fundo escuro:

   ```bash
   designfy palette contrast "#FFFFFF" "#2AD5BE"
   designfy palette contrast "#2AD5BE" "#0B1A1F"
   ```

   Base muito clara (como turquesa ou amarelo) não segura texto branco: o
   `primary` do tema claro usa um degrau mais escuro da mesma escala e o do
   tema escuro usa a base. O gerador já faz essa escolha.

## Roda de cores

```bash
designfy palette wheel "#2AD5BE"
```

| Harmonia | Relação | Efeito | Quando usar |
| --- | --- | --- | --- |
| `monochromatic` | um matiz, várias luminosidades | calmo, uniforme | sistemas de operação, documentação, marcas sóbrias |
| `analogous` | vizinhos, 30 graus para cada lado | harmônico, natural | sites de conteúdo, marcas com clima definido |
| `complementary` | oposto, 180 graus | contraste máximo | uma chamada forte sobre base neutra |
| `split-complementary` | os dois vizinhos do oposto | contraste com menos tensão | o padrão seguro para site e sistema: base mais um acento quente ou frio |
| `triadic` | três matizes a 120 graus | vivo, variado | produtos com categorias que precisam de cor própria, marcas jovens |
| `tetradic` | quatro matizes em dois pares | rico, difícil de equilibrar | dashboards com muitas séries; um matiz domina, os outros são sinais |

### Escolher a harmonia

- Sistema de uso diário: `monochromatic` ou `analogous`. A cor fica para o
  estado e para o dado.
- Site de produto: `split-complementary`. Base da marca e um acento para
  preço, selo e destaque.
- Página de venda expressiva: `complementary` ou `triadic`, com um matiz
  dominante e os outros como sinais.
- Gráficos: as séries `chart-1` a `chart-5` saem da harmonia, com
  luminosidade parecida entre elas, e nunca dependem só do matiz (use
  também posição, rótulo ou traço).

Proporção de uso: perto de 60% de superfícies neutras tingidas, 30% de
texto e estruturas, 10% de cor. A harmonia define os 10%.

## Gerar

```bash
designfy palette generate --base "#2AD5BE" --harmony split-complementary --format css
designfy palette generate --base "oklch(0.55 0.2 265)" --harmony analogous --format json
designfy palette generate --base "#E0457B" --format tailwind --out src/styles/escala.css
```

A saída tem:

- `scales`: `primary`, `neutral` e `accent` (e `accent-2`, `accent-3` em
  harmonias com mais matizes), cada uma de `50` a `950`;
- `semantic.light` e `semantic.dark`: os papéis do shadcn já escolhidos nos
  degraus que atingem o contraste;
- `contrast`: cada par medido.

`--format css` imprime `:root`, `.dark` e `@theme inline` prontos para o
arquivo de tokens. `--format tailwind` imprime só as escalas numeradas
(`--color-primary-50` e as demais), para quem quer usar os degraus em
gráfico ou ilustração. Mesmo com as escalas disponíveis, componente usa
papel, não degrau.

## Ajustar à mão

O gerador entrega um ponto de partida correto. Ajustes comuns:

| Quer | Mude |
| --- | --- |
| fundo mais quente ou mais frio | o matiz de `--background`, `--muted`, `--border` (mantenha o croma abaixo de 0.02) |
| acento mais discreto | reduza o croma de `--accent` e aumente a luminosidade no tema claro |
| botão principal mais forte | escureça `--primary` no tema claro em passos de 0.03 de `L` e meça de novo |
| cartão que se destaque do fundo | `--card` 0.015 a 0.03 de `L` acima de `--background` no escuro; branco tingido no claro |
| série de gráfico confundindo | afaste os matizes em pelo menos 40 graus e iguale o `L` |

Depois de qualquer ajuste: `designfy theme check`.

## O que evitar

- Gradiente de roxo para azul ou rosa e ciano sobre escuro: é a assinatura
  de página gerada.
- Preto e branco absolutos em superfície: use neutro tingido.
- Cinza sem matiz ao lado de cor: parece sujo. Tinja os neutros com o
  matiz da base.
- Vermelho e verde como único sinal de estado.
- Transparência para definir cor de texto: defina a cor; transparência
  serve para sobreposição, borda sutil e sombra.
- Cor nova a cada tela: a seção Cores do guia lista os papéis; fora deles,
  só com papel novo.
