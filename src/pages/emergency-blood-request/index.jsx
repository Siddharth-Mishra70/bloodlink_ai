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

const EmergencyBloodRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    // Mock availability data
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

    // Get user location
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

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setSelectedBloodGroup(formData?.bloodGroup);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock request ID
      const mockRequestId = `ER${Date.now()?.toString()?.slice(-6)}`;
      setRequestId(mockRequestId);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Auto-redirect after 5 seconds
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

  const handleEmergencyCall = () => {
    window.open('tel:108', '_self');
  };

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
          {/* Emergency Header Banner */}
          <div className="bg-error text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertTriangle" size={24} />
                  <div>
                    <h1 className="text-lg font-semibold">Emergency Blood Request Portal</h1>
                    <p className="text-sm opacity-90">
                      For life-threatening emergencies, call 108 immediately
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleEmergencyCall}
                  iconName="Phone"
                  iconPosition="left"
                  className="border-white text-white hover:bg-white hover:text-error"
                >
                  Call 108
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <BloodRequestForm 
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                />
                
                {selectedBloodGroup && (
                  <LocationMapView 
                    hospitalAddress=""
                    nearbyBloodBanks={availabilityData}
                  />
                )}
              </div>

              {/* Right Column - Availability & Suggestions */}
              <div className="space-y-6">
                <BloodAvailabilityPanel 
                  selectedBloodGroup={selectedBloodGroup}
                  userLocation={userLocation}
                />
                
                {selectedBloodGroup && availabilityData?.length > 0 && (
                  <AlternativeBloodGroupSuggestions 
                    selectedBloodGroup={selectedBloodGroup}
                    availabilityData={availabilityData}
                  />
                )}
              </div>
            </div>

            {/* Emergency Guidelines */}
            <div className="mt-12 bg-card rounded-lg medical-shadow p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name="BookOpen" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">Emergency Guidelines</h2>
                  <p className="text-sm text-text-secondary">
                    Important information for emergency blood requests
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-primary" />
                    <h3 className="font-medium text-text-primary">Response Times</h3>
                  </div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Emergency: 5-15 minutes</li>
                    <li>• Urgent: 15-30 minutes</li>
                    <li>• Planned: 1-2 hours</li>
                    <li>• Confirmation via SMS/Call</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-primary" />
                    <h3 className="font-medium text-text-primary">Required Documents</h3>
                  </div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Patient ID proof</li>
                    <li>• Medical prescription</li>
                    <li>• Hospital admission letter</li>
                    <li>• Emergency contact details</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={16} className="text-primary" />
                    <h3 className="font-medium text-text-primary">Safety Protocols</h3>
                  </div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Blood type verification</li>
                    <li>• Cross-matching required</li>
                    <li>• Medical supervision needed</li>
                    <li>• Quality assurance checks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg medical-shadow p-6 max-w-md w-full">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Request Submitted Successfully!
                </h3>
                
                <p className="text-text-secondary mb-4">
                  Your emergency blood request has been sent to nearby blood banks. 
                  Request ID: <span className="font-mono font-medium text-primary">{requestId}</span>
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Blood Group:</span>
                    <span className="font-medium text-text-primary">{selectedBloodGroup}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Status:</span>
                    <span className="text-success font-medium">Processing</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Expected Response:</span>
                    <span className="font-medium text-text-primary">5-15 minutes</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="default"
                    fullWidth
                    onClick={handleGoToDashboard}
                    iconName="LayoutDashboard"
                    iconPosition="left"
                  >
                    Go to Dashboard
                  </Button>
                  
                  <p className="text-xs text-text-secondary">
                    You will be redirected automatically in a few seconds...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmergencyBloodRequest;