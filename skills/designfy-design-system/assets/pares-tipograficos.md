# Pares tipográficos

Famílias abertas, disponíveis em versão variável no Fontsource. A coluna
"Título" vai em `--df-font-heading` e "Texto" em `--df-font-sans`.

| Clima | Título | Texto | Pacotes |
| --- | --- | --- | --- |
| padrão do Designfy: técnico e amigável | Manrope | Inter | `@fontsource-variable/manrope`, `@fontsource-variable/inter` |
| neutro, uma família só | Inter | Inter | `@fontsource-variable/inter` |
| geométrico e atual | Geist | Geist | `@fontsource-variable/geist` |
| editorial com serifa | Fraunces | Inter | `@fontsource-variable/fraunces`, `@fontsource-variable/inter` |
| editorial clássico | Source Serif 4 | Source Sans 3 | `@fontsource-variable/source-serif-4`, `@fontsource-variable/source-sans-3` |
| humanista e acolhedor | Nunito Sans | Nunito Sans | `@fontsource-variable/nunito-sans` |
| forte e condensado para venda | Archivo (largura condensada) | Inter | `@fontsource-variable/archivo`, `@fontsource-variable/inter` |
| elegante e contido | Instrument Serif | Instrument Sans | `@fontsource/instrument-serif`, `@fontsource-variable/instrument-sans` |
| técnico com mono nos números | Space Grotesk | Inter | `@fontsource-variable/space-grotesk`, `@fontsource-variable/inter` |
| sistema denso | IBM Plex Sans | IBM Plex Sans | `@fontsource/ibm-plex-sans` (pesos 400, 500, 600) |

Mono para código e número medido: JetBrains Mono
(`@fontsource-variable/jetbrains-mono`) ou a mono do sistema.

Confira o nome do pacote antes de instalar: `npm view <pacote> version`.

## Aplicar

```bash
npm install @fontsource-variable/fraunces @fontsource-variable/inter
```

```css
@import "@fontsource-variable/fraunces";
@import "@fontsource-variable/inter";

:root {
  --df-font-heading: "Fraunces Variable", Georgia, serif;
  --df-font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
}
```

O nome da família é o que o pacote declara, quase sempre com o sufixo
"Variable". O substituto tem o mesmo desenho da fonte principal.

## Ajustes por família

| Família de título | Ajuste |
| --- | --- |
| serifada de alto contraste | `--text-display` até 4rem; espaçamento entre letras de -0.01em |
| condensada | `--text-display` pode subir para 5rem; altura de linha de 1 |
| larga (Space Grotesk, Archivo expandida) | `--text-display` até 4rem; títulos com `max-w-[14ch]` |
| peso leve (300) em título grande | só acima de 40 px e com contraste de 7:1 |
