import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import InventoryTable from './components/InventoryTable';
import ActiveRequestsPanel from './components/ActiveRequestsPanel';
import QuickStatsCards from './components/QuickStatsCards';
import AIForecastPanel from './components/AIForecastPanel';
import NotificationCenter from './components/NotificationCenter';

const BloodBankDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for blood inventory
  const [inventoryData] = useState([
    {
      id: 1,
      bloodGroup: 'A+',
      rhFactor: 'Positive',
      currentStock: 45,
      minimumRequired: 50,
      nextExpiry: '15/09/2025',
      daysUntilExpiry: 10,
      lastUpdated: '05/09/2025 14:30',
      updatedBy: 'Dr. Sharma'
    },
    {
      id: 2,
      bloodGroup: 'O-',
      rhFactor: 'Negative',
      currentStock: 12,
      minimumRequired: 40,
      nextExpiry: '08/09/2025',
      daysUntilExpiry: 3,
      lastUpdated: '05/09/2025 12:15',
      updatedBy: 'Nurse Patel'
    },
    {
      id: 3,
      bloodGroup: 'B+',
      rhFactor: 'Positive',
      currentStock: 78,
      minimumRequired: 35,
      nextExpiry: '20/09/2025',
      daysUntilExpiry: 15,
      lastUpdated: '05/09/2025 16:45',
      updatedBy: 'Lab Tech Kumar'
    },
    {
      id: 4,
      bloodGroup: 'AB+',
      rhFactor: 'Positive',
      currentStock: 23,
      minimumRequired: 25,
      nextExpiry: '12/09/2025',
      daysUntilExpiry: 7,
      lastUpdated: '05/09/2025 11:20',
      updatedBy: 'Dr. Singh'
    },
    {
      id: 5,
      bloodGroup: 'A-',
      rhFactor: 'Negative',
      currentStock: 8,
      minimumRequired: 30,
      nextExpiry: '07/09/2025',
      daysUntilExpiry: 2,
      lastUpdated: '05/09/2025 09:30',
      updatedBy: 'Nurse Gupta'
    },
    {
      id: 6,
      bloodGroup: 'O+',
      rhFactor: 'Positive',
      currentStock: 92,
      minimumRequired: 60,
      nextExpiry: '25/09/2025',
      daysUntilExpiry: 20,
      lastUpdated: '05/09/2025 15:10',
      updatedBy: 'Dr. Verma'
    }
  ]);

  // Mock data for active requests
  const [activeRequests] = useState([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      patientAge: 45,
      bloodGroup: 'O-',
      quantity: 3,
      urgency: 'Critical',
      hospital: 'Apollo Hospital',
      contactNumber: '+91 98765 43210',
      requestTime: new Date(Date.now() - 900000),
      timeAgo: '15 minutes ago',
      timeAgoMinutes: 15,
      distance: '2.3 km away',
      notes: 'Emergency surgery required. Patient is in critical condition.'
    },
    {
      id: 2,
      patientName: 'Priya Sharma',
      patientAge: 32,
      bloodGroup: 'A+',
      quantity: 2,
      urgency: 'Urgent',
      hospital: 'Max Healthcare',
      contactNumber: '+91 87654 32109',
      requestTime: new Date(Date.now() - 1800000),
      timeAgo: '30 minutes ago',
      timeAgoMinutes: 30,
      distance: '1.8 km away',
      notes: 'Scheduled surgery tomorrow morning.'
    },
    {
      id: 3,
      patientName: 'Amit Patel',
      patientAge: 28,
      bloodGroup: 'B+',
      quantity: 1,
      urgency: 'Normal',
      hospital: 'Fortis Hospital',
      contactNumber: '+91 76543 21098',
      requestTime: new Date(Date.now() - 3600000),
      timeAgo: '1 hour ago',
      timeAgoMinutes: 60,
      distance: '4.1 km away',
      notes: 'Regular transfusion for thalassemia patient.'
    }
  ]);

  // Mock data for quick stats
  const [quickStats] = useState([
    {
      id: 1,
      type: 'total',
      label: 'Total Blood Units',
      value: '258',
      change: { type: 'increase', value: '+12%' },
      details: { label: 'Available Types', value: '8/8' }
    },
    {
      id: 2,
      type: 'low',
      label: 'Low Stock Alerts',
      value: '3',
      change: { type: 'increase', value: '+2' },
      details: { label: 'Critical', value: '1' }
    },
    {
      id: 3,
      type: 'requests',
      label: 'Active Requests',
      value: '7',
      change: { type: 'decrease', value: '-3' },
      details: { label: 'Emergency', value: '2' }
    },
    {
      id: 4,
      type: 'critical',
      label: 'Expiring Soon',
      value: '5',
      change: { type: 'increase', value: '+1' },
      details: { label: 'Next 3 days', value: '2' }
    }
  ]);

  // Mock data for AI forecast
  const [forecastData] = useState({
    bloodGroups: [
      { type: 'O-', current: 12, predicted: 25, confidence: 87, status: 'shortage' },
      { type: 'A-', current: 8, predicted: 18, confidence: 92, status: 'shortage' },
      { type: 'A+', current: 45, predicted: 35, confidence: 78, status: 'good' },
      { type: 'B+', current: 78, predicted: 40, confidence: 85, status: 'good' },
      { type: 'AB+', current: 23, predicted: 28, confidence: 73, status: 'low' },
      { type: 'O+', current: 92, predicted: 55, confidence: 89, status: 'good' }
    ],
    recommendations: [
      {
        id: 1,
        title: 'Critical O- Blood Shortage Predicted',
        description: 'AI models predict a critical shortage of O- blood within the next 3 days. Immediate action required to prevent emergency situations.',
        priority: 'High',
        icon: 'AlertTriangle',
        deadline: '08/09/2025',
        impact: 'High Risk'
      },
      {
        id: 2,
        title: 'Increase A- Blood Collection',
        description: 'Current A- stock is below optimal levels. Recommend organizing donation drives in nearby areas.',
        priority: 'Medium',
        icon: 'TrendingUp',
        deadline: '10/09/2025',
        impact: 'Medium Risk'
      },
      {
        id: 3,
        title: 'Optimize B+ Distribution',
        description: 'B+ blood stock is above average. Consider redistributing to nearby blood banks with shortages.',
        priority: 'Low',
        icon: 'ArrowRightLeft',
        deadline: '15/09/2025',
        impact: 'Low Risk'
      }
    ]
  });

  // Mock data for demand predictions chart
  const [demandPredictions] = useState([
    { date: '06/09', predicted: 45, current: 42 },
    { date: '07/09', predicted: 52, current: 38 },
    { date: '08/09', predicted: 48, current: 35 },
    { date: '09/09', predicted: 55, current: 32 },
    { date: '10/09', predicted: 42, current: 28 },
    { date: '11/09', predicted: 38, current: 25 },
    { date: '12/09', predicted: 46, current: 22 }
  ]);

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'emergency',
      priority: 'high',
      title: 'Critical Blood Request',
      message: 'Emergency O- blood request from Apollo Hospital. Patient in critical condition.',
      timeAgo: '5 minutes ago',
      read: false,
      location: 'Apollo Hospital',
      actions: [
        { label: 'Approve', variant: 'success', icon: 'Check', onClick: (n) => console.log('Approve', n) },
        { label: 'View Details', variant: 'outline', icon: 'Eye', onClick: (n) => console.log('View', n) }
      ]
    },
    {
      id: 2,
      type: 'low_stock',
      priority: 'medium',
      title: 'Low Stock Alert',
      message: 'A- blood stock has fallen below minimum threshold (8/30 units remaining).',
      timeAgo: '15 minutes ago',
      read: false,
      actions: [
        { label: 'Update Stock', variant: 'default', icon: 'Plus', onClick: (n) => console.log('Update', n) }
      ]
    },
    {
      id: 3,
      type: 'request',
      priority: 'low',
      title: 'New Blood Request',
      message: 'Regular transfusion request for B+ blood from Fortis Hospital.',
      timeAgo: '1 hour ago',
      read: true,
      location: 'Fortis Hospital'
    },
    {
      id: 4,
      type: 'system',
      priority: 'low',
      title: 'Daily Report Generated',
      message: 'Your daily inventory report has been generated and is ready for download.',
      timeAgo: '2 hours ago',
      read: true,
      actions: [
        { label: 'Download', variant: 'outline', icon: 'Download', onClick: (n) => console.log('Download', n) }
      ]
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const handleUpdateStock = (item = null) => {
    console.log('Update stock for:', item);
    // Handle stock update logic
  };

  const handleViewDetails = (item) => {
    console.log('View details for:', item);
    // Handle view details logic
  };

  const handleApproveRequest = (request) => {
    console.log('Approve request:', request);
    // Handle request approval logic
  };

  const handleDeclineRequest = (request) => {
    console.log('Decline request:', request);
    // Handle request decline logic
  };

  const handleViewRequest = (request) => {
    console.log('View request details:', request);
    // Handle view request details logic
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => n?.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  const handleEmergencyAlert = () => {
    console.log('Emergency alert activated');
    // Handle emergency alert logic
  };

  const handleGenerateReport = () => {
    console.log('Generate report');
    // Handle report generation logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blood Bank Dashboard - BloodLink AI</title>
        <meta name="description" content="Comprehensive blood bank management dashboard for inventory tracking, request processing, and AI-powered demand forecasting." />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Blood Bank Dashboard</h1>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={16} />
                    <span>Last updated: {currentTime?.toLocaleTimeString('en-IN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={16} />
                    <span>{currentTime?.toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>System Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </Button>
                <Button
                  variant="destructive"
                  iconName="AlertTriangle"
                  iconPosition="left"
                  onClick={handleEmergencyAlert}
                >
                  Emergency Alert
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <QuickStatsCards stats={quickStats} />
          </div>

          {/* View Toggle */}
          <div className="mb-6">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
                { id: 'inventory', label: 'Inventory', icon: 'Package' },
                { id: 'requests', label: 'Requests', icon: 'Clock' },
                { id: 'forecast', label: 'AI Forecast', icon: 'Brain' },
                { id: 'notifications', label: 'Notifications', icon: 'Bell' }
              ]?.map((view) => (
                <button
                  key={view?.id}
                  onClick={() => setSelectedView(view?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-medical ${
                    selectedView === view?.id
                      ? 'bg-card text-text-primary medical-shadow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name={view?.icon} size={16} />
                  <span>{view?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {selectedView === 'overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  <InventoryTable
                    inventoryData={inventoryData}
                    onUpdateStock={handleUpdateStock}
                    onViewDetails={handleViewDetails}
                  />
                  <AIForecastPanel
                    forecastData={forecastData}
                    demandPredictions={demandPredictions}
                  />
                </div>
                <div className="space-y-8">
                  <ActiveRequestsPanel
                    requests={activeRequests}
                    onApproveRequest={handleApproveRequest}
                    onDeclineRequest={handleDeclineRequest}
                    onViewRequest={handleViewRequest}
                  />
                  <NotificationCenter
                    notifications={notifications?.slice(0, 3)}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onDeleteNotification={handleDeleteNotification}
                  />
                </div>
              </div>
            )}

            {selectedView === 'inventory' && (
              <InventoryTable
                inventoryData={inventoryData}
                onUpdateStock={handleUpdateStock}
                onViewDetails={handleViewDetails}
              />
            )}

            {selectedView === 'requests' && (
              <ActiveRequestsPanel
                requests={activeRequests}
                onApproveRequest={handleApproveRequest}
                onDeclineRequest={handleDeclineRequest}
                onViewRequest={handleViewRequest}
              />
            )}

            {selectedView === 'forecast' && (
              <AIForecastPanel
                forecastData={forecastData}
                demandPredictions={demandPredictions}
              />
            )}

            {selectedView === 'notifications' && (
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDeleteNotification={handleDeleteNotification}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BloodBankDashboard;