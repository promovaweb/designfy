---
name: designfy-accessibility
description: Especialista em acessibilidade do Designfy, pela WCAG 2.2 nível AA. Confere e corrige contraste, foco visível, navegação por teclado, semântica e marcos, nomes acessíveis, leitor de tela, formulários, componentes interativos (diálogo, menu, abas, combobox, tabela), mídia, movimento e alvos de toque, com auditoria automática pelo axe no Playwright e roteiro manual. Use quando a pessoa pedir acessibilidade, a11y, WCAG, contraste, navegação por teclado, leitor de tela, ARIA, foco, auditoria de acessibilidade, ou quando a skill designfy chamar esta etapa.
---

# Acessibilidade

Uma interface acessível funciona para quem usa teclado, leitor de tela,
ampliação, alto contraste, comando de voz ou só uma mão no celular. Esta
skill confere a tela contra a WCAG 2.2 nível AA e corrige o que encontra,
na ordem do que mais impede o uso.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| O que a WCAG 2.2 AA exige, em linguagem de interface | [references/wcag-na-pratica.md](references/wcag-na-pratica.md) |
| Teclado, ordem de foco e foco visível | [references/teclado-e-foco.md](references/teclado-e-foco.md) |
| HTML semântico, marcos, títulos e nomes acessíveis | [references/semantica-e-nomes.md](references/semantica-e-nomes.md) |
| Cor, contraste e o que não depende de cor | [references/cor-e-contraste.md](references/cor-e-contraste.md) |
| Formulários: rótulos, erros e ajuda | [references/formularios.md](references/formularios.md) |
| Padrões de teclado e ARIA por componente | [references/componentes-interativos.md](references/componentes-interativos.md) |
| Imagens, vídeo, áudio e movimento | [references/midia-e-movimento.md](references/midia-e-movimento.md) |
| Auditoria automática e roteiro manual | [references/auditoria.md](references/auditoria.md) |
| Conferência antes de entregar | [references/checklist.md](references/checklist.md) |

Modelos em `assets/`: [axe-playwright.mjs](assets/axe-playwright.mjs)
(auditoria automática de uma ou mais URLs) e
[relatorio-de-acessibilidade.md](assets/relatorio-de-acessibilidade.md).

## Regras

1. **HTML nativo primeiro.** `button`, `a`, `input`, `select`, `dialog`,
   `details`, `table` já trazem papel, teclado e foco. ARIA entra só
   quando o HTML não tem o elemento.
2. **Tudo o que o ponteiro faz, o teclado faz.** Sem armadilha de foco e
   com ordem igual à visual.
3. **Foco sempre visível**, com 3:1 de contraste, sem transição, e nunca
   escondido atrás de cabeçalho fixo.
4. **Todo controle tem nome.** O nome acessível diz a ação ou o destino;
   o texto visível faz parte dele.
5. **Contraste medido.** Texto 4.5:1; texto grande, ícone com função,
   borda de campo e foco 3:1. Nos dois temas.
6. **Informação nunca só por cor**, nem só por posição, forma ou som.
7. **Estrutura legível por máquina.** Um `h1`, níveis sem salto, marcos
   (`header`, `nav`, `main`, `footer`), listas e tabelas marcadas como
   tais.
8. **Formulário com rótulo, erro e ajuda ligados ao campo**, e erro que
   diz como corrigir.
9. **Mudança é anunciada.** Resultado de busca, erro, sucesso e conteúdo
   que carregou chegam ao leitor de tela, sem roubar o foco.
10. **Movimento com freio.** Versão parada, pausa em tudo que se move por
    mais de 5 segundos, nada pisca mais de três vezes por segundo.
11. **Alvo de 24 por 24 px no mínimo** (WCAG 2.2), 44 por 44 px no toque
    (regra do Designfy).
12. **Ampliação funciona.** Texto a 200% e tela a 400% sem perder
    conteúdo nem rolar em dois eixos.
13. **Ferramenta automática acha parte.** A auditoria do axe pega perto de
    um terço dos problemas; teclado e leitor de tela se conferem à mão.

## Passos

### 1. Ler

`## Acessibilidade` do viewspec, `## Acessibilidade` do guia (nível
adotado e conferências obrigatórias) e o código da tela.

### 2. Auditar automaticamente

```bash
designfy deps install testing
node skills/designfy-accessibility/assets/axe-playwright.mjs http://localhost:4321/rota
designfy theme check
```

Com [references/auditoria.md](references/auditoria.md). Resolva primeiro o
que o axe classifica como crítico e sério.

### 3. Percorrer com o teclado

Roteiro de [references/teclado-e-foco.md](references/teclado-e-foco.md):
Tab do início ao fim, cada controle operado, cada camada aberta e
fechada.

### 4. Conferir estrutura e nomes

Com [references/semantica-e-nomes.md](references/semantica-e-nomes.md):
títulos, marcos, nomes dos controles, texto alternativo.

### 5. Conferir formulários e componentes

Com [references/formularios.md](references/formularios.md) e
[references/componentes-interativos.md](references/componentes-interativos.md).

### 6. Conferir cor, mídia e movimento

Com [references/cor-e-contraste.md](references/cor-e-contraste.md) e
[references/midia-e-movimento.md](references/midia-e-movimento.md).

### 7. Ouvir

Leitor de tela nas partes principais: o título e os marcos, a ação
principal, um formulário, uma mudança de estado. Roteiro em
[references/auditoria.md](references/auditoria.md).

### 8. Registrar

[references/checklist.md](references/checklist.md), relatório com
[assets/relatorio-de-acessibilidade.md](assets/relatorio-de-acessibilidade.md),
itens marcados no viewspec e padrões novos em `## Acessibilidade` do
guia.

## Marcos

- Auditoria automática sem violação crítica ou séria.
- Teclado: tela inteira percorrida e operada.
- Estrutura, nomes e formulários conferidos.
- Contraste medido nos dois temas.
- Leitor de tela ouvido nas partes principais.
- Relatório entregue.

## Saída

O que foi auditado (URLs, larguras, temas), as violações por gravidade com
a correção feita, o que foi conferido à mão, o que ficou aberto e por quê,
e as regras novas do guia.
