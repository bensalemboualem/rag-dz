"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  credits: number;
  popular?: boolean;
}

const templates: Template[] = [
  {
    id: "1",
    name: "Pub Produit E-commerce",
    description: "Présentez vos produits avec des animations modernes et dynamiques",
    category: "E-commerce",
    thumbnail: "/templates/ecommerce.jpg",
    duration: "15s",
    credits: 15,
    popular: true,
  },
  {
    id: "2",
    name: "Story Instagram Promo",
    description: "Format vertical optimisé pour les stories avec call-to-action",
    category: "Social Media",
    thumbnail: "/templates/story.jpg",
    duration: "10s",
    credits: 10,
  },
  {
    id: "3",
    name: "Intro YouTube",
    description: "Intro professionnelle pour chaîne YouTube avec logo animé",
    category: "YouTube",
    thumbnail: "/templates/youtube.jpg",
    duration: "5s",
    credits: 8,
  },
  {
    id: "4",
    name: "CAN 2025 - Match Preview",
    description: "Template spécial CAN 2025 pour présenter les matchs à venir",
    category: "Sport",
    thumbnail: "/templates/can2025.jpg",
    duration: "20s",
    credits: 20,
    popular: true,
  },
  {
    id: "5",
    name: "Immobilier - Visite Virtuelle",
    description: "Présentez des biens immobiliers avec survol cinématique",
    category: "Immobilier",
    thumbnail: "/templates/realestate.jpg",
    duration: "30s",
    credits: 25,
  },
  {
    id: "6",
    name: "Restaurant - Menu du Jour",
    description: "Mettez en valeur vos plats avec des plans appétissants",
    category: "Food",
    thumbnail: "/templates/food.jpg",
    duration: "15s",
    credits: 12,
  },
];

const categories = ["Tous", "E-commerce", "Social Media", "YouTube", "Sport", "Immobilier", "Food"];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === "Tous" || t.category === selectedCategory
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Templates</h1>
          <p className="text-text-muted">
            Choisissez un template et personnalisez-le avec votre contenu
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface border border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-background">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                {template.popular && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-warning/20 rounded-full">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-xs text-warning font-medium">Populaire</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-background/60 backdrop-blur rounded-full">
                    <Clock className="w-3 h-3 text-text-muted" />
                    <span className="text-xs text-text-muted">{template.duration}</span>
                  </div>
                </div>
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-semibold">{template.name}</h3>
                  <span className="text-sm text-primary font-medium">
                    {template.credits} crédits
                  </span>
                </div>
                <p className="text-sm text-text-muted mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted bg-background px-2 py-1 rounded">
                    {template.category}
                  </span>
                  <Link
                    href={`/studio?template=${template.id}`}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    Utiliser
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
