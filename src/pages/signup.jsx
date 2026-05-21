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
    role: 'client',
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
    localStorage.setItem('preferred_role', role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

    const apiData = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      password: formData.password,
      password_confirm: formData.password_confirm,
      role: formData.role,
    };

    try {
      const response = await register(apiData);
      localStorage.removeItem('preferred_role');
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Signup error:', err);
      
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
      <div className="min-h-screen bg-gradient-to-br from-[#eef2f8] via-white to-[#fef8ee] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#081c2b] mb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f8] via-white to-[#fef8ee] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#1e4a6e] to-[#153a56] p-2 rounded-xl">
              <Scale className="w-8 h-8 text-[#f4ab5b]" />
            </div>
            <span className="text-2xl font-bold text-[#081c2b]">
              Sheria<span className="text-[#d47a1a]">KE</span>
            </span>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#081c2b]">Create Account</h2>
            <p className="text-gray-600 mt-2">Join SheriaKE today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to sign up as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('client')}
                  className={`px-4 py-3 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e89432] transition-all ${
                    formData.role === 'client'
                      ? 'border-[#e89432] bg-[#fef8ee] text-[#d47a1a] ring-2 ring-[#e89432]'
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
                  className={`px-4 py-3 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e89432] transition-all ${
                    formData.role === 'lawyer'
                      ? 'border-[#e89432] bg-[#fef8ee] text-[#d47a1a] ring-2 ring-[#e89432]'
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none transition"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none transition"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none transition"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none transition"
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none transition"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none transition"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1e4a6e] to-[#153a56] text-white py-3 rounded-lg font-semibold hover:from-[#2c5f8a] hover:to-[#1e4a6e] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Creating account...' : `Sign up as ${formData.role === 'lawyer' ? 'Lawyer' : 'Client'}`}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#d47a1a] hover:text-[#b86212] font-semibold">
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