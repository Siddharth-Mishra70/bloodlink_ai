/**
 * @file LocationMapView.jsx
 * @description Location map view displaying the receiving hospital's location
 * and surrounding blood bank centers. Includes transit route directions integration.
 */

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * LocationMapView Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.hospitalAddress - Destination hospital address.
 * @param {Array<Object>} props.nearbyBloodBanks - Nearby facility coordinates.
 * @returns {JSX.Element} Map view with transit direction links.
 */
const LocationMapView = ({ hospitalAddress, nearbyBloodBanks }) => {
  // Map viewport center coordinate: Prayagraj, UP (25.4358° N, 81.8463° E)
  const [mapCenter, setMapCenter] = useState({ lat: 25.4358, lng: 81.8463 });
  // User geolocation state
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Attempt auto-resolving user GPS coordinates
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setIsLocationEnabled(true);
        },
        (error) => {
          console.log('Location access denied:', error);
          setIsLocationEnabled(false);
        }
      );
    }
  }, []);

  /**
   * Prompts user to refresh GPS location.
   */
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setIsLocationEnabled(true);
        },
        () => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  /**
   * Launches Google Maps turn-by-turn directions.
   * @param {string} bankAddress - Blood bank address.
   */
  const handleDirections = (bankAddress) => {
    const encodedAddress = encodeURIComponent(bankAddress);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(directionsUrl, '_blank');
  };

  const mockBloodBanks = nearbyBloodBanks && nearbyBloodBanks.length > 0 ? nearbyBloodBanks : [
    {
      id: 'bb-srn-01',
      name: 'Swaroop Rani Nehru (SRN) Hospital',
      address: 'MG Marg, George Town, Prayagraj, UP 211001',
      lat: 25.4484,
      lng: 81.8542,
      distance: '1.8 km'
    },
    {
      id: 'bb-jjh-02',
      name: 'Jeevan Jyoti Hospital Blood Bank',
      address: '162, Bai Ka Bagh, Lowther Road, Prayagraj, UP 211003',
      lat: 25.4312,
      lng: 81.8415,
      distance: '2.4 km'
    },
    {
      id: 'bb-tbs-03',
      name: 'Tej Bahadur Sapru (Beli) Hospital',
      address: 'Stanley Road, Teliarganj, Prayagraj, UP 211002',
      lat: 25.4630,
      lng: 81.8420,
      distance: '3.1 km'
    },
    {
      id: 'bb-naz-05',
      name: 'Nazareth Hospital Blood Bank',
      address: '13-A, Kamla Nehru Road, Civil Lines, Prayagraj, UP 211001',
      lat: 25.4510,
      lng: 81.8350,
      distance: '1.2 km'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden medical-shadow">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={18} className="text-primary" />
          <h3 className="font-semibold text-sm text-text-primary">Dispatch Route Map</h3>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleGetLocation}
          iconName="Crosshair"
          iconPosition="left"
        >
          {isLocationEnabled ? 'GPS Active' : 'Locate Me'}
        </Button>
      </div>

      {/* Embedded Map */}
      <div className="relative h-64 w-full bg-muted/40">
        <iframe
          title="Emergency Dispatch Map"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=13&output=embed`}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>

      {/* Nearby Centers Directions Strip */}
      <div className="p-4 bg-surface divide-y divide-border">
        <div className="text-xs font-semibold text-text-secondary uppercase mb-2">
          Nearby Transit Routes
        </div>
        {mockBloodBanks?.map((bank) => (
          <div key={bank?.id} className="py-2.5 flex items-center justify-between text-xs">
            <div>
              <div className="font-medium text-text-primary">{bank?.name}</div>
              <div className="text-text-secondary">{bank?.distance} away</div>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleDirections(bank?.address)}
              iconName="Navigation"
              iconPosition="left"
            >
              Directions
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationMapView;
