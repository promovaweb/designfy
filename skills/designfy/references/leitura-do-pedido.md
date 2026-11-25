# Leitura do pedido

Como transformar a frase da pessoa nos campos do viewspec. Leia antes de
escolher fragmentos ou especialistas.

## O que extrair

| Campo | Pergunta que responde | De onde sai |
| --- | --- | --- |
| `surface` | é página pública ou tela de sistema? | o pedido, a rota, o projeto |
| `kind` | qual tipo de tela? | tabela abaixo |
| `route` | onde ela vive? | o pedido ou a estrutura de rotas do projeto |
| ação principal | o que a pessoa que usa a tela precisa conseguir? | o pedido; se não estiver dito, pergunte |
| conteúdo | que textos, dados e mídias existem? | arquivos do projeto, coleções, endpoints, o que a pessoa colar |
| lacunas | o que falta para a tela ficar real? | comparação entre o tipo de tela e o conteúdo |
| alcance | tela nova, redesenho, seção ou ajuste? | o pedido |

## Tipo de tela

| A pessoa diz | `kind` | `surface` |
| --- | --- | --- |
| landing page, página de venda, página de captura, página de lançamento | `landing-page` | `site` |
| home, página inicial, portal | `home` | `site` |
| página de produto, preços, sobre, contato, serviço | `site-page` | `site` |
| blog, listagem de posts, categoria, tag | `blog-index` | `site` |
| artigo, post, guia, conteúdo longo | `blog-post` | `site` |
| documentação, página de docs, referência | `docs-page` | `site` |
| dashboard, painel, visão geral, indicadores | `dashboard` | `system` |
| listagem, tabela, lista de pedidos, relatório em linhas | `table` | `system` |
| formulário, cadastro, tela de edição, fluxo em etapas, checkout | `form` | `system` |
| CRUD, gestão de um recurso, lista com detalhe e edição | `crud` | `system` |
| detalhe, ficha, perfil de um registro | `detail` | `system` |
| configurações, preferências, conta, plano e cobrança | `settings` | `system` |
| login, cadastro de conta, recuperar senha, verificação | `auth` | `system` |

Pedido que junta dois tipos vira dois viewspecs ligados por `dependsOn`.
Um CRUD é um viewspec `crud` quando lista, detalhe e edição compartilham a
mesma estrutura; quando o formulário tem fluxo próprio em etapas, ele ganha
o seu viewspec `form`.

## Alcance

| Alcance | O que muda no fluxo |
| --- | --- |
| tela nova | fluxo inteiro |
| redesenho de tela que existe | capture a tela atual antes (`designfy capture run --name antes-<slug>`), leia o código dela e registre em `## Notas` o que precisa permanecer (rotas, textos, dados, eventos) |
| seção ou componente dentro de uma tela | viewspec da tela inteira já existe: acrescente itens à checklist; não existe: crie o viewspec da tela com as outras regiões marcadas como "sem alteração" |
| ajuste pontual (cor, espaçamento, um estado) | item novo na checklist do viewspec existente e passagem direta para a especialista dona; a revisão com captura continua valendo |
| mudança de padrão para o projeto inteiro | altere o guia `VIEWSPEC.md` primeiro e liste as telas afetadas |

## O que não perguntar

Não pergunte o que dá para ler:

- framework, Tailwind, shadcn, pasta de componentes: `designfy status`;
- cores, fontes, raios: `designfy theme show` e o guia;
- padrão de tabela, formulário, vazio, erro: seção `## Padrões de tela` do
  guia;
- textos e dados: arquivos de conteúdo, coleções, tipos e endpoints do
  projeto.

## O que perguntar quando faltar

Só o que muda a estrutura da tela. Use
[assets/pedido-de-esclarecimento.md](../assets/pedido-de-esclarecimento.md).

| Falta | Pergunta |
| --- | --- |
| ação principal | "Qual é a única coisa que a pessoa precisa conseguir nesta tela?" |
| conteúdo de uma região obrigatória | "De onde vêm os dados de X? Arquivo, endpoint ou você me passa?" |
| volume em tela de sistema | "Quantos registros essa lista costuma ter: dezenas, milhares ou mais?" |
| quem usa | "Quem abre essa tela e com que frequência?" quando isso muda a densidade |
| prova em página de venda | "Você tem depoimentos, números ou logos reais para usar? Sem isso a seção não entra." |

## Sinais de pedido maior do que parece

- "Um dashboard" sem fonte de dados: a tela depende de endpoints que não
  existem. Registre as lacunas e monte com dados de exemplo marcados como
  exemplo.
- "Igual ao site X": trate como referência de estrutura. Cores, fontes e
  textos continuam os do projeto. Não copie marca nem conteúdo de terceiros.
- "Deixa mais bonito": peça a tela e o que incomoda, capture o estado atual
  e passe pela `designfy-review` antes de mudar qualquer coisa. O relatório
  dela vira a checklist.
- "Faz o site inteiro": liste as páginas, crie o guia e um viewspec por
  página, e execute um por vez na ordem de `dependsOn`.
