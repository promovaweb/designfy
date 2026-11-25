# Capítulo 3: Skills

Na revisão do Plano Founders, as setas do carrossel de depoimentos precisavam aparecer ao receber foco pelo teclado. Nas linhas sem link, o ajuste era retirar o efeito de hover que sugeria um clique. O agente registrou os dois comportamentos no viewspec para conferi-los na mesma rota pelo navegador.

## Seleção e instalação no projeto

O agente encontra o método de trabalho nas skills. O executável fornece operações como medir o contraste de um tema ou copiar um componente para a aplicação. Para saber quais instruções já estão disponíveis ao agente, consulte o catálogo na raiz do projeto e veja o plano de instalação.

```bash
designfy skills list
designfy skills install --dry-run
```

Na primeira saída, `project` indica instalação local e `global` indica instalação para o usuário. O valor `no` identifica uma skill ausente. A simulação agrupa as selecionadas por origem e mostra um comando por grupo. Ao rodar `designfy skills install`, o Designfy chama `npx -y skills add` para cada origem. Para atualizar as skills do projeto, use `designfy skills update`. A remoção exige o nome da skill, como em `designfy skills remove designfy-motion`. Mantenha o `skills-lock.json` versionado com a aplicação para registrar as instalações do projeto.

## As onze skills do Designfy

A origem das onze skills internas é `promovaweb/designfy`. Todas fazem parte da seleção padrão. A coluna de entrega ajuda a localizar a especialista adequada quando você já tem um viewspec aberto.

| Skill | Grupo | Quando entra | Entrega |
| --- | --- | --- | --- |
| `designfy` | core | trabalho de interface | viewspec, interface pronta, revisão e relato |
| `designfy-viewspec` | core | guia, tela nova, retomada ou validação | os dois níveis do viewspec e o estado |
| `designfy-design-system` | foundation | tema ausente, paleta, tipo, fundo e forma | arquivo de tokens e contraste medido |
| `designfy-components` | foundation | escolher, copiar, compor ou criar peça | componentes no projeto, com estados |
| `designfy-motion` | foundation | entrada, rolagem, hover e troca de estado | movimento com versão parada |
| `designfy-websites` | surfaces | site, landing page e página pública | página montada como argumento |
| `designfy-content` | surfaces | blog, artigo e documentação | leitura confortável e páginas ao redor |
| `designfy-webapps` | surfaces | dashboard, tabela, formulário e CRUD | tela de trabalho com todos os estados |
| `designfy-responsive` | quality | celular, tablet e tela larga | plano por faixa e estouro corrigido |
| `designfy-accessibility` | quality | WCAG 2.2 nível AA | auditoria, correções e relatório |
| `designfy-review` | quality | fechamento de um viewspec | capturas, achados e veredito |

Até a versão 0.1.4, a especialista em telas de sistema aparecia como `designfy-systems`. Use `designfy-webapps` nas chamadas atuais. Ao revisar uma instalação antiga, confira o nome também no guia e no `skills-lock.json`.

### A rota e o viewspec

A orquestradora `designfy` identifica a rota, o tipo de interface e a ação principal. A partir do guia do projeto, escolhe os fragmentos de cada região e cria o viewspec com as especialistas que vai acionar. Depois de executar a checklist, o agente revisa as imagens e registra no relato o caminho da captura.

A `designfy-viewspec` cuida dos dois arquivos de especificação. No `VIEWSPEC.md` da raiz, registra o que vale para o projeto. Em `viewspec/<id>-<slug>/VIEWSPEC.md`, aplica o contrato de nove seções à tela. A skill traz modelos e checklists por tipo de interface. Ao retomar um arquivo aberto, ela lê as notas e o progresso para localizar a próxima tarefa ou corrigir uma falha de validação.

O fluxo admite uma consulta inicial com até três perguntas reunidas em uma mensagem, com a opção recomendada primeiro. Quando há mais de uma estrutura plausível, o agente apresenta um plano com a ordem das regiões e o fragmento de cada uma. A terceira ocasião de consulta ocorre quando a revisão exige uma escolha de produto, como definir quais colunas continuam visíveis no celular. Durante o restante da execução, os marcos indicam o que já pode ser conferido.

### Tema, componentes e movimento

Use a `designfy-design-system` quando o projeto precisar de um tema ou quando a identidade visual mudar. A especialista liga o arquivo de tokens ao build e registra a harmonia da paleta no guia. Uma falha de `designfy theme check` também aciona esse trabalho. Para corrigir o contraste de um botão, ela precisa identificar os papéis usados no texto e no fundo daquele controle.

A `designfy-components` parte da função de cada região para localizar uma peça no catálogo. Verifica as fontes do registro e as opções do shadcn e do ReUI antes de compor em React ou Astro. Na entrega, cada componente tem as dependências resolvidas e os estados tratados. Uma peça nova ganha documentação para que outra tela possa reutilizá-la.

A `designfy-motion` acompanha cada tela e relaciona o movimento a um gatilho. No Plano Founders, a faixa animada precisava pausar fora da área visível e o pulso da linha do tempo terminava após três ciclos. A especialista especifica a duração e a curva, escolhe entre CSS, utilitários do Tailwind e `motion/react` e verifica a versão com movimento reduzido numa captura parada.

### Páginas públicas, leitura e telas de trabalho

A `designfy-websites` define o papel de cada seção de uma página pública. No estudo do Plano Founders, a ordem das 21 seções mostra onde o prazo da oferta aparece e onde o visitante encontra o preço. Ao montar outra landing page, a especialista identifica a fonte do conteúdo de cada região. Uma lacuna no texto fica registrada antes da composição do hero ou do rodapé.

Para artigos e documentação, `designfy-content` trabalha a partir do texto em Markdown ou MDX. Na captura de uma tela de documentação no celular, confira se a coluna de leitura acomoda o exemplo de código sem alargar a página inteira. A especialista ajusta a medida do texto e a escala tipográfica. Nos artigos, examina também as mídias incorporadas e o caminho de volta à listagem ou à categoria.

Em uma aplicação React, a `designfy-webapps` organiza as telas de trabalho com o shadcn, o ReUI e o Tailwind. Numa tabela, ela define a origem dos registros e quais filtros precisam ficar na URL para que a seleção sobreviva à navegação. Num formulário, descreve o que a interface mostra após o envio e como indica os campos que precisam de correção.

As três fichas associam a ação principal de cada tela à sua fonte, que pode ser um arquivo de conteúdo ou a resposta de uma API.

| Tipo e superfície | Rota ou fonte | Trabalho da especialista e arquivo |
| --- | --- | --- |
| `site-page`, `site` | Planos de `content/precos.md` para `/precos/` | `designfy-websites` organiza os planos com a ação de falar com vendas em `viewspec/0001-pagina-de-precos/VIEWSPEC.md` |
| `dashboard`, `webapp` | `GET /api/sales/summary` em `/app/vendas` | `designfy-webapps` organiza o acesso às compras em atraso em `viewspec/0002-dashboard-de-vendas/VIEWSPEC.md` |
| `blog-post`, `site` | Texto de `content/blog/primeiro-post.md` | `designfy-content` trata índice lateral e vídeos em `viewspec/0003-artigo-do-primeiro-post/VIEWSPEC.md` |

Nas três fichas, as especialistas de componentes e movimento participam da montagem. A revisão inclui responsividade e acessibilidade. No dashboard, uma lacuna nos papéis de cor também aciona a especialista de design system.

### Largura, teclado e revisão das capturas

A `designfy-responsive` planeja cada região por faixa de largura. Quando uma tabela estoura no celular, a especialista verifica os pontos de quebra, a largura do container e os alvos de toque. Compare a captura anterior à correção com a posterior na mesma largura. Uma adaptação reutilizável volta ao guia do projeto.

A `designfy-accessibility` combina auditoria automática e roteiro manual segundo a WCAG 2.2 nível AA. Na revisão final, percorra a interface pelo teclado para verificar a ordem de foco e o acesso aos controles. No Plano Founders, o anel de foco precisava aparecer no resumo do FAQ. A avaliação também cobre nomes acessíveis, semântica e leitura dos campos de formulário.

A `designfy-review` examina a primeira dobra durante a montagem e a tela completa antes do fechamento. Ela lê as imagens por largura, classifica cada achado pela gravidade e o encaminha à especialista responsável. Na captura `founders-0001-depois`, a tela ficou sem rolagem horizontal. A revisão também verificou os componentes compartilhados em repouso na rota `/planos/martech/`.

## Estudos de interfaces nos arquivos das skills

O estudo `skills/designfy-websites/references/estudos/landing-de-oferta-founders.md` descreve as 21 seções, do palco de pixels do hero à tabela de preço do plano. Entre os onze itens incorporados ao registro estão `hero-pixel` e `milestone-timeline`. O capítulo 6 explica como copiar essas composições e preenchê-las com a marca e as informações comerciais do seu produto.

Para examinar filtros e estados de uma aplicação React, abra o exemplo em `examples/react-system`. A pasta `skills/designfy-webapps/references/estudos/` descreve o formato dos estudos de telas de trabalho e ainda aguarda o primeiro estudo de uma aplicação em uso.

## Origens das seis skills externas

O catálogo inclui seis skills mantidas em outros repositórios. Consulte a origem quando precisar distinguir uma instrução do Designfy de uma convenção do framework ou do produto.

| Skill | Origem | Quando entra |
| --- | --- | --- |
| `hallmark` | [nutlope/hallmark](https://github.com/nutlope/hallmark) | desenhar página nova com direção de arte e slop test |
| `shadcn` | [shadcn/ui](https://github.com/shadcn-ui/ui) | procurar, instalar, corrigir e compor componentes |
| `migrate-radix-to-base` | shadcn/ui | migrar Radix UI para Base UI, por solicitação expressa |
| `astrofy` | [promovaweb/astrofy](https://github.com/promovaweb/astrofy) | projeto Astro: arquitetura, páginas, SEO e deploy |
| `specsfy` | [promovaweb/specsfy](https://github.com/promovaweb/specsfy) | projeto com specs: a spec da fatia como fonte da interface |
| `brandfy` | [promovaweb/brandfy](https://github.com/promovaweb/brandfy) | marca nova: estratégia, logo, paleta e manual |

A seleção de `shadcn`, `migrate-radix-to-base` e `astrofy` respeita a compatibilidade da aplicação. Para `astrofy`, `specsfy` e `brandfy`, a instalação traz a biblioteca inteira da origem. O plano de `skills install --dry-run` permite verificar essa diferença antes de alterar o projeto.
