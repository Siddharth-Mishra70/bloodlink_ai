import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SearchFilters = ({ filters, onFiltersChange, onClearFilters, onGetCurrentLocation }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const distanceOptions = [1, 2, 5, 10, 25, 50];

  const handleBloodGroupChange = (bloodGroup, checked) => {
    const updatedGroups = checked
      ? [...filters?.bloodGroups, bloodGroup]
      : filters?.bloodGroups?.filter(group => group !== bloodGroup);
    
    onFiltersChange({ ...filters, bloodGroups: updatedGroups });
  };

  const handleDistanceChange = (distance) => {
    onFiltersChange({ ...filters, maxDistance: distance });
  };

  const handleLocationChange = (e) => {
    onFiltersChange({ ...filters, location: e?.target?.value });
  };

  const handleEmergencyOnlyChange = (checked) => {
    onFiltersChange({ ...filters, emergencyOnly: checked });
  };

  const handleOpenNowChange = (checked) => {
    onFiltersChange({ ...filters, openNow: checked });
  };

  const handleVerifiedOnlyChange = (checked) => {
    onFiltersChange({ ...filters, verifiedOnly: checked });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Search Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear All
        </Button>
      </div>
      {/* Location Search */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Input
            type="text"
            placeholder="Enter location or PIN code"
            value={filters?.location}
            onChange={handleLocationChange}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onGetCurrentLocation}
            iconName="MapPin"
            iconPosition="left"
          >
            Current
          </Button>
        </div>
      </div>
      {/* Blood Group Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary mb-3">Blood Groups Needed</h4>
        <div className="grid grid-cols-4 gap-2">
          {bloodGroups?.map((group) => (
            <label key={group} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters?.bloodGroups?.includes(group)}
                onChange={(e) => handleBloodGroupChange(group, e?.target?.checked)}
              />
              <span className="text-sm text-text-primary">{group}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Distance Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary mb-3">Maximum Distance</h4>
        <div className="grid grid-cols-3 gap-2">
          {distanceOptions?.map((distance) => (
            <button
              key={distance}
              onClick={() => handleDistanceChange(distance)}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-medical ${
                filters?.maxDistance === distance
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-text-secondary hover:bg-muted/80'
              }`}
            >
              {distance} km
            </button>
          ))}
        </div>
      </div>
      {/* Quick Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-text-primary">Quick Filters</h4>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <Checkbox
            checked={filters?.emergencyOnly}
            onChange={(e) => handleEmergencyOnlyChange(e?.target?.checked)}
          />
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm text-text-primary">Emergency availability only</span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <Checkbox
            checked={filters?.openNow}
            onChange={(e) => handleOpenNowChange(e?.target?.checked)}
          />
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-success" />
            <span className="text-sm text-text-primary">Open now</span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <Checkbox
            checked={filters?.verifiedOnly}
            onChange={(e) => handleVerifiedOnlyChange(e?.target?.checked)}
          />
          <div className="flex items-center space-x-2">
            <Icon name="BadgeCheck" size={16} className="text-primary" />
            <span className="text-sm text-text-primary">Verified blood banks only</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default SearchFilters;