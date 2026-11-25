# Marca Designfy

O Designfy é o framework visual da Promovaweb. Reúne um design system,
componentes React e Astro com Tailwind CSS, shadcn e Motion, skills e uma CLI.

## Conceito visual

O ícone mostra um quadro de interface com cabeçalho e barra lateral. Um
componente âmbar deixa um rastro de movimento dentro do quadro. O quadro
representa a interface, o bloco representa o componente e o rastro
representa o movimento. A placa petróleo e o contorno menta ligam o ícone à
família visual da Promovaweb.

## Arquivos oficiais

| Arquivo | Uso |
| --- | --- |
| `logo/icon.svg` | ícone principal com placa petróleo |
| `logo/icon-light.svg` | ícone transparente sobre fundo claro |
| `logo/icon-dark.svg` | ícone transparente sobre fundo escuro |
| `logo/logo-light.svg` | assinatura horizontal sobre fundo claro |
| `logo/logo-dark.svg` | assinatura horizontal sobre fundo escuro |
| `logo/icon.png` | fallback raster de 512 × 512 px |
| `logo/icon-light.png`, `logo/icon-dark.png` | fallbacks raster de 512 × 512 px |
| `logo/logo-light.png`, `logo/logo-dark.png` | fallbacks raster de 1300 × 339 px |
| `logo/icon-16w.png` a `logo/icon-512w.png` | favicons e ícones de aplicativo de 16, 32, 48, 180, 192 e 512 px |

Escolha a variante pelo fundo de aplicação. Preserve 12,5% de área livre ao
redor do ativo. Use no mínimo 16 px para o favicon, 24 px para os demais usos
do ícone e 140 px para a assinatura. O nome na assinatura usa Manrope 750
convertida em curvas e dispensa a instalação da fonte.

## Sistema digital

- `colors/palette.json` contém as escalas e os tokens semânticos dos dois temas.
- `colors/README.md` documenta o papel de cada cor.
- `tokens.json` fornece os tokens para outras ferramentas.
- `global.css` carrega as fontes e aplica as variáveis CSS por tema.
- `tailwind-theme.js` estende a paleta do Tailwind CSS.
- `accessibility.md` registra os contrastes medidos.
- `typography/README.md` descreve a hierarquia tipográfica.
- `fonts/` reúne Manrope e Inter latinas com suas licenças OFL.
- `manifest.json` registra as dimensões, a função e o SHA-256 de cada ativo.
- `style-guide.html` mostra o logo e a paleta no navegador.

Para recompilar os tokens após editar a paleta, rode o gerador do
[Brandfy](https://github.com/promovaweb/brandfy) a partir de `brand/`.

```bash
node <brandfy>/skills/brandfy-design-tokens/scripts/generate-tokens.mjs \
  --input colors/palette.json --output .
```

No tema Tailwind gerado, preserve os tons da família `accent` com
`DEFAULT: "var(--color-accent)"`. Isso mantém `text-accent` ligado ao tema e
`bg-accent-500` ligado ao âmbar da marca. O gerador também reescreve
`accessibility.md`. Atualize as medições do logo ao mudar suas cores.

## Regras para agentes

1. Use os ativos desta pasta e preserve suas proporções.
2. Use petróleo na placa, menta nos traços sobre a placa e âmbar no componente e no rastro.
3. Use traços petróleo na variante clara e menta na variante escura. O componente e o rastro mantêm o âmbar nas duas.
4. Use tokens semânticos para texto e controles. Identifique estados também por texto ou ícone.
5. Preserve as cores e as formas dos ativos. Evite filtros, gradientes, sombras e rotações.
