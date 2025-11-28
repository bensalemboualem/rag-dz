/**
 * Tableau comparatif Algérie vs Suisse
 * Pour comparaisons juridiques/administratives
 */

import React from 'react';
import type { ComparisonRow } from './types';

interface ComparisonTableProps {
  title: string;
  rows: ComparisonRow[];
  showFlags?: boolean;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title,
  rows,
  showFlags = true
}) => {
  return (
    <div className="comparison-table-container my-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="comparison-table w-full border-collapse">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="p-3 text-left border-b border-gray-700">Critère</th>
              <th className="p-3 text-left border-b border-gray-700">
                {showFlags ? '🇩🇿 ' : ''}Algérie
              </th>
              <th className="p-3 text-left border-b border-gray-700">
                {showFlags ? '🇨🇭 ' : ''}Suisse
              </th>
              <th className="p-3 text-left border-b border-gray-700">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                <td className="criterion p-3 font-medium border-b border-gray-800">{row.criterion}</td>
                <td className="value-dz p-3 text-green-400 border-b border-gray-800">{row.algerie}</td>
                <td className="value-ch p-3 text-red-400 border-b border-gray-800">{row.suisse}</td>
                <td className="notes p-3 text-sm text-gray-400 border-b border-gray-800">{row.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
