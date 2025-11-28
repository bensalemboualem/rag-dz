/**
 * Rendu des graphiques avec Recharts
 * Support: Radar, Bar, Pie, Line charts
 */

import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import type { ChartData } from './types';

const COLORS_DZ = ['#006233', '#D21034', '#FFFFFF']; // Couleurs Algérie
const COLORS_CH = ['#FF0000', '#FFFFFF'];            // Couleurs Suisse
const COLORS_DEFAULT = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface ChartRendererProps {
  chart: ChartData;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ chart }) => {
  const colors = chart.config?.colors || COLORS_DEFAULT;
  const height = chart.config?.height || 300;

  const renderChart = () => {
    switch (chart.type) {
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={chart.data}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
              <Radar
                name="Score"
                dataKey="value"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              {chart.config?.showLegend && <Legend wrapperStyle={{ color: '#9CA3AF' }} />}
              <Bar dataKey="value" fill={colors[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'comparison':
        // Chart spécial comparaison Algérie vs Suisse
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chart.data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
              <YAxis dataKey="criterion" type="category" width={150} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="algerie" name="🇩🇿 Algérie" fill="#006233" radius={[0, 8, 8, 0]} />
              <Bar dataKey="suisse" name="🇨🇭 Suisse" fill="#FF0000" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="chart-container bg-gray-800/30 rounded-lg p-4 my-4 border border-gray-700/50">
      <h3 className="text-base font-semibold mb-4 text-gray-100">{chart.title}</h3>
      {renderChart()}
    </div>
  );
};
