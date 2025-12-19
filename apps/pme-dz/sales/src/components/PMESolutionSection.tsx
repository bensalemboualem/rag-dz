import React from "react";

const pillars = [
  {
    icon: "💰",
    title: "Assistant Fiscal DZ",
    description:
      "Comprenez vos impôts (IFU, IRG, TVA, TAP, CASNOS, CNAS) avec des explications claires et des estimations automatiques.",
    gradient: "from-green-500 to-emerald-600",
    hoverBorder: "hover:border-green-500",
    hoverShadow: "hover:shadow-green-500/10",
  },
  {
    icon: "⚖️",
    title: "Assistant Juridique & Admin",
    description:
      "Procédures CNRC, DGI, CNAS, CASNOS, contrats simples, obligations légales. Tout expliqué clairement.",
    gradient: "from-blue-500 to-indigo-600",
    hoverBorder: "hover:border-blue-500",
    hoverShadow: "hover:shadow-blue-500/10",
  },
  {
    icon: "📚",
    title: "RAG-DZ (données locales)",
    description:
      "Journal Officiel, DGI, CNRC, CNAS, ONS et plus — un moteur de recherche IA optimisé pour l'Algérie.",
    gradient: "from-purple-500 to-violet-600",
    hoverBorder: "hover:border-purple-500",
    hoverShadow: "hover:shadow-purple-500/10",
  },
  {
    icon: "📄",
    title: "Documents IA",
    description:
      "Générez des statuts simplifiés, lettres types, courriers administratifs, modèles de contrats adaptés DZ.",
    gradient: "from-orange-500 to-amber-600",
    hoverBorder: "hover:border-orange-500",
    hoverShadow: "hover:shadow-orange-500/10",
  },
  {
    icon: "📁",
    title: "CRM-DZ PME",
    description:
      "Gérez vos dossiers clients, ajoutez des notes IA automatiques, attachez des fichiers et suivez vos affaires.",
    gradient: "from-pink-500 to-rose-600",
    hoverBorder: "hover:border-pink-500",
    hoverShadow: "hover:shadow-pink-500/10",
  },
  {
    icon: "✅",
    title: "Checklist & Rappels",
    description:
      "Liste automatique des tâches à faire : déclarations mensuelles, paiements, démarches administratives.",
    gradient: "from-cyan-500 to-teal-600",
    hoverBorder: "hover:border-cyan-500",
    hoverShadow: "hover:shadow-cyan-500/10",
  },
];

export const PMESolutionSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
          ✅ La Solution
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Pack PME DZ — Votre{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
            assistant IA complet
          </span>
          <br />
          pour gérer votre entreprise
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Une seule plateforme pour vous aider sur la fiscalite, le juridique, l'administratif et les
          documents.{" "}
          <strong className="text-foreground">Gagnez du temps et evitez les erreurs.</strong>
        </p>
      </div>

      {/* Solution Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => (
          <div
            key={index}
            className={`group bg-background rounded-2xl p-6 border border-border ${pillar.hoverBorder} transition-all duration-300 hover:shadow-lg ${pillar.hoverShadow} hover:-translate-y-2`}
          >
            <div
              className={`w-14 h-14 bg-gradient-to-br ${pillar.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
            >
              {pillar.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
          </div>
        ))}
      </div>

      {/* CTA after pillars */}
      <div className="text-center mt-12">
        <a
          href="#modules"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition font-semibold"
        >
          Voir le détail de chaque module
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </div>
  );
};
