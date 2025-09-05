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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BloodBankDashboard />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/blood-bank-search" element={<BloodBankSearch />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/blood-bank-dashboard" element={<BloodBankDashboard />} />
        <Route path="/emergency-blood-request" element={<EmergencyBloodRequest />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
