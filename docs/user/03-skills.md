# Capítulo 3: Skills

O pedido chega ao agente com uma frase: "cria a página de preços do produto".
O agente abre a skill `designfy`, lê o projeto e o guia, escreve o viewspec da
tela e chama as especialistas na ordem. No fim, a página existe, a checklist
está marcada e as capturas foram revisadas. Nenhuma etapa mora no binário:
todas moram nas skills que o agente lê.

## As onze skills internas

O catálogo tem onze skills `designfy*`, todas com origem em
`promovaweb/designfy` e marcadas como padrão.

| Skill | Grupo | Quando entra | Entrega |
| --- | --- | --- | --- |
| `designfy` | core | todo pedido de interface | viewspec, interface pronta, revisão e relato |
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

## O que cada skill faz

### `designfy`

É a porta de entrada. Lê o projeto e o guia, classifica o pedido em superfície,
tipo de tela, rota e ação principal, escolhe os fragmentos e monta o viewspec.
Lê as referências de leitura do pedido, roteamento, fluxo, preparo, entrega e
uso do binário. Entrega a interface implementada, a checklist executada, as
capturas revisadas e o relato final.

### `designfy-viewspec`

Escreve e mantém o guia `VIEWSPEC.md` da raiz e o viewspec de cada tela em
`viewspec/<id>-<slug>/VIEWSPEC.md`, com as nove seções e a checklist. É chamada
para criar o guia, especificar uma tela, retomar um trabalho aberto ou validar
arquivos. Lê o contrato, o guia do projeto, o viewspec da tela, as checklists
por tipo, a execução e os erros de validação, e usa os modelos e exemplos da
skill. Entrega o arquivo válido, com o progresso e as notas.

### `designfy-design-system`

Cuida do arquivo de tokens que todos os componentes leem: cor, tipografia,
raios, espaçamento, fundos, sombras e temas. Entra quando o projeto não tem
tema, quando `designfy theme check` reprova ou quando o pedido muda a
identidade visual. Lê tokens, a roda de cores, contraste, tipografia,
espaçamento, fundos e o catálogo de padrões, formas e modo escuro. Entrega o
tema ligado ao build, a paleta com a harmonia registrada, os pares medidos e o
guia atualizado.

### `designfy-components`

Resolve de onde vem cada peça da tela e como ela se comporta. Entra quando a
região precisa de componente, quando é hora de instalar shadcn ou ReUI e quando
um componente novo precisa nascer nas convenções do registro. Lê o catálogo de
interface, fontes e instalação, o registro, shadcn e ReUI, componentização,
estados, Tailwind, React, Astro e bibliotecas sugeridas. Entrega os arquivos no
projeto, as dependências resolvidas, os estados cobertos e os componentes novos
documentados.

### `designfy-motion`

Define o movimento de cada parte da tela. Entra em toda tela, porque movimento
é o padrão, e com mais peso quando há entrada, revelação ao rolar, laço ou
troca de estado. Lê princípios, movimento por tipo de tela, utilidades do
Tailwind e do Designfy, CSS moderno, `motion/react`, receitas, movimento
reduzido e desempenho. Entrega a lista do que se move com gatilho, duração e
curva, a implementação na ferramenta mais leve e a captura parada.

### `designfy-websites`

Monta páginas públicas como um argumento, uma ideia por tela. Entra em landing
page, home, página de produto, preços, sobre, contato, hero, cabeçalho ou
rodapé. Lê a arquitetura da página, o hero, as seções, a navegação e o rodapé, a
conversão, o texto, as imagens e os vícios de página gerada. Entrega a ordem das
seções com a pergunta que cada uma responde, o fragmento e a fonte de cada uma,
as lacunas de conteúdo e o que fica para as outras especialistas.

### `designfy-content`

Cuida da leitura em blogs, artigos, guias e documentação. Entra em artigo,
listagem, categoria, documentação e embed de mídia. Lê a diagramação do texto,
a página de artigo, a listagem, os elementos do texto, imagens e embeds,
documentação e Markdown ou MDX. Entrega a medida e a escala, os elementos
tratados, a listagem no ar e o comportamento de tabela e código no celular.

### `designfy-webapps`

Desenha telas de trabalho em React com shadcn, ReUI e Tailwind. Entra em
dashboard, tabela, formulário, CRUD, detalhe, configurações e autenticação. Lê o
shell e a navegação, as tabelas, os formulários, os dashboards e contadores, o
CRUD e o detalhe, as configurações, a autenticação, os estados e avisos e a
densidade do texto. Entrega a especificação do dado, a tela composta, todos os
estados vistos e o estado de tela na URL.

### `designfy-responsive`

Planeja cada largura em vez de encolher o desktop. Entra em pedido de versão
mobile, correção de rolagem horizontal, tabela no celular, menu mobile e ajuste
de tela larga. Lê as faixas e pontos de quebra, os padrões de adaptação, a
fluidez e as consultas de contêiner, o toque e o celular, o estouro e a
conferência com capturas. Entrega o plano por região, as capturas antes e
depois e os padrões levados ao guia.

### `designfy-accessibility`

Confere a tela contra a WCAG 2.2 nível AA e corrige o que encontra. Entra em
pedido de acessibilidade, auditoria, contraste, teclado, leitor de tela e ARIA,
e no fechamento de toda tela. Lê a WCAG na prática, teclado e foco, semântica e
nomes, cor e contraste, formulários, componentes interativos, mídia e movimento
e a auditoria. Entrega a auditoria automática, o roteiro manual, as correções e
o relatório.

### `designfy-review`

Olha a tela pronta com olhos novos. Entra no fechamento de um viewspec, depois
da primeira dobra ou antes de publicar. Lê o ciclo de revisão, as capturas, a
leitura das imagens, a otimização por largura, a gravidade e o encaminhamento, a
revisão por tipo e a lista de acabamento. Entrega as execuções de captura, os
achados por gravidade com a dona de cada um, o veredito e o que vai para o guia.

## O fluxo da skill `designfy`

A orquestração tem oito estágios: ler o projeto, ler o pedido, garantir o guia,
escolher os fragmentos, montar o viewspec, executar com as especialistas,
revisar com capturas e fechar. O trabalho para em três pontos apenas:

1. **Esclarecimento do pedido.** Uma mensagem, no máximo três perguntas, com a
   opção recomendada primeiro.
2. **Plano da tela.** Só quando existe mais de uma estrutura plausível. O plano
   mostra as regiões em ordem, o fragmento de cada uma e o que muda.
3. **Achado que é escolha de produto.** Por exemplo, decidir quais colunas da
   tabela ficam no celular.

Fora deles, o trabalho corre e você recebe marcos curtos: o que ficou pronto e
como conferir.

## Três pedidos de exemplo

**Página de preços.** "Cria a página de preços em `/precos/` com os planos de
`content/precos.md`; a ação principal é falar com vendas." A `designfy`
classifica como `site-page`, superfície `site`, cria
`viewspec/0001-pagina-de-precos/VIEWSPEC.md` e chama `designfy-websites`,
`designfy-components`, `designfy-motion`, `designfy-responsive`,
`designfy-accessibility` e `designfy-review`.

**Dashboard.** "Redesenha o dashboard de vendas em `/app/vendas`; os dados vêm
de `GET /api/sales/summary`; a ação principal é abrir os pedidos em atraso." A
classificação é `dashboard`, superfície `system`, e o viewspec nasce como
`viewspec/0002-dashboard-de-vendas/VIEWSPEC.md`. Rodam
`designfy-design-system` se faltar papel de cor, `designfy-webapps`,
`designfy-components`, `designfy-motion`, `designfy-responsive`,
`designfy-accessibility` e `designfy-review`.

**Artigo do blog.** "Monta a página de artigo com o texto de
`content/blog/primeiro-post.md`, índice lateral e embeds de vídeo." A
classificação é `blog-post`, superfície `site`, com
`viewspec/0003-artigo-do-primeiro-post/VIEWSPEC.md`. Rodam `designfy-content`,
`designfy-components`, `designfy-motion`, `designfy-responsive`,
`designfy-accessibility` e `designfy-review`.

## As skills externas

O catálogo também instala cinco skills de fora:

| Skill | Origem | Quando entra |
| --- | --- | --- |
| `hallmark` | [nutlope/hallmark](https://github.com/nutlope/hallmark) | desenhar página nova com direção de arte e slop test |
| `shadcn` | [shadcn/ui](https://github.com/shadcn-ui/ui) | procurar, instalar, corrigir e compor componentes |
| `migrate-radix-to-base` | shadcn/ui | migrar Radix UI para Base UI, só com pedido explícito |
| `astrofy` | [promovaweb/astrofy](https://github.com/promovaweb/astrofy) | projeto Astro: arquitetura, páginas, SEO e deploy |
| `brandfy` | [promovaweb/brandfy](https://github.com/promovaweb/brandfy) | marca nova: estratégia, logo, paleta e manual |

O `shadcn` e o `astrofy` só entram em projeto compatível. O `astrofy` e o
`brandfy` instalam a biblioteca inteira da origem.

## Instalar e listar

```bash
designfy skills list
designfy skills install --dry-run
```

O `list` mostra `project`, `global` ou `no` para cada skill. O `install` agrupa
as skills por origem e roda um `npx -y skills add` por grupo. O `update` e o
`remove` seguem o mesmo caminho e gravam o `skills-lock.json` do projeto.

## Conferir

- `designfy skills list` mostra as onze internas e as cinco externas.
- `skills-lock.json` está versionado com o projeto.
- `designfy skills install --dry-run` imprime um comando por origem.
- O relato final cita o viewspec criado e a pasta da captura.
