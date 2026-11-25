# Shell e navegação

O shell é a moldura de todas as telas: barra lateral, topo e área
principal. Ele é montado uma vez e não muda entre telas.

## Anatomia

```text
┌───────────┬──────────────────────────────────────────┐
│ produto   │ ☰  trilha            comandos  avisos  eu │  topo
│           ├──────────────────────────────────────────┤
│ grupo     │ Título da página            [ação]       │  cabeçalho da página
│  item     │ descrição                                │
│  item ●   │ ──────────────────────────────────────── │
│ grupo     │                                          │
│  item     │ conteúdo                                 │  área principal
│           │                                          │
│ conta     │                                          │
└───────────┴──────────────────────────────────────────┘
```

Fragmentos: `app-shell`, `sidebar-nav`, `topbar`, `page-header`,
`breadcrumbs`, `command-palette`. Base: o `sidebar` do shadcn e o
`app-shell` do registro.

## Qual navegação

| Sistema | Navegação |
| --- | --- |
| até quatro áreas | barra no topo, sem lateral |
| cinco áreas ou mais | barra lateral com grupos |
| muitas áreas e uso intenso | barra lateral recolhível para trilho de ícones, mais paleta de comandos |
| várias organizações ou espaços | seletor no topo da barra lateral |

## Barra lateral

- Largura de 240 a 280 px; trilho recolhido de 48 a 56 px.
- Itens com ícone e rótulo de uma ou duas palavras, em caixa normal.
- Grupos com título curto; no máximo dois níveis.
- Item atual com `aria-current="page"`, fundo `sidebar-accent` e um
  marcador. Nunca só a cor do texto.
- Contagem ao lado do item (pedidos pendentes) como selo discreto, só
  quando pede ação.
- Rodapé da barra com a conta: avatar, nome e menu (perfil, configurações,
  sair).
- Recolhida, cada ícone tem dica com o nome e continua com nome
  acessível.
- A escolha de recolher é lembrada.
- Papéis próprios: `sidebar`, `sidebar-foreground`, `sidebar-accent`,
  `sidebar-border`.

## Topo

Da esquerda para a direita: botão da barra lateral, trilha, espaço,
gatilho da paleta de comandos (com o atalho escrito), avisos, tema e
conta (quando não está na lateral). Altura de 48 a 56 px. Ganha borda
quando o conteúdo rola por baixo.

## Cabeçalho da página

`page-header`. Toda tela começa com ele.

| Parte | Regra |
| --- | --- |
| título | `h1` com o nome da tela ou do registro |
| descrição | uma linha, opcional |
| ação principal | um botão preenchido, à direita |
| ações secundárias | contorno ou menu "Mais" |
| voltar | link para a lista, em tela de detalhe |
| estado e meta | selo de estado e dados curtos, em detalhe |
| abas ou filtros | linha abaixo, quando a tela tem vistas |

No celular: título em cima, ações embaixo em largura total ou num menu;
a ação principal pode ir para uma barra fixa no pé.

## Área principal

- Largura total com `px-4 md:px-6` e um teto (`max-w-screen-2xl`) em tela
  muito larga. Formulário e leitura têm largura menor (`max-w-2xl`,
  `max-w-3xl`).
- Espaço de 24 px entre regiões, 16 px dentro.
- Painel lateral direito (detalhe, filtros) redimensionável quando o uso
  pede (`react-resizable-panels`).

## Trilha

Em tela com dois níveis ou mais. Último item é a página atual, sem link.
No celular, mostra só o nível pai como "voltar".

## Paleta de comandos

`command-palette` (o `command` do shadcn), aberta por um atalho mostrado
na interface. Lista telas, registros recentes e ações. Não substitui a
navegação: complementa para quem usa todo dia.

## Rotas e foco

- Cada tela, aba que representa lugar e registro aberto tem URL.
- Na troca de rota: o foco vai para o `h1` da nova tela, a área principal
  troca com opacidade curta, o shell não se move e a rolagem volta ao
  topo.
- Link "Pular para o conteúdo" como primeiro elemento focável.
- Marcos: `nav` (lateral, com rótulo), `header` (topo), `main`.

## Celular e tablet

| Largura | Shell |
| --- | --- |
| 1280 px ou mais | lateral aberta |
| 1024 a 1279 px | lateral recolhida em trilho, ou aberta por escolha |
| abaixo de 1024 px | lateral em gaveta, aberta pelo botão do topo |
| celular | topo com menu, título e a ação principal; barra de navegação inferior com até cinco destinos quando o uso é de campo |

A gaveta prende o foco, fecha com Escape e devolve o foco ao botão.

## Movimento

- Lateral recolhe e expande em 200 ms.
- Marcador do item atual desliza.
- Grupos abrem por linhas de grade.
- Área principal troca com opacidade em 150 ms.
- Nada mais se move no shell.

## Erros comuns

- Menu lateral com vinte itens no mesmo nível: agrupe.
- Ícones sem rótulo na lateral aberta.
- Ação principal escondida no fim da página.
- Título da página diferente do item do menu que levou até ela.
- Shell que rola junto com o conteúdo.
