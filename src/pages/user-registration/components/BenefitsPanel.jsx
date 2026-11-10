/**
 * @file BenefitsPanel.jsx
 * @description Promotional sidebar presenting community benefits and platform value:
 * 24/7 Emergency Blood Access, Real-Time Request Tracking, Smart Predictive Alerts,
 * and Ministry of Health compliance signals.
 */

import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * BenefitsPanel Component
 *
 * @component
 * @returns {JSX.Element} Value propositions and trust badge list.
 */
const BenefitsPanel = () => {
  // Platform capabilities list
  const benefits = [
    {
      icon: 'AlertTriangle',
      title: 'Emergency Blood Access',
      description: 'Get instant access to emergency blood requests with real-time availability across nearby blood banks.',
      color: 'text-error'
    },
    {
      icon: 'MapPin',
      title: 'Find Nearby Blood Banks',
      description: 'Locate blood banks in your area with live inventory updates and contact information.',
      color: 'text-primary'
    },
    {
      icon: 'Activity',
      title: 'Request Tracking',
      description: 'Track your blood requests in real-time from submission to fulfillment with status updates.',
      color: 'text-success'
    },
    {
      icon: 'Bell',
      title: 'Smart Notifications',
      description: 'Receive AI-powered alerts about blood availability and emergency requests in your area.',
      color: 'text-warning'
    },
    {
      icon: 'Users',
      title: 'Community Network',
      description: 'Connect with a network of donors and recipients to help save lives in your community.',
      color: 'text-secondary'
    },
    {
      icon: 'BarChart3',
      title: 'Analytics & Reports',
      description: 'Access detailed reports and analytics about blood availability trends and demand forecasting.',
      color: 'text-primary'
    }
  ];

  // Regulatory trust signals
  const trustSignals = [
    {
      icon: 'Shield',
      title: 'Government Certified',
      description: 'Approved by Ministry of Health & Family Welfare'
    },
    {
      icon: 'Award',
      title: 'Medical Grade Security',
      description: 'HIPAA compliant data protection standards'
    },
    {
      icon: 'Users',
      title: '50,000+ Active Users',
      description: 'Trusted by patients and healthcare providers'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Platform Features Card */}
      <div className="bg-card rounded-lg medical-shadow p-6 border border-border">
        <h3 className="text-lg font-bold text-text-primary mb-4">Why Join BloodLink AI?</h3>
        <div className="space-y-4">
          {benefits?.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-muted/40 mt-0.5">
                <Icon name={item?.icon} size={18} className={item?.color} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">{item?.title}</h4>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Accreditations Card */}
      <div className="bg-card rounded-lg medical-shadow p-6 border border-border">
        <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">
          Compliance & Trust
        </h3>
        <div className="space-y-3">
          {trustSignals?.map((signal, idx) => (
            <div key={idx} className="flex items-center space-x-3 text-xs">
              <Icon name={signal?.icon} size={16} className="text-primary flex-shrink-0" />
              <div>
                <div className="font-semibold text-text-primary">{signal?.title}</div>
                <div className="text-[11px] text-text-secondary">{signal?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsPanel;
