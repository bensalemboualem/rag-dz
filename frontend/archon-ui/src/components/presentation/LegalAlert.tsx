/**
 * Alertes juridiques importantes
 * Pour avertissements, mises en garde légales
 */

import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import type { LegalAlertProps } from './types';

export const LegalAlert: React.FC<LegalAlertProps> = ({
  type,
  title,
  content,
  legalBasis
}) => {
  const icons = {
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />
  };

  const bgColors = {
    warning: 'bg-amber-500/10 border-amber-500',
    info: 'bg-blue-500/10 border-blue-500',
    success: 'bg-green-500/10 border-green-500',
    error: 'bg-red-500/10 border-red-500'
  };

  return (
    <div className={`legal-alert flex gap-4 p-4 rounded-lg border-l-4 ${bgColors[type]}`}>
      <div className="alert-icon mt-1">{icons[type]}</div>
      <div className="alert-content flex-1">
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="text-sm text-gray-300">{content}</p>
        {legalBasis && (
          <small className="legal-basis block mt-2 text-xs text-gray-400">
            Base légale: {legalBasis}
          </small>
        )}
      </div>
    </div>
  );
};
