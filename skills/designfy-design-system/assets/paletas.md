# Cores base por tipo de produto

Pontos de partida para projeto sem marca definida. Cada linha traz a cor
base em OKLCH, a harmonia sugerida e o comando. Leve três opções à pessoa e
gere a escolhida. Depois de gerar, rode `designfy theme check`.

| Produto | Clima | Base | Harmonia | Comando |
| --- | --- | --- | --- | --- |
| ferramenta para desenvolvedor | técnico, preciso | `oklch(0.75 0.13 185)` turquesa | `split-complementary` | `designfy palette generate --base "oklch(0.75 0.13 185)" --harmony split-complementary --format css` |
| SaaS de gestão | confiável, calmo | `oklch(0.55 0.17 255)` azul | `analogous` | `designfy palette generate --base "oklch(0.55 0.17 255)" --harmony analogous --format css` |
| financeiro e contábil | sério, estável | `oklch(0.45 0.1 160)` verde escuro | `monochromatic` | `designfy palette generate --base "oklch(0.45 0.1 160)" --harmony monochromatic --format css` |
| saúde e bem-estar | acolhedor, limpo | `oklch(0.65 0.11 170)` verde-água | `analogous` | `designfy palette generate --base "oklch(0.65 0.11 170)" --harmony analogous --format css` |
| educação e cursos | próximo, enérgico | `oklch(0.6 0.19 290)` violeta | `split-complementary` | `designfy palette generate --base "oklch(0.6 0.19 290)" --harmony split-complementary --format css` |
| loja e varejo | vivo, direto | `oklch(0.65 0.2 30)` vermelho-alaranjado | `complementary` | `designfy palette generate --base "oklch(0.65 0.2 30)" --harmony complementary --format css` |
| alimentação | quente, apetitoso | `oklch(0.7 0.16 60)` laranja | `analogous` | `designfy palette generate --base "oklch(0.7 0.16 60)" --harmony analogous --format css` |
| criativo e agência | ousado | `oklch(0.62 0.24 340)` magenta | `triadic` | `designfy palette generate --base "oklch(0.62 0.24 340)" --harmony triadic --format css` |
| institucional e jurídico | sóbrio | `oklch(0.4 0.07 250)` azul-ardósia | `monochromatic` | `designfy palette generate --base "oklch(0.4 0.07 250)" --harmony monochromatic --format css` |
| sustentabilidade e campo | natural | `oklch(0.55 0.13 140)` verde folha | `split-complementary` | `designfy palette generate --base "oklch(0.55 0.13 140)" --harmony split-complementary --format css` |
| dados e analytics | analítico, com muitas séries | `oklch(0.58 0.15 240)` azul | `tetradic` | `designfy palette generate --base "oklch(0.58 0.15 240)" --harmony tetradic --format css` |
| luxo e serviço premium | contido | `oklch(0.3 0.03 80)` grafite quente | `monochromatic` com acento âmbar à mão | `designfy palette generate --base "oklch(0.3 0.03 80)" --harmony monochromatic --format css` |

## Como apresentar as opções

```text
Três caminhos de cor para {produto}:

a) {nome} (recomendada): base {cor}, harmonia {tipo}. Passa {clima}.
b) {nome}: base {cor}, harmonia {tipo}. Passa {clima}.
c) {nome}: base {cor}, harmonia {tipo}. Passa {clima}.

Você também pode me passar uma cor da marca em hex.
```

A cor da marca, quando existe, vale mais que esta tabela.
