import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveRequestsPanel = ({ requests, onApproveRequest, onDeclineRequest, onViewRequest }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('urgency');

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

  const getTimeAgoColor = (minutes) => {
    if (minutes <= 15) return 'text-error';
    if (minutes <= 60) return 'text-warning';
    return 'text-text-secondary';
  };

  const filteredRequests = requests?.filter(request => {
    if (filter === 'all') return true;
    return request?.urgency?.toLowerCase() === filter;
  });

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
      <div className="max-h-96 overflow-y-auto">
        {sortedRequests?.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Icon name="Inbox" size={48} className="mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No active requests found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedRequests?.map((request) => (
              <div key={request?.id} className="px-6 py-4 hover:bg-muted/30 transition-medical">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(request?.urgency)}`}>
                        {request?.urgency}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Icon name="Droplets" size={16} className="text-primary" />
                        <span className="text-sm font-medium text-text-primary">{request?.bloodGroup}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Package" size={14} className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">{request?.quantity} units</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={14} className="text-text-secondary" />
                        <span className="text-sm text-text-primary">{request?.patientName}</span>
                        <span className="text-xs text-text-secondary">• Age {request?.patientAge}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Building2" size={14} className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">{request?.hospital}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Phone" size={14} className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">{request?.contactNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} className={getTimeAgoColor(request?.timeAgoMinutes)} />
                          <span className={`text-xs ${getTimeAgoColor(request?.timeAgoMinutes)}`}>
                            {request?.timeAgo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={14} className="text-text-secondary" />
                          <span className="text-xs text-text-secondary">{request?.distance}</span>
                        </div>
                      </div>
                    </div>

                    {request?.notes && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs text-text-secondary">
                        <Icon name="FileText" size={12} className="inline mr-1" />
                        {request?.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="success"
                      size="sm"
                      iconName="Check"
                      iconPosition="left"
                      onClick={() => onApproveRequest(request)}
                      className="min-w-[100px]"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      iconName="X"
                      iconPosition="left"
                      onClick={() => onDeclineRequest(request)}
                      className="min-w-[100px]"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      iconPosition="left"
                      onClick={() => onViewRequest(request)}
                      className="min-w-[100px]"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRequestsPanel;