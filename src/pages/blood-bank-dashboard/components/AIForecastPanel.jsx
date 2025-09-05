import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AIForecastPanel = ({ forecastData, demandPredictions }) => {
  const [viewMode, setViewMode] = useState('forecast');
  const [timeRange, setTimeRange] = useState('7days');

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
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7days">Next 7 Days</option>
              <option value="14days">Next 14 Days</option>
              <option value="30days">Next 30 Days</option>
            </select>
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('forecast')}
                className={`px-3 py-1 text-sm font-medium transition-medical ${
                  viewMode === 'forecast'
                    ? 'bg-primary text-primary-foreground' :'bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                Forecast
              </button>
              <button
                onClick={() => setViewMode('recommendations')}
                className={`px-3 py-1 text-sm font-medium transition-medical ${
                  viewMode === 'recommendations' ?'bg-primary text-primary-foreground' :'bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {viewMode === 'forecast' ? (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandPredictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748B"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748B"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                    name="Predicted Demand"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#059669" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                    name="Current Stock"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecastData?.bloodGroups?.map((group) => (
                <div key={group?.type} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Droplets" size={16} className="text-primary" />
                      <span className="font-medium text-text-primary">{group?.type}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      group?.status === 'shortage' ? 'bg-error/10 text-error' :
                      group?.status === 'low'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                    }`}>
                      {group?.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Current:</span>
                      <span className="text-text-primary">{group?.current} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Predicted Need:</span>
                      <span className="text-text-primary">{group?.predicted} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Confidence:</span>
                      <span className="text-text-primary">{group?.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {forecastData?.recommendations?.map((rec) => (
              <div key={rec?.id} className={`border rounded-lg p-4 ${getRecommendationColor(rec?.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name={rec?.icon} size={16} />
                      <span className="font-medium">{rec?.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getRecommendationColor(rec?.priority)}`}>
                        {rec?.priority}
                      </span>
                    </div>
                    <p className="text-sm opacity-90 mb-3">{rec?.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>Action needed by: {rec?.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Target" size={12} />
                        <span>Impact: {rec?.impact}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                    onClick={() => console.log('Take action:', rec?.id)}
                  >
                    Take Action
                  </Button>
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