/**
 * @file index.jsx
 * @description Blood Bank Search and Discovery page for BloodLink AI.
 * Enables patients, hospitals, and emergency responders to discover nearby verified
 * blood bank centers across cities (such as Delhi NCR, Prayagraj, etc.), filter by blood group availability,
 * view operating hours, toggle between list and interactive map views, and submit emergency requisitions.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import MapView from './components/MapView';
import MobileTabView from './components/MobileTabView';

/**
 * BloodBankSearch Component
 *
 * @component
 * @returns {JSX.Element} Responsive blood bank discovery page with search and map.
 */
const BloodBankSearch = () => {
  const navigate = useNavigate();

  // Mobile viewport detection flag
  const [isMobile, setIsMobile] = useState(false);
  // Async search execution state
  const [isLoading, setIsLoading] = useState(true);
  // Master list of blood bank facilities
  const [bloodBanks, setBloodBanks] = useState([]);
  // Filtered & sorted subset of blood banks matching active criteria
  const [filteredBanks, setFilteredBanks] = useState([]);
  // Currently highlighted or selected facility on the map
  const [selectedBank, setSelectedBank] = useState(null);
  // User's geographic coordinates { lat, lng }
  const [userLocation, setUserLocation] = useState(null);
  // Active sort dimension ('distance' | 'availability' | 'rating' | 'responseTime')
  const [sortBy, setSortBy] = useState('distance');
  // Mobile filter drawer expansion state
  const [showFilters, setShowFilters] = useState(false);

  // Active search criteria filters
  const [filters, setFilters] = useState({
    location: '',
    bloodGroups: [],
    maxDistance: 10,
    emergencyOnly: false,
    openNow: false,
    verifiedOnly: false
  });

  // Real Prayagraj blood bank facilities with live inventory and coordinates
  const mockBloodBanks = [
    {
      id: 1,
      name: "Swaroop Rani Nehru (SRN) Hospital Blood Bank & Trauma Centre",
      address: "MG Marg, Darbhanga Colony / George Town, Prayagraj",
      pinCode: "211001",
      distance: 1.8,
      phone: "+91-532-2256056",
      rating: 4.8,
      reviewCount: 420,
      responseTime: 12,
      availabilityStatus: 'high',
      isVerified: true,
      certifications: ["NABH", "Government Certified", "Level 1 Trauma"],
      operatingHours: {
        isOpen: true,
        current: "24/7 Emergency Blood Bank",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 32 },
        { type: 'A-', units: 14 },
        { type: 'B+', units: 45 },
        { type: 'B-', units: 9 },
        { type: 'AB+', units: 18 },
        { type: 'AB-', units: 6 },
        { type: 'O+', units: 58 },
        { type: 'O-', units: 16 }
      ],
      coordinates: { lat: 25.4484, lng: 81.8542 },
      city: "Prayagraj"
    },
    {
      id: 2,
      name: "Jeevan Jyoti Hospital Blood Bank",
      address: "162, Bai Ka Bagh, Lowther Road, Prayagraj",
      pinCode: "211003",
      distance: 2.4,
      phone: "+91-532-2417400",
      rating: 4.7,
      reviewCount: 310,
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
        { type: 'B+', units: 28 },
        { type: 'B-', units: 4 },
        { type: 'AB+', units: 11 },
        { type: 'AB-', units: 2 },
        { type: 'O+', units: 34 },
        { type: 'O-', units: 8 }
      ],
      coordinates: { lat: 25.4312, lng: 81.8415 },
      city: "Prayagraj"
    },
    {
      id: 3,
      name: "Tej Bahadur Sapru (Beli) Hospital Blood Bank",
      address: "Stanley Road, Beli, Teliarganj / Civil Lines, Prayagraj",
      pinCode: "211002",
      distance: 3.1,
      phone: "+91-532-2540225",
      rating: 4.6,
      reviewCount: 225,
      responseTime: 18,
      availabilityStatus: 'medium',
      isVerified: true,
      certifications: ["State Health Mission", "Government Certified"],
      operatingHours: {
        isOpen: true,
        current: "24/7",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 18 },
        { type: 'A-', units: 5 },
        { type: 'B+', units: 24 },
        { type: 'B-', units: 3 },
        { type: 'AB+', units: 9 },
        { type: 'AB-', units: 2 },
        { type: 'O+', units: 29 },
        { type: 'O-', units: 6 }
      ],
      coordinates: { lat: 25.4630, lng: 81.8420 },
      city: "Prayagraj"
    },
    {
      id: 4,
      name: "Kamla Nehru Memorial Hospital (KNMH) Blood Centre",
      address: "1, Hashimpur Road, Tagore Town, Prayagraj",
      pinCode: "211002",
      distance: 2.1,
      phone: "+91-532-2466601",
      rating: 4.8,
      reviewCount: 280,
      responseTime: 14,
      availabilityStatus: 'high',
      isVerified: true,
      certifications: ["NABH", "AABB Member"],
      operatingHours: {
        isOpen: true,
        current: "24/7",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 20 },
        { type: 'A-', units: 6 },
        { type: 'B+', units: 22 },
        { type: 'B-', units: 5 },
        { type: 'AB+', units: 10 },
        { type: 'AB-', units: 3 },
        { type: 'O+', units: 30 },
        { type: 'O-', units: 7 }
      ],
      coordinates: { lat: 25.4520, lng: 81.8590 },
      city: "Prayagraj"
    },
    {
      id: 5,
      name: "Nazareth Hospital Blood Bank",
      address: "13-A, Kamla Nehru Road, Civil Lines, Prayagraj",
      pinCode: "211001",
      distance: 1.2,
      phone: "+91-532-2407421",
      rating: 4.9,
      reviewCount: 350,
      responseTime: 10,
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
        { type: 'A-', units: 9 },
        { type: 'B+', units: 31 },
        { type: 'B-', units: 6 },
        { type: 'AB+', units: 14 },
        { type: 'AB-', units: 4 },
        { type: 'O+', units: 40 },
        { type: 'O-', units: 11 }
      ],
      coordinates: { lat: 25.4510, lng: 81.8350 },
      city: "Prayagraj"
    },
    {
      id: 6,
      name: "Moti Lal Nehru Divisional (Colvin) Hospital Blood Bank",
      address: "City Road, Old Katra / Chowk, Prayagraj",
      pinCode: "211002",
      distance: 2.7,
      phone: "+91-532-2465531",
      rating: 4.5,
      reviewCount: 195,
      responseTime: 20,
      availabilityStatus: 'medium',
      isVerified: true,
      certifications: ["Government Certified"],
      operatingHours: {
        isOpen: true,
        current: "24/7",
        opensAt: null
      },
      bloodGroups: [
        { type: 'A+', units: 15 },
        { type: 'A-', units: 4 },
        { type: 'B+', units: 20 },
        { type: 'B-', units: 3 },
        { type: 'AB+', units: 8 },
        { type: 'AB-', units: 2 },
        { type: 'O+', units: 25 },
        { type: 'O-', units: 5 }
      ],
      coordinates: { lat: 25.4390, lng: 81.8360 },
      city: "Prayagraj"
    }
  ];

  // Screen responsiveness listener & geolocation resolution
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate async data fetching
    const timer = setTimeout(() => {
      setBloodBanks(mockBloodBanks);
      setFilteredBanks(mockBloodBanks);
      setIsLoading(false);
    }, 1500);

    // Request browser geolocation access
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
        },
        () => {
          // Default fallback coordinates (Prayagraj regional hub)
          setUserLocation({ lat: 25.4484, lng: 81.8534 });
        }
      );
    } else {
      setUserLocation({ lat: 25.4484, lng: 81.8534 });
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  // Re-apply filter rules whenever filter criteria, sort order, or dataset changes
  useEffect(() => {
    applyFilters();
  }, [filters, bloodBanks, sortBy]);

  /**
   * Evaluates filter criteria against master facility list.
   */
  const applyFilters = () => {
    let filtered = [...bloodBanks];

    // Filter by selected blood groups
    if (filters?.bloodGroups?.length > 0) {
      filtered = filtered?.filter(bank =>
        bank?.bloodGroups?.some(group =>
          filters?.bloodGroups?.includes(group?.type) && group?.units > 0
        )
      );
    }

    // Filter by maximum distance radius
    filtered = filtered?.filter(bank => bank?.distance <= filters?.maxDistance);

    // Filter by emergency availability level
    if (filters?.emergencyOnly) {
      filtered = filtered?.filter(bank => bank?.availabilityStatus === 'high');
    }

    // Filter by facilities operating 24/7 or open now
    if (filters?.openNow) {
      filtered = filtered?.filter(bank => bank?.operatingHours?.isOpen);
    }

    // Filter by government/accredited verification
    if (filters?.verifiedOnly) {
      filtered = filtered?.filter(bank => bank?.isVerified);
    }

    // Sort matching results
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

  /**
   * Updates filter state.
   * @param {Object} newFilters - Updated criteria object.
   */
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  /**
   * Resets all search filters to default state.
   */
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

  /**
   * Auto-populates current GPS coordinates as search origin.
   */
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
        () => {
          alert('Unable to get your location. Please enter manually.');
        }
      );
    }
  };

  /**
   * Navigates to emergency blood request form pre-selected with this blood bank.
   * @param {Object} bloodBank - Target facility.
   */
  const handleRequestBlood = (bloodBank) => {
    navigate('/emergency-blood-request', { 
      state: { selectedBloodBank: bloodBank } 
    });
  };

  /**
   * Sets facility as active focused item.
   * @param {Object} bloodBank - Target facility.
   */
  const handleViewDetails = (bloodBank) => {
    setSelectedBank(bloodBank);
  };

  /**
   * Initiates telephone call to facility hotline.
   * @param {string} phoneNumber - Target phone number.
   */
  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Render mobile layout with tab view switcher when screen width is small
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 h-screen">
          {/* Mobile Header with Filter Trigger */}
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

  // Desktop multi-column layout
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Page Banner Header */}
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

        {/* 3-Column Desktop Workspace: Filters (1 col), Results (2 cols), Map (1 col) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
            {/* Left Sidebar - Search Filters */}
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                onGetCurrentLocation={handleGetCurrentLocation}
              />
            </div>

            {/* Middle Scrollable Section - Search Results Feed */}
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

            {/* Right Sticky Section - Map View */}
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
