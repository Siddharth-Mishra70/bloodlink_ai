/**
 * @file EmergencyAccessCard.jsx
 * @description Urgent Action card on the user dashboard providing instant 1-click
 * navigation to the Emergency Request portal, nearest blood bank proximity, and live GPS location status.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * EmergencyAccessCard Component
 *
 * @component
 * @returns {JSX.Element} Emergency access card with nearest center info.
 */
const EmergencyAccessCard = () => {
  const navigate = useNavigate();

  // User detected physical location
  const [currentLocation, setCurrentLocation] = useState(null);
  // Nearest verified blood bank facility
  const [nearestBloodBank, setNearestBloodBank] = useState(null);
  // GPS sensor status ('loading' | 'active')
  const [locationStatus, setLocationStatus] = useState('loading');

  useEffect(() => {
    // Populate mock nearest facility coordinates
    const timer = setTimeout(() => {
      setCurrentLocation({
        address: "MG Marg, Civil Lines, Prayagraj, Uttar Pradesh",
        coordinates: { lat: 25.4358, lng: 81.8463 }
      });
      setNearestBloodBank({
        name: "Swaroop Rani Nehru (SRN) Hospital Blood Bank",
        distance: "1.2 km",
        availability: "Available",
        bloodTypes: ["A+", "B+", "O+", "O-", "AB+"]
      });
      setLocationStatus('active');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Fast-navigates directly to emergency request workflow.
   */
  const handleEmergencyRequest = () => {
    navigate('/emergency-blood-request');
  };

  /**
   * Refreshes GPS location coordinates.
   */
  const handleLocationUpdate = () => {
    setLocationStatus('loading');
    setTimeout(() => {
      setLocationStatus('active');
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 medical-shadow-lg">
      {/* Header with Title and Location Status */}
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

      {/* Location and Nearest Blood Center Details Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* User Location */}
        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-red-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Your Location</span>
            </div>
            <button
              onClick={handleLocationUpdate}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Update
            </button>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {currentLocation ? currentLocation?.address : 'Detecting location...'}
          </p>
        </div>

        {/* Nearest Facility */}
        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="Building2" size={16} className="text-red-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Nearest Center</span>
            </div>
            {nearestBloodBank && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                {nearestBloodBank?.distance}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-800">
            {nearestBloodBank ? nearestBloodBank?.name : 'Locating centers...'}
          </p>
        </div>
      </div>

      {/* Emergency Call-to-Action Action Button */}
      <Button
        variant="destructive"
        size="lg"
        onClick={handleEmergencyRequest}
        iconName="AlertTriangle"
        iconPosition="left"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 shadow-md"
      >
        Request Blood Immediately
      </Button>
    </div>
  );
};

export default EmergencyAccessCard;
