import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
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

  const privacyPoints = [
    'Your blood group and medical history remain confidential',
    'Location data is only used for finding nearby blood banks',
    'No personal information is shared without your consent',
    'You can delete your account and data anytime'
  ];

  return (
    <div className="space-y-6">
      {/* Security Features */}
      <div className="bg-card rounded-lg medical-shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Lock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Security & Privacy</h3>
        </div>
        
        <div className="space-y-4">
          {securityFeatures?.map((feature) => (
            <div key={feature?.id} className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mt-0.5">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-text-primary">{feature?.title}</h4>
                  {feature?.status === 'active' && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-xs text-success">Active</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-1">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Privacy Commitment */}
      <div className="bg-gradient-to-r from-success/5 to-primary/5 rounded-lg p-6 border border-success/20">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="UserCheck" size={20} className="text-success" />
          <h3 className="text-lg font-semibold text-text-primary">Privacy Commitment</h3>
        </div>
        
        <div className="space-y-2">
          {privacyPoints?.map((point, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Icon name="Check" size={14} className="text-success mt-0.5" />
              <p className="text-sm text-text-secondary">{point}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-success/20">
          <p className="text-xs text-text-secondary text-center">
            By signing in, you agree to our{' '}
            <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms-of-service" className="text-primary underline">Terms of Service</a>
          </p>
        </div>
      </div>
      {/* Emergency Protocol */}
      <div className="bg-error/5 rounded-lg p-6 border border-error/20">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="AlertTriangle" size={20} className="text-error" />
          <h3 className="text-lg font-semibold text-text-primary">Emergency Protocol</h3>
        </div>
        
        <p className="text-sm text-text-secondary mb-4">
          In life-threatening situations, BloodLink AI provides immediate access to emergency blood request services without requiring login credentials.
        </p>
        
        <div className="flex items-center justify-between p-3 bg-error/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Emergency Hotline</span>
          </div>
          <span className="text-sm font-bold text-error">108 / 102</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;