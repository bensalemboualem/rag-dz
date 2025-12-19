import React from "react";

const useCases = [
  {
    icon: "🛍️",
    type: "Commerce",
    city: "Alger",
    title: "Boutique de vêtements",
    description: "Utilise le Pack PME DZ pour :",
    features: [
      "Comprendre ses obligations TVA (19%)",
      "Préparer ses déclarations mensuelles G50",
      "Générer modèles de factures conformes",
      "Courriers CNAS automatiques",
    ],
    timeSaved: "~8 heures/mois économisées",
    gradient: "from-green-500/20 to-emerald-600/20",
    iconBg: "bg-green-500/20",
    tagBg: "bg-green-500/10",
    tagColor: "text-green-400",
    checkColor: "text-green-500",
    timeColor: "text-green-400",
    hoverBorder: "hover:border-green-500/50",
  },
  {
    icon: "💻",
    type: "Freelance",
    city: "Oran",
    title: "Développeur freelance",
    description: "Utilise l'assistant fiscal pour :",
    features: [
      "Estimer ses impôts (régime forfaitaire IFU)",
      "Comprendre cotisations CASNOS",
      "Organiser ses factures clients",
      "Suivi clients via CRM-DZ",
    ],
    timeSaved: "~6 heures/mois économisées",
    gradient: "from-blue-500/20 to-indigo-600/20",
    iconBg: "bg-blue-500/20",
    tagBg: "bg-blue-500/10",
    tagColor: "text-blue-400",
    checkColor: "text-blue-500",
    timeColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/50",
  },
  {
    icon: "🚚",
    type: "Import",
    city: "Constantine",
    title: "Import matériel informatique",
    description: "Utilise l'IA pour :",
    features: [
      "Comprendre procédures douanières",
      "Générer documents d'import",
      "Calculer droits de douane estimés",
      "Suivi tâches administratives",
    ],
    timeSaved: "~12 heures/mois économisées",
    gradient: "from-purple-500/20 to-violet-600/20",
    iconBg: "bg-purple-500/20",
    tagBg: "bg-purple-500/10",
    tagColor: "text-purple-400",
    checkColor: "text-purple-500",
    timeColor: "text-purple-400",
    hoverBorder: "hover:border-purple-500/50",
  },
];

export const PMEUseCasesSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium mb-4">
          📋 Cas d'usage réels
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Comment les PME utilisent{" "}
          <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            déjà l'IA
          </span>{" "}
          en Algérie
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Des entrepreneurs comme vous gagnent du temps chaque jour grâce au Pack PME DZ.
        </p>
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {useCases.map((useCase, index) => (
          <div
            key={index}
            className={`bg-muted rounded-2xl border border-border overflow-hidden ${useCase.hoverBorder} transition-all duration-300 group`}
          >
            {/* Icon Header */}
            <div
              className={`h-32 bg-gradient-to-br ${useCase.gradient} flex items-center justify-center`}
            >
              <div
                className={`w-20 h-20 ${useCase.iconBg} rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform`}
              >
                {useCase.icon}
              </div>
            </div>

            <div className="p-6">
              {/* Tags */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 ${useCase.tagBg} ${useCase.tagColor} text-xs rounded-full`}
                >
                  {useCase.type}
                </span>
                <span className="text-gray-500 text-xs">{useCase.city}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{useCase.description}</p>

              {/* Features */}
              <ul className="space-y-2 text-sm text-gray-400 mb-6">
                {useCase.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    <span className={useCase.checkColor}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Time Saved */}
              <div className="pt-4 border-t border-gray-700">
                <div className={`flex items-center gap-2 ${useCase.timeColor}`}>
                  <span className="text-lg">⏱️</span>
                  <span className="font-semibold">{useCase.timeSaved}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA after use cases */}
      <div className="text-center mt-12">
        <p className="text-gray-400 mb-4">Vous vous reconnaissez dans l'un de ces profils ?</p>
        <a
          href="/cockpit/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-white rounded-xl font-bold hover:opacity-90 transition"
        >
          <span>🚀</span>
          Essayer le Pack PME DZ gratuitement
        </a>
      </div>
    </div>
  );
};
