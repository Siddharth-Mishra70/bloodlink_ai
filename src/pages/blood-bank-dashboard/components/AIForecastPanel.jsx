/**
 * @file AIForecastPanel.jsx
 * @description Predictive AI Analytics panel for blood bank managers.
 * Integrates Recharts line charts for demand forecasting, shortage risk warnings,
 * and automated AI supply-chain recommendations.
 */

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

/**
 * AIForecastPanel Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.forecastData - Blood groups shortage models and actionable recommendations.
 * @param {Array<{ date: string, predicted: number, current: number }>} props.demandPredictions - Time-series points for Recharts.
 * @returns {JSX.Element} Visual analytics and predictive recommendations card.
 */
const AIForecastPanel = ({ forecastData, demandPredictions }) => {
  // Active sub-view ('forecast' chart or 'recommendations' list)
  const [viewMode, setViewMode] = useState('forecast');
  // Forecasting time horizon window
  const [timeRange, setTimeRange] = useState('7days');

  /**
   * Resolves priority badge color styling.
   * @param {string} priority - Urgency rating ('high' | 'medium' | 'low').
   * @returns {string} Tailwind CSS classes.
   */
  const getRecommendationColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  /**
   * Custom floating tooltip rendering for the Recharts line chart.
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 medical-shadow">
          <p className="text-sm font-medium text-text-primary">{`${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value} units`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border medical-shadow">
      {/* Header with Title and Mode Toggles */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Brain" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">AI Demand Forecast</h3>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
              Beta
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Horizon Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7days">Next 7 Days</option>
              <option value="14days">Next 14 Days</option>
              <option value="30days">Next 30 Days</option>
            </select>

            {/* View Mode Toggle Buttons */}
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('forecast')}
                className={`px-3 py-1 text-xs font-medium ${
                  viewMode === 'forecast' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                Chart
              </button>
              <button
                onClick={() => setViewMode('recommendations')}
                className={`px-3 py-1 text-xs font-medium ${
                  viewMode === 'recommendations' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                Actions
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Chart View */}
        {viewMode === 'forecast' && (
          <div>
            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandPredictions}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={2} name="Predicted Demand" />
                  <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" name="Current Stock" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Predicted Shortage Risk Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {forecastData?.bloodGroups?.map((group) => (
                <div key={group?.type} className="p-3 bg-surface rounded-lg border border-border text-center">
                  <div className="font-bold text-sm text-text-primary">{group?.type}</div>
                  <div className="text-xs text-text-secondary mt-1">Est: {group?.predicted} units</div>
                  <div className={`text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded ${
                    group?.status === 'shortage' ? 'bg-error/10 text-error' : group?.status === 'low' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {group?.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actionable Recommendations View */}
        {viewMode === 'recommendations' && (
          <div className="space-y-4">
            {forecastData?.recommendations?.map((rec) => (
              <div key={rec?.id} className={`p-4 rounded-lg border ${getRecommendationColor(rec?.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon name={rec?.icon || 'AlertCircle'} size={20} className="mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-text-primary">{rec?.title}</h4>
                      <p className="text-xs text-text-secondary mt-1">{rec?.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="font-medium">Target: {rec?.deadline}</span>
                        <span className="opacity-80">Impact: {rec?.impact}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-surface">
                    {rec?.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIForecastPanel;
