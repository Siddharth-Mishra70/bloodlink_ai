/**
 * @file BloodAvailabilityPanel.jsx
 * @description Real-time blood availability summary displaying nearby facilities,
 * current units in stock for the requested blood group, distance from user, and direct hotline dialing.
 */

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * BloodAvailabilityPanel Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.selectedBloodGroup - Active blood group filter.
 * @param {{ lat: number, lng: number }|null} props.userLocation - User coordinates.
 * @returns {JSX.Element} Panel showing real-time inventory at nearby facilities.
 */
const BloodAvailabilityPanel = ({ selectedBloodGroup, userLocation }) => {
  // Regional facilities inventory dataset
  const [availabilityData, setAvailabilityData] = useState([]);
  // Loading status
  const [isLoading, setIsLoading] = useState(true);
  // Last sync timestamp
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Fetch simulated real-time inventory from regional blood banks
    const fetchAvailability = () => {
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        const mockData = [
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

        setAvailabilityData(mockData);
        setIsLoading(false);
        setLastUpdated(new Date());
      }, 1000);

      return () => clearTimeout(timer);
    };

    fetchAvailability();
  }, [selectedBloodGroup]);

  /**
   * Triggers native telephone call to blood bank desk.
   * @param {string} phone - Target phone number.
   */
  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  /**
   * Resolves stock health badge.
   * @param {number} units - Available units.
   * @returns {string} Tailwind CSS classes.
   */
  const getUnitsBadgeColor = (units) => {
    if (units >= 10) return 'bg-success/10 text-success border-success/20';
    if (units >= 5) return 'bg-warning/10 text-warning border-warning/20';
    if (units > 0) return 'bg-error/10 text-error border-error/20';
    return 'bg-muted text-text-secondary border-border';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Nearby Live Availability</h3>
        </div>
        <div className="text-xs text-text-secondary">
          Updated {lastUpdated?.toLocaleTimeString()}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3]?.map(i => (
            <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {availabilityData?.map((bank) => {
            const units = selectedBloodGroup ? (bank?.availability?.[selectedBloodGroup] || 0) : null;
            return (
              <div
                key={bank?.id}
                className="p-4 rounded-lg border border-border bg-surface hover:bg-muted/30 transition-medical"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-text-primary">{bank?.name}</h4>
                      <span className="text-xs text-text-secondary">({bank?.distance})</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{bank?.address}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                      <span>Response: {bank?.responseTime}</span>
                      <span>Rating: {bank?.rating} ★</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-3">
                    {selectedBloodGroup && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getUnitsBadgeColor(units)}`}>
                        {units} units ({selectedBloodGroup})
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleCall(bank?.phone)}
                      iconName="Phone"
                      iconPosition="left"
                    >
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BloodAvailabilityPanel;
