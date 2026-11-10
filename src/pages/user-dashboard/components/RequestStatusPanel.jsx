/**
 * @file RequestStatusPanel.jsx
 * @description Real-time tracking panel displaying the user's active in-flight blood requests,
 * current status (Pending, Approved, Fulfilled, Declined), estimated fulfillment time,
 * and hospital pickup details.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * RequestStatusPanel Component
 *
 * @component
 * @returns {JSX.Element} Active requests status tracking panel.
 */
const RequestStatusPanel = () => {
  const navigate = useNavigate();

  // Active requests list
  const [activeRequests, setActiveRequests] = useState([]);
  // Async data fetch loading indicator
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Populate active tracking data
    const timer = setTimeout(() => {
      setActiveRequests([
        {
          id: "REQ-2025-001",
          bloodType: "O-",
          quantity: 2,
          urgency: "Critical",
          status: "Pending",
          requestedAt: new Date(Date.now() - 1800000), // 30 minutes ago
          estimatedTime: "45 minutes",
          bloodBank: "Apollo Blood Bank",
          location: "Sector 18, Noida"
        },
        {
          id: "REQ-2025-002",
          bloodType: "A+",
          quantity: 1,
          urgency: "Urgent",
          status: "Approved",
          requestedAt: new Date(Date.now() - 3600000), // 1 hour ago
          estimatedTime: "Ready for pickup",
          bloodBank: "Max Healthcare Blood Center",
          location: "Sector 19, Noida"
        }
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Resolves badge color based on lifecycle stage.
   * @param {string} status - 'Pending' | 'Approved' | 'Declined' | 'Fulfilled'
   * @returns {string} Tailwind CSS classes.
   */
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'text-yellow-700 bg-yellow-100 border-yellow-300',
      'Approved': 'text-green-700 bg-green-100 border-green-300',
      'Declined': 'text-red-700 bg-red-100 border-red-300',
      'Fulfilled': 'text-blue-700 bg-blue-100 border-blue-300'
    };
    return colors?.[status] || 'text-gray-700 bg-gray-100 border-gray-300';
  };

  /**
   * Resolves urgency chip colors.
   * @param {string} urgency - 'Critical' | 'Urgent' | 'Normal'
   * @returns {string} Tailwind CSS classes.
   */
  const getUrgencyColor = (urgency) => {
    const colors = {
      'Critical': 'text-red-700 bg-red-100',
      'Urgent': 'text-orange-700 bg-orange-100',
      'Normal': 'text-blue-700 bg-blue-100'
    };
    return colors?.[urgency] || 'text-gray-700 bg-gray-100';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      {/* Header with Title & Active Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Active Requests</h3>
          <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
            {activeRequests?.length} Active
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/emergency-blood-request')}
          iconName="Plus"
          iconPosition="left"
        >
          New Request
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2]?.map(i => (
            <div key={i} className="h-28 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : activeRequests?.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <Icon name="Inbox" size={36} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No active blood requests at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeRequests?.map((request) => (
            <div
              key={request?.id}
              className="p-5 border border-border rounded-lg bg-surface hover:bg-muted/30 transition-medical"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-text-secondary">{request?.id}</span>
                  <span className="font-bold text-base text-primary bg-primary/10 px-2.5 py-0.5 rounded">
                    {request?.bloodType}
                  </span>
                  <span className="text-sm text-text-secondary">({request?.quantity} Units)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getUrgencyColor(request?.urgency)}`}>
                    {request?.urgency}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusColor(request?.status)}`}>
                    {request?.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
                <div className="flex items-center space-x-1.5">
                  <Icon name="Building2" size={14} />
                  <span>{request?.bloodBank} ({request?.location})</span>
                </div>
                <div className="flex items-center space-x-1.5 font-medium text-text-primary">
                  <Icon name="Clock" size={14} className="text-primary" />
                  <span>ETA: {request?.estimatedTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestStatusPanel;
