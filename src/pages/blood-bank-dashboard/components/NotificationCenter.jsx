/**
 * @file NotificationCenter.jsx
 * @description Centralized notification inbox for laboratory and hospital alerts.
 * Displays emergency transfusion requests, inventory shortage notices, and daily reports.
 * Allows filtering, marking items as read, and triggering quick inline resolution actions.
 */

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * NotificationCenter Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.notifications - Active notification records.
 * @param {(id: number) => void} props.onMarkAsRead - Mark single notification as read.
 * @param {() => void} props.onMarkAllAsRead - Acknowledge all notifications.
 * @param {(id: number) => void} props.onDeleteNotification - Delete notification item.
 * @returns {JSX.Element} Interactive notifications panel.
 */
const NotificationCenter = ({ notifications, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }) => {
  // Current filter status ('all' | 'unread' | 'emergency' | 'low_stock' | 'request')
  const [filter, setFilter] = useState('all');

  /**
   * Resolves Lucide icon name according to notification category.
   * @param {string} type - Notification category identifier.
   * @returns {string} Icon identifier.
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'emergency':
        return 'AlertTriangle';
      case 'low_stock':
        return 'Package';
      case 'request':
        return 'Clock';
      case 'system':
        return 'Settings';
      case 'donation':
        return 'Heart';
      default:
        return 'Bell';
    }
  };

  /**
   * Highlights high-priority notifications with color borders.
   * @param {string} type - Category.
   * @param {string} priority - Priority ranking.
   * @returns {string} Tailwind CSS classes.
   */
  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'border-l-error bg-error/5';
    if (priority === 'medium') return 'border-l-warning bg-warning/5';
    if (type === 'emergency') return 'border-l-error bg-error/5';
    return 'border-l-primary bg-primary/5';
  };

  // Filter notification records based on selected dropdown filter
  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification?.read;
    return notification?.type === filter;
  });

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <div className="bg-card rounded-lg border border-border medical-shadow">
      {/* Header with Title, Badge, and Filter Controls */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Bell" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error text-error-foreground">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="emergency">Emergency</option>
              <option value="low_stock">Low Stock</option>
              <option value="request">Requests</option>
            </select>

            {/* Mark All Read Button */}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List Body */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <Icon name="CheckCircle2" size={32} className="mx-auto mb-2 opacity-40 text-success" />
            <p className="text-sm">You're all caught up! No notifications.</p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 border-l-4 transition-medical ${getNotificationColor(notification?.type, notification?.priority)} ${
                !notification?.read ? 'bg-muted/30' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-surface shadow-xs mt-0.5">
                    <Icon name={getNotificationIcon(notification?.type)} size={16} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-text-primary">{notification?.title}</h4>
                      {!notification?.read && (
                        <span className="w-2 h-2 rounded-full bg-error"></span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{notification?.message}</p>
                    <div className="flex items-center space-x-3 mt-2 text-[11px] text-text-secondary">
                      <span>{notification?.timeAgo}</span>
                      {notification?.location && (
                        <span>• {notification?.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => onDeleteNotification?.(notification?.id)}
                  className="text-text-secondary hover:text-text-primary p-1"
                  aria-label="Dismiss notification"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>

              {/* Optional Quick Action Buttons */}
              {notification?.actions && notification?.actions?.length > 0 && (
                <div className="flex items-center gap-2 mt-3 ml-11">
                  {notification?.actions?.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={action?.variant || 'default'}
                      size="xs"
                      onClick={() => action?.onClick?.(notification)}
                      iconName={action?.icon}
                      iconPosition="left"
                    >
                      {action?.label}
                    </Button>
                  ))}
                  {!notification?.read && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onMarkAsRead?.(notification?.id)}
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
