'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/lib/rss';
import ArticleCard from './components/ArticleCard';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import { RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchArticles = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('limit', '100');

      const response = await fetch(`/api/rss?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles);
        setFilteredArticles(data.articles);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  useEffect(() => {
    // Filter articles by search query
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.contentSnippet?.toLowerCase().includes(query) ||
          article.source.name.toLowerCase().includes(query)
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  return (
    <div className="py-8">
      {/* Hero */}
      <section className="container-app mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            📰 Actualité Algérie
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            20+ sources de presse algérienne agrégées en temps réel
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* Category Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Mis à jour: {lastUpdated.toLocaleTimeString('fr-FR')}
              </span>
            )}
            <button
              onClick={fetchArticles}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-app mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary">{filteredArticles.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Articles</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary">20+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Sources</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary">⚡</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Temps Réel</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary">🇩🇿</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">100% DZ</div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container-app">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-48 mb-4"></div>
                <div className="skeleton h-6 mb-2"></div>
                <div className="skeleton h-4 mb-4"></div>
                <div className="skeleton h-4"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-slate-400 mb-4">Aucun article trouvé</p>
            <p className="text-slate-500">
              Essayez de changer de catégorie ou de recherche
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {filteredArticles.length >= 100 && (
              <div className="text-center mt-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Affichage des 100 articles les plus récents
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
