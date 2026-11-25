/**
 * Modelo: página de site composta com itens do registro do Designfy (React).
 *
 * O conteúdo chega por propriedades (do servidor, de um arquivo de dado ou
 * de um CMS). Este arquivo só monta as seções na ordem do argumento.
 * Ajuste os caminhos ao alias do projeto.
 */
import { SiteHeader } from "@/components/designfy/site-header/site-header";
import { SiteFooter } from "@/components/designfy/site-footer/site-footer";
import { Background } from "@/components/designfy/background/background";
import { Section } from "@/components/designfy/section/section";
import { HeroSplit } from "@/components/designfy/hero-split/hero-split";
import { BentoGrid } from "@/components/designfy/bento-grid/bento-grid";
import { Steps } from "@/components/designfy/steps/steps";
import { PricingTable } from "@/components/designfy/pricing-table/pricing-table";
import { Faq } from "@/components/designfy/faq/faq";
import { CtaBand } from "@/components/designfy/cta-band/cta-band";
import type { ProductPage, SiteData } from "@/data/types";

export function ProductLandingPage({ page, site }: { page: ProductPage; site: SiteData }) {
  const action = { label: page.action.label, href: page.action.href };
  return (
    <>
      <SiteHeader brand={site.brand} links={site.links} action={action} />

      <main id="conteudo">
        <HeroSplit
          name={site.brand.name}
          headline={page.hero.headline}
          lead={page.hero.lead}
          primaryAction={action}
          secondaryAction={page.hero.secondary}
          background={<Background preset="signal-grid" fade="radial" />}
          visual={
            <img
              src={page.hero.image.src}
              alt={page.hero.image.alt}
              width={page.hero.image.width}
              height={page.hero.image.height}
              fetchPriority="high"
            />
          }
        />

        <Section id="recursos" title={page.features.title} lead={page.features.lead}>
          <BentoGrid items={page.features.items} />
        </Section>

        <Section id="como-funciona" title={page.steps.title} tone="muted">
          <Steps items={page.steps.items} />
        </Section>

        {page.plans.length > 0 ? (
          <Section id="precos" title={page.pricing.title} lead={page.pricing.lead} align="center">
            <PricingTable plans={page.plans} />
          </Section>
        ) : null}

        <Section id="perguntas" title={page.faq.title} tone="muted" width="narrow">
          <Faq items={page.faq.items} />
        </Section>

        <CtaBand
          title={page.cta.title}
          lead={page.cta.lead}
          action={action}
          background={<Background preset="studio-soft-blueprint" fade="edges" />}
        />
      </main>

      <SiteFooter brand={site.brand} columns={site.footer.columns} legal={site.footer.legal} />
    </>
  );
}
