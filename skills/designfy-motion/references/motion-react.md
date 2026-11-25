# motion/react

A biblioteca Motion (pacote `motion`, antes Framer Motion) entra quando o
CSS não resolve. Documentação: <https://motion.dev/docs/react>. Confira a
API atual antes de usar algo que não está aqui.

```bash
designfy deps install motion
```

```tsx
"use client";
import { motion, AnimatePresence, LayoutGroup, MotionConfig, useReducedMotion } from "motion/react";
```

Importe de `motion/react`. Nunca de `framer-motion`.

## Quando usar

| Preciso de | CSS resolve? | Use |
| --- | --- | --- |
| hover, pressão, cor | sim | classes |
| entrada ao aparecer | sim | `data-df-reveal`, ou `Reveal` |
| abrir e fechar altura | sim | `df-collapse` |
| saída animada de quem sai do DOM | não | `AnimatePresence` |
| indicador que viaja entre itens | não | `layoutId` |
| itens que trocam de lugar | não | `layout` |
| arrastar, soltar, deslizar com o dedo | não | `drag`, `Reorder` |
| número ou valor com mola | não | `useSpring`, `AnimateNumber` |
| valor ligado à rolagem com cálculo | em parte | `useScroll`, `useTransform` |
| sequência com lógica | não | `useAnimate` |

## Entrada e variantes

```tsx
const item = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

<motion.ul initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}
  variants={{ shown: { transition: { staggerChildren: 0.06 } } }}>
  {items.map((i) => <motion.li key={i.id} variants={item}>{i.title}</motion.li>)}
</motion.ul>
```

- `variants` nomeia estados; o pai propaga o nome aos filhos e controla a
  sequência com `staggerChildren` e `delayChildren`.
- `viewport={{ once: true }}`: a entrada roda uma vez.
- Durações em segundos. Use as mesmas dos tokens (0.15, 0.25, 0.5, 0.8) e
  as curvas de [assets/presets-motion.ts](../assets/presets-motion.ts).

## Presença: animar a saída

```tsx
<AnimatePresence mode="wait" initial={false}>
  {open ? (
    <motion.div key="panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }} />
  ) : null}
</AnimatePresence>
```

- O filho direto precisa de `key`.
- `mode="wait"` espera a saída antes da entrada (troca de etapa);
  `mode="popLayout"` tira o que sai do fluxo (lista).
- `initial={false}` evita animar na primeira renderização.
- Saída mais curta que a entrada.

## Layout: o que muda de lugar e de tamanho

```tsx
<LayoutGroup>
  {tabs.map((tab) => (
    <button key={tab.id} onClick={() => setActive(tab.id)} className="relative px-3 py-2">
      {active === tab.id ? (
        <motion.span layoutId="tab-indicator" className="absolute inset-0 rounded-md bg-muted"
          transition={{ type: "spring", duration: 0.35, bounce: 0 }} />
      ) : null}
      <span className="relative">{tab.label}</span>
    </button>
  ))}
</LayoutGroup>
```

- `layoutId` igual em dois elementos faz um virar o outro: indicador de
  aba, marcador da barra lateral, cartão que vira diálogo.
- `layout` num item anima a mudança de posição e tamanho causada por
  outra mudança (ordenar, filtrar, expandir).
- `bounce: 0` para interface. Mola com retorno só em momento de marca.
- Lista longa com `layout` custa caro: limite a dezenas de itens.

## Rolagem

```tsx
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
return <motion.div ref={ref} style={{ y }} />;
```

- `useScroll()` sem alvo dá o progresso da página (barra de leitura).
- `useTransform` mapeia o progresso para um valor de estilo.
- Valores de movimento não renderizam de novo o componente: o estilo é
  aplicado direto.
- Prefira a animação ligada à rolagem em CSS quando não há cálculo.

## Gestos

```tsx
<motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }} />
<motion.div drag="x" dragConstraints={{ left: -120, right: 0 }} dragElastic={0.1} onDragEnd={onEnd} />
```

`whileHover` e `whileTap` só quando o componente já usa Motion; para o
resto, CSS. `Reorder.Group` e `Reorder.Item` fazem lista reordenável com
teclado tratado à parte.

## Números

```tsx
const value = useSpring(0, { duration: 600, bounce: 0 });
useEffect(() => { value.set(target); }, [target]);
```

Para contador que só sobe uma vez, `data-df-count` basta. Para valor que
muda ao vivo, `@number-flow/react` rola só os dígitos que mudam.

## Movimento reduzido

```tsx
const reduced = useReducedMotion();
if (reduced) return <div className={className}>{children}</div>;
```

Ou, para a árvore inteira:

```tsx
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

`reducedMotion="user"` desliga transformações e animações de layout para
quem pediu menos movimento e mantém opacidade e cor. Ponha no layout raiz
de todo projeto que usa Motion. Onde o movimento é parte do conteúdo
(faixa que rola, troca automática), trate à mão com `useReducedMotion()`.

## Peso

```tsx
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

<LazyMotion features={domAnimation}><m.div animate={{ opacity: 1 }} /></LazyMotion>
```

`LazyMotion` com `domAnimation` carrega o essencial (animações, variantes,
saída, gestos de toque e hover); `domMax` acrescenta layout e arrastar.
Use em site público onde cada quilobyte conta. Em sistema, o `motion`
completo é aceitável.

## Servidor

Componentes `motion.*` são de cliente. Num projeto com componentes de
servidor, o arquivo leva `"use client"`. O HTML do servidor sai com o
estado de `initial`; por isso, para conteúdo acima da dobra, prefira CSS,
que não esconde nada antes da hidratação. Com `initial={false}` o
elemento nasce no estado final.

## Em ilha do Astro

Componente com Motion vai numa ilha (`client:visible` abaixo da dobra).
Seção estática com revelação continua em `.astro` com `data-df-reveal`,
sem enviar a biblioteca.
