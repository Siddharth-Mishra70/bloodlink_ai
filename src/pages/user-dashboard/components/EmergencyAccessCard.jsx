import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyAccessCard = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestBloodBank, setNearestBloodBank] = useState(null);
  const [locationStatus, setLocationStatus] = useState('loading');

  useEffect(() => {
    // Mock location data
    setTimeout(() => {
      setCurrentLocation({
        address: "Sector 18, Noida, Uttar Pradesh",
        coordinates: { lat: 28.5706, lng: 77.3272 }
      });
      setNearestBloodBank({
        name: "Apollo Blood Bank",
        distance: "1.2 km",
        availability: "Available",
        bloodTypes: ["A+", "B+", "O+", "AB+"]
      });
      setLocationStatus('active');
    }, 1000);
  }, []);

  const handleEmergencyRequest = () => {
    navigate('/emergency-blood-request');
  };

  const handleLocationUpdate = () => {
    setLocationStatus('loading');
    setTimeout(() => {
      setLocationStatus('active');
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 medical-shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full">
            <Icon name="AlertTriangle" size={24} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-800">Emergency Access</h2>
            <p className="text-sm text-red-600">24/7 Blood Request Service</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-3 h-3 rounded-full ${locationStatus === 'active' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
          <span className="text-xs text-red-700 font-medium">
            {locationStatus === 'active' ? 'Location Active' : 'Updating...'}
          </span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MapPin" size={16} className="text-red-600" />
            <span className="text-sm font-medium text-gray-800">Current Location</span>
          </div>
          {currentLocation ? (
            <div>
              <p className="text-sm text-gray-700 mb-2">{currentLocation?.address}</p>
              <Button
                variant="outline"
                size="xs"
                onClick={handleLocationUpdate}
                iconName="RefreshCw"
                iconPosition="left"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Update Location
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} className="text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Detecting location...</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Building2" size={16} className="text-red-600" />
            <span className="text-sm font-medium text-gray-800">Nearest Blood Bank</span>
          </div>
          {nearestBloodBank ? (
            <div>
              <p className="text-sm font-medium text-gray-800">{nearestBloodBank?.name}</p>
              <p className="text-xs text-gray-600 mb-2">{nearestBloodBank?.distance} away</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-700 font-medium">{nearestBloodBank?.availability}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} className="text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Finding nearest...</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEmergencyRequest}
          iconName="Phone"
          iconPosition="left"
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4"
        >
          Request Emergency Blood
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/blood-bank-search')}
          iconName="Search"
          iconPosition="left"
          className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
        >
          Find Blood Banks
        </Button>
      </div>
      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-red-600 mt-0.5" />
          <div>
            <p className="text-xs text-red-800 font-medium">Emergency Protocol</p>
            <p className="text-xs text-red-700">
              In critical situations, call 108 for ambulance services. Our system will automatically notify nearby blood banks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccessCard;