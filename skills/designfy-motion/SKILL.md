---
name: designfy-motion
description: Especialista em movimento de interface do Designfy. Define e implementa entrada de página, revelação ao rolar, sequência escalonada, hover e foco, pressão, troca de estado, abrir e fechar, laços e faixas rolantes, contadores, animação ligada à rolagem e transição entre páginas, com Tailwind 4 (animate, transition, starting, motion-safe), CSS moderno (scroll-driven animations, view transitions) e motion/react, sempre com versão parada para prefers-reduced-motion. Use quando a pessoa pedir animação, movimento, motion, transição, microinteração, efeito de rolagem, parallax, marquee, contador animado, hover, ou quando uma tela estiver parada, ou quando a skill designfy chamar esta etapa.
---

# Movimento

No Designfy, movimento é o padrão: toda tela tem algum. Ele existe para
dizer o que entrou, o que respondeu, o que mudou e para onde olhar. Esta
skill escolhe o movimento certo para cada parte da tela, implementa com a
ferramenta mais leve que resolve e garante a versão parada.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Para que serve cada movimento, tokens de duração e curva | [references/principios.md](references/principios.md) |
| O que se move em cada tipo de tela | [references/por-tipo-de-tela.md](references/por-tipo-de-tela.md) |
| Animações e transições com Tailwind 4 e as utilidades do Designfy | [references/tailwind-e-utilidades.md](references/tailwind-e-utilidades.md) |
| Rolagem, transição de página e entradas sem JavaScript | [references/css-moderno.md](references/css-moderno.md) |
| `motion/react`: presença, layout, rolagem, gestos e molas | [references/motion-react.md](references/motion-react.md) |
| Receita pronta por componente | [references/receitas.md](references/receitas.md) |
| Versão parada e controle de laços | [references/movimento-reduzido.md](references/movimento-reduzido.md) |
| Custo, fluidez e o que nunca animar | [references/desempenho.md](references/desempenho.md) |
| Conferência antes de entregar | [references/checklist.md](references/checklist.md) |

Modelos em `assets/`: [plano-de-movimento.md](assets/plano-de-movimento.md)
(como escrever a seção Movimento do viewspec) e
[presets-motion.ts](assets/presets-motion.ts) (variantes e transições para
`motion/react` com os tokens do tema).

## Regras

1. **Toda tela se move.** Entrada, resposta ao toque e ao teclado, troca de
   estado e, em página longa, rolagem. Tela sem movimento só quando o guia
   do projeto pedir, citando a regra.
2. **Todo movimento tem função.** Antes de animar, diga o que ele comunica:
   chegou, respondeu, mudou, continua, olhe aqui. Sem resposta, não entra.
3. **A ferramenta mais leve primeiro.** Ordem: transição em CSS, animação
   em CSS com as utilidades do Designfy, CSS ligado à rolagem,
   `motion/react`. Biblioteca só quando o CSS não faz: saída animada,
   elemento compartilhado, reordenação, gesto, mola.
4. **Só `transform` e `opacity`.** Também `clip-path`, `mask` e
   `background-position`, quando ficam fluidos. Nunca `width`, `height`,
   `top`, `left`, `margin`, `padding`. Nunca `transition-all`.
5. **Durações e curvas pelos tokens.** `--duration-fast` (150 ms) para cor
   e pressão, `--duration-base` (250 ms) para abrir e fechar,
   `--duration-slow` (500 ms) para entrada, `--duration-slower` (800 ms)
   para visual grande. Chegada com curva de saída (`ease-out-expo`), partida
   com curva de entrada, e a saída dura de 60% a 75% da entrada.
6. **Conteúdo visível sem JavaScript.** Revelação só esconde sob a classe
   `.js`, ou roda como animação em CSS que parte do estado visível.
7. **Versão parada sempre.** Com `prefers-reduced-motion: reduce`, o estado
   final aparece na hora; o que precisa continuar (indicador de progresso)
   segue sem deslocamento.
8. **Laço tem freio.** Todo movimento contínuo pausa no hover, no foco e
   fora da tela. Acima de 5 segundos, tem controle de pausa quando carrega
   conteúdo.
9. **Uma revelação por elemento, uma vez.** Não repita a entrada ao rolar
   de volta. Não empilhe subida, escala e desfoque no mesmo elemento.
10. **Um sinal de hover por elemento**, no contêiner. Nada reage ao
    ponteiro se não for interativo.
11. **Sem salto e sem quique** em estado de interface. Mola com retorno só
    em momento de marca, no máximo um por tela.
12. **Foco nunca anima.** O anel de foco aparece na hora.
13. **O que se move fica escrito** na seção Movimento do viewspec e, quando
    vira padrão, em `## Movimento` do guia.

## Passos

### 1. Ler

O viewspec da tela (`## Movimento`, `## Estados`, `## Estrutura`), a seção
`## Movimento` do guia e os tokens de movimento do tema:

```bash
designfy theme show --group motion
```

### 2. Planejar

Com [references/por-tipo-de-tela.md](references/por-tipo-de-tela.md), monte
a lista do que se move usando
[assets/plano-de-movimento.md](assets/plano-de-movimento.md): entrada da
primeira dobra, revelação das seções, hover e pressão, trocas de estado,
laços e rolagem. Para cada linha: gatilho, propriedade, duração, curva e a
versão parada.

### 3. Garantir a base

```bash
designfy components add designfy-motion reveal
```

Confirme que `designfy-motion.css` está importado depois do tema e que o
runtime (`initDesignfyMotion`) roda uma vez por página. Em projeto React,
`designfy deps install motion`.

### 4. Implementar

Do mais leve ao mais pesado, com
[references/receitas.md](references/receitas.md):

1. transições de estado nos componentes (`transition-colors`,
   `df-press`, `df-lift`);
2. entrada da primeira dobra (`animate-df-fade-up` com atraso, ou a
   sequência do componente de hero);
3. revelação das seções (`data-df-reveal`, `data-df-stagger`, ou `Reveal`);
4. abrir e fechar (`df-collapse`, `starting:`, `AnimatePresence`);
5. laços e faixas (`df-marquee`, fundos animados), com pausa;
6. rolagem (barra de progresso, linha que desenha, visual fixo que troca);
7. transição entre páginas, quando o projeto usa.

### 5. Conferir parado e em movimento

```bash
designfy capture run <url> --viewport mobile,desktop --name <slug>-movimento
designfy capture run <url> --viewport mobile,desktop --reduced-motion --name <slug>-parado
```

A captura `--reduced-motion` precisa mostrar todo o conteúdo no estado
final. Depois rode [references/checklist.md](references/checklist.md) e
marque os itens no viewspec.

## Marcos

- Plano de movimento escrito no viewspec.
- Base de movimento instalada e ligada.
- Estados, entrada, revelação, laços e rolagem implementados.
- Captura com movimento reduzido mostrando tudo.
- Regras novas levadas ao guia.

## Saída

A lista do que se move (gatilho, duração, curva), a ferramenta usada em
cada item (CSS, utilidade do Designfy, `motion/react`), os arquivos
alterados, o resultado da captura com movimento reduzido e o que virou
regra no guia.
