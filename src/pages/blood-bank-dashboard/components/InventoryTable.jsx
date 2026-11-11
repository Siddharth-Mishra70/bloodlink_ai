/**
 * @file InventoryTable.jsx
 * @description Tabular view of blood units by blood group, Rh factor, stock quantity,
 * expiration threshold, and audit staff details. Includes interactive Add Stock modal
 * to dynamically update or append inventory records.
 */

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * Standard ABO and Rh blood groups.
 */
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * InventoryTable Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.inventoryData - Blood units inventory records.
 * @param {(item?: Object) => void} [props.onUpdateStock] - Stock adjustment callback.
 * @param {(item: Object) => void} [props.onViewDetails] - Inventory audit details callback.
 * @returns {JSX.Element} Interactive sortable blood inventory table with Add Stock modal.
 */
const InventoryTable = ({ inventoryData = [], onUpdateStock, onViewDetails }) => {
  // Controlled local inventory data to ensure instantaneous dynamic UI updates
  const [dataList, setDataList] = useState(inventoryData);
  // Active sort column ('bloodGroup' | 'currentStock' | 'daysUntilExpiry')
  const [sortBy, setSortBy] = useState('bloodGroup');
  // Sort direction ('asc' | 'desc')
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal open/close state for Add Stock
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  // Form input fields state
  const [stockForm, setStockForm] = useState({
    bloodGroup: 'A+',
    unitsToAdd: '',
    donorCampSource: '',
    staffName: 'Staff Nurse'
  });

  // Client-side validation errors
  const [errors, setErrors] = useState({});
  // Dynamic success toast notification
  const [successMessage, setSuccessMessage] = useState('');

  // Sync state whenever external inventoryData prop updates
  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setDataList(inventoryData);
    }
  }, [inventoryData]);

  /**
   * Evaluates stock health percentage relative to minimum requirement.
   * @param {number} current - Current units in stock.
   * @param {number} minimum - Safe operational baseline.
   * @returns {string} Tailwind color classes.
   */
  const getStockStatusColor = (current, minimum) => {
    const percentage = (current / minimum) * 100;
    if (percentage <= 25) return 'text-error bg-error/10 border-error/30';
    if (percentage <= 50) return 'text-warning bg-warning/10 border-warning/30';
    return 'text-success bg-success/10 border-success/30';
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
  const sortedData = [...dataList]?.sort((a, b) => {
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

  /**
   * Handles opening the Add Stock modal.
   * If a specific item row was clicked, preselects that blood group.
   * @param {Object} [item] - Optional blood group row.
   */
  const handleOpenAddStock = (item = null) => {
    setStockForm({
      bloodGroup: item?.bloodGroup || 'A+',
      unitsToAdd: '',
      donorCampSource: '',
      staffName: 'Staff Nurse'
    });
    setErrors({});
    setIsAddStockOpen(true);
  };

  /**
   * Submits newly added stock units and dynamically updates the inventory state.
   * @param {React.FormEvent} [e] - Form submission event.
   */
  const handleSubmitStock = (e) => {
    if (e) e.preventDefault();
    const newErrors = {};
    const units = parseInt(stockForm.unitsToAdd, 10);

    if (!stockForm.bloodGroup) {
      newErrors.bloodGroup = 'Please select a blood group';
    }

    if (!stockForm.unitsToAdd || isNaN(units) || units <= 0) {
      newErrors.unitsToAdd = 'Please enter a valid number of units (at least 1)';
    }

    if (!stockForm.donorCampSource?.trim()) {
      newErrors.donorCampSource = 'Hospital or donor source is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const timestamp = `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const sourceLabel = stockForm.donorCampSource.trim();

    // Dynamically append or update the local inventory state
    setDataList(prev => {
      const existingIdx = prev.findIndex(item => item.bloodGroup === stockForm.bloodGroup);
      if (existingIdx !== -1) {
        const updated = [...prev];
        const target = updated[existingIdx];
        updated[existingIdx] = {
          ...target,
          currentStock: Number(target.currentStock) + units,
          lastUpdated: timestamp,
          updatedBy: `${stockForm.staffName} (${sourceLabel})`
        };
        return updated;
      } else {
        // Append new blood group row if it didn't exist
        return [
          ...prev,
          {
            id: prev.length + 1,
            bloodGroup: stockForm.bloodGroup,
            rhFactor: stockForm.bloodGroup.includes('-') ? 'Negative' : 'Positive',
            currentStock: units,
            minimumRequired: 30,
            nextExpiry: 'In 35 days',
            daysUntilExpiry: 35,
            lastUpdated: timestamp,
            updatedBy: `${stockForm.staffName} (${sourceLabel})`
          }
        ];
      }
    });

    // Notify parent callback if provided
    if (onUpdateStock) {
      onUpdateStock({
        bloodGroup: stockForm.bloodGroup,
        unitsToAdd: units,
        source: sourceLabel,
        staff: stockForm.staffName
      });
    }

    // Set success banner
    setSuccessMessage(`Added +${units} units of ${stockForm.bloodGroup} from "${sourceLabel}".`);
    setTimeout(() => setSuccessMessage(''), 4500);

    // Reset and close modal
    setIsAddStockOpen(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border medical-shadow overflow-hidden">
      {/* Header with Title and Action Controls */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="Package" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Prayagraj Blood Inventory</h3>
              <p className="text-xs text-text-secondary">Real-time ABO/Rh unit availability across regional medical centers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," + 
                  ["BloodGroup,CurrentStock,MinRequired,DaysUntilExpiry,LastUpdated",
                   ...dataList.map(e => `${e.bloodGroup},${e.currentStock},${e.minimumRequired},${e.daysUntilExpiry},${e.lastUpdated}`)].join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `Prayagraj_Blood_Inventory_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Export CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={() => handleOpenAddStock()}
              className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-xs"
            >
              Add Stock
            </Button>
          </div>
        </div>

        {/* Dynamic Success Toast */}
        {successMessage && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={16} className="text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage('')}
              className="text-emerald-600 hover:text-emerald-800 p-1"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        )}
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
                  Expiry Status
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="py-3 px-6">Last Updated</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {sortedData?.map((item) => (
              <tr 
                key={item?.id || item?.bloodGroup}
                className="hover:bg-muted/40 transition-colors"
              >
                {/* Blood Group & Rh Factor */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-full bg-red-100 border border-red-200 text-red-700 font-extrabold flex items-center justify-center text-sm shadow-xs">
                      {item?.bloodGroup}
                    </span>
                    <div>
                      <div className="font-semibold text-text-primary">{item?.bloodGroup}</div>
                      <div className="text-xs text-text-secondary">{item?.rhFactor || (item?.bloodGroup?.includes('-') ? 'Negative' : 'Positive')}</div>
                    </div>
                  </div>
                </td>

                {/* Current Stock with Visual Badge */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStockStatusColor(item?.currentStock, item?.minimumRequired)}`}>
                    {item?.currentStock} Units
                  </span>
                </td>

                {/* Minimum Baseline Threshold */}
                <td className="py-4 px-6 text-text-secondary text-xs">
                  {item?.minimumRequired} Units
                </td>

                {/* Expiration Threshold */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getExpiryStatusColor(item?.daysUntilExpiry)}`}>
                    {item?.nextExpiry || `In ${item?.daysUntilExpiry}d`} ({item?.daysUntilExpiry}d)
                  </span>
                </td>

                {/* Last Update & Responsible Staff */}
                <td className="py-4 px-6 text-xs text-text-secondary">
                  <div className="font-medium text-text-primary">{item?.lastUpdated}</div>
                  <div className="opacity-75">{item?.updatedBy}</div>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleOpenAddStock(item)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      + Add Stock
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onViewDetails && onViewDetails(item)}
                    >
                      Audit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* Add Stock Modal Form */}
      {/* ======================================================== */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-xl medical-shadow max-w-lg w-full overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-white/20">
                  <Icon name="PlusCircle" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Blood Stock Units</h3>
                  <p className="text-xs text-white/80">Log incoming units to Prayagraj regional blood bank</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStockOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close modal"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitStock} className="p-6 space-y-4">
              {/* 1. Blood Group Selector */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Select Blood Group <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((group) => {
                    const isSelected = stockForm.bloodGroup === group;
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setStockForm(prev => ({ ...prev, bloodGroup: group }))}
                        className={`py-2 px-3 rounded-lg border text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-red-600 text-white border-red-600 shadow-sm ring-2 ring-red-400'
                            : 'bg-surface hover:bg-muted text-text-primary border-border'
                        }`}
                      >
                        <Icon name="Droplet" size={13} className={isSelected ? 'text-white' : 'text-red-500'} />
                        {group}
                      </button>
                    );
                  })}
                </div>
                {errors.bloodGroup && (
                  <p className="text-xs text-error mt-1">{errors.bloodGroup}</p>
                )}
              </div>

              {/* 2. Units to Add */}
              <div>
                <label htmlFor="units-to-add-input" className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                  Units to Add (Bags) <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="units-to-add-input"
                    type="number"
                    min="1"
                    step="1"
                    value={stockForm.unitsToAdd}
                    onChange={(e) => setStockForm(prev => ({ ...prev, unitsToAdd: e.target.value }))}
                    placeholder="e.g. 10"
                    className="w-full h-10 px-3 py-2 rounded-lg border border-input bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-medium">
                    Units (350ml / 450ml)
                  </span>
                </div>
                {/* Quick Add Chips */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-text-secondary font-medium">Quick add:</span>
                  {[5, 10, 25, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStockForm(prev => ({ ...prev, unitsToAdd: num.toString() }))}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary border border-border transition-colors font-semibold"
                    >
                      +{num}
                    </button>
                  ))}
                </div>
                {errors.unitsToAdd && (
                  <p className="text-xs text-error mt-1">{errors.unitsToAdd}</p>
                )}
              </div>

              {/* 3. Hospital / Donor Source */}
              <div>
                <label htmlFor="donor-camp-source-input" className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                  Hospital / Donor Source <span className="text-error">*</span>
                </label>
                <input
                  id="donor-camp-source-input"
                  type="text"
                  value={stockForm.donorCampSource}
                  onChange={(e) => setStockForm(prev => ({ ...prev, donorCampSource: e.target.value }))}
                  placeholder="e.g. SRN Hospital Blood Bank / MNNIT Teliarganj Camp / Walk-in Donor"
                  className="w-full h-10 px-3 py-2 rounded-lg border border-input bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {/* Quick Prayagraj Hospital & Camp Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'SRN Hospital Blood Bank',
                    'Jeevan Jyoti Hospital',
                    'MNNIT Campus Drive',
                    'Civil Lines Voluntary Walk-in'
                  ].map((camp) => (
                    <button
                      key={camp}
                      type="button"
                      onClick={() => setStockForm(prev => ({ ...prev, donorCampSource: camp }))}
                      className="text-[11px] px-2 py-0.5 rounded bg-muted hover:bg-primary/10 hover:text-primary text-text-secondary border border-border"
                    >
                      {camp}
                    </button>
                  ))}
                </div>
                {errors.donorCampSource && (
                  <p className="text-xs text-error mt-1">{errors.donorCampSource}</p>
                )}
              </div>

              {/* 4. Staff / Technician Name */}
              <div>
                <label htmlFor="staff-name-input" className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                  Verified By (Staff / Lab Tech)
                </label>
                <input
                  id="staff-name-input"
                  type="text"
                  value={stockForm.staffName}
                  onChange={(e) => setStockForm(prev => ({ ...prev, staffName: e.target.value }))}
                  placeholder="e.g. Dr. Alok Bannerjee / Lab Tech Kumar"
                  className="w-full h-10 px-3 py-2 rounded-lg border border-input bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddStockOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="bg-primary hover:bg-primary/90 text-white font-bold min-w-[130px]"
                >
                  <Icon name="Check" size={16} className="mr-1.5" />
                  Submit Stock
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
