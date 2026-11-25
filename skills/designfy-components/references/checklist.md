# Checklist de componente

Rode para cada componente criado ou alterado, antes de marcar o item no
viewspec.

## Escolha

- [ ] A entrada do catálogo de interface foi lida; `useWhen` vale e `avoidWhen` não.
- [ ] Não existe componente igual no projeto, no registro, no shadcn ou no ReUI.
- [ ] A fonte usada está escrita no viewspec da tela.

## Tema

- [ ] Só papéis do tema; nenhuma cor literal, classe de paleta fixa ou cor arbitrária.
- [ ] Nenhuma `font-family` literal; títulos em `font-heading`.
- [ ] Nenhum `dark:` para cor.
- [ ] Raio, sombra e espaçamento pelas classes da escala.
- [ ] Cada combinação de fundo e texto das variações com contraste medido.

## Conteúdo

- [ ] Nenhum texto fixo; tudo chega por propriedade, `children` ou slot.
- [ ] Região opcional sem conteúdo não rende nada.
- [ ] Testado com texto longo, texto curto, zero, um e muitos itens.
- [ ] Nenhum número, depoimento, logo ou pessoa inventados.

## Estrutura

- [ ] HTML semântico; um elemento raiz; `className` ou `class` mesclado por último.
- [ ] Nível de título por propriedade; nenhum rótulo pequeno acima do título.
- [ ] Trilhas de grade com `minmax(0, 1fr)` ou `min-w-0` nos filhos.
- [ ] Sem rolagem horizontal de 320 a 1920 px; conteúdo largo rola na própria caixa.
- [ ] Área de toque de 44 px nos controles.

## Estados

- [ ] Hover, foco visível, ativo e desativado.
- [ ] Carregando, vazio e erro, quando há dado.
- [ ] Selecionado ou atual com atributo ARIA.
- [ ] Largura da borda constante entre estados.
- [ ] Estado nunca indicado só por cor.

## Movimento

- [ ] Há movimento com função (entrada, resposta, troca de estado ou rolagem).
- [ ] Só `transform` e `opacity` (mais `clip-path`, `mask`, `background-position`).
- [ ] Nenhum `transition-all`.
- [ ] Conteúdo visível sem JavaScript.
- [ ] Laços pausam no hover, no foco e fora da tela.
- [ ] Versão parada com `prefers-reduced-motion`.

## Código

- [ ] Cabeçalho de documentação com propósito, propriedades, slots e movimento.
- [ ] Propriedades tipadas e comentadas; padrões definidos.
- [ ] `"use client"` só onde há estado, efeito ou `motion/react`.
- [ ] Importação de `motion/react`, não de `framer-motion`.
- [ ] Efeitos e observadores limpos na saída.
- [ ] `designfy deps check` sai com 0.

## Registro no projeto

- [ ] Componente novo que se repete listado em `## Componentes` do guia.
- [ ] Adaptação de item copiado anotada no guia.
- [ ] Item do viewspec marcado depois de ver a região renderizada.
