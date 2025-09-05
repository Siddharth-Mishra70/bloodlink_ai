import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BloodAvailabilityPanel = ({ selectedBloodGroup, userLocation }) => {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Mock API call to fetch real-time blood availability
    const fetchAvailability = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const mockData = [
          {
            id: 'bb001',
            name: 'Apollo Blood Bank',
            address: 'Sector 26, Noida, UP 201301',
            distance: '2.3 km',
            phone: '+91 9876543210',
            availability: {
              'A+': 15, 'A-': 8, 'B+': 12, 'B-': 5,
              'AB+': 7, 'AB-': 3, 'O+': 20, 'O-': 6
            },
            status: 'available',
            responseTime: '15 mins',
            rating: 4.8
          },
          {
            id: 'bb002',
            name: 'Max Healthcare Blood Center',
            address: 'Sector 19, Noida, UP 201301',
            distance: '3.7 km',
            phone: '+91 9876543211',
            availability: {
              'A+': 8, 'A-': 4, 'B+': 10, 'B-': 2,
              'AB+': 5, 'AB-': 1, 'O+': 18, 'O-': 4
            },
            status: 'available',
            responseTime: '20 mins',
            rating: 4.6
          },
          {
            id: 'bb003',
            name: 'Fortis Blood Bank',
            address: 'Sector 62, Noida, UP 201309',
            distance: '5.1 km',
            phone: '+91 9876543212',
            availability: {
              'A+': 3, 'A-': 1, 'B+': 6, 'B-': 0,
              'AB+': 2, 'AB-': 0, 'O+': 12, 'O-': 2
            },
            status: 'low_stock',
            responseTime: '25 mins',
            rating: 4.4
          },
          {
            id: 'bb004',
            name: 'Kailash Hospital Blood Bank',
            address: 'Sector 27, Noida, UP 201301',
            distance: '4.2 km',
            phone: '+91 9876543213',
            availability: {
              'A+': 0, 'A-': 0, 'B+': 2, 'B-': 0,
              'AB+': 1, 'AB-': 0, 'O+': 5, 'O-': 0
            },
            status: 'critical',
            responseTime: '30 mins',
            rating: 4.2
          }
        ];

        setAvailabilityData(mockData);
        setLastUpdated(new Date());
        setIsLoading(false);
      }, 1500);
    };

    fetchAvailability();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchAvailability, 120000);
    return () => clearInterval(interval);
  }, [selectedBloodGroup, userLocation]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'low_stock': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'available': return 'bg-success/10 border-success/20';
      case 'low_stock': return 'bg-warning/10 border-warning/20';
      case 'critical': return 'bg-error/10 border-error/20';
      default: return 'bg-muted border-border';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'low_stock': return 'Low Stock';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  const getAvailabilityForBloodGroup = (bloodBank, bloodGroup) => {
    if (!bloodGroup) return 0;
    return bloodBank?.availability?.[bloodGroup] || 0;
  };

  const sortedBloodBanks = availabilityData?.sort((a, b) => {
    if (!selectedBloodGroup) return 0;
    
    const aUnits = getAvailabilityForBloodGroup(a, selectedBloodGroup);
    const bUnits = getAvailabilityForBloodGroup(b, selectedBloodGroup);
    
    // Sort by availability (descending), then by distance (ascending)
    if (aUnits !== bUnits) return bUnits - aUnits;
    return parseFloat(a?.distance) - parseFloat(b?.distance);
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const handleCallBloodBank = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg medical-shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading blood availability...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg medical-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="MapPin" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Real-time Availability</h2>
            <p className="text-sm text-text-secondary">
              Last updated: {lastUpdated?.toLocaleTimeString('en-IN')}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh
        </Button>
      </div>
      {!selectedBloodGroup ? (
        <div className="text-center py-8">
          <Icon name="Droplets" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">
            Select a blood group in the form to see real-time availability
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">
                Showing availability for: {selectedBloodGroup}
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              {sortedBloodBanks?.length} blood banks found
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedBloodBanks?.map((bloodBank) => {
              const availableUnits = getAvailabilityForBloodGroup(bloodBank, selectedBloodGroup);
              
              return (
                <div
                  key={bloodBank?.id}
                  className={`p-4 rounded-lg border transition-medical ${getStatusBg(bloodBank?.status)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-text-primary">{bloodBank?.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={12} className="text-warning fill-current" />
                          <span className="text-xs text-text-secondary">{bloodBank?.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{bloodBank?.address}</p>
                      <div className="flex items-center space-x-4 text-xs text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={12} />
                          <span>{bloodBank?.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{bloodBank?.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(bloodBank?.status)}`}>
                        <Icon 
                          name={bloodBank?.status === 'available' ? 'CheckCircle' : 
                                bloodBank?.status === 'low_stock' ? 'AlertTriangle' : 'XCircle'} 
                          size={12} 
                          className={getStatusColor(bloodBank?.status)}
                        />
                        <span className={getStatusColor(bloodBank?.status)}>
                          {getStatusText(bloodBank?.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Icon name="Droplets" size={16} className="text-primary" />
                        <span className="text-sm font-medium text-text-primary">
                          {availableUnits} units available
                        </span>
                      </div>
                      {availableUnits > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-success">
                          <Icon name="CheckCircle" size={12} />
                          <span>In Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant={availableUnits > 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCallBloodBank(bloodBank?.phone)}
                      iconName="Phone"
                      iconPosition="left"
                      disabled={availableUnits === 0}
                    >
                      Call Now
                    </Button>
                  </div>
                  {availableUnits === 0 && (
                    <div className="mt-3 p-2 bg-error/5 border border-error/20 rounded text-xs text-error">
                      <div className="flex items-center space-x-1">
                        <Icon name="AlertTriangle" size={12} />
                        <span>No units available. Consider alternative blood groups or contact directly.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodAvailabilityPanel;