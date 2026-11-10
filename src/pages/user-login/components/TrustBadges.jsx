/**
 * @file TrustBadges.jsx
 * @description Institutional trust indicators, government certifications,
 * hospital partner logos (AIIMS Delhi, Apollo, Fortis), and operational metrics.
 */

import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

/**
 * TrustBadges Component
 *
 * @component
 * @returns {JSX.Element} Government accreditation and partner badges panel.
 */
const TrustBadges = () => {
  // Regulatory and medical associations
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

  // Key institutional hospital networks
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

  // High-level operational platform metrics
  const stats = [
    { label: 'Blood Banks Connected', value: '2,500+', icon: 'Building2' },
    { label: 'Lives Saved', value: '50,000+', icon: 'Heart' },
    { label: 'Emergency Requests', value: '24/7', icon: 'Clock' },
    { label: 'Response Time', value: '<5 min', icon: 'Zap' }
  ];

  return (
    <div className="space-y-6">
      {/* Platform Scale Statistics */}
      <div className="bg-card rounded-lg medical-shadow p-6 border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Trusted Across India</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-surface border border-border">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 text-primary bg-primary/10 rounded-full">
                <Icon name={stat?.icon} size={16} />
              </div>
              <div className="text-lg font-bold text-text-primary">{stat?.value}</div>
              <div className="text-[11px] text-text-secondary">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Card */}
      <div className="bg-card rounded-lg medical-shadow p-6 border border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Accreditations</h4>
        <div className="space-y-3">
          {certifications?.map((cert) => (
            <div key={cert?.id} className="flex items-center space-x-3">
              <Icon name={cert?.icon} size={16} className="text-primary flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-text-primary">{cert?.name}</div>
                <div className="text-[10px] text-text-secondary">{cert?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
