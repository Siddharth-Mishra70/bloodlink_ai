/**
 * @file SearchResults.jsx
 * @description Search results feed rendering matching blood bank facility cards.
 * Provides skeleton loaders, empty state recovery views, and sorting toggles
 * (Distance, Availability, Rating, Response Time).
 */

import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import BloodBankCard from './BloodBankCard';

/**
 * SearchResults Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.bloodBanks - Filtered list of blood banks.
 * @param {boolean} props.isLoading - Whether query is actively executing.
 * @param {string} props.sortBy - Active sort criterion ('distance'|'availability'|'rating'|'responseTime').
 * @param {(sort: string) => void} props.onSortChange - Sort change callback.
 * @param {(bank: Object) => void} props.onRequestBlood - Initiate emergency request callback.
 * @param {(bank: Object) => void} props.onViewDetails - View facility details callback.
 * @param {(phone: string) => void} props.onCall - Call hotline callback.
 * @param {number} props.totalResults - Total count of matching blood banks.
 * @returns {JSX.Element} Results list with sorting toolbar and facility cards.
 */
const SearchResults = ({ 
  bloodBanks, 
  isLoading, 
  sortBy, 
  onSortChange, 
  onRequestBlood, 
  onViewDetails, 
  onCall,
  totalResults 
}) => {
  // Available sort dimensions
  const sortOptions = [
    { value: 'distance', label: 'Distance', icon: 'MapPin' },
    { value: 'availability', label: 'Availability', icon: 'Droplets' },
    { value: 'rating', label: 'Rating', icon: 'Star' },
    { value: 'responseTime', label: 'Response Time', icon: 'Clock' }
  ];

  // Render animated skeleton cards while query is processing
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-48 mb-2"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
              <div className="h-5 bg-muted rounded w-20"></div>
            </div>
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[...Array(8)]?.map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
            <div className="flex space-x-3">
              <div className="h-8 bg-muted rounded flex-1"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-10"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render empty state if no blood banks match criteria
  if (bloodBanks?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Search" size={48} className="text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Blood Banks Found</h3>
        <p className="text-text-secondary mb-4">
          We couldn't find any blood banks matching your criteria. Try adjusting your filters or expanding your search radius.
        </p>
        <Button variant="outline" iconName="RefreshCw" iconPosition="left" onClick={() => window.location?.reload()}>
          Reset Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Header Bar with Total Count & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border rounded-lg p-4">
        <div className="text-sm text-text-secondary">
          Showing <span className="font-semibold text-text-primary">{totalResults}</span> blood banks
        </div>

        {/* Sort Options Toolbar */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-text-secondary">Sort by:</span>
          <div className="flex rounded-md border border-border overflow-hidden">
            {sortOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => onSortChange(option?.value)}
                className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-medical ${
                  sortBy === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={option?.icon} size={12} />
                <span>{option?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blood Bank Cards Stack */}
      <div className="space-y-4">
        {bloodBanks?.map((bank) => (
          <BloodBankCard
            key={bank?.id}
            bloodBank={bank}
            onRequestBlood={onRequestBlood}
            onViewDetails={onViewDetails}
            onCall={onCall}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
