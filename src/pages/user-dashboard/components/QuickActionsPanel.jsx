import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = () => {
  const navigate = useNavigate();
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyAlerts: true,
    shortageAlerts: true,
    donationReminders: false,
    requestUpdates: true
  });

  const quickActions = [
    {
      id: 'update-profile',
      title: 'Update Profile',
      description: 'Manage your personal information',
      icon: 'User',
      color: 'blue',
      action: () => navigate('/user-profile')
    },
    {
      id: 'change-location',
      title: 'Change Location',
      description: 'Update your current location',
      icon: 'MapPin',
      color: 'green',
      action: () => handleLocationUpdate()
    },
    {
      id: 'notification-settings',
      title: 'Notifications',
      description: 'Manage alert preferences',
      icon: 'Bell',
      color: 'purple',
      action: () => handleNotificationToggle()
    },
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      description: 'Manage emergency contacts',
      icon: 'Phone',
      color: 'red',
      action: () => navigate('/emergency-contacts')
    },
    {
      id: 'medical-history',
      title: 'Medical History',
      description: 'View and update medical records',
      icon: 'FileText',
      color: 'orange',
      action: () => navigate('/medical-history')
    },
    {
      id: 'help-support',
      title: 'Help & Support',
      description: 'Get help or contact support',
      icon: 'HelpCircle',
      color: 'gray',
      action: () => navigate('/help')
    }
  ];

  const handleLocationUpdate = () => {
    // Mock location update
    alert('Location update feature will be implemented with GPS integration');
  };

  const handleNotificationToggle = () => {
    // Mock notification settings
    alert('Notification settings panel will open here');
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      green: 'bg-green-100 text-green-700 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      red: 'bg-red-100 text-red-700 hover:bg-red-200',
      orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    };
    return colorMap?.[color] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
          <Icon name="Zap" size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            className={`p-4 rounded-lg border border-gray-200 transition-medical text-left hover:border-gray-300 ${getColorClasses(action?.color)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                <Icon name={action?.icon} size={16} className="text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 mb-1">{action?.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{action?.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Notification Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-800">Notification Status</h4>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            onClick={handleNotificationToggle}
          >
            Manage
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(notificationSettings)?.map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-700 capitalize">
                  {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                </span>
              </div>
              <span className={`text-xs font-medium ${enabled ? 'text-green-700' : 'text-gray-500'}`}>
                {enabled ? 'ON' : 'OFF'}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* System Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-800">System Status</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Wifi" size={14} className="text-green-600" />
              <span className="text-xs text-gray-600">Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={14} className="text-green-600" />
              <span className="text-xs text-gray-600">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;