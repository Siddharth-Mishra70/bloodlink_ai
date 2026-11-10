/**
 * @file Routes.jsx
 * @description Centralized routing configuration for BloodLink AI.
 * Handles client-side navigation between user authentication, dashboards,
 * blood bank searches, and emergency blood request management.
 */

import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import BloodBankSearch from './pages/blood-bank-search';
import UserDashboard from './pages/user-dashboard';
import BloodBankDashboard from './pages/blood-bank-dashboard';
import EmergencyBloodRequest from './pages/emergency-blood-request';
import UserRegistration from './pages/user-registration';

/**
 * Routes Component
 * Wraps routes inside BrowserRouter, ErrorBoundary, and ScrollToTop helper.
 *
 * Route Map:
 * - `/` : Primary Blood Bank Dashboard view
 * - `/user-login` : Donor & recipient authentication screen
 * - `/blood-bank-search` : Search and locate blood banks with inventory filters
 * - `/user-dashboard` : Personalized user portal for requests & donation history
 * - `/blood-bank-dashboard` : Administrative dashboard for blood bank managers
 * - `/emergency-blood-request` : Urgent blood dispatch and AI triage portal
 * - `/user-registration` : New donor / recipient registration
 * - `*` : 404 Fallback page
 *
 * @returns {JSX.Element} React Router routing tree
 */
const Routes = () => {
  return (
    <BrowserRouter>
      {/* Catches unhandled runtime render errors gracefully */}
      <ErrorBoundary>
        {/* Resets scroll position to top on route change */}
        <ScrollToTop />
        <RouterRoutes>
          {/* Main landing & administrative overview */}
          <Route path="/" element={<BloodBankDashboard />} />

          {/* Authentication & User onboarding */}
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-registration" element={<UserRegistration />} />

          {/* Discovery & Search */}
          <Route path="/blood-bank-search" element={<BloodBankSearch />} />

          {/* User & Blood Bank Portals */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/blood-bank-dashboard" element={<BloodBankDashboard />} />

          {/* Emergency Workflow */}
          <Route path="/emergency-blood-request" element={<EmergencyBloodRequest />} />

          {/* 404 Not Found Catch-all */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
