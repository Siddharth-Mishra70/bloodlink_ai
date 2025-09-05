import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsPanel = () => {
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
      {/* Main Benefits Section */}
      <div className="bg-card rounded-lg medical-shadow p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3">
            <Icon name="Heart" size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Why Join BloodLink AI?
          </h3>
          <p className="text-text-secondary">
            Experience the future of emergency blood management with AI-powered solutions
          </p>
        </div>

        <div className="space-y-4">
          {benefits?.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-medical">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-background rounded-lg">
                  <Icon name={benefit?.icon} size={20} className={benefit?.color} />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-text-primary mb-1">
                  {benefit?.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Signals Section */}
      <div className="bg-card rounded-lg medical-shadow p-6">
        <div className="text-center mb-4">
          <h4 className="text-lg font-medium text-text-primary mb-2">Trusted & Secure</h4>
          <p className="text-text-secondary text-sm">
            Your safety and privacy are our top priorities
          </p>
        </div>

        <div className="space-y-3">
          {trustSignals?.map((signal, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name={signal?.icon} size={18} className="text-success" />
              <div>
                <h5 className="text-sm font-medium text-text-primary">{signal?.title}</h5>
                <p className="text-xs text-text-secondary">{signal?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Contact Info */}
      <div className="bg-error/5 border border-error/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Phone" size={20} className="text-error mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-1">
              Emergency Helpline
            </h4>
            <p className="text-sm text-text-secondary mb-2">
              24/7 support for critical blood requirements
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-error">1800-BLOOD-AI</span>
              <span className="text-xs text-text-secondary">(1800-256-6324)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsPanel;