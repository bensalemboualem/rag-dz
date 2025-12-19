import React from "react";

// Import all sub-components
import { Navbar } from "../components/Navbar";
import { HeroPME } from "../components/HeroPME";
import { PainPointsPME } from "../components/PainPointsPME";
import { PMESolutionSection } from "../components/PMESolutionSection";
import { PMEModulesIncluded } from "../components/PMEModulesIncluded";
import { PMEDemoSection } from "../components/PMEDemoSection";
import { PMEUseCasesSection } from "../components/PMEUseCasesSection";
import { PMEBeforeAfterSection } from "../components/PMEBeforeAfterSection";
import { PMEPricingSection } from "../components/PMEPricingSection";
import { PMEFAQSection } from "../components/PMEFAQSection";
import { PMEFinalCTASection } from "../components/PMEFinalCTASection";
import { SiteFooter } from "../components/SiteFooter";

/**
 * PMEDZSalesPage - Main Sales Landing Page for Pack PME DZ
 * 
 * Target: PME, freelances, commerçants, cabinets in Algeria
 * Goal: Convert visitors to PRO subscribers
 * SEO: "assistant PME Algérie", "IA entreprise Algérie", "gestion PME IA"
 * 
 * Route: /pme or /pack-pme-dz
 */
/**
 * DESIGN SYSTEM COLORS (IAFactory 2025):
 * - Background Dark: bg-background = #020617
 * - Muted: bg-muted = #1e293b
 * - Primary Green: text-primary = #00a651
 * - Text: text-foreground = #f8fafc
 */
const PMEDZSalesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* NAVBAR - Fixed navigation */}
      <Navbar />

      {/* HERO SECTION - Main value proposition */}
      <HeroPME />

      {/* PAIN POINTS - Problems we solve */}
      <section id="painpoints" className="py-20 bg-gradient-to-b from-background to-muted">
        <PainPointsPME />
      </section>

      {/* SOLUTION - Pack PME DZ overview */}
      <section id="solution" className="py-20 bg-muted">
        <PMESolutionSection />
      </section>

      {/* MODULES INCLUDED - Detailed features */}
      <section id="modules" className="py-20 bg-background">
        <PMEModulesIncluded />
      </section>

      {/* DEMO INTERACTIVE - Try the assistant */}
      <section id="demo" className="py-20 bg-muted">
        <PMEDemoSection />
      </section>

      {/* USE CASES - Real PME examples */}
      <section id="usecases" className="py-20 bg-background">
        <PMEUseCasesSection />
      </section>

      {/* BEFORE / AFTER - Transformation */}
      <section id="comparison" className="py-20 bg-muted">
        <PMEBeforeAfterSection />
      </section>

      {/* PRICING - Plans & tarification */}
      <section id="pricing" className="py-20 bg-background">
        <PMEPricingSection />
      </section>

      {/* FAQ - Questions fréquentes */}
      <section id="faq" className="py-20 bg-muted">
        <PMEFAQSection />
      </section>

      {/* FINAL CTA - Last conversion push */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
        <PMEFinalCTASection />
      </section>

      {/* FOOTER - Global site footer */}
      <SiteFooter />
    </div>
  );
};

export default PMEDZSalesPage;

// SEO Metadata (for Next.js App Router)
export const metadata = {
  title: "Pack PME DZ – Assistant IA fiscal & juridique pour PME en Algérie",
  description: "Le Pack PME DZ d'iaFactory Algeria aide les petites entreprises à gérer fiscalité, juridique, administratif et documents grâce à l'IA, avec un RAG optimisé pour l'Algérie.",
  keywords: "assistant PME Algérie, IA entreprise Algérie, gestion PME IA, fiscalité Algérie, CNRC, DGI, CNAS, CASNOS",
  openGraph: {
    title: "Pack PME DZ – CoPilot IA pour PME en Algérie 🇩🇿",
    description: "Fiscalité, juridique, documents, démarches administratives — tout en un seul assistant IA.",
    url: "https://www.iafactoryalgeria.com/pme/",
    siteName: "iaFactory Algeria",
    locale: "fr_DZ",
    type: "website",
  },
};
