---
name: designfy-webapps
description: Especialista em web apps do Designfy, as telas de sistema da área logada, para React com shadcn, ReUI e Tailwind. Desenha o shell (barra lateral, topo, cabeçalho de página), tabelas de dados com ordenação, filtro, seleção e ações, formulários com validação e fluxo em etapas, dashboards com contadores e gráficos, CRUD completo, tela de detalhe, páginas de configuração e autenticação, cobrindo carregando, vazio, erro e sucesso em cada região. Use quando a pessoa pedir dashboard, painel administrativo, tabela, listagem, formulário, cadastro, CRUD, tela de detalhe, configurações, login, contadores, indicadores, filtros, ou quando a skill designfy chamar esta etapa para um viewspec de sistema.
---

# Web apps

Uma tela de sistema é uma ferramenta: a pessoa volta a ela todo dia para
ver um estado e fazer uma tarefa. O desenho privilegia achar, comparar e
agir, com densidade, estados completos e movimento contido.

## Leitura prévia

| Tarefa | Referência |
| --- | --- |
| Shell, navegação e cabeçalho de página | [references/shell-e-navegacao.md](references/shell-e-navegacao.md) |
| Tabela de dados: colunas, ordenação, filtro, seleção, ações | [references/tabelas.md](references/tabelas.md) |
| Formulário: campos, validação, envio, etapas | [references/formularios.md](references/formularios.md) |
| Dashboard, contadores e gráficos | [references/dashboards-e-contadores.md](references/dashboards-e-contadores.md) |
| CRUD e tela de detalhe | [references/crud-e-detalhe.md](references/crud-e-detalhe.md) |
| Páginas de configuração | [references/configuracoes.md](references/configuracoes.md) |
| Entrada, cadastro e recuperação de acesso | [references/autenticacao.md](references/autenticacao.md) |
| Carregando, vazio, erro, sucesso e avisos | [references/estados-e-avisos.md](references/estados-e-avisos.md) |
| Densidade, texto de interface e formatos | [references/densidade-e-texto.md](references/densidade-e-texto.md) |
| Conferência antes de entregar | [references/checklist.md](references/checklist.md) |
| Telas reais estudadas por inteiro, com regiões, estados e as peças no registro | [references/estudos/README.md](references/estudos/README.md) |

Modelos em `assets/`: [especificacao-de-tabela.md](assets/especificacao-de-tabela.md),
[especificacao-de-formulario.md](assets/especificacao-de-formulario.md) e
[especificacao-de-dashboard.md](assets/especificacao-de-dashboard.md),
para preencher antes de escrever código.

## Regras

1. **A tela responde a uma pergunta ou cumpre uma tarefa.** Escreva qual é
   antes de escolher componente. O que não ajuda a responder sai.
2. **Uma ação principal por tela**, no cabeçalho da página. Ações
   destrutivas ficam em menu e confirmam.
3. **Todos os estados de toda região.** Carregando com a forma do
   conteúdo, vazio de primeiro uso, vazio por filtro, erro com saída,
   parcial, sem permissão. Tela que só tem o caminho feliz não está
   pronta.
4. **O dado manda no desenho.** Especifique entidades, campos, tipos,
   volumes e de onde vêm antes de desenhar. Tabela para dez linhas e para
   cem mil são componentes diferentes.
5. **Estado de tela na URL.** Filtro, ordenação, página, aba e registro
   aberto ficam no endereço: a pessoa recarrega, volta e compartilha.
6. **Nada se perde.** Formulário avisa antes de sair com alteração,
   preserva o que foi digitado em erro de envio e oferece desfazer onde a
   ação permite.
7. **Resposta imediata.** Toda ação mostra em até 100 ms que foi recebida:
   botão com progresso, linha atualizada, aviso.
8. **Densidade do guia.** Arejada, média ou compacta, uma só para o
   sistema inteiro, com área de toque de 44 px no celular.
9. **Primitivos acessíveis.** Diálogo, menu, combobox, abas e tabela vêm
   do shadcn ou do ReUI; não reescreva comportamento de teclado e foco.
10. **Número se compara.** Algarismos tabulares, alinhamento à direita,
    unidade e formato do público, variação com sinal e texto.
11. **Movimento contido.** Explica mudança de estado; sem laço decorativo
    em tela de trabalho.
12. **O celular é planejado.** Tabela vira cartões ou rola na própria
    caixa, a barra lateral vira gaveta, as ações vão para o pé.
13. **Tema e mais nada.** Papéis do tema, inclusive `sidebar-*` e
    `chart-*`.
14. **Em projeto com Specsfy, a spec e o `DESIGNSYSTEM.MD` vêm antes.** A
    tela segue a seção "Interface" da spec e os padrões de CRUD e de
    dashboard do `DESIGNSYSTEM.MD`; os componentes já registrados no
    `INTERFACE.md` são usados antes dos do registro.

## Passos

### 1. Ler o viewspec e o dado

`## Objetivo`, `## Conteúdo` (entidades, campos, endpoint, volume) e
`## Estados`. Do guia: `## Padrões de tela`, `## Componentes` e a
densidade em `## Visão geral`. Abra o tipo do dado e uma resposta real do
endpoint, quando existem.

### 2. Especificar antes de desenhar

Preencha o modelo de `assets/` do tipo de tela: colunas da tabela, campos
do formulário ou indicadores do dashboard. Cole o resultado em
`## Estrutura` e `## Estados` do viewspec.

### 3. Garantir o shell

Primeira tela do sistema: monte o shell com
[references/shell-e-navegacao.md](references/shell-e-navegacao.md).

```bash
designfy deps install forms tables charts feedback state
designfy components add app-shell page-header
npx shadcn@latest add sidebar breadcrumb dropdown-menu
```

### 4. Compor a tela

Com a referência do tipo: tabela, formulário, dashboard, CRUD, detalhe,
configurações ou autenticação. Use os fragmentos do catálogo
(`designfy catalog list --kind <kind>`).

### 5. Implementar os estados

Com [references/estados-e-avisos.md](references/estados-e-avisos.md).
Force cada estado para ver: rede lenta, resposta vazia, erro do servidor,
texto longo, mil linhas.

### 6. Conferir

[references/checklist.md](references/checklist.md). Marque os itens no
viewspec e passe para `designfy-components`, `designfy-motion`,
`designfy-responsive` e `designfy-accessibility`.

## Marcos

- Pergunta ou tarefa da tela escrita; dado especificado.
- Shell no lugar.
- Tela composta com os fragmentos do catálogo.
- Todos os estados implementados e vistos.
- Estado de tela na URL.

## Saída

A pergunta ou tarefa da tela, a especificação do dado, os fragmentos e a
fonte de cada um, os estados implementados, o que fica na URL, o
comportamento no celular e o que ficou para as outras especialistas.
