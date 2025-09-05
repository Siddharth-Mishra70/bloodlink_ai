import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BloodRequestForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    quantity: '',
    urgency: '',
    patientName: '',
    patientAge: '',
    hospitalName: '',
    hospitalAddress: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    medicalCondition: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+ (A Positive)' },
    { value: 'A-', label: 'A- (A Negative)' },
    { value: 'B+', label: 'B+ (B Positive)' },
    { value: 'B-', label: 'B- (B Negative)' },
    { value: 'AB+', label: 'AB+ (AB Positive)' },
    { value: 'AB-', label: 'AB- (AB Negative)' },
    { value: 'O+', label: 'O+ (O Positive)' },
    { value: 'O-', label: 'O- (O Negative)' }
  ];

  const urgencyOptions = [
    { value: 'emergency', label: 'Emergency (Life-threatening)', description: 'Immediate attention required' },
    { value: 'urgent', label: 'Urgent (Within 24 hours)', description: 'Critical but not immediate' },
    { value: 'planned', label: 'Planned (Within 48-72 hours)', description: 'Scheduled procedure' }
  ];

  const quantityOptions = [
    { value: '1', label: '1 Unit' },
    { value: '2', label: '2 Units' },
    { value: '3', label: '3 Units' },
    { value: '4', label: '4 Units' },
    { value: '5', label: '5 Units' },
    { value: '6+', label: '6+ Units (Specify in notes)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData?.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData?.urgency) newErrors.urgency = 'Urgency level is required';
    if (!formData?.patientName) newErrors.patientName = 'Patient name is required';
    if (!formData?.patientAge) newErrors.patientAge = 'Patient age is required';
    if (!formData?.hospitalName) newErrors.hospitalName = 'Hospital name is required';
    if (!formData?.hospitalAddress) newErrors.hospitalAddress = 'Hospital address is required';
    if (!formData?.contactName) newErrors.contactName = 'Contact person name is required';
    if (!formData?.contactPhone) newErrors.contactPhone = 'Contact phone is required';
    if (!formData?.contactEmail) newErrors.contactEmail = 'Contact email is required';

    // Phone validation (Indian format)
    if (formData?.contactPhone && !/^[6-9]\d{9}$/?.test(formData?.contactPhone?.replace(/\D/g, ''))) {
      newErrors.contactPhone = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation
    if (formData?.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Age validation
    if (formData?.patientAge && (isNaN(formData?.patientAge) || formData?.patientAge < 0 || formData?.patientAge > 120)) {
      newErrors.patientAge = 'Please enter a valid age between 0-120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'text-error';
      case 'urgent': return 'text-warning';
      case 'planned': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card rounded-lg medical-shadow p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
          <Icon name="AlertTriangle" size={20} className="text-error" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Emergency Blood Request</h2>
          <p className="text-sm text-text-secondary">Fill out this form to request blood units urgently</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blood Requirements Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Blood Requirements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Blood Group"
              placeholder="Select blood group"
              options={bloodGroupOptions}
              value={formData?.bloodGroup}
              onChange={(value) => handleInputChange('bloodGroup', value)}
              error={errors?.bloodGroup}
              required
            />
            
            <Select
              label="Quantity Needed"
              placeholder="Select quantity"
              options={quantityOptions}
              value={formData?.quantity}
              onChange={(value) => handleInputChange('quantity', value)}
              error={errors?.quantity}
              required
            />
            
            <Select
              label="Urgency Level"
              placeholder="Select urgency"
              options={urgencyOptions}
              value={formData?.urgency}
              onChange={(value) => handleInputChange('urgency', value)}
              error={errors?.urgency}
              required
            />
          </div>

          {formData?.urgency && (
            <div className={`p-3 rounded-lg border ${
              formData?.urgency === 'emergency' ? 'bg-error/5 border-error/20' :
              formData?.urgency === 'urgent'? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.urgency === 'emergency' ? 'AlertTriangle' : 
                        formData?.urgency === 'urgent' ? 'Clock' : 'Calendar'} 
                  size={16} 
                  className={getUrgencyColor(formData?.urgency)}
                />
                <span className={`text-sm font-medium ${getUrgencyColor(formData?.urgency)}`}>
                  {urgencyOptions?.find(opt => opt?.value === formData?.urgency)?.description}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Patient Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Patient Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Patient Full Name"
              type="text"
              placeholder="Enter patient's full name"
              value={formData?.patientName}
              onChange={(e) => handleInputChange('patientName', e?.target?.value)}
              error={errors?.patientName}
              required
            />
            
            <Input
              label="Patient Age"
              type="number"
              placeholder="Enter age"
              value={formData?.patientAge}
              onChange={(e) => handleInputChange('patientAge', e?.target?.value)}
              error={errors?.patientAge}
              min="0"
              max="120"
              required
            />
          </div>

          <Input
            label="Medical Condition"
            type="text"
            placeholder="Brief description of medical condition"
            value={formData?.medicalCondition}
            onChange={(e) => handleInputChange('medicalCondition', e?.target?.value)}
            description="Optional: Helps blood banks prioritize requests"
          />
        </div>

        {/* Hospital Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Hospital Information
          </h3>
          
          <Input
            label="Hospital Name"
            type="text"
            placeholder="Enter hospital name"
            value={formData?.hospitalName}
            onChange={(e) => handleInputChange('hospitalName', e?.target?.value)}
            error={errors?.hospitalName}
            required
          />
          
          <Input
            label="Hospital Address"
            type="text"
            placeholder="Enter complete hospital address with PIN code"
            value={formData?.hospitalAddress}
            onChange={(e) => handleInputChange('hospitalAddress', e?.target?.value)}
            error={errors?.hospitalAddress}
            required
          />
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Emergency Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name"
              type="text"
              placeholder="Enter contact person's name"
              value={formData?.contactName}
              onChange={(e) => handleInputChange('contactName', e?.target?.value)}
              error={errors?.contactName}
              required
            />
            
            <Input
              label="Contact Phone Number"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData?.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
              error={errors?.contactPhone}
              required
            />
          </div>
          
          <Input
            label="Contact Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData?.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
            error={errors?.contactEmail}
            required
          />
        </div>

        {/* Additional Notes Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Additional Information
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Additional Notes
            </label>
            <textarea
              rows={4}
              placeholder="Any additional information that might help blood banks respond faster..."
              value={formData?.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-text-secondary">
              Optional: Include any special requirements or additional context
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-border">
          <Button
            type="submit"
            variant="destructive"
            size="lg"
            loading={isSubmitting}
            iconName="Send"
            iconPosition="right"
            fullWidth
            className="text-base font-medium"
          >
            {isSubmitting ? 'Submitting Request...' : 'Submit Emergency Request'}
          </Button>
          
          <p className="text-xs text-text-secondary text-center mt-3">
            Your request will be immediately sent to nearby blood banks. 
            You will receive confirmation within 5 minutes.
          </p>
        </div>
      </form>
    </div>
  );
};

export default BloodRequestForm;