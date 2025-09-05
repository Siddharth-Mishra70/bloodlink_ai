import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LoginForm from './components/LoginForm';
import TrustBadges from './components/TrustBadges';
import SecurityFeatures from './components/SecurityFeatures';

const UserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const session = JSON.parse(userSession);
      // Redirect based on user type or to dashboard
      if (session?.email?.includes('admin')) {
        navigate('/admin');
      } else if (session?.email?.includes('staff')) {
        navigate('/blood-bank-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }

    // Set page title
    document.title = 'User Login - BloodLink AI | Secure Access to Emergency Blood Services';
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Secure Access to Life-Saving Services
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Sign in to your BloodLink AI account to access emergency blood services, 
                track requests, and connect with verified blood banks across India.
              </p>
            </div>

            {/* Main Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Trust Badges */}
              <div className="lg:order-1">
                <div className="sticky top-24">
                  <TrustBadges />
                </div>
              </div>

              {/* Center Column - Login Form */}
              <div className="lg:order-2">
                <LoginForm />
              </div>

              {/* Right Column - Security Features */}
              <div className="lg:order-3">
                <div className="sticky top-24">
                  <SecurityFeatures />
                </div>
              </div>
            </div>

            {/* Bottom Section - Additional Information */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {/* Quick Access */}
              <div className="bg-card rounded-lg medical-shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Quick Access</h3>
                </div>
                <p className="text-text-secondary text-sm mb-4">
                  Access your dashboard, view request history, and manage your profile with secure authentication.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>View blood availability in real-time</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Track emergency request status</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Manage notification preferences</span>
                  </div>
                </div>
              </div>

              {/* Emergency Services */}
              <div className="bg-card rounded-lg medical-shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
                    <span className="text-error font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Emergency Services</h3>
                </div>
                <p className="text-text-secondary text-sm mb-4">
                  Access critical blood services 24/7 with our emergency response system and AI-powered matching.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-error rounded-full"></div>
                    <span>Instant emergency blood requests</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-error rounded-full"></div>
                    <span>AI-powered blood bank matching</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-error rounded-full"></div>
                    <span>Real-time ambulance coordination</span>
                  </div>
                </div>
              </div>

              {/* Support Network */}
              <div className="bg-card rounded-lg medical-shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <span className="text-success font-bold text-sm">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Support Network</h3>
                </div>
                <p className="text-text-secondary text-sm mb-4">
                  Connect with a nationwide network of verified blood banks, hospitals, and healthcare professionals.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>2,500+ verified blood banks</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>24/7 medical support team</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span>Multi-language support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-center">
              <p className="text-sm text-text-secondary">
                BloodLink AI is committed to saving lives through technology. 
                Our platform connects patients with blood banks in critical situations, 
                ensuring no life is lost due to blood unavailability.
              </p>
              <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-text-secondary">
                <span>© {new Date()?.getFullYear()} BloodLink AI</span>
                <span>•</span>
                <span>Made in India</span>
                <span>•</span>
                <span>Saving Lives Since 2024</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLogin;