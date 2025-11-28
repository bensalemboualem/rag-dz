/**
 * Citations et références légales
 * Format académique/juridique
 */

import React from 'react';
import { ExternalLink, FileText, Scale, Building } from 'lucide-react';
import type { Source } from './types';

interface SourceCitationProps {
  sources: Source[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'law': return <Scale size={16} className="text-blue-400" />;
    case 'decree': return <FileText size={16} className="text-purple-400" />;
    case 'official': return <Building size={16} className="text-green-400" />;
    default: return <FileText size={16} className="text-gray-400" />;
  }
};

const getCountryFlag = (country: string) => {
  return country === 'DZ' ? '🇩🇿' : '🇨🇭';
};

export const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  // Trier par relevance
  const sortedSources = [...sources].sort((a, b) => b.relevance - a.relevance);

  return (
    <div className="sources-container">
      <ol className="sources-list list-none p-0 m-0 space-y-3">
        {sortedSources.map((source, index) => (
          <li key={source.id} className={`source-item flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 type-${source.type}`}>
            <span className="source-icon mt-1">{getIcon(source.type)}</span>
            <span className="source-country text-lg">{getCountryFlag(source.country)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className="source-title font-medium text-gray-200">{source.title}</span>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400">
                {source.reference && (
                  <span className="source-reference">({source.reference})</span>
                )}
                {source.date && (
                  <span className="source-date">{source.date}</span>
                )}
                <span
                  className="source-relevance ml-auto bg-gray-700/50 px-2 py-1 rounded text-xs font-medium"
                  title="Pertinence"
                >
                  {Math.round(source.relevance * 100)}%
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
