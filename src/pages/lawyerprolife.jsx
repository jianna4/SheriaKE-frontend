// src/pages/MyLawyerProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Briefcase, Award, Calendar, 
  MessageCircle, Phone, Mail, Globe, CheckCircle,
  Clock, DollarSign, Users, FileText, Share2,
  ChevronLeft, GraduationCap, AlertCircle, Edit3
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const MyLawyerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const response = await api.get('/marketplace/my-lawyer-profile/');
      console.log('My profile response:', response.data);
      
      // Handle paginated response
      let profileData = response.data;
      if (response.data?.results && Array.isArray(response.data.results)) {
        profileData = response.data.results[0];
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        profileData = response.data.data[0];
      }
      
      if (!profileData || !profileData.id) {
        setError('No lawyer profile found. Please complete your profile setup.');
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        setError('No lawyer profile found. Please complete your profile setup.');
      } else {
        setError('Failed to load your profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#081c2b] mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "You haven't created your lawyer profile yet."}</p>
          <Link 
            to="/lawyer/profile-setup" 
            className="inline-block px-6 py-2 bg-[#d47a1a] text-white rounded-lg hover:bg-[#b86212] transition"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Edit Button */}
        <div className="flex justify-end mb-4">
          
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#1e4a6e] to-[#153a56] p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-[#d47a1a] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-[#f4ab5b] text-lg mb-3">
                  {profile.headline || 'Legal Professional'}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    {renderStars(profile.average_rating)}
                    <span className="text-sm">({profile.total_reviews || 0} reviews)</span>
                  </div>
                  
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.years_of_experience && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{profile.years_of_experience} years experience</span>
                    </div>
                  )}
                  
                  {profile.is_verified && (
                    <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">LSK Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#081c2b] mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed">
                {profile.bio || 'No bio provided yet.'}
              </p>
            </div>
            
            {/* Practice Areas */}
            {profile.practice_areas && profile.practice_areas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#081c2b] mb-4">Practice Areas</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.practice_areas.map(area => (
                    <span key={area.id} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {area.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Contact & Fees */}
          <div className="space-y-6">
            {/* Fees Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">My Fees & Rates</h3>
              
              {profile.consultation_fee && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Initial Consultation</p>
                  <p className="text-2xl font-bold text-[#d47a1a]">
                    KES {profile.consultation_fee.toLocaleString()}
                  </p>
                </div>
              )}
              
              {profile.hourly_rate && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="text-2xl font-bold text-[#d47a1a]">
                    KES {profile.hourly_rate.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            
            {/* Contact Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                {user?.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user?.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* LSK Verification Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">LSK Status</h3>
              {profile.is_verified ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Verified Lawyer</span>
                </div>
              ) : (
                <div>
                  <p className="text-yellow-600 text-sm mb-3">Not yet verified with LSK</p>
                  <Link
                    to="/lawyer/profile-setup"
                    className="text-sm text-[#d47a1a] hover:underline"
                  >
                    Complete LSK Verification →
                  </Link>
                </div>
              )}
              {profile.bar_number && (
                <p className="text-xs text-gray-500 mt-3">Bar Number: {profile.bar_number}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLawyerProfile;