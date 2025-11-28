/**
 * FAQ Expandable/Collapsible
 * Avec animation smooth
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { FAQ } from './types';

interface ExpandableFAQProps {
  items: FAQ[];
}

export const ExpandableFAQ: React.FC<ExpandableFAQProps> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="faq-container flex flex-col gap-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`faq-item bg-gray-800/50 rounded-lg overflow-hidden transition-all ${
            expandedIndex === index ? 'ring-2 ring-blue-500/50' : ''
          }`}
        >
          <button
            className="faq-question w-full flex justify-between items-center p-4 bg-transparent border-none text-left hover:bg-white/5 transition-colors"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <span className="font-medium text-gray-100">{item.question}</span>
            {expandedIndex === index ? (
              <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0 ml-2" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
            )}
          </button>

          <div
            className={`faq-answer overflow-hidden transition-all duration-300 ${
              expandedIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="p-4 pt-0 border-t border-gray-700">
              <p className="text-gray-300 text-sm">{item.answer}</p>
              {item.relatedSources && item.relatedSources.length > 0 && (
                <div className="faq-sources mt-3 pt-3 border-t border-gray-700/50">
                  <small className="text-xs text-gray-500">
                    Sources: {item.relatedSources.join(', ')}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
