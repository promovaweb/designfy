# Semântica, marcos, títulos e nomes acessíveis

## Elemento certo

| Função | Elemento | Não use |
| --- | --- | --- |
| executa uma ação | `button type="button"` | `div` ou `a` sem `href` |
| leva a um lugar | `a href` | `button` com navegação por script |
| envia formulário | `button type="submit"` | |
| título | `h1` a `h6` | `div` em negrito |
| lista | `ul`, `ol`, `dl` | parágrafos com hífen |
| tabela de dados | `table` com `th` | grade de `div` |
| campo | `input`, `select`, `textarea` com `label` | `div` editável |
| alternar exibição | `details` e `summary`, ou botão com `aria-expanded` | |
| diálogo | `dialog`, ou o primitivo do shadcn | `div` posicionado |
| citação | `blockquote`, `q` | |
| data e hora | `time datetime` | |
| ênfase | `strong`, `em` | `b`, `i` para sentido |
| figura com legenda | `figure`, `figcaption` | |

A primeira regra do ARIA: se existe elemento nativo, use o nativo. `role`
num `div` não traz teclado nem foco.

## Marcos

```html
<a href="#conteudo">Pular para o conteúdo</a>
<header>…<nav aria-label="Principal">…</nav></header>
<main id="conteudo">…</main>
<aside aria-label="Nesta página">…</aside>
<footer>…<nav aria-label="Rodapé">…</nav></footer>
```

- Um `main` por página.
- `header` e `footer` da página são marcos quando filhos diretos do
  `body`.
- Mais de um `nav` na página: cada um com `aria-label` próprio.
- `section` só vira marco com nome (`aria-labelledby` apontando para o
  título dela).
- Todo o conteúdo fica dentro de algum marco.

## Títulos

- Um `h1`, com o nome da página ou da tela.
- `h2` para as seções, `h3` dentro delas. Sem pular nível.
- O nível é a estrutura; o tamanho é a classe.
- Título descreve o conteúdo que vem depois.
- Não use título para estilizar texto grande que não abre seção.
- Componentes recebem o nível por propriedade (`headingLevel`).

Confira lendo só os títulos: eles formam o índice da página?

## Nome acessível

Todo controle e toda região com papel têm um nome. De onde ele vem, por
ordem de preferência:

1. o texto visível do elemento (`<button>Salvar</button>`);
2. o `label` ligado (`<label for>`);
3. `aria-labelledby`, apontando para um texto visível;
4. `aria-label`, quando não há texto visível;
5. `alt` na imagem; `title` no `iframe`.

Regras:

- O nome diz a ação ou o destino: "Fechar", "Abrir menu", "Excluir pedido
  1042".
- O nome contém o texto visível, no começo.
- Vários botões iguais na tela ("Editar" em cada linha) ganham contexto:
  `aria-label="Editar pedido 1042"`, ou `aria-describedby` com a linha.
- Não repita o papel: "Botão fechar" vira "Fechar".
- `title` não é nome confiável.
- Ícone dentro de botão com texto: `aria-hidden="true"` no ícone.

```html
<button type="button" aria-label="Fechar">
  <svg aria-hidden="true" …/>
</button>
```

## Texto alternativo

| Imagem | `alt` |
| --- | --- |
| informa (foto do produto, gráfico, captura) | o que ela mostra e por que está ali |
| é um link ou botão | o destino ou a ação |
| decorativa, ou repete o texto ao lado | `alt=""` |
| logo | o nome da marca |
| gráfico complexo | resumo curto no `alt` e a descrição ou a tabela ao lado |
| imagem de texto | o texto |

Sem "imagem de" no começo. SVG decorativo: `aria-hidden="true"`. SVG com
sentido: `role="img"` e `aria-label`, ou `title` dentro dele.

## Texto só para leitor de tela

```html
<span class="sr-only">Abre em nova aba</span>
```

`sr-only` esconde da tela e mantém para o leitor. Use para contexto que a
tela dá pelo desenho: "(atual)", "Pedido", valor vazio.

## Estados e propriedades

| Situação | Atributo |
| --- | --- |
| item atual da navegação | `aria-current="page"` |
| etapa atual | `aria-current="step"` |
| abre e fecha | `aria-expanded` no gatilho, com `aria-controls` |
| selecionado | `aria-selected` (abas, opções), `aria-checked` (caixa, alternador) |
| pressionado | `aria-pressed` em botão de alternância |
| desativado | atributo `disabled`; `aria-disabled` quando precisa continuar focável |
| inválido | `aria-invalid` com a mensagem em `aria-describedby` |
| ocupado | `aria-busy` na região que carrega |
| obrigatório | `required` |
| ordenado | `aria-sort` no `th` |
| escondido de todos | `hidden` ou `inert` |
| escondido só do leitor | `aria-hidden="true"`, nunca em elemento focável |

## Regiões vivas

Para o que muda sem mover o foco:

```html
<p role="status" aria-live="polite">42 pedidos encontrados</p>
<div role="alert">Não foi possível salvar. Tente de novo.</div>
```

- `role="status"` (educado): resultado de filtro, "salvo", progresso.
- `role="alert"` (imediato): erro que precisa de atenção.
- A região existe no DOM antes da mensagem; o texto entra depois.
- Uma mensagem por mudança. Não anuncie cada tecla digitada.
- Conteúdo que chega por carregamento: `aria-busy` enquanto carrega.

## Idioma

`<html lang="pt-BR">`. Trecho em outro idioma: `<span lang="en">`. O
idioma define a pronúncia do leitor e a hifenização.

## Tabelas

```html
<table>
  <caption>Pedidos de novembro</caption>
  <thead><tr><th scope="col">Pedido</th><th scope="col" aria-sort="descending">Data</th></tr></thead>
  <tbody><tr><th scope="row">1042</th><td>24/11/2026</td></tr></tbody>
</table>
```

Tabela é para dado tabular. Layout não usa `table`.

## Links

- O texto diz o destino fora do contexto. "Saiba mais" repetido dez vezes
  não diz nada na lista de links do leitor.
- Link que abre nova aba ou baixa arquivo avisa.
- Link e botão se distinguem pela função, não pelo estilo.
- Link no meio do texto se distingue por mais que cor (sublinhado).

## Título da página

`<title>` único por página, com o assunto primeiro: "Pedidos · Nome do
sistema". Em aplicação de página única, o título muda a cada rota.
