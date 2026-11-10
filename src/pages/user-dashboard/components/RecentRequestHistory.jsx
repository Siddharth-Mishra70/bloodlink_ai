/**
 * @file RecentRequestHistory.jsx
 * @description Archive table displaying completed, fulfilled, or declined blood requisitions.
 * Allows users to audit historical requests, fulfilled dates, and dispatch notes.
 */

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * RecentRequestHistory Component
 *
 * @component
 * @returns {JSX.Element} Historical requests archive table.
 */
const RecentRequestHistory = () => {
  // Archived past requests
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Populate historical requests dataset
    const timer = setTimeout(() => {
      setRecentRequests([
        {
          id: "REQ-PRG-156",
          bloodType: "B+",
          quantity: 1,
          urgency: "Normal",
          status: "Fulfilled",
          requestedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
          fulfilledAt: new Date(Date.now() - 86400000 * 2 + 3600000), // 2 days ago + 1 hour
          bloodBank: "Tej Bahadur Sapru (Beli) Hospital",
          location: "Stanley Road, Prayagraj",
          patientName: "Satish Shukla",
          hospitalName: "Beli Hospital, Prayagraj"
        },
        {
          id: "REQ-PRG-142",
          bloodType: "O+",
          quantity: 2,
          urgency: "Urgent",
          status: "Fulfilled",
          requestedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
          fulfilledAt: new Date(Date.now() - 86400000 * 7 + 7200000), // 7 days ago + 2 hours
          bloodBank: "Jeevan Jyoti Hospital Blood Bank",
          location: "Lowther Road, Prayagraj",
          patientName: "Meena Devi",
          hospitalName: "Jeevan Jyoti Hospital"
        },
        {
          id: "REQ-PRG-128",
          bloodType: "A-",
          quantity: 1,
          urgency: "Critical",
          status: "Declined",
          requestedAt: new Date(Date.now() - 86400000 * 14), // 14 days ago
          bloodBank: "Swaroop Rani Nehru (SRN) Hospital",
          location: "George Town, Prayagraj",
          patientName: "Harish Chandra",
          hospitalName: "SRN Trauma Centre, Prayagraj",
          declineReason: "Blood type temporarily allocated to emergency OT",
          alternativeProvided: "Referred to Jeevan Jyoti Blood Bank"
        },
        {
          id: "REQ-2024-115",
          bloodType: "AB+",
          quantity: 1,
          urgency: "Normal",
          status: "Fulfilled",
          requestedAt: new Date(Date.now() - 86400000 * 21), // 21 days ago
          fulfilledAt: new Date(Date.now() - 86400000 * 21 + 1800000), // 21 days ago + 30 minutes
          bloodBank: "Kamla Nehru Memorial Hospital (KNMH)",
          location: "Tagore Town, Prayagraj",
          patientName: "Dr. Alok Banerjee",
          hospitalName: "KNMH, Prayagraj"
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-6 medical-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="History" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Request History</h3>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3]?.map(i => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : recentRequests?.length === 0 ? (
        <p className="text-sm text-text-secondary py-4 text-center">No past requests recorded.</p>
      ) : (
        <div className="divide-y divide-border">
          {recentRequests?.map((item) => (
            <div key={item?.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-text-secondary">{item?.id}</span>
                  <span className="font-bold text-xs bg-muted px-1.5 py-0.5 rounded text-text-primary">
                    {item?.bloodType}
                  </span>
                  <span className="text-xs text-text-secondary">({item?.quantity} Units)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    item?.status === 'Fulfilled' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    {item?.status}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  <span>{item?.bloodBank}</span>
                  {item?.hospitalName && <span> • {item?.hospitalName}</span>}
                </div>
              </div>

              <div className="text-xs text-text-secondary text-left sm:text-right">
                <div>{item?.requestedAt?.toLocaleDateString('en-IN')}</div>
                {item?.declineReason && (
                  <div className="text-error text-[11px]">{item?.declineReason}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRequestHistory;
