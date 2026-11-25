# Projeto que já tem design

Como entrar num projeto que já tem interface pronta, tema próprio ou regras
de design escritas. O trabalho começa por entender e documentar o que existe.
Mudar vem depois, tela a tela, com o guia do projeto como base.

Use esta referência antes de [preparo-do-projeto.md](preparo-do-projeto.md)
sempre que o projeto tiver pelo menos um destes sinais:

- páginas ou telas publicadas;
- CSS de tema, `tailwind.config.*` ou tokens próprios;
- documento de design, manual de marca, lista de componentes ou regras de
  página (`DESIGN.md`, `docs/design*`, `brand/`, arquivos com "design",
  "ui" ou "componentes" no nome);
- regras de interface no `AGENTS.md`, `CLAUDE.md` ou `README.md`;
- monorepo: a pasta do projeto fica dentro de outro repositório com as
  próprias instruções na raiz.

## Regras

1. **Descrever antes de reformar.** O primeiro resultado é o guia
   `VIEWSPEC.md` descrevendo o projeto como ele é. Nada de tema novo,
   Tailwind novo, componente copiado ou dependência instalada nesse momento.
2. **A fonte do projeto vale mais.** Quando o projeto já documenta uma regra,
   o guia resume em uma linha conferível, cita o arquivo de origem e diz que
   o arquivo prevalece. Não copie documentos inteiros para o guia.
3. **Origem pelo autor da regra.** Regra que o documento atribui a uma pessoa
   ("por orientação de", "pedido de", uma data com nome) entra como
   `@pessoa`. Padrão medido no código entra como `@agente`. Achado de
   auditoria registrada entra como `@revisão`.
4. **O projeto vale mais que as especialistas.** Quando uma regra do projeto
   contraria o padrão de uma skill `designfy-*`, siga o projeto e registre a
   diferença em `## Aprendizados`, citando a skill.
5. **Os processos do projeto continuam.** Registro de tarefas, especificação
   própria (sitespec, spec, issue), validações, convenções de nome e regras
   de commit seguem como o projeto manda. O viewspec soma, não substitui.
6. **Poucas perguntas.** As fontes escritas costumam responder a entrevista
   do guia. Pergunte só o que nenhuma fonte responde.

## Passos

### 1. Ler as instruções

Leia o `AGENTS.md`, o `CLAUDE.md` e o `README.md` do projeto. Em monorepo,
leia também os da raiz do repositório pai: regras de interface costumam
morar lá. Anote as fontes de design que eles apontam e a ordem de leitura que
pedem.

### 2. Encontrar os documentos de design

```bash
ls *.md docs 2>/dev/null
find . -maxdepth 3 -iname '*design*' -not -path '*/node_modules/*'
find . -maxdepth 3 -iname '*brand*' -not -path '*/node_modules/*'
```

Leia cada documento achado pelo índice (os títulos) e depois as seções de
cores, tipografia, layout, movimento, componentes, páginas e
acessibilidade. Separe:

- regras com dono e data;
- padrões medidos no código (contagens, escalas);
- exceções: áreas com sistema próprio (documentação, blog, portais,
  painéis) que este guia não cobre;
- débitos conhecidos: o que o próprio documento diz que está fora da regra.

### 3. Ler o tema real

```bash
designfy theme show --json
designfy status --json
```

Confira a versão do Tailwind, o arquivo de configuração e o CSS de tokens.
Projetos antigos usam escalas próprias (`primary-500`, `neutral-900`) em vez
dos papéis do shadcn (`bg-primary`, `text-muted-foreground`). O guia
descreve a escala que o projeto usa; não troque pela dos papéis. Anote também
como o modo escuro é ligado (classe, atributo, preferência do sistema).

Quando `theme show` falhar, leia os arquivos à mão e registre a falha no
relato: é uma lacuna do binário, não do projeto.

### 4. Ler os componentes e as telas

Liste a pasta de componentes e leia duas ou três telas prontas de cada tipo
(home, página interna, artigo, formulário, tabela). Registre os primitivos de
layout (grade, seção, container), os componentes de cabeçalho, botão e
cartão, e as convenções de código (BEM, estilos com escopo, props tipadas).

Capture as telas principais antes de qualquer mudança. Essa execução é a
linha de base da comparação:

```bash
designfy capture run http://localhost:4321/ --viewport mobile,desktop
```

### 5. Medir a compatibilidade com o registro

Os componentes do registro do Designfy usam Tailwind 4 e os papéis do tema.

| Projeto | O que fazer com o registro |
| --- | --- |
| Tailwind 4 com papéis do shadcn | `designfy components add` direto |
| Tailwind 4 com escala própria | copie e troque as classes de papel pelas do projeto, ou mapeie os papéis no `@theme inline` |
| Tailwind 3 | use o item como referência de estrutura, estados e movimento, e escreva o componente no padrão do projeto; a migração para o Tailwind 4 é uma tarefa própria, pedida pela pessoa |

Não rode `designfy deps install` com os grupos padrão num projeto que já tem
Tailwind: o grupo traz o Tailwind 4.

### 6. Escrever o guia

Chame a `designfy-viewspec` no modo guia com o que foi levantado. Em cada
seção:

- um parágrafo de contexto com a fonte canônica (arquivo e seção);
- as regras em uma linha, com a origem certa;
- em `## Faça e não faça`, os débitos conhecidos, para tela nova não
  repetir;
- em `## Aprendizados`, as regras com data registradas nas fontes e as
  diferenças entre o projeto e as skills.

O `tokensFile` aponta para o CSS de tokens que o projeto já usa.

### 7. Configurar sem mexer no build

```bash
designfy init
```

O `designfy.json` registra as pastas. Confira `components`, `styles` e
`viewspecs` contra o que o projeto usa e ajuste com as opções do `init`.

## Saída

Além do guia, entregue à pessoa um relato de adoção:

- fontes lidas, com o caminho de cada uma;
- o tema encontrado (Tailwind, escala, modo escuro) e a compatibilidade com
  o registro;
- as áreas com sistema próprio que ficaram fora do guia;
- as diferenças entre o projeto e as skills do Designfy;
- os débitos conhecidos;
- as lacunas do binário encontradas no caminho;
- a sugestão da primeira tela para usar o fluxo completo.
