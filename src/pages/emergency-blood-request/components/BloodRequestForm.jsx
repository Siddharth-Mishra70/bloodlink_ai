/**
 * @file BloodRequestForm.jsx
 * @description Patient emergency blood requisition form with client-side validation
 * and AI-Powered Smart Fill integration (Google Gemini).
 * Captures patient medical condition, required blood units, clinical urgency rating,
 * receiving hospital details, and emergency point-of-contact phone numbers.
 */

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { parseEmergencyRequest } from '../../../services/api';

/**
 * BloodRequestForm Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {(data: Object) => void} props.onSubmit - Validated submission handler.
 * @param {boolean} props.isSubmitting - Async submission execution status.
 * @returns {JSX.Element} Validated emergency request form with Gemini smart-fill.
 */
const BloodRequestForm = ({ onSubmit, isSubmitting }) => {
  // Form input field state values
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

  // Client-side field validation error messages
  const [errors, setErrors] = useState({});

  // AI Smart Auto-Fill query bar states
  const [naturalQuery, setNaturalQuery] = useState('');
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiParseSuccess, setAiParseSuccess] = useState(false);

  // Selectable ABO & Rh blood groups
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

  // Clinical urgency options
  const urgencyOptions = [
    { value: 'emergency', label: 'Emergency (Life-threatening)', description: 'Immediate attention required' },
    { value: 'urgent', label: 'Urgent (Within 24 hours)', description: 'Critical but not immediate' },
    { value: 'planned', label: 'Planned (Within 48-72 hours)', description: 'Scheduled procedure' }
  ];

  // Requisition quantity options
  const quantityOptions = [
    { value: '1', label: '1 Unit' },
    { value: '2', label: '2 Units' },
    { value: '3', label: '3 Units' },
    { value: '4', label: '4 Units' },
    { value: '5', label: '5 Units' },
    { value: '6+', label: '6+ Units (Specify in notes)' }
  ];

  /**
   * Invokes the Gemini 2.5 Flash backend parser to automatically populate the form fields.
   */
  const handleAiSmartFill = async () => {
    if (!naturalQuery?.trim()) return;

    setIsAiParsing(true);
    setAiParseSuccess(false);

    try {
      const parsed = await parseEmergencyRequest(naturalQuery);

      if (parsed) {
        // Map urgency level from AI response to form option
        let mappedUrgency = 'emergency';
        if (parsed.urgency_level?.toLowerCase() === 'normal') mappedUrgency = 'planned';
        else if (parsed.urgency_level?.toLowerCase() === 'urgent') mappedUrgency = 'urgent';

        // Check if blood group matched valid options
        const detectedGroup = parsed.blood_group ? parsed.blood_group.toUpperCase() : '';

        setFormData(prev => ({
          ...prev,
          bloodGroup: detectedGroup || prev.bloodGroup,
          urgency: mappedUrgency,
          hospitalName: parsed.location || prev.hospitalName,
          hospitalAddress: parsed.location || prev.hospitalAddress,
          medicalCondition: parsed.patient_notes || prev.medicalCondition,
          additionalNotes: `Auto-parsed from emergency prompt: "${naturalQuery}"`
        }));

        setAiParseSuccess(true);
        setTimeout(() => setAiParseSuccess(false), 4000);
      }
    } catch (err) {
      console.warn('AI Parsing failed, falling back to manual input:', err);
    } finally {
      setIsAiParsing(false);
    }
  };

  /**
   * Updates state for a single input field and clears any active error on that field.
   * @param {string} field - Target property key.
   * @param {any} value - Input value.
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /**
   * Validates mandatory clinical and contact fields prior to dispatch.
   * @returns {boolean} True if form passes all validation rules.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData?.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData?.urgency) newErrors.urgency = 'Urgency level is required';
    if (!formData?.patientName?.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData?.patientAge) newErrors.patientAge = 'Patient age is required';
    if (!formData?.hospitalName?.trim()) newErrors.hospitalName = 'Hospital name is required';
    if (!formData?.hospitalAddress?.trim()) newErrors.hospitalAddress = 'Hospital address is required';
    if (!formData?.contactName?.trim()) newErrors.contactName = 'Contact person name is required';
    if (!formData?.contactPhone?.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData?.contactPhone?.trim())) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  /**
   * Form submission event handler.
   * @param {React.FormEvent} e - Submit event.
   */
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 medical-shadow space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Patient Requisition Form</h3>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
          AI-Assisted Dispatch
        </span>
      </div>

      {/* AI Smart-Fill Widget (Gemini 2.5 Flash) */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50/60 to-red-50/60 border border-blue-200/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <span className="text-xs font-bold text-text-primary">AI Smart Fill with Gemini</span>
          </div>
          {aiParseSuccess && (
            <span className="text-[11px] text-success font-semibold flex items-center gap-1">
              <Icon name="CheckCircle" size={12} /> Auto-filled successfully!
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-secondary mb-2">
          Paste an emergency SMS, WhatsApp, or doctor note to auto-extract fields:
        </p>
        <div className="flex gap-2">
          <Input
            value={naturalQuery}
            onChange={(e) => setNaturalQuery(e?.target?.value)}
            placeholder="e.g. Need 2 units O- urgently at Swaroop Rani Nehru Hospital (SRN), Prayagraj..."
            className="flex-1 text-xs h-9 bg-white"
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleAiSmartFill}
            loading={isAiParsing}
            disabled={!naturalQuery?.trim() || isAiParsing}
            iconName="Sparkles"
            iconPosition="left"
            className="text-xs"
          >
            Auto-Fill
          </Button>
        </div>
      </div>

      {/* Blood Requirements Row: Blood Group, Quantity, Urgency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Required Blood Group"
          placeholder="Select blood group"
          options={bloodGroupOptions}
          value={formData?.bloodGroup}
          onChange={(val) => handleInputChange('bloodGroup', val)}
          error={errors?.bloodGroup}
          required
        />
        <Select
          label="Quantity (Units)"
          placeholder="Select units"
          options={quantityOptions}
          value={formData?.quantity}
          onChange={(val) => handleInputChange('quantity', val)}
          error={errors?.quantity}
          required
        />
        <Select
          label="Urgency Level"
          placeholder="Select urgency"
          options={urgencyOptions}
          value={formData?.urgency}
          onChange={(val) => handleInputChange('urgency', val)}
          error={errors?.urgency}
          required
        />
      </div>

      {/* Patient Information Row: Name & Age */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Patient Full Name"
            placeholder="e.g. Rahul Sharma"
            value={formData?.patientName}
            onChange={(e) => handleInputChange('patientName', e?.target?.value)}
            error={errors?.patientName}
            required
          />
        </div>
        <div>
          <Input
            label="Patient Age"
            type="number"
            placeholder="e.g. 42"
            value={formData?.patientAge}
            onChange={(e) => handleInputChange('patientAge', e?.target?.value)}
            error={errors?.patientAge}
            required
          />
        </div>
      </div>

      {/* Hospital Information: Name & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Hospital / Clinic Name"
          placeholder="e.g. Swaroop Rani Nehru (SRN) Hospital / Jeevan Jyoti"
          value={formData?.hospitalName}
          onChange={(e) => handleInputChange('hospitalName', e?.target?.value)}
          error={errors?.hospitalName}
          required
        />
        <Input
          label="Hospital Ward / Room / Address"
          placeholder="e.g. ICU 2nd Floor, George Town / Civil Lines, Prayagraj"
          value={formData?.hospitalAddress}
          onChange={(e) => handleInputChange('hospitalAddress', e?.target?.value)}
          error={errors?.hospitalAddress}
          required
        />
      </div>

      {/* Contact Information: Person Name, Phone, Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Contact Person Name"
          placeholder="Attending doctor or family"
          value={formData?.contactName}
          onChange={(e) => handleInputChange('contactName', e?.target?.value)}
          error={errors?.contactName}
          required
        />
        <Input
          label="Emergency Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData?.contactPhone}
          onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
          error={errors?.contactPhone}
          required
        />
        <Input
          label="Contact Email (Optional)"
          type="email"
          placeholder="doctor@hospital.com"
          value={formData?.contactEmail}
          onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
        />
      </div>

      {/* Medical Notes & Context */}
      <div>
        <Input
          label="Medical Condition / Reason for Request"
          placeholder="e.g. Acute hemorrhagic trauma, scheduled bypass surgery, severe anemia"
          value={formData?.medicalCondition}
          onChange={(e) => handleInputChange('medicalCondition', e?.target?.value)}
        />
      </div>

      {/* Submit Action */}
      <div className="pt-4 border-t border-border flex items-center justify-end space-x-3">
        <Button
          type="submit"
          variant="destructive"
          size="lg"
          loading={isSubmitting}
          iconName="AlertTriangle"
          iconPosition="left"
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Transmitting Emergency Request...' : 'Broadcast Emergency Blood Request'}
        </Button>
      </div>
    </form>
  );
};

export default BloodRequestForm;
