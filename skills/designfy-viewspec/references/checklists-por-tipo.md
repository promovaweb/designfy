# Checklists por tipo de tela

Itens de partida para a seção `## Checklist`. Copie os do tipo da tela,
corte o que não vale, ajuste o texto ao conteúdo real e acrescente os
itens próprios. Cada linha precisa ganhar um `{#id}` novo de quatro
caracteres.

## Comuns a toda tela

```markdown
- [ ] Tokens e papéis do tema conferidos para esta tela `#designfy-design-system`
- [ ] Fragmentos copiados ou instalados e dependências presentes `#designfy-components`
- [ ] Movimento de entrada e de estado, com versão parada `#designfy-motion`
- [ ] Celular 390 e tablet 820 sem rolagem horizontal `#designfy-responsive`
- [ ] Foco visível, ordem de teclado e nomes acessíveis `#designfy-accessibility`
- [ ] Capturas em celular e desktop revisadas e achados resolvidos `#designfy-review`
```

## `landing-page`, `home` e `site-page`

```markdown
- [ ] Estrutura das seções na ordem do argumento da página `#designfy-websites`
- [ ] Hero com título, uma frase e ação visíveis em 1280 x 800 `#designfy-websites`
- [ ] Ação principal repetida no meio e no fim da página `#designfy-websites`
- [ ] Seções de prova só com dados reais; lacunas marcadas `#designfy-websites`
- [ ] Cabeçalho e rodapé do projeto aplicados `#designfy-components`
- [ ] Fundo de cada seção definido pelo guia `#designfy-design-system`
- [ ] Revelação das seções e movimento do hero `#designfy-motion`
- [ ] Faixas animadas com pausa no hover e no foco `#designfy-motion`
- [ ] Menu do celular em gaveta, com foco preso `#designfy-responsive`
- [ ] Título da página, descrição e hierarquia de títulos `#designfy-accessibility`
```

## `blog-index`

```markdown
- [ ] Listagem com destaque, grade e paginação `#designfy-content`
- [ ] Cartão de post com capa, título, resumo e data `#designfy-components`
- [ ] Categorias como links para páginas reais `#designfy-content`
- [ ] Estado vazio da categoria `#designfy-content`
- [ ] Grade de três, duas e uma coluna `#designfy-responsive`
- [ ] Revelação escalonada dos cartões `#designfy-motion`
```

## `blog-post` e `docs-page`

```markdown
- [ ] Cabeçalho do artigo com título, resumo, autoria e data `#designfy-content`
- [ ] Corpo em `prose` com medida de 60 a 75 caracteres `#designfy-content`
- [ ] Índice com a seção atual marcada `#designfy-content`
- [ ] Tabelas e blocos de código com rolagem própria `#designfy-content`
- [ ] Vídeos com fachada: o player só carrega no clique `#designfy-content`
- [ ] Imagens com largura, altura, texto alternativo e legenda `#designfy-content`
- [ ] Barra de progresso de leitura `#designfy-motion`
- [ ] Índice recolhido no celular `#designfy-responsive`
- [ ] Níveis de título sem salto e links distinguíveis sem cor `#designfy-accessibility`
```

## `dashboard`

```markdown
- [ ] Shell e cabeçalho da página com período e ação principal `#designfy-webapps`
- [ ] Contadores com rótulo, valor, variação e origem do dado `#designfy-webapps`
- [ ] Gráficos com título, período, legenda e alternativa em tabela `#designfy-webapps`
- [ ] Carregando, vazio e erro por região `#designfy-webapps`
- [ ] Contagem animada dos valores e desenho único dos gráficos `#designfy-motion`
- [ ] Contadores em duas colunas e gráfico com altura fixa no celular `#designfy-responsive`
- [ ] Resumo em texto de cada gráfico `#designfy-accessibility`
```

## `table`

```markdown
- [ ] Cabeçalho da página com ação de criar `#designfy-webapps`
- [ ] Colunas, tipos de célula e alinhamento definidos `#designfy-webapps`
- [ ] Ordenação, filtros e paginação com estado na URL `#designfy-webapps`
- [ ] Seleção e barra de ações em lote `#designfy-webapps`
- [ ] Ações da linha em menu, com confirmação nas destrutivas `#designfy-webapps`
- [ ] Carregando com linhas de esqueleto, vazio e sem resultado `#designfy-webapps`
- [ ] Formato no celular: cartões ou primeira coluna fixa `#designfy-responsive`
- [ ] `th` com escopo, `aria-sort` e anúncio da contagem `#designfy-accessibility`
```

## `form`

```markdown
- [ ] Seções do formulário e ordem dos campos `#designfy-webapps`
- [ ] Rótulo, ajuda e erro de cada campo `#designfy-webapps`
- [ ] Validação por campo e resumo de erros no envio `#designfy-webapps`
- [ ] Envio com progresso, confirmação e destino `#designfy-webapps`
- [ ] Aviso ao sair com alteração não salva `#designfy-webapps`
- [ ] Barra de ações fixa no celular `#designfy-responsive`
- [ ] `autocomplete`, `inputmode` e erro ligado ao campo `#designfy-accessibility`
- [ ] Erro com deslocamento curto e botão com progresso `#designfy-motion`
```

## `crud`

Os itens de `table`, mais:

```markdown
- [ ] Criar e editar em gaveta ou página, com o mesmo formulário `#designfy-webapps`
- [ ] Detalhe do registro com lista de atributos `#designfy-webapps`
- [ ] Excluir com confirmação que nomeia o registro `#designfy-webapps`
- [ ] Retorno à lista com filtros e página preservados `#designfy-webapps`
```

## `detail`

```markdown
- [ ] Cabeçalho com nome, estado e ações `#designfy-webapps`
- [ ] Atributos em grupos, com os mais consultados no topo `#designfy-webapps`
- [ ] Abas para conteúdo relacionado, com URL própria `#designfy-webapps`
- [ ] Histórico do registro `#designfy-webapps`
- [ ] Rótulo acima do valor no celular `#designfy-responsive`
```

## `settings`

```markdown
- [ ] Áreas com navegação e URL própria `#designfy-webapps`
- [ ] Seções com título, explicação e salvamento próprio `#designfy-webapps`
- [ ] Zona de ações destrutivas separada, com confirmação `#designfy-webapps`
- [ ] Confirmação de salvo em cada seção `#designfy-motion`
- [ ] Navegação das áreas como lista no celular `#designfy-responsive`
- [ ] Alternadores com rótulo e descrição ligados `#designfy-accessibility`
```

## `auth`

```markdown
- [ ] Cartão com título, campos, envio e link para o fluxo alternativo `#designfy-webapps`
- [ ] Erros que não revelam se a conta existe `#designfy-webapps`
- [ ] Painel de marca com fundo do guia `#designfy-design-system`
- [ ] `autocomplete` de usuário, senha e código `#designfy-accessibility`
- [ ] Cartão de borda a borda no celular `#designfy-responsive`
```

## Redesenho

Acrescente no início:

```markdown
- [ ] Captura da tela atual guardada como referência `#designfy-review`
- [ ] Rotas, textos, dados e eventos que precisam permanecer listados em Notas `#designfy-viewspec`
```

E no fim:

```markdown
- [ ] Comparação entre a captura anterior e a nova, com o que mudou `#designfy-review`
```
