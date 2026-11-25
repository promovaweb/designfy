# Temas e modo escuro

## Como o tema troca

A classe `.dark` em `<html>` redefine as variáveis. As utilidades leem as
variáveis no ponto de uso, então nenhum componente precisa de `dark:` para
cor.

```html
<html class="dark">
```

Três estados: claro, escuro e sistema. O padrão é seguir o sistema
(`prefers-color-scheme`) e guardar a escolha da pessoa.

```html
<script is:inline>
  (() => {
    const saved = localStorage.getItem("theme");
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  })();
</script>
```

Esse script fica em linha no `<head>`, antes do CSS, para a página não
piscar. O componente `theme-toggle` do registro traz o script e o botão. Em
React, `next-themes` faz o mesmo com `attribute="class"`.

## Derivar o tema escuro

O tema escuro não é o claro invertido. Cada papel é escolhido de novo:

| Papel | Claro | Escuro |
| --- | --- | --- |
| `background` | `L` 0.97 a 0.99, croma até 0.01 | `L` 0.15 a 0.19, croma 0.015 a 0.02 |
| `card` | branco tingido ou igual ao fundo com borda | 0.03 de `L` acima do fundo |
| `popover` | como `card` | 0.01 acima de `card` |
| `foreground` | `L` 0.18 a 0.24 | `L` 0.93 a 0.96 (não branco puro) |
| `muted-foreground` | `L` 0.45 a 0.5 | `L` 0.7 a 0.75 |
| `primary` | degrau escuro o bastante para texto claro | degrau claro e mais saturado, com texto escuro |
| `border` | `L` 0.9 | `L` 0.3 |
| `destructive`, `success`, `warning`, `info` | `L` perto de 0.5 | `L` 0.7 a 0.82 |
| séries de gráfico | `L` 0.5 a 0.68 | `L` 0.74 a 0.82 |

- Elevação no escuro é luminosidade, não sombra.
- Reduza a saturação de áreas grandes no escuro; cor viva em área grande
  vibra.
- Imagem clara em página escura: uma borda fina resolve; não escureça a
  imagem com filtro.
- O gerador (`designfy palette generate`) já entrega os dois temas com os
  pares medidos.

## Conferir os dois temas

```bash
designfy theme check
designfy capture run http://localhost:4321/ --theme light,dark --name temas
```

`--theme` define o `prefers-color-scheme` do navegador da captura. Projeto
que troca só pela classe guardada precisa respeitar o sistema quando não há
escolha salva, ou a captura escura sai clara.

Olhe nas capturas escuras: bordas que sumiram, sombra que virou mancha,
logo escuro sobre fundo escuro, gráfico sem contraste, imagem com fundo
branco recortada.

## Tema adicional

Uma segunda marca, uma campanha ou uma área do produto ganha um seletor
próprio com os mesmos papéis:

```css
[data-theme="campanha"] {
  --primary: oklch(0.62 0.2 30);
  --primary-foreground: oklch(0.99 0.01 30);
  --ring: oklch(0.62 0.2 30);
}
```

- Redefina só os papéis que mudam.
- Meça os pares do tema novo nos modos claro e escuro.
- Registre no guia quando o tema vale e quem escolhe.

## Página sem tema escuro

Projeto que só tem tema claro declara `themes: [light]` no guia, não rende
o `theme-toggle` e mantém `color-scheme: light` no `:root`, para os
controles nativos não escurecerem sozinhos.
