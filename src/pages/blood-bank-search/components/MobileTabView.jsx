import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SearchResults from './SearchResults';
import MapView from './MapView';

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
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'list', label: 'List View', icon: 'List' },
    { id: 'map', label: 'Map View', icon: 'Map' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex bg-card border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-medical ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-text-primary hover:bg-muted/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
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
          <div className="h-full">
            <MapView
              bloodBanks={bloodBanks}
              selectedBank={selectedBank}
              onBankSelect={onBankSelect}
              userLocation={userLocation}
            />
          </div>
        )}
      </div>
      {/* Quick Actions Bar */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Building2" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {bloodBanks?.length} nearby
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Filter"
              iconPosition="left"
            >
              Filters
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Emergency
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTabView;