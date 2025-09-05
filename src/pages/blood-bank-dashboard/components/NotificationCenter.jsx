import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ notifications, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }) => {
  const [filter, setFilter] = useState('all');

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

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'border-l-error bg-error/5';
    if (priority === 'medium') return 'border-l-warning bg-warning/5';
    if (type === 'emergency') return 'border-l-error bg-error/5';
    return 'border-l-primary bg-primary/5';
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification?.read;
    return notification?.type === filter;
  });

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <div className="bg-card rounded-lg border border-border medical-shadow">
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
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                iconName="CheckCheck"
                iconPosition="left"
                onClick={onMarkAllAsRead}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Icon name="BellOff" size={48} className="mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`px-6 py-4 border-l-4 transition-medical hover:bg-muted/30 ${getNotificationColor(notification?.type, notification?.priority)} ${
                  !notification?.read ? 'bg-opacity-100' : 'bg-opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      notification?.priority === 'high' ? 'bg-error/10 text-error' :
                      notification?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon name={getNotificationIcon(notification?.type)} size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium ${!notification?.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {notification?.title}
                        </h4>
                        {!notification?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${!notification?.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {notification?.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{notification?.timeAgo}</span>
                        </div>
                        {notification?.location && (
                          <div className="flex items-center space-x-1">
                            <Icon name="MapPin" size={12} />
                            <span>{notification?.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    {!notification?.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Check"
                        onClick={() => onMarkAsRead(notification?.id)}
                        className="text-xs"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="X"
                      onClick={() => onDeleteNotification(notification?.id)}
                      className="text-xs text-text-secondary hover:text-error"
                    />
                  </div>
                </div>
                
                {notification?.actions && notification?.actions?.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3 pl-11">
                    {notification?.actions?.map((action, index) => (
                      <Button
                        key={index}
                        variant={action?.variant || 'outline'}
                        size="sm"
                        iconName={action?.icon}
                        iconPosition="left"
                        onClick={() => action?.onClick(notification)}
                      >
                        {action?.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;