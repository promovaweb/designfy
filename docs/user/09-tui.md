# Capítulo 9: TUI

Você digita `designfy` no terminal e a Home abre em forma de menu: a faixa do
próximo passo, um cartão numerado por módulo com o resumo vivo do projeto e a
linha de totais. Não existe barra de abas. Você escolhe o módulo pelo número,
pelas setas ou pelo clique, e volta com o chip `← Back`.

## Abrir

A TUI exige stdin e stdout num terminal interativo. Num pipe, encerra com exit
code 8:

```bash
designfy
designfy tui --tab theme
```

A tela inicial vem de `tui.initialTab`, com `overview` como padrão. O `--tab`
aceita qualquer ID de módulo e tem prioridade sobre a preferência:
`overview`, `theme`, `catalog`, `components`, `skills`, `deps`, `mcp`,
`viewspecs`, `captures`, `project`, `settings`, `credentials`, `docs` e
`about`.

## Cabeçalho e Home

O cabeçalho mostra a marca e a versão, a trilha da tela atual, a pasta do
projeto, o framework, o chip do tema, a plataforma e a versão do Bun. Clique na
marca para voltar à Home; o chip `T` troca a paleta. Quando a largura aperta, a
pasta encurta e a plataforma some.

A Home responde "o que faço agora?" com a faixa de próximo passo. A
ordem é: inicializar o projeto, adicionar o tema, criar o guia, instalar
dependências e continuar um viewspec aberto. A faixa exibe `All set` quando
nada falta. Pressione `Enter` ou clique nela para abrir o módulo indicado.

Abaixo fica a grade de cartões. Cada um traz o resumo vivo do módulo: os tokens
e o contraste no Theme, as superfícies no Catalog, os componentes marcados no
Components, as skills instaladas no Skills, os pacotes no Deps, os clientes no
MCP, o progresso das checklists no Viewspecs, as capturas e o `overflowX` no
Captures. A linha de totais destaca o que pede atenção.

Mova o foco com as setas ou com `h`, `j`, `k` e `l`. Pressione `Enter` ou
`Space` para abrir o cartão, ou clique nele. `r` relê o projeto. `c`, `d` e `a`
abrem Credentials, Docs e About.

## Quadro da Home

```text
    ◆ Designfy   v0.2.0  ⌂ Home  fixture-project · react-vite                                             T night   linux-x64 · Bun 0.0.0

    › Install dependencies   [Enter]

   ╭─ 1 ◐ Theme ─────────────────────────────╮  ╭─ 2 ≡ Catalog ────────────────────────────╮  ╭─ 3 λ Components ────────────────────────╮
   │ globals.css                             │  │ 91 patterns                              │  │ Registry · react-vite                   │
   │ ██ ██ ░░ ░░ ░░ ░░ ░░                    │  │ site   ━━━━━━━━━━━━ 43                   │  │ Copied ━━━━━━━━ 0/69 0%                 │
   │ ✓ 18.88:1 FG / BG                       │  │ webapp ━━━━━━       22                   │  │                                         │
   │ Inter, sans-serif                       │  │ both   ━━━━━━━      26                   │  │                                         │
   ╰─────────────────────────────────────────╯  ╰──────────────────────────────────────────╯  ╰─────────────────────────────────────────╯

   ╭─ 4 ⇌ Skills ────────────────────────────╮  ╭─ 5 ◉ Deps ───────────────────────────────╮  ╭─ 6 ⇌ MCP ───────────────────────────────╮
   │ Installed ━━━━━━━━ 1/17 5%              │  │ Present ━━━━━━━━ 1/13 7%                 │  │ 3 servers in catalog                    │
   │ 11 internal · 6 external                │  │ ! 12 missing                             │  │ ○ claude 0  ○ codex 0                   │
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
   │ 6 topics                                │  │ v0.2.0                                   │
   │ Built-in reference                      │  │ Designfy                                 │
   ╰─────────────────────────────────────────╯  ╰──────────────────────────────────────────╯
   1 installed  ·  0 copied  ·  12 missing deps  ·  1 open viewspecs  ·  1 overflowX

    Enter  open   r  reload  │   T  theme   ^K  commands   ?  help   q  quit
```

## Os módulos

Cada módulo tem um painel de lista e um de detalhe, com o título dentro da
borda. O painel em foco destaca o título e a borda.

| Tecla | Módulo | Painéis | Teclas do módulo |
| --- | --- | --- | --- |
| | Home | próximo passo, cartões e totais | `Enter` abre, `r` relê, `c`, `d`, `a` abrem Credentials, Docs e About |
| `1` | Theme | tokens com amostra truecolor e detalhe da cor com contraste WCAG | `t` claro e escuro, `g` grupo, `Enter` cor, `/` filtro, `r` relê |
| `2` | Catalog | padrões por categoria e detalhe com uso, anatomia, estados, responsivo, movimento, acessibilidade, tokens e fontes | `s` superfície, `k` tipo, `Enter` detalhe, `/` filtro, `r` recarrega |
| `3` | Components | registro por categoria e detalhe com arquivos e dependências | `f` React e Astro, `Space` marca, `a` lista, `n` limpa, `i` copia, `Enter` detalhe |
| `4` | Skills | skills por tipo, com origem, escopo e estado, e detalhe | `g` tipo, `Space` marca, `a` lista, `n` limpa, `i` instala, `u` atualiza, `d` remove |
| `5` | Deps | grupos e detalhe das versões declarada e instalada | `Space` marca, `a` lista, `n` limpa, `c` confere, `i` instala, `Enter` detalhe |
| `6` | MCP | servidores do catálogo e estado por cliente | `Space` marca, `a` lista, `n` limpa, `c` cliente, `f` substitui, `i` grava |
| `7` | Viewspecs | guia, telas, estados e medidores de checklist | `v` guia e telas, `s` estado, `Enter` lê o arquivo, `Tab` volta |
| `8` | Captures | execuções, viewports, imagens, tamanhos e erros | `Enter` imagem, `o` copia o caminho, `/` filtro, `r` recarrega |
| `9` | Project | ambiente, estado do Designfy e próximos passos | `r` recarrega, `c` copia a configuração MCP |
| `0` | Settings | key, valor e padrão, com detalhe | `Enter` ou `e` edita, `x` ou `Delete` restaura, `r` recarrega |
| `c` na Home | Credentials | nomes, origem da master key e total do cofre | `a` adiciona, `Enter` ou `e` edita, `d` ou `Delete` remove |
| `d` na Home | Docs | índice de tópicos e o documento em Markdown | `t` escolhe o tópico e as teclas de rolagem |
| `a` na Home | About | binário, licença, links e créditos | `c` copia o link do projeto |

## Teclas globais

| Tecla | Ação |
| --- | --- |
| `1` a `9` e `0` | abre o módulo numerado, de qualquer tela |
| `Tab` e `Shift+Tab` | move o foco entre os painéis |
| setas, `PgUp`, `PgDn`, `Home` e `End` | move a seleção ou rola a prévia |
| `Esc` ou `Backspace` | volta à Home; na Home, `Esc` sai |
| `Ctrl+K` ou `:` | abre a paleta de comandos |
| `T` | alterna o tema |
| `?` | abre ou fecha o help |
| `q` ou `Ctrl+C` | sai |

A paleta procura módulo e ação, e aceita as letras em sequência. No pé, a barra de teclas mostra os atalhos do módulo, um divisor e os globais; clique
num chip para executar.

## Listas, filtros e planos

Use `/` nas listas de Theme, Catalog, Components, Skills, Deps, MCP, Viewspecs
e Captures. A busca ignora acentos e caixa e o título mostra a quantidade
visível, o total e a busca. Pressione `Enter` para manter o filtro ou `Esc` para
restaurar a busca anterior.

Nas listas de seleção múltipla, `Space` marca o item, `a` marca todos os
visíveis e `n` limpa.

Toda ação de escrita segue o mesmo caminho: você pressiona
o atalho e vê o plano com os comandos ou arquivos; pressiona de novo e a
execução começa; acompanha o medidor, o tempo e os passos recentes; e lê o
resultado. Outra tecla cancela o plano.

## Tema, ícones e mouse

`T` ou o chip do cabeçalho alterna entre `terminal`, `night` e `day`. A mudança
mantém o módulo aberto e grava `tui.theme`. `terminal` herda as cores do
terminal. `night` e `day` usam petróleo, menta e âmbar da marca Designfy e ficam
iguais em qualquer terminal.

`tui.icons` aceita `auto`, `nerd`, `unicode` ou `ascii`. O `auto` usa Nerd Font
no Ghostty, no Kitty, no WezTerm e no Omarchy, ASCII no console Linux e Unicode
nos demais terminais. `tui.motion=false` desliga as animações curtas de
diálogos e toasts. `tui.mouse=false` devolve a seleção de texto ao terminal; com
o mouse ligado, use `Shift` e arraste para selecionar.

## Tamanhos

A Home usa três colunas a partir de 110 células, duas entre 80 e 109 e uma
abaixo de 80. Com menos de 32 linhas, a TUI compacta o conteúdo e mantém
`? help` e `q quit` na barra. Abaixo de 60 por 16, aparece a mensagem de
terminal pequeno até você ampliar.

## Conferir

- `designfy` abre a Home em menu, sem barra de abas, e `q` fecha.
- A faixa de próximo passo abre o módulo que resolve o que falta.
- `1` a `9` e `0` abrem os módulos numerados de qualquer tela.
- O chip `T` e a tecla `T` alternam `terminal`, `night` e `day`.
- `Ctrl+K` encontra um módulo pelo nome.
- Skills, Deps e MCP mostram o plano antes de instalar ou gravar.
- Em 60 por 16 a TUI mostra a mensagem de terminal pequeno.
