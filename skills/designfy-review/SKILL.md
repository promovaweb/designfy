---
name: designfy-review
description: Especialista em revisão visual do Designfy com capturas de tela do Playwright. Captura a página ou tela em celular, tablet e desktop, nos temas claro e escuro e com movimento reduzido, lê o manifesto (estouro horizontal, erros de console), examina cada imagem, classifica os achados por gravidade, devolve cada um à especialista responsável e repete até fechar, com a lista de acabamento e a comparação antes e depois. Use quando a pessoa pedir revisão de interface, auditoria visual, captura de tela, print da página, otimização no mobile e no desktop, conferir como ficou, comparar antes e depois, ou quando a skill designfy chamar a etapa final de um viewspec.
---

# Revisão com capturas

Quem construiu a tela é quem menos enxerga os defeitos dela. Esta skill
olha a tela pronta com olhos novos: captura em cada largura, lê os dados
da captura, examina as imagens contra o viewspec e o guia, e só libera
quando os achados estão resolvidos.

A revisão não corrige: aponta, classifica e devolve à especialista dona.
Depois captura de novo e confere.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| O ciclo de capturar, ler, corrigir e repetir | [references/ciclo-de-revisao.md](references/ciclo-de-revisao.md) |
| Capturar: larguras, temas, estados, recortes | [references/capturas.md](references/capturas.md) |
| Ler o manifesto e examinar cada imagem | [references/leitura-das-imagens.md](references/leitura-das-imagens.md) |
| Otimizar celular e desktop a partir das capturas | [references/otimizacao-por-largura.md](references/otimizacao-por-largura.md) |
| Classificar os achados e saber a quem devolver | [references/gravidade-e-encaminhamento.md](references/gravidade-e-encaminhamento.md) |
| O que conferir em cada tipo de tela | [references/revisao-por-tipo.md](references/revisao-por-tipo.md) |
| Os detalhes de ofício | [references/lista-de-acabamento.md](references/lista-de-acabamento.md) |
| Antes e depois em redesenho | [references/antes-e-depois.md](references/antes-e-depois.md) |

Modelos em `assets/`: [relatorio-de-revisao.md](assets/relatorio-de-revisao.md),
[roteiro-de-capturas.md](assets/roteiro-de-capturas.md) e
[pedido-ao-revisor.md](assets/pedido-ao-revisor.md) (para a revisão por
um agente sem o contexto da construção).

## Regras

1. **Nada fecha sem captura.** Todo viewspec termina com capturas de
   celular e desktop feitas depois da última correção, registradas em
   `captures`.
2. **Olhe a imagem.** O manifesto diz se estourou e se houve erro; a
   qualidade só aparece abrindo cada PNG. Relato sem ter aberto as
   imagens não vale.
3. **Olhos novos.** Revise contra o viewspec e o guia, não contra a
   memória da construção. Quando o ambiente permite, a revisão roda num
   agente separado, que recebe as imagens e os arquivos, sem a conversa.
4. **A revisão tenta reprovar.** Procure o defeito. Ausência de achado
   depois de olhar com atenção é um resultado; elogio não é.
5. **Achado tem endereço.** Cada um diz a captura, a região, o que se vê,
   a regra ferida (do viewspec, do guia ou das listas do Designfy) e a
   especialista dona.
6. **Gravidade decide.** Alta impede fechar. Média é corrigida ou tem o
   motivo registrado. Baixa é respondida.
7. **A revisão não edita a interface.** Devolve à dona do item e confere
   a correção com nova captura.
8. **Celular e desktop pesam igual.** A captura de 390 px é examinada com
   o mesmo cuidado da de 1440 px, e antes dela.
9. **Estados também são tela.** Carregando, vazio e erro são capturados e
   revisados.
10. **Os dois temas**, quando o projeto tem os dois.
11. **Conteúdo real.** Texto de amostra, número inventado e imagem
    genérica são achados de gravidade alta.
12. **O que pode voltar vira regra.** Achado com chance de repetir em
    outra tela entra no guia com origem `@revisão`.
13. **No máximo três rodadas** por tela. Se depois da terceira ainda há
    achado de gravidade alta, pare e leve à pessoa o que não fecha e por
    quê.

## Passos

### 1. Preparar

Leia o viewspec inteiro e as seções do guia ligadas ao tipo de tela.
Confirme que o servidor do projeto responde na URL e que o Playwright
está instalado:

```bash
designfy deps check --group testing
designfy capture list
```

### 2. Capturar

Com [assets/roteiro-de-capturas.md](assets/roteiro-de-capturas.md):

```bash
designfy capture run <url> --viewport mobile,tablet,desktop,wide --theme light,dark --name <slug>-r1
designfy capture run <url> --viewport mobile,desktop --reduced-motion --name <slug>-r1-parado
designfy capture run <url> --viewport 320x640,1280x800 --fold --name <slug>-r1-dobra
```

Mais os estados (carregando, vazio, erro) e os componentes abertos.

A captura de página inteira rola a página antes do print, para disparar as
revelações e as imagens preguiçosas, e esconde as barras de desenvolvimento
(Astro, Vite, Next.js). Elementos fixos que cobrem conteúdo e não são o
objeto da revisão, como botão flutuante de contato ou janela de chat, saem
com `--hide <seletor>`. Página muito longa pede `--scroll-budget <ms>`
maior. Uma captura só vale quando o manifesto diz que o orçamento não
acabou e que não sobrou imagem incompleta.

### 3. Ler o manifesto

`overflowX`, `consoleErrors`, `pageErrors`, `documentHeight`, o tema, os
passos de rolagem, as imagens incompletas e se o orçamento acabou, em cada
captura. Estouro e erro de script são achados de gravidade alta antes de
abrir qualquer imagem.

### 4. Examinar as imagens

Com [references/leitura-das-imagens.md](references/leitura-das-imagens.md):
o celular primeiro, depois o desktop, depois o tablet e a tela larga,
depois o tema escuro e o movimento reduzido. Em seguida, a conferência do
tipo de tela e a lista de acabamento.

### 5. Relatar

Com [assets/relatorio-de-revisao.md](assets/relatorio-de-revisao.md):
achados numerados, por gravidade, cada um com a dona.

### 6. Devolver e repetir

Cada achado vai à especialista dona. Depois das correções, capture de
novo (`<slug>-r2`) e marque cada achado como resolvido, parcial ou
aberto, olhando a imagem nova.

### 7. Fechar

Sem achado de gravidade alta aberto: registre a execução final em
`captures` do viewspec, marque o item de revisão, leve os aprendizados ao
guia e entregue o relatório.

## Marcos

- Capturas da rodada feitas em todas as larguras e temas.
- Manifesto lido; imagens examinadas uma a uma.
- Relatório com os achados e as donas.
- Correções conferidas em nova captura.
- Viewspec com a execução final registrada.

## Saída

As execuções de captura (nomes e pasta), o veredito (aprovada, aprovada
com ressalvas ou reprovada), os achados por gravidade com o estado de
cada um, o que foi levado ao guia e o que precisa de resposta da pessoa.
