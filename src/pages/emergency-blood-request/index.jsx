/**
 * @file index.jsx
 * @description Emergency Blood Request Portal page for BloodLink AI.
 * Enables patients, hospitals, and emergency responders to broadcast immediate, life-saving
 * blood requisitions, view real-time compatible blood availability, review AI triage recommendations,
 * and track automated dispatch notifications.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BloodRequestForm from './components/BloodRequestForm';
import BloodAvailabilityPanel from './components/BloodAvailabilityPanel';
import AlternativeBloodGroupSuggestions from './components/AlternativeBloodGroupSuggestions';
import LocationMapView from './components/LocationMapView';

/**
 * EmergencyBloodRequest Component
 *
 * @component
 * @returns {JSX.Element} Emergency blood request portal.
 */
const EmergencyBloodRequest = () => {
  const navigate = useNavigate();

  // Async submission status flag
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Blood group currently selected in the request form
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  // User GPS coordinates
  const [userLocation, setUserLocation] = useState(null);
  // Real-time stock counts at regional blood banks
  const [availabilityData, setAvailabilityData] = useState([]);
  // Success dialog modal visibility flag
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Generated emergency request tracking code
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    // Simulated regional inventory data
    const mockAvailabilityData = [
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
      }
    ];

    setAvailabilityData(mockAvailabilityData);

    // Resolve user geolocation coordinates
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  /**
   * Transmits patient emergency requisition to the dispatch network.
   * @param {Object} formData - Validated form parameters.
   */
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setSelectedBloodGroup(formData?.bloodGroup);

    try {
      // Simulate API network transmission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate tracking requisition code
      const mockRequestId = `ER${Date.now()?.toString()?.slice(-6)}`;
      setRequestId(mockRequestId);
      
      // Reveal confirmation modal
      setShowSuccessModal(true);
      
      // Auto-navigate to user dashboard after 5 seconds
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Fast-dials India emergency ambulance hotline (108).
   */
  const handleEmergencyCall = () => {
    window.open('tel:108', '_self');
  };

  /**
   * Immediate navigation to user dashboard.
   */
  const handleGoToDashboard = () => {
    navigate('/user-dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Emergency Blood Request - BloodLink AI</title>
        <meta name="description" content="Submit urgent blood requests and connect with nearby blood banks instantly. AI-powered emergency blood management system." />
        <meta name="keywords" content="emergency blood request, blood bank, urgent blood, blood donation, medical emergency" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Critical Emergency Banner */}
          <div className="bg-error text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertTriangle" size={24} />
                  <div>
                    <h1 className="text-lg font-semibold">Emergency Blood Request Portal</h1>
                    <p className="text-sm opacity-90">
                      For immediate life-threatening trauma, dial 108 immediately
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleEmergencyCall}
                  iconName="Phone"
                  iconPosition="left"
                  className="bg-white text-error hover:bg-white/90 border-transparent font-bold"
                >
                  Call 108
                </Button>
              </div>
            </div>
          </div>

          {/* Main Emergency Workspace Layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Columns: Requisition Form & Compatibility Engine */}
              <div className="lg:col-span-2 space-y-8">
                <BloodRequestForm
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                />

                <AlternativeBloodGroupSuggestions
                  selectedBloodGroup={selectedBloodGroup}
                  availabilityData={availabilityData}
                />
              </div>

              {/* Right Column: Live Availability & Dispatch Map */}
              <div className="space-y-8">
                <BloodAvailabilityPanel
                  selectedBloodGroup={selectedBloodGroup}
                  userLocation={userLocation}
                />

                <LocationMapView
                  nearbyBloodBanks={availabilityData}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Successful Dispatch Confirmation Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full medical-shadow text-center animate-scaleIn">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 text-success">
                <Icon name="CheckCircle2" size={36} />
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2">Emergency Request Broadcasted</h3>
              <p className="text-sm text-text-secondary mb-4">
                Your request has been dispatched to 3 nearby blood banks and on-call eligible donors.
              </p>

              <div className="p-3 bg-muted rounded-lg font-mono text-sm font-bold text-primary mb-6">
                Tracking ID: {requestId}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="default"
                  onClick={handleGoToDashboard}
                  className="flex-1"
                >
                  View in Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Close
                </Button>
              </div>

              <p className="text-xs text-text-secondary mt-4 opacity-75">
                Auto-redirecting to dashboard in a few seconds...
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmergencyBloodRequest;
