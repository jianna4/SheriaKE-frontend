// src/pages/PublicLawyerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Briefcase, Award, Calendar, 
  MessageCircle, Clock, DollarSign, ChevronLeft,
  AlertCircle, CheckCircle, Mail, Phone, Share2,
  GraduationCap, Users, FileText
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const PublicLawyerProfile = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid lawyer profile');
      setLoading(false);
      return;
    }
    fetchLawyerProfile();
  }, [id]);

  const fetchLawyerProfile = async () => {
    try {
      // Fetch lawyer details
      const profileRes = await api.get(`/marketplace/lawyers/${id}/`);
      let lawyerData = profileRes.data?.results?.[0] || profileRes.data;
      
      if (!lawyerData || !lawyerData.id) {
        throw new Error('Lawyer not found');
      }
      
      setLawyer(lawyerData);
      
      // Fetch reviews for this lawyer
      try {
        const reviewsRes = await api.get(`/marketplace/reviews/?lawyer=${id}`);
        let reviewsData = reviewsRes.data?.results || reviewsRes.data || [];
        setReviews(reviewsData);
      } catch (reviewError) {
        console.error('Error fetching reviews:', reviewError);
        setReviews([]);
      }
      
    } catch (error) {
      console.error('Error fetching lawyer profile:', error);
      if (error.response?.status === 404) {
        setError('Lawyer not found');
      } else {
        setError('Failed to load lawyer profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < fullStars ? 'text-yellow-400 fill-current' :
              i === fullStars && hasHalfStar ? 'text-yellow-400 half-fill' :
              'text-gray-300'
            }`}
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

  const sendMessage = async () => {
    if (!contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }
    
    try {
      // Create a conversation with this lawyer
      const response = await api.post('/messaging/conversations/', {
        lawyer_profile: lawyer.id
      });
      
      // Send the message
      await api.post('/messaging/messages/', {
        conversation: response.data.id,
        message: contactMessage,
        message_type: 'text'
      });
      
      alert('Message sent successfully! The lawyer will respond shortly.');
      setShowContactModal(false);
      setContactMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{error || 'Lawyer Not Found'}</h2>
          <p className="text-gray-500 mb-6">
            The lawyer profile you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/lawyers" 
            className="inline-block px-6 py-2 bg-[#d47a1a] text-white rounded-lg hover:bg-[#b86212] transition"
          >
            Browse All Lawyers
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
                      ({lawyer.total_reviews || reviews.length || 0} reviews)
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
                  
                  {lawyer.is_verified && (
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">LSK Verified</span>
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
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
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
            
            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#081c2b] mb-4">
                Client Reviews ({reviews.length})
              </h2>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  {isAuthenticated && user?.role === 'client' && (
                    <button
                      onClick={() => navigate(`/submit-review/${lawyer.id}`)}
                      className="mt-3 text-[#d47a1a] hover:underline text-sm"
                    >
                      Write a Review →
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map(review => (
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
                              {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent'}
                            </p>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                  
                  {reviews.length > 5 && (
                    <button className="text-[#d47a1a] hover:underline text-sm mt-2">
                      View all {reviews.length} reviews →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Contact & Fees */}
          <div className="space-y-6">
            {/* Fees Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Fees & Rates</h3>
              
              {lawyer.consultation_fee ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Initial Consultation</p>
                  <p className="text-2xl font-bold text-[#d47a1a]">
                    KES {lawyer.consultation_fee.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="text-gray-500">Contact for pricing</p>
                </div>
              )}
              
              {lawyer.hourly_rate && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="text-xl font-bold text-[#d47a1a]">
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
              
              {lawyer.is_available !== false && (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Currently accepting new clients</span>
                </div>
              )}
            </div>
            
            {/* Contact Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Contact Information</h3>
              <div className="space-y-3">
                {lawyer.user?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{lawyer.user.email}</span>
                  </div>
                )}
                {lawyer.user?.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{lawyer.user.phone_number}</span>
                  </div>
                )}
                {lawyer.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{lawyer.location}</span>
                  </div>
                )}
              </div>
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#081c2b] mb-4">
              Contact {lawyer.user?.first_name} {lawyer.user?.last_name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Send a message to inquire about legal services
            </p>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Hello, I'm interested in your legal services. I would like to discuss..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
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

export default PublicLawyerProfile;