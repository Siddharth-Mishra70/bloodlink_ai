import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryTable = ({ inventoryData, onUpdateStock, onViewDetails }) => {
  const [sortBy, setSortBy] = useState('bloodGroup');
  const [sortOrder, setSortOrder] = useState('asc');

  const getStockStatusColor = (current, minimum) => {
    const percentage = (current / minimum) * 100;
    if (percentage <= 25) return 'text-error bg-error/10';
    if (percentage <= 50) return 'text-warning bg-warning/10';
    return 'text-success bg-success/10';
  };

  const getExpiryStatusColor = (daysUntilExpiry) => {
    if (daysUntilExpiry <= 3) return 'text-error bg-error/10';
    if (daysUntilExpiry <= 7) return 'text-warning bg-warning/10';
    return 'text-text-secondary bg-muted';
  };

  const sortedData = [...inventoryData]?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border medical-shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Package" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Blood Inventory</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => console.log('Export inventory')}
            >
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onUpdateStock()}
            >
              Add Stock
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('bloodGroup')}
              >
                <div className="flex items-center space-x-1">
                  <span>Blood Group</span>
                  <Icon 
                    name={sortBy === 'bloodGroup' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('currentStock')}
              >
                <div className="flex items-center space-x-1">
                  <span>Current Stock</span>
                  <Icon 
                    name={sortBy === 'currentStock' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Minimum Required
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Next Expiry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedData?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/30 transition-medical">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Icon name="Droplets" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{item?.bloodGroup}</div>
                      <div className="text-xs text-text-secondary">{item?.rhFactor}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">{item?.currentStock} units</div>
                  <div className="text-xs text-text-secondary">
                    {((item?.currentStock / item?.minimumRequired) * 100)?.toFixed(0)}% of minimum
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {item?.minimumRequired} units
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(item?.currentStock, item?.minimumRequired)}`}>
                    {item?.currentStock <= item?.minimumRequired * 0.25 ? 'Critical' : 
                     item?.currentStock <= item?.minimumRequired * 0.5 ? 'Low' : 'Good'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-primary">{item?.nextExpiry}</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getExpiryStatusColor(item?.daysUntilExpiry)}`}>
                    {item?.daysUntilExpiry} days
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  <div>{item?.lastUpdated}</div>
                  <div className="text-xs">by {item?.updatedBy}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(item)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onUpdateStock(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;