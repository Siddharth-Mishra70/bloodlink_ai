import React, { useState, useEffect } from 'react';
import { AlertTriangle, Brain, Clock, MapPin, Phone, Zap } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { getEmergencyBloodRecommendations } from '../../../services/openaiService';

const AIEmergencyAssistant = ({ requestData, onRecommendationSelect, className = '' }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeEmergencyRequest = async () => {
    if (!requestData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getEmergencyBloodRecommendations(requestData);
      setRecommendations(result);
    } catch (err) {
      console.error('Error analyzing emergency request:', err);
      setError('Failed to analyze emergency request. Please proceed manually.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeEmergencyRequest();
  }, [requestData]);

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-5 h-5 animate-pulse" />;
      case 'high': return <Zap className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-red-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">AI Emergency Analysis</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Emergency Analysis</h3>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          <Button
            onClick={analyzeEmergencyRequest}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry Analysis
          </Button>
        </div>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 border-red-500 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Emergency Analysis</h3>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            Real-time
          </span>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Urgency Level */}
        <div className={`p-4 rounded-lg border-2 ${getUrgencyColor(recommendations?.urgency_level)}`}>
          <div className="flex items-center gap-3 mb-2">
            {getUrgencyIcon(recommendations?.urgency_level)}
            <h4 className="font-semibold">
              Urgency Level: {recommendations?.urgency_level?.toUpperCase()}
            </h4>
          </div>
          {recommendations?.estimated_response_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Estimated Response Time: {recommendations?.estimated_response_time}</span>
            </div>
          )}
        </div>

        {/* Primary Recommendation */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Primary Recommendation
          </h4>
          <p className="text-gray-700 text-sm">{recommendations?.primary_recommendation}</p>
        </div>

        {/* Alternative Blood Types */}
        {recommendations?.alternative_blood_types?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Compatible Alternatives</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations?.alternative_blood_types?.map((alternative, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{alternative?.blood_type}</span>
                    <Button
                      onClick={() => onRecommendationSelect?.(alternative)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      Select
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{alternative?.compatibility}</p>
                  {alternative?.availability_estimate && (
                    <p className="text-xs text-gray-500">
                      Availability: {alternative?.availability_estimate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Immediate Actions */}
        {recommendations?.immediate_actions?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Immediate Actions Required
            </h4>
            <div className="space-y-2">
              {recommendations?.immediate_actions?.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Hotlines
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-red-600" />
              <span>Blood Bank Emergency: </span>
              <a href="tel:1800-BLOOD-1" className="font-semibold text-red-600 hover:underline">
                1800-BLOOD-1
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Nearest Hospital: </span>
              <button 
                onClick={() => {/* Handle hospital finder */}}
                className="font-semibold text-blue-600 hover:underline"
              >
                Find Now
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={analyzeEmergencyRequest}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Refresh Analysis
          </Button>
          <Button
            onClick={() => {/* Handle contact emergency services */}}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Contact Emergency Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIEmergencyAssistant;