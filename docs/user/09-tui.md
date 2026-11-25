# Capítulo 9: TUI

Na Home do Designfy, uma captura com rolagem horizontal aparece no cartão Captures como `overflowX`. Abra o módulo para selecionar o viewport e copiar o caminho da imagem. O cartão Viewspecs mostra outra parte da revisão da tela, o avanço da checklist. Uma captura sem transbordamento ainda pode ter uma pendência de teclado, como as setas do carrossel na revisão do Plano Founders.

## Abrir a Home ou ir direto ao tema

Abra a TUI na raiz do projeto, num terminal com entrada e saída interativas. O primeiro comando abre a tela definida em `tui.initialTab`, por padrão a Home (`overview`). O segundo abre Theme só para esta sessão.

```bash
designfy
designfy tui --tab theme
```

A opção `--tab` aceita os IDs dos módulos numerados: `theme`, `catalog`, `components`, `skills`, `deps`, `mcp`, `viewspecs`, `captures`, `project` e `settings`. Para abrir uma das telas auxiliares, use `credentials`, `docs` ou `about`. O ID da Home é `overview`.

O cabeçalho identifica a pasta e o framework ao lado da marca, da versão e da trilha de navegação. Quando falta espaço, a TUI abrevia a pasta e oculta a plataforma. Na largura completa, também aparecem a versão do Bun e o chip do tema. Clique na marca para voltar ao menu. Dentro de um módulo, o chip `← Back` também leva você à Home.

## Ler os cartões da Home

A faixa acima dos cartões aponta a primeira pendência do projeto. A inicialização vem antes do tema. Depois do tema vêm o guia, a instalação de dependências e a retomada de um viewspec aberto, nessa ordem. Na Home de referência abaixo, a faixa indica instalação porque ainda faltam 12 pacotes.

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

A linha inferior reúne os totais dos cartões. Para localizar a captura com problema nesse exemplo, use `8` ou clique em Captures. Para cuidar dos pacotes, abra Deps com `5`. Na faixa de próximo passo, um clique ou `Enter` abre o módulo indicado. Quando as verificações da faixa estão satisfeitas, aparece `All set`.

Na grade, mova o foco com as setas ou com `h`, `j`, `k` e `l`. Abra o cartão com `Enter` ou `Space`. Depois de uma alteração fora da TUI, pressione `r` na Home para atualizar os resumos.

## Atalhos dos módulos

A borda e o título destacam o painel com foco. Em Components, por exemplo, você percorre a lista num painel e consulta os arquivos do componente no outro. A mesma letra pode executar ações diferentes conforme o módulo. Confira a barra inferior antes de usá-la.

| Tecla | Módulo | Painéis | Teclas do módulo |
| --- | --- | --- | --- |
| | Home | próximo passo, cartões e totais | `Enter` abre, `r` relê, `c`, `d`, `a` abrem Credentials, Docs e About |
| `1` | Theme | tokens com amostra truecolor e detalhe da cor com contraste WCAG | `t` claro e escuro, `g` grupo, `Enter` cor, `/` filtro, `r` relê |
| `2` | Catalog | padrões por categoria e detalhe com uso, anatomia, estados, responsivo, movimento, acessibilidade, tokens e fontes | `s` superfície, `k` tipo, `Enter` detalhe, `/` filtro, `r` recarrega |
| `3` | Components | registro por categoria e detalhe com arquivos e dependências | `f` React e Astro, `Space` marca, `a` marca os visíveis, `n` limpa, `i` copia, `Enter` detalhe |
| `4` | Skills | skills por tipo, com origem, escopo e estado, e detalhe | `g` tipo, `Space` marca, `a` marca os visíveis, `n` limpa, `i` instala, `u` atualiza, `d` remove |
| `5` | Deps | grupos e detalhe das versões declarada e instalada | `Space` marca, `a` marca os visíveis, `n` limpa, `c` confere, `i` instala, `Enter` detalhe |
| `6` | MCP | servidores do catálogo e estado por cliente | `Space` marca, `a` marca os visíveis, `n` limpa, `c` cliente, `f` substitui, `i` grava |
| `7` | Viewspecs | guia, telas, estados e medidores de checklist | `v` guia e telas, `s` estado, `Enter` lê o arquivo, `Tab` volta |
| `8` | Captures | execuções, viewports, imagens, tamanhos e erros | `Enter` seleciona a imagem, `o` copia o caminho, `/` filtro, `r` recarrega |
| `9` | Project | ambiente, estado do Designfy e próximos passos | `r` recarrega, `c` copia a configuração MCP |
| `0` | Settings | key, valor e padrão, com detalhe | `Enter` ou `e` edita, `x` ou `Delete` restaura, `r` recarrega |
| `c` na Home | Credentials | nomes, origem da master key e total do cofre | `a` adiciona, `Enter` ou `e` edita, `d` ou `Delete` remove |
| `d` na Home | Docs | índice de tópicos e o documento em Markdown | `t` escolhe o tópico e as teclas de rolagem |
| `a` na Home | About | binário, licença, links e créditos | `c` copia o link do projeto |

O atalho numérico funciona também dentro de outro módulo. Já as letras `c`, `d` e `a` abrem Credentials, Docs e About a partir da Home. Para procurar um módulo pelo nome, abra a paleta com `Ctrl+K` ou `:` e digite as letras em sequência.

## Navegar entre painéis

Use as teclas globais quando precisar mudar de painel, voltar ao menu ou sair da TUI. Você também pode clicar no chip correspondente na barra inferior. Um divisor separa os atalhos do módulo dos comandos globais.

| Tecla | Ação |
| --- | --- |
| `1` a `9` e `0` | abre o módulo numerado, de qualquer tela |
| `Tab` e `Shift+Tab` | move o foco entre os painéis |
| setas, `PgUp`, `PgDn`, `Home` e `End` | move a seleção ou rola a prévia |
| `Esc` ou `Backspace` | volta à Home (na Home, `Esc` sai) |
| `Ctrl+K` ou `:` | abre a paleta de comandos |
| `T` | alterna o tema |
| `?` | abre ou fecha o help |
| `q` ou `Ctrl+C` | sai |

Dentro de um módulo, `Esc` volta à Home. Na Home, a mesma tecla encerra a sessão. Para consultar as teclas disponíveis e continuar no ponto atual, abra a ajuda com `?` e pressione `?` de novo para fechar.

## Filtrar uma lista e conferir uma instalação

Abra a busca com `/` na lista do módulo. O filtro funciona nos oito módulos numerados de Theme a Captures e ignora maiúsculas e acentos. O título mostra a busca e quantos itens continuam visíveis em relação ao total. Use `Enter` para conservar o filtro ou `Esc` para recuperar a busca anterior.

Em Skills, por exemplo, `Space` marca uma skill e `a` marca as que aparecem no filtro. Confira a seleção antes de usar `i`. Você pode limpar as marcas com `n`. Ao instalar, o primeiro toque em `i` abre o plano com os comandos previstos. Repita o atalho para executar ou use outra tecla para cancelar o plano. Durante a execução, o painel mostra o tempo decorrido e os passos recentes até chegar ao resultado.

## Paleta, ícones e seleção de texto

A tecla `T` e o chip do cabeçalho alternam a paleta sem fechar o módulo. A escolha fica em `tui.theme`. Use `terminal` para herdar as cores do seu terminal. As opções `night` e `day` aplicam as cores da marca, com petróleo, menta e âmbar.

A preferência `tui.icons` aceita `nerd`, `unicode`, `ascii` ou `auto`. No modo automático, Ghostty, Kitty, WezTerm e Omarchy usam Nerd Font. O console Linux recebe ASCII e os demais terminais recebem Unicode. Para copiar texto com o mouse da TUI ligado, segure `Shift` enquanto arrasta. Use `tui.mouse=false` para devolver a seleção ao terminal ou `tui.motion=false` para desligar as animações breves dos diálogos e avisos.

## Largura e altura do terminal

A grade usa três colunas a partir de 110 células de largura. Entre 80 e 109 cabem duas. Abaixo de 80, os cartões ocupam uma coluna. Com menos de 32 linhas, a barra compacta conserva `? help` e `q quit`. O mínimo para usar a TUI é 60 colunas por 16 linhas. A mensagem para ampliar a janela aparece quando uma das medidas fica abaixo desse limite. Fora de um terminal interativo, o comando explícito `designfy tui` encerra com código 8.
