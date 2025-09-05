import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentRequestHistory = () => {
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock recent requests data
    setTimeout(() => {
      setRecentRequests([
        {
          id: "REQ-2024-156",
          bloodType: "B+",
          quantity: 1,
          urgency: "Normal",
          status: "Fulfilled",
          requestedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
          fulfilledAt: new Date(Date.now() - 86400000 * 2 + 3600000), // 2 days ago + 1 hour
          bloodBank: "Fortis Blood Center",
          location: "Sector 62, Noida",
          patientName: "Rajesh Kumar",
          hospitalName: "Fortis Hospital"
        },
        {
          id: "REQ-2024-142",
          bloodType: "O+",
          quantity: 2,
          urgency: "Urgent",
          status: "Fulfilled",
          requestedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
          fulfilledAt: new Date(Date.now() - 86400000 * 7 + 7200000), // 7 days ago + 2 hours
          bloodBank: "Max Healthcare Blood Center",
          location: "Sector 19, Noida",
          patientName: "Priya Sharma",
          hospitalName: "Max Super Speciality Hospital"
        },
        {
          id: "REQ-2024-128",
          bloodType: "A-",
          quantity: 1,
          urgency: "Critical",
          status: "Declined",
          requestedAt: new Date(Date.now() - 86400000 * 14), // 14 days ago
          bloodBank: "Apollo Blood Bank",
          location: "Sector 18, Noida",
          declineReason: "Blood type not available",
          alternativeProvided: "Referred to AIIMS Blood Bank"
        },
        {
          id: "REQ-2024-115",
          bloodType: "AB+",
          quantity: 1,
          urgency: "Normal",
          status: "Fulfilled",
          requestedAt: new Date(Date.now() - 86400000 * 21), // 21 days ago
          fulfilledAt: new Date(Date.now() - 86400000 * 21 + 1800000), // 21 days ago + 30 minutes
          bloodBank: "Kailash Hospital Blood Bank",
          location: "Sector 27, Noida",
          patientName: "Amit Singh",
          hospitalName: "Kailash Hospital"
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Fulfilled': 'text-green-700 bg-green-100 border-green-300',
      'Declined': 'text-red-700 bg-red-100 border-red-300',
      'Cancelled': 'text-gray-700 bg-gray-100 border-gray-300'
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
      'Fulfilled': 'CheckCircle',
      'Declined': 'XCircle',
      'Cancelled': 'MinusCircle'
    };
    return icons?.[status] || 'Circle';
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateFulfillmentTime = (requested, fulfilled) => {
    if (!fulfilled) return null;
    const diffMs = fulfilled?.getTime() - requested?.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-spin">
            <Icon name="Loader2" size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Loading Request History...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <Icon name="History" size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Requests</h3>
            <p className="text-sm text-gray-600">Your blood request history</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          Export
        </Button>
      </div>
      <div className="space-y-4">
        {recentRequests?.map((request) => (
          <div key={request?.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-medical">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                  <span className="text-sm font-bold text-red-700">{request?.bloodType}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Request #{request?.id}</h4>
                  <p className="text-sm text-gray-600">{request?.quantity} unit{request?.quantity > 1 ? 's' : ''} • {formatDate(request?.requestedAt)}</p>
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

            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <div className="flex items-center space-x-2">
                <Icon name="Building2" size={14} className="text-gray-500" />
                <span className="text-sm text-gray-700">{request?.bloodBank}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} className="text-gray-500" />
                <span className="text-sm text-gray-700">{request?.location}</span>
              </div>
              {request?.patientName && (
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{request?.patientName}</span>
                </div>
              )}
              {request?.hospitalName && (
                <div className="flex items-center space-x-2">
                  <Icon name="Hospital" size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{request?.hospitalName}</span>
                </div>
              )}
            </div>

            {request?.status === 'Fulfilled' && request?.fulfilledAt && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">Successfully Fulfilled</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-700">Fulfilled on {formatDate(request?.fulfilledAt)}</p>
                    <p className="text-xs text-green-600">Response time: {calculateFulfillmentTime(request?.requestedAt, request?.fulfilledAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {request?.status === 'Declined' && request?.declineReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <Icon name="XCircle" size={16} className="text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Request Declined</p>
                    <p className="text-xs text-red-700 mb-1">Reason: {request?.declineReason}</p>
                    {request?.alternativeProvided && (
                      <p className="text-xs text-red-600">Alternative: {request?.alternativeProvided}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500">
                <Icon name="Clock" size={14} />
                <span className="text-xs">Requested at {formatTime(request?.requestedAt)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                className="text-gray-600 hover:text-gray-800"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <Button
          variant="outline"
          iconName="MoreHorizontal"
          iconPosition="left"
        >
          Load More History
        </Button>
      </div>
    </div>
  );
};

export default RecentRequestHistory;