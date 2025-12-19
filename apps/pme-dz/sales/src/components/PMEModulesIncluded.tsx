import React from "react";

const modules = [
  {
    icon: "💰",
    title: "Assistant Fiscal Algérie",
    gradient: "from-green-500 to-emerald-500",
    iconBg: "bg-green-500/10",
    checkColor: "text-green-500",
    link: "/fiscal/",
    linkColor: "text-green-500 hover:text-green-400",
    features: [
      "Estimations IFU / IRG / TVA / IBS",
      "Explication des régimes fiscaux (forfaitaire, réel)",
      "Simulations de charges sociales CASNOS",
      "Barèmes IRG mis à jour automatiquement",
    ],
  },
  {
    icon: "⚖️",
    title: "Assistant Juridique DZ",
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-500/10",
    checkColor: "text-blue-500",
    link: "/legal/",
    linkColor: "text-blue-500 hover:text-blue-400",
    features: [
      "Procédures CNRC (création, modification)",
      "Obligations CNAS / CASNOS expliquées",
      "Contrats de base (travail, prestation, bail)",
      "Réglementation commerciale algérienne",
    ],
  },
  {
    icon: "📚",
    title: "RAG-DZ Professionnel",
    gradient: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-500/10",
    checkColor: "text-purple-500",
    link: "/rag/",
    linkColor: "text-purple-500 hover:text-purple-400",
    features: [
      "Données DZ indexées (JORADP, DGI, CNRC...)",
      "Citations de textes officiels avec sources",
      "Mises à jour automatisées quotidiennes",
      "Recherche sémantique intelligente",
    ],
  },
  {
    icon: "📁",
    title: "CRM PME DZ",
    gradient: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-500/10",
    checkColor: "text-pink-500",
    link: "/crm/",
    linkColor: "text-pink-500 hover:text-pink-400",
    features: [
      "Dossiers clients organisés par affaire",
      "Notes IA générées automatiquement",
      "Fichiers joints (factures, contrats, docs)",
      "Historique et suivi des échanges",
    ],
  },
  {
    icon: "📄",
    title: "Documents IA",
    gradient: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-500/10",
    checkColor: "text-orange-500",
    link: "/startupdz/",
    linkColor: "text-orange-500 hover:text-orange-400",
    features: [
      "Statuts simplifiés (EURL, SARL, SPA)",
      "Lettres à la DGI / CNAS / CASNOS",
      "Courriers banques et fournisseurs",
      "Export PDF professionnel",
    ],
  },
  {
    icon: "✅",
    title: "Checklist Mensuelle",
    gradient: "from-cyan-500 to-teal-500",
    iconBg: "bg-cyan-500/10",
    checkColor: "text-cyan-500",
    link: "/cockpit/",
    linkColor: "text-cyan-500 hover:text-cyan-400",
    features: [
      "Rappels déclarations fiscales (G50, G50A)",
      "Échéances CASNOS / CNAS automatiques",
      "Tâches administratives planifiées",
      "Notifications par email ou SMS",
    ],
  },
];

export const PMEModulesIncluded: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-500 text-sm font-medium mb-4">
          🎛️ Modules inclus
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ce que contient{" "}
          <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            concrètement
          </span>{" "}
          le Pack PME DZ
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Chaque module est conçu pour répondre à un besoin spécifique des PME algériennes.
        </p>
      </div>

      {/* Detailed Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => (
          <div
            key={index}
            className="bg-muted rounded-2xl border border-border overflow-hidden hover:border-opacity-50 transition-all duration-300 group"
          >
            {/* Top colored bar */}
            <div className={`h-2 bg-gradient-to-r ${module.gradient}`} />
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 ${module.iconBg} rounded-xl flex items-center justify-center text-2xl`}
                >
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold">{module.title}</h3>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-4">
                {module.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-sm">
                    <span className={`${module.checkColor} mt-0.5`}>✓</span>
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Link */}
              <a
                href={module.link}
                className={`inline-flex items-center gap-2 ${module.linkColor} font-semibold text-sm transition`}
              >
                Découvrir →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* CTA after modules */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold mb-3">Tout ça dans un seul abonnement 🚀</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Accédez à tous les modules du Pack PME DZ pour un prix adapté aux petites entreprises
            algériennes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#pricing"
              className="px-8 py-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white rounded-xl font-bold hover:opacity-90 transition"
            >
              Voir les tarifs
            </a>
            <a
              href="#demo"
              className="px-8 py-4 bg-background border-2 border-border text-white rounded-xl font-bold hover:border-primary transition"
            >
              Essayer la démo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
