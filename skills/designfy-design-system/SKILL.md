---
name: designfy-design-system
description: Especialista no design system do Designfy sobre o tema do Tailwind 4. Cria e ajusta o arquivo de tokens (papéis de cor no formato do shadcn, tipografia, raios, espaçamento, movimento), gera paletas pela roda de cores em OKLCH com contraste medido, define tipografia e escala, padroniza fundos com os presets do Designfy, sombras, bordas, temas e modo escuro. Use quando a pessoa pedir paleta, cores, tema, tokens, tipografia, fontes, espaçamento, fundo de seção, padrão de background, modo escuro, ou quando o projeto ainda não tiver tema do Tailwind, quando designfy theme check reprovar, ou quando a skill designfy chamar esta etapa.
---

# Design system

Esta skill cuida da base visual que todos os componentes leem: o arquivo de
tokens do tema do Tailwind. Componente nenhum guarda cor, fonte ou raio;
tudo vem dos papéis definidos aqui. Mudar a marca é mudar este arquivo.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Estrutura do arquivo de tokens, papéis e ligação com o Tailwind 4 e o shadcn | [references/tokens.md](references/tokens.md) |
| Escolher cor base, harmonia e gerar a paleta | [references/cores.md](references/cores.md) |
| Contraste: pares, medidas e correção | [references/contraste.md](references/contraste.md) |
| Famílias, escala, medida e detalhes de tipografia | [references/tipografia.md](references/tipografia.md) |
| Container, grade, espaçamento e ritmo vertical | [references/espacamento-e-layout.md](references/espacamento-e-layout.md) |
| Fundos de seção e os presets de padrão | [references/fundos.md](references/fundos.md) e [references/backgrounds/catalogo.md](references/backgrounds/catalogo.md) |
| Raios, bordas, sombras e camadas | [references/formas-e-profundidade.md](references/formas-e-profundidade.md) |
| Modo escuro e temas adicionais | [references/temas-e-modo-escuro.md](references/temas-e-modo-escuro.md) |
| Conferência antes de entregar | [references/checklist.md](references/checklist.md) |

Modelos em `assets/`: [tema-inicial.css](assets/tema-inicial.css) (o arquivo
de tokens completo), [entrada.css](assets/entrada.css) (ordem dos imports),
[paletas.md](assets/paletas.md) (cores base por tipo de produto) e
[pares-tipograficos.md](assets/pares-tipograficos.md).

## Regras

1. **Uma fonte de valores.** Cores, fontes, raios, espaçamento base e
   movimento ficam no arquivo de tokens (`tokensFile` do guia). Fora dele,
   nenhum valor literal de cor ou `font-family`.
2. **Papéis, não cores.** O código usa `bg-background`, `text-foreground`,
   `bg-primary`, `text-muted-foreground`, `border-border`. Nunca
   `bg-teal-600` nem `text-[#123]`. Classe de paleta fixa do Tailwind é
   defeito.
3. **OKLCH.** Toda cor é escrita em `oklch()`. A luminosidade perceptual
   deixa a escala e o contraste previsíveis.
4. **Formato do shadcn.** Os nomes dos papéis seguem o shadcn
   (`--background`, `--primary`, `--muted-foreground`), ligados ao Tailwind
   por `@theme inline`. Assim shadcn, ReUI e Designfy usam o mesmo tema.
5. **Todo par de texto e fundo é medido.** 4.5:1 para texto, 3:1 para texto
   grande, ícone, borda de campo e anel de foco. Confira com
   `designfy theme check`; par reprovado não segue.
6. **Uma cor base e uma harmonia.** A paleta sai de uma cor base e de uma
   relação da roda de cores, registradas no guia. Cor nova não entra por
   gosto: entra como papel, com par medido.
7. **Acento é sinal.** `primary` marca ação, link, foco e item ativo. Não
   pinta fundo de seção inteira sem o guia dizer.
8. **Neutros com matiz.** Fundo, texto e bordas levam um pouco do matiz da
   base (croma entre 0.004 e 0.02). Cinza puro e preto ou branco absolutos
   ficam de fora das superfícies.
9. **Duas famílias no máximo**, mais a mono para código e número medido:
   `font-heading` e `font-sans`. Fonte servida do próprio projeto.
10. **Espaçamento pela escala.** Só valores da escala do Tailwind e os
    tokens `--gutter`, `--section-space` e `--container-max`.
11. **Fundo com padrão passa pela legibilidade.** Preset `needs-fade` leva
    máscara; `decorative-only` nunca fica atrás de texto corrido.
12. **Claro e escuro são derivados, não invertidos.** Cada papel tem valor
    próprio nos dois temas, com o contraste conferido nos dois.
13. **Mudança no tema atualiza o guia.** Cor base, harmonia, pares medidos,
    fontes e raios ficam descritos no `VIEWSPEC.md` na mesma mudança.

## Passos

### 1. Ler o que existe

```bash
designfy theme show --json
designfy theme check --json
designfy viewspec guide --json
```

- Saída 6 em `theme show`: não há tema. Vá ao passo 2.
- Tema existente: liste os papéis presentes, os que faltam e os pares
  reprovados. Vá ao passo 3.

### 2. Criar o tema

```bash
designfy deps install core vite typography
designfy components add designfy-theme designfy-motion
```

Isso copia `designfy-theme.css` e `designfy-motion.css` para `paths.styles`.
Ligue no CSS de entrada do projeto na ordem de
[assets/entrada.css](assets/entrada.css) e no build
([references/tokens.md](references/tokens.md#ligar-no-projeto)).

### 3. Definir a paleta

1. Cor base: a da marca, quando existe. Sem marca, escolha em
   [assets/paletas.md](assets/paletas.md) pelo tipo de produto e confirme
   com a pessoa em uma pergunta, com três opções.
2. Harmonia: `designfy palette wheel <cor>` mostra as relações. Escolha
   com [references/cores.md](references/cores.md#escolher-a-harmonia).
3. Gere e grave:

   ```bash
   designfy palette generate --base "#2AD5BE" --harmony split-complementary --format css
   ```

   Substitua os blocos `:root` e `.dark` do arquivo de tokens pelos papéis
   gerados. Mantenha os tokens de tipo, forma, layout e movimento.
4. `designfy theme check`. Corrija cada par reprovado com
   [references/contraste.md](references/contraste.md).

### 4. Definir a tipografia

Escolha o par em [assets/pares-tipograficos.md](assets/pares-tipograficos.md),
instale as fontes (`@fontsource-variable/...`), importe uma vez no CSS de
entrada e aponte `--df-font-heading` e `--df-font-sans`. Ajuste a escala de
títulos se a fonte for larga ou condensada
([references/tipografia.md](references/tipografia.md)).

### 5. Definir forma, espaço e fundos

- `--radius` e o que ele gera ([references/formas-e-profundidade.md](references/formas-e-profundidade.md)).
- `--container-max`, `--gutter`, `--section-space`
  ([references/espacamento-e-layout.md](references/espacamento-e-layout.md)).
- Fundos por tipo de seção e os presets permitidos
  ([references/fundos.md](references/fundos.md)). Copie os presets com
  `designfy components add background`.

### 6. Conferir e registrar

Rode [references/checklist.md](references/checklist.md). Atualize as seções
Cores, Tipografia, Layout, Fundos e profundidade e Formas do guia, com as
entradas em `## Aprendizados`.

## Marcos

- Tema encontrado ou criado e ligado ao build.
- Paleta gerada, com cor base e harmonia registradas.
- `designfy theme check` com saída 0 nos dois temas.
- Tipografia, forma, espaço e fundos definidos.
- Guia atualizado.

## Saída

Arquivo de tokens (caminho), cor base e harmonia, pares medidos com o
contraste nos dois temas, famílias de fonte, raio base, largura do
container, presets de fundo adotados, papéis criados ou alterados e o
resultado de `designfy theme check`.
