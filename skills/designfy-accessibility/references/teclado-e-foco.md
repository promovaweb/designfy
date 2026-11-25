# Teclado e foco

## Regras

- Todo elemento interativo recebe foco e é operado pelo teclado.
- A ordem do foco é a ordem visual e lógica.
- O foco está sempre visível.
- Nenhum componente prende o foco sem saída, exceto camada modal aberta,
  que solta com Escape.
- Nada de `tabindex` positivo. `tabindex="0"` põe na ordem; `-1` permite
  foco por script.

## Teclas esperadas

| Tecla | Efeito |
| --- | --- |
| Tab e Shift+Tab | próximo e anterior |
| Enter | ativa link e botão; envia formulário |
| Espaço | ativa botão; marca caixa; abre seletor |
| setas | movem dentro de um componente composto (opções, abas, menu, grade) |
| Escape | fecha a camada de cima (diálogo, menu, popover, dica) |
| Home e End | primeiro e último item do componente |
| digitar | salta para o item que começa com a letra, em listas e menus |

Componente composto (abas, menu, grupo de opções, barra de ferramentas) é
uma parada de Tab; as setas andam dentro dele.

## Foco visível

O tema do Designfy aplica em `:focus-visible`:

```css
:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
```

- Não remova (`outline-none`) sem pôr outro indicador equivalente no
  mesmo seletor.
- Contraste de 3:1 entre o anel e o que está em volta, nos dois temas.
  Sobre fundo `primary`, o anel precisa de um contorno interno ou de
  deslocamento.
- Aparece na hora: sem transição.
- `:focus-visible` mostra o anel para teclado e não para clique, que é o
  comportamento esperado.
- Em campo de formulário, o anel pode ser interno e somar com a borda.
- Elemento cortado por `overflow: hidden` no pai pode perder o anel:
  use `outline-offset` negativo ou `ring-inset`.

## Foco não encoberto

O elemento em foco não fica atrás de cabeçalho fixo, barra do pé ou aviso
de cookies. O tema reserva `scroll-padding-top` com a altura do
cabeçalho. Para a barra do pé, `scroll-padding-bottom` com a altura dela.

## Pular blocos

```html
<a href="#conteudo" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2">
  Pular para o conteúdo
</a>
…
<main id="conteudo" tabindex="-1">
```

É o primeiro elemento focável da página.

## Ordem do foco

- O DOM segue a ordem de leitura. Não reordene visualmente conteúdo com
  `order` ou posicionamento sem conferir o Tab.
- Camada aberta (menu, diálogo) recebe o foco logo depois do gatilho na
  ordem, ou o foco é movido para dentro dela.
- Conteúdo escondido não recebe foco: `hidden`, `inert` ou
  `display: none`. `opacity: 0` e `visibility` mal usados deixam foco
  fantasma.

## Gerenciar o foco

| Evento | Para onde vai o foco |
| --- | --- |
| abre diálogo ou gaveta | primeiro controle útil de dentro, ou o título |
| fecha diálogo ou gaveta | o gatilho que abriu |
| abre menu | o primeiro item |
| troca de rota (aplicação de página única) | o `h1` da nova tela (`tabindex="-1"`) |
| envio de formulário com erro | o resumo de erros, ou o primeiro campo inválido |
| item excluído da lista | o item seguinte, ou o título da lista |
| conteúdo carregado por "ver mais" | o primeiro item novo |
| etapa seguinte de um fluxo | o título da etapa |
| aviso curto | não recebe foco; é anunciado |

Camada modal: o foco fica preso dentro, o resto da página fica inerte
(`inert` no conteúdo de trás, ou o `dialog` nativo com `showModal()`), e
Escape fecha.

## Elementos que não são botão

`div` e `span` com clique não recebem foco nem respondem a Enter e
Espaço. Troque por `button` (ação) ou `a` (navegação). Cartão clicável:
o link fica no título e se estende pelo cartão com um pseudo-elemento.

## Atalhos

- Atalho de uma tecla só vale com o componente em foco, ou pode ser
  desligado.
- Não sobrescreva atalhos do navegador e do leitor de tela.
- Mostre o atalho na interface.

## Roteiro de teste por teclado

Sem tocar no mouse:

1. Recarregue a página e aperte Tab: o primeiro foco é "Pular para o
   conteúdo"?
2. Siga com Tab até o fim: a ordem faz sentido? O anel aparece em todo
   elemento? Algum foco some ou fica encoberto?
3. Opere cada controle: links e botões com Enter e Espaço, seletores e
   abas com setas, caixas com Espaço.
4. Abra cada camada (menu, diálogo, gaveta, dica): o foco entra, fica
   preso quando é modal, Escape fecha, o foco volta ao gatilho?
5. Preencha e envie o formulário com erro: o foco vai para o erro? A
   mensagem está ligada ao campo?
6. Volte com Shift+Tab: a ordem inversa também faz sentido?
7. Em 390 px de largura: o menu em gaveta funciona por teclado?

Anote cada falha com o elemento e a tecla.
