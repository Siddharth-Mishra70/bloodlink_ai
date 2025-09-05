import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import BloodBankCard from './BloodBankCard';

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
  const sortOptions = [
    { value: 'distance', label: 'Distance', icon: 'MapPin' },
    { value: 'availability', label: 'Availability', icon: 'Droplets' },
    { value: 'rating', label: 'Rating', icon: 'Star' },
    { value: 'responseTime', label: 'Response Time', icon: 'Clock' }
  ];

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

  if (bloodBanks?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Search" size={48} className="text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Blood Banks Found</h3>
        <p className="text-text-secondary mb-4">
          We couldn't find any blood banks matching your criteria. Try adjusting your filters or expanding your search radius.
        </p>
        <Button variant="outline" iconName="RefreshCw" iconPosition="left">
          Refresh Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Building2" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">
            {totalResults} Blood Banks Found
          </h2>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Sort by:</span>
          <div className="flex items-center space-x-1">
            {sortOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={sortBy === option?.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onSortChange(option?.value)}
                iconName={option?.icon}
                iconPosition="left"
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Results List */}
      <div className="space-y-4">
        {bloodBanks?.map((bloodBank) => (
          <BloodBankCard
            key={bloodBank?.id}
            bloodBank={bloodBank}
            onRequestBlood={onRequestBlood}
            onViewDetails={onViewDetails}
            onCall={onCall}
          />
        ))}
      </div>
      {/* Load More */}
      {bloodBanks?.length < totalResults && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            iconName="ChevronDown"
            iconPosition="left"
          >
            Load More Results ({totalResults - bloodBanks?.length} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;