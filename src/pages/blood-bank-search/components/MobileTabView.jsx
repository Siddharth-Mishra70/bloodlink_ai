/**
 * @file MobileTabView.jsx
 * @description Mobile-responsive view switcher that toggles between
 * card list results and full-screen geographic map view on smaller screens.
 */

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import SearchResults from './SearchResults';
import MapView from './MapView';

/**
 * MobileTabView Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.bloodBanks - Facilities list.
 * @param {boolean} props.isLoading - Query loading flag.
 * @param {string} props.sortBy - Active sort column.
 * @param {(sort: string) => void} props.onSortChange - Sort change handler.
 * @param {(bank: Object) => void} props.onRequestBlood - Initiate blood request handler.
 * @param {(bank: Object) => void} props.onViewDetails - Details view handler.
 * @param {(phone: string) => void} props.onCall - Call helpline handler.
 * @param {number} props.totalResults - Total matching count.
 * @param {Object|null} props.selectedBank - Selected bank.
 * @param {(bank: Object) => void} props.onBankSelect - Bank selection handler.
 * @param {{ lat: number, lng: number }|null} props.userLocation - GPS coordinates.
 * @returns {JSX.Element} Mobile layout with toggleable list/map tabs.
 */
const MobileTabView = ({ 
  bloodBanks, 
  isLoading, 
  sortBy, 
  onSortChange, 
  onRequestBlood, 
  onViewDetails, 
  onCall,
  totalResults,
  selectedBank,
  onBankSelect,
  userLocation
}) => {
  // Mobile active tab ('list' | 'map')
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'list', label: 'List View', icon: 'List' },
    { id: 'map', label: 'Map View', icon: 'Map' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Tab Navigation Header */}
      <div className="flex bg-card border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-medical ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-text-secondary hover:text-text-primary hover:bg-muted/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Tab Viewport */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'list' && (
          <div className="h-full overflow-y-auto p-4">
            <SearchResults
              bloodBanks={bloodBanks}
              isLoading={isLoading}
              sortBy={sortBy}
              onSortChange={onSortChange}
              onRequestBlood={onRequestBlood}
              onViewDetails={onViewDetails}
              onCall={onCall}
              totalResults={totalResults}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-full p-2">
            <MapView
              bloodBanks={bloodBanks}
              selectedBank={selectedBank}
              onBankSelect={onBankSelect}
              userLocation={userLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTabView;
