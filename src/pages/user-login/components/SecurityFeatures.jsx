/**
 * @file SecurityFeatures.jsx
 * @description Security and patient privacy assurance panel displayed alongside login.
 * Details data encryption protocols (AES-256), HIPAA standards, ISO 27001 data centers,
 * and confidential handling of medical histories.
 */

import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * SecurityFeatures Component
 *
 * @component
 * @returns {JSX.Element} Security and medical privacy guarantees card.
 */
const SecurityFeatures = () => {
  // Security standard badges
  const securityFeatures = [
    {
      id: 1,
      title: 'End-to-End Encryption',
      description: 'All your medical data is encrypted using AES-256 encryption',
      icon: 'Shield',
      status: 'active'
    },
    {
      id: 2,
      title: 'HIPAA Compliant',
      description: 'Follows international healthcare data protection standards',
      icon: 'FileCheck',
      status: 'active'
    },
    {
      id: 3,
      title: 'Two-Factor Authentication',
      description: 'Optional 2FA for enhanced account security',
      icon: 'Smartphone',
      status: 'available'
    },
    {
      id: 4,
      title: 'Secure Data Centers',
      description: 'Data stored in ISO 27001 certified facilities in India',
      icon: 'Server',
      status: 'active'
    }
  ];

  // Key privacy commitments
  const privacyPoints = [
    'Your blood group and medical history remain confidential',
    'Location data is only used for finding nearby blood banks',
    'No personal information is shared without your consent',
    'You can delete your account and data anytime'
  ];

  return (
    <div className="space-y-6">
      {/* Security Features Card */}
      <div className="bg-card rounded-lg medical-shadow p-6 border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Lock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Security & Privacy</h3>
        </div>
        
        <div className="space-y-4">
          {securityFeatures?.map((feature) => (
            <div key={feature?.id} className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mt-0.5 flex-shrink-0">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-text-primary">{feature?.title}</h4>
                <p className="text-xs text-text-secondary mt-0.5">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Commitments List Card */}
      <div className="bg-card rounded-lg medical-shadow p-6 border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="EyeOff" size={18} className="text-primary" />
          <h4 className="text-sm font-semibold text-text-primary">Our Privacy Promise</h4>
        </div>
        <ul className="space-y-2 text-xs text-text-secondary">
          {privacyPoints?.map((point, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SecurityFeatures;
