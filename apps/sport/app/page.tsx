import { Trophy, TrendingUp, Users, Globe, Calendar } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  // Mock data - sera remplacé par Markdown CMS
  const featuredArticles = [
    {
      id: 1,
      title: "Les Fennecs se préparent pour la CAN 2025 🦊",
      excerpt:
        "L'équipe nationale algérienne intensifie sa préparation pour la Coupe d'Afrique des Nations 2025 au Maroc.",
      category: "fennecs",
      date: "2025-12-16",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    },
    {
      id: 2,
      title: "Ligue 1: Le CR Belouizdad reprend la tête",
      excerpt:
        "Victoire écrasante 3-0 face au MC Alger, le CRB retrouve la première place du championnat.",
      category: "ligue1",
      date: "2025-12-15",
      image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
    },
    {
      id: 3,
      title: "Mahrez brille avec Al-Ahli en Arabie Saoudite",
      excerpt:
        "Double passeur et un but, Riyad Mahrez confirme sa grande forme en Saudi Pro League.",
      category: "international",
      date: "2025-12-14",
      image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800",
    },
  ];

  const quickStats = [
    {
      label: "Classement FIFA",
      value: "37ᵉ",
      icon: Trophy,
      color: "text-primary",
    },
    {
      label: "Ligue 1 J15",
      value: "En cours",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      label: "Joueurs DZ à l'étranger",
      value: "50+",
      icon: Users,
      color: "text-purple-500",
    },
    {
      label: "CAN 2025",
      value: "21 Déc",
      icon: Calendar,
      color: "text-secondary",
    },
  ];

  return (
    <div className="py-8">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 mb-8">
        <div className="container-app text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            ⚽ Sport Magazine DZ
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-6">
            Toute l'actualité sportive algérienne en temps réel
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/articles/fennecs"
              className="bg-white text-primary hover:bg-slate-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🦊 Les Fennecs
            </Link>
            <Link
              href="/articles/ligue1"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ligue 1 Algérie
            </Link>
            <Link
              href="/can2025"
              className="bg-accent text-slate-900 hover:bg-accent/90 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🏆 CAN 2025
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container-app mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center"
              >
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="container-app">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            À la Une 🔥
          </h2>
          <Link
            href="/articles/fennecs"
            className="text-primary hover:underline font-medium"
          >
            Voir tous les articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <article key={article.id} className="article-card">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={
                      article.category === "fennecs"
                        ? "badge-fennec"
                        : article.category === "ligue1"
                          ? "badge-ligue1"
                          : "badge-inter"
                    }
                  >
                    {article.category === "fennecs"
                      ? "Fennecs"
                      : article.category === "ligue1"
                        ? "Ligue 1"
                        : "International"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {new Date(article.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <Link
                    href={`/articles/${article.category}/${article.id}`}
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CAN 2025 Widget */}
      <section className="container-app mt-12">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">🏆 CAN 2025 - Maroc</h2>
          <p className="text-xl mb-6 opacity-90">
            La Coupe d'Afrique des Nations démarre dans:
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 min-w-[80px]">
              <div className="text-4xl font-bold">5</div>
              <div className="text-sm opacity-75">Jours</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 min-w-[80px]">
              <div className="text-4xl font-bold">12</div>
              <div className="text-sm opacity-75">Heures</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 min-w-[80px]">
              <div className="text-4xl font-bold">34</div>
              <div className="text-sm opacity-75">Minutes</div>
            </div>
          </div>
          <Link
            href="/can2025"
            className="inline-block bg-white text-primary hover:bg-slate-100 px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Suivre la CAN 2025 →
          </Link>
        </div>
      </section>
    </div>
  );
}
