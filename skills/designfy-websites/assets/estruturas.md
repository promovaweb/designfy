# Roteiros de página

Pontos de partida para a seção `## Estrutura` do viewspec. Cada linha traz
a pergunta que a seção responde, o fragmento do catálogo e o fundo. Corte
o que o projeto não tem conteúdo para sustentar.

## Landing page de produto digital

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | O que é e é para mim? | `hero-split` com captura real | padrão com máscara |
| 2 | Quem já usa? | `logo-strip` | superfície, linhas finas |
| 3 | O que eu ganho? | `bento-grid` | superfície |
| 4 | Como é por dentro? | `feature-split`, dois ou três alternados | superfície |
| 5 | Como começo? | `steps` | faixa `muted` |
| 6 | Funciona mesmo? | `testimonial` ou `stats-band` | superfície |
| 7 | Quanto custa? | `pricing-table` | superfície |
| 8 | E se...? | `faq` | faixa `muted` |
| 9 | O que faço agora? | `cta-band` | padrão ou `primary` |

## Landing page de curso ou serviço

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | O que eu aprendo ou recebo? | `hero-split` com foto real | padrão com máscara |
| 2 | É para mim? | `feature-split` com os perfis | superfície |
| 3 | O que acontece em cada etapa? | `steps` vertical | faixa `muted` |
| 4 | Quem ensina ou atende? | `feature-split` com foto e história | superfície |
| 5 | Quem já fez? | `testimonial` | superfície |
| 6 | Quando e quanto? | `pricing-table` com turmas ou planos | superfície |
| 7 | E se...? | `faq` | faixa `muted` |
| 8 | Como entro? | `cta-band` | `primary` |

## Página de captura

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | O que eu recebo? | `hero-centered` com `newsletter-form` | padrão com máscara |
| 2 | O que tem dentro? | `feature-grid` com três ou quatro itens | superfície |
| 3 | Quem fez? | `feature-split` curto | faixa `muted` |
| 4 | Como recebo? | `cta-band` com o mesmo formulário | superfície |

## Home de site ou portal

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | O que encontro aqui? | `hero-split` com quadro de destinos reais | padrão com máscara |
| 2 | Quais são as áreas? | `bento-grid`, cada bloco um destino | superfície |
| 3 | Qual é o principal? | `feature-split` da área mais importante | faixa `muted` |
| 4 | O que há de novo? | três `post-card` | superfície |
| 5 | Quem está por trás? | `stats-band` ou `testimonial` | superfície |
| 6 | Por onde começo? | `cta-band` | padrão |

## Página de ferramenta de código aberto

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | O que faz e como instalo? | `hero-split` com terminal real e o comando de instalação | padrão geométrico |
| 2 | O que resolve? | `feature-split` com saída real | superfície |
| 3 | O que mais faz? | `bento-grid` | superfície |
| 4 | Como uso? | `steps` com `code-block` | faixa `muted` |
| 5 | Com o que funciona? | `logo-strip` de ferramentas compatíveis | superfície |
| 6 | Onde aprendo? | cartões para documentação e guia | superfície |
| 7 | Como participo? | `cta-band` com repositório e comunidade | `primary` |

## Preços

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | Quais são as opções? | título curto e `pricing-table` | superfície |
| 2 | O que muda entre elas? | `comparison-table` | superfície |
| 3 | Como funciona a cobrança? | `faq` | faixa `muted` |
| 4 | E o meu caso? | `cta-band` para falar com a equipe | superfície |

## Sobre

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | Quem são vocês? | `hero-centered` sem ação de venda | superfície |
| 2 | Como chegaram aqui? | `feature-split` com fotos reais | superfície |
| 3 | Quem trabalha aí? | grade de pessoas com foto e função | faixa `muted` |
| 4 | O que já fizeram? | `stats-band` | superfície |
| 5 | Como falo com vocês? | `cta-band` | padrão |

## Contato

| # | Pergunta | Fragmento | Fundo |
| --- | --- | --- | --- |
| 1 | Como falo e quando respondem? | título, frase com o prazo e formulário com `form-field` | superfície |
| 2 | Tem outro canal? | lista de canais com horário | faixa `muted` |
| 3 | Onde ficam? | endereço e mapa | superfície |

## Como registrar no viewspec

```markdown
## Estrutura

1. Cabeçalho: `site-header` (`designfy:site-header`).
2. Hero, "o que é e é para mim?": `hero-split` (`designfy:hero-split`),
   captura do painel à direita, fundo `signal-grid` com máscara radial.
3. Prova rápida, "quem já usa?": `logo-strip` (`designfy:logo-marquee`).
...
```
