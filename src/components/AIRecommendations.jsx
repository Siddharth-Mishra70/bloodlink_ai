import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import { getPersonalizedRecommendations } from '../services/openaiService';

const AIRecommendations = ({ userProfile, userType = 'donor', className = '' }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRecommendations = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPersonalizedRecommendations(userProfile, userType);
      setRecommendations(result);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load personalized recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [userProfile, userType]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-red-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
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
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={loadRecommendations}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Personalized
          </span>
        </div>
        <p className="text-gray-600 text-sm">{recommendations?.welcome_message}</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Key Recommendations */}
        {recommendations?.key_recommendations?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Key Recommendations
            </h4>
            <div className="space-y-2">
              {recommendations?.key_recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {recommendations?.next_steps?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              Recommended Actions
            </h4>
            <div className="space-y-3">
              {recommendations?.next_steps?.map((step, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-2 ${getPriorityBg(step?.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(step?.priority)}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-1">{step?.title}</h5>
                      <p className="text-sm text-gray-600">{step?.description}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-white rounded-full border">
                        {step?.priority?.charAt(0)?.toUpperCase() + step?.priority?.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Tips */}
        {recommendations?.health_tips?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Health Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations?.health_tips?.map((tip, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminders */}
        {recommendations?.reminders?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Reminders
            </h4>
            <div className="space-y-2">
              {recommendations?.reminders?.map((reminder, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{reminder}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={loadRecommendations}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Refresh Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;