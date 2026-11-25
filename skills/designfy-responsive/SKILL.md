---
name: designfy-responsive
description: Especialista em responsividade do Designfy. Planeja e ajusta cada tela para celular, tablet e desktop com Tailwind 4, pontos de quebra, consultas de contêiner, tipografia e espaço fluidos, alvos de toque, navegação no celular, tabelas e formulários em tela pequena, imagens por largura e telas muito largas, conferindo com capturas do Playwright em 390, 820, 1440 e 1920 px. Use quando a pessoa pedir versão mobile, ajuste no celular, layout responsivo, correção de rolagem horizontal, tabela no celular, menu mobile, otimização para tablet ou tela larga, ou quando a skill designfy chamar esta etapa.
---

# Responsivo

Responsivo não é encolher o desktop. Cada largura tem um layout pensado: o
que empilha, o que some, o que vira gaveta, o que ganha coluna. Esta skill
planeja isso por tela e confere com capturas.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Faixas de largura, pontos de quebra e o que muda em cada uma | [references/faixas-e-pontos-de-quebra.md](references/faixas-e-pontos-de-quebra.md) |
| Como cada componente se adapta | [references/padroes-de-adaptacao.md](references/padroes-de-adaptacao.md) |
| Consultas de contêiner, grade fluida e tipografia fluida | [references/fluidez-e-conteineres.md](references/fluidez-e-conteineres.md) |
| Toque, polegar, teclado virtual e áreas seguras | [references/toque-e-celular.md](references/toque-e-celular.md) |
| Achar e corrigir rolagem horizontal e estouro | [references/estouro-e-rolagem.md](references/estouro-e-rolagem.md) |
| Conferir com capturas em cada largura | [references/conferencia-com-capturas.md](references/conferencia-com-capturas.md) |
| Conferência antes de entregar | [references/checklist.md](references/checklist.md) |

Modelo em `assets/`: [plano-responsivo.md](assets/plano-responsivo.md),
para escrever a seção Responsivo do viewspec.

## Regras

1. **Do celular para cima.** As classes sem prefixo são o layout de 390
   px; `sm:`, `md:`, `lg:`, `xl:` acrescentam colunas e espaço.
2. **Nenhuma rolagem horizontal da página** entre 320 e 1920 px. O que é
   largo por natureza (tabela, código) rola dentro da própria caixa.
3. **Nenhum conteúdo some no celular.** O que o desktop mostra, o celular
   alcança: empilhado, recolhido, em gaveta ou no detalhe. Só enfeite pode
   sair.
4. **Alvo de toque de 44 por 44 px**, com 8 px entre alvos vizinhos.
5. **Texto do corpo com 16 px ou mais no celular**; campo de formulário
   com 16 px, para o navegador não ampliar.
6. **O ponto de quebra é do conteúdo.** Quebre onde o layout deixa de
   funcionar, não numa largura de aparelho.
7. **Componente em coluna de largura desconhecida usa consulta de
   contêiner**, não de tela.
8. **Tela larga tem teto.** O container é limitado e centralizado; as
   grades não ganham colunas acima de 1440 px.
9. **A ordem no celular é a ordem de leitura.** O DOM segue a ordem
   lógica; `order` não reordena conteúdo com sentido.
10. **Altura de tela com `svh` ou `dvh`**, nunca `vh`: a barra do
    navegador do celular muda a altura.
11. **O plano fica escrito.** A seção `## Responsivo` do viewspec diz o
    que muda em 390, 820 e 1440 px, e o guia guarda os padrões do
    projeto.
12. **Captura é a prova.** Cada largura é conferida numa imagem, com
    `overflowX` falso no manifesto.

## Passos

### 1. Ler

`## Responsivo` e `## Estrutura` do viewspec, `## Responsivo` do guia e o
código da tela.

### 2. Capturar o estado atual

```bash
designfy capture run <url> --viewport mobile,tablet,desktop,wide --name <slug>-antes
```

Abra o `manifest.json` (campo `overflowX` de cada captura) e as imagens.

### 3. Planejar por região

Com [references/padroes-de-adaptacao.md](references/padroes-de-adaptacao.md)
e [assets/plano-responsivo.md](assets/plano-responsivo.md): para cada
região, o layout em cada faixa. Atualize o viewspec.

### 4. Ajustar

Do celular para cima: layout base, depois os prefixos. Consultas de
contêiner nos componentes reutilizados. Tipografia e espaço fluidos pelos
tokens ([references/fluidez-e-conteineres.md](references/fluidez-e-conteineres.md)).

### 5. Corrigir estouro

Com [references/estouro-e-rolagem.md](references/estouro-e-rolagem.md),
para cada captura com `overflowX` verdadeiro.

### 6. Conferir toque e teclado virtual

Com [references/toque-e-celular.md](references/toque-e-celular.md).

### 7. Capturar de novo e comparar

```bash
designfy capture run <url> --viewport mobile,tablet,desktop,wide --name <slug>-depois
designfy capture run <url> --viewport 320x640,360x800,1024x768 --name <slug>-extremos
```

Rode [references/checklist.md](references/checklist.md) e marque os itens
no viewspec.

## Marcos

- Capturas iniciais nas quatro larguras.
- Plano por região escrito no viewspec.
- Layout ajustado do celular para cima.
- `overflowX` falso em todas as larguras, inclusive 320 px.
- Toque e teclado virtual conferidos.

## Saída

Para cada região, o que muda em cada faixa; os estouros encontrados e a
causa de cada um; as capturas antes e depois (pastas das execuções); os
alvos de toque corrigidos; e os padrões levados a `## Responsivo` do guia.
