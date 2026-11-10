/**
 * @file UserProfileCard.jsx
 * @description User profile overview widget displaying verified donor credentials,
 * blood type, donation counts, next donation eligibility countdown, and emergency contact details.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

/**
 * UserProfileCard Component
 *
 * @component
 * @returns {JSX.Element} User profile details card with donor statistics.
 */
const UserProfileCard = () => {
  const navigate = useNavigate();

  // Active user profile record
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Populate mock user profile
    const timer = setTimeout(() => {
      setUserProfile({
        id: "USR-2025-001",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "+91 9876543210",
        bloodType: "O+",
        age: 32,
        gender: "Male",
        location: {
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201301"
        },
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        memberSince: new Date(2023, 5, 15),
        verificationStatus: "Verified",
        emergencyContact: {
          name: "Priya Kumar",
          relation: "Spouse",
          phone: "+91 9876543211"
        },
        donationHistory: {
          totalDonations: 3,
          lastDonation: new Date(Date.now() - 86400000 * 90),
          nextEligibleDate: new Date(Date.now() + 86400000 * 30),
          eligibleToDonate: false
        }
      });
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 medical-shadow animate-pulse">
        <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4" />
        <div className="h-4 bg-muted rounded w-32 mx-auto mb-2" />
        <div className="h-3 bg-muted rounded w-48 mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      {/* Top Profile Summary */}
      <div className="text-center pb-4 border-b border-border">
        <div className="relative inline-block mb-3">
          <Image
            src={userProfile?.avatar}
            alt={userProfile?.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary mx-auto"
          />
          <span className="absolute bottom-0 right-0 bg-success text-white p-1 rounded-full text-xs">
            <Icon name="Check" size={12} />
          </span>
        </div>

        <h3 className="font-bold text-lg text-text-primary">{userProfile?.name}</h3>
        <p className="text-xs text-text-secondary">{userProfile?.location?.city}, {userProfile?.location?.state}</p>

        {/* Blood Group Tag */}
        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-primary/10 text-primary font-bold text-sm rounded-full">
          <Icon name="Droplet" size={14} />
          <span>Blood Group: {userProfile?.bloodType}</span>
        </div>
      </div>

      {/* Donor Statistics */}
      <div className="py-4 border-b border-border grid grid-cols-2 gap-4 text-center">
        <div className="p-2 bg-muted/30 rounded">
          <div className="text-xl font-bold text-text-primary">{userProfile?.donationHistory?.totalDonations}</div>
          <div className="text-[11px] text-text-secondary">Total Donations</div>
        </div>
        <div className="p-2 bg-muted/30 rounded">
          <div className={`text-xs font-bold mt-1 ${userProfile?.donationHistory?.eligibleToDonate ? 'text-success' : 'text-warning'}`}>
            {userProfile?.donationHistory?.eligibleToDonate ? 'Eligible Now' : 'In 30 Days'}
          </div>
          <div className="text-[11px] text-text-secondary mt-1">Donation Status</div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="pt-4 text-xs text-text-secondary space-y-2">
        <div className="font-semibold text-text-primary">Emergency Contact:</div>
        <div className="flex items-center justify-between">
          <span>{userProfile?.emergencyContact?.name} ({userProfile?.emergencyContact?.relation})</span>
          <span className="font-medium text-text-primary">{userProfile?.emergencyContact?.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
