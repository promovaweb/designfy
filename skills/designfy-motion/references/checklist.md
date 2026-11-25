# Checklist de movimento

## Presença

- [ ] A tela tem movimento de entrada na primeira dobra.
- [ ] Cada seção abaixo da dobra tem revelação ou outro movimento.
- [ ] Todo controle responde: hover, foco visível, pressão.
- [ ] Toda troca de estado tem transição (abrir, fechar, selecionar, validar, carregar).
- [ ] Em site: nenhuma tela de rolagem inteira sem algo em movimento.
- [ ] Em sistema: movimento contido, sem laço decorativo nas telas de trabalho.

## Função

- [ ] Cada movimento tem uma função dita no viewspec.
- [ ] Um foco por vez; nada disputa atenção com o que a pessoa lê.
- [ ] No máximo um movimento contínuo por tela visível (dois no caráter expressivo).
- [ ] Nenhum número animado que não seja real.

## Técnica

- [ ] Só `transform`, `opacity`, `clip-path`, `mask` e `background-position`.
- [ ] Nenhum `transition-all`; nenhuma animação de `width`, `height`, `top`, `left`, `margin`, `padding`.
- [ ] Durações e curvas pelos tokens do tema.
- [ ] Saída mais rápida que a entrada.
- [ ] Sequência com no máximo 500 ms no total.
- [ ] Sem quique em estado de interface.
- [ ] Anel de foco sem transição.
- [ ] Um sinal de hover por elemento, no contêiner; nada reage sem ser interativo.
- [ ] `motion/react` só onde o CSS não resolve; importado de `motion/react`.

## Robustez

- [ ] Com JavaScript desligado, todo o conteúdo está visível.
- [ ] Revelações rodam uma vez.
- [ ] Laços pausam no hover, no foco e fora da tela.
- [ ] Movimento com mais de 5 segundos e conteúdo tem controle de pausa.
- [ ] Espaço reservado para tudo que entra; nada desloca o layout.

## Movimento reduzido

- [ ] Captura com `--reduced-motion` mostra todo o conteúdo no estado final.
- [ ] Contadores com o valor final e gráficos desenhados.
- [ ] Faixas e fundos parados em posição coerente.
- [ ] Indicadores de progresso continuam (`df-keep-motion`).
- [ ] `MotionConfig reducedMotion="user"` no layout raiz de projeto com Motion.

## Fluidez

- [ ] Rolagem sem travar com a CPU reduzida em 4 vezes.
- [ ] Nenhum `will-change` em classe genérica.
- [ ] Entrada acima da dobra em CSS.

## Registro

- [ ] Seção `## Movimento` do viewspec atualizada com o que foi implementado.
- [ ] Itens marcados na checklist do viewspec.
- [ ] Padrão novo levado a `## Movimento` do guia.
