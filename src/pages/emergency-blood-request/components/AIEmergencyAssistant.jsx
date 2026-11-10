/**
 * @file AIEmergencyAssistant.jsx
 * @description Urgent AI Triage Assistant component that analyzes patient emergency requests,
 * computes medical priority rankings, recommends alternative compatible blood types,
 * and proposes prioritized routing protocols.
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Brain, Clock, MapPin, Phone, Zap } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { getEmergencyBloodRecommendations } from '../../../services/openaiService';

/**
 * AIEmergencyAssistant Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.requestData - Emergency request details (bloodGroup, quantity, hospital, urgency).
 * @param {(rec: Object) => void} props.onRecommendationSelect - Callback when recommendation is selected.
 * @param {string} [props.className=''] - Container styling overrides.
 * @returns {JSX.Element|null} Real-time AI emergency triage card.
 */
const AIEmergencyAssistant = ({ requestData, onRecommendationSelect, className = '' }) => {
  // Structured OpenAI emergency recommendation response
  const [recommendations, setRecommendations] = useState(null);
  // Async analysis loading state
  const [loading, setLoading] = useState(false);
  // API error message state
  const [error, setError] = useState(null);

  /**
   * Dispatches patient and hospital parameters to OpenAI emergency triage service.
   */
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

  // Re-run analysis whenever request parameters change
  useEffect(() => {
    analyzeEmergencyRequest();
  }, [requestData]);

  /**
   * Resolves urgency color badge classes.
   * @param {'critical'|'high'|'moderate'} level - Clinical urgency level.
   * @returns {string} Tailwind CSS classes.
   */
  const getUrgencyColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  /**
   * Resolves urgency indicator Lucide icon.
   * @param {'critical'|'high'|'moderate'} level - Clinical urgency level.
   * @returns {JSX.Element} Icon component.
   */
  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-5 h-5 animate-pulse" />;
      case 'high': return <Zap className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  // Render pulsing skeleton card while AI models analyze urgency
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
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  // Render error card with manual retry option
  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Assistant Notice</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">{error}</p>
        <Button
          onClick={analyzeEmergencyRequest}
          variant="outline"
          size="sm"
        >
          Retry AI Analysis
        </Button>
      </div>
    );
  }

  // Conceal panel if no recommendation data exists
  if (!recommendations) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 ${className}`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Emergency Triage</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase ${getUrgencyColor(recommendations?.urgency_level)}`}>
          {getUrgencyIcon(recommendations?.urgency_level)}
          <span>{recommendations?.urgency_level} Urgency</span>
        </div>
      </div>

      {/* Primary Clinical Recommendation */}
      <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <h4 className="font-semibold text-red-900 text-sm mb-1">Primary Recommendation</h4>
        <p className="text-red-800 text-sm leading-relaxed">
          {recommendations?.primary_recommendation}
        </p>
      </div>

      {/* Alternative Blood Types Compatibility Grid */}
      {recommendations?.alternative_blood_types?.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 text-sm mb-2">Compatible Alternative Blood Types</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {recommendations?.alternative_blood_types?.map((alt, idx) => (
              <div key={idx} className="p-2.5 bg-gray-50 rounded border text-center">
                <div className="font-bold text-gray-900 text-sm">{alt?.blood_type}</div>
                <div className="text-[11px] text-gray-600 mt-0.5">{alt?.compatibility}</div>
                {alt?.availability_estimate && (
                  <div className="text-[10px] text-green-700 font-medium mt-1">
                    {alt?.availability_estimate}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate Recommended Protocol Actions */}
      {recommendations?.immediate_actions?.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 text-sm mb-2">Immediate Protocol Actions</h4>
          <ul className="space-y-1.5 text-xs text-gray-700">
            {recommendations?.immediate_actions?.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Response Time Estimation Footer */}
      {recommendations?.estimated_response_time && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Estimated Response Time:</span>
          <span className="font-semibold text-gray-700">{recommendations?.estimated_response_time}</span>
        </div>
      )}
    </div>
  );
};

export default AIEmergencyAssistant;
