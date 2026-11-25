# Viewspec de uma tela

Como preencher o front matter e as nove seções. O formato está em
[contrato.md](contrato.md); aqui está o que torna cada seção útil para quem
implementa.

## Front matter

- `id`: o `nextId` de `designfy viewspec progress`.
- `slug`: o nome da tela em kebab-case, sem verbo (`dashboard-de-vendas`,
  `landing-page-do-curso`, `lista-de-pedidos`).
- `title`: como a pessoa chama a tela.
- `summary`: uma frase com quem usa e para quê.
- `kind` e `surface`: da tabela do contrato.
- `route`: a rota real. Tela que ainda não tem rota recebe a rota planejada.
- `skills`: as especialistas na ordem de execução.
- `components`: os fragmentos escolhidos no catálogo, pelos identificadores.
- `guideRules`: as regras do guia que a tela aplica de forma direta.
- `relatedFiles`: vazio na criação; preenchido na execução.

## `## Objetivo`

Três frases, no máximo:

1. Quem abre a tela e em qual momento.
2. O que essa pessoa precisa conseguir.
3. A ação principal, com o rótulo do botão.

> A gerente comercial abre a tela de manhã para saber se a meta do dia está
> no ritmo. A ação principal é "Ver pedidos em atraso".

Se você não consegue nomear a ação principal, a tela ainda não está
entendida: volte ao pedido.

## `## Conteúdo`

Uma lista do que aparece e de onde vem. Para cada item: o que é, a fonte e
se já existe.

```markdown
- Título e frase do hero: `src/content/pages/curso.md` (existe).
- Seis módulos do curso, com nome e duração: coleção `modulos` (existe).
- Depoimentos: três, com nome e foto, enviados pela Ana em 20/11 (existe).
- Preço e condições: **lacuna**, depende do comercial.
```

Em tela de sistema, acrescente as entidades e os campos (com tipo e
obrigatoriedade), o endpoint ou a função que entrega os dados e o volume
esperado (dezenas, milhares, mais).

Nunca escreva texto de exemplo no lugar do conteúdo. Lacuna é lacuna.

## `## Estrutura`

As regiões da tela na ordem de leitura, cada uma com o fragmento do
catálogo e a fonte:

```markdown
1. Cabeçalho do site: `site-header` (próprio, já existe).
2. Hero: `hero-split` (`designfy:hero-split`), texto à esquerda, quadro do
   produto à direita.
3. Prova: `logo-strip` (`designfy:logo-marquee`), seis logos reais.
4. Recursos: `bento-grid` (`designfy:bento-grid`), cinco blocos.
5. Chamada final: `cta-band` (`designfy:cta-band`).
6. Rodapé: `site-footer` (próprio, já existe).
```

Em sistema: shell, cabeçalho da página, área principal e painéis laterais.
Diga a hierarquia: o que a pessoa vê primeiro, depois e por último.

Confira cada região contra `designfy catalog show <id>`: `useWhen` precisa
valer e `avoidWhen` não pode valer. Fragmento sem conteúdo real para
preencher sai da lista.

## `## Estados`

Para a tela e para cada região que carrega dados ou recebe ação:

| Estado | Escreva |
| --- | --- |
| carregando | o que aparece (esqueleto com a forma do conteúdo) e por quanto tempo antes de avisar |
| vazio | o texto, a causa e a ação oferecida; diferencie primeiro uso de filtro sem resultado |
| erro | o que a pessoa lê, o que ela pode fazer e o que foi preservado |
| sucesso | o que confirma (a mudança na tela, um aviso curto) |
| sem permissão | o que aparece no lugar |
| parcial | uma região falhou e as outras seguem |
| lotado | texto longo, número grande, lista com mil itens |

Em formulário: a regra de validação de cada campo, quando ela roda (ao
sair do campo, ao enviar) e o texto do erro; o que acontece depois de
enviar (para onde vai, o que confirma).

Em página de site estática, os estados são os do formulário e da
navegação. Escreva `Não se aplica.` para o resto, com o motivo.

## `## Responsivo`

Três linhas, uma por faixa, dizendo o que muda de fato:

```markdown
- Celular (390): hero empilha com o texto primeiro; bento vira uma coluna na
  ordem de leitura; ações em largura total; cabeçalho com menu em gaveta.
- Tablet (820): bento em duas colunas; quadro do hero abaixo do texto.
- Desktop (1440): duas colunas no hero; bento 3 por 2; container de 1200 px.
```

Para tabela, escreva o formato no celular: cartões (quais campos ficam) ou
rolagem dentro da caixa com a primeira coluna fixa. Para navegação, o que
vira gaveta.

## `## Movimento`

Liste o que se move, quando, quanto dura e por quê. Use os tokens de
movimento do guia.

```markdown
- Entrada do hero: título, frase e ações sobem 16 px com opacidade, em
  sequência de 80 ms, 600 ms no total, uma vez.
- Quadro do produto: três estados reais em troca automática a cada 4 s, com
  pausa no hover e no foco.
- Seções: revelação única ao entrar 20% na tela.
- Cartões do bento: borda e elevação de 2 px no hover, 200 ms.
- Movimento reduzido: tudo aparece no estado final; o quadro mostra o
  primeiro estado, parado.
```

Tela sem linha nenhuma aqui não passa: movimento é o padrão. A exceção é o
guia do projeto pedir tela parada, e então a seção cita a regra.

## `## Acessibilidade`

- Marcos (`header`, `nav`, `main`, `footer`) e a hierarquia de títulos.
- Ordem de foco, quando ela não é a ordem visual óbvia.
- Nome acessível dos controles sem texto.
- Pares de cor usados fora do padrão do guia, com o contraste medido.
- O que o leitor de tela precisa ouvir numa mudança (resultado de filtro,
  erro de envio, item adicionado).
- Alternativa em texto para gráfico, vídeo e imagem com informação.

## `## Checklist`

Monte com [checklists-por-tipo.md](checklists-por-tipo.md). Um item é uma
tarefa que uma especialista conclui e confere sozinha. Divida o que juntar
duas donas. Ordene pela ordem de execução.

Gere o `{#id}` de cada item com quatro caracteres aleatórios `[a-z0-9]`:

```bash
node -e "console.log(Math.random().toString(36).slice(2,6))"
```

## `## Notas`

Começa vazia ou com o que veio do pedido: escolhas já feitas pela pessoa,
restrições (prazo, conteúdo que não pode mudar) e, em redesenho, o que
precisa permanecer.

## Antes de entregar o viewspec

- [ ] A ação principal está nomeada com o rótulo do botão.
- [ ] Toda região tem fragmento do catálogo ou a nota de por que é própria.
- [ ] Nenhum texto de exemplo; lacunas marcadas.
- [ ] Cada região com dados tem carregando, vazio e erro.
- [ ] O formato no celular está escrito para tabela, navegação e grade.
- [ ] Há movimento descrito, com a versão parada.
- [ ] As regras do guia aplicadas estão em `guideRules`.
- [ ] Todo item da checklist tem dona e `{#id}`.
- [ ] `designfy viewspec validate <id>` sai com 0.
