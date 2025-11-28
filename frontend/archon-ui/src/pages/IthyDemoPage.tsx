/**
 * Page de démonstration du système de présentation ithy.ai
 * IA Factory - RAG Souverain
 */

import React from 'react';
import { IthyStyleRenderer } from '../components/presentation';
import { createDemoResponse } from '../lib/rag/responseTransformer';

export function IthyDemoPage() {
  const demoResponse = createDemoResponse();

  return (
    <div className="ithy-demo-page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-red-400 bg-clip-text text-transparent">
            IA Factory - Présentation Style ithy.ai
          </h1>
          <p className="text-gray-400 text-lg">
            Système de Réponses Enrichies pour RAG Souverain 🇩🇿🇨🇭
          </p>
        </div>

        {/* Ithy Renderer Demo */}
        <IthyStyleRenderer {...demoResponse} />

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-100">📊 Fonctionnalités</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Sections structurées avec icônes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Tableaux comparatifs interactifs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Graphiques dynamiques (Recharts)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>FAQ expandables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Citations sources avec pertinence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Alertes juridiques</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Support multilingue (FR/AR/DE)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Design responsive</span>
            </li>
          </ul>
        </div>

        {/* Usage Example */}
        <div className="mt-6 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-100">💻 Utilisation</h3>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`import { IthyStyleRenderer } from '@/components/presentation';
import { transformToIthyFormat } from '@/lib/rag/responseTransformer';

function RAGResponse({ rawResponse }) {
  const ithyData = transformToIthyFormat(rawResponse);
  return <IthyStyleRenderer {...ithyData} />;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default IthyDemoPage;
