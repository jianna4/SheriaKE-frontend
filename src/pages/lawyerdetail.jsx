// src/pages/LawyerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Briefcase, Award, Calendar, 
  MessageCircle, Phone, Mail, Globe, CheckCircle,
  Clock, DollarSign, Users, FileText, Share2,
  ChevronLeft, GraduationCap
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const LawyerProfile = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchLawyerProfile();
  }, [id]);

  const fetchLawyerProfile = async () => {
    try {
      const [profileRes, reviewsRes] = await Promise.all([
        api.get(`/marketplace/lawyers/${id}/`),
        api.get(`/marketplace/reviews/?lawyer=${id}`)
      ]);
      setLawyer(profileRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching lawyer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/lawyers/${id}` } });
      return;
    }
    if (user?.role !== 'client') {
      alert('Only clients can contact lawyers');
      return;
    }
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Lawyer not found</h2>
          <Link to="/lawyers" className="mt-4 inline-block text-[#d47a1a] hover:underline">
            Back to Find Lawyers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/lawyers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#d47a1a] mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Lawyers
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#1e4a6e] to-[#153a56] p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-[#d47a1a] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {lawyer.user?.first_name?.[0]}{lawyer.user?.last_name?.[0]}
                </span>
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {lawyer.user?.first_name} {lawyer.user?.last_name}
                </h1>
                <p className="text-[#f4ab5b] text-lg mb-3">
                  {lawyer.headline || 'Legal Professional'}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    {renderStars(lawyer.average_rating)}
                    <span className="text-sm">
                      ({lawyer.total_reviews || 0} reviews)
                    </span>
                  </div>
                  
                  {lawyer.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{lawyer.location}</span>
                    </div>
                  )}
                  
                  {lawyer.years_of_experience && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{lawyer.years_of_experience} years experience</span>
                    </div>
                  )}
                  
                  {lawyer.bar_number && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Bar: {lawyer.bar_number}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Button */}
              <button
                onClick={handleContact}
                className="px-6 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Lawyer
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#081c2b] mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {lawyer.bio || 'No bio provided yet.'}
              </p>
            </div>
            
            {/* Practice Areas */}
            {lawyer.practice_areas && lawyer.practice_areas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#081c2b] mb-4">Practice Areas</h2>
                <div className="flex flex-wrap gap-3">
                  {lawyer.practice_areas.map(area => (
                    <span key={area.id} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {area.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#081c2b] mb-4">
                Client Reviews ({reviews.length})
              </h2>
              
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {review.client?.first_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {review.client?.first_name} {review.client?.last_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Contact & Fees */}
          <div className="space-y-6">
            {/* Fees Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Fees & Rates</h3>
              
              {lawyer.consultation_fee && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Initial Consultation</p>
                  <p className="text-2xl font-bold text-[#d47a1a]">
                    KES {lawyer.consultation_fee.toLocaleString()}
                  </p>
                </div>
              )}
              
              {lawyer.hourly_rate && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="text-2xl font-bold text-[#d47a1a]">
                    KES {lawyer.hourly_rate.toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Response Time</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Within 24 hours
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Success Rate</span>
                  <span className="font-semibold">95%</span>
                </div>
              </div>
            </div>
            
            {/* Availability Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Availability</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="text-gray-800">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-gray-800">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-800">Closed</span>
                </div>
              </div>
              
              {lawyer.is_available && (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Currently accepting new clients</span>
                </div>
              )}
            </div>
            
            {/* Share Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Share Profile</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Profile link copied!');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Share2 className="w-4 h-4" />
                Copy Profile Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal (Optional) */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#081c2b] mb-4">Contact Lawyer</h3>
            <p className="text-gray-600 mb-4">
              Send a message to {lawyer.user?.first_name} {lawyer.user?.last_name}
            </p>
            <textarea
              placeholder="Type your message here..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none mb-4"
            ></textarea>
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Send message logic here
                  alert('Message sent! The lawyer will respond shortly.');
                  setShowContactModal(false);
                }}
                className="flex-1 px-4 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerProfile;