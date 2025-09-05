import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlternativeBloodGroupSuggestions = ({ selectedBloodGroup, availabilityData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!selectedBloodGroup) {
      setSuggestions([]);
      return;
    }

    // AI-powered blood compatibility suggestions
    const generateSuggestions = () => {
      const compatibilityMatrix = {
        'A+': {
          canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
          canDonateTo: ['A+', 'AB+'],
          universalCompatible: ['O-'],
          emergencyAlternatives: ['O+', 'O-']
        },
        'A-': {
          canReceiveFrom: ['A-', 'O-'],
          canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
          universalCompatible: ['O-'],
          emergencyAlternatives: ['O-']
        },
        'B+': {
          canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
          canDonateTo: ['B+', 'AB+'],
          universalCompatible: ['O-'],
          emergencyAlternatives: ['O+', 'O-']
        },
        'B-': {
          canReceiveFrom: ['B-', 'O-'],
          canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
          universalCompatible: ['O-'],
          emergencyAlternatives: ['O-']
        },
        'AB+': {
          canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          canDonateTo: ['AB+'],
          universalCompatible: ['O-'],
          emergencyAlternatives: ['A+', 'B+', 'O+', 'O-']
        },
        'AB-': {
          canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
          canDonateTo: ['AB+', 'AB-'],
          universalCompatible: ['O-'],
          emergencyAlternatives: ['A-', 'B-', 'O-']
        },
        'O+': {
          canReceiveFrom: ['O+', 'O-'],
          canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
          universalCompatible: ['O-'],
          emergencyAlternatives: ['O-']
        },
        'O-': {
          canReceiveFrom: ['O-'],
          canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          universalCompatible: [],
          emergencyAlternatives: []
        }
      };

      const compatibility = compatibilityMatrix?.[selectedBloodGroup];
      if (!compatibility) return [];

      // Calculate availability for each compatible blood group
      const compatibleGroups = compatibility?.canReceiveFrom?.map(bloodGroup => {
        const totalAvailable = availabilityData?.reduce((sum, bank) => {
          return sum + (bank?.availability?.[bloodGroup] || 0);
        }, 0);

        const availableBanks = availabilityData?.filter(bank => 
          (bank?.availability?.[bloodGroup] || 0) > 0
        )?.length;

        return {
          bloodGroup,
          totalUnits: totalAvailable,
          availableBanks,
          compatibility: bloodGroup === selectedBloodGroup ? 'exact' : compatibility?.universalCompatible?.includes(bloodGroup) ?'universal': compatibility?.emergencyAlternatives?.includes(bloodGroup) ?'emergency' : 'compatible',
          riskLevel: bloodGroup === selectedBloodGroup ? 'none' :
                    bloodGroup === 'O-'? 'low' : compatibility?.emergencyAlternatives?.includes(bloodGroup) ?'medium' : 'low'
        };
      });

      // Sort by compatibility and availability
      return compatibleGroups?.sort((a, b) => {
        const compatibilityOrder = { exact: 0, universal: 1, emergency: 2, compatible: 3 };
        if (compatibilityOrder?.[a?.compatibility] !== compatibilityOrder?.[b?.compatibility]) {
          return compatibilityOrder?.[a?.compatibility] - compatibilityOrder?.[b?.compatibility];
        }
        return b?.totalUnits - a?.totalUnits;
      });
    };

    setSuggestions(generateSuggestions());
  }, [selectedBloodGroup, availabilityData]);

  const getCompatibilityColor = (compatibility) => {
    switch (compatibility) {
      case 'exact': return 'text-success';
      case 'universal': return 'text-primary';
      case 'emergency': return 'text-warning';
      case 'compatible': return 'text-text-primary';
      default: return 'text-text-secondary';
    }
  };

  const getCompatibilityBg = (compatibility) => {
    switch (compatibility) {
      case 'exact': return 'bg-success/10 border-success/20';
      case 'universal': return 'bg-primary/10 border-primary/20';
      case 'emergency': return 'bg-warning/10 border-warning/20';
      case 'compatible': return 'bg-muted border-border';
      default: return 'bg-muted border-border';
    }
  };

  const getCompatibilityLabel = (compatibility) => {
    switch (compatibility) {
      case 'exact': return 'Exact Match';
      case 'universal': return 'Universal Donor';
      case 'emergency': return 'Emergency Alternative';
      case 'compatible': return 'Compatible';
      default: return 'Unknown';
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'none': return 'text-success';
      case 'low': return 'text-primary';
      case 'medium': return 'text-warning';
      case 'high': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getRiskLevelText = (riskLevel) => {
    switch (riskLevel) {
      case 'none': return 'No Risk';
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      default: return 'Unknown Risk';
    }
  };

  if (!selectedBloodGroup || suggestions?.length === 0) {
    return null;
  }

  const displayedSuggestions = isExpanded ? suggestions : suggestions?.slice(0, 3);

  return (
    <div className="bg-card rounded-lg medical-shadow p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Brain" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">AI Blood Compatibility</h2>
          <p className="text-sm text-text-secondary">
            Smart alternatives for {selectedBloodGroup} based on medical compatibility
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {displayedSuggestions?.map((suggestion, index) => (
          <div
            key={suggestion?.bloodGroup}
            className={`p-4 rounded-lg border transition-medical ${getCompatibilityBg(suggestion?.compatibility)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-current">
                  <span className={`text-lg font-bold ${getCompatibilityColor(suggestion?.compatibility)}`}>
                    {suggestion?.bloodGroup}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-medium ${getCompatibilityColor(suggestion?.compatibility)}`}>
                      {getCompatibilityLabel(suggestion?.compatibility)}
                    </span>
                    {suggestion?.compatibility === 'exact' && (
                      <Icon name="CheckCircle" size={14} className="text-success" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <Icon name="Shield" size={12} className={getRiskLevelColor(suggestion?.riskLevel)} />
                    <span className={getRiskLevelColor(suggestion?.riskLevel)}>
                      {getRiskLevelText(suggestion?.riskLevel)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-text-primary">
                  {suggestion?.totalUnits} units
                </div>
                <div className="text-xs text-text-secondary">
                  {suggestion?.availableBanks} banks available
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="Building2" size={12} />
                  <span>{suggestion?.availableBanks} locations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Droplets" size={12} />
                  <span>{suggestion?.totalUnits} total units</span>
                </div>
              </div>

              {suggestion?.totalUnits > 0 && (
                <div className="flex items-center space-x-1 text-xs text-success">
                  <Icon name="CheckCircle" size={12} />
                  <span>Available Now</span>
                </div>
              )}
            </div>

            {suggestion?.compatibility === 'emergency' && (
              <div className="mt-3 p-2 bg-warning/5 border border-warning/20 rounded text-xs text-warning">
                <div className="flex items-center space-x-1">
                  <Icon name="AlertTriangle" size={12} />
                  <span>Emergency use only. Requires medical supervision and cross-matching.</span>
                </div>
              </div>
            )}

            {suggestion?.compatibility === 'universal' && (
              <div className="mt-3 p-2 bg-primary/5 border border-primary/20 rounded text-xs text-primary">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} />
                  <span>Universal donor - Safe for all recipients in emergency situations.</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {suggestions?.length > 3 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Show Less' : `Show ${suggestions?.length - 3} More Options`}
          </Button>
        </div>
      )}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">Important Medical Note:</p>
            <p>
              All blood transfusions require proper cross-matching and medical supervision. 
              These suggestions are AI-generated based on standard compatibility rules. 
              Always consult with medical professionals before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeBloodGroupSuggestions;