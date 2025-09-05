import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState('patient');
  const [locationStatus, setLocationStatus] = useState('inactive');
  const location = useLocation();

  useEffect(() => {
    // Mock notification data
    setNotifications([
      { id: 1, type: 'emergency', message: 'Emergency blood request - O- needed', priority: 'high' },
      { id: 2, type: 'inventory', message: 'Low inventory alert - A+ blood', priority: 'medium' }
    ]);

    // Mock location status
    setLocationStatus('active');
  }, []);

  const navigationItems = [
    {
      label: 'Emergency Request',
      path: '/emergency-blood-request',
      icon: 'AlertTriangle',
      priority: 'emergency'
    },
    {
      label: 'Find Blood Banks',
      path: '/blood-bank-search',
      icon: 'MapPin'
    },
    {
      label: 'My Dashboard',
      path: '/user-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Staff Portal',
      path: '/blood-bank-dashboard',
      icon: 'Building2',
      requiresAuth: true
    }
  ];

  const secondaryItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
    { label: 'Admin', path: '/admin', icon: 'Shield', requiresAuth: true }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleEmergencyClick = () => {
    window.location.href = '/emergency-blood-request';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'patient': 'Patient',
      'staff': 'Staff',
      'admin': 'Administrator'
    };
    return roleMap?.[role] || 'User';
  };

  const getLocationStatusIcon = () => {
    return locationStatus === 'active' ? 'MapPin' : 'MapPinOff';
  };

  const getLocationStatusColor = () => {
    return locationStatus === 'active' ? 'text-success' : 'text-warning';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border medical-shadow">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="Droplets" size={24} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-text-primary">BloodLink AI</h1>
                <p className="text-xs text-text-secondary">Emergency Blood Management</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.slice(0, 4)?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-medical ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : item?.priority === 'emergency' ?'text-error hover:bg-error/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Location Status Indicator */}
            <div className="hidden md:flex items-center space-x-1">
              <Icon 
                name={getLocationStatusIcon()} 
                size={16} 
                className={getLocationStatusColor()}
              />
              <span className="text-xs text-text-secondary">
                {locationStatus === 'active' ? 'Location Active' : 'Location Off'}
              </span>
            </div>

            {/* Role Indicator Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
              <Icon name="User" size={14} />
              <span className="text-xs font-medium text-text-primary">
                {getRoleDisplayName(userRole)}
              </span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button className="relative p-2 text-text-secondary hover:text-text-primary transition-medical">
                <Icon name="Bell" size={20} />
                {notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-error rounded-full">
                    {notifications?.length}
                  </span>
                )}
              </button>
            </div>

            {/* Emergency Access Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEmergencyClick}
              iconName="AlertTriangle"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Emergency
            </Button>

            {/* Mobile Emergency Button */}
            <Button
              variant="destructive"
              size="icon"
              onClick={handleEmergencyClick}
              className="sm:hidden"
            >
              <Icon name="AlertTriangle" size={18} />
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-medical"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-medical ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : item?.priority === 'emergency' ?'text-error hover:bg-error/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-border pt-2 mt-2">
                <div className="px-3 py-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  More Options
                </div>
                {secondaryItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-muted transition-medical"
                  >
                    <Icon name={item?.icon} size={20} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Role and Location Status */}
              <div className="border-t border-border pt-2 mt-2 px-3 py-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span className="text-text-primary">{getRoleDisplayName(userRole)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getLocationStatusIcon()} 
                      size={16} 
                      className={getLocationStatusColor()}
                    />
                    <span className="text-text-secondary">
                      {locationStatus === 'active' ? 'Location On' : 'Location Off'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;