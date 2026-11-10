/**
 * @file BloodBankCard.jsx
 * @description Card component presenting a single blood bank facility's details:
 * real-time blood stock counts, operating hours, NABH certifications, distance from user,
 * average review score, and direct actions (Request Blood, Call, View Details).
 */

import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * BloodBankCard Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.bloodBank - Blood bank facility data object.
 * @param {(bank: Object) => void} props.onRequestBlood - Callback to initiate emergency request.
 * @param {(bank: Object) => void} props.onViewDetails - Callback to inspect facility details.
 * @param {(phone: string) => void} props.onCall - Callback to trigger phone dialer.
 * @returns {JSX.Element} Interactive blood bank facility overview card.
 */
const BloodBankCard = ({ bloodBank, onRequestBlood, onViewDetails, onCall }) => {
  /**
   * Resolves availability text color classes based on stock level.
   * @param {'high'|'medium'|'low'} status - Inventory status string.
   * @returns {string} Tailwind text color class.
   */
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  /**
   * Resolves Lucide icon name for stock health status.
   * @param {'high'|'medium'|'low'} status - Inventory status string.
   * @returns {string} Icon identifier.
   */
  const getAvailabilityIcon = (status) => {
    switch (status) {
      case 'high': return 'CheckCircle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'XCircle';
      default: return 'Circle';
    }
  };

  /**
   * Resolves pill badge color by unit count.
   * @param {number} availability - Units currently available.
   * @returns {string} Tailwind background & text color classes.
   */
  const getBloodGroupColor = (availability) => {
    if (availability >= 10) return 'bg-success text-success-foreground';
    if (availability >= 5) return 'bg-warning text-warning-foreground';
    if (availability > 0) return 'bg-error text-error-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow hover:medical-shadow-lg transition-medical">
      {/* Header: Facility Name, Verified Badge, Distance, Response Time, Stock Health */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-text-primary">{bloodBank?.name}</h3>
            {bloodBank?.isVerified && (
              <Icon name="BadgeCheck" size={18} className="text-primary" />
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{bloodBank?.distance} km away</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{bloodBank?.responseTime} min response</span>
            </div>
          </div>
        </div>

        {/* Aggregate Stock Status Badge */}
        <div className="flex items-center space-x-1">
          <Icon 
            name={getAvailabilityIcon(bloodBank?.availabilityStatus)} 
            size={20} 
            className={getAvailabilityColor(bloodBank?.availabilityStatus)}
          />
          <span className={`text-sm font-medium ${getAvailabilityColor(bloodBank?.availabilityStatus)}`}>
            {bloodBank?.availabilityStatus === 'high' ? 'High Stock' : 
             bloodBank?.availabilityStatus === 'medium' ? 'Medium Stock' : 
             bloodBank?.availabilityStatus === 'low' ? 'Low Stock' : 'No Stock'}
          </span>
        </div>
      </div>

      {/* Facility Physical Address */}
      <div className="mb-4">
        <p className="text-sm text-text-secondary">{bloodBank?.address}</p>
        <p className="text-sm text-text-secondary">PIN: {bloodBank?.pinCode}</p>
      </div>

      {/* Available Blood Groups Breakdown Grid */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-text-primary mb-2">Available Blood Groups</h4>
        <div className="grid grid-cols-4 gap-2">
          {bloodBank?.bloodGroups?.map((group) => (
            <div
              key={group?.type}
              className={`text-center py-2 px-3 rounded-md text-xs font-medium ${getBloodGroupColor(group?.units)}`}
            >
              <div className="font-semibold">{group?.type}</div>
              <div>{group?.units} units</div>
            </div>
          ))}
        </div>
      </div>

      {/* Accreditation Certifications (NABH, ISO) */}
      {bloodBank?.certifications && bloodBank?.certifications?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={14} className="text-primary" />
            <span className="text-xs text-text-secondary">
              {bloodBank?.certifications?.join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* User Reviews & Star Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)]?.map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={14}
              className={i < Math.floor(bloodBank?.rating) ? 'text-warning fill-current' : 'text-muted'}
            />
          ))}
        </div>
        <span className="text-sm text-text-secondary">
          {bloodBank?.rating} ({bloodBank?.reviewCount} reviews)
        </span>
      </div>

      {/* Operating Hours / Open Status */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Clock" size={14} className="text-text-secondary" />
          <span className="text-text-secondary">
            {bloodBank?.operatingHours?.isOpen ? (
              <span className="text-success">Open now - {bloodBank?.operatingHours?.current}</span>
            ) : (
              <span className="text-error">Closed - Opens at {bloodBank?.operatingHours?.opensAt}</span>
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons: Request Blood, Call Helpline, View Details */}
      <div className="flex items-center space-x-3">
        <Button
          variant="default"
          size="sm"
          onClick={() => onRequestBlood(bloodBank)}
          iconName="Droplets"
          iconPosition="left"
          className="flex-1"
        >
          Request Blood
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCall(bloodBank?.phone)}
          iconName="Phone"
          iconPosition="left"
        >
          Call
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(bloodBank)}
          iconName="Eye"
        />
      </div>
    </div>
  );
};

export default BloodBankCard;
