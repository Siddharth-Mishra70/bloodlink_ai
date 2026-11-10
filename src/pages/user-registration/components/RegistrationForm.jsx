/**
 * @file RegistrationForm.jsx
 * @description Comprehensive donor & patient registration form.
 * Captures Full Name, Email, 10-digit Indian mobile number, ABO/Rh blood group,
 * geographic city, PIN code, and password confirmation with field-level validation rules.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

/**
 * RegistrationForm Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {(data: Object) => void} props.onSubmit - Validated submission handler.
 * @param {boolean} props.isLoading - In-flight async submission status.
 * @returns {JSX.Element} Validated registration form.
 */
const RegistrationForm = ({ onSubmit, isLoading }) => {
  // Controlled form fields state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodGroup: '',
    location: '',
    pinCode: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Client-side validation errors
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Available blood group options
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

  /**
   * Validates form parameters against regex and required constraints.
   * @returns {boolean} True if all validations pass.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData?.bloodGroup) {
      newErrors.bloodGroup = 'Blood group selection is required';
    }

    if (!formData?.location?.trim()) {
      newErrors.location = 'City / Location is required';
    }

    if (!formData?.pinCode?.trim()) {
      newErrors.pinCode = 'PIN code is required';
    } else if (!/^\d{6}$/?.test(formData?.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  /**
   * Updates state for target input field and clears active error.
   * @param {string} field - Target field key.
   * @param {any} value - Value.
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    <div className="bg-card rounded-lg medical-shadow p-6 sm:p-8 border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="e.g. Siddharth Mishra"
          value={formData?.fullName}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />

        {/* Email & Mobile Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />
          <Input
            label="Mobile Number (10 Digits)"
            type="tel"
            placeholder="9876543210"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />
        </div>

        {/* Blood Group & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Blood Group"
            placeholder="Select Blood Group"
            options={bloodGroupOptions}
            value={formData?.bloodGroup}
            onChange={(val) => handleInputChange('bloodGroup', val)}
            error={errors?.bloodGroup}
            required
          />
          <Input
            label="City / Locality (Prayagraj)"
            placeholder="e.g. Civil Lines / George Town, Prayagraj"
            value={formData?.location}
            onChange={(e) => handleInputChange('location', e?.target?.value)}
            error={errors?.location}
            required
          />
        </div>

        {/* PIN Code */}
        <Input
          label="Postal PIN Code (6 Digits)"
          placeholder="211001"
          value={formData?.pinCode}
          onChange={(e) => handleInputChange('pinCode', e?.target?.value)}
          error={errors?.pinCode}
          required
        />

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData?.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
            error={errors?.confirmPassword}
            required
          />
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-2">
          <label className="flex items-start space-x-2 cursor-pointer text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={formData?.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
              className="mt-0.5 rounded border-border text-primary focus:ring-primary"
            />
            <span>
              I agree to the <Link to="/terms" className="text-primary underline">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors?.agreeToTerms && (
            <p className="text-xs text-error mt-1">{errors?.agreeToTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          fullWidth
          className="mt-6"
        >
          Complete Registration
        </Button>

        {/* Existing Account Link */}
        <div className="text-center text-xs text-text-secondary pt-3">
          Already have an account?{' '}
          <Link to="/user-login" className="text-primary font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
