import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const UserProfileCard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user profile data
    setTimeout(() => {
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
        memberSince: new Date(2023, 5, 15), // June 15, 2023
        verificationStatus: "Verified",
        emergencyContact: {
          name: "Priya Kumar",
          relation: "Spouse",
          phone: "+91 9876543211"
        },
        medicalInfo: {
          allergies: ["Penicillin"],
          chronicConditions: [],
          lastCheckup: new Date(2024, 11, 1), // December 1, 2024
          weight: "75 kg",
          height: "5'8\""
        },
        donationHistory: {
          totalDonations: 3,
          lastDonation: new Date(Date.now() - 86400000 * 90), // 90 days ago
          nextEligibleDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
          eligibleToDonate: false
        },
        preferences: {
          notifications: true,
          locationSharing: true,
          emergencyAlerts: true
        }
      });
      setLoading(false);
    }, 600);
  }, []);

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getMembershipDuration = () => {
    if (!userProfile?.memberSince) return '';
    const years = new Date()?.getFullYear() - userProfile?.memberSince?.getFullYear();
    const months = new Date()?.getMonth() - userProfile?.memberSince?.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${Math.max(1, months)} month${months > 1 ? 's' : ''}`;
  };

  const getVerificationColor = (status) => {
    const colors = {
      'Verified': 'text-green-700 bg-green-100 border-green-300',
      'Pending': 'text-yellow-700 bg-yellow-100 border-yellow-300',
      'Unverified': 'text-red-700 bg-red-100 border-red-300'
    };
    return colors?.[status] || 'text-gray-700 bg-gray-100 border-gray-300';
  };

  const getVerificationIcon = (status) => {
    const icons = {
      'Verified': 'CheckCircle',
      'Pending': 'Clock',
      'Unverified': 'AlertCircle'
    };
    return icons?.[status] || 'Circle';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-spin">
            <Icon name="Loader2" size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Loading Profile...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Icon name="User" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">My Profile</h3>
            <p className="text-sm text-gray-600">Personal information and settings</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/user-profile')}
          iconName="Edit"
          iconPosition="left"
        >
          Edit
        </Button>
      </div>
      {/* Profile Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative">
          <Image
            src={userProfile?.avatar}
            alt={userProfile?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <Icon name="Check" size={12} color="white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-xl font-semibold text-gray-800">{userProfile?.name}</h4>
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getVerificationColor(userProfile?.verificationStatus)}`}>
              <Icon name={getVerificationIcon(userProfile?.verificationStatus)} size={12} />
              <span>{userProfile?.verificationStatus}</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{userProfile?.email}</p>
          <p className="text-sm text-gray-600">{userProfile?.phone}</p>
        </div>
      </div>
      {/* Key Information */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Droplets" size={16} className="text-red-600" />
            <span className="text-sm font-medium text-red-800">Blood Type</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-700">{userProfile?.bloodType}</span>
            <div className="text-xs text-red-600">
              <p>Universal Donor</p>
              <p>High Demand</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MapPin" size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Location</span>
          </div>
          <p className="text-sm text-blue-700">{userProfile?.location?.city}, {userProfile?.location?.state}</p>
          <p className="text-xs text-blue-600">PIN: {userProfile?.location?.pincode}</p>
        </div>
      </div>
      {/* Personal Details */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Icon name="Calendar" size={16} className="text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-800">{userProfile?.age} years</p>
          <p className="text-xs text-gray-600">Age</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Icon name="User" size={16} className="text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-800">{userProfile?.gender}</p>
          <p className="text-xs text-gray-600">Gender</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Icon name="Clock" size={16} className="text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-800">{getMembershipDuration()}</p>
          <p className="text-xs text-gray-600">Member Since</p>
        </div>
      </div>
      {/* Emergency Contact */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Phone" size={16} className="text-orange-600" />
          <span className="text-sm font-medium text-orange-800">Emergency Contact</span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-medium text-gray-800">{userProfile?.emergencyContact?.name}</p>
            <p className="text-xs text-gray-600">{userProfile?.emergencyContact?.relation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">{userProfile?.emergencyContact?.phone}</p>
          </div>
        </div>
      </div>
      {/* Donation Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">Donation History</span>
          </div>
          <span className="text-sm font-bold text-green-700">
            {userProfile?.donationHistory?.totalDonations} donations
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-green-700 mb-1">Last Donation</p>
            <p className="text-sm font-medium text-gray-800">
              {formatDate(userProfile?.donationHistory?.lastDonation)}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700 mb-1">Next Eligible</p>
            <p className="text-sm font-medium text-gray-800">
              {formatDate(userProfile?.donationHistory?.nextEligibleDate)}
            </p>
          </div>
        </div>
        {!userProfile?.donationHistory?.eligibleToDonate && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
            <Icon name="Clock" size={12} className="inline mr-1" />
            You can donate again in 30 days
          </div>
        )}
      </div>
      {/* Quick Settings */}
      <div className="pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-800 mb-3">Quick Settings</h5>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(userProfile?.preferences)?.map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              <span className="text-gray-700 capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.trim()}
              </span>
              <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;