"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Sparkles, Mic, Film, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          {/* Header */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold">IA Factory</span>
            </div>
            <Link
              href="/studio"
              className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg font-medium transition-colors"
            >
              Lancer le Studio
            </Link>
          </nav>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-muted">Propulsé par Kling 1.6 & ElevenLabs</span>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-text-primary via-primary to-accent bg-clip-text text-transparent">
              Créez des Vidéos IA en Darija
            </h1>

            <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
              Générez des vidéos professionnelles avec voix algérienne en quelques clics. 
              Text-to-Video, Image-to-Video, et synchronisation vocale automatique.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="group flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover rounded-xl font-semibold text-lg transition-all pulse-glow"
              >
                <Play className="w-5 h-5" />
                Commencer Gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/templates"
                className="flex items-center gap-2 px-8 py-4 bg-surface hover:bg-surface-hover border border-border rounded-xl font-semibold text-lg transition-colors"
              >
                Voir les Templates
              </Link>
            </div>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-24"
          >
            {[
              {
                icon: Sparkles,
                title: "Text-to-Video",
                description: "Décrivez votre scène et laissez l'IA créer une vidéo HD en quelques minutes",
              },
              {
                icon: Film,
                title: "Image-to-Video",
                description: "Animez vos images avec des mouvements réalistes et des effets cinématiques",
              },
              {
                icon: Mic,
                title: "Voix Darija",
                description: "Générez des voix-off authentiques en dialecte algérien avec ElevenLabs",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-muted">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <p className="text-text-muted text-sm">© 2024 IA Factory. Tous droits réservés.</p>
          <p className="text-text-muted text-sm">Fait avec ❤️ en Algérie</p>
        </div>
      </footer>
    </main>
  );
}
