/**
 * @file index.jsx
 * @description User Authentication login screen for BloodLink AI.
 * Handles credential-based login for patients, laboratory staff, and system administrators.
 * Highlights medical compliance certifications (ISO 27001, HIPAA) and institutional partners.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LoginForm from './components/LoginForm';
import TrustBadges from './components/TrustBadges';
import SecurityFeatures from './components/SecurityFeatures';

/**
 * UserLogin Component
 *
 * @component
 * @returns {JSX.Element} Authentication login page with trust badges and security information.
 */
const UserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated in localStorage session, redirect to target dashboard
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const session = JSON.parse(userSession);
        if (session?.email?.includes('admin')) {
          navigate('/admin');
        } else if (session?.email?.includes('staff')) {
          navigate('/blood-bank-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (err) {
        localStorage.removeItem('userSession');
      }
    }

    document.title = 'User Login - BloodLink AI | Secure Access to Emergency Blood Services';
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

            {/* 3-Column Responsive Authentication Workspace */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Government & Healthcare Trust Badges */}
              <div className="lg:order-1">
                <div className="sticky top-24">
                  <TrustBadges />
                </div>
              </div>

              {/* Center Column: Interactive Login Form */}
              <div className="lg:order-2">
                <LoginForm />
              </div>

              {/* Right Column: Encryption, HIPAA & Privacy Guidelines */}
              <div className="lg:order-3">
                <div className="sticky top-24">
                  <SecurityFeatures />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLogin;
