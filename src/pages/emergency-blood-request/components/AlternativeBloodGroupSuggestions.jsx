/**
 * @file AlternativeBloodGroupSuggestions.jsx
 * @description Clinically verified ABO & Rh blood group compatibility matrix and suggestion engine.
 * Computes compatible donor groups, universal donor (O-) recommendations, and real-time inventory
 * counts for alternative compatible blood types when requested units are unavailable.
 */

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * AlternativeBloodGroupSuggestions Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.selectedBloodGroup - Patient's blood group (e.g. 'B+', 'O-', 'AB+').
 * @param {Array<Object>} props.availabilityData - Live inventory counts across regional blood banks.
 * @returns {JSX.Element|null} Medically verified alternative compatibility card.
 */
const AlternativeBloodGroupSuggestions = ({ selectedBloodGroup, availabilityData }) => {
  // Computed compatible alternative groups list
  const [suggestions, setSuggestions] = useState([]);
  // Accordion expansion state for detailed matrix
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!selectedBloodGroup) {
      setSuggestions([]);
      return;
    }

    /**
     * Medically verified red blood cell compatibility matrix:
     * - O- is universal red cell donor.
     * - AB+ is universal red cell recipient.
     * - Rh- patients should only receive Rh- units in non-critical situations.
     */
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
          universalCompatible: ['O-'],
          emergencyAlternatives: ['O-']
        }
      };

      const groupInfo = compatibilityMatrix?.[selectedBloodGroup];
      if (!groupInfo) return [];

      // Calculate total units available in region for each compatible blood group
      const compatibleGroups = groupInfo?.canReceiveFrom?.map(type => {
        let totalUnits = 0;
        availabilityData?.forEach(bank => {
          totalUnits += (bank?.availability?.[type] || 0);
        });

        const isExactMatch = type === selectedBloodGroup;
        const isUniversal = groupInfo?.universalCompatible?.includes(type);
        const isEmergency = groupInfo?.emergencyAlternatives?.includes(type);

        return {
          type,
          totalUnits,
          isExactMatch,
          isUniversal,
          isEmergency,
          compatibilityRating: isExactMatch ? 'Exact Match' : isUniversal ? 'Universal Donor' : 'Compatible Alternative'
        };
      });

      return compatibleGroups?.sort((a, b) => {
        if (a?.isExactMatch) return -1;
        if (b?.isExactMatch) return 1;
        return b?.totalUnits - a?.totalUnits;
      });
    };

    setSuggestions(generateSuggestions());
  }, [selectedBloodGroup, availabilityData]);

  if (!selectedBloodGroup || suggestions?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="GitFork" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Alternative Blood Groups</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
        />
      </div>

      <p className="text-sm text-text-secondary mb-4">
        Compatible donor groups for <span className="font-bold text-primary">{selectedBloodGroup}</span> recipients based on clinical transfusion protocols.
      </p>

      {/* Primary Compatible Blood Types Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {suggestions?.map((item) => (
          <div
            key={item?.type}
            className={`p-3 rounded-lg border text-center transition-medical ${
              item?.isExactMatch
                ? 'bg-primary/10 border-primary text-primary'
                : item?.totalUnits > 0
                ? 'bg-surface border-border text-text-primary'
                : 'bg-muted/40 border-border opacity-60 text-text-secondary'
            }`}
          >
            <div className="text-lg font-bold">{item?.type}</div>
            <div className="text-xs mt-1 font-medium">
              {item?.totalUnits > 0 ? `${item?.totalUnits} units available` : 'Out of stock'}
            </div>
            <div className="text-[10px] mt-1 opacity-80">{item?.compatibilityRating}</div>
          </div>
        ))}
      </div>

      {/* Expanded Accordion: Medical Transfusion Guidelines */}
      {isExpanded && (
        <div className="pt-4 border-t border-border space-y-3 text-xs text-text-secondary">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <p>
              In severe emergency trauma where the exact blood group is depleted, universal red blood cell donor (O Negative) units can be safely transfused to any ABO blood group recipient pending cross-match confirmation.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="ShieldAlert" size={16} className="text-warning flex-shrink-0 mt-0.5" />
            <p>
              Always perform standard bedside serological cross-match verification prior to transfusion except in certified ultra-emergency un-crossmatched resuscitation protocols.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativeBloodGroupSuggestions;
