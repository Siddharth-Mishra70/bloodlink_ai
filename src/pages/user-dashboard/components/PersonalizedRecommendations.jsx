import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PersonalizedRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user profile and recommendations data
    setTimeout(() => {
      setUserProfile({
        bloodType: "O+",
        location: "Noida, Uttar Pradesh",
        lastDonation: new Date(Date.now() - 86400000 * 90), // 90 days ago
        eligibleToDonate: true
      });

      setRecommendations({
        nearbyBloodBanks: [
          {
            id: 1,
            name: "Apollo Blood Bank",
            distance: "1.2 km",
            availability: {
              "O+": 15,
              "O-": 8,
              "A+": 12,
              "B+": 10
            },
            rating: 4.8,
            responseTime: "15 minutes",
            address: "Sector 18, Noida"
          },
          {
            id: 2,
            name: "Max Healthcare Blood Center",
            distance: "2.1 km",
            availability: {
              "O+": 22,
              "O-": 5,
              "A+": 18,
              "B+": 14
            },
            rating: 4.7,
            responseTime: "20 minutes",
            address: "Sector 19, Noida"
          },
          {
            id: 3,
            name: "Fortis Blood Center",
            distance: "3.5 km",
            availability: {
              "O+": 8,
              "O-": 12,
              "A+": 6,
              "B+": 9
            },
            rating: 4.6,
            responseTime: "25 minutes",
            address: "Sector 62, Noida"
          }
        ],
        donationOpportunities: [
          {
            id: 1,
            type: "Blood Donation Camp",
            organizer: "Red Cross Society",
            date: new Date(Date.now() + 86400000 * 3), // 3 days from now
            location: "Community Center, Sector 15",
            urgentNeed: ["O+", "B-"],
            incentives: ["Health checkup", "Certificate", "Refreshments"]
          },
          {
            id: 2,
            type: "Hospital Drive",
            organizer: "AIIMS Delhi",
            date: new Date(Date.now() + 86400000 * 7), // 7 days from now
            location: "AIIMS Blood Bank",
            urgentNeed: ["O-", "AB-"],
            incentives: ["Free blood tests", "Health screening"]
          }
        ],
        shortageAlerts: [
          {
            bloodType: "O+",
            severity: "Medium",
            affectedBanks: 3,
            estimatedShortage: "2-3 days",
            recommendation: "Consider donating if eligible"
          },
          {
            bloodType: "B-",
            severity: "High",
            affectedBanks: 5,
            estimatedShortage: "1-2 days",
            recommendation: "Critical shortage - immediate donation needed"
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getAvailabilityColor = (count) => {
    if (count >= 15) return 'text-green-700 bg-green-100';
    if (count >= 8) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'High': 'text-red-700 bg-red-100 border-red-300',
      'Medium': 'text-yellow-700 bg-yellow-100 border-yellow-300',
      'Low': 'text-green-700 bg-green-100 border-green-300'
    };
    return colors?.[severity] || 'text-gray-700 bg-gray-100 border-gray-300';
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const canDonate = () => {
    if (!userProfile?.lastDonation) return true;
    const daysSinceLastDonation = Math.floor((Date.now() - userProfile?.lastDonation?.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastDonation >= 56; // 8 weeks minimum gap
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-spin">
            <Icon name="Loader2" size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Loading Recommendations...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Nearby Blood Banks */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Icon name="MapPin" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Nearby Blood Banks</h3>
              <p className="text-sm text-gray-600">Current inventory levels</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/blood-bank-search')}
            iconName="Search"
            iconPosition="left"
          >
            View All
          </Button>
        </div>

        <div className="grid gap-4">
          {recommendations?.nearbyBloodBanks?.map((bank) => (
            <div key={bank?.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-medical">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">{bank?.name}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{bank?.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-yellow-500" />
                      <span className="text-sm text-gray-600">{bank?.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{bank?.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {Object.entries(bank?.availability)?.map(([bloodType, count]) => (
                  <div key={bloodType} className="text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getAvailabilityColor(count)}`}>
                      {bloodType}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{count} units</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">{bank?.address}</span>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Phone"
                  iconPosition="left"
                >
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Donation Opportunities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <Icon name="Heart" size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Donation Opportunities</h3>
              <p className="text-sm text-gray-600">Help save lives in your area</p>
            </div>
          </div>
          {canDonate() && (
            <div className="flex items-center space-x-2 text-green-700">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">Eligible to donate</span>
            </div>
          )}
        </div>

        {!canDonate() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Donation Eligibility</p>
                <p className="text-xs text-yellow-700">
                  You can donate again after {formatDate(new Date(userProfile.lastDonation.getTime() + 86400000 * 56))}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {recommendations?.donationOpportunities?.map((opportunity) => (
            <div key={opportunity?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">{opportunity?.type}</h4>
                  <p className="text-sm text-gray-600">by {opportunity?.organizer}</p>
                </div>
                <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  {formatDate(opportunity?.date)}
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <Icon name="MapPin" size={14} className="text-gray-500" />
                <span className="text-sm text-gray-700">{opportunity?.location}</span>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Urgent Need:</p>
                <div className="flex items-center space-x-2">
                  {opportunity?.urgentNeed?.map((bloodType) => (
                    <span key={bloodType} className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      {bloodType}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Benefits:</p>
                <div className="flex flex-wrap gap-1">
                  {opportunity?.incentives?.map((incentive, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {incentive}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Info"
                  iconPosition="left"
                >
                  Learn More
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={!canDonate()}
                  iconName="Heart"
                  iconPosition="left"
                >
                  Register to Donate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Shortage Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 medical-shadow">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
            <Icon name="AlertTriangle" size={20} className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">AI Shortage Alerts</h3>
            <p className="text-sm text-gray-600">Predicted shortages in your area</p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations?.shortageAlerts?.map((alert, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(alert?.severity)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                    <span className="text-sm font-bold text-red-700">{alert?.bloodType}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Blood Type {alert?.bloodType}</p>
                    <p className="text-sm text-gray-600">{alert?.affectedBanks} blood banks affected</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getSeverityColor(alert?.severity)}`}>
                  {alert?.severity} Priority
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-gray-600" />
                  <span className="text-sm text-gray-700">Shortage in {alert?.estimatedShortage}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingDown" size={14} className="text-gray-600" />
                  <span className="text-sm text-gray-700">AI Prediction</span>
                </div>
              </div>

              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800 mb-1">Recommendation:</p>
                <p className="text-sm text-gray-700">{alert?.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;