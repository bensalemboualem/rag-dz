import React from "react";

const beforeItems = [
  {
    icon: "⏰",
    title: "10 heures de recherches administratives par mois",
    subtitle: "Temps perdu en démarches et paperasse",
  },
  {
    icon: "🤯",
    title: "Confusion entre CNRC, DGI, CNAS…",
    subtitle: "Administrations et procédures floues",
  },
  {
    icon: "📝",
    title: "Documents introuvables ou incomplets",
    subtitle: "Modèles non adaptés au contexte algérien",
  },
  {
    icon: "💰",
    title: "Mal comprendre les impôts et les régimes",
    subtitle: "IFU, IRG, TVA, CASNOS... incompréhensibles",
  },
  {
    icon: "🚨",
    title: "Oublier des démarches (TVA, CNAS…)",
    subtitle: "Pénalités et retards coûteux",
  },
];

const afterItems = [
  {
    icon: "⚡",
    title: "5 minutes pour obtenir une réponse claire",
    subtitle: "→ Gain de temps immédiat",
  },
  {
    icon: "📚",
    title: "Toutes les informations DZ organisées",
    subtitle: "→ RAG-DZ avec sources officielles",
  },
  {
    icon: "📄",
    title: "Documents générés automatiquement",
    subtitle: "→ Statuts, lettres, contrats en 1 clic",
  },
  {
    icon: "🧮",
    title: "Calculs fiscaux expliqués",
    subtitle: "→ Simulateur IRG, TVA, CASNOS intégré",
  },
  {
    icon: "🔔",
    title: "Checklist mensuelle IA : jamais oublier",
    subtitle: "→ Rappels automatiques par email/SMS",
  },
];

export const PMEBeforeAfterSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-500/10 to-green-500/10 border border-gray-600 rounded-full text-gray-300 text-sm font-medium mb-4">
          ⚡ Transformation
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Avant / Après{" "}
          <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            IAFactory Algeria
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Découvrez comment nos utilisateurs ont transformé leur quotidien avec le Pack PME DZ.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* BEFORE Column */}
        <div className="bg-background rounded-2xl border border-red-500/30 overflow-hidden hover:border-red-500/50 transition-all duration-300">
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/10 px-6 py-4 border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-xl">
                ⛔
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400">Avant l'IA</h3>
                <p className="text-xs text-gray-500">Situation classique des PME</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {beforeItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-all group"
              >
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-200 font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER Column */}
        <div className="bg-background rounded-2xl border border-green-500/30 overflow-hidden hover:border-green-500/50 transition-all duration-300">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/10 px-6 py-4 border-b border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl">
                ✅
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-400">Après l'IA</h3>
                <p className="text-xs text-gray-500">Avec Pack PME DZ</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {afterItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-green-500/5 rounded-xl border border-green-500/10 hover:border-green-500/30 transition-all group"
              >
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-200 font-medium">{item.title}</p>
                  <p className="text-xs text-green-500/70 mt-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA after comparison */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500/10 via-transparent to-green-500/10 rounded-2xl border border-gray-700">
          <span className="text-red-400 text-2xl">⛔</span>
          <span className="text-2xl">→</span>
          <span className="text-green-400 text-2xl">✅</span>
          <span className="text-gray-300 font-semibold ml-2">
            Transformez votre PME dès aujourd'hui
          </span>
        </div>
      </div>
    </div>
  );
};
