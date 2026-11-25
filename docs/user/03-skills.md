# Capítulo 3: Skills

Na revisão do Plano Founders, o carrossel de depoimentos precisava mostrar as setas ao receber foco pelo teclado. As linhas sem link também mudavam de aparência sob o ponteiro, como se fosse possível clicar nelas. Os dois ajustes pertenciam à mesma tela. O viewspec reuniu o trabalho das especialistas até que fosse possível conferir a página inteira no navegador.

## Seleção e instalação no projeto

O agente encontra o método de trabalho nas skills. O executável fornece operações como medir o contraste de um tema ou copiar um componente para a aplicação. Para saber quais instruções já estão disponíveis ao agente, consulte o catálogo na raiz do projeto e veja o plano de instalação.

```bash
designfy skills list
designfy skills install --dry-run
```

Na primeira saída, `project` indica instalação local e `global` indica instalação para o usuário. O valor `no` identifica uma skill ausente. A simulação agrupa as selecionadas por origem e mostra um comando por grupo. Ao rodar `designfy skills install`, o Designfy chama `npx -y skills add` para cada origem. Use `skills update` para atualizar e `skills remove` para remover. Mantenha o `skills-lock.json` versionado com a aplicação para registrar as instalações do projeto.

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

A orquestradora `designfy` começa pela aplicação e pela alteração descrita. Identifica a rota, a ação principal e o tipo de interface. Com o guia do projeto aberto, seleciona os fragmentos de cada região e cria o viewspec. Durante a implementação, aciona as especialistas indicadas no arquivo. O fechamento inclui a checklist executada, as capturas revisadas e o relato com o caminho da captura.

A `designfy-viewspec` cuida dos dois arquivos de especificação. No `VIEWSPEC.md` da raiz, registra o que vale para o projeto. Em `viewspec/<id>-<slug>/VIEWSPEC.md`, aplica o contrato de nove seções à tela. A skill traz modelos e checklists por tipo de interface. Ao retomar um arquivo aberto, ela lê as notas e o progresso para localizar a próxima tarefa ou corrigir uma falha de validação.

O fluxo admite uma consulta inicial com até três perguntas reunidas em uma mensagem, com a opção recomendada primeiro. Quando há mais de uma estrutura plausível, o agente apresenta um plano com a ordem das regiões e o fragmento de cada uma. A terceira ocasião de consulta ocorre quando a revisão exige uma escolha de produto, como definir quais colunas continuam visíveis no celular. Durante o restante da execução, os marcos indicam o que já pode ser conferido.

### Tema, componentes e movimento

Use `designfy-design-system` quando falta um tema, quando a identidade visual muda ou quando `designfy theme check` encontra um par com contraste insuficiente. A especialista liga o arquivo de tokens ao build e registra a harmonia da paleta no guia. No tema claro do site da Promovaweb, o texto do corpo alcançou 9,19:1. Já o botão secundário chegou a 1,76:1. A medição por par permite localizar a combinação que precisa de ajuste mesmo quando o texto principal está legível.

A `designfy-components` parte da função de cada região para localizar uma peça no catálogo. Verifica as fontes do registro e as opções do shadcn e do ReUI antes de compor em React ou Astro. Na entrega, cada componente tem as dependências resolvidas e os estados tratados. Uma peça nova ganha documentação para que outra tela possa reutilizá-la.

A `designfy-motion` acompanha cada tela e relaciona o movimento a um gatilho. No Plano Founders, a faixa animada precisava pausar fora da área visível e o pulso da linha do tempo terminava após três ciclos. A especialista especifica a duração e a curva, escolhe entre CSS, utilitários do Tailwind e `motion/react` e verifica a versão com movimento reduzido numa captura parada.

### Páginas públicas, leitura e telas de trabalho

A `designfy-websites` define o papel de cada seção de uma página pública. No estudo do Plano Founders, a ordem das 21 seções mostra onde o prazo da oferta aparece e onde o visitante encontra o preço. Ao montar outra landing page, a especialista identifica a fonte do conteúdo de cada região. Uma lacuna no texto fica registrada antes da composição do hero ou do rodapé.

Para artigos e documentação, `designfy-content` trabalha a partir do texto em Markdown ou MDX. Na captura de uma tela de documentação no celular, confira se a coluna de leitura acomoda o exemplo de código sem alargar a página inteira. A especialista ajusta a medida do texto e a escala tipográfica. Nos artigos, examina também as mídias incorporadas e o caminho de volta à listagem ou à categoria.

Em uma aplicação React, `designfy-webapps` organiza as telas de trabalho com shadcn, ReUI e Tailwind. A rota de uma tabela precisa acomodar filtros e seleção. Um formulário precisa indicar falha de validação e sucesso. A especialista especifica a origem da informação, monta a navegação e leva à URL o estado que precisa sobreviver ao retorno à tela.

Estas três fichas de exemplo mostram como declarar a fonte e a ação principal ao abrir um viewspec.

| Tipo e superfície | Rota ou fonte | Trabalho da especialista e arquivo |
| --- | --- | --- |
| `site-page`, `site` | Planos de `content/precos.md` para `/precos/` | `designfy-websites` organiza os planos com a ação de falar com vendas em `viewspec/0001-pagina-de-precos/VIEWSPEC.md` |
| `dashboard`, `webapp` | `GET /api/sales/summary` em `/app/vendas` | `designfy-webapps` organiza a acesso às compras em atraso em `viewspec/0002-dashboard-de-vendas/VIEWSPEC.md` |
| `blog-post`, `site` | Texto de `content/blog/primeiro-post.md` | `designfy-content` trata índice lateral e vídeos em `viewspec/0003-artigo-do-primeiro-post/VIEWSPEC.md` |

Nas três fichas, as especialistas de componentes e movimento participam da montagem. A revisão inclui responsividade e acessibilidade. No dashboard, uma lacuna nos papéis de cor também aciona a especialista de design system.

### Largura, teclado e revisão das capturas

A `designfy-responsive` planeja cada região por faixa de largura. Quando uma tabela estoura no celular, a especialista verifica os pontos de quebra, a largura do container e os alvos de toque. Compare a captura anterior à correção com a posterior na mesma largura. Uma adaptação reutilizável volta ao guia do projeto.

A `designfy-accessibility` combina auditoria automática e roteiro manual segundo a WCAG 2.2 nível AA. Na revisão final, percorra a interface pelo teclado para verificar a ordem de foco e o acesso aos controles. No Plano Founders, o anel de foco precisava aparecer no resumo do FAQ. A avaliação também cobre nomes acessíveis, semântica e leitura dos campos de formulário.

A `designfy-review` examina a primeira dobra durante a montagem e a tela completa antes do fechamento. Ela lê as imagens por largura, classifica cada achado pela gravidade e o encaminha à especialista responsável. Na captura `founders-0001-depois`, a tela ficou sem rolagem horizontal. A revisão também verificou os componentes compartilhados em repouso na rota `/planos/martech/`.

## Estudos de interfaces nos arquivos das skills

O estudo `landing-de-oferta-founders.md` fica em `skills/designfy-websites/references/estudos/`. Você pode seguir o percurso do palco de pixels do hero até a tabela de preço de um único plano. O documento identifica a função das peças e registra os onze itens que chegaram ao catálogo a partir dessa leitura, entre eles `hero-pixel` e `milestone-timeline`. O capítulo 6 trata da cópia dos componentes. Ao reaproveitar a composição, preserve a marca e as informações comerciais do seu próprio produto.

A pasta `skills/designfy-webapps/references/estudos/` adota o mesmo formato para aplicações. Enquanto aguarda o primeiro estudo de uma tela real em uso, consulte as referências da skill e os aplicativos em `examples/react-system` para examinar os padrões de sistema.

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
