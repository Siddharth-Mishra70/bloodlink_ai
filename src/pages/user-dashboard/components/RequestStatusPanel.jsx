import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestStatusPanel = () => {
  const navigate = useNavigate();
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock active requests data
    setTimeout(() => {
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
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'text-yellow-700 bg-yellow-100 border-yellow-300',
      'Approved': 'text-green-700 bg-green-100 border-green-300',
      'Declined': 'text-red-700 bg-red-100 border-red-300',
      'Fulfilled': 'text-blue-700 bg-blue-100 border-blue-300'
    };
    return colors?.[status] || 'text-gray-700 bg-gray-100 border-gray-300';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'Critical': 'text-red-700 bg-red-100',
      'Urgent': 'text-orange-700 bg-orange-100',
      'Normal': 'text-blue-700 bg-blue-100'
    };
    return colors?.[urgency] || 'text-gray-700 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'Clock',
      'Approved': 'CheckCircle',
      'Declined': 'XCircle',
      'Fulfilled': 'Package'
    };
    return icons?.[status] || 'Circle';
  };

  const formatTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date?.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-spin">
            <Icon name="Loader2" size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Loading Request Status...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Icon name="Activity" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Active Requests</h3>
            <p className="text-sm text-gray-600">Real-time status updates</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 font-medium">Live Updates</span>
        </div>
      </div>
      {activeRequests?.length === 0 ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Active Requests</h4>
          <p className="text-sm text-gray-600 mb-4">You don't have any pending blood requests at the moment.</p>
          <Button
            variant="outline"
            onClick={() => navigate('/emergency-blood-request')}
            iconName="Plus"
            iconPosition="left"
          >
            Create New Request
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeRequests?.map((request) => (
            <div key={request?.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-medical">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                    <span className="text-sm font-bold text-red-700">{request?.bloodType}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Request #{request?.id}</h4>
                    <p className="text-sm text-gray-600">{request?.quantity} unit{request?.quantity > 1 ? 's' : ''} needed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request?.urgency)}`}>
                    {request?.urgency}
                  </span>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request?.status)}`}>
                    <Icon name={getStatusIcon(request?.status)} size={12} />
                    <span>{request?.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Building2" size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{request?.bloodBank}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{request?.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Requested {formatTimeAgo(request?.requestedAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Timer" size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{request?.estimatedTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                  >
                    View Details
                  </Button>
                  {request?.status === 'Pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="X"
                      iconPosition="left"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                {request?.status === 'Approved' && (
                  <div className="flex items-center space-x-2 text-green-700">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">Ready for pickup</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/user-dashboard')}
              iconName="History"
              iconPosition="left"
            >
              View All Request History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestStatusPanel;