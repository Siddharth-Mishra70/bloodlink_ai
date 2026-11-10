/**
 * @file QuickStatsCards.jsx
 * @description Renders summary KPI statistic metric cards for blood bank administrators.
 * Highlights total blood units, low stock alerts, active incoming requests, and impending expirations.
 */

import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * QuickStatsCards Component
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<{ id: number, type: string, label: string, value: string, change?: { type: 'increase'|'decrease', value: string }, details?: { label: string, value: string } }>} props.stats - Metric card statistics.
 * @returns {JSX.Element} Grid of KPI summary metric cards.
 */
const QuickStatsCards = ({ stats }) => {
  /**
   * Resolves badge color theme based on stat category.
   * @param {string} type - Stat type identifier ('total', 'low', 'critical', 'requests').
   * @returns {string} Tailwind CSS color classes.
   */
  const getStatColor = (type) => {
    switch (type) {
      case 'total':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'low':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'critical':
        return 'bg-error/10 text-error border-error/20';
      case 'requests':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-text-secondary border-border';
    }
  };

  /**
   * Resolves Lucide icon name according to category.
   * @param {string} type - Stat category.
   * @returns {string} Icon name.
   */
  const getStatIcon = (type) => {
    switch (type) {
      case 'total':
        return 'Package';
      case 'low':
        return 'AlertTriangle';
      case 'critical':
        return 'AlertCircle';
      case 'requests':
        return 'Clock';
      default:
        return 'BarChart3';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className={`bg-card rounded-lg border medical-shadow p-6 ${getStatColor(stat?.type)}`}
        >
          {/* Card Top Row: Label, Value & Icon */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{stat?.label}</p>
              <p className="text-2xl font-bold mt-1">{stat?.value}</p>

              {/* Weekly Trend Indicator */}
              {stat?.change && (
                <div className="flex items-center mt-2">
                  <Icon 
                    name={stat?.change?.type === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                    className={stat?.change?.type === 'increase' ? 'text-success' : 'text-error'}
                  />
                  <span className={`text-xs ml-1 ${stat?.change?.type === 'increase' ? 'text-success' : 'text-error'}`}>
                    {stat?.change?.value}
                  </span>
                  <span className="text-xs text-text-secondary ml-1">vs last week</span>
                </div>
              )}
            </div>

            {/* Circular Category Icon Container */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-current/10">
              <Icon name={getStatIcon(stat?.type)} size={24} className="opacity-80" />
            </div>
          </div>
          
          {/* Detailed Sub-metric Breakdown */}
          {stat?.details && (
            <div className="mt-4 pt-4 border-t border-current/20">
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-80">{stat?.details?.label}</span>
                <span className="font-medium">{stat?.details?.value}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;
