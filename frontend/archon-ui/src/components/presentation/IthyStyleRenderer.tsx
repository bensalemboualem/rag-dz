/**
 * Composant principal de rendu style ithy.ai
 * Transforme les réponses RAG en articles HTML riches
 * IA Factory - Système RAG Souverain Algérie/Suisse
 */

import React from 'react';
import { ChartRenderer } from './ChartRenderer';
import { ExpandableFAQ } from './ExpandableFAQ';
import { SourceCitation } from './SourceCitation';
import { ComparisonTable } from './ComparisonTable';
import { LegalAlert } from './LegalAlert';
import type { IthyResponseProps, Section } from './types';

const SectionRenderer: React.FC<{ section: Section }> = ({ section }) => {
  switch (section.type) {
    case 'text':
      return (
        <div className="ithy-section mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {section.icon && <span>{section.icon}</span>}
            {section.title}
          </h2>
          <div className="text-gray-300 leading-relaxed">{section.content}</div>
        </div>
      );

    case 'table':
      return (
        <div className="ithy-section mb-6">
          <ComparisonTable
            title={section.title}
            rows={section.content}
            showFlags={true}
          />
        </div>
      );

    case 'chart':
      return (
        <div className="ithy-section mb-6">
          <ChartRenderer chart={section.content} />
        </div>
      );

    case 'alert':
      return (
        <div className="ithy-section mb-6">
          <LegalAlert {...section.content} />
        </div>
      );

    case 'legal-reference':
      return (
        <div className="ithy-section mb-6 p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded">
          <h3 className="font-semibold text-blue-300 mb-2">{section.title}</h3>
          <div className="text-sm text-gray-300">{section.content}</div>
        </div>
      );

    default:
      return null;
  }
};

export const IthyStyleRenderer: React.FC<IthyResponseProps> = ({
  title,
  sections,
  sources,
  charts,
  faqs,
  metadata
}) => {
  return (
    <article className="ithy-article bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto border border-gray-800/50 shadow-2xl">
      {/* Header avec métadonnées */}
      <header className="ithy-header border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-red-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="ithy-meta flex flex-wrap gap-3 text-sm">
          <span className="confidence-badge bg-green-500 text-white px-3 py-1 rounded-full font-medium">
            Fiabilité: {Math.round(metadata.confidence * 100)}%
          </span>
          <span className="agents-used text-gray-400">
            <span className="font-semibold text-gray-300">Sources:</span> {metadata.agents.join(', ')}
          </span>
          <span className="generated-at text-gray-400 ml-auto">
            {metadata.generatedAt.toLocaleDateString(metadata.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </header>

      {/* Sections dynamiques */}
      <main className="ithy-content">
        {sections.map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>

      {/* Charts additionnels */}
      {charts && charts.length > 0 && (
        <section className="ithy-charts mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Visualisations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charts.map((chart, index) => (
              <ChartRenderer key={index} chart={chart} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Expandable */}
      {faqs && faqs.length > 0 && (
        <section className="ithy-faq mb-8">
          <h2 className="text-xl font-semibold mb-4">❓ Questions Fréquentes</h2>
          <ExpandableFAQ items={faqs} />
        </section>
      )}

      {/* Sources et Citations */}
      <footer className="ithy-sources pt-8 border-t border-gray-800">
        <h2 className="text-xl font-semibold mb-4">📚 Sources et Références</h2>
        <SourceCitation sources={sources} />
      </footer>

      {/* Badge "Powered by IA Factory" */}
      <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
        <p className="text-xs text-gray-500">
          Généré par <span className="font-semibold text-gray-400">IA Factory RAG</span> - Système Souverain 🇩🇿🇨🇭
        </p>
      </div>
    </article>
  );
};
