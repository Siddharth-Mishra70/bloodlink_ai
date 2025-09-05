import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const mockCredentials = {
    patient: { email: 'patient@bloodlink.in', password: 'patient123' },
    staff: { email: 'staff@bloodbank.in', password: 'staff123' },
    admin: { email: 'admin@bloodlink.in', password: 'admin123' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const isValidCredentials = Object.values(mockCredentials)?.some(
        cred => cred?.email === formData?.email && cred?.password === formData?.password
      );
      
      if (isValidCredentials) {
        // Store user session
        localStorage.setItem('userSession', JSON.stringify({
          email: formData?.email,
          loginTime: new Date()?.toISOString(),
          rememberMe: formData?.rememberMe
        }));
        
        // Determine user role and redirect
        if (formData?.email === mockCredentials?.admin?.email) {
          navigate('/admin');
        } else if (formData?.email === mockCredentials?.staff?.email) {
          navigate('/blood-bank-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setErrors({
          general: `Invalid credentials. Use: ${Object.values(mockCredentials)?.map(c => c?.email)?.join(', ')}`
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      localStorage.setItem('userSession', JSON.stringify({
        email: 'user@gmail.com',
        loginTime: new Date()?.toISOString(),
        provider: 'google'
      }));
      navigate('/user-dashboard');
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg medical-shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
            <Icon name="Droplets" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Welcome Back</h2>
          <p className="text-text-secondary">Sign in to access your BloodLink AI account</p>
        </div>

        {/* Error Message */}
        {errors?.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
            />
            
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-medical"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="left"
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-text-secondary">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleGoogleLogin}
          loading={isLoading}
          iconName="Chrome"
          iconPosition="left"
        >
          Continue with Google
        </Button>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link
              to="/user-registration"
              className="text-primary hover:text-primary/80 font-medium transition-medical"
            >
              Sign up now
            </Link>
          </p>
        </div>

        {/* Emergency Access */}
        <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-error mb-1">Emergency Access</h4>
              <p className="text-xs text-text-secondary">
                In case of medical emergency, you can{' '}
                <Link to="/emergency-blood-request" className="text-error underline">
                  request blood immediately
                </Link>{' '}
                without logging in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;