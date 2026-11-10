/**
 * @file index.jsx
 * @description New User Registration page for BloodLink AI.
 * Onboards new blood donors, patients, and healthcare coordinators into the platform.
 * Supports standard form registration with phone/blood group capture and Google OAuth sign-in.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import RegistrationForm from './components/RegistrationForm';
import SocialLoginSection from './components/SocialLoginSection';
import BenefitsPanel from './components/BenefitsPanel';

/**
 * UserRegistration Component
 *
 * @component
 * @returns {JSX.Element} Responsive user onboarding page with value propositions.
 */
const UserRegistration = () => {
  const navigate = useNavigate();

  // Async submission state
  const [isLoading, setIsLoading] = useState(false);
  // Multi-step registration flow state ('form' | 'social')
  const [registrationStep, setRegistrationStep] = useState('form');

  useEffect(() => {
    // If user is already authenticated, fast-forward to user dashboard
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/user-dashboard');
    }
  }, [navigate]);

  /**
   * Submits newly registered user profile and initializes application session token.
   * @param {Object} formData - Validated user profile parameters.
   */
  const handleRegistrationSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API network registration delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

      // Store authentication credentials in localStorage
      localStorage.setItem('authToken', 'mock_jwt_token_' + Date.now());
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      alert('Registration successful! Welcome to BloodLink AI.');
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Simulates Google OAuth social registration flow.
   */
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('authToken', 'google_auth_token_' + Date.now());
      navigate('/user-dashboard');
    } catch (err) {
      console.error('Google login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - BloodLink AI | Join the Life-Saving Network</title>
        <meta name="description" content="Register with BloodLink AI to request emergency blood, donate blood, and join India's connected network of blood donors." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                Join the Life-Saving Network
              </h1>
              <p className="text-text-secondary max-w-xl mx-auto text-sm">
                Create an account to quickly dispatch emergency blood requests, locate nearest donor banks, and save lives.
              </p>
            </div>

            {/* 2-Column Responsive Onboarding Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Section (7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                <SocialLoginSection
                  onGoogleLogin={handleGoogleLogin}
                  isLoading={isLoading}
                />

                <RegistrationForm
                  onSubmit={handleRegistrationSubmit}
                  isLoading={isLoading}
                />
              </div>

              {/* Value Propositions & Trust Signals (5 Columns) */}
              <div className="lg:col-span-5">
                <div className="sticky top-24">
                  <BenefitsPanel />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserRegistration;
