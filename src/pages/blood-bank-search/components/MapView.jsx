/**
 * @file MapView.jsx
 * @description Interactive geographic map integration for blood bank facilities.
 * Supports embedded Google Maps viewing, dynamic pin markers, active facility selection,
 * and quick viewport switching between user GPS location and regional hubs.
 */

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * MapView Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.bloodBanks - Facilities with latitude/longitude coordinates.
 * @param {Object|null} props.selectedBank - Currently highlighted facility.
 * @param {(bank: Object) => void} props.onBankSelect - Pin click selection callback.
 * @param {{ lat: number, lng: number }|null} props.userLocation - User coordinates.
 * @returns {JSX.Element} Interactive map view panel with facility listing.
 */
const MapView = ({ bloodBanks, selectedBank, onBankSelect, userLocation }) => {
  // Center coordinates of map
  const [mapCenter, setMapCenter] = useState({ lat: 25.4484, lng: 81.8534 }); // Default to Prayagraj
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('prayagraj'); // 'prayagraj' or 'user'

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      const isPrayagrajArea = userLocation?.lat >= 25.3 && 
                             userLocation?.lat <= 25.5 && 
                             userLocation?.lng >= 81.7 && 
                             userLocation?.lng <= 81.9;
      setCurrentView(isPrayagrajArea ? 'prayagraj' : 'user');
    }
    setIsLoading(false);
  }, [userLocation]);

  /**
   * Focuses on a specific facility marker.
   * @param {Object} bank - Blood bank facility.
   */
  const handleBankMarkerClick = (bank) => {
    onBankSelect(bank);
  };

  /**
   * Resolves map marker pin color based on facility availability.
   * @param {string} availabilityStatus - Stock level rating ('high'|'medium'|'low').
   * @returns {string} Marker color indicator.
   */
  const getMarkerColor = (availabilityStatus) => {
    switch (availabilityStatus) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  /**
   * Recenter viewport to default regional Prayagraj hub.
   */
  const switchToPrayagrajView = () => {
    setMapCenter({ lat: 25.4484, lng: 81.8534 });
    setCurrentView('prayagraj');
  };

  /**
   * Recenter viewport on user's current GPS position.
   */
  const switchToUserView = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setCurrentView('user');
    }
  };

  /**
   * Generates secure iframe URL for Google Maps embed.
   */
  const generateMapUrl = () => {
    return `https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden medical-shadow h-full flex flex-col">
      {/* Map Control Bar */}
      <div className="p-3 bg-card border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Map" size={16} className="text-primary" />
          <span className="text-xs font-semibold text-text-primary">Live Facility Map</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant={currentView === 'prayagraj' ? 'default' : 'outline'}
            size="xs"
            onClick={switchToPrayagrajView}
          >
            City View
          </Button>
          <Button
            variant={currentView === 'user' ? 'default' : 'outline'}
            size="xs"
            onClick={switchToUserView}
            disabled={!userLocation}
          >
            My Location
          </Button>
        </div>
      </div>

      {/* Embedded Map Frame */}
      <div className="relative flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <iframe
            title="Blood Bank Locations Map"
            src={generateMapUrl()}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        )}
      </div>

      {/* Nearby Facilities Quick Selection List */}
      <div className="p-3 border-t border-border bg-card max-h-48 overflow-y-auto divide-y divide-border">
        <div className="text-[11px] font-semibold text-text-secondary uppercase mb-1">
          Click to inspect facility ({bloodBanks?.length})
        </div>
        {bloodBanks?.map((bank) => (
          <button
            key={bank?.id}
            onClick={() => handleBankMarkerClick(bank)}
            className={`w-full text-left py-2 px-2 rounded flex items-center justify-between text-xs transition-medical ${
              selectedBank?.id === bank?.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted/50'
            }`}
          >
            <div className="truncate flex-1 pr-2">
              <div className="font-medium text-text-primary truncate">{bank?.name}</div>
              <div className="text-[11px] text-text-secondary">{bank?.distance} km away</div>
            </div>
            <Icon name="MapPin" size={14} className={getMarkerColor(bank?.availabilityStatus)} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapView;
