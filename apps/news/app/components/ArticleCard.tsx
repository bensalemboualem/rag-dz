'use client';

import { Article } from '@/lib/rss';
import { getTimeAgo, getImageFromArticle, getExcerpt } from '@/lib/rss';
import { getSourceById } from '@/data/sources';
import { ExternalLink } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const image = getImageFromArticle(article);
  const excerpt = getExcerpt(article, 150);
  const timeAgo = getTimeAgo(article.pubDate);
  const source = getSourceById(article.source.id);

  return (
    <article className="article-card">
      {/* Image */}
      {image && (
        <img
          src={image}
          alt={article.title}
          className="article-card-image"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      {/* Content */}
      <div className="flex-1">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="article-title"
        >
          {article.title}
        </a>

        <p className="article-excerpt">{excerpt}</p>
      </div>

      {/* Meta */}
      <div className="article-meta">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-primary">{article.source.name}</span>
          {source?.category && (
            <span className="badge badge-primary">{source.category}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span>{timeAgo}</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </article>
  );
}
