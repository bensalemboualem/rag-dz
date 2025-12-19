import React from "react";

export const PMEFinalCTASection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
      {/* Background decorations are handled by parent section */}

      {/* Icon */}
      <div className="w-20 h-20 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg shadow-primary/30">
        🚀
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
        Prêt à simplifier la gestion de
        <br />
        votre{" "}
        <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
          PME avec l'IA
        </span>{" "}
        ?
      </h2>

      {/* Subtitle */}
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
        Créez un compte en quelques secondes et commencez à poser vos questions à l'assistant IA
        spécialisé pour l'Algérie.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <a
          href="/cockpit/"
          className="group px-8 py-4 bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition shadow-lg shadow-primary/30 hover:shadow-primary/50"
        >
          <span>✨</span>
          Créer un compte gratuitement
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
        <a
          href="mailto:contact@iafactoryalgeria.com"
          className="px-8 py-4 bg-muted/50 backdrop-blur border-2 border-border text-foreground rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:border-primary hover:text-primary transition"
        >
          <span>💬</span>
          Parler à un conseiller
        </a>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-6 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <span className="text-primary">+</span>
          <span>Inscription gratuite</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary">+</span>
          <span>Aucune carte requise</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary">+</span>
          <span>100 credits offerts</span>
        </div>
      </div>
    </div>
  );
};
