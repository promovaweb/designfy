# Mídia e movimento acessíveis

## Imagens

- Com informação: texto alternativo que diz o que mostra e por que está
  ali.
- Decorativa: `alt=""`; SVG decorativo com `aria-hidden="true"`.
- Texto é texto. Imagem de texto só em logo.
- Gráfico e diagrama: resumo no `alt` ou ao lado, e os dados em tabela
  quando são o conteúdo.
- Imagem que é link: o `alt` é o destino.
- Imagem de fundo com informação precisa de texto equivalente na página.

## Vídeo

| Conteúdo | Exigência AA |
| --- | --- |
| gravado, com fala | legendas sincronizadas |
| gravado, com informação só visual | audiodescrição, ou a informação dita na narração, ou alternativa em texto |
| ao vivo | legendas |
| sem fala (demonstração, ambiente) | alternativa em texto do que acontece |

- Controles alcançáveis por teclado e com nome: reproduzir, pausar,
  volume, legendas, tela cheia.
- Nada toca com som sozinho. Som que começa sozinho por mais de 3
  segundos precisa de controle de parar ou de volume.
- Vídeo de fundo: mudo, com botão de pausar, e parado com movimento
  reduzido.
- Fachada de vídeo: botão com o nome "Reproduzir: título".
- `iframe` com `title`.

```html
<video controls preload="metadata" poster="capa.jpg">
  <source src="aula.mp4" type="video/mp4">
  <track kind="captions" src="aula.pt-BR.vtt" srclang="pt-BR" label="Português" default>
</video>
```

## Áudio

Transcrição em texto para áudio gravado. Player com controles nativos ou
equivalentes por teclado.

## Movimento

A especialista é a `designfy-motion` (referência de movimento reduzido).
O que a acessibilidade exige:

| Exigência | Como |
| --- | --- |
| pausar, parar ou ocultar o que se move sozinho por mais de 5 s ao lado de outro conteúdo | pausa no hover e no foco e controle visível |
| nada pisca mais de três vezes por segundo | sem estrobo, sem alternância brusca de claro e escuro em área grande |
| animação disparada por interação pode ser desligada | `prefers-reduced-motion: reduce` mostra o estado final |
| movimento não é a única forma de dizer algo | mudança de estado tem texto ou ícone |
| foco não anima | anel na hora |
| nada some antes de ser lido | aviso curto com 5 s ou mais, pausando no hover e no foco |

O `designfy-motion.css` zera animações e transições com movimento
reduzido. O que você escrever fora dele entra dentro de
`@media (prefers-reduced-motion: no-preference)` ou com `motion-safe:`.

O que mais incomoda quem tem sensibilidade a movimento: paralaxe, zoom de
tela inteira, giro, fundo que se move atrás do texto, rolagem
sequestrada. Evite por padrão, não só no modo reduzido.

## Conteúdo que aparece e some

- Carrossel: sem troca automática, ou com pausa visível.
- Aviso: não some antes de dar tempo de ler; ação dentro dele alcançável.
- Conteúdo no hover: também no foco; fecha com Escape; fica enquanto o
  ponteiro está sobre ele.
- Sessão com limite de tempo: aviso e extensão.
- Atualização automática de conteúdo: pode ser pausada, ou é anunciada de
  forma educada sem roubar o foco.

## Leitura

- Texto que rola sozinho (letreiro) com informação precisa de pausa.
- Contador regressivo: o tempo restante em texto, anunciado em marcos (a
  cada minuto), não a cada segundo.
- Número que conta ao aparecer: o valor final está no HTML desde o
  início.

## Som e vibração

Som e vibração como aviso têm equivalente visual e em texto. Nada depende
só de ouvir.

## Orientação e ampliação

- A tela funciona em pé e deitada.
- Ampliação por gesto permitida (sem `user-scalable=no`).
- Texto a 200% e tela a 400% sem perda de conteúdo.
- Espaçamento de texto aumentado pela pessoa não corta nada: caixas com
  altura mínima, não fixa.

## Conferir

- [ ] Toda imagem com informação tem texto alternativo; decorativas com `alt=""`.
- [ ] Vídeo com fala tem legendas.
- [ ] Nenhuma mídia toca com som sozinha.
- [ ] Todo movimento contínuo pausa; nada pisca.
- [ ] Captura com movimento reduzido mostra tudo.
- [ ] Controles de mídia operados por teclado.
