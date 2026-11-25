# Página de artigo

As regiões de uma página de artigo, de cima para baixo, com o fragmento
do catálogo de cada uma.

## Regiões

| # | Região | Fragmento | Observação |
| --- | --- | --- | --- |
| 1 | cabeçalho do site | `site-header` | o do projeto |
| 2 | progresso de leitura | `reading-progress` | barra fina no topo; opcional em artigo curto |
| 3 | trilha | `breadcrumbs` | Blog e categoria |
| 4 | cabeçalho do artigo | `article-header` | categoria, título, resumo, autoria, data, tempo de leitura, capa |
| 5 | corpo | `prose` | com os elementos do texto |
| 6 | índice | `table-of-contents` | lateral no desktop largo, recolhido no resto |
| 7 | fim do artigo | `author-box`, etiquetas, compartilhar | o que identifica e encaminha |
| 8 | relacionados | três `post-card` | mesma categoria |
| 9 | ação final | `cta-band` ou `newsletter-form` | ligada ao tema do artigo |
| 10 | rodapé | `site-footer` | o do projeto |

## Cabeçalho do artigo

| Parte | Regra |
| --- | --- |
| categoria | link para a página da categoria, em texto normal acima do título; é um destino, não um enfeite |
| título | `h1`, em `text-headline` ou `text-display` conforme o comprimento; até três linhas no desktop |
| resumo | uma ou duas frases em `text-lead`, que não repetem o título |
| autoria | avatar, nome com link para a página da pessoa |
| data | `<time datetime>` no formato do público; data de atualização quando muda o conteúdo |
| tempo de leitura | calculado do texto (perto de 200 palavras por minuto) |
| capa | imagem real, com dimensões e prioridade alta de carga |

Variações: centralizado (ensaio), à esquerda com a capa abaixo (padrão) e
capa atrás do título com película (matéria de destaque, com o contraste
medido). Artigo sem capa: o cabeçalho fica só com texto e o corpo sobe.

## Corpo

```astro
<article class="df-container">
  <ArticleHeader {...post} />
  <div class="grid gap-12 xl:grid-cols-[minmax(0,1fr)_16rem]">
    <Prose><Content /></Prose>
    <TableOfContents headings={headings} />
  </div>
</article>
```

- O texto fica na medida; a grade externa abriga o índice.
- A coluna do texto usa `minmax(0, 1fr)` para tabela e código não
  alargarem a página.
- Elementos largos (figura `wide`, tabela grande) podem passar da medida
  até a largura do container.

## Índice

- Aparece em artigo com quatro seções ou mais.
- Lista os `h2` e, quando ajudam, os `h3`.
- No desktop largo: coluna lateral fixa (`sticky`, abaixo do cabeçalho),
  com a seção atual marcada e o marcador deslizando.
- Abaixo disso: bloco recolhido logo depois do cabeçalho do artigo
  (`details`), que funciona sem JavaScript.
- Dentro de `nav` com rótulo; item atual com `aria-current`.
- Os títulos do corpo têm `id` gerado do texto e `scroll-margin-top` igual
  à altura do cabeçalho fixo.

## Fim do artigo

- `author-box`: foto, nome, uma frase e os links da pessoa.
- Etiquetas como links para páginas reais, quando existem.
- Compartilhar: links simples (copiar endereço e as redes que o público
  usa), sem scripts de terceiros.
- Data de atualização e link para sugerir correção, em conteúdo técnico.

## Relacionados e ação final

Três artigos da mesma categoria, os mais recentes ou os escolhidos no
front matter. Com menos de três, mostra os que há; com nenhum, a seção
não aparece.

A ação final sai do tema do artigo: o produto ou curso ligado, a
inscrição na lista, o próximo artigo da série. Uma só.

## Série e navegação entre artigos

Artigo de uma série mostra a posição ("Parte 2 de 5") no cabeçalho, com
link para o índice da série, e "anterior" e "próximo" no fim.

## Movimento

| Parte | Movimento |
| --- | --- |
| progresso de leitura | cresce com a rolagem |
| capa | opacidade e escala de 1.03 para 1 |
| índice | marcador desliza para a seção atual |
| âncora | rolagem suave e destaque breve do título |
| código | o botão de copiar confirma |
| imagem ampliável | transição de elemento compartilhado |
| relacionados e ação final | revelação ao entrar |

O corpo do texto não se move.

## Dados estruturados e metadados

Título, descrição, imagem de compartilhamento, data de publicação e de
atualização e autoria no `head`. Dados estruturados de artigo quando o
projeto usa. Em projeto Astro com o
[Astrofy](https://github.com/promovaweb/astrofy), as skills de SEO e de
dados estruturados cuidam disso.

## Estados

- Sem capa, sem autor cadastrado, sem relacionados, sem etiquetas: cada
  região some sem deixar buraco.
- Artigo muito curto: sem índice e sem barra de progresso.
- Artigo muito longo: índice com rolagem própria.
- Vídeo: fachada; sem rede, o link para o vídeo continua.
