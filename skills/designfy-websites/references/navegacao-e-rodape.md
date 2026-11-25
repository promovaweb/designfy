# Navegação e rodapé

## Cabeçalho

`site-header`. Uma linha, 56 a 72 px de altura.

| Parte | Regra |
| --- | --- |
| marca | à esquerda, link para a home, com nome acessível |
| links principais | até sete, no corpo do texto, sem caixa alta, um peso só |
| ação principal | botão à direita, mais discreto que o do hero |
| utilitários | tema, idioma, entrar: à direita, antes da ação |
| botão de menu | aparece quando os links não cabem |

- Página atual marcada com `aria-current="page"` e uma diferença visual
  além da cor (peso ou sublinhado).
- Fixo no topo com `position: sticky`; fundo e borda aparecem depois que a
  página rola alguns pixels.
- Nenhum link do menu quebra linha em nenhuma largura.
- Landing page de venda: só a marca e a ação, sem os links.
- Site com muitas áreas: `mega-menu` com grupos e descrição curta, que
  abre no clique e no Enter, não só no hover.

Primeiro elemento focável da página: link "Pular para o conteúdo", visível
no foco, apontando para o `main`.

## Menu do celular

`mobile-nav`, abaixo de 1024 px (ou quando os links deixam de caber).

- Gaveta ou painel de tela inteira, com os links em 48 px de altura.
- A ação principal continua visível no cabeçalho, fora da gaveta, até
  390 px.
- Foco preso dentro do painel, Escape fecha, o foco volta ao botão, a
  página atrás fica inerte.
- Grupos do mega-menu viram sanfonas.
- Entrada do painel em 250 ms; links em sequência curta.

## Trilha

`breadcrumbs` em página com dois níveis ou mais de profundidade. Lista
ordenada dentro de `nav` com rótulo; página atual com `aria-current`. No
celular, mostra o nível pai e recolhe o resto.

## Rodapé

`site-footer`. Fecha a página com as rotas secundárias e a identificação.

| Parte | Conteúdo |
| --- | --- |
| identidade | marca e uma linha do que a empresa faz |
| colunas de links | produto, recursos, empresa, legal: só as que têm destino real |
| contato | canais reais, com horário quando importa |
| redes | só as que a empresa mantém ativas, com nome acessível |
| linha legal | razão social, CNPJ quando aplicável, links de termos e privacidade |

- Quatro colunas de links, redes e direitos autorais, sempre iguais, é o
  rodapé que todo gerador faz. Monte com o que o projeto tem: duas colunas
  bastam para um site pequeno; uma frase grande pode fechar uma marca
  forte.
- No tablet, duas colunas; no celular, lista única ou sanfonas.
- Contraste dos links medido sobre o fundo do rodapé.
- Link para página que não existe não entra.

## Âncoras

Seções com `id` estável e curto. O tema reserva a altura do cabeçalho fixo
(`scroll-padding-top`). Âncora nunca aponta para seção que pode não
renderizar.

## Navegação dentro da página

Página longa de produto ou documentação pode ter uma segunda barra com as
seções, fixa abaixo do cabeçalho (`top: var(--header-height)`), com a
seção atual marcada. No celular, rola na horizontal dentro da própria
caixa.

## Faixa de aviso

`announcement-bar`: uma mensagem datada, com link. Uma por vez. Some
quando a data passa. Não é região viva para leitor de tela.

## Movimento

- Cabeçalho: transição de fundo, borda e sombra em 250 ms ao rolar.
- Links: sublinhado que cresce (`df-underline`).
- Menu: painel e links em sequência; saída mais rápida.
- Rodapé: revela com a última seção.
