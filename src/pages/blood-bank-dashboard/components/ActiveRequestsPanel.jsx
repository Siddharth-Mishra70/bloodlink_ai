/**
 * @file ActiveRequestsPanel.jsx
 * @description Patient and hospital emergency blood request queue.
 * Enables laboratory staff to sort, filter by urgency (Critical, Urgent, Normal),
 * view patient notes, and trigger immediate Approve/Decline dispatch actions.
 */

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * ActiveRequestsPanel Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.requests - List of active blood requests.
 * @param {(req: Object) => void} props.onApproveRequest - Approve callback.
 * @param {(req: Object) => void} props.onDeclineRequest - Decline callback.
 * @param {(req: Object) => void} props.onViewRequest - Detailed inspection modal callback.
 * @returns {JSX.Element} Interactive request triage panel.
 */
const ActiveRequestsPanel = ({ requests, onApproveRequest, onDeclineRequest, onViewRequest }) => {
  // Urgency filter state ('all' | 'critical' | 'urgent' | 'normal')
  const [filter, setFilter] = useState('all');
  // Sorting criterion ('urgency' | 'time')
  const [sortBy, setSortBy] = useState('urgency');

  /**
   * Resolves visual urgency badges.
   * @param {string} urgency - Urgency rating.
   * @returns {string} Tailwind CSS styling classes.
   */
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'urgent':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'normal':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  /**
   * Colorizes elapsed time based on minutes waiting.
   * @param {number} minutes - Elapsed time in minutes.
   * @returns {string} Text color class.
   */
  const getTimeAgoColor = (minutes) => {
    if (minutes <= 15) return 'text-error';
    if (minutes <= 60) return 'text-warning';
    return 'text-text-secondary';
  };

  // Filter requests according to selected urgency filter
  const filteredRequests = requests?.filter(request => {
    if (filter === 'all') return true;
    return request?.urgency?.toLowerCase() === filter;
  });

  // Sort requests by urgency rank or timestamp
  const sortedRequests = [...filteredRequests]?.sort((a, b) => {
    if (sortBy === 'urgency') {
      const urgencyOrder = { 'critical': 0, 'urgent': 1, 'normal': 2 };
      return urgencyOrder?.[a?.urgency?.toLowerCase()] - urgencyOrder?.[b?.urgency?.toLowerCase()];
    }
    if (sortBy === 'time') {
      return new Date(b.requestTime) - new Date(a.requestTime);
    }
    return 0;
  });

  return (
    <div className="bg-card rounded-lg border border-border medical-shadow">
      {/* Panel Header with Filter & Sort Controls */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Active Requests</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {requests?.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter by Urgency */}
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Requests</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>

            {/* Sort Order Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="urgency">Sort by Urgency</option>
              <option value="time">Sort by Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        {sortedRequests?.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <Icon name="Inbox" size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No active requests matching filter.</p>
          </div>
        ) : (
          sortedRequests?.map((request) => (
            <div key={request?.id} className="p-6 hover:bg-muted/50 transition-medical">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Top line: Patient name, age, blood type badge, and urgency level */}
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-text-primary">{request?.patientName}</h4>
                    <span className="text-sm text-text-secondary">({request?.patientAge} yrs)</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary text-primary-foreground">
                      {request?.bloodGroup}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(request?.urgency)}`}>
                      {request?.urgency}
                    </span>
                  </div>

                  {/* Metadata: Hospital name, distance, and elapsed submission time */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary mb-3">
                    <span className="flex items-center gap-1">
                      <Icon name="Building2" size={14} />
                      {request?.hospital}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {request?.distance}
                    </span>
                    <span className={`flex items-center gap-1 ${getTimeAgoColor(request?.timeAgoMinutes)} font-medium`}>
                      <Icon name="Clock" size={14} />
                      {request?.timeAgo}
                    </span>
                    <span className="font-semibold text-text-primary">
                      Units: {request?.quantity}
                    </span>
                  </div>

                  {/* Clinical request notes if provided */}
                  {request?.notes && (
                    <p className="text-xs text-text-secondary bg-surface p-2 rounded border border-border mb-3">
                      {request?.notes}
                    </p>
                  )}
                </div>

                {/* Direct Action Buttons: View, Approve, Decline */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onViewRequest?.(request)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="success"
                    size="xs"
                    onClick={() => onApproveRequest?.(request)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-error hover:bg-error/10"
                    onClick={() => onDeclineRequest?.(request)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveRequestsPanel;
