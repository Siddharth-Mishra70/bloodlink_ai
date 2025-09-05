import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Calendar, RefreshCw, BarChart3 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { getBloodInventoryForecast } from '../../../services/openaiService';

const AIForecastPanel = ({ className = '' }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock inventory data - replace with actual data
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

  const getAlertColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'urgent': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'low': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getAlertIcon = (level) => {
    if (level === 'critical' || level === 'urgent') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return <TrendingUp className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-red-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">AI Forecast</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3]?.map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">AI Forecast</h3>
          </div>
          <Button
            onClick={loadForecast}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center py-6">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={loadForecast}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">AI Forecast</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Live Analysis
            </span>
          </div>
          <Button
            onClick={loadForecast}
            disabled={loading}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Forecast Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800">Forecast Summary</h4>
          </div>
          <p className="text-gray-700 text-sm">{forecast?.forecast_summary}</p>
        </div>

        {/* Critical Alerts */}
        {forecast?.critical_alerts?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Critical Alerts ({forecast?.critical_alerts?.length})
            </h4>
            <div className="space-y-3">
              {forecast?.critical_alerts?.map((alert, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getAlertColor(alert?.alert_level)}`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert?.alert_level)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{alert?.blood_type}</span>
                        <span className="text-xs px-2 py-1 bg-white rounded-full border">
                          {alert?.alert_level?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert?.recommendation}</p>
                      {alert?.days_remaining && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{alert?.days_remaining} days supply remaining</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {forecast?.recommendations?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">AI Recommendations</h4>
            <div className="space-y-2">
              {forecast?.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Actions */}
        {forecast?.next_actions?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Recommended Actions</h4>
            <div className="space-y-3">
              {forecast?.next_actions?.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{action?.action}</p>
                    {action?.timeline && (
                      <p className="text-xs text-gray-600 mt-1">Timeline: {action?.timeline}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    action?.priority === 'high' ? 'bg-red-100 text-red-800' :
                    action?.priority === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {action?.priority?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Last updated: {new Date()?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIForecastPanel;