# Projeto com Specsfy

Como o Designfy trabalha num projeto que usa o
[Specsfy](https://github.com/promovaweb/specsfy), o sistema de
especificação da Promovaweb. No Specsfy, a spec de cada fatia é a única
fonte normativa: o Designfy entra para detalhar e executar a interface que
a spec já definiu, sem criar escopo nem um segundo documento que mande.

## Como reconhecer

`designfy status` mostra o bloco de integrações. O projeto usa Specsfy
quando tem pelo menos um destes sinais:

- pasta `specs/` com as pastas de estado (`draft`, `defined`, `planned`,
  `in-progress`, `review`, `completed`);
- pasta `.specsfy/` (stack, templates, configuração);
- `DESIGNSYSTEM.MD` na raiz, com as orientações gerais de interface;
- `INTERFACE.md`, com componentes, blocos, telas e consumidores.

## Quem faz o quê

| Assunto | Fica com | Arquivo |
| --- | --- | --- |
| O que a fatia entrega, regras, permissões, tarefas e gates | Specsfy, skills `specsfy-03-specify` a `specsfy-06-implement` | `specs/<estado>/<NNNN>-<slug>/spec.md` |
| Interface da fatia: telas, fluxo, formulários, blocos, estados (seção "Interface" da spec) | Specsfy, `specsfy-specialist-interface` | a spec |
| Orientações gerais de interface do produto | Specsfy, `specsfy-specialist-interface` | `DESIGNSYSTEM.MD` |
| Registro de componentes, blocos e telas do projeto | Specsfy | `INTERFACE.md` |
| Guia do Designfy | Designfy, resumindo e citando o `DESIGNSYSTEM.MD` | `VIEWSPEC.md` |
| Execução da interface de cada tela, com a checklist das especialistas e as capturas | Designfy | `viewspec/<id>-<slug>/VIEWSPEC.md` |

## Regras

1. **A spec manda.** Quando o viewspec e a spec divergirem, vale a spec. O
   viewspec não acrescenta tela, campo, ação ou estado que a seção
   "Interface" da spec não prevê. O que faltar na spec volta para ela, pelo
   fluxo do Specsfy (`specsfy-update-spec`), antes de entrar no viewspec.
2. **O `DESIGNSYSTEM.MD` é a fonte das orientações gerais.** O guia
   `VIEWSPEC.md` resume cada orientação em regra conferível, cita a seção
   do `DESIGNSYSTEM.MD` e declara que ele prevalece, como em
   [projeto-existente.md](projeto-existente.md). Preferência nova de
   produto entra no `DESIGNSYSTEM.MD` pela especialista de interface do
   Specsfy; uma exceção de tela entra em "Exceções da entrega" do
   `DESIGNSYSTEM.MD`, com o alcance definido. O
   guia do Designfy guarda o que o `DESIGNSYSTEM.MD` não cobre: movimento,
   fundos, fragmentos do catálogo e aprendizados das revisões.
3. **Viewspec só para fatia com interface.** Spec com
   `Interface para pessoas: Não` não ganha viewspec.
4. **Os componentes seguem o `INTERFACE.md`.** Antes de copiar um item do
   registro do Designfy, procure no `INTERFACE.md` o componente que já faz a
   função (`PageHeader`, `DataGrid`, `DetailLists`, `Breadcrumb`). Um
   componente novo entra no `INTERFACE.md` na mesma entrega.
5. **Tarefas pelos IDs da spec.** Os itens da checklist do viewspec citam o
   ID da tarefa `[CODE]` da spec quando executam uma delas, por exemplo
   `Lista com DataGrid e linha clicável (T014)`.
6. **Git e estado da spec seguem o Specsfy.** Transição de estado, gates e
   documentação do sistema são do Specsfy. O Designfy não move spec de
   pasta.

## Fluxo de uma tela

1. Leia a spec da fatia (seção "Interface" e tarefas), o `DESIGNSYSTEM.MD`,
   o `INTERFACE.md` e o `.specsfy/STACK.md`.
2. Garanta o guia `VIEWSPEC.md` citando o `DESIGNSYSTEM.MD`.
3. A `designfy-viewspec` cria o viewspec da tela a partir da seção
   "Interface": objetivo, conteúdo, estrutura e estados vêm de lá. No front
   matter, `trackedBy` registra a spec:

   ```yaml
   trackedBy:
     - system: specsfy
       id: "0007"
       path: specs/planned/0007-cadastro-de-clientes/spec.md
   ```

   Quando a spec mudar de pasta de estado, atualize o `path`;
   `designfy viewspec validate` mostra o caminho novo.
4. As especialistas executam o viewspec. Em sistema, a `designfy-webapps`
   segue os padrões de CRUD do `DESIGNSYSTEM.MD` (lista com `PageHeader` e
   `DataGrid`, detalhe com `DetailLists`, formulário em seções com
   explicação à esquerda e campos à direita, linha inteira como link para o
   detalhe e ações independentes na linha).
5. Revisão com capturas pela `designfy-review`. O resultado entra na spec
   como comprovação da tarefa, pelo fluxo do Specsfy.

## Saída

No relato, cite a spec (ID, estado e caminho), o viewspec da tela, as
tarefas da spec cobertas e qualquer divergência levada de volta à spec.
