/**
 * @file AIForecastPanel.jsx
 * @description User-facing predictive shortage warnings and stock alerts computed by OpenAI models.
 * Highlights high, urgent, and low risk blood type categories with automated health guidance.
 */

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Calendar, RefreshCw, BarChart3 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { getBloodInventoryForecast } from '../../../services/openaiService';

/**
 * AIForecastPanel Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} [props.className=''] - Container styling overrides.
 * @returns {JSX.Element} AI forecast and shortage alerts card.
 */
const AIForecastPanel = ({ className = '' }) => {
  // AI forecast response
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Baseline regional stock data
  const mockInventoryData = {
    'A+': { units: 45, expiring_soon: 5 },
    'A-': { units: 12, expiring_soon: 2 },
    'B+': { units: 38, expiring_soon: 3 },
    'B-': { units: 8, expiring_soon: 1 },
    'AB+': { units: 15, expiring_soon: 1 },
    'AB-': { units: 4, expiring_soon: 0 },
    'O+': { units: 62, expiring_soon: 8 },
    'O-': { units: 18, expiring_soon: 2 }
  };

  const mockHistoricalData = {
    average_daily_usage: {
      'A+': 3.2, 'A-': 1.1, 'B+': 2.8, 'B-': 0.7,
      'AB+': 1.0, 'AB-': 0.3, 'O+': 4.1, 'O-': 1.5
    },
    seasonal_trends: 'Winter increased demand',
    emergency_frequency: 0.15
  };

  /**
   * Calls OpenAI service to compute demand predictions.
   */
  const loadForecast = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getBloodInventoryForecast(mockInventoryData, mockHistoricalData);
      setForecast(result);
    } catch (err) {
      console.error('Error loading forecast:', err);
      setError('Failed to load AI forecast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  /**
   * Resolves badge color styling.
   * @param {string} level - Alert severity ('critical'|'urgent'|'low').
   * @returns {string} Tailwind CSS classes.
   */
  const getAlertColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'urgent': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'low': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 medical-shadow ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-semibold text-text-primary">Generating AI Forecast...</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3]?.map(i => (
            <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 medical-shadow ${className}`}>
        <p className="text-sm text-error mb-3">{error}</p>
        <Button variant="outline" size="sm" onClick={loadForecast}>Retry</Button>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className={`bg-card border border-border rounded-lg p-6 medical-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text-primary">AI Regional Shortage Forecast</h3>
        </div>
        <Button variant="ghost" size="xs" onClick={loadForecast} iconName="RefreshCw" />
      </div>

      <p className="text-xs text-text-secondary mb-4">{forecast?.forecast_summary}</p>

      {/* Critical Alerts */}
      <div className="space-y-2">
        {forecast?.critical_alerts?.map((alert, idx) => (
          <div key={idx} className={`p-3 rounded border text-xs flex items-center justify-between ${getAlertColor(alert?.alert_level)}`}>
            <div>
              <span className="font-bold mr-2">{alert?.blood_type}</span>
              <span>{alert?.recommendation}</span>
            </div>
            <span className="font-semibold uppercase text-[10px] ml-2">{alert?.alert_level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIForecastPanel;
