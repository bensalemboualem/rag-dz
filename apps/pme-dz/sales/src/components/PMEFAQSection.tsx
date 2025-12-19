import React, { useState } from "react";

const faqItems = [
  {
    question: "Est-ce que iaFactory remplace mon comptable ou mon avocat ?",
    answer: `<strong>Non.</strong> iaFactory est un assistant IA qui vous aide à <strong class="text-green-500">comprendre</strong> vos obligations et à <strong class="text-green-500">préparer</strong> vos démarches. Pour toute décision importante, vous devez consulter un professionnel (comptable, avocat, conseiller).`,
    note: "💡 L'IA vous fait gagner du temps, le professionnel valide vos choix.",
  },
  {
    question: "Les informations fiscales et juridiques sont-elles adaptées à l'Algérie ?",
    answer: `<strong>Oui.</strong> Le Pack PME DZ s'appuie sur un <strong class="text-green-500">RAG spécialement entraîné</strong> sur des sources algériennes (JORADP, DGI, CNRC, CNAS, etc.). Nous vous indiquons les limites et vous encourageons à vérifier auprès des autorités.`,
    badges: ["JORADP", "DGI", "CNRC", "CNAS"],
  },
  {
    question: "Puis-je utiliser iaFactory pour toutes les wilayas ?",
    answer: `<strong>Oui</strong>, les règles générales s'appliquent partout en Algérie. Certaines démarches locales peuvent varier selon les administrations, mais l'assistant vous donne la <strong class="text-green-500">structure principale</strong> applicable à toutes les 58 wilayas.`,
    note: "🇩🇿 Alger, Oran, Constantine, Annaba, Sétif, Blida...",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: `Les services sont hébergés <strong>en Europe</strong> (en conformité GDPR). Vos dossiers, questions et documents sont <strong class="text-green-500">privés</strong> et accessibles uniquement via votre compte sécurisé.`,
    securityBadges: ["🔒 Chiffrement SSL", "🇪🇺 Hébergé en Europe", "✅ GDPR"],
  },
  {
    question: "Que se passe-t-il si je dépasse mes crédits ?",
    answer: `Vous serez <strong>averti</strong> lorsque vous approchez la limite. Une fois les crédits épuisés, certaines fonctionnalités seront temporairement limitées, mais vous pourrez :`,
    bullets: [
      "Mettre à jour votre plan (Pro ou Business)",
      "Attendre le renouvellement mensuel automatique",
    ],
  },
  {
    question: "Puis-je tester avant de payer ?",
    answer: `<strong>Oui !</strong> Le plan <strong class="text-green-500">Free</strong> vous permet de tester l'IA avec un nombre limité de crédits chaque mois. Aucune carte bancaire requise pour commencer.`,
    cta: { text: "Creer un compte gratuit ->", href: "/cockpit/" },
  },
];

export const PMEFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-500 text-sm font-medium mb-4">
          ❓ FAQ
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Questions fréquentes des{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
            dirigeants de PME
          </span>{" "}
          en Algérie
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tout ce que vous devez savoir avant de commencer avec le Pack PME DZ.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className={`bg-background rounded-2xl border overflow-hidden transition-all ${
              openIndex === index
                ? "border-primary"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
            >
              <span className="font-semibold text-foreground pr-4">{item.question}</span>
              <span
                className={`text-primary text-xl shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-45" : ""
                }`}
              >
                {openIndex === index ? "×" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="px-6 pb-5">
                <div className="pt-2 border-t border-border">
                  <p
                    className="text-muted-foreground leading-relaxed pt-4"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />

                  {/* Note */}
                  {item.note && (
                    <p className="text-muted-foreground text-sm mt-3 flex items-center gap-2">
                      <span>{item.note}</span>
                    </p>
                  )}

                  {/* Badges */}
                  {item.badges && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.badges.map((badge, bIndex) => (
                        <span
                          key={bIndex}
                          className={`px-2 py-1 text-xs rounded-full ${
                            bIndex === 0
                              ? "bg-primary/10 text-primary"
                              : bIndex === 1
                              ? "bg-blue-500/10 text-blue-500"
                              : bIndex === 2
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-orange-500/10 text-orange-400"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Security Badges */}
                  {item.securityBadges && (
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      {item.securityBadges.map((badge, bIndex) => (
                        <span key={bIndex} className="flex items-center gap-1">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bullets */}
                  {item.bullets && (
                    <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
                      {item.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="flex items-center gap-2">
                          <span className="text-primary">-></span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  {item.cta && (
                    <a
                      href={item.cta.href}
                      className="inline-flex items-center gap-2 mt-3 text-primary hover:text-primary/80 transition text-sm font-semibold"
                    >
                      {item.cta.text}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* More questions CTA */}
      <div className="text-center mt-10">
        <p className="text-muted-foreground text-sm">
          Vous avez d'autres questions ?{" "}
          <a
            href="mailto:contact@iafactoryalgeria.com"
            className="text-primary hover:underline"
          >
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
};
