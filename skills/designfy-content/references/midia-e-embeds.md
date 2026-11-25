# Imagens, figuras e vídeos embutidos

## Figura

`figure`: a mídia com legenda e crédito.

```html
<figure>
  <img src="..." alt="Bancada com três peças em fase de colagem" width="1600" height="1067" loading="lazy" decoding="async">
  <figcaption>As peças ficam presas por doze horas. <span>Foto: Ana Lima</span></figcaption>
</figure>
```

| Variação | Largura | Uso |
| --- | --- | --- |
| na medida | a do texto | padrão |
| larga | até o container | imagem que pede detalhe, tabela grande, comparação |
| sangrada | a tela inteira | abertura de capítulo, foto de impacto |
| lado a lado | duas imagens na largura do texto | antes e depois |
| ampliável | abre em tela cheia | diagrama, captura com texto pequeno |

- No celular, todas voltam à largura da tela com as margens do texto, e a
  sangrada encosta nas bordas.
- Legenda em `text-sm` e `muted-foreground`, alinhada à esquerda da
  imagem. A legenda acrescenta; o texto alternativo descreve.
- Crédito na legenda quando a licença pede.

## Imagem no corpo

| Regra | Como |
| --- | --- |
| dimensões | `width` e `height` sempre; a página não pula ao carregar |
| carga | `loading="lazy"` e `decoding="async"` em tudo abaixo da dobra |
| tamanhos | `srcset` e `sizes` de acordo com a medida (perto de 720 px no desktop) |
| formato | AVIF ou WebP |
| texto alternativo | o que a imagem mostra e por que está ali; vazio quando é enfeite |
| captura com texto | grande o bastante para ler, ou ampliável |
| tema escuro | imagem com fundo branco ganha borda fina; diagrama em SVG usa os papéis do tema |

Em Astro, `<Image>` de `astro:assets` gera os tamanhos e as dimensões. Em
Markdown, o projeto configura o processamento de imagens do conteúdo.

## Vídeo embutido

`video-embed`. A regra central: o player de terceiro só carrega depois do
clique.

Por quê: um `iframe` do YouTube carrega perto de um megabyte de script,
grava dados de navegação e atrasa a página inteira, mesmo que a pessoa
nunca dê play.

### Fachada

```astro
<VideoEmbed provider="youtube" id="VIDEO_ID" title="Como afiar um formão" poster={capa} aspect="16/9" />
```

- Antes do clique: a capa (imagem própria ou a miniatura do serviço), um
  botão de play e o título. É um `button` com o nome "Reproduzir: título
  do vídeo".
- No clique: o `iframe` substitui a capa e começa a tocar.
- Domínio sem rastreio quando o serviço oferece (`youtube-nocookie.com`).
- Proporção fixa pelo contêiner (`aspect-video`, ou a proporção do
  vídeo), para a página não pular.
- `iframe` com `title`, `allow` mínimo e `loading="lazy"`.
- Sem JavaScript: a capa é um link para o vídeo no serviço.

Bibliotecas do catálogo que fazem a fachada: `lite-youtube-embed`,
`lite-vimeo-embed` e, em Astro, `astro-embed`
(`designfy deps install media astro-embed`). O item `video-embed` do
registro faz o mesmo sem dependência.

### Vídeo próprio

```html
<video controls preload="metadata" poster="capa.jpg" width="1280" height="720">
  <source src="aula.mp4" type="video/mp4">
  <track kind="captions" src="aula.pt-BR.vtt" srclang="pt-BR" label="Português" default>
</video>
```

- `preload="metadata"`, capa, dimensões e legendas.
- Sem reprodução automática com som.
- Vídeo curto em laço no lugar de GIF: `autoplay muted loop playsinline`,
  com pausa no hover ou controle, e parado com movimento reduzido.

### Acessibilidade do vídeo

- Legendas em vídeo com fala.
- Transcrição ou resumo em texto quando o conteúdo importa para o artigo.
- Controles alcançáveis por teclado.
- Nada pisca mais de três vezes por segundo.

## Áudio

Player nativo com `controls` e `preload="none"`, título, duração e
transcrição. Podcast embutido de terceiro segue a regra da fachada.

## Outros embeds

| Embed | Como tratar |
| --- | --- |
| publicação de rede social | captura estática com link para o original, ou fachada que carrega no clique |
| mapa | imagem estática com link para o mapa; o mapa interativo carrega no clique |
| demonstração de código (sandbox) | fachada com a capa e o botão "Abrir demonstração" |
| formulário de terceiro | prefira o formulário do projeto; se for inevitável, carregue quando entrar na tela |
| apresentação e PDF | link com o tipo e o tamanho; visualizador só no clique |

Todo `iframe` tem `title`, proporção reservada e carga tardia.

## Galeria

Grade de miniaturas com proporção igual; clique abre a imagem ampliada
com navegação por setas e Escape. No celular, carrossel com `scroll-snap`.
Cada imagem com o seu texto alternativo.

## Capa do artigo

- Proporção fixa em todo o blog (16:9 ou 3:2).
- Dimensões declaradas e prioridade alta de carga: é a maior pintura da
  página do artigo.
- `alt` vazio quando só ilustra o título; descritivo quando informa.
- Sem capa, o artigo não mostra caixa vazia.

## Movimento

Imagem aparece com opacidade ao carregar. A capa entra com escala leve.
A fachada do vídeo responde ao hover com o botão crescendo 5%. A imagem
ampliável abre com transição de elemento compartilhado. Nada toca nem
troca sozinho dentro do corpo do artigo.
