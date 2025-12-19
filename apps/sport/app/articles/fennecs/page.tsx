import { Trophy, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function FennecsPage() {
  // Mock articles - sera remplacé par Markdown CMS
  const articles = [
    {
      id: 1,
      title: "Les Fennecs se préparent pour la CAN 2025 🦊",
      excerpt: "L'équipe nationale algérienne intensifie sa préparation pour la Coupe d'Afrique des Nations 2025 au Maroc.",
      date: "2025-12-16",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"
    },
    {
      id: 2,
      title: "Belmadi convoque 28 joueurs pour le stage de préparation",
      excerpt: "Le sélectionneur national Djamel Belmadi a dévoilé sa liste élargie de 28 joueurs pour le stage préparatoire à la CAN.",
      date: "2025-12-15",
      image: "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=800"
    },
    {
      id: 3,
      title: "Historique: Toutes les participations de l'Algérie à la CAN",
      excerpt: "Retour sur le parcours glorieux des Fennecs en Coupe d'Afrique, de 1968 à aujourd'hui.",
      date: "2025-12-14",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"
    },
  ];

  return (
    <div className="py-8">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 mb-8">
        <div className="container-app">
          <div className="flex items-center space-x-4 mb-4">
            <Trophy className="w-12 h-12" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                🦊 Les Fennecs
              </h1>
              <p className="text-xl opacity-90">Équipe Nationale d'Algérie</p>
            </div>
          </div>
          <p className="text-lg opacity-75">
            Double champions d'Afrique (1990, 2019) 🏆🏆
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container-app mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-bold text-primary">37ᵉ</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Classement FIFA</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-bold text-primary">2x</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Champions CAN</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-bold text-primary">4x</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Coupe du Monde</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-bold text-primary">1963</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Année de création</div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="container-app">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Derniers Articles 🦊
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article key={article.id} className="article-card">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="badge-fennec">Fennecs 🦊</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  <Link
                    href={`/articles/fennecs/${article.id}`}
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    Lire →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
