# Avisos de terceiros

O Designfy distribui código próprio sob a GNU AGPL 3.0 e inclui material de
terceiros nas condições abaixo. Cada item indica o que entrou, onde está e a
licença publicada pela fonte, quando disponível.

## Hallmark

Licença MIT. Copyright (c) 2026 Hallmark contributors.

O Designfy absorveu as listas de revisão do
[Hallmark](https://github.com/nutlope/hallmark), adaptadas ao tema e ao método do
Designfy, em dois arquivos:

- `skills/designfy-websites/references/vicios-de-pagina-gerada.md`, a lista de
  vícios de página gerada;
- `skills/designfy-review/references/lista-de-acabamento.md`, a lista de
  acabamento da revisão.

O Hallmark continua disponível como skill externa do framework, instalada por
`designfy skills install hallmark`. O texto abaixo acompanha o material
absorvido.

```text
MIT License

Copyright (c) 2026 Hallmark contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Presets de fundo

O ReactBD BG e o Pattern Craft fornecem 314 presets sob a licença MIT.
Copyright (c) 2025 Megh Bari. Copyright (c) 2026 Noor Mohammad /
ReactBD para modificações, padrões adicionais e a interface do ReactBD BG.
O material de origem está em
`skills/designfy-design-system/references/backgrounds/reactbd-bg.json`.

O GradientDeck fornece 20 padrões e convida visitantes a copiar o código
para seus projetos. A fonte não publica licença para esses padrões.
A Promovaweb escolheu incluí-los em 24 de novembro de 2026. O material de
origem está em
`skills/designfy-design-system/references/backgrounds/gradientdeck.json`.
[Catálogo do GradientDeck](https://gradientdeck.com/pattern-backgrounds).

O build em `scripts/build-backgrounds.ts` lê as duas fontes e gera o CSS
e os metadados em `registry/shared/backgrounds/`, o catálogo em
`skills/designfy-design-system/references/backgrounds/catalogo.md`, o tipo
em `registry/react/background/presets.ts` e os dados da galeria em
`examples/backgrounds/index.html`. O texto integral da licença MIT e a
atribuição de cada fonte estão em
`skills/designfy-design-system/references/backgrounds/NOTICE.md`.

## Formato DESIGN.md do Google Labs

Licença Apache 2.0. O projeto de origem é
[google-labs-code/design.md](https://github.com/google-labs-code/design.md).

O guia `VIEWSPEC.md` do Designfy segue a ideia do formato DESIGN.md: um arquivo
de texto, versionado com o código, que registra o sistema visual para pessoas e
agentes. O Designfy amplia a ideia em três pontos, porque cobre padrões de tela
além de tokens, dá um identificador a cada regra e guarda o histórico do que foi
aprendido.

Nenhum código ou texto do projeto DESIGN.md foi copiado para o Designfy. O
contrato em `docs/viewspec.md` e os modelos de `skills/designfy-viewspec/assets/`
são escritos pelo Designfy, e a referência ao formato é conceitual e nominal.

## Bibliotecas embutidas no binário

O binário compilado leva as dependências de `package.json`. As três usam licença
MIT:

| Pacote | Licença | Uso no binário |
| --- | --- | --- |
| `@modelcontextprotocol/sdk` | MIT | servidor MCP por stdio, tools, resources e prompts |
| `@opentui/core` | MIT | interface do terminal |
| `zod` | MIT | validação dos catálogos, das entradas das tools e das configurações |

As ferramentas de desenvolvimento não entram no executável: `typescript` usa
licença Apache 2.0 e `@types/bun`, licença MIT. O texto integral de cada licença
acompanha o pacote em `node_modules/<pacote>/LICENSE`.

O Designfy não redistribui componentes do Tailwind Plus nem do catálogo privado
do `promovaweb/ui-components`. Esses repositórios serviram de mapa de famílias, e
nenhum arquivo deles entrou no registro.
