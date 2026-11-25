# Imagens e mídia

O que a página mostra pesa mais do que o que ela diz. A ordem de
preferência é sempre: o produto de verdade, a fotografia real do projeto,
a tipografia. Ilustração genérica vem por último e quase nunca entra.

## O que mostrar

| A página é sobre | Mostre |
| --- | --- |
| software que existe | capturas reais, num estado que diz algo |
| software que ainda não existe | a interface montada com dados de amostra, marcada no viewspec para virar captura |
| ferramenta de terminal | o terminal com o comando real e a saída real |
| lugar, evento, serviço presencial | fotografia real, do projeto |
| curso, conteúdo | a peça entregue: a aula, a página, o material |
| dado | o gráfico do dado real |
| nada disso | tipografia grande e fundo com padrão |

Evite: desenho em SVG de objeto, planta, pessoa ou cenário para ocupar o
lugar da foto; caixa colorida vazia onde a imagem deveria estar; fileira
de ícones repetidos representando quantidade; banco de imagens com
pessoas sorrindo para a tela.

## Capturas do produto

```bash
designfy capture run http://localhost:5173/app --viewport desktop --fold --name produto-hero
designfy capture run http://localhost:5173/app --selector "[data-demo=painel]" --name produto-painel
```

- Estado com conteúdo: dados que contam algo, nada de tela vazia.
- Sem dado pessoal nem informação sensível.
- Uma moldura só: borda, raio do tema e sombra alta. Não desenhe barra de
  navegador, botões de janela nem moldura de aparelho.
- No tema claro e no escuro, quando o site tem os dois: troque a imagem
  com o tema.
- Recorte para o que importa; uma captura inteira reduzida vira borrão.

## Fotografia

- Do projeto ou encomendada. Foto de banco só com licença conferida e
  crédito na página quando a licença pede.
- Poucas e grandes valem mais que muitas e pequenas.
- Recorte próprio para o celular quando o assunto sai do quadro.
- Tratamento igual em todas: mesma temperatura, mesmo raio de moldura.

## Regras técnicas

| Regra | Como |
| --- | --- |
| dimensões declaradas | `width` e `height` em toda imagem, para a página não pular |
| tamanho por largura | `srcset` e `sizes`; em Astro, `<Image>` e `<Picture>` |
| formato | AVIF ou WebP, com reserva |
| prioridade | a imagem do hero com `loading="eager"` e `fetchpriority="high"`; as demais com carregamento tardio |
| proporção | contêiner com `aspect-ratio` e imagem com `object-cover` |
| peso | visual do hero abaixo de 200 KB quando possível |
| trilha de grade | `minmax(0, 1fr)` na coluna da imagem |
| texto alternativo | descreve o conteúdo; vazio quando o texto ao lado já diz |
| imagem que falha | o contêiner mantém o tamanho e o fundo `muted` |

## Vídeo

- Vídeo hospedado (YouTube, Vimeo): `video-embed` com fachada. A página
  mostra a capa e o botão; o player só carrega no clique. Título
  obrigatório, proporção fixa, domínio sem rastreio quando existe.
- Vídeo de fundo: mudo, em laço, com `playsinline`, `poster` e pausa;
  curto e comprimido; só o `poster` no celular e com economia de dados.
- Vídeo com fala: legendas. Transcrição quando o conteúdo importa.
- Nada toca com som sem a pessoa pedir.

## Ícones

Uma biblioteca só (Lucide por padrão), no mesmo traço. Ícone acompanha
texto; sozinho, só com nome acessível. Emoji não é ícone.

## Gráficos e diagramas

Geometria que é geometria vale: um diagrama do sistema real, um gráfico do
dado real, uma linha que desenha o fluxo. Construa com os papéis do tema
(`chart-1` a `chart-5`, `border`, `foreground`), dê um nome acessível e um
resumo em texto.

## Logos de terceiros

Use o arquivo oficial, na versão de uma cor quando a marca permite, sem
distorcer. Só com autorização ou dentro do uso que a marca libera. A
linha de logos tem a quantidade dividida por igual (seis em três e três,
nunca cinco e um).

## Marca do projeto

Logo, paleta e tipografia vêm de `brand/` do projeto ou do manual. Para
criar ou revisar a marca, o trabalho é do
[Brandfy](https://github.com/promovaweb/brandfy).

## Imagem de compartilhamento

Cada página pública tem título, descrição e imagem de compartilhamento
próprios. O desenho dessa imagem segue o tema; a geração é do projeto.

## Conferir

- [ ] Toda imagem é real e do projeto, ou a lacuna está no viewspec.
- [ ] Nenhuma moldura de navegador ou de aparelho desenhada à mão.
- [ ] Dimensões declaradas; nenhuma mudança de layout ao carregar.
- [ ] Imagem do hero com prioridade; as outras com carga tardia.
- [ ] Texto alternativo certo em cada uma.
- [ ] Vídeos com fachada, sem som automático, com pausa.
- [ ] Texto sobre imagem com contraste medido.
