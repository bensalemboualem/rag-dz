"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Crown, Check, TrendingUp } from "lucide-react";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  features: string[];
}

const creditPacks: CreditPack[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 990,
    features: [
      "50 crédits (~5 vidéos)",
      "Text-to-Video basique",
      "Image-to-Video basique",
      "Export 720p",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 200,
    price: 2990,
    popular: true,
    features: [
      "200 crédits (~20 vidéos)",
      "Tous les modèles IA",
      "Voix Darija incluse",
      "Export 1080p",
      "Support prioritaire",
    ],
  },
  {
    id: "business",
    name: "Business",
    credits: 500,
    price: 5990,
    features: [
      "500 crédits (~50 vidéos)",
      "Accès API illimité",
      "Voix personnalisée",
      "Export 4K",
      "Account Manager dédié",
      "Facturation entreprise",
    ],
  },
];

const usageHistory = [
  { date: "2024-12-19", type: "Génération vidéo", credits: -10, description: "Promo Ramadan 2025" },
  { date: "2024-12-18", type: "Voix-off", credits: -5, description: "Narration Darija" },
  { date: "2024-12-18", type: "Achat", credits: 200, description: "Pack Pro" },
  { date: "2024-12-17", type: "Génération vidéo", credits: -15, description: "Story Instagram" },
];

export default function CreditsPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Crédits</h1>
          <p className="text-text-muted">Gérez votre solde et achetez des crédits</p>
        </div>

        {/* Current balance */}
        <div className="bg-gradient-to-br from-primary/20 via-surface to-accent/10 border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted mb-2">Solde actuel</p>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-5xl font-bold">150</span>
                <span className="text-xl text-text-muted">crédits</span>
              </div>
              <p className="text-sm text-text-muted mt-2">
                ≈ 15 vidéos restantes
              </p>
            </div>
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Credit packs */}
        <div className="mb-12">
          <h2 className="font-heading text-xl font-semibold mb-6">Acheter des crédits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {creditPacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-surface border rounded-2xl p-6 ${
                  pack.popular
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                } transition-colors`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-primary rounded-full">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">Populaire</span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {pack.id === "starter" && <Zap className="w-5 h-5 text-warning" />}
                    {pack.id === "pro" && <Sparkles className="w-5 h-5 text-primary" />}
                    {pack.id === "business" && <Crown className="w-5 h-5 text-accent" />}
                    <h3 className="font-heading text-lg font-semibold">{pack.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-bold">{pack.price}</span>
                    <span className="text-text-muted">DA</span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">
                    {pack.credits} crédits
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    pack.popular
                      ? "bg-primary hover:bg-primary-hover text-white"
                      : "bg-surface-hover hover:bg-border border border-border"
                  }`}
                >
                  Acheter
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Usage history */}
        <div>
          <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Historique d'utilisation
          </h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-text-muted px-6 py-4">Date</th>
                  <th className="text-left text-sm font-medium text-text-muted px-6 py-4">Type</th>
                  <th className="text-left text-sm font-medium text-text-muted px-6 py-4">Description</th>
                  <th className="text-right text-sm font-medium text-text-muted px-6 py-4">Crédits</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map((item, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {new Date(item.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-sm">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{item.description}</td>
                    <td className={`px-6 py-4 text-sm text-right font-medium ${
                      item.credits > 0 ? "text-success" : "text-error"
                    }`}>
                      {item.credits > 0 ? "+" : ""}{item.credits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
