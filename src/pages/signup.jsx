import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle, Briefcase, Users } from 'lucide-react';

import { useAuth } from "../Components/contexts/AuthContext";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'client', // Default role, stored in state
    password: '',
    password_confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role
    });
    // Also store in localStorage if you want to persist it
    localStorage.setItem('preferred_role', role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Prepare data for API with the selected role from state
    const apiData = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      password: formData.password,
      password_confirm: formData.password_confirm,
      role: formData.role, // Using role from state
    };

    try {
      const response = await register(apiData);
      
      // Clear stored role if you want
      localStorage.removeItem('preferred_role');
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Signup error:', err);
      
      // Format error messages from Django
      if (err.response?.data) {
        const errors = err.response.data;
        const errorMessages = [];
        
        if (typeof errors === 'object') {
          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessages.push(`${key}: ${errors[key].join(', ')}`);
            } else if (typeof errors[key] === 'string') {
              errorMessages.push(errors[key]);
            } else {
              errorMessages.push(`${key}: ${JSON.stringify(errors[key])}`);
            }
          }
          setError(errorMessages.join(' | '));
        } else {
          setError(errors);
        }
      } else {
        setError('Signup failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-gold-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">
            {formData.role === 'lawyer' ? 'Lawyer Account Created!' : 'Account Created!'}
          </h2>
          <p className="text-gray-600 mb-4">
            Your {formData.role} account has been created successfully.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-gold-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-gradient-to-br from-navy-600 to-navy-800 p-2 rounded-xl">
              <Scale className="w-8 h-8 text-gold-400" />
            </div>
            <span className="text-2xl font-bold text-navy-900">
              Sheria<span className="text-gold-600">KE</span>
            </span>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join SheriaKE today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection - Added here */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to sign up as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('client')}
                  className={`px-4 py-3 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                    formData.role === 'client'
                      ? 'border-gold-500 bg-gold-50 text-gold-700 ring-2 ring-gold-500'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  Client
                  <span className="block text-xs font-normal text-gray-500 mt-1">
                    Get legal help
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('lawyer')}
                  className={`px-4 py-3 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                    formData.role === 'lawyer'
                      ? 'border-gold-500 bg-gold-50 text-gold-700 ring-2 ring-gold-500'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 mx-auto mb-1" />
                  Lawyer
                  <span className="block text-xs font-normal text-gray-500 mt-1">
                    Offer legal services
                  </span>
                </button>
              </div>
            </div>

            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number {formData.role === 'lawyer' && <span className="text-red-500 text-xs">*</span>}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                  placeholder="+254 712 345 678"
                  required={formData.role === 'lawyer'}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === 'lawyer' 
                  ? 'Phone number is required for lawyers for verification' 
                  : 'Optional for clients'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                  placeholder="••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-navy-600 to-navy-800 text-white py-3 rounded-lg font-semibold hover:from-navy-700 hover:to-navy-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Creating account...' : `Sign up as ${formData.role === 'lawyer' ? 'Lawyer' : 'Client'}`}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-600 hover:text-gold-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;