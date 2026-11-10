/**
 * @file SearchFilters.jsx
 * @description Sidebar filter panel for narrowing blood bank search queries:
 * Location/PIN code, target blood groups (A+, B+, etc.), distance radius slider,
 * emergency stock only, 24/7 / currently open filter, and verified facility criteria.
 */

import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

/**
 * SearchFilters Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.filters - Active filter criteria state.
 * @param {(filters: Object) => void} props.onFiltersChange - Filter state change callback.
 * @param {() => void} props.onClearFilters - Reset filters callback.
 * @param {() => void} props.onGetCurrentLocation - GPS auto-locate callback.
 * @returns {JSX.Element} Filter options panel.
 */
const SearchFilters = ({ filters, onFiltersChange, onClearFilters, onGetCurrentLocation }) => {
  // ABO & Rh blood groups list
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  // Distance radius thresholds in kilometers
  const distanceOptions = [1, 2, 5, 10, 25, 50];

  /**
   * Toggles blood group selection in filter list.
   * @param {string} bloodGroup - Target blood type.
   * @param {boolean} checked - Selection state.
   */
  const handleBloodGroupChange = (bloodGroup, checked) => {
    const updatedGroups = checked
      ? [...filters?.bloodGroups, bloodGroup]
      : filters?.bloodGroups?.filter(group => group !== bloodGroup);
    
    onFiltersChange({ ...filters, bloodGroups: updatedGroups });
  };

  /**
   * Updates maximum distance radius.
   * @param {number} distance - Distance in kilometers.
   */
  const handleDistanceChange = (distance) => {
    onFiltersChange({ ...filters, maxDistance: distance });
  };

  /**
   * Updates location search text.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleLocationChange = (e) => {
    onFiltersChange({ ...filters, location: e?.target?.value });
  };

  /**
   * Toggles emergency stock only filter.
   */
  const handleEmergencyOnlyChange = (checked) => {
    onFiltersChange({ ...filters, emergencyOnly: checked });
  };

  /**
   * Toggles open now filter.
   */
  const handleOpenNowChange = (checked) => {
    onFiltersChange({ ...filters, openNow: checked });
  };

  /**
   * Toggles verified facilities only filter.
   */
  const handleVerifiedOnlyChange = (checked) => {
    onFiltersChange({ ...filters, verifiedOnly: checked });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      {/* Header and Reset Button */}
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

      {/* Location / PIN Input Field */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Input
            type="text"
            placeholder="Prayagraj zone or PIN (e.g. Civil Lines, 211001)"
            value={filters?.location}
            onChange={handleLocationChange}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={onGetCurrentLocation}
            title="Use current GPS location"
          >
            <Icon name="Crosshair" size={16} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {['Civil Lines', 'George Town', 'Teliarganj', 'Chowk'].map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => onFiltersChange({ ...filters, location: zone })}
              className="text-[11px] px-2 py-0.5 rounded bg-muted hover:bg-primary/10 hover:text-primary text-text-secondary border border-border"
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Group Multi-select Chips */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary mb-3">Blood Group Needed</h4>
        <div className="grid grid-cols-4 gap-2">
          {bloodGroups?.map((group) => {
            const isSelected = filters?.bloodGroups?.includes(group);
            return (
              <button
                key={group}
                type="button"
                onClick={() => handleBloodGroupChange(group, !isSelected)}
                className={`py-2 px-3 text-xs font-bold rounded-md border transition-medical ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-surface text-text-secondary border-border hover:bg-muted'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>
      </div>

      {/* Maximum Distance Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-text-primary">Max Distance</h4>
          <span className="text-xs font-semibold text-primary">{filters?.maxDistance} km</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {distanceOptions?.map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => handleDistanceChange(dist)}
              className={`py-1 px-3 text-xs font-medium rounded-full border transition-medical ${
                filters?.maxDistance === dist
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-text-secondary border-border hover:bg-muted'
              }`}
            >
              {dist} km
            </button>
          ))}
        </div>
      </div>

      {/* Quick Boolean Checkbox Filters */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Checkbox
          id="filter-open-now"
          label="Open Now (24/7)"
          checked={filters?.openNow}
          onChange={(e) => handleOpenNowChange(e?.target?.checked)}
        />
        <Checkbox
          id="filter-emergency-only"
          label="High Availability Only"
          checked={filters?.emergencyOnly}
          onChange={(e) => handleEmergencyOnlyChange(e?.target?.checked)}
        />
        <Checkbox
          id="filter-verified-only"
          label="Verified Facilities Only"
          checked={filters?.verifiedOnly}
          onChange={(e) => handleVerifiedOnlyChange(e?.target?.checked)}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
