import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ bloodBanks, selectedBank, onBankSelect, userLocation }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 25.4484, lng: 81.8534 }); // Default to Prayagraj
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('prayagraj'); // 'prayagraj' or 'user'

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      // Check if user is in Prayagraj area (rough bounds)
      const isPrayagrajArea = userLocation?.lat >= 25.3 && 
                             userLocation?.lat <= 25.5 && 
                             userLocation?.lng >= 81.7 && 
                             userLocation?.lng <= 81.9;
      setCurrentView(isPrayagrajArea ? 'prayagraj' : 'user');
    }
    setIsLoading(false);
  }, [userLocation]);

  const handleBankMarkerClick = (bank) => {
    onBankSelect(bank);
  };

  const getMarkerColor = (availabilityStatus) => {
    switch (availabilityStatus) {
      case 'high': return 'green';
      case 'medium': return 'orange';
      case 'low': return 'red';
      default: return 'gray';
    }
  };

  const switchToPrayagrajView = () => {
    setMapCenter({ lat: 25.4484, lng: 81.8534 });
    setCurrentView('prayagraj');
  };

  const switchToUserView = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setCurrentView('user');
    }
  };

  const generateMapUrl = () => {
    // For demo purposes, we'll use a simple iframe embed focused on the current center
    return `https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`;
  };

  // Filter blood banks based on current view
  const getVisibleBloodBanks = () => {
    if (currentView === 'prayagraj') {
      return bloodBanks?.filter(bank => bank?.city === 'Prayagraj');
    }
    return bloodBanks;
  };

  const visibleBanks = getVisibleBloodBanks();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-2" />
          <p className="text-text-secondary">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">
            {currentView === 'prayagraj' ? 'Prayagraj Blood Banks' : 'Blood Banks Near You'}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === 'prayagraj' ? 'default' : 'outline'}
              size="xs"
              onClick={switchToPrayagrajView}
            >
              Prayagraj
            </Button>
            {userLocation && (
              <Button
                variant={currentView === 'user' ? 'default' : 'outline'}
                size="xs"
                onClick={switchToUserView}
              >
                Near Me
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-xs text-text-secondary">High Stock</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-xs text-text-secondary">Medium Stock</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-xs text-text-secondary">Low Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-full">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Blood Banks Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={generateMapUrl()}
          className="border-0"
        />

        {/* Map Overlay with Blood Bank Markers (Simulated) */}
        <div className="absolute inset-0 pointer-events-none">
          {visibleBanks?.slice(0, 8)?.map((bank, index) => {
            // Calculate marker positions based on blood bank coordinates
            // For Prayagraj view, use specific positioning
            let leftPos, topPos;
            if (currentView === 'prayagraj' && bank?.city === 'Prayagraj') {
              // Prayagraj-specific positioning
              switch (bank?.id) {
                case 6: leftPos = 45; topPos = 25; break; // SGPGI
                case 7: leftPos = 40; topPos = 45; break; // UIMS
                case 8: leftPos = 50; topPos = 30; break; // Government Hospital
                case 9: leftPos = 52; topPos = 35; break; // Red Cross
                case 10: leftPos = 48; topPos = 32; break; // Kamla Nehru
                default: leftPos = 30 + (index * 10); topPos = 25 + (index * 8);
              }
            } else {
              // General positioning for other views
              leftPos = 20 + (index * 12);
              topPos = 30 + (index * 8);
            }

            return (
              <div
                key={bank?.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleBankMarkerClick(bank)}
              >
                <div className={`relative ${selectedBank?.id === bank?.id ? 'scale-125' : ''} transition-transform`}>
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                    bank?.availabilityStatus === 'high' ? 'bg-success' :
                    bank?.availabilityStatus === 'medium' ? 'bg-warning' :
                    bank?.availabilityStatus === 'low' ? 'bg-error' : 'bg-muted'
                  }`}>
                    <Icon name="Droplets" size={12} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  {selectedBank?.id === bank?.id && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-3 shadow-lg min-w-48 z-10">
                      <h4 className="font-semibold text-text-primary text-sm mb-1">{bank?.name}</h4>
                      <p className="text-xs text-text-secondary mb-1">{bank?.distance} km away</p>
                      <p className="text-xs text-text-secondary mb-2">{bank?.city}</p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="default"
                          size="xs"
                          onClick={(e) => {
                            e?.stopPropagation();
                            // Handle request blood action
                          }}
                        >
                          Request
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={(e) => {
                            e?.stopPropagation();
                            window.open(`tel:${bank?.phone}`);
                          }}
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-card shadow-lg"
            onClick={() => {
              // Handle zoom in
            }}
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-card shadow-lg"
            onClick={() => {
              // Handle zoom out
            }}
          >
            <Icon name="Minus" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-card shadow-lg"
            onClick={switchToUserView}
            title="Center on your location"
          >
            <Icon name="Navigation" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-card shadow-lg"
            onClick={switchToPrayagrajView}
            title="View Prayagraj"
          >
            <Icon name="MapPin" size={16} />
          </Button>
        </div>

        {/* Results Counter */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">
                {visibleBanks?.length} blood banks found
                {currentView === 'prayagraj' && ' in Prayagraj'}
              </span>
            </div>
          </div>
        </div>

        {/* Prayagraj Info Panel */}
        {currentView === 'prayagraj' && (
          <div className="absolute top-4 left-4">
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg max-w-48">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="MapPin" size={14} className="text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-text-primary">Prayagraj, UP</span>
              </div>
              <p className="text-xs text-text-secondary">
                Historical city with {visibleBanks?.length} verified blood banks
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;