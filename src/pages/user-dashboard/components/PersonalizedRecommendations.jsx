/**
 * @file PersonalizedRecommendations.jsx
 * @description Tailored donor health suggestions, nearby high-stock blood centers,
 * and upcoming local donation drive events matching the user's blood type and geographic area.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * PersonalizedRecommendations Component
 *
 * @component
 * @returns {JSX.Element} Tailored blood bank matches and donor health suggestions.
 */
const PersonalizedRecommendations = () => {
  const navigate = useNavigate();

  // Recommendations state
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Populate recommendations data
    const timer = setTimeout(() => {
      setRecommendations({
        nearbyBloodBanks: [
          {
            id: 1,
            name: "Swaroop Rani Nehru (SRN) Hospital",
            distance: "1.2 km",
            availability: { "O+": 32, "O-": 14, "A+": 25, "B+": 20 },
            rating: 4.8,
            responseTime: "12 minutes",
            address: "MG Marg, George Town, Prayagraj"
          },
          {
            id: 2,
            name: "Jeevan Jyoti Hospital Blood Bank",
            distance: "2.1 km",
            availability: { "O+": 22, "O-": 8, "A+": 18, "B+": 14 },
            rating: 4.7,
            responseTime: "15 minutes",
            address: "Lowther Road, Prayagraj"
          }
        ],
        donationCamps: [
          {
            id: 1,
            title: "Prayagraj Youth Blood Donation Drive",
            date: "Every Saturday & Sunday",
            location: "MNNIT Campus, Teliarganj, Prayagraj",
            organizer: "Prayagraj Red Cross & SRN Blood Centre"
          }
        ]
      });
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 medical-shadow animate-pulse">
        <div className="h-4 bg-muted rounded w-48 mb-4" />
        <div className="h-24 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Sparkles" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Recommended for You</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Nearby Blood Centers */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Nearby Centers with Stock</h4>
          <div className="space-y-3">
            {recommendations?.nearbyBloodBanks?.map((bank) => (
              <div key={bank?.id} className="p-3.5 border border-border rounded-lg bg-surface">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm text-text-primary">{bank?.name}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{bank?.address} ({bank?.distance})</div>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => navigate('/blood-bank-search')}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Donation Drives */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Upcoming Donation Camps</h4>
          <div className="space-y-3">
            {recommendations?.donationCamps?.map((camp) => (
              <div key={camp?.id} className="p-3.5 border border-border rounded-lg bg-surface">
                <div className="font-semibold text-sm text-text-primary">{camp?.title}</div>
                <div className="text-xs text-text-secondary mt-1 flex items-center gap-2">
                  <Icon name="Calendar" size={12} />
                  <span>{camp?.date}</span>
                </div>
                <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-2">
                  <Icon name="MapPin" size={12} />
                  <span>{camp?.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
