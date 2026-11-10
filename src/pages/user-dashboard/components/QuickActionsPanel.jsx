/**
 * @file QuickActionsPanel.jsx
 * @description Quick action shortcut controls on the user dashboard.
 * Provides rapid access to Profile updates, Location adjustments,
 * Notification preference toggles, and Help/Support documentation.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * QuickActionsPanel Component
 *
 * @component
 * @returns {JSX.Element} Grid of quick administrative and profile actions.
 */
const QuickActionsPanel = () => {
  const navigate = useNavigate();

  // Notification preference flags
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyAlerts: true,
    shortageAlerts: true,
    donationReminders: false,
    requestUpdates: true
  });

  // Action items configuration
  const quickActions = [
    {
      id: 'find-banks',
      title: 'Find Blood Banks',
      description: 'Locate nearby inventory',
      icon: 'MapPin',
      color: 'blue',
      action: () => navigate('/blood-bank-search')
    },
    {
      id: 'emergency-request',
      title: 'Emergency Request',
      description: 'Request urgent blood units',
      icon: 'AlertTriangle',
      color: 'red',
      action: () => navigate('/emergency-blood-request')
    },
    {
      id: 'notification-settings',
      title: 'Notifications',
      description: 'Manage SMS & alerts',
      icon: 'Bell',
      color: 'purple',
      action: () => console.log('Toggle notifications')
    },
    {
      id: 'help-support',
      title: 'Help & FAQ',
      description: 'Transfusion guidelines',
      icon: 'HelpCircle',
      color: 'gray',
      action: () => console.log('Open Help')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions?.map((item) => (
          <button
            key={item?.id}
            onClick={item?.action}
            className="p-3 rounded-lg border border-border bg-surface hover:bg-muted/40 transition-medical text-left flex items-start space-x-3"
          >
            <div className="p-2 rounded bg-muted/50 mt-0.5">
              <Icon name={item?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary">{item?.title}</div>
              <div className="text-[11px] text-text-secondary">{item?.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;
