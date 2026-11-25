# Componentes interativos: teclado e ARIA

Os padrões seguem o guia de práticas de autoria ARIA do W3C
(<https://www.w3.org/WAI/ARIA/apg/patterns/>). Os primitivos do shadcn e
do ReUI (sobre Radix UI ou Base UI) já implementam: use-os e confira,
em vez de reescrever.

## Diálogo modal

| Item | Exigência |
| --- | --- |
| marcação | `dialog` com `showModal()`, ou `role="dialog"` com `aria-modal="true"` |
| nome | `aria-labelledby` no título; `aria-describedby` na descrição |
| abrir | foco no primeiro controle útil ou no título |
| aberto | foco preso dentro; página de trás inerte |
| Escape | fecha, salvo durante uma ação em curso |
| fechar | foco volta ao gatilho |
| clique fora | fecha, exceto em diálogo de confirmação |

Confirmação destrutiva: `role="alertdialog"`, foco inicial em cancelar.

## Gaveta e folha

As mesmas regras do diálogo. O gatilho tem `aria-expanded`.

## Menu de ações

| Item | Exigência |
| --- | --- |
| gatilho | `button` com `aria-haspopup="menu"` e `aria-expanded` |
| lista | `role="menu"`, itens `role="menuitem"` |
| teclas | Enter, Espaço ou seta para baixo abrem; setas andam; Home e End; letra salta; Escape fecha e devolve o foco; Tab fecha |
| itens de marcar | `menuitemcheckbox`, `menuitemradio` com `aria-checked` |

Menu de navegação do site não é `role="menu"`: é uma lista de links
dentro de `nav`, com botões de `aria-expanded` para os submenus.

## Abas

| Item | Exigência |
| --- | --- |
| lista | `role="tablist"` com nome |
| aba | `role="tab"`, `aria-selected`, `aria-controls` |
| painel | `role="tabpanel"`, `aria-labelledby`, focável quando não tem controle dentro |
| teclas | setas trocam de aba; Home e End; Tab vai para o painel |
| foco | só a aba ativa está na ordem de Tab |

## Sanfona

Cada cabeçalho é um `button` dentro de um título, com `aria-expanded` e
`aria-controls`. Enter e Espaço alternam. `details` e `summary` fazem o
mesmo de forma nativa.

## Combobox e seletor com busca

| Item | Exigência |
| --- | --- |
| campo | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete` |
| lista | `role="listbox"`, opções `role="option"` com `aria-selected` |
| teclas | setas andam; Enter escolhe; Escape fecha; digitar filtra |
| opção ativa | `aria-activedescendant` no campo |
| resultado | contagem anunciada; "nenhum resultado" como texto |

## Dica

- Abre no hover e no foco; fecha com Escape; fica enquanto o ponteiro
  está sobre ela.
- `role="tooltip"`, ligada por `aria-describedby` (descrição) ou usada
  como nome do botão de ícone.
- Nunca guarda conteúdo essencial nem controles.

## Popover

Conteúdo com controles: abre no clique, foco vai para dentro, Escape
fecha e devolve o foco. Não é modal: Tab sai dele e o fecha.

## Aviso curto

`role="status"` para confirmação, `role="alert"` para erro. Não recebe
foco. Tempo suficiente para ler (5 s ou mais), pausa no hover e no foco,
e uma forma de reler quando importa. Ação dentro do aviso (desfazer)
alcançável por teclado.

## Tabela de dados interativa

- `table` real. Cabeçalho ordenável é um `button` dentro do `th`, com
  `aria-sort` no `th`.
- Seleção: caixas com nome ("Selecionar pedido 1042"), caixa do cabeçalho
  com estado misto (`aria-checked="mixed"`), contagem anunciada.
- Ações da linha: botão com nome que cita o registro.
- Paginação: `nav` com rótulo; página atual com `aria-current`.
- Região rolável com `tabindex="0"`, `role="region"` e nome.
- Grade com navegação por célula (`role="grid"`) só quando as células são
  editáveis; para leitura, tabela comum.

## Carrossel

- Região com `aria-roledescription="carrossel"` e nome.
- Botões de anterior e próximo com nome; indicadores como botões com o
  número do item.
- Sem troca automática; se houver, com pausa visível e parando no foco e
  no hover.
- Itens fora da vista não recebem foco.

## Navegação e trilha

- `nav` com rótulo; lista de links; item atual com `aria-current="page"`.
- Trilha: `nav aria-label="Trilha"` com lista ordenada.
- Submenu: botão com `aria-expanded` e `aria-controls`; abre no clique e
  no Enter.

## Alternador, grupo de opções e controle segmentado

- Alternador: `role="switch"` com `aria-checked`; rótulo e descrição
  ligados.
- Grupo de opções e controle segmentado: `role="radiogroup"` com nome;
  setas trocam a escolha; uma parada de Tab.
- Botão de alternância (negrito, favorito): `aria-pressed`.

## Progresso e carregamento

- Barra: `role="progressbar"` com `aria-valuenow`, `aria-valuemin`,
  `aria-valuemax` e nome; indeterminada sem `aria-valuenow`.
- Região que carrega: `aria-busy="true"`; esqueletos escondidos do leitor
  (`aria-hidden`).
- Conclusão anunciada por região viva.

## Arrastar e soltar

Toda operação de arrastar tem alternativa por clique ou teclado: botões
"Mover para cima" e "Mover para baixo", ou um menu "Mover para...". O
resultado é anunciado ("Item movido para a posição 2 de 5").

## Componente próprio

Antes de escrever um componente interativo do zero:

1. Existe elemento nativo? Use.
2. Existe primitivo no shadcn ou no ReUI? Use.
3. Não existe: siga o padrão do guia ARIA para papel, estados e teclas,
   e teste com teclado e com dois leitores de tela.

ARIA errado é pior que nenhum: papel sem o comportamento de teclado
correspondente engana quem usa leitor de tela.
