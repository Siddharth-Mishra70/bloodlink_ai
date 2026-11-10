/**
 * @file index.jsx
 * @description User Dashboard page for BloodLink AI.
 * Personal portal for registered donors and patients to monitor active blood requests,
 * track donation eligibility history, inspect personalized AI health recommendations,
 * and initiate 24/7 one-click emergency blood requisitions.
 */

import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAccessCard from './components/EmergencyAccessCard';
import RequestStatusPanel from './components/RequestStatusPanel';
import RecentRequestHistory from './components/RecentRequestHistory';
import PersonalizedRecommendations from './components/PersonalizedRecommendations';
import QuickActionsPanel from './components/QuickActionsPanel';
import UserProfileCard from './components/UserProfileCard';

/**
 * UserDashboard Component
 *
 * @component
 * @returns {JSX.Element} Comprehensive donor and patient portal.
 */
const UserDashboard = () => {
  useEffect(() => {
    document.title = 'User Dashboard - BloodLink AI';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Greeting & Live System Online Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary mb-2">
                  Welcome to Your Dashboard
                </h1>
                <p className="text-text-secondary">
                  Manage your blood requests, track donations, and access emergency services
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-text-secondary">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>

          {/* Quick Emergency Requisition Callout Banner */}
          <div className="mb-8">
            <EmergencyAccessCard />
          </div>

          {/* Main 2-Column Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left 2 Columns - Active Request Queue & Past Request History */}
            <div className="lg:col-span-2 space-y-8">
              <RequestStatusPanel />
              <RecentRequestHistory />
            </div>

            {/* Right Column - User Profile Card & Quick Action Shortcuts */}
            <div className="space-y-8">
              <UserProfileCard />
              <QuickActionsPanel />
            </div>
          </div>

          {/* AI-Powered Personalized Recommendations Section */}
          <div className="mt-8">
            <PersonalizedRecommendations />
          </div>

          {/* Value Proposition Highlights Strip */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-6 border border-border medical-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
                  <span className="text-xl font-bold text-red-600">24/7</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Emergency Service</h3>
                <p className="text-sm text-text-secondary">
                  Round-the-clock blood request processing and emergency response
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-border medical-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">AI</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Smart Predictions</h3>
                <p className="text-sm text-text-secondary">
                  AI-powered shortage alerts and demand forecasting for better planning
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-border medical-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <span className="text-xl font-bold text-green-600">100+</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Blood Banks</h3>
                <p className="text-sm text-text-secondary">
                  Connected network of verified blood banks across India
                </p>
              </div>
            </div>
          </div>

          {/* Emergency 24/7 National Hotlines Banner */}
          <div className="mt-8 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">Emergency Helpline</h3>
            <p className="text-red-100 mb-4">
              For immediate medical emergencies, call our 24/7 helpline
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-xl">108</span>
                <span className="text-red-100">Ambulance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-xl">1800-123-4567</span>
                <span className="text-red-100">BloodLink Support</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
