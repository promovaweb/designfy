# Gravidade e encaminhamento

## Gravidade

| Gravidade | Sentido | Exemplos | O que acontece |
| --- | --- | --- | --- |
| alta | a tela falha no que promete, ou fere uma regra sem exceção | rolagem horizontal; ação principal fora da dobra; texto ilegível ou cortado; conteúdo inventado; erro de script visível; conteúdo que some sem JavaScript ou com movimento reduzido; controle sem foco ou sem nome; contraste abaixo do mínimo; região do viewspec ausente; regra `@pessoa` do guia descumprida | corrige antes de fechar |
| média | a tela funciona, mas parece genérica, desequilibrada ou descuidada | tudo centralizado; seções todas iguais; seção magra; três colunas de ícone por reflexo; tablet sem composição própria; estado vazio sem ação; movimento ausente numa tela de rolagem; regra `@agente` do guia descumprida | corrige, ou registra o motivo em `## Notas` |
| baixa | detalhe de ofício | palavra sozinha na última linha; aspas retas; dois pesos próximos; sombra um pouco forte; alinhamento óptico | responde item a item |

Na dúvida entre duas gravidades, pergunte: a pessoa que usa a tela
percebe e é atrapalhada? Sim, sobe. Só quem desenha percebe, desce.

## A quem devolver

| O achado é sobre | Dona |
| --- | --- |
| cor, contraste do tema, fonte, escala de títulos, espaçamento, container, fundo, raio, sombra, tema escuro | `designfy-design-system` |
| componente errado para a função, estado ausente, propriedade, cor ou fonte literal em componente, dependência faltando | `designfy-components` |
| animação ausente, exagerada, que engasga, sem versão parada, conteúdo escondido por animação | `designfy-motion` |
| ordem das seções, hero, dobra, prova, preço, chamada, cabeçalho e rodapé de site, vício de página gerada | `designfy-websites` |
| medida do texto, artigo, listagem, tabela e código no texto, embed de vídeo | `designfy-content` |
| shell, tabela de dados, formulário, dashboard, CRUD, configurações, estados de tela de sistema | `designfy-systems` |
| estouro, empilhamento, ponto de quebra, alvo de toque, formato no celular | `designfy-responsive` |
| foco, teclado, nomes, semântica, leitor de tela, legendas | `designfy-accessibility` |
| viewspec incompleto ou desatualizado, regra do guia a criar ou mudar | `designfy-viewspec` |
| conteúdo que falta ou está errado, escolha de produto | a pessoa, pela `designfy` |

Achado que toca duas donas vai para a que resolve a causa. "Tabela
estoura no celular" é da `designfy-systems` se falta escolher o formato,
e da `designfy-responsive` se o formato existe e o CSS estoura.

## Formato do achado

```markdown
### 3. Tabela de comparação estoura no celular

- Gravidade: alta
- Captura: `precos-r1` / `precos--mobile.png`, a 2400 px do topo
- Vejo: a tabela passa da borda direita; as duas últimas colunas não aparecem; `overflowX: true` no manifesto
- Regra: viewspec, `## Responsivo`: "um plano por vez com seletor"
- Dona: `designfy-responsive`
- Estado: aberto
```

- "Vejo" descreve o que está na imagem, sem a correção.
- "Regra" aponta de onde vem a exigência: o viewspec, o guia (com o
  `{#id}`), ou uma lista do Designfy.
- Uma causa, um achado. Dez sintomas do mesmo erro viram um achado com a
  lista dos lugares.

## Ordem de correção

1. Alta que afeta todas as larguras (estouro, erro de script, conteúdo).
2. Alta do celular.
3. Alta do desktop.
4. Média, pela ordem das seções.
5. Baixa.

Correções da mesma dona vão juntas, para ela capturar uma vez só.

## Quando o achado contraria a pessoa

Se a pessoa pediu algo que a revisão aponta como defeito (por exemplo, um
texto sobre fundo com pouco contraste), o achado não some: aparece no
relatório com a medida e a consequência, e a pessoa escolhe. A escolha
dela é registrada no guia com origem `@pessoa`. A exceção são as regras
de acesso (contraste mínimo, foco, teclado): a revisão explica quem fica
de fora e propõe a alternativa mais próxima do pedido.

## Levar ao guia

Depois de fechar, pergunte de cada achado de gravidade alta ou média:
pode acontecer de novo em outra tela? Se sim, vira regra, com origem
`@revisão`, na seção do assunto:

```markdown
- Tabela de comparação mostra um plano por vez abaixo de 768 px. `@revisão` {#r006}
```

E a entrada em `## Aprendizados`, com a data e o que a captura mostrou.
