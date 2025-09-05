import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';

import Button from '../../components/ui/Button';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import MapView from './components/MapView';
import MobileTabView from './components/MobileTabView';

const BloodBankSearch = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    location: '',
    bloodGroups: [],
    maxDistance: 10,
    emergencyOnly: false,
    openNow: false,
    verifiedOnly: false
  });

  // Mock blood bank data
  const mockBloodBanks = [
    // Existing Delhi/NCR blood banks
    {
      id: 1,
      name: "Apollo Blood Bank",
      address: "Sector 26, Noida, Uttar Pradesh",
      pinCode: "201301",
      distance: 2.3,
      phone: "+91-9876543210",
      rating: 4.8,
      reviewCount: 245,
      responseTime: 15,
      availabilityStatus: 'high',
      isVerified: true,
      certifications: ["NABH", "ISO 9001"],
      operatingHours: {
        isOpen: true,
        current: "24/7",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 25 },
        { type: 'A-', units: 8 },
        { type: 'B+', units: 18 },
        { type: 'B-', units: 5 },
        { type: 'AB+', units: 12 },
        { type: 'AB-', units: 3 },
        { type: 'O+', units: 30 },
        { type: 'O-', units: 7 }
      ],
      coordinates: { lat: 28.5355, lng: 77.3910 },
      city: "Delhi NCR"
    },
    {
      id: 2,
      name: "Max Healthcare Blood Centre",
      address: "Saket, New Delhi",
      pinCode: "110017",
      distance: 5.7,
      phone: "+91-9876543211",
      rating: 4.6,
      reviewCount: 189,
      responseTime: 20,
      availabilityStatus: 'medium',
      isVerified: true,
      certifications: ["NABH", "CAP"],
      operatingHours: {
        isOpen: true,
        current: "6:00 AM - 10:00 PM",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 15 },
        { type: 'A-', units: 4 },
        { type: 'B+', units: 12 },
        { type: 'B-', units: 2 },
        { type: 'AB+', units: 8 },
        { type: 'AB-', units: 1 },
        { type: 'O+', units: 20 },
        { type: 'O-', units: 3 }
      ],
      coordinates: { lat: 28.5244, lng: 77.2066 },
      city: "Delhi NCR"
    },
    {
      id: 3,
      name: "Fortis Blood Bank",
      address: "Vasant Kunj, New Delhi",
      pinCode: "110070",
      distance: 8.2,
      phone: "+91-9876543212",
      rating: 4.4,
      reviewCount: 156,
      responseTime: 25,
      availabilityStatus: 'low',
      isVerified: true,
      certifications: ["NABH"],
      operatingHours: {
        isOpen: false,
        current: "Closed",
        opensAt: "8:00 AM"
      },
      bloodGroups: [
        { type: 'A+', units: 8 },
        { type: 'A-', units: 1 },
        { type: 'B+', units: 6 },
        { type: 'B-', units: 0 },
        { type: 'AB+', units: 4 },
        { type: 'AB-', units: 0 },
        { type: 'O+', units: 10 },
        { type: 'O-', units: 1 }
      ],
      coordinates: { lat: 28.5167, lng: 77.1500 },
      city: "Delhi NCR"
    },
    {
      id: 4,
      name: "AIIMS Blood Bank",
      address: "Ansari Nagar, New Delhi",
      pinCode: "110029",
      distance: 12.5,
      phone: "+91-9876543213",
      rating: 4.9,
      reviewCount: 412,
      responseTime: 10,
      availabilityStatus: 'high',
      isVerified: true,
      certifications: ["NABH", "ISO 9001", "CAP"],
      operatingHours: {
        isOpen: true,
        current: "24/7",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 35 },
        { type: 'A-', units: 12 },
        { type: 'B+', units: 28 },
        { type: 'B-', units: 8 },
        { type: 'AB+', units: 15 },
        { type: 'AB-', units: 5 },
        { type: 'O+', units: 40 },
        { type: 'O-', units: 10 }
      ],
      coordinates: { lat: 28.5672, lng: 77.2100 },
      city: "Delhi NCR"
    },
    {
      id: 5,
      name: "Red Cross Blood Bank",
      address: "Connaught Place, New Delhi",
      pinCode: "110001",
      distance: 15.3,
      phone: "+91-9876543214",
      rating: 4.2,
      reviewCount: 98,
      responseTime: 30,
      availabilityStatus: 'medium',
      isVerified: false,
      certifications: ["ISO 9001"],
      operatingHours: {
        isOpen: true,
        current: "9:00 AM - 6:00 PM",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 12 },
        { type: 'A-', units: 3 },
        { type: 'B+', units: 9 },
        { type: 'B-', units: 1 },
        { type: 'AB+', units: 6 },
        { type: 'AB-', units: 0 },
        { type: 'O+', units: 15 },
        { type: 'O-', units: 2 }
      ],
      coordinates: { lat: 28.6315, lng: 77.2167 },
      city: "Delhi NCR"
    },
    // Prayagraj blood banks
    {
      id: 6,
      name: "Sanjay Gandhi Post Graduate Institute Blood Bank",
      address: "Rae Bareli Road, Lucknow, Uttar Pradesh",
      pinCode: "226014",
      distance: 3.2,
      phone: "+91-9876543215",
      rating: 4.7,
      reviewCount: 187,
      responseTime: 12,
      availabilityStatus: 'high',
      isVerified: true,
      certifications: ["NABH", "ISO 9001"],
      operatingHours: {
        isOpen: true,
        current: "24/7",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 28 },
        { type: 'A-', units: 9 },
        { type: 'B+', units: 22 },
        { type: 'B-', units: 6 },
        { type: 'AB+', units: 14 },
        { type: 'AB-', units: 4 },
        { type: 'O+', units: 35 },
        { type: 'O-', units: 8 }
      ],
      coordinates: { lat: 25.4358, lng: 81.8463 },
      city: "Prayagraj"
    },
    {
      id: 7,
      name: "United Institute of Medical Sciences Blood Bank",
      address: "Naini, Prayagraj, Uttar Pradesh",
      pinCode: "211008",
      distance: 5.8,
      phone: "+91-9876543216",
      rating: 4.3,
      reviewCount: 142,
      responseTime: 18,
      availabilityStatus: 'medium',
      isVerified: true,
      certifications: ["NABH"],
      operatingHours: {
        isOpen: true,
        current: "6:00 AM - 8:00 PM",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 18 },
        { type: 'A-', units: 5 },
        { type: 'B+', units: 15 },
        { type: 'B-', units: 3 },
        { type: 'AB+', units: 10 },
        { type: 'AB-', units: 2 },
        { type: 'O+', units: 25 },
        { type: 'O-', units: 6 }
      ],
      coordinates: { lat: 25.3960, lng: 81.8463 },
      city: "Prayagraj"
    },
    {
      id: 8,
      name: "Government District Hospital Blood Bank",
      address: "Civil Lines, Prayagraj, Uttar Pradesh",
      pinCode: "211001",
      distance: 2.1,
      phone: "+91-9876543217",
      rating: 4.1,
      reviewCount: 89,
      responseTime: 25,
      availabilityStatus: 'medium',
      isVerified: true,
      certifications: ["ISO 9001"],
      operatingHours: {
        isOpen: true,
        current: "8:00 AM - 6:00 PM",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 12 },
        { type: 'A-', units: 3 },
        { type: 'B+', units: 10 },
        { type: 'B-', units: 2 },
        { type: 'AB+', units: 7 },
        { type: 'AB-', units: 1 },
        { type: 'O+', units: 18 },
        { type: 'O-', units: 4 }
      ],
      coordinates: { lat: 25.4484, lng: 81.8534 },
      city: "Prayagraj"
    },
    {
      id: 9,
      name: "Red Cross Society Blood Bank Prayagraj",
      address: "Katra, Prayagraj, Uttar Pradesh",
      pinCode: "211002",
      distance: 4.5,
      phone: "+91-9876543218",
      rating: 4.0,
      reviewCount: 76,
      responseTime: 22,
      availabilityStatus: 'low',
      isVerified: false,
      certifications: ["ISO 9001"],
      operatingHours: {
        isOpen: false,
        current: "Closed",
        opensAt: "9:00 AM"
      },
      bloodGroups: [
        { type: 'A+', units: 8 },
        { type: 'A-', units: 2 },
        { type: 'B+', units: 6 },
        { type: 'B-', units: 1 },
        { type: 'AB+', units: 4 },
        { type: 'AB-', units: 0 },
        { type: 'O+', units: 12 },
        { type: 'O-', units: 3 }
      ],
      coordinates: { lat: 25.4525, lng: 81.8467 },
      city: "Prayagraj"
    },
    {
      id: 10,
      name: "Kamla Nehru Memorial Hospital Blood Bank",
      address: "Motilal Nehru Medical College, Prayagraj, Uttar Pradesh",
      pinCode: "211001",
      distance: 3.7,
      phone: "+91-9876543219",
      rating: 4.5,
      reviewCount: 156,
      responseTime: 15,
      availabilityStatus: 'high',
      isVerified: true,
      certifications: ["NABH", "ISO 9001"],
      operatingHours: {
        isOpen: true,
        current: "24/7",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 22 },
        { type: 'A-', units: 7 },
        { type: 'B+', units: 18 },
        { type: 'B-', units: 4 },
        { type: 'AB+', units: 11 },
        { type: 'AB-', units: 3 },
        { type: 'O+', units: 28 },
        { type: 'O-', units: 6 }
      ],
      coordinates: { lat: 25.4467, lng: 81.8550 },
      city: "Prayagraj"
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate loading and set mock data
    setTimeout(() => {
      setBloodBanks(mockBloodBanks);
      setFilteredBanks(mockBloodBanks);
      setIsLoading(false);
    }, 1500);

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
          console.log('Location access denied');
          // Default to Prayagraj coordinates for better relevance
          setUserLocation({ lat: 25.4484, lng: 81.8534 });
        }
      );
    } else {
      // Fallback to Prayagraj coordinates
      setUserLocation({ lat: 25.4484, lng: 81.8534 });
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, bloodBanks, sortBy]);

  const applyFilters = () => {
    let filtered = [...bloodBanks];

    // Filter by blood groups
    if (filters?.bloodGroups?.length > 0) {
      filtered = filtered?.filter(bank =>
        bank?.bloodGroups?.some(group =>
          filters?.bloodGroups?.includes(group?.type) && group?.units > 0
        )
      );
    }

    // Filter by distance
    filtered = filtered?.filter(bank => bank?.distance <= filters?.maxDistance);

    // Filter by emergency availability
    if (filters?.emergencyOnly) {
      filtered = filtered?.filter(bank => bank?.availabilityStatus === 'high');
    }

    // Filter by open now
    if (filters?.openNow) {
      filtered = filtered?.filter(bank => bank?.operatingHours?.isOpen);
    }

    // Filter by verified only
    if (filters?.verifiedOnly) {
      filtered = filtered?.filter(bank => bank?.isVerified);
    }

    // Sort results
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a?.distance - b?.distance;
        case 'availability':
          const statusOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return statusOrder?.[b?.availabilityStatus] - statusOrder?.[a?.availabilityStatus];
        case 'rating':
          return b?.rating - a?.rating;
        case 'responseTime':
          return a?.responseTime - b?.responseTime;
        default:
          return 0;
      }
    });

    setFilteredBanks(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      bloodGroups: [],
      maxDistance: 10,
      emergencyOnly: false,
      openNow: false,
      verifiedOnly: false
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
          setFilters(prev => ({ ...prev, location: 'Current Location' }));
        },
        (error) => {
          alert('Unable to get your location. Please enter manually.');
        }
      );
    }
  };

  const handleRequestBlood = (bloodBank) => {
    navigate('/emergency-blood-request', { 
      state: { selectedBloodBank: bloodBank } 
    });
  };

  const handleViewDetails = (bloodBank) => {
    setSelectedBank(bloodBank);
    // In a real app, this might open a modal or navigate to a details page
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 h-screen">
          {/* Mobile Header */}
          <div className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-semibold text-text-primary">Find Blood Banks</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                iconName="Filter"
                iconPosition="left"
              >
                Filters
              </Button>
            </div>
            
            {showFilters && (
              <div className="mt-4">
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  onGetCurrentLocation={handleGetCurrentLocation}
                />
              </div>
            )}
          </div>

          <MobileTabView
            bloodBanks={filteredBanks}
            isLoading={isLoading}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onRequestBlood={handleRequestBlood}
            onViewDetails={handleViewDetails}
            onCall={handleCall}
            totalResults={filteredBanks?.length}
            selectedBank={selectedBank}
            onBankSelect={handleBankSelect}
            userLocation={userLocation}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">Find Blood Banks</h1>
                <p className="text-text-secondary mt-1">
                  Locate nearby blood banks with real-time inventory and availability
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                >
                  Refresh
                </Button>
                <Button
                  variant="destructive"
                  iconName="AlertTriangle"
                  iconPosition="left"
                  onClick={() => navigate('/emergency-blood-request')}
                >
                  Emergency Request
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                onGetCurrentLocation={handleGetCurrentLocation}
              />
            </div>

            {/* Middle Section - Search Results */}
            <div className="lg:col-span-2 overflow-y-auto">
              <SearchResults
                bloodBanks={filteredBanks}
                isLoading={isLoading}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onRequestBlood={handleRequestBlood}
                onViewDetails={handleViewDetails}
                onCall={handleCall}
                totalResults={filteredBanks?.length}
              />
            </div>

            {/* Right Section - Map */}
            <div className="lg:col-span-1">
              <MapView
                bloodBanks={filteredBanks}
                selectedBank={selectedBank}
                onBankSelect={handleBankSelect}
                userLocation={userLocation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBankSearch;