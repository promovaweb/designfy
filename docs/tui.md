# TUI

Execute `{{bin}}` sem argumentos ou use `{{bin}} tui` para abrir a Home.
A interface precisa de stdin e stdout em um TTY. Em um pipe, o comando
`tui` sai com código 8.

Abra um módulo diretamente com `{{bin}} tui --tab theme`. Use qualquer ID
da tabela de módulos. A flag tem prioridade sobre `tui.initialTab`, cujo
padrão é `overview`.

## Cabeçalho, Home e barra de teclas

O cabeçalho mostra a marca, a versão, a trilha da tela atual, a pasta do
projeto e o framework. Clique na marca para voltar à Home. À direita, use
o chip de tema para trocar a paleta. O cabeçalho mostra a plataforma
quando há espaço. Dentro de cada módulo, clique em `← Back` na linha
com o ícone, o título e a descrição.

A Home mostra um próximo passo para o estado atual do projeto. Pressione
`Enter` com a faixa selecionada para abrir o módulo indicado ou clique
na faixa. A ordem das sugestões é inicializar o projeto, adicionar o
tema, criar o guia, instalar dependências e continuar um viewspec aberto.
A faixa exibe `All set` quando nenhuma dessas ações é necessária.

Use as setas ou `h`, `j`, `k` e `l` para mover o foco na grade. Pressione
`Enter` ou `Space` para abrir o cartão selecionado. Clique em um cartão
para abrir o módulo diretamente. A linha de totais destaca o que pede
atenção, como dependências ausentes e overflow horizontal nas capturas.

A barra de teclas mostra os atalhos do módulo, um divisor e os atalhos
globais. Clique em um chip para executar a ação. O shell ajusta as dicas
à largura disponível e preserva `? help` e `q quit` nos tamanhos
suportados. Abra o help para ver a lista completa, com as teclas do
módulo, as globais e a nota de mouse. Role o help com a roda, as setas
ou as teclas de página. Pressione `Esc` ou `?` para fechá-lo.

## Módulos

| Tecla | ID | Conteúdo e ações |
| --- | --- | --- |
| | `overview` | Home com a faixa de próximo passo, os cartões e os totais. Pressione `r` para reler o projeto. |
| `1` | `theme` | Lista de tokens com amostras truecolor, valores e modo de auditoria `shadcn` ou `custom`. Use `t` para alternar entre claro e escuro, `g` para trocar o grupo de tokens, `c` para ver os pares de contraste e `Enter` para abrir detalhes da cor. |
| `2` | `catalog` | Lista de padrões por categoria e prévia de uso, anatomia, estados, responsividade, acessibilidade, tokens e fontes. Use `s` para alternar a superfície, `k` para escolher o tipo de viewspec e `Enter` para focar a prévia. |
| `3` | `components` | Registro por categoria e prévia de arquivos e dependências. Use `f` para alternar React e Astro, `Enter` para focar a prévia e `i` para copiar os componentes marcados. |
| `4` | `skills` | Lista de skills com origem, escopo e estado da instalação. Use `g` para alternar entre todas, internas e externas. Use `i` para instalar, `u` para atualizar e `d` para remover as marcadas. |
| `5` | `deps` | Lista de grupos e prévia de versões declaradas e instaladas. Use `Enter` para focar os pacotes, `c` para conferir dependências e `i` para instalar os grupos marcados. |
| `6` | `mcp` | Lista de servidores e estado da configuração por cliente. Use `Enter` para focar os clientes, `c` para trocar o cliente, `f` para permitir substituições e `i` para gravar a configuração dos servidores marcados. |
| `7` | `viewspecs` | Guia, viewspecs, estados e medidores de checklist. Use `v` para alternar entre guia e telas, `s` para mudar o estado exibido e `Enter` para ler o arquivo inteiro em Markdown. Pressione `Tab` para voltar à lista depois da leitura. |
| `8` | `captures` | Histórico de execuções, viewports, imagens e erros. A etiqueta `overflowX` indica quando a captura excedeu a largura. Use `Enter` para escolher uma imagem e `o` para copiar seu caminho. |
| `9` | `project` | Ambiente do projeto, estado do Designfy e comandos de configuração. Use `r` para recarregar e `c` para copiar a configuração MCP. |
| `0` | `settings` | Tabela de configurações, valores padrão e painel de detalhes. Use `Enter` ou `e` para editar, `x` ou `Delete` para restaurar e `r` para recarregar. |
| `c` na Home | `credentials` | Nomes das credenciais, origem da master key e total do cofre. Use `a` para adicionar, `Enter` ou `e` para editar, `d` ou `Delete` para remover e `r` para recarregar. |
| `d` na Home | `docs` | Índice de tópicos e documento em Markdown. Use `t` para escolher o tópico e `↑`, `↓`, `j`, `k`, `PgUp`, `PgDn`, `Home` e `End` para rolar. |
| `a` na Home | `about` | Binário, licença, links e créditos. Use `c` para copiar o link do projeto. |

Use `1` a `9` e `0` a partir de qualquer módulo. Pressione `Esc` ou
`Backspace` para voltar à Home. Na Home, use `Esc`, `q` ou `Ctrl+C`
para sair. Use `Ctrl+K` ou `:` para abrir a paleta de comandos. Busque
um módulo por nome ou escolha uma ação. Confirme com `Enter` ou clique
na linha.

## Listas, prévias e alterações

Pressione `Tab` ou `Shift+Tab` para trocar o foco entre painéis.
Use `↑`, `↓`, `PgUp`, `PgDn`, `Home` e `End` para navegar pela lista
ou rolar a prévia. Os títulos dos painéis ficam dentro da borda. O painel
em foco destaca o título e a borda.

Use `/` nas listas de Theme, Catalog, Components, Skills, Deps, MCP,
Viewspecs e Captures para filtrar. Digite na barra de teclas. A lista
ignora acentos e diferenças entre maiúsculas e minúsculas. O título
mostra a quantidade visível, o total e a busca. Pressione `Enter` para
manter o filtro ou `Esc` para restaurar a busca anterior. Apague o texto
e pressione `Enter` para limpar.

Nas listas de seleção múltipla, use `Space` para marcar o item, `a`
para marcar os itens visíveis e `n` para limpar. Confira no título
quantos itens estão marcados.

Pressione o atalho de escrita para ver o plano com os comandos ou arquivos.
Pressione a mesma tecla de novo para executar. Outra tecla cancela o
plano. Acompanhe a execução no painel de progresso, com o medidor, o
tempo decorrido e os passos recentes. Consulte o resultado antes de
voltar à lista. A tela recarrega os dados depois da execução.

O mouse vem ligado em `tui.mouse`. Clique nas linhas para selecioná-las
e use a roda para rolar listas e prévias. Use `Shift` e arraste para
selecionar texto na maioria dos terminais. Ajuste `tui.mouse` para
`false` se quiser devolver o mouse ao terminal.

## Tema, ícones e tamanhos

Use `T` ou clique no chip do cabeçalho para alternar entre `terminal`,
`night` e `day`. A mudança mantém o módulo aberto e grava
`tui.theme`. `terminal` herda as cores do terminal. `night` e `day`
usam petróleo, menta e âmbar da marca Designfy.

Configure `tui.icons` com `auto`, `nerd`, `unicode` ou `ascii`.
`auto` usa Nerd Font no Ghostty, Kitty, WezTerm e Omarchy, ASCII no
console Linux e Unicode nos demais terminais. Use `tui.motion=false`
para desativar as animações curtas de diálogos e toasts.

A Home usa três colunas a partir de 110 células, duas entre 80 e 109
e uma abaixo de 80. Role para ver os cartões seguintes. Com menos de
32 linhas, a TUI compacta o conteúdo. Abaixo de 60×16, amplie o terminal
para voltar à tela ativa.

## Quadro da Home

```text
    ◆ Designfy   v0.1.0  ⌂ Home  fixture-project · react-vite                                             T night   linux-x64 · Bun 0.0.0

    › Install dependencies   [Enter]

   ╭─ 1 ◐ Theme ─────────────────────────────╮  ╭─ 2 ≡ Catalog ────────────────────────────╮  ╭─ 3 λ Components ────────────────────────╮
   │ globals.css                             │  │ 80 patterns                              │  │ Registry · react-vite                   │
   │ ██ ██ ░░ ░░ ░░ ░░ ░░                    │  │ site   ━━━━━━━━━━━━ 32                   │  │ Copied ━━━━━━━━ 0/58 0%                 │
   │ ✓ 18.88:1 FG / BG                       │  │ system ━━━━━━━━     22                   │  │                                         │
   │ Inter, sans-serif                       │  │ both   ━━━━━━━━━━   26                   │  │                                         │
   ╰─────────────────────────────────────────╯  ╰──────────────────────────────────────────╯  ╰─────────────────────────────────────────╯

   ╭─ 4 ⇌ Skills ────────────────────────────╮  ╭─ 5 ◉ Deps ───────────────────────────────╮  ╭─ 6 ⇌ MCP ───────────────────────────────╮
   │ Installed ━━━━━━━━ 1/16 6%              │  │ Present ━━━━━━━━ 1/13 7%                 │  │ 3 servers in catalog                    │
   │ 11 internal · 5 external                │  │ ! 12 missing                             │  │ ○ claude 0  ○ codex 0                   │
   │ ● designfy installed                    │  │                                          │  │ ○ opencode 0  ○ cursor 0                │
   │                                         │  │                                          │  │ ○ gemini 0                              │
   ╰─────────────────────────────────────────╯  ╰──────────────────────────────────────────╯  ╰─────────────────────────────────────────╯

   ╭─ 7 ≡ Viewspecs ─────────────────────────╮  ╭─ 8 ❯ Captures ───────────────────────────╮
   │ ✓ Guide · 33 rules                      │  │ 2026-11-24-test                          │
   │ Draft            0                      │  │ 2026-11-24 · 1 shots                     │
   │ Active  ━━━━━━━━ 1                      │  │ ✗ 1 overflowX                            │
   │ Waiting          0                      │  │                                          │
   │ Done             0                      │  │                                          │
   │ Archive          0                      │  │                                          │
   │ Checklist ━━━━━━━━ 1/6 16%              │  │                                          │
   ╰─────────────────────────────────────────╯  ╰──────────────────────────────────────────╯

   ╭─ 9 ⌂ Project ───────────────────────────╮  ╭─ 0 ⚙ Settings ───────────────────────────╮  ╭─ c ◈ Credentials ───────────────────────╮
   │ react-vite · npm                        │  │ 13 settings                              │  │ 0 credentials                           │
   │ Tailwind 4 · shadcn no                  │  │ night                                    │  │ Project and user vault                  │
   ╰─────────────────────────────────────────╯  ╰──────────────────────────────────────────╯  ╰─────────────────────────────────────────╯

   ╭─ d ≡ Docs ──────────────────────────────╮  ╭─ a ℹ About ──────────────────────────────╮
   │ 6 topics                                │  │ v0.1.0                                   │
   │ Built-in reference                      │  │ Designfy                                 │
   ╰─────────────────────────────────────────╯  ╰──────────────────────────────────────────╯
   1 installed  ·  0 copied  ·  12 missing deps  ·  1 open viewspecs  ·  1 overflowX

    Enter  open   r  reload  │   T  theme   ^K  commands   ?  help   q  quit
```

Os quadros de referência usam a paleta `night` e os ícones Unicode.
Rode `bun test tests/tui-designfy.test.ts` para compará-los. Use
`UPDATE_SHOWCASE=1 bun test tests/tui-designfy.test.ts` para recriar os
quadros após uma mudança visual.
