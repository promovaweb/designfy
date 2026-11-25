---
name: designfy-viewspec
description: Especialista no viewspec do Designfy. Cria e mantém o guia VIEWSPEC.md da raiz (preferências, diretrizes, padrões e aprendizados de interface do site ou sistema) e escreve, executa e fecha o viewspec de cada página ou tela em viewspec/<id>-<slug>/VIEWSPEC.md, com as nove seções, a checklist por especialista e o estado. Use quando a pessoa pedir para especificar uma tela, criar ou atualizar o guia de interface, registrar uma preferência ou padrão de design, retomar um viewspec aberto, validar viewspecs, ou quando a skill designfy chamar esta etapa.
---

# Viewspec

O viewspec tem dois níveis. O guia, `VIEWSPEC.md` na raiz, diz como todas
as telas do projeto se comportam e se parecem. O viewspec de uma tela, em
`viewspec/<id>-<slug>/VIEWSPEC.md`, diz o que aquela interface contém, como
reage e quais tarefas faltam. Esta skill escreve os dois, executa a
checklist com as outras especialistas e mantém o guia aprendendo.

O binário `designfy` só lê e valida. Quem grava é esta skill.

## Modos

| Modo | Quando | Resultado |
| --- | --- | --- |
| guia | o projeto não tem `VIEWSPEC.md` na raiz, ou a pessoa quer registrar ou mudar um padrão | guia criado ou atualizado |
| criação | uma tela nova ou um redesenho | viewspec da tela em `draft` |
| execução | viewspec em `draft` ou `in_progress` | itens marcados, estado atualizado |
| fechamento | checklist completa e capturas revisadas | viewspec em `done`, guia com aprendizados |
| conferência | a pessoa pede para validar ou listar | relatório do que está aberto e do que está inválido |

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Campos, seções, formato de regra e de item, estados | [references/contrato.md](references/contrato.md) |
| Criar o guia e escrever boas regras | [references/guia-do-projeto.md](references/guia-do-projeto.md) |
| Preencher as nove seções de uma tela | [references/viewspec-da-tela.md](references/viewspec-da-tela.md) |
| Montar a checklist por tipo de tela | [references/checklists-por-tipo.md](references/checklists-por-tipo.md) |
| Executar, registrar notas e mudar o estado | [references/execucao.md](references/execucao.md) |
| Corrigir um arquivo que a validação recusou | [references/erros-de-validacao.md](references/erros-de-validacao.md) |

Modelos em `assets/templates/`: [VIEWSPEC.guia.md](assets/templates/VIEWSPEC.guia.md)
e [VIEWSPEC.tela.md](assets/templates/VIEWSPEC.tela.md). Exemplos completos
em `assets/examples/`: [guia-de-sistema.md](assets/examples/guia-de-sistema.md),
[guia-de-site.md](assets/examples/guia-de-site.md),
[tela-landing-page.md](assets/examples/tela-landing-page.md),
[tela-dashboard.md](assets/examples/tela-dashboard.md) e
[tela-artigo.md](assets/examples/tela-artigo.md).

## Regras

1. **O guia existe antes da primeira tela.** Sem `VIEWSPEC.md` na raiz, o
   modo criação para e roda o modo guia.
2. **Os valores moram no código.** O guia cita papéis e explica o uso; o
   arquivo de tokens (`tokensFile`) guarda os valores. Se os dois
   divergirem, vale o arquivo de tokens e o guia é corrigido na mesma
   mudança.
3. **Regra do guia é conferível.** Uma linha com o que fazer, o motivo, a
   origem (`@pessoa`, `@agente` ou `@revisão`) e o `{#id}`. Frase que não dá
   para conferir numa captura ou no código não entra como regra.
4. **Regra de origem `@pessoa` só muda com o aceite dela.** Regra `@agente`
   pode ser revista pelo agente, com entrada em `## Aprendizados`.
5. **Nenhuma entrada de `## Aprendizados` é apagada.** Mudança ganha entrada
   nova que cita a regra alterada.
6. **Tela sem seção vazia.** As nove seções têm conteúdo da tela ou
   `Não se aplica.` com o motivo. Texto genérico ("layout responsivo",
   "animações suaves") é seção vazia.
7. **Conteúdo real.** `## Conteúdo` lista textos, dados e mídias que existem
   ou a origem de cada um. O que falta é escrito como lacuna, com quem
   precisa fornecer.
8. **Uma ação principal por tela**, dita em `## Objetivo`.
9. **Todo item da checklist tem dona e identificador.** Anote a especialista
   com `` `#designfy-<skill>` `` e crie o `{#id}` de quatro caracteres uma
   vez. Nunca troque o `{#id}` de um item que já existe.
10. **Item só é marcado depois de feito e conferido** no navegador ou no
    build. Item desfeito volta a `[ ]` com nota.
11. **`done` exige checklist completa e captura registrada** em `captures`.
12. **Desvio do guia é declarado.** Tela que não segue uma regra lista o
    identificador em `deviations` e explica em `## Notas`.
13. **Valide depois de cada gravação:** `designfy viewspec validate`.

## Passos

### Modo guia

1. Leia o que existe: `designfy theme show --json`, `designfy status --json`,
   os componentes do projeto, as telas já prontas.
2. Faça a entrevista curta de
   [references/guia-do-projeto.md](references/guia-do-projeto.md): no máximo
   três perguntas numa mensagem, só sobre o que o código não responde
   (personalidade, densidade, caráter do movimento).
3. Copie [assets/templates/VIEWSPEC.guia.md](assets/templates/VIEWSPEC.guia.md)
   para a raiz como `VIEWSPEC.md` e preencha as catorze seções. Regras
   tiradas do código entram como `@agente`; o que a pessoa disse entra como
   `@pessoa`, com a entrada correspondente em `## Aprendizados`.
4. `designfy viewspec validate` e `designfy viewspec guide`.
5. Mostre à pessoa o resumo: seções, contagem de regras e as propostas à
   espera do aceite.

### Modo criação

1. `designfy viewspec progress --json` para o `nextId`.
2. Leia o guia e separe as regras que valem para o tipo de tela.
3. Copie [assets/templates/VIEWSPEC.tela.md](assets/templates/VIEWSPEC.tela.md)
   para `viewspec/<id>-<slug>/VIEWSPEC.md`.
4. Preencha o front matter e as nove seções com
   [references/viewspec-da-tela.md](references/viewspec-da-tela.md).
5. Monte a checklist com
   [references/checklists-por-tipo.md](references/checklists-por-tipo.md),
   corte o que não vale e acrescente o que é próprio da tela.
6. `designfy viewspec validate <id>`.

### Modo execução

Siga [references/execucao.md](references/execucao.md): estado para
`in_progress`, um item por vez na ordem das especialistas, marcação depois
da conferência, `relatedFiles` e `updatedAt` atualizados, notas datadas.

### Modo fechamento

1. Confira a checklist inteira e a execução de captura.
2. Registre a execução em `captures` e mude o estado para `done`.
3. Leve ao guia o que foi aprendido, como descreve
   [references/guia-do-projeto.md](references/guia-do-projeto.md#manter-o-guia).
4. `designfy viewspec validate`.

### Modo conferência

```bash
designfy viewspec validate
designfy viewspec list
designfy viewspec guide
```

Relate o que está aberto, o que está parado e por quê, os arquivos
inválidos com a correção de
[references/erros-de-validacao.md](references/erros-de-validacao.md) e as
propostas do guia sem resposta.

## Marcos

- Guia presente e válido.
- Viewspec da tela escrito, com as nove seções e a checklist, e válido.
- Cada item marcado depois de conferido.
- Estado final gravado e guia atualizado.

## Saída

Caminho e `id` do viewspec, estado, progresso (`feitos/total`), regras do
guia aplicadas e desviadas, lacunas de conteúdo, entradas novas de
`## Aprendizados` e o resultado de `designfy viewspec validate`.
