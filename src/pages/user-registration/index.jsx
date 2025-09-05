import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import RegistrationForm from './components/RegistrationForm';
import SocialLoginSection from './components/SocialLoginSection';
import BenefitsPanel from './components/BenefitsPanel';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStep, setRegistrationStep] = useState('form');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/user-dashboard');
    }
  }, [navigate]);

  const handleRegistrationSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Mock registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      const mockUserData = {
        id: 'user_' + Date.now(),
        fullName: formData?.fullName,
        email: formData?.email,
        phone: formData?.phone,
        bloodGroup: formData?.bloodGroup,
        location: formData?.location,
        pinCode: formData?.pinCode,
        registeredAt: new Date()?.toISOString(),
        isVerified: false
      };

      // Store user data and token
      localStorage.setItem('authToken', 'mock_jwt_token_' + Date.now());
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      // Show success message
      alert('Registration successful! Welcome to BloodLink AI.');
      
      // Redirect to dashboard
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Mock Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Google user data
      const mockGoogleUser = {
        id: 'google_user_' + Date.now(),
        fullName: 'John Doe',
        email: 'john.doe@gmail.com',
        phone: '',
        bloodGroup: '',
        location: '',
        pinCode: '',
        registeredAt: new Date()?.toISOString(),
        isVerified: true,
        provider: 'google'
      };

      // Store user data and token
      localStorage.setItem('authToken', 'google_jwt_token_' + Date.now());
      localStorage.setItem('userData', JSON.stringify(mockGoogleUser));
      
      alert('Google registration successful! Please complete your profile.');
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Google registration error:', error);
      alert('Google registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>User Registration - BloodLink AI | Emergency Blood Management</title>
        <meta name="description" content="Create your BloodLink AI account to access emergency blood services, find nearby blood banks, and track blood requests in real-time." />
        <meta name="keywords" content="blood bank registration, emergency blood, user account, BloodLink AI, blood donation" />
        <meta property="og:title" content="User Registration - BloodLink AI" />
        <meta property="og:description" content="Join BloodLink AI to access emergency blood services and connect with nearby blood banks." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Join BloodLink AI Community
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Create your account to access emergency blood services, connect with nearby blood banks, 
                  and help save lives in your community.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Benefits Panel (Hidden on mobile) */}
                <div className="hidden lg:block lg:col-span-1">
                  <BenefitsPanel />
                </div>

                {/* Center Column - Registration Forms */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Social Login Section */}
                  <SocialLoginSection 
                    onGoogleLogin={handleGoogleLogin}
                    isLoading={isLoading}
                  />
                  
                  {/* Main Registration Form */}
                  <RegistrationForm 
                    onSubmit={handleRegistrationSubmit}
                    isLoading={isLoading}
                  />
                </div>

                {/* Right Column - Additional Info (Mobile: Below forms) */}
                <div className="lg:col-span-1">
                  {/* Mobile Benefits Panel */}
                  <div className="lg:hidden mb-6">
                    <BenefitsPanel />
                  </div>

                  {/* Desktop Additional Info */}
                  <div className="hidden lg:block space-y-6">
                    <div className="bg-card rounded-lg medical-shadow p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Getting Started
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-medium">
                            1
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-text-primary">Create Account</h4>
                            <p className="text-xs text-text-secondary">Register with your details or use Google</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-medium">
                            2
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-text-primary">Verify Profile</h4>
                            <p className="text-xs text-text-secondary">Complete your profile and verify contact details</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-medium">
                            3
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-text-primary">Start Using</h4>
                            <p className="text-xs text-text-secondary">Access emergency services and blood bank search</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/5 to-success/5 border border-primary/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-3">
                        Need Help?
                      </h3>
                      <p className="text-sm text-text-secondary mb-4">
                        Our support team is available 24/7 to assist you with registration and platform usage.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-text-secondary">Email:</span>
                          <span className="text-primary">support@bloodlink.ai</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-text-secondary">Phone:</span>
                          <span className="text-primary">1800-BLOOD-AI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Additional Info */}
              <div className="lg:hidden mt-8 space-y-6">
                <div className="bg-card rounded-lg medical-shadow p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
                    Getting Started
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full text-lg font-medium mx-auto mb-2">
                        1
                      </div>
                      <h4 className="text-sm font-medium text-text-primary mb-1">Create Account</h4>
                      <p className="text-xs text-text-secondary">Register with your details</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full text-lg font-medium mx-auto mb-2">
                        2
                      </div>
                      <h4 className="text-sm font-medium text-text-primary mb-1">Verify Profile</h4>
                      <p className="text-xs text-text-secondary">Complete verification</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full text-lg font-medium mx-auto mb-2">
                        3
                      </div>
                      <h4 className="text-sm font-medium text-text-primary mb-1">Start Using</h4>
                      <p className="text-xs text-text-secondary">Access all services</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-text-secondary text-sm">
                © {new Date()?.getFullYear()} BloodLink AI. All rights reserved. | 
                <span className="ml-1">Saving lives through technology</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserRegistration;