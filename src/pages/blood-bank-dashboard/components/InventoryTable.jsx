/**
 * @file InventoryTable.jsx
 * @description Tabular view of blood units by blood group, Rh factor, stock quantity,
 * expiration threshold, and audit staff details. Includes stock status indicators and export actions.
 */

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * InventoryTable Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.inventoryData - Blood units inventory records.
 * @param {(item?: Object) => void} props.onUpdateStock - Stock adjustment callback.
 * @param {(item: Object) => void} props.onViewDetails - Inventory audit details callback.
 * @returns {JSX.Element} Interactive sortable blood inventory table.
 */
const InventoryTable = ({ inventoryData, onUpdateStock, onViewDetails }) => {
  // Active sort column ('bloodGroup' | 'currentStock' | 'daysUntilExpiry')
  const [sortBy, setSortBy] = useState('bloodGroup');
  // Sort direction ('asc' | 'desc')
  const [sortOrder, setSortOrder] = useState('asc');

  /**
   * Evaluates stock health percentage relative to minimum requirement.
   * @param {number} current - Current units in stock.
   * @param {number} minimum - Safe operational baseline.
   * @returns {string} Tailwind color classes.
   */
  const getStockStatusColor = (current, minimum) => {
    const percentage = (current / minimum) * 100;
    if (percentage <= 25) return 'text-error bg-error/10';
    if (percentage <= 50) return 'text-warning bg-warning/10';
    return 'text-success bg-success/10';
  };

  /**
   * Highlights urgent impending unit expirations.
   * @param {number} daysUntilExpiry - Days remaining before expiration.
   * @returns {string} Tailwind color classes.
   */
  const getExpiryStatusColor = (daysUntilExpiry) => {
    if (daysUntilExpiry <= 3) return 'text-error bg-error/10';
    if (daysUntilExpiry <= 7) return 'text-warning bg-warning/10';
    return 'text-text-secondary bg-muted';
  };

  // Sort inventory dataset based on column and direction
  const sortedData = [...inventoryData]?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  /**
   * Changes or toggles sort column order.
   * @param {string} field - Target column key.
   */
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
      {/* Header with Title and Action Controls */}
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

      {/* Table Data Viewport */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <th 
                className="py-3 px-6 cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('bloodGroup')}
              >
                <div className="flex items-center gap-1">
                  Blood Group
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th 
                className="py-3 px-6 cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('currentStock')}
              >
                <div className="flex items-center gap-1">
                  Current Stock
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="py-3 px-6">Min Required</th>
              <th 
                className="py-3 px-6 cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('daysUntilExpiry')}
              >
                <div className="flex items-center gap-1">
                  Next Expiry
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="py-3 px-6">Last Updated</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {sortedData?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/40 transition-medical">
                {/* Blood Group & Rh Factor */}
                <td className="py-4 px-6 font-medium text-text-primary">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-primary text-primary-foreground">
                      {item?.bloodGroup}
                    </span>
                    <span className="text-xs text-text-secondary">({item?.rhFactor})</span>
                  </div>
                </td>

                {/* Units In Stock */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStockStatusColor(item?.currentStock, item?.minimumRequired)}`}>
                    {item?.currentStock} units
                  </span>
                </td>

                {/* Minimum Baseline Threshold */}
                <td className="py-4 px-6 text-text-secondary font-medium">
                  {item?.minimumRequired} units
                </td>

                {/* Expiry Countdown */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getExpiryStatusColor(item?.daysUntilExpiry)}`}>
                    {item?.nextExpiry} ({item?.daysUntilExpiry}d)
                  </span>
                </td>

                {/* Last Update & Responsible Staff */}
                <td className="py-4 px-6 text-xs text-text-secondary">
                  <div>{item?.lastUpdated}</div>
                  <div className="opacity-70">By {item?.updatedBy}</div>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onUpdateStock(item)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onViewDetails(item)}
                    >
                      Details
                    </Button>
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
