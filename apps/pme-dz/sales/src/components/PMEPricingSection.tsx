import React from "react";

const plans = [
  {
    name: "Free",
    icon: "🎁",
    description: "Pour découvrir la plateforme",
    price: "0",
    period: "pour toujours",
    iconBg: "bg-gray-700/50",
    borderColor: "border-gray-700",
    hoverBorder: "hover:border-gray-500",
    checkColor: "text-gray-400",
    textColor: "text-gray-400",
    buttonStyle: "bg-gray-700 hover:bg-gray-600 text-white",
    buttonText: "Essayer gratuitement",
    popular: false,
    features: [
      { text: "100 crédits / mois", included: true },
      { text: "Accès aux modules de base", included: true },
      { text: "IA limitée", included: true },
      { text: "RAG-DZ limité", included: true },
      { text: "Pas d'export documents", included: false },
    ],
  },
  {
    name: "PME Pro",
    icon: "🚀",
    description: "Pour les PME sérieuses",
    price: "3 900",
    period: "/ mois",
    iconBg: "bg-green-500/20",
    borderColor: "border-green-500 border-2",
    hoverBorder: "",
    checkColor: "text-green-500",
    textColor: "text-gray-200",
    buttonStyle:
      "bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:opacity-90 text-white",
    buttonText: "Passer au plan Pro →",
    popular: true,
    features: [
      { text: "3 000 crédits / mois", included: true },
      { text: "Assistant fiscal DZ complet", included: true },
      { text: "Assistant juridique DZ", included: true },
      { text: "RAG-DZ illimité", included: true },
      { text: "Génération de documents", included: true },
      { text: "CRM-DZ (max 5 dossiers)", included: true },
      { text: "Export PDF / Word", included: true },
    ],
  },
  {
    name: "PME Business",
    icon: "🏢",
    description: "Pour les entreprises en croissance",
    price: "8 900",
    period: "/ mois",
    iconBg: "bg-blue-500/20",
    borderColor: "border-gray-700",
    hoverBorder: "hover:border-blue-500",
    checkColor: "text-blue-500",
    textColor: "text-gray-300",
    buttonStyle: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 border border-blue-500",
    buttonText: "Choisir Business",
    popular: false,
    features: [
      { text: "10 000 crédits / mois", included: true },
      { text: "CRM-DZ illimité", included: true },
      { text: "StartupDZ Onboarding inclus", included: true },
      { text: "API PRO", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Plus de projets / mois", included: true },
      { text: "Tout de PME Pro inclus", included: true },
    ],
  },
];

export const PMEPricingSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
          💳 Tarification simple
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Choisissez{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
            votre plan
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Des tarifs adaptes aux PME algeriennes. Commencez gratuitement, evoluez selon vos besoins.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-muted rounded-2xl ${plan.borderColor} overflow-hidden ${plan.hoverBorder} transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group relative ${
              plan.popular ? "shadow-lg shadow-primary/20" : ""
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-white text-center py-2 text-sm font-bold">
                ⭐ POPULAIRE
              </div>
            )}

            <div className={`p-8 ${plan.popular ? "pt-14" : ""}`}>
              {/* Plan Header */}
              <div className="text-center mb-6">
                <div
                  className={`w-14 h-14 ${plan.iconBg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4`}
                >
                  {plan.icon}
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${plan.popular ? "text-primary" : ""}`}
                >
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className={`text-4xl font-black ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent"
                        : plan.name === "PME Business"
                        ? "text-blue-500"
                        : "text-gray-300"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-500">DZD</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{plan.period}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-sm">
                    <span className={feature.included ? plan.checkColor : "text-gray-500"}>
                      {feature.included ? "✓" : "✗"}
                    </span>
                    <span className={feature.included ? plan.textColor : "text-gray-500"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href="/cockpit/"
                className={`block w-full py-3 px-6 ${plan.buttonStyle} rounded-xl font-semibold text-center transition-all`}
              >
                {plan.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Footer Notes */}
      <div className="text-center mt-12 space-y-4">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>Paiement sécurisé CIB / Edahabia</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔄</span>
            <span>Annulation à tout moment</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📧</span>
            <span>Facture conforme DGI</span>
          </div>
        </div>
        <p className="text-gray-600 text-xs">
          * Tous les prix sont TTC. Crédits non cumulables d'un mois à l'autre.
        </p>
      </div>
    </div>
  );
};
