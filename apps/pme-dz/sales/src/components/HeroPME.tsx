import React from "react";

/**
 * HeroPME - Hero Section for Pack PME DZ
 * DESIGN SYSTEM COLORS:
 * - bg-background (#020617 dark), bg-muted (#1e293b)
 * - text-foreground (#f8fafc), text-muted-foreground
 * - text-primary (#00a651), border-border
 */
export const HeroPME: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
            Optimise pour l'Algerie
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-500 text-sm font-medium">
            +13 modules IA
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-500 text-sm font-medium">
            Heberge en Europe (GDPR)
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
          Votre{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
            CoPilot IA
          </span>{" "}
          pour gerer
          <br />
          votre{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
            PME en Algerie
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Fiscalite, juridique, documents, demarches administratives — tout en un seul assistant IA.
          <br className="hidden sm:block" />
          <strong className="text-foreground">
            Gagnez du temps. Comprenez vos obligations. Developpez votre business.
          </strong>
        </p>

        {/* Benefits pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border">
            <span className="text-primary text-lg">*</span>
            <span className="text-sm">Economisez du temps sur les demarches</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border">
            <span className="text-blue-500 text-lg">@</span>
            <span className="text-sm">Comprenez vos obligations fiscales</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border">
            <span className="text-purple-500 text-lg">#</span>
            <span className="text-sm">Generez vos documents en 1 clic</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <a
            href="/cockpit/"
            className="group px-8 py-4 bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition shadow-lg shadow-primary/30"
          >
            <span>+</span>
            Essayer gratuitement
            <span className="group-hover:translate-x-1 transition-transform">-></span>
          </a>
          <a
            href="#demo"
            className="px-8 py-4 bg-muted border-2 border-border text-foreground rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:border-primary hover:text-primary transition"
          >
            <span>></span>
            Voir une demo
          </a>
        </div>

        {/* Hero Visual */}
        <div className="relative mx-auto max-w-4xl">
          <div className="bg-muted rounded-2xl border border-border p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Pack PME DZ — Assistant IA</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-xl p-4 border border-border">
                <div className="text-2xl mb-2">@</div>
                <div className="text-sm font-semibold mb-1">Fiscal Assistant</div>
                <div className="text-xs text-muted-foreground">IRG, TVA, IBS calcules</div>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border">
                <div className="text-2xl mb-2">$</div>
                <div className="text-sm font-semibold mb-1">Legal Assistant</div>
                <div className="text-xs text-muted-foreground">Droit algerien explique</div>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border">
                <div className="text-2xl mb-2">#</div>
                <div className="text-sm font-semibold mb-1">CRM-DZ</div>
                <div className="text-xs text-muted-foreground">Gestion clients IA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex justify-center items-center gap-8 mt-12 text-muted-foreground text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">500+</div>
            <div>PME utilisatrices</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">50K+</div>
            <div>Documents DZ</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">98%</div>
            <div>Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};
