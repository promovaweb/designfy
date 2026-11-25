# Contraste

Todo par de texto e fundo é medido antes de entrar no tema. O Designfy
mede pela WCAG 2.2 (razão) e informa o Lc do APCA como segunda leitura.

## Limites

| O quê | WCAG 2.2 AA | APCA (Lc) |
| --- | --- | --- |
| texto corrido | 4.5:1 | 60 |
| texto corrido confortável | 7:1 | 75 |
| texto grande (24 px, ou 19 px em negrito) | 3:1 | 45 |
| ícone com função, borda de campo, anel de foco, estado de controle | 3:1 | 45 |
| texto de controle desativado e decoração | livre | livre |

Meta do Designfy: `foreground` sobre `background` em 7:1 ou mais;
`muted-foreground` em 4.5:1 ou mais sobre `background`, `muted` e `card`.

## Medir

```bash
designfy theme check                       # todos os pares do tema, claro e escuro
designfy palette contrast "#5F7D8C" "#FFFFFF"
designfy palette contrast "oklch(0.47 0.085 192)" "oklch(0.985 0.004 195)" --min 4.5
```

`theme check` confere estes pares nos dois temas: `foreground` em
`background`; `card-foreground` em `card`; `popover-foreground` em
`popover`; `primary-foreground` em `primary`; `secondary-foreground` em
`secondary`; `accent-foreground` em `accent`; `muted-foreground` em
`muted` e em `background`; `destructive-foreground` em `destructive`. A
saída 10 lista cada par abaixo de 4.5 e cada papel que falta.

Pares que o comando não conhece e você precisa medir à mão:

- texto sobre faixa tingida com transparência (`bg-muted/60`);
- texto sobre fundo com padrão ou imagem: meça no ponto mais claro e no
  mais escuro atrás do texto;
- `success`, `warning` e `info` usados como cor de texto sobre
  `background`;
- séries de gráfico sobre `card`;
- anel de foco sobre a superfície que ele contorna.

## Corrigir um par reprovado

Mexa na luminosidade, um passo por vez, e meça de novo.

| Par | Tema claro | Tema escuro |
| --- | --- | --- |
| `muted-foreground` em `background` | escureça o texto (`L` para 0.45 a 0.5) | clareie o texto (`L` para 0.7 a 0.75) |
| `primary-foreground` em `primary` | escureça `primary` até texto claro passar, ou troque o texto para um tom escuro quando a base é clara | use a base clara com texto escuro |
| `accent-foreground` em `accent` | `accent` bem claro (`L` 0.92 ou mais) com texto escuro do mesmo matiz | `accent` escuro (`L` 0.3 a 0.38) com texto claro |
| `destructive-foreground` em `destructive` | `destructive` com `L` até 0.55 | `L` de 0.68 a 0.72 com texto escuro |
| borda de campo em `background` | `--input` com `L` 0.86 ou menos | `L` 0.36 ou mais |

Não resolva contraste com peso de fonte, sombra de texto ou tamanho maior
fora da regra de texto grande.

## Texto sobre cor e sobre imagem

- Superfície colorida usa o seu `*-foreground`, nunca `muted-foreground`.
  Cinza sobre cor reprova quase sempre.
- Sobre imagem ou vídeo: uma película (`bg-background/70` ou um gradiente
  da cor de fundo) entre a mídia e o texto, medida no ponto mais difícil.
- Sobre padrão de fundo: use a máscara do componente `Background`
  (`fade="radial"` ou `fade="bottom"`) quando o preset é `needs-fade`.

## Estado não depende só de cor

Erro, sucesso, aviso, selecionado e desativado têm também texto, ícone,
traço ou posição. Em gráfico, cada série tem rótulo direto ou marcador
diferente.

## Registrar no guia

Na seção Cores do `VIEWSPEC.md`, escreva os pares usados com a razão
medida nos dois temas, como regra de origem `@revisão`:

```markdown
- `foreground` sobre `background` mede 15,4:1 no claro e 14,2:1 no escuro. `@revisão` {#c002}
```
