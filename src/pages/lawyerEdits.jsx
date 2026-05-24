// src/pages/LawyerProfileSetup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, AlertCircle, CheckCircle, Briefcase, MapPin, 
  DollarSign, Save, Award, X, Plus, GraduationCap,
  Clock, Globe, Phone, Mail, User, FileText
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const LawyerProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingProfile, setExistingProfile] = useState(null);
  const [step, setStep] = useState(1);
  const [lskMatches, setLskMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const [profileData, setProfileData] = useState({
    p105_number: '',
    bar_number: '',
    headline: '',
    bio: '',
    years_of_experience: '',
    location: '',
    consultation_fee: '',
    hourly_rate: '',
    practice_area_ids: [],
    is_available: true,
  });
  
  const [practiceAreas, setPracticeAreas] = useState([]);

  useEffect(() => {
    fetchPracticeAreas();
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const response = await api.get('/marketplace/my-lawyer-profile/');
      let profile = response.data?.results?.[0] || response.data;
      
      if (profile && profile.id) {
        setExistingProfile(profile);
        setProfileData({
          p105_number: profile.p105_number || '',
          bar_number: profile.bar_number || '',
          headline: profile.headline || '',
          bio: profile.bio || '',
          years_of_experience: profile.years_of_experience || '',
          location: profile.location || '',
          consultation_fee: profile.consultation_fee || '',
          hourly_rate: profile.hourly_rate || '',
          practice_area_ids: profile.practice_areas?.map(a => a.id) || [],
          is_available: profile.is_available !== false,
        });
        
        if (profile.is_verified) {
          setStep(3); // Skip to profile details if already verified
        } else {
          setStep(1); // Start with LSK verification
        }
      }
    } catch (error) {
      console.log('No existing profile found, will create new one');
      setStep(1);
    }
  };

  const fetchPracticeAreas = async () => {
    try {
      const response = await api.get('/marketplace/practice-areas/');
      const areas = response.data?.results || response.data || [];
      setPracticeAreas(areas);
    } catch (error) {
      console.error('Error fetching practice areas:', error);
    }
  };

  const handleLSKVerification = async () => {
    if (!profileData.p105_number && !profileData.bar_number) {
      setError('Please enter either P105 Number or Bar Number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/marketplace/my-lawyer-profile/verify-lsk/', {
        keyword: profileData.p105_number || profileData.bar_number
      });

      if (response.data.matches && response.data.matches.length > 1) {
        setLskMatches(response.data.matches);
        setStep(2);
      } else if (response.data.profile) {
        setExistingProfile(response.data.profile);
        setStep(3);
        setSuccess('LSK verification successful! Please complete your profile.');
        setTimeout(() => setSuccess(''), 3000);
      } else if (response.data.matches && response.data.matches.length === 1) {
        setStep(3);
        setSuccess('LSK verification successful! Please complete your profile.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('LSK verification failed:', error);
      setError(error.response?.data?.detail || 'LSK verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const confirmLSKMatch = async () => {
    if (!selectedMatch) {
      setError('Please select your profile');
      return;
    }

    setLoading(true);
    try {
      await api.post('/marketplace/my-lawyer-profile/verify-lsk/', {
        keyword: profileData.p105_number || profileData.bar_number,
        lsk_id: selectedMatch.lsk_id
      });
      setStep(3);
      setSuccess('LSK verification successful! Please complete your profile.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to confirm LSK match');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPracticeArea = (areaId) => {
    if (!profileData.practice_area_ids.includes(areaId)) {
      setProfileData({
        ...profileData,
        practice_area_ids: [...profileData.practice_area_ids, areaId]
      });
    }
  };

  const handleRemovePracticeArea = (areaId) => {
    setProfileData({
      ...profileData,
      practice_area_ids: profileData.practice_area_ids.filter(id => id !== areaId)
    });
  };

  const saveProfile = async () => {
    // Validate required fields
    if (!profileData.headline) {
      setError('Please enter a headline');
      return;
    }
    if (!profileData.bio) {
      setError('Please enter a bio');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const submitData = {
        p105_number: profileData.p105_number,
        bar_number: profileData.bar_number,
        headline: profileData.headline,
        bio: profileData.bio,
        years_of_experience: parseInt(profileData.years_of_experience) || 0,
        location: profileData.location,
        consultation_fee: parseFloat(profileData.consultation_fee) || 0,
        hourly_rate: parseFloat(profileData.hourly_rate) || 0,
        practice_area_ids: profileData.practice_area_ids,
        is_available: profileData.is_available,
      };
      
      let response;
      if (existingProfile?.id) {
        // Update existing profile
        response = await api.patch(`/marketplace/my-lawyer-profile/${existingProfile.id}/`, submitData);
        setSuccess('Profile updated successfully!');
      } else {
        // Create new profile
        response = await api.post('/marketplace/my-lawyer-profile/', submitData);
        setSuccess('Profile created successfully!');
      }
      
      setTimeout(() => {
        navigate('/lawyer/my-profile');
      }, 2000);
    } catch (error) {
      console.error('Profile save failed:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to save profile';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Skip LSK verification (for testing or later verification)
  const skipLSK = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e4a6e] to-[#153a56] p-6 text-white">
            <h1 className="text-2xl font-bold">
              {existingProfile?.id ? 'Edit Your Lawyer Profile' : 'Create Your Lawyer Profile'}
            </h1>
            <p className="text-gray-300 mt-1">
              {existingProfile?.id ? 'Update your professional information' : 'Set up your practice and get verified'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${step >= 1 ? 'text-[#d47a1a]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#d47a1a] text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">LSK Verification</span>
              </div>
              <div className="flex-1 h-px mx-4 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-[#d47a1a]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#d47a1a] text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Professional Details</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Step 1: LSK Verification */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Why verify with LSK?</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Verification with the Law Society of Kenya (LSK) builds trust with clients and unlocks full access to case applications.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    P105 Number or Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.p105_number}
                    onChange={(e) => setProfileData({...profileData, p105_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                    placeholder="e.g., P105/2023/1234 or John Doe"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your P105 number or full name as registered with LSK
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bar Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={profileData.bar_number}
                    onChange={(e) => setProfileData({...profileData, bar_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                    placeholder="e.g., LSK-001234"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleLSKVerification}
                    disabled={loading}
                    className="flex-1 bg-[#d47a1a] text-white py-2 rounded-lg font-semibold hover:bg-[#b86212] transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Verifying...' : 'Verify with LSK'}
                  </button>
                  <button
                    onClick={skipLSK}
                    className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                  >
                    Skip for Now
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Multiple LSK Matches */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-gray-600">Multiple matches found. Please select your profile:</p>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {lskMatches.map(match => (
                    <label
                      key={match.lsk_id}
                      className={`block p-4 border rounded-lg cursor-pointer transition ${
                        selectedMatch?.lsk_id === match.lsk_id
                          ? 'border-[#d47a1a] bg-[#fef8ee]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="match"
                        checked={selectedMatch?.lsk_id === match.lsk_id}
                        onChange={() => setSelectedMatch(match)}
                        className="sr-only"
                      />
                      <div>
                        <p className="font-semibold text-[#081c2b]">{match.full_name}</p>
                        <p className="text-sm text-gray-500">P105: {match.p105_number}</p>
                        {match.firm_name && <p className="text-sm text-gray-500">Firm: {match.firm_name}</p>}
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={confirmLSKMatch}
                  disabled={loading || !selectedMatch}
                  className="w-full bg-[#d47a1a] text-white py-2 rounded-lg font-semibold hover:bg-[#b86212] transition disabled:opacity-50"
                >
                  {loading ? 'Confirming...' : 'Confirm My Profile'}
                </button>
              </div>
            )}

            {/* Step 3: Professional Details */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.headline}
                    onChange={(e) => setProfileData({...profileData, headline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                    placeholder="e.g., Employment Law Expert | 10+ Years Experience"
                  />
                  <p className="text-xs text-gray-500 mt-1">A short tagline that appears under your name</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                    placeholder="Tell clients about your expertise, experience, approach to legal services, and what makes you unique..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profileData.years_of_experience}
                      onChange={(e) => setProfileData({...profileData, years_of_experience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                        placeholder="Nairobi, Kenya"
                      />
                    </div>
                  </div>
                </div>

                {/* Practice Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Areas
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profileData.practice_area_ids.map(id => {
                        const area = practiceAreas.find(a => a.id === id);
                        return area ? (
                          <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-[#fef8ee] text-[#d47a1a] rounded-full text-sm">
                            {area.name}
                            <button
                              type="button"
                              onClick={() => handleRemovePracticeArea(id)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                      {profileData.practice_area_ids.length === 0 && (
                        <span className="text-gray-400 text-sm">No practice areas added yet</span>
                      )}
                    </div>
                    <select
                      onChange={(e) => {
                        const id = parseInt(e.target.value);
                        if (id && !profileData.practice_area_ids.includes(id)) {
                          handleAddPracticeArea(id);
                        }
                        e.target.value = '';
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>Add a practice area...</option>
                      {practiceAreas.filter(area => !profileData.practice_area_ids.includes(area.id)).map(area => (
                        <option key={area.id} value={area.id}>{area.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fees */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (KES)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={profileData.consultation_fee}
                        onChange={(e) => setProfileData({...profileData, consultation_fee: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                        placeholder="2000"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fee for initial consultation</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (KES)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={profileData.hourly_rate}
                        onChange={(e) => setProfileData({...profileData, hourly_rate: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={profileData.is_available}
                    onChange={(e) => setProfileData({...profileData, is_available: e.target.checked})}
                    className="w-4 h-4 text-[#d47a1a] rounded border-gray-300 focus:ring-[#e89432]"
                  />
                  <label htmlFor="is_available" className="text-sm text-gray-700">
                    Available for new clients
                  </label>
                </div>

                {/* Contact Info (Read-only from user) */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-[#081c2b] mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </div>
                    {user?.phone_number && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {user?.phone_number}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    To update contact info, go to Account Settings
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => navigate('/lawyer/dashboard')}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex-1 bg-[#d47a1a] text-white py-2 rounded-lg font-semibold hover:bg-[#b86212] transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : (existingProfile?.id ? 'Update Profile' : 'Create Profile')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfileSetup;