import React from "react";

const painPoints = [
  {
    icon: "🤯",
    title: "Fiscalité complexe",
    description:
      "IRG, TVA, IBS, TAP, IFU… Difficile de comprendre quel impôt payer et comment le calculer selon votre activité.",
  },
  {
    icon: "🏛️",
    title: "Procédures administratives",
    description:
      "CNRC, DGI, CNAS, CASNOS, NIF… Des allers-retours interminables entre administrations pour la moindre démarche.",
  },
  {
    icon: "📰",
    title: "Informations obsolètes",
    description:
      "Les lois changent, les barèmes évoluent, mais trouver des informations fiables et à jour reste un défi permanent.",
  },
  {
    icon: "⏰",
    title: "Perte de temps",
    description:
      "Des heures passées à chercher des réponses sur Google, appeler des administrations, attendre des rendez-vous…",
  },
  {
    icon: "📝",
    title: "Documents introuvables",
    description:
      "Pas de modèles de statuts, contrats, ou lettres adaptés au contexte algérien. Tout doit être fait manuellement.",
  },
  {
    icon: "💰",
    title: "Conseils coûteux",
    description:
      "Consulter un avocat ou un comptable pour chaque question représente un coût important pour une PME.",
  },
];

export const PainPointsPME: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-4">
          😤 Problèmes courants
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Les <span className="text-red-400">défis</span> des PME en Algérie
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chaque jour, des milliers d'entrepreneurs algériens perdent du temps et de l'énergie face à
          ces obstacles.
        </p>
      </div>

      {/* Pain Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {painPoints.map((pain, index) => (
          <div
            key={index}
            className="bg-muted rounded-2xl p-6 border border-border hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 cursor-default group"
          >
            <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              {pain.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{pain.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{pain.description}</p>
          </div>
        ))}
      </div>

      {/* Transition CTA */}
      <div className="text-center mt-16">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full">
          <span className="text-primary text-xl">*</span>
          <span className="text-muted-foreground">Et si une IA pouvait resoudre tout ca pour vous ?</span>
          <a href="#solution" className="text-primary font-semibold hover:underline">
            Découvrir →
          </a>
        </div>
      </div>
    </div>
  );
};
