# Conferência com capturas

A captura mostra o que a tela é em cada largura, sem depender de quem
redimensiona a janela.

## Capturar

```bash
# as quatro larguras de referência, página inteira
designfy capture run http://localhost:4321/ --viewport mobile,tablet,desktop,wide --name home-r1

# extremos e a dobra
designfy capture run http://localhost:4321/ --viewport 320x640,1280x800 --fold --name home-dobra

# tema escuro e movimento reduzido
designfy capture run http://localhost:4321/ --viewport mobile,desktop --theme dark --name home-escuro
designfy capture run http://localhost:4321/ --viewport mobile,desktop --reduced-motion --name home-parado

# só um componente
designfy capture run http://localhost:5173/app/pedidos --selector "[data-region=tabela]" --viewport mobile --name tabela-celular
```

Cada execução grava `.designfy/captures/<nome>/` com os PNG e o
`manifest.json`. Sem o Playwright: `designfy deps install testing` e
`npx playwright install chromium`.

## Ler o manifesto primeiro

| Campo | O que diz |
| --- | --- |
| `overflowX` | `true`: a página rola na horizontal nessa largura |
| `documentWidth`, `viewportWidth` | quanto estourou |
| `documentHeight` | página muito mais longa no celular que o esperado indica empilhamento demais ou espaço sobrando |
| `consoleErrors`, `pageErrors` | erro de script, imagem que falhou |
| `title` | a página certa carregou |

Com `overflowX` verdadeiro em qualquer largura, corrija antes de olhar o
resto ([estouro-e-rolagem.md](estouro-e-rolagem.md)).

## Olhar as imagens

Abra cada PNG. Ordem de leitura:

### Celular (390)

- [ ] Primeira tela: título, frase e ação visíveis.
- [ ] Margem lateral de 16 px ou mais; nada encostado na borda.
- [ ] Texto do corpo legível (16 px); nenhuma linha com três palavras.
- [ ] Botões e links com altura de toque.
- [ ] Ordem das seções faz sentido lida de cima para baixo.
- [ ] Imagens com proporção certa, sem esticar.
- [ ] Tabela no formato planejado.
- [ ] Nenhum texto cortado, sobreposto ou saindo da caixa.
- [ ] Menu recolhido; ação principal no cabeçalho.
- [ ] Espaço entre seções proporcional (nem colado, nem um deserto).

### Tablet (820)

- [ ] Grades com duas colunas, sem item sozinho esticado.
- [ ] Hero com composição própria, não o do celular ampliado.
- [ ] Linhas de texto dentro da medida.
- [ ] Navegação: gaveta ou links, sem quebra em duas linhas.

### Desktop (1440)

- [ ] Hero ocupa uma tela; a seção seguinte começa perto da dobra.
- [ ] Container centralizado; colunas alinhadas entre seções.
- [ ] Texto corrido na medida; nenhuma linha atravessando a tela.
- [ ] Nenhuma seção magra com metade vazia.

### Largo (1920)

- [ ] O container não cresceu; as margens sim.
- [ ] As grades mantêm as colunas de 1440 px.
- [ ] Fundos e faixas vão de borda a borda.
- [ ] Nada flutuando sozinho num canto.

### Mínimo (320)

- [ ] Sem estouro.
- [ ] Título quebra sem cortar palavra.
- [ ] Linha de ações empilha.

## Comparar antes e depois

Use nomes de execução em par (`<slug>-antes`, `<slug>-depois`) e abra as
imagens da mesma largura lado a lado. Em redesenho, a captura "antes" fica
no viewspec como referência.

## Estados e interações

A captura pega a página em repouso. Para estados:

- parâmetro de desenvolvimento que força carregando, vazio e erro;
- rota de exemplo com cada estado;
- `--selector` para recortar o componente;
- menu aberto, gaveta e diálogo: uma rota ou parâmetro que abre o
  componente ao carregar, só em desenvolvimento.

Com o servidor MCP do Playwright configurado
(`designfy mcp setup playwright`), o agente navega, clica e captura o
estado depois da interação.

## O que a captura não mostra

- toque e alcance do polegar: confira no aparelho;
- teclado virtual;
- movimento (só o estado final, ou o parado com `--reduced-motion`);
- foco e navegação por teclado: confira à mão;
- desempenho.

## Registrar

O nome da execução final entra em `captures` no front matter do viewspec.
Achado que pode voltar em outras telas vira regra em `## Responsivo` do
guia, com origem `@revisão`.
