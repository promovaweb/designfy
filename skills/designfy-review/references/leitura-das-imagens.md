# Ler o manifesto e examinar as imagens

## 1. O manifesto

`.designfy/captures/<execução>/manifest.json` tem uma entrada por
captura.

| Campo | Leitura |
| --- | --- |
| `overflowX: true` | a página rola na horizontal nessa largura: achado de gravidade alta |
| `documentWidth` e `viewportWidth` | quanto estourou |
| `documentHeight` | celular com altura muitas vezes maior que o desktop indica empilhamento sem corte ou espaço sobrando; página curta demais indica conteúdo que não renderizou |
| `consoleErrors`, `pageErrors` | erro de script, recurso que falhou: achado de gravidade alta quando afeta o que se vê |
| `title` | a página certa carregou; título vazio ou genérico é achado |
| `error` na captura | a URL não respondeu |

Anote os achados do manifesto antes de abrir as imagens.

## 2. A ordem de exame

1. celular, primeira dobra;
2. celular, página inteira;
3. desktop, primeira dobra (1280 x 800 e 1440 x 900);
4. desktop, página inteira;
5. tablet;
6. tela larga (1920);
7. mínimo (320);
8. tema escuro, celular e desktop;
9. movimento reduzido;
10. estados e recortes.

Abra cada PNG. Em imagem de página inteira muito alta, percorra em
trechos de uma tela.

## 3. Três leituras de cada imagem

### De longe: a tela em cinco segundos

Reduza a imagem ou afaste o olhar.

- O que salta primeiro? É o que deveria?
- Dá para dizer do que é a página e qual é a ação?
- Há ritmo (blocos diferentes, respiros) ou tudo tem o mesmo peso?
- Há um buraco (área vazia grande) ou um amontoado?
- O acento aparece como sinal, em poucos pontos?

### De perto: região por região

Para cada região listada em `## Estrutura` do viewspec:

- Está lá, na ordem certa, com o fragmento previsto?
- O conteúdo é o real?
- Alinha com as regiões vizinhas pela mesma margem?
- O espaço dentro é menor que o espaço em volta?
- O texto cabe, sem corte, sobreposição ou linha de uma palavra?
- As imagens têm proporção certa e nitidez?
- Os estados previstos existem?

### Contra as regras

Com o viewspec e o guia abertos:

- cada linha de `## Responsivo` vale na largura correspondente?
- cada regra listada em `guideRules` está aplicada?
- as listas do tipo de tela ([revisao-por-tipo.md](revisao-por-tipo.md))
  e de acabamento ([lista-de-acabamento.md](lista-de-acabamento.md))
  passam?

## 4. O que olhar em cada largura

### Celular, primeira dobra (390 x 844)

- título, frase e ação principal visíveis;
- cabeçalho com marca, ação e menu, sem quebra;
- margem lateral de 16 px ou mais;
- nada cortado na borda direita;
- o visual do hero não empurra a ação para fora da tela.

### Celular, página inteira

- ordem das seções faz sentido de cima para baixo;
- grades em uma coluna, sem item espremido;
- texto do corpo legível, linhas com mais de quatro palavras;
- botões em tamanho de toque, ações empilhadas em largura total;
- tabelas no formato planejado;
- espaços entre seções proporcionais, sem deserto;
- imagens na largura da tela, com proporção;
- rodapé legível, com links espaçados.

### Desktop, primeira dobra (1280 x 800 e 1440 x 900)

- título, frase, ação e foco do visual visíveis em 1280 x 800;
- o hero ocupa uma tela; a seção seguinte começa perto da dobra em
  1440 x 900;
- conteúdo do hero centralizado na altura; visual ao lado do texto;
- nenhuma faixa morta entre o conteúdo e a dobra.

### Desktop, página inteira

- container centralizado, colunas alinhadas de uma seção à outra;
- seções vizinhas diferentes em fundo, composição ou alinhamento;
- nenhuma seção magra com metade vazia;
- títulos de seção com peso suficiente sob o hero;
- texto corrido na medida;
- nenhum item sozinho na última linha de uma grade.

### Tablet (820)

- composição própria: duas colunas onde cabe;
- hero nem espremido nem esticado;
- navegação sem quebra de linha.

### Largo (1920)

- o container não cresceu; as grades não ganharam colunas;
- fundos de borda a borda;
- nada perdido num canto.

### Mínimo (320)

- sem estouro;
- títulos quebram sem cortar palavra;
- ações empilham.

## 5. Tema escuro

- texto secundário legível;
- bordas e divisores visíveis;
- cartão distinguível do fundo;
- imagens e logos com fundo claro tratados;
- sombras sem virar mancha;
- gráficos com séries legíveis;
- estados (erro, sucesso) com contraste.

## 6. Movimento reduzido

- todo o conteúdo visível, do topo ao rodapé;
- contadores com o valor final;
- gráficos desenhados;
- faixas e fundos em posição coerente.

O que está na captura normal e falta na parada é conteúdo que depende de
animação: achado de gravidade alta.

## 7. Sinais de página gerada

Com a imagem aberta, procure os vícios (a lista completa está na
`designfy-websites`, em vícios de página gerada):

- três colunas iguais de ícone, título e texto;
- gradiente roxo e azul; brilho desfocado atrás do texto;
- rótulo pequeno em caixa alta acima dos títulos;
- cartão dentro de cartão;
- tudo centralizado;
- moldura de navegador desenhada;
- número, logo ou depoimento com cara de inventado;
- caixa vazia no lugar de imagem;
- a mesma separação entre todas as seções.

## 8. Anotar

Para cada achado, na hora, sem pensar ainda na correção:

```text
[captura] precos-r1 / precos--mobile.png, perto de 2400 px de altura
[região]  tabela de comparação
[vejo]    a tabela passa da borda direita; as duas últimas colunas não aparecem
[regra]   viewspec, Responsivo: "um plano por vez com seletor"
```

Classifique e encaminhe com
[gravidade-e-encaminhamento.md](gravidade-e-encaminhamento.md).
