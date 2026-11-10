/**
 * @file LoginForm.jsx
 * @description Authentication form providing role-based login routing for:
 * 1. Patients & Donors (`patient@bloodlink.in`) -> `/user-dashboard`
 * 2. Blood Bank Staff (`staff@bloodbank.in`) -> `/blood-bank-dashboard`
 * 3. System Administrators (`admin@bloodlink.in`) -> `/admin`
 * Includes demo credentials auto-fill shortcuts and validation rules.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

/**
 * LoginForm Component
 *
 * @component
 * @returns {JSX.Element} Login form with validation and quick role switcher buttons.
 */
const LoginForm = () => {
  const navigate = useNavigate();

  // Controlled form input state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Validation error messages
  const [errors, setErrors] = useState({});
  // Form submission in-flight flag
  const [isLoading, setIsLoading] = useState(false);

  // Pre-configured development / demonstration credentials
  const mockCredentials = {
    patient: { email: 'patient@bloodlink.in', password: 'patient123' },
    staff: { email: 'staff@bloodbank.in', password: 'staff123' },
    admin: { email: 'admin@bloodlink.in', password: 'admin123' }
  };

  /**
   * Updates state for target input field and clears active error.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validates email format and password length requirements.
   * @returns {boolean} True if all validation constraints pass.
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  /**
   * Submits credentials and routes to appropriate role destination.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate authentication API latency
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userSession = {
        email: formData?.email,
        loggedInAt: new Date().toISOString(),
        rememberMe: formData?.rememberMe
      };

      localStorage.setItem('userSession', JSON.stringify(userSession));

      // Role-based destination routing
      if (formData?.email?.includes('admin')) {
        navigate('/admin');
      } else if (formData?.email?.includes('staff')) {
        navigate('/blood-bank-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setErrors({ general: 'Failed to sign in. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper to populate form fields with role demonstration credentials.
   * @param {'patient'|'staff'|'admin'} role - Target role archetype.
   */
  const fillCredentials = (role) => {
    const creds = mockCredentials?.[role];
    if (creds) {
      setFormData({
        email: creds?.email,
        password: creds?.password,
        rememberMe: true
      });
      setErrors({});
    }
  };

  return (
    <div className="bg-card rounded-xl medical-shadow-lg border border-border p-8">
      {/* Form Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h2>
        <p className="text-sm text-text-secondary">
          Enter your registered email and password to continue
        </p>
      </div>

      {/* General Form Error Message */}
      {errors?.general && (
        <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium">
          {errors?.general}
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="login-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
          />
        </div>

        <div>
          <Input
            id="login-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
          />
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <Checkbox
            id="remember-me"
            name="rememberMe"
            label="Remember me"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
          />
          <Link
            to="/forgot-password"
            className="text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
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
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Quick-Fill Badges */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-text-secondary text-center mb-3 font-semibold uppercase">
          Quick Demo Credentials:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('patient')}
            className="py-1 px-2 text-xs rounded border border-border bg-surface hover:bg-muted text-text-primary transition-medical text-center"
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('staff')}
            className="py-1 px-2 text-xs rounded border border-border bg-surface hover:bg-muted text-text-primary transition-medical text-center"
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('admin')}
            className="py-1 px-2 text-xs rounded border border-border bg-surface hover:bg-muted text-text-primary transition-medical text-center"
          >
            Admin
          </button>
        </div>
      </div>

      {/* New Registration Link */}
      <div className="mt-6 text-center text-xs text-text-secondary">
        Don't have an account yet?{' '}
        <Link to="/user-registration" className="text-primary font-bold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
