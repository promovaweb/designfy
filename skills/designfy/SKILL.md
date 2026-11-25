---
name: designfy
description: Orquestradora do Designfy, chamada explicitamente com o pedido de interface da pessoa. Lê o projeto e o guia VIEWSPEC.md da raiz, classifica o pedido (site, landing page, blog, artigo, dashboard, tabela, formulário, CRUD, configurações), escolhe os fragmentos no catálogo de interface, monta o viewspec da tela e aciona as skills especialistas na ordem, até a revisão com capturas em celular e desktop. Use quando a pessoa pedir para criar, redesenhar ou melhorar uma página, tela, seção ou componente de um site em Astro ou de um sistema em React, ou quando citar Designfy ou viewspec.
---

# Designfy

Skill de entrada do framework. Ela não desenha sozinha: entende o pedido,
prepara o projeto, escreve a especificação da tela e passa cada parte para a
especialista certa. O resultado de toda execução é um viewspec concluído, a
interface implementada, as capturas revisadas e o guia do projeto atualizado
com o que foi aprendido.

| Especialista | Chamada para |
| --- | --- |
| `designfy-viewspec` | escrever e executar o viewspec da tela e manter o guia `VIEWSPEC.md` da raiz |
| `designfy-design-system` | tokens, paleta, tipografia, espaçamento, fundos, temas |
| `designfy-components` | escolher, copiar, compor e criar componentes |
| `designfy-motion` | movimento de entrada, rolagem, hover e troca de estado |
| `designfy-websites` | páginas de site e landing pages |
| `designfy-content` | blog, artigo, documentação e mídia |
| `designfy-systems` | telas de sistema |
| `designfy-responsive` | celular, tablet e desktop |
| `designfy-accessibility` | WCAG 2.2 |
| `designfy-review` | capturas e lista de acabamento |

## Leitura prévia

Leia só o que o estágio pede:

| Estágio | Referência |
| --- | --- |
| Entender o que foi pedido e classificar | [references/leitura-do-pedido.md](references/leitura-do-pedido.md) |
| Escolher especialistas e fragmentos por tipo de tela | [references/roteamento.md](references/roteamento.md) |
| Conduzir os estágios e os pontos de parada | [references/fluxo.md](references/fluxo.md) |
| Entender e documentar um projeto que já tem interface, tema ou regras de design | [references/projeto-existente.md](references/projeto-existente.md) |
| Preparar um projeto que ainda não tem o Designfy | [references/preparo-do-projeto.md](references/preparo-do-projeto.md) |
| Fechar a entrega e registrar aprendizados | [references/entrega.md](references/entrega.md) |
| Usar o binário `designfy` e o servidor MCP | [references/binario.md](references/binario.md) |

Modelos prontos em `assets/`: [pedido-de-esclarecimento.md](assets/pedido-de-esclarecimento.md),
[plano-da-tela.md](assets/plano-da-tela.md) e [relato-final.md](assets/relato-final.md).

## Regras

1. **O guia vem primeiro.** Leia o `VIEWSPEC.md` da raiz antes de qualquer
   escolha visual. Ele vale mais que o padrão de qualquer skill. Sem guia,
   crie um com a `designfy-viewspec` antes da primeira tela.
2. **O que a pessoa pede na conversa vale mais que o guia.** Quando o pedido
   contraria uma regra de origem `@pessoa`, pergunte se a regra muda para o
   projeto inteiro ou só nesta tela, e registre a resposta.
3. **Toda tela tem viewspec.** Nenhuma interface é escrita antes de o
   `viewspec/<id>-<slug>/VIEWSPEC.md` existir com as nove seções preenchidas
   e a checklist distribuída entre as especialistas.
4. **Os fragmentos saem do catálogo.** Escolha as partes da tela com
   `designfy catalog list --kind <tipo>` e `designfy catalog show <id>`. Só
   crie um fragmento fora do catálogo depois de conferir que nenhum cobre a
   função, e registre o motivo em `## Notas`.
5. **Um só design system.** Cores, tipografia, raios e espaçamento vêm do
   tema do Tailwind do projeto. Nenhuma cor literal, nenhuma classe de
   paleta fixa (`bg-indigo-500`) e nenhuma `font-family` fora do arquivo de
   tokens. Confira com `designfy theme show` e `designfy theme check`.
6. **Movimento é o padrão.** Toda tela tem algum movimento com função:
   entrada, resposta ao toque, troca de estado ou rolagem. Todo movimento
   tem versão parada para `prefers-reduced-motion`. Tela parada só quando o
   guia do projeto disser.
7. **Conteúdo real.** Texto, número, depoimento, logo e imagem vêm do
   projeto ou da pessoa. O que falta vira uma lacuna visível e entra no
   relato, nunca um valor inventado.
8. **Poucas perguntas, cedo.** No máximo três, numa única mensagem, e só o
   que o projeto, o guia e o pedido não respondem. Zero perguntas é o
   resultado mais comum.
9. **Uma especialista por vez, na ordem do viewspec.** Cada uma lê o
   viewspec, executa os itens marcados com o nome dela e marca o que
   concluiu. Não reescreva o que uma especialista ensina.
10. **Nada é dado como pronto sem captura.** A tela só fecha depois de
    `designfy capture run` em celular e desktop e da passagem da
    `designfy-review`.
11. **Projeto existente: entender antes de mudar.** Num projeto com telas
    prontas, tema próprio ou regras de design escritas, o primeiro resultado
    é o guia descrevendo o que existe, com a fonte de cada regra. Tema,
    Tailwind, dependências e componentes do projeto não mudam nessa etapa.
12. **O guia aprende.** Toda preferência dita pela pessoa, toda escolha nova
    e todo achado de revisão entram em `## Aprendizados` do guia antes do
    relato final.

## Passos

### 1. Ler o projeto

```bash
designfy status --json
designfy viewspec guide --json
designfy viewspec progress --json
designfy theme show --json
```

Sem o binário, leia `designfy.json`, o `package.json`, o CSS do tema, o
`VIEWSPEC.md` da raiz e a pasta `viewspec/`. Se o projeto ainda não tem
`designfy.json` e já tem interface, tema ou documentos de design, siga
[references/projeto-existente.md](references/projeto-existente.md) antes de
qualquer gravação. Projeto novo segue
[references/preparo-do-projeto.md](references/preparo-do-projeto.md).

### 2. Ler o pedido

Classifique com [references/leitura-do-pedido.md](references/leitura-do-pedido.md):
superfície (`site` ou `system`), tipo de tela (`kind`), rota, ação principal,
conteúdo disponível e o que falta. Se sobrar dúvida que muda a estrutura da
tela, pergunte com o modelo de `assets/pedido-de-esclarecimento.md`.

### 3. Garantir o guia

Com `guide: missing`, chame a `designfy-viewspec` no modo guia. Ela cria o
`VIEWSPEC.md` da raiz a partir das instruções e dos documentos de design do
projeto, do tema que já existe, do que a pessoa disser e de uma entrevista
curta só sobre o que essas fontes não respondem. Com guia, releia as seções ligadas ao tipo de
tela e anote os identificadores das regras que se aplicam.

### 4. Escolher os fragmentos

```bash
designfy catalog list --kind dashboard --json
designfy catalog show data-table --json
designfy components list --surface system --json
```

Monte a lista de regiões da tela com um fragmento do catálogo para cada
uma. Para cada fragmento, a fonte da implementação está em `sources`:
`designfy:<item>` copia com `designfy components add`, `shadcn:<item>` e
`reui:<item>` instalam com `npx shadcn@latest add`.

### 5. Montar o viewspec

Chame a `designfy-viewspec` no modo criação com: tipo, rota, objetivo,
conteúdo, regiões e fragmentos, regras do guia aplicáveis e a ordem das
especialistas de [references/roteamento.md](references/roteamento.md).
Mostre à pessoa o plano resumido com `assets/plano-da-tela.md` e siga, a
menos que o pedido tenha deixado uma escolha de estrutura em aberto.

### 6. Executar com as especialistas

Na ordem de `skills` do viewspec. O caminho comum:

1. `designfy-design-system`, se faltar token, papel de cor ou fonte.
2. `designfy-websites`, `designfy-content` ou `designfy-systems`, conforme a
   superfície: estrutura e composição da tela.
3. `designfy-components`: copiar, instalar e compor os fragmentos.
4. `designfy-motion`: o movimento da tela.
5. `designfy-responsive` e `designfy-accessibility`.

Depois de cada especialista, confira os itens marcados no viewspec e rode o
build ou o servidor de desenvolvimento do projeto.

### 7. Revisar com capturas

```bash
designfy capture run http://localhost:4321/rota --viewport mobile,desktop
```

Chame a `designfy-review`. Ela lê o `manifest.json`, abre as imagens,
aponta os achados por gravidade e devolve cada um à especialista dona.
Repita a captura depois das correções.

### 8. Fechar

Siga [references/entrega.md](references/entrega.md): viewspec em `done` com
a captura registrada, guia com os aprendizados, e o relato de
`assets/relato-final.md`.

## Marcos

- Projeto lido, com as fontes de design existentes documentadas no guia, e,
  quando preciso, preparado.
- Pedido classificado, com as perguntas respondidas.
- Guia `VIEWSPEC.md` presente e lido.
- Viewspec da tela escrito e aprovado quando havia escolha em aberto.
- Cada especialista concluída com os itens marcados.
- Capturas de celular e desktop revisadas.
- Guia atualizado e relato entregue.

## Saída

Informe o viewspec criado (caminho e `id`), a rota, os fragmentos usados e
de onde vieram, os arquivos alterados, as capturas (pasta da execução), os
achados corrigidos e os que ficaram, as lacunas de conteúdo que a pessoa
precisa preencher e as regras novas do guia.
