# Componentização

Quando extrair um componente, como desenhar as propriedades e como manter
as peças combinando entre si.

## Quando extrair

Extraia quando pelo menos uma vale:

- a mesma estrutura aparece pela segunda vez;
- a peça tem estado ou comportamento próprio (abre, valida, carrega);
- a peça tem um nome no domínio ("cartão de pedido", "linha de turma");
- o arquivo da tela passou de uma tela de leitura e a região tem começo e
  fim claros.

Não extraia para "organizar": um `div` com três classes usado uma vez
continua na tela.

## Três níveis

| Nível | Exemplo | Sabe do domínio? | Onde fica |
| --- | --- | --- | --- |
| primitivo | botão, campo, diálogo | não | `components/ui` (shadcn) |
| composição | cartão de indicador, cabeçalho de página, hero | não | `components/designfy` |
| componente de domínio | `OrderStatus`, `CursoCard` | sim | `components/<área>` do projeto |

Um nível só importa dos níveis abaixo. Componente de domínio recebe o
dado tipado (`order`), não vinte propriedades soltas.

## Propriedades

- **Conteúdo** entra por propriedade ou por `children` e slots. Nada de
  texto fixo.
- **Variação** entra por uma propriedade de valores fechados
  (`variant="outline"`, `size="sm"`, `tone="muted"`), nunca por classe
  solta que muda cor.
- **`className`** (React) ou `class` (Astro) sempre aceito e mesclado por
  último com `cn`, para ajuste de layout por quem usa (margem, largura,
  ordem). Não é porta para trocar cor.
- **Booleano** só para o que é mesmo liga e desliga (`disabled`,
  `loading`). Dois booleanos que se excluem viram uma propriedade de
  valores.
- **Padrões** para tudo o que tem um caso comum. O uso mínimo funciona com
  duas ou três propriedades.
- **Nomes iguais** entre React e Astro e entre componentes irmãos:
  `title`, `lead`, `items`, `primaryAction`, `headingLevel`.
- **Nível do título** por `headingLevel`; o componente não adivinha.
- **Região opcional** some quando a propriedade falta. Sem caixa vazia.

## Variações com `cva`

```ts
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-secondary-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        destructive: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
```

Cada variação lista só papéis do tema. Modelo em
[assets/variantes-cva.ts](../assets/variantes-cva.ts). Confira o contraste
de cada combinação de fundo e texto.

## Composição em vez de configuração

Componente com dez propriedades opcionais vira peças que se encaixam:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Receita</CardTitle>
    <CardAction><PeriodMenu /></CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>
```

Use `children` e subcomponentes quando a ordem ou o conteúdo das partes
varia; use propriedades quando a estrutura é fixa e só o dado muda.

## Uma função por componente

- Componente de apresentação não busca dado.
- Quem busca dado entrega para o de apresentação os estados prontos:
  `loading`, `error`, `data`.
- Componente não conhece a própria rota; recebe `href`.

## Anatomia de um arquivo

1. Cabeçalho de documentação: o que é, propriedades, slots, movimento.
2. Tipos das propriedades, com um comentário por propriedade.
3. Constantes de variação.
4. O componente.
5. Subcomponentes pequenos, quando só ele usa.

Modelos: [assets/componente-react.tsx](../assets/componente-react.tsx) e
[assets/Componente.astro](../assets/Componente.astro).

## Padronizar um projeto que já existe

1. Liste os componentes que fazem a mesma função com nomes diferentes
   (três botões, dois cartões).
2. Escolha o que fica, pelo catálogo de interface.
3. Troque cores e fontes literais pelos papéis do tema.
4. Substitua os duplicados tela a tela, com captura antes e depois.
5. Registre em `## Componentes` do guia o componente adotado para cada
   função.

Faça isso por viewspec, uma tela por vez. Troca em massa sem captura
quebra tela sem ninguém ver.
