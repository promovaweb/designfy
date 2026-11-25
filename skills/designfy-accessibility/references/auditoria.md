# Auditoria de acessibilidade

A auditoria tem três partes: automática, por teclado e por leitor de
tela. A automática é rápida e pega perto de um terço dos problemas; as
outras duas pegam o que só uma pessoa percebe.

## 1. Automática

### axe com Playwright

```bash
designfy deps install testing        # playwright e @axe-core/playwright
npx playwright install chromium
node skills/designfy-accessibility/assets/axe-playwright.mjs http://localhost:4321/ http://localhost:4321/precos/
```

O modelo [assets/axe-playwright.mjs](../assets/axe-playwright.mjs) abre
cada URL em celular e desktop, nos temas claro e escuro, roda o axe com
as regras WCAG 2.2 A e AA e imprime as violações por gravidade, com o
seletor do elemento, a regra e o link de ajuda. Sai com 1 quando há
violação crítica ou séria. Copie o arquivo para o projeto (por exemplo
`scripts/a11y.mjs`) e ajuste as URLs.

Gravidades do axe:

| Gravidade | Tratamento |
| --- | --- |
| crítica | impede o uso; corrija antes de qualquer outra coisa |
| séria | dificulta muito; corrija antes de entregar |
| moderada | corrija ou registre o motivo |
| menor | corrija quando tocar no componente |

O que o axe encontra bem: contraste de texto sobre cor sólida, nome
ausente em botão, link e campo, `alt` ausente, ARIA inválido, `id`
duplicado, título de página e idioma ausentes, ordem de títulos, marcos
ausentes.

O que o axe não encontra: se o nome faz sentido, se o texto alternativo
descreve a imagem, ordem de foco, armadilha de foco, operação por
teclado de componente próprio, contraste sobre imagem, anúncio de
mudanças, qualidade das mensagens de erro, movimento.

### Outras conferências automáticas

```bash
designfy theme check                                           # pares do tema
designfy capture run <url> --viewport 320x640 --name refluxo   # refluxo a 320 px: overflowX falso
designfy capture run <url> --reduced-motion --name parado      # tudo visível sem movimento
```

O Lighthouse do navegador roda um subconjunto do axe e serve de segunda
leitura. Nota 100 não quer dizer acessível.

## 2. Teclado

Roteiro completo em [teclado-e-foco.md](teclado-e-foco.md). Resumo:

1. Tab do começo ao fim: ordem, anel visível, nada encoberto.
2. Cada controle operado.
3. Cada camada aberta, percorrida, fechada com Escape, foco devolvido.
4. Formulário enviado com erro: foco no erro.
5. O mesmo em 390 px.

## 3. Leitor de tela

Pelo menos um leitor, de preferência dois:

| Sistema | Leitor | Liga com |
| --- | --- | --- |
| Windows | NVDA (gratuito) com Firefox ou Chrome | Ctrl+Alt+N |
| macOS | VoiceOver com Safari | Cmd+F5 |
| Linux | Orca | Super+Alt+S |
| iOS | VoiceOver | três toques no botão lateral |
| Android | TalkBack | botões de volume |

Roteiro de dez minutos:

1. **Título e idioma.** Ao carregar, o leitor diz o título da página, na
   pronúncia certa.
2. **Marcos.** Liste os marcos (NVDA: `D`; VoiceOver: rotor): cabeçalho,
   navegação, principal, rodapé, com nomes distintos.
3. **Títulos.** Liste os títulos (NVDA: `H` ou Insert+F7): um `h1`, a
   hierarquia forma o índice da página.
4. **Links e botões.** Liste (Insert+F7): cada nome faz sentido sozinho?
5. **Ação principal.** Chegue nela e ative.
6. **Formulário.** Em cada campo, o leitor diz rótulo, tipo,
   obrigatoriedade e ajuda. Envie com erro: a mensagem é anunciada e
   lida no campo.
7. **Imagens.** As com informação têm descrição; as decorativas são
   puladas.
8. **Componente interativo.** Abra o menu, o diálogo e as abas: papel,
   estado (expandido, selecionado) e nome são ditos; o foco fica onde
   deve.
9. **Mudança dinâmica.** Filtre uma lista ou salve algo: o resultado é
   anunciado sem mover o foco.
10. **Tabela.** Ao andar pelas células, o leitor diz o cabeçalho da
    coluna e da linha.

## 4. Visual

- Ampliar o texto do navegador a 200%: nada corta nem sobrepõe.
- Ampliar a página a 400% (ou janela de 320 px): sem rolagem em dois
  eixos.
- Tons de cinza: tudo continua compreensível.
- Alto contraste forçado (Windows) ou emulação de `forced-colors`: bordas
  e estados continuam visíveis.
- Alvos: 24 por 24 px no mínimo; 44 no toque.

## Priorizar

Corrija nesta ordem:

1. o que impede a tarefa principal (controle sem teclado, armadilha de
   foco, campo sem rótulo, diálogo que não fecha);
2. o que esconde conteúdo (sem alternativa, contraste muito baixo, foco
   invisível);
3. o que confunde (ordem de títulos, nomes vagos, mudança não anunciada);
4. o resto.

## Relatório

Use [assets/relatorio-de-acessibilidade.md](../assets/relatorio-de-acessibilidade.md).
Cada achado tem: onde (URL e elemento), o que acontece, quem é afetado, o
item da WCAG, a gravidade e a correção. Achado que pode voltar em outras
telas vira regra em `## Acessibilidade` do guia, com origem `@revisão`.

## Na rotina

- A auditoria automática roda em toda tela antes de fechar o viewspec, e
  pode rodar no CI do projeto.
- O roteiro de teclado roda em toda tela.
- O leitor de tela roda em cada fluxo principal e em cada componente
  novo.
- Componente do registro ou do shadcn já testado não precisa de leitor de
  tela a cada uso; a composição da tela, sim.
