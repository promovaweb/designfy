# Movimento reduzido e controle de laços

Algumas pessoas sentem tontura, enjoo ou perdem o foco com movimento na
tela. O sistema operacional tem a preferência "reduzir movimento", e o
navegador a entrega como `prefers-reduced-motion: reduce`. Todo movimento
do Designfy tem versão parada.

## O que muda com a preferência ligada

| Movimento | Com movimento reduzido |
| --- | --- |
| entrada e revelação | o conteúdo aparece no estado final, na hora |
| sequência escalonada | tudo junto |
| deslocamento, escala, rotação, máscara | removidos |
| opacidade e cor curtas (até 150 ms) | mantidas |
| laço decorativo, faixa rolante, fundo animado | parado no primeiro quadro; a faixa vira linha estática ou rolável |
| contador | mostra o valor final |
| gráfico | aparece desenhado |
| rolagem suave | rolagem direta |
| animação ligada à rolagem | desligada |
| transição de página | troca direta ou opacidade curta |
| indicador de carregamento | continua (marque com `df-keep-motion`) |
| vídeo de fundo | fica no `poster` |

Reduzir não é remover a informação: o estado final, a mudança e a
resposta continuam visíveis.

## Como o Designfy garante

- `designfy-motion.css` zera duração e repetição de toda animação e
  transição sob `prefers-reduced-motion: reduce` e força as revelações ao
  estado visível.
- O runtime marca tudo como visível e não inicia contadores.
- Componentes React leem `useReducedMotion()` e rendem o estado final; o
  layout raiz usa `<MotionConfig reducedMotion="user">`.
- Movimento escrito direto na classe usa `motion-safe:`.

Ao escrever movimento novo:

```css
@media (prefers-reduced-motion: no-preference) {
  .card { transition: transform var(--duration-base) var(--ease-out-quart); }
  .card:hover { transform: translateY(-2px); }
}
```

Escrever o movimento dentro de `no-preference` é mais seguro que desligar
depois.

## Laços e conteúdo que se move sozinho

Regra da WCAG 2.2 (2.2.2): o que se move, pisca ou rola sozinho por mais
de 5 segundos, ao lado de outro conteúdo, precisa de um jeito de pausar,
parar ou esconder.

| Tipo | Freio |
| --- | --- |
| faixa de logos ou de etiquetas | pausa no hover e no foco (`df-marquee`), para fora da tela |
| faixa com texto que precisa ser lido | botão de pausar visível |
| carrossel que troca sozinho | pausa no hover e no foco e botão de pausar; melhor: troca só por ação |
| visual do hero com estados trocando | pausa no hover e no foco; controle fora da tela, visível no foco por teclado |
| fundo animado | lento (20 s ou mais), sem controle, para fora da tela |
| indicador de progresso | sem freio; termina com a tarefa |

Botão de pausar: `<button aria-pressed>` com nome que diz a ação ("Pausar
animação"), alvo de 44 px.

## Piscar

Nada pisca mais de três vezes por segundo (WCAG 2.3.1). Evite alternância
brusca de claro e escuro em área grande.

## Testar

```bash
designfy capture run <url> --viewport mobile,desktop --reduced-motion --name <slug>-parado
```

Na captura parada, confira:

- todo o conteúdo visível, inclusive o que entra por revelação no fim da
  página;
- contadores com o valor final;
- gráficos desenhados;
- faixas e fundos em posição que faz sentido parada.

No navegador: ferramentas de desenvolvimento, painel de renderização,
"emular prefers-reduced-motion". No sistema: macOS em Acessibilidade,
Tela, Reduzir movimento; Windows em Acessibilidade, Efeitos visuais,
Efeitos de animação.

Também confira com o JavaScript desligado: nada pode ficar invisível.

## Registrar

A seção `## Movimento` do viewspec termina com a linha "Movimento
reduzido:", dizendo como cada item fica. O guia registra o caráter do
projeto e as exceções.
