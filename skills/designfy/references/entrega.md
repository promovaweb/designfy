# Entrega e aprendizados

O fechamento de uma execução: o que conferir, como registrar o que foi
aprendido e o que dizer à pessoa.

## Antes de fechar

- [ ] Todos os itens da checklist do viewspec marcados, ou o que sobrou
      registrado em `## Notas` com o motivo e o viewspec mantido em
      `in_progress` ou `blocked`.
- [ ] `designfy viewspec validate <id>` sai com 0.
- [ ] Build do projeto sem erro.
- [ ] `designfy theme check` sai com 0.
- [ ] `designfy deps check` sai com 0.
- [ ] Captura de celular e de desktop feita depois da última correção, com
      o nome da execução em `captures` no front matter.
- [ ] `overflowX` falso em todos os viewports do `manifest.json`.
- [ ] Nenhum erro de console no `manifest.json`.
- [ ] A lista de acabamento da `designfy-review` respondida item a item.

## Mudar o estado do viewspec

A `designfy-viewspec` muda `status` para `done` e atualiza `updatedAt`. Com
item pendente o estado continua `in_progress`: o leitor recusa `done` com
checklist aberta.

## Registrar aprendizados no guia

Abra o `VIEWSPEC.md` da raiz e escreva uma entrada em `## Aprendizados`
para cada um destes casos:

| Aconteceu | Origem | Destino |
| --- | --- | --- |
| a pessoa disse uma preferência ("sempre", "nunca", "prefiro") | `@pessoa` | regra nova na seção do assunto, com `{#id}` |
| a pessoa corrigiu uma escolha do agente | `@pessoa` | regra nova ou alteração da regra `@agente` anterior |
| o agente escolheu algo que vai se repetir em outras telas | `@agente` | `proposta`, mostrada no relato para a pessoa confirmar |
| a revisão achou um defeito que pode voltar | `@revisão` | regra nova em `## Responsivo`, `## Acessibilidade` ou `## Faça e não faça` |
| um componente novo foi criado ou adotado | `@agente` | linha em `## Componentes` |
| uma regra do guia não serviu para esta tela | origem de quem percebeu | `deviations` no viewspec da tela e entrada explicando; a regra só muda com aceite |

Formato da entrada:

```markdown
- 2026-11-24 `@pessoa` Tabelas mostram no máximo 20 linhas por página. → {#t009}
```

Escreva a regra do jeito que ela será conferida depois: o que fazer, com
número quando houver, e o motivo em poucas palavras. "Deixar mais limpo"
não é regra; "no máximo duas ações visíveis por linha de tabela, o resto no
menu" é.

Preferência dita uma vez para uma tela não vira regra do projeto sem
perguntar. Pergunte no relato: "vale só para esta tela ou para todas?".

## Relato

Use [assets/relato-final.md](../assets/relato-final.md). O relato é curto e
responde, nesta ordem:

1. o que foi entregue e onde ver (rota e URL local);
2. o viewspec (caminho, `id`, estado);
3. os fragmentos usados e a fonte de cada um;
4. os arquivos criados e alterados;
5. as capturas (pasta da execução) e o que a revisão achou e corrigiu;
6. as lacunas que dependem da pessoa (conteúdo, endpoint, imagem);
7. as regras novas do guia e as propostas à espera de confirmação.

Não diga que a tela está pronta com lacuna aberta: diga o que está pronto e
o que falta.

## Commit

A skill não cria commit, tag nem release. Quando a pessoa pedir, o commit
inclui a interface, o viewspec da tela e o guia atualizado juntos, para o
histórico mostrar a especificação ao lado do código.
