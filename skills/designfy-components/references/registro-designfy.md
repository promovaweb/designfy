# Registro do Designfy

O registro guarda as composições do Designfy em duas versões, React e
Astro, no formato do shadcn. Ele vai embutido no binário.

```bash
designfy components list                       # framework do projeto
designfy components list --framework react --surface webapp
designfy components list --category hero
designfy components show hero-split --source
```

## Famílias

| Família | Itens | Superfície |
| --- | --- | --- |
| base | `designfy-theme`, `designfy-motion`, `cn`, `background-styles` | as duas |
| movimento | `reveal`, `counter`, `marquee`, `background`, `pixel-stage` | as duas |
| estrutura | `section`, `card`, `theme-toggle` | as duas |
| navegação de site | `site-header`, `site-footer`, `announcement-bar` | site |
| hero | `hero-split`, `hero-centered`, `hero-media`, `hero-pixel` | site |
| seções | `feature-grid`, `bento-grid`, `feature-split`, `steps`, `stats-band`, `logo-marquee`, `testimonial`, `pricing-table`, `comparison-table`, `faq`, `cta-band`, `newsletter-form`, `feature-rows`, `milestone-timeline`, `profile-split` | site |
| oferta | `offer-card`, `audience-fit`, `numbered-checklist`, `outcome-grid`, `detail-card`, `statement-stats` | site |
| conteúdo | `article-header`, `prose`, `table-of-contents`, `reading-progress`, `post-card`, `post-list`, `author-box`, `callout`, `code-block`, `figure`, `video-embed` | site |
| web app | `app-shell`, `page-header`, `stat-card`, `chart-card`, `data-table`, `filter-bar`, `description-list`, `activity-feed`, `form-layout`, `stepper`, `file-upload`, `settings-layout`, `settings-section`, `auth-card` | webapp |
| estados | `empty-state`, `error-state` | as duas |

A lista do binário vale mais que esta tabela: itens entram a cada versão.

## Itens tirados de páginas reais

Os itens da família oferta, o `pixel-stage`, o `hero-pixel`, o
`feature-rows`, o `milestone-timeline` e o `profile-split` saíram do estudo
da landing Founders, descrito na skill `designfy-websites`, em
`references/estudos/landing-de-oferta-founders.md`. Leia o estudo para ver
cada peça no lugar dela, na ordem do argumento da página.

| Item | Para que serve |
| --- | --- |
| `pixel-stage` | palco escuro com mosaico de pixels em canvas, mais denso de um lado, com véu atrás do texto, pausa por teclado e versão parada |
| `hero-pixel` | hero sobre o `pixel-stage`, com título em duas cores, apoio, duas ações e uma coluna lateral opcional |
| `feature-rows` | linhas numeradas para informação comparável; a variante `split` mantém título e ação fixos ao lado |
| `milestone-timeline` | etapas ou datas ligadas por um fio que se desenha, com o passo atual anunciado e colunas alinhadas por `subgrid` |
| `profile-split` | quem conduz: retrato, adesivos com fatos da bio, texto, ação e redes |
| `offer-card` | prazo com contagem regressiva que funciona sem JavaScript e encerra sozinha, vagas em destaque e ação principal |
| `audience-fit` | para quem é e para quem não é, em dois cartões de altura igual |
| `numbered-checklist` | o que está incluído, numerado, em uma ou duas colunas, com itens de bônus em destaque |
| `outcome-grid` | resultados possíveis em ladrilhos com ícone, de duas a cinco colunas |
| `detail-card` | cartão com ícone, rótulo, texto, lista e nota de limite; `DetailCardGrid` monta o conjunto com um cartão alto |
| `statement-stats` | frase grande em duas cores ao lado de números curtos com explicação |

Variantes acrescentadas a itens que já existiam: `faq` com `stickyIntro`
(título fixo na variante `split`), `cta-band` com `secondaryAction`,
`testimonial` com `carouselLayout="responsive"` (um, dois ou três cartões),
`pricing-table` com a variante `single` (plano único) e `marquee` com a
variante `accent` (faixa na cor de acento com losangos).

## Como os itens se encaixam

Página de site em Astro:

```astro
---
import Section from "@/components/designfy/section/Section.astro";
import HeroSplit from "@/components/designfy/hero-split/HeroSplit.astro";
import Background from "@/components/designfy/background/Background.astro";
import FeatureGrid from "@/components/designfy/feature-grid/FeatureGrid.astro";
---

<HeroSplit
  name={produto.nome}
  headline={pagina.titulo}
  lead={pagina.resumo}
  primaryAction={{ label: "Ver turmas abertas", href: "#turmas" }}
>
  <Background slot="background" preset="signal-grid" fade="radial" />
  <img slot="visual" src={foto.src} alt="" width={foto.width} height={foto.height} />
</HeroSplit>

<Section id="recursos" title={pagina.recursos.titulo} lead={pagina.recursos.resumo}>
  <FeatureGrid items={pagina.recursos.itens} />
</Section>
```

Tela de sistema em React:

```tsx
import { AppShell } from "@/components/designfy/app-shell/app-shell";
import { PageHeader } from "@/components/designfy/page-header/page-header";
import { StatCard } from "@/components/designfy/stat-card/stat-card";

export function SalesDashboard({ summary }: { summary: SalesSummary }) {
  return (
    <AppShell navigation={navigation} user={user}>
      <PageHeader title="Vendas" description="Hoje, até agora." actions={<PeriodSwitch />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.stats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>
    </AppShell>
  );
}
```

Regras de composição:

- `Section` envolve cada bloco de página de site e cuida de largura, ritmo
  e título. O componente de dentro não repete container nem título.
- O conteúdo entra por propriedades e slots. Os nomes das propriedades são
  iguais nas versões React e Astro.
- O fundo com padrão entra pelo slot ou pela propriedade `background` de
  quem aceita (hero, seção, chamada final).
- `reveal` e `data-df-reveal` cuidam da entrada; não acrescente outra
  animação de entrada por cima.
- Itens de sistema esperam os primitivos do shadcn instalados; a saída de
  `components add` lista quais.

## O que cada item garante

Todo item do registro:

- usa só papéis do tema (`registry:check` recusa cor ou fonte literal);
- aponta para uma entrada do catálogo de interface (`meta.catalog`);
- documenta no cabeçalho do arquivo o propósito, as propriedades, os slots
  e o movimento;
- funciona de 320 a 1920 px sem rolagem horizontal;
- tem foco visível e HTML semântico;
- traz o movimento e a versão parada.

## Adaptar um item copiado

O arquivo copiado é do projeto. Mudanças boas:

- acrescentar uma propriedade ou variação que o projeto precisa;
- trocar a marcação de um slot;
- ligar a um dado do projeto.

Mudanças que quebram o sistema e não devem ser feitas:

- cor, fonte ou raio literal;
- remover estado, foco ou a versão parada do movimento;
- texto fixo dentro do componente.

Registre a adaptação em `## Componentes` do guia, para a próxima sessão
saber que o arquivo difere do registro.

## Contribuir de volta

Componente próprio que serve a outros projetos pode entrar no registro. As
regras estão em `registry/CONVENTIONS.md` do repositório do Designfy; o
resumo está em [componentizacao.md](componentizacao.md).
