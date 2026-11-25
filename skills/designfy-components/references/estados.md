# Estados

Um componente está pronto quando todos os seus estados existem. O estado
padrão é o mais fácil e o que menos acontece em produção.

## Estados de interação

| Estado | Como aparece | Como se implementa |
| --- | --- | --- |
| padrão | a forma de repouso | |
| hover | um sinal só: um passo de cor ou elevação de 1 a 2 px | `hover:` dentro de `@media (hover: hover)`; nunca em elemento que não é interativo |
| foco visível | anel de 2 px em `ring`, na hora | `:focus-visible` do tema; não remova o contorno |
| ativo (pressionado) | escala 0.98 ou cor um passo mais forte | `active:` ou a utilidade `df-press` |
| selecionado ou atual | fundo `accent` ou marcador `primary`, mais atributo | `aria-current`, `aria-selected`, `data-state="active"` |
| desativado | opacidade 0.55, cursor `not-allowed`, atributo nativo | os três juntos; texto de ajuda dizendo o motivo quando não é óbvio |
| somente leitura | sem borda de edição, valor selecionável | `readOnly`, não `disabled` |
| carregando | o conteúdo dá lugar a um indicador sem mudar de tamanho | `aria-busy`, largura preservada |
| arrastando, soltando | elevação e destino marcado | `data-dragging`, `data-drop-target` |

Regras:

- A largura da borda não muda entre estados. Para marcar erro ou foco,
  troque a cor da borda ou use `ring` e `outline`.
- O botão não muda de largura ao carregar: o indicador ocupa o lugar do
  ícone ou sobrepõe o rótulo invisível.
- Desativado nunca é só opacidade.
- Estado nunca é só cor: tem ícone, texto, traço ou posição junto.

## Estados de dado

Para toda região que recebe dado:

| Estado | Conteúdo mínimo |
| --- | --- |
| carregando | esqueleto com a forma do conteúdo real; aparece depois de 150 a 300 ms e fica pelo menos 300 ms |
| vazio de primeiro uso | o que vai aparecer aqui, por que vale, uma ação para começar |
| vazio por filtro | "nenhum resultado para ...", com a ação de limpar o filtro |
| erro | o que falhou em linguagem simples, tentar de novo, o que foi preservado |
| parcial | a região que falhou mostra o erro; as outras seguem |
| sem permissão | o que a pessoa não pode ver e a quem pedir |
| sucesso | o resultado visível na tela; aviso curto só quando o efeito não aparece |
| lotado | texto longo trunca com título, número grande abrevia, lista longa pagina ou virtualiza |
| desatualizado | dado antigo com a hora da última atualização e a ação de atualizar |

Use os itens `empty-state`, `error-state` e o `skeleton` do shadcn.

## Estados de formulário

| Estado | Comportamento |
| --- | --- |
| intocado | sem erro, mesmo com campo obrigatório vazio |
| em edição | erro anterior some quando o valor passa a valer |
| validado ao sair | erro do campo aparece ao perder o foco, abaixo dele |
| enviando | botão com progresso e `aria-busy`; campos seguem legíveis |
| erro no envio | resumo no topo com link para cada campo; foco no resumo |
| enviado | confirmação na tela ou navegação para o resultado |
| alterado e não salvo | aviso ao sair; barra de ações mostra "alterações não salvas" |

O botão de envio fica ativo até o pedido começar. Botão desativado sem
explicação deixa a pessoa sem saber o que falta.

## Conteúdo difícil

Teste cada componente com:

- o texto mais longo que o dado permite (nome de 60 caracteres, título de
  três linhas);
- o mais curto (uma palavra);
- zero itens, um item e cem itens;
- número com muitos dígitos e número negativo;
- imagem que falha ao carregar;
- tradução mais longa, quando o projeto tem idiomas.

Nada pode estourar a caixa, empurrar o vizinho ou sumir.

## Atributos de estado

Exponha o estado como atributo, para o CSS e para os testes:

```tsx
<button data-state={open ? "open" : "closed"} aria-expanded={open}>
```

```css
[data-state="open"] > .chevron { transform: rotate(180deg); }
```

Com Tailwind: `data-[state=open]:rotate-180`,
`aria-invalid:border-destructive`, `group-data-[collapsed]:hidden`.

## Movimento entre estados

A troca de estado tem movimento curto, com as durações do tema:
`--duration-fast` (150 ms) para cor e pressão, `--duration-base` (250 ms)
para abrir e fechar. A saída é mais rápida que a entrada. Detalhes na
`designfy-motion`.
