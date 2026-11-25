# Projeto com Astrofy

Como o Designfy trabalha num site Astro que usa o
[Astrofy](https://github.com/promovaweb/astrofy). Os dois dividem o trabalho:
o Designfy especifica e revisa a interface; o Astrofy implementa o site
Astro e registra cada entrega técnica.

## Como reconhecer

`designfy status` mostra o bloco de integrações. O projeto usa Astrofy
quando tem pelo menos um destes sinais:

- pasta `.sitespec/` com tarefas `<id>-<slug>/SITEPEC.md`;
- pasta `.astrofy/` (páginas, plano, design system);
- dependência `@promovaweb/astrofy`;
- skills `astrofy-*` instaladas.

## Quem faz o quê

| Assunto | Fica com | Arquivo |
| --- | --- | --- |
| Registro da tarefa técnica do site, dependências, comprovação da entrega | Astrofy, skills `astrofy-sitespec-create` e `astrofy-sitespec-implement` | `.sitespec/<id>-<slug>/SITEPEC.md` |
| Conteúdo aprovado de uma página planejada | Astrofy, `astrofy-page-planner` | `.astrofy/pages/<slug>/page-spec.json` |
| Guia de interface do projeto | Designfy, `designfy-viewspec` | `VIEWSPEC.md` |
| Especificação de interface da tela e checklist das especialistas | Designfy, `designfy-viewspec` | `viewspec/<id>-<slug>/VIEWSPEC.md` |
| Composição, movimento, responsivo, acessibilidade e revisão com capturas | especialistas `designfy-*` | o viewspec da tela |
| Rotas, SEO, dados estruturados, imagens, Open Graph, build e deploy | `astrofy-routing`, `astrofy-seo`, `astrofy-structured-data`, `astrofy-images`, `astrofy-open-graph`, `astrofy-build-deploy` | a sitespec |
| Tokens do design system gerados pelo Astrofy | `astrofy-design-system` | `.astrofy/design/design-system.json` |

O Designfy não grava sitespec e o Astrofy não grava viewspec. Cada um cita o
outro.

## Fluxo de uma tela

1. **Viewspec primeiro.** A `designfy-viewspec` cria
   `viewspec/<id>-<slug>/VIEWSPEC.md`, como em qualquer projeto.
2. **Sitespec da entrega.** Chame a `astrofy-sitespec-create` para a tarefa
   técnica, ou use a sitespec que já existe para a rota. Na `## Descrição`
   da sitespec entra um link para o viewspec, com caminho relativo ao
   `SITEPEC.md`, como o contrato do Astrofy pede:

   ```markdown
   - ViewSpec de `/precos/`: [Página de preços](../../viewspec/0007-precos/VIEWSPEC.md)
   ```

3. **Viewspec aponta de volta.** No front matter do viewspec, `trackedBy`
   registra a sitespec:

   ```yaml
   trackedBy:
     - system: astrofy
       id: "0012"
       path: .sitespec/0012-pagina-de-precos/SITEPEC.md
   ```

4. **Execução.** As especialistas do Designfy marcam os itens do viewspec. A
   checklist da sitespec registra a entrega e a conferência da etapa, com
   nomes `astrofy-*`; quando um item depende de uma especialista do
   Designfy, o texto do item cita a skill (`designfy-motion`, por exemplo),
   sem usar a anotação `#skill`, que na sitespec só aceita `astrofy-*`.
5. **Fechamento.** O viewspec fecha em `done` com a captura registrada. A
   sitespec fecha pela `astrofy-sitespec-implement`, com as validações do
   site. `designfy viewspec validate` confere o `trackedBy`.

Página planejada pelo `astrofy plan` tem três sitespecs (`route`,
`content`, `check`). O viewspec liga a de `route` ou a de `check`, a que
recebe a conferência visual.

## Tema e tokens

Com `.astrofy/design/design-system.json`, a fonte editável da identidade é
esse JSON, e o CSS sai de `astrofy tokens build`, no caminho
`paths.designSystemCss` da configuração do Astrofy (padrão
`designsystem.css`).

- O `tokensFile` do guia aponta para o CSS gerado.
- Mudança de cor, fonte ou raio entra no JSON pela `astrofy-design-system`,
  seguida de `astrofy tokens build` e `astrofy tokens check`. O CSS gerado
  não é editado à mão.
- O Astrofy gera utilitários pelos nomes semânticos (`--color-surface` vira
  `bg-surface`). Os componentes do registro do Designfy usam os papéis do
  shadcn (`bg-background`, `text-muted-foreground`). Para usar o registro
  direto, nomeie os tokens semânticos com os papéis do shadcn no JSON, ou
  mapeie os papéis no `@theme inline` de um CSS autoral importado depois do
  gerado. Registre a escolha no guia, em `## Cores`.
- `designfy theme check` mede o contraste do CSS gerado; a correção volta ao
  JSON.

## Skills do Astrofy que conversam com o Designfy

- `astrofy-design` e `astrofy-page-design`: em projeto com Designfy, leem o
  guia e o viewspec da rota antes de compor. Quando a pessoa chamar uma
  delas, o viewspec continua sendo a especificação da tela.
- `astrofy-components`: mantém os componentes do projeto. Componente copiado
  do registro do Designfy passa a ser componente do projeto e segue as
  convenções dele.
- `astrofy-accessibility` e `astrofy-testing`: as conferências do site. A
  `designfy-accessibility` cuida da tela; as duas se somam.

## Saída

No relato, cite o viewspec e a sitespec da tela, com os dois caminhos, e o
que ficou com cada framework.
