import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationMapView = ({ hospitalAddress, nearbyBloodBanks }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.5355, lng: 77.3910 }); // Default to Noida
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Try to get user's current location
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

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setIsLocationEnabled(true);
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleDirections = (bankAddress) => {
    const encodedAddress = encodeURIComponent(bankAddress);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(directionsUrl, '_blank');
  };

  const mockBloodBanks = [
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
      lat: 28.5245,
      lng: 77.3678,
      distance: '3.7 km'
    },
    {
      id: 3,
      name: 'Fortis Blood Bank',
      address: 'Sector 62, Noida, UP 201309',
      lat: 28.6139,
      lng: 77.3673,
      distance: '5.1 km'
    }
  ];

  return (
    <div className="bg-card rounded-lg medical-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Map" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Location & Directions</h2>
            <p className="text-sm text-text-secondary">
              Find nearby blood banks and get directions
            </p>
          </div>
        </div>

        {!isLocationEnabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetLocation}
            iconName="MapPin"
            iconPosition="left"
          >
            Enable Location
          </Button>
        )}
      </div>
      {/* Map Container */}
      <div className="mb-6">
        <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Blood Banks Near You"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=14&output=embed`}
            className="border-0"
          />
          
          {/* Map Overlay Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button
              onClick={handleGetLocation}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-lg medical-shadow hover:bg-gray-50 transition-medical"
              title="Get Current Location"
            >
              <Icon name="Crosshair" size={16} className="text-primary" />
            </button>
          </div>

          {/* Location Status Indicator */}
          <div className="absolute bottom-4 left-4">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
              isLocationEnabled 
                ? 'bg-success/10 border border-success/20 text-success' :'bg-warning/10 border border-warning/20 text-warning'
            }`}>
              <Icon 
                name={isLocationEnabled ? "MapPin" : "MapPinOff"} 
                size={12} 
              />
              <span>
                {isLocationEnabled ? 'Location Active' : 'Location Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Hospital Location */}
      {hospitalAddress && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Building2" size={20} className="text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-1">Hospital Location</h3>
              <p className="text-sm text-text-secondary mb-3">{hospitalAddress}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDirections(hospitalAddress)}
                iconName="Navigation"
                iconPosition="left"
              >
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Nearby Blood Banks List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
          Nearby Blood Banks
        </h3>

        <div className="space-y-3">
          {mockBloodBanks?.map((bank) => (
            <div
              key={bank?.id}
              className="p-4 border border-border rounded-lg hover:border-primary/30 transition-medical"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mt-1">
                    <Icon name="MapPin" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1">{bank?.name}</h4>
                    <p className="text-sm text-text-secondary mb-2">{bank?.address}</p>
                    <div className="flex items-center space-x-4 text-xs text-text-secondary">
                      <div className="flex items-center space-x-1">
                        <Icon name="Navigation" size={12} />
                        <span>{bank?.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>15-20 mins</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDirections(bank?.address)}
                    iconName="Navigation"
                    iconPosition="left"
                  >
                    Directions
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => window.open(`tel:+919876543210`, '_self')}
                    iconName="Phone"
                    iconPosition="left"
                  >
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Instructions */}
      <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-error mb-1">Emergency Instructions:</p>
            <ul className="text-text-secondary space-y-1 text-xs">
              <li>• Call the blood bank before visiting to confirm availability</li>
              <li>• Carry patient ID, medical reports, and prescription</li>
              <li>• In critical emergencies, call 108 for ambulance services</li>
              <li>• Keep emergency contact numbers handy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMapView;