# Astro

Regras para componentes `.astro` e para ilhas React num site Astro.

## Estático por padrão

Um componente `.astro` rende HTML no build e não envia JavaScript. É a
escolha certa para quase tudo num site: cabeçalho, hero, seções, cartões,
rodapé, artigo. Movimento de entrada, hover e faixas rolantes saem em CSS
(`designfy-motion.css`), sem ilha.

## Forma de um componente

```astro
---
/**
 * FeatureGrid: apresenta de três a seis recursos com o mesmo peso.
 * Slots: default (conteúdo extra abaixo da grade).
 * Movimento: os itens entram em sequência (data-df-stagger).
 */
interface Item {
  title: string;
  description: string;
  href?: string;
}

interface Props {
  /** Recursos, na ordem de leitura. */
  items: Item[];
  /** Colunas no desktop. Padrão 3. */
  columns?: 2 | 3;
  class?: string;
}

const { items, columns = 3, class: className } = Astro.props;
---

<ul class:list={["grid gap-6 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", className]} data-df-stagger>
  {items.map((item) => (
    <li class="min-w-0 rounded-xl border border-border bg-card p-6" data-df-reveal>
      <h3 class="font-heading text-title font-semibold">{item.title}</h3>
      <p class="mt-2 text-muted-foreground">{item.description}</p>
    </li>
  ))}
</ul>
```

- `interface Props` com comentário por propriedade.
- `class` aceito e aplicado por último com `class:list`.
- Slots nomeados para regiões (`visual`, `background`, `actions`);
  `Astro.slots.has("nome")` para não render a moldura de um slot vazio.
- Estilo pelas classes do Tailwind; `<style>` só para o que classe não
  resolve.

## Scripts

```astro
<script>
  import { initDesignfyMotion } from "@/components/designfy/lib/designfy-motion";
  initDesignfyMotion();
  document.addEventListener("astro:page-load", () => initDesignfyMotion());
</script>
```

- O `<script>` de um componente é empacotado e roda uma vez por página.
  Escreva de modo que rodar de novo não quebre: com transições de página
  (`<ClientRouter />`), o DOM troca e o script precisa reiniciar em
  `astro:page-load`.
- Selecione por atributo `data-*`, não por classe de estilo.
- Limpe observadores quando o elemento sai (`astro:before-swap`).
- `is:inline` só para script que precisa rodar antes da pintura (tema).

## Ilhas

Use ilha React quando há estado no cliente: tabela com ordenação,
formulário com validação viva, menu com teclado, gráfico interativo.

| Diretiva | Quando hidrata | Use para |
| --- | --- | --- |
| `client:load` | na carga | o que precisa responder de imediato (menu do cabeçalho) |
| `client:idle` | quando o navegador fica ocioso | interação secundária acima da dobra |
| `client:visible` | quando entra na tela | tudo o que está abaixo da dobra (formulário, gráfico, carrossel) |
| `client:media="(max-width: 1023px)"` | quando a consulta vale | menu de celular |
| `client:only="react"` | só no cliente, sem HTML do servidor | componente que depende do `window` |

Regras:

- A menor ilha possível. A seção é `.astro`; só o controle interativo é
  React.
- Propriedades serializáveis. Função e componente não atravessam.
- Conteúdo estático dentro da ilha entra por `children` (slot), para o
  HTML existir sem JavaScript.
- Cada ilha é uma árvore React separada. Estado compartilhado entre ilhas
  vai para a URL, para um evento do DOM ou para um store pequeno
  (`nanostores`).
- O que aparece no HTML do servidor não pode depender do `window`, senão a
  hidratação diverge.

## Imagens

```astro
---
import { Image } from "astro:assets";
import foto from "../assets/oficina.jpg";
---
<Image src={foto} alt="" widths={[480, 800, 1200]} sizes="(min-width: 1024px) 50vw, 100vw" />
```

Imagem do hero com `loading="eager"` e `fetchpriority="high"`; as demais
com carregamento tardio. Sempre com dimensões.

## Conteúdo

Texto e dado vêm de coleções de conteúdo (`src/content`) ou de arquivos de
dado. O componente recebe o conteúdo por propriedade; a página lê a
coleção. Markdown e MDX usam o componente `prose` para o corpo.

## Transições de página

Com `<ClientRouter />`, a navegação anima entre páginas. Dê nome ao que
deve acompanhar a transição:

```astro
<img transition:name={`capa-${post.id}`} … />
```

As transições respeitam `prefers-reduced-motion`. Reinicie os scripts em
`astro:page-load`.

## Par com o Astrofy

Em projeto Astro, as skills do
[Astrofy](https://github.com/promovaweb/astrofy) cuidam de arquitetura,
rotas, SEO, conteúdo e deploy. O Designfy cuida da interface. Quando as
duas bibliotecas estão instaladas, a estrutura de pastas e de rotas é do
Astrofy e o desenho dos componentes é do Designfy.
