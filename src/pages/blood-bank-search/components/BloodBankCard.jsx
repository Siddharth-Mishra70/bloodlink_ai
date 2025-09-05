import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BloodBankCard = ({ bloodBank, onRequestBlood, onViewDetails, onCall }) => {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getAvailabilityIcon = (status) => {
    switch (status) {
      case 'high': return 'CheckCircle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getBloodGroupColor = (availability) => {
    if (availability >= 10) return 'bg-success text-success-foreground';
    if (availability >= 5) return 'bg-warning text-warning-foreground';
    if (availability > 0) return 'bg-error text-error-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow hover:medical-shadow-lg transition-medical">
      {/* Header */}
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
      {/* Address */}
      <div className="mb-4">
        <p className="text-sm text-text-secondary">{bloodBank?.address}</p>
        <p className="text-sm text-text-secondary">PIN: {bloodBank?.pinCode}</p>
      </div>
      {/* Blood Groups Availability */}
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
      {/* Certifications */}
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
      {/* Rating */}
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
      {/* Operating Hours */}
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
      {/* Actions */}
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