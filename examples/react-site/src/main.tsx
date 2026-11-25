/** React fixture for the public site registry. All sample sections mount on one page. */
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AnnouncementBar } from "@/components/designfy/announcement-bar/announcement-bar";
import { Background } from "@/components/designfy/background/background";
import { BentoGrid } from "@/components/designfy/bento-grid/bento-grid";
import { Card } from "@/components/designfy/card/card";
import { ComparisonTable } from "@/components/designfy/comparison-table/comparison-table";
import { Counter } from "@/components/designfy/counter/counter";
import { CtaBand } from "@/components/designfy/cta-band/cta-band";
import { Faq } from "@/components/designfy/faq/faq";
import { FeatureGrid } from "@/components/designfy/feature-grid/feature-grid";
import { FeatureSplit } from "@/components/designfy/feature-split/feature-split";
import { HeroCentered } from "@/components/designfy/hero-centered/hero-centered";
import { HeroMedia } from "@/components/designfy/hero-media/hero-media";
import { initDesignfyMotion } from "@/components/designfy/lib/designfy-motion";
import { LogoMarquee } from "@/components/designfy/logo-marquee/logo-marquee";
import { Marquee } from "@/components/designfy/marquee/marquee";
import { NewsletterForm } from "@/components/designfy/newsletter-form/newsletter-form";
import { PricingTable } from "@/components/designfy/pricing-table/pricing-table";
import { SiteFooter } from "@/components/designfy/site-footer/site-footer";
import { SiteHeader } from "@/components/designfy/site-header/site-header";
import { StatsBand } from "@/components/designfy/stats-band/stats-band";
import { Steps } from "@/components/designfy/steps/steps";
import { Testimonial } from "@/components/designfy/testimonial/testimonial";
import { ThemeToggle } from "@/components/designfy/theme-toggle/theme-toggle";
import {
  comparison,
  features,
  images,
  logoNames,
  metrics,
  plans,
  questions,
  quotes,
  signup,
  steps,
  tiles,
} from "../../astro-site/src/sample";
import "./styles/site.css";

const brand = { label: "Fieldnote", href: "#" };
const routes = [
  { label: "Overview", href: "#main", current: true },
  { label: "Preview", href: "#preview" },
  { label: "Pricing", href: "#pricing" },
];
const preview = { label: "Get preview", href: "#preview" };
const pricing = { label: "See sample plans", href: "#pricing" };
const examplePlans = plans.map((plan) => ({ ...plan, action: preview }));

/** Exercises the same registry sections used on the Astro sample. */
function Sample() {
  useEffect(() => initDesignfyMotion(), []);
  return (
    <>
      <AnnouncementBar
        message="Fieldnote is a fictional research workspace."
        action={preview}
        dismissLabel="Dismiss announcement"
      />
      <SiteHeader
        brand={brand}
        links={routes}
        primaryAction={preview}
        utilities={<ThemeToggle />}
        mobileUtilities={
          <ThemeToggle className="[&_details]:w-fit [&_[role=group]]:start-0" />
        }
      />
      <main id="main" tabIndex={-1}>
        <HeroCentered
          headline="Follow a finding back to the source."
          lead="Open the fictional Fieldnote workspace and see how research notes turn into a team brief."
          primaryAction={preview}
          secondaryAction={pricing}
          background={
            <Background
              preset="signal-grid"
              fade="bottom"
              className="absolute inset-0 opacity-65"
            />
          }
        />
        <LogoMarquee
          label="Teams in this fictional example"
          items={logoNames}
        />
        <BentoGrid
          title="Keep the evidence close"
          lead="Each part of the workspace keeps a link back to the research."
          items={tiles}
        />
        <FeatureSplit
          title="Bring each observation back to the session"
          lead="Group notes by what you observed. When someone asks for context, open the session from the note."
          images={[images.notes]}
          points={[
            "Capture the detail while it’s fresh",
            "Keep the original wording nearby",
          ]}
        />
        <Steps title="From session to brief" items={steps} variant="vertical" />
        <StatsBand title="Inside the sample workspace" items={metrics} />
        <Testimonial
          title="A sample account of a research review"
          items={quotes}
        />
        <HeroMedia
          headline="Room for the way you work."
          headingLevel={2}
          lead="Compare the sample workspace sizes and collaboration options."
          primaryAction={pricing}
          image={images.tags}
          variant="panel"
        />
        <div id="pricing">
          <PricingTable
            id="react-plans"
            title="Choose a sample plan"
            plans={examplePlans}
          />
        </div>
        <ComparisonTable
          title="What comes with each plan"
          options={plans.map((plan) => plan.name)}
          groups={comparison}
        />
        <Faq
          title="Questions about the sample"
          items={questions}
          variant="split"
        />
        <FeatureGrid
          title="What you can do in the workspace"
          items={features}
          variant="dividers"
        />
        <div id="preview">
          <CtaBand
            title="Try the sample form"
            lead="Use a sample address to see how the preview form validates."
            form={<NewsletterForm {...signup} />}
          />
        </div>
        <div
          data-df-stagger
          className="df-container grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2"
        >
          <Card
            title="Compare sample plans"
            description="See the workspace limits and sharing options side by side."
            href="#pricing"
            reveal
          />
          <Card
            title="Sample notes"
            description="Number of notes in this fictional study."
            reveal
          >
            <Counter
              value={12}
              className="text-title font-semibold text-primary"
            />
          </Card>
        </div>
        <div className="df-container pb-12">
          <Marquee
            items={[
              "Research notes",
              "Session tags",
              "Findings",
              "Team briefs",
            ]}
            direction="opposed"
            pauseLabel="Pause topics"
            resumeLabel="Resume topics"
            className="text-muted-foreground"
          />
        </div>
      </main>
      <SiteFooter
        brand={brand}
        description="A sample workspace for keeping research and decisions together."
        groups={[{ title: "Explore", links: routes }]}
        legal="Fieldnote is a fictional Designfy example."
        variant="statement"
      />
    </>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<Sample />);
