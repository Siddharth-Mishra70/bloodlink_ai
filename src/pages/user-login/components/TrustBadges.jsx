import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustBadges = () => {
  const certifications = [
    {
      id: 1,
      name: 'Ministry of Health & Family Welfare',
      description: 'Government Certified',
      icon: 'Shield',
      verified: true
    },
    {
      id: 2,
      name: 'Indian Medical Association',
      description: 'IMA Approved',
      icon: 'Award',
      verified: true
    },
    {
      id: 3,
      name: 'ISO 27001 Certified',
      description: 'Data Security',
      icon: 'Lock',
      verified: true
    }
  ];

  const hospitalPartners = [
    {
      id: 1,
      name: 'AIIMS Delhi',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=60&fit=crop&crop=center',
      type: 'Premier Institute'
    },
    {
      id: 2,
      name: 'Apollo Hospitals',
      logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=60&fit=crop&crop=center',
      type: 'Healthcare Network'
    },
    {
      id: 3,
      name: 'Fortis Healthcare',
      logo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=100&h=60&fit=crop&crop=center',
      type: 'Medical Chain'
    }
  ];

  const stats = [
    { label: 'Blood Banks Connected', value: '2,500+', icon: 'Building2' },
    { label: 'Lives Saved', value: '50,000+', icon: 'Heart' },
    { label: 'Emergency Requests', value: '24/7', icon: 'Clock' },
    { label: 'Response Time', value: '&lt;5 min', icon: 'Zap' }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Statistics */}
      <div className="bg-card rounded-lg medical-shadow p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
          Trusted by Healthcare Professionals
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat) => (
            <div key={stat?.label} className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mx-auto mb-2">
                <Icon name={stat?.icon} size={20} className="text-primary" />
              </div>
              <div className="text-xl font-bold text-text-primary" dangerouslySetInnerHTML={{ __html: stat?.value }} />
              <div className="text-xs text-text-secondary">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div className="bg-card rounded-lg medical-shadow p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
          Government Certified & Secure
        </h3>
        <div className="space-y-3">
          {certifications?.map((cert) => (
            <div key={cert?.id} className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-full">
                <Icon name={cert?.icon} size={16} className="text-success" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{cert?.name}</div>
                <div className="text-xs text-text-secondary">{cert?.description}</div>
              </div>
              {cert?.verified && (
                <Icon name="CheckCircle" size={16} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Hospital Partners */}
      <div className="bg-card rounded-lg medical-shadow p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
          Trusted Hospital Partners
        </h3>
        <div className="space-y-3">
          {hospitalPartners?.map((partner) => (
            <div key={partner?.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-12 h-8 bg-background rounded overflow-hidden">
                <Image
                  src={partner?.logo}
                  alt={partner?.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{partner?.name}</div>
                <div className="text-xs text-text-secondary">{partner?.type}</div>
              </div>
              <Icon name="ExternalLink" size={14} className="text-text-secondary" />
            </div>
          ))}
        </div>
      </div>
      {/* 24/7 Support */}
      <div className="bg-gradient-to-r from-primary/5 to-success/5 rounded-lg p-6 border border-primary/20">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-3">
            <Icon name="Headphones" size={24} color="white" />
          </div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">24/7 Emergency Support</h4>
          <p className="text-sm text-text-secondary mb-4">
            Our medical support team is available round the clock for emergency blood requests and technical assistance.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="Phone" size={14} className="text-primary" />
              <span className="text-text-primary">1800-BLOOD-AI</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Mail" size={14} className="text-primary" />
              <span className="text-text-primary">help@bloodlink.in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;