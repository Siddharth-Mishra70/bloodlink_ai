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
  // Map viewport center coordinate
  const [mapCenter, setMapCenter] = useState({ lat: 28.5355, lng: 77.3910 }); // Default to Noida
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

  const mockBloodBanks = nearbyBloodBanks || [
    {
      id: 1,
      name: 'Apollo Blood Bank',
      address: 'Sector 26, Noida, UP 201301',
      lat: 28.5355,
      lng: 77.3910,
      distance: '2.3 km'
    },
    {
      id: 2,
      name: 'Max Healthcare Blood Center',
      address: 'Sector 19, Noida, UP 201301',
      lat: 28.5700,
      lng: 77.3200,
      distance: '3.7 km'
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
