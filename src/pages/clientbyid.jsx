// src/pages/CaseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, DollarSign, Clock, Calendar, 
  MapPin, User, AlertCircle, CheckCircle,
  ArrowLeft, FileText, Award, MessageCircle,
  TrendingUp, Star, Eye, Send, XCircle
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const CaseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid case ID');
      setLoading(false);
      return;
    }
    
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      console.log(`Fetching case: /marketplace/cases/${id}/`);
      const response = await api.get(`/marketplace/cases/${id}/`);
      console.log('Case response:', response.data);
      
      let caseData = response.data?.results?.[0] || response.data;
      
      if (!caseData || !caseData.id) {
        throw new Error('Case not found');
      }
      
      setCaseData(caseData);
      
      // If logged in as lawyer, check if already applied
      if (isAuthenticated && user?.role === 'lawyer') {
        await checkApplicationStatus(caseData.id);
      }
      
    } catch (error) {
      console.error('Error fetching case:', error);
      if (error.response?.status === 404) {
        setError('Case not found');
      } else {
        setError('Failed to load case details');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async (caseId) => {
    try {
      const response = await api.get('/marketplace/applications/');
      let applications = response.data?.results || response.data || [];
      
      const myApplication = applications.find(app => app.case === caseId);
      if (myApplication) {
        setHasApplied(true);
        setApplicationStatus(myApplication.status);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Open - Accepting Applications' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending Review' };
      case 'assigned':
        return { color: 'bg-blue-100 text-blue-700', icon: User, label: 'Assigned to Lawyer' };
      case 'closed':
        return { color: 'bg-gray-100 text-gray-700', icon: XCircle, label: 'Closed' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: status || 'Unknown' };
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'bg-blue-100 text-blue-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'urgent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cases/${id}` } });
      return;
    }
    if (user?.role !== 'lawyer') {
      alert('Only lawyers can apply to cases');
      return;
    }
    navigate(`/cases/${id}/apply`);
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cases/${id}` } });
      return;
    }
    // Create conversation with client
    navigate(`/messages?case=${id}`);
  };

  const getApplicationAction = () => {
    if (!isAuthenticated || user?.role !== 'lawyer') return null;
    
    if (hasApplied) {
      if (applicationStatus === 'pending') {
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
            <p className="text-yellow-800 font-medium">Application Pending</p>
            <p className="text-sm text-yellow-600 mt-1">
              The client is reviewing your application
            </p>
            <Link
              to="/lawyer/applications"
              className="mt-3 inline-block text-sm text-[#d47a1a] hover:underline"
            >
              View My Applications →
            </Link>
          </div>
        );
      } else if (applicationStatus === 'accepted') {
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Application Accepted! 🎉</p>
            <p className="text-sm text-green-600 mt-1">
              You've been selected for this case. Contact the client to get started.
            </p>
            <button
              onClick={handleContact}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg text-sm hover:bg-[#b86212] transition"
            >
              <MessageCircle className="w-4 h-4" />
              Message Client
            </button>
          </div>
        );
      } else if (applicationStatus === 'rejected') {
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <XCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
            <p className="text-red-800 font-medium">Not Selected</p>
            <p className="text-sm text-red-600 mt-1">
              The client chose another lawyer for this case
            </p>
            <Link
              to="/cases"
              className="mt-3 inline-block text-sm text-[#d47a1a] hover:underline"
            >
              Browse More Cases →
            </Link>
          </div>
        );
      }
    }
    
    if (caseData?.status === 'open') {
      return (
        <button
          onClick={handleApply}
          className="w-full bg-[#d47a1a] text-white py-3 rounded-lg font-semibold hover:bg-[#b86212] transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Apply to This Case
        </button>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{error || 'Case Not Found'}</h2>
          <p className="text-gray-500 mb-6">
            The case you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/cases" className="inline-block px-6 py-2 bg-[#d47a1a] text-white rounded-lg">
            Browse All Cases
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(caseData.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#d47a1a] mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cases
        </Link>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#1e4a6e] to-[#153a56] p-6 text-white">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                      {caseData.urgency_level && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getUrgencyBadge(caseData.urgency_level)}`}>
                          <Clock className="w-3 h-3" />
                          {caseData.urgency_level.toUpperCase()} Priority
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{caseData.title}</h1>
                    <p className="text-gray-300 text-sm">
                      Posted on {new Date(caseData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-lg font-semibold text-[#081c2b] mb-3">Case Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {caseData.description}
                </p>
              </div>
            </div>

            {/* Case Details Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#081c2b] mb-4">Case Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {caseData.practice_area_name && (
                  <div>
                    <p className="text-xs text-gray-500">Practice Area</p>
                    <p className="text-sm font-medium">{caseData.practice_area_name}</p>
                  </div>
                )}
                {caseData.legal_category && (
                  <div>
                    <p className="text-xs text-gray-500">Legal Category</p>
                    <p className="text-sm font-medium">{caseData.legal_category}</p>
                  </div>
                )}
                {caseData.case_stage && (
                  <div>
                    <p className="text-xs text-gray-500">Case Stage</p>
                    <p className="text-sm font-medium">{caseData.case_stage}</p>
                  </div>
                )}
                {caseData.county && (
                  <div>
                    <p className="text-xs text-gray-500">County</p>
                    <p className="text-sm font-medium">{caseData.county}</p>
                  </div>
                )}
                {caseData.city && (
                  <div>
                    <p className="text-xs text-gray-500">City/Town</p>
                    <p className="text-sm font-medium">{caseData.city}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Remote Consultation</p>
                  <p className="text-sm font-medium">{caseData.is_remote ? 'Yes' : 'No'}</p>
                </div>
                {caseData.court_case_exists !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500">Court Case Filed</p>
                    <p className="text-sm font-medium">{caseData.court_case_exists ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lawyer Preferences */}
            {(caseData.preferred_lawyer_gender || caseData.preferred_experience_level) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-[#081c2b] mb-4">Lawyer Preferences</h2>
                <div className="flex flex-wrap gap-4">
                  {caseData.preferred_lawyer_gender && caseData.preferred_lawyer_gender !== 'any' && (
                    <div>
                      <p className="text-xs text-gray-500">Preferred Gender</p>
                      <p className="text-sm font-medium capitalize">{caseData.preferred_lawyer_gender}</p>
                    </div>
                  )}
                  {caseData.preferred_experience_level && (
                    <div>
                      <p className="text-xs text-gray-500">Experience Level</p>
                      <p className="text-sm font-medium capitalize">{caseData.preferred_experience_level}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Budget</h3>
              <div className="text-center">
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="text-2xl font-bold text-[#d47a1a]">
                  KES {caseData.budget_min?.toLocaleString()} - {caseData.budget_max?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {caseData.budget_type === 'fixed' ? 'Fixed Fee' : 'Negotiable'}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {getApplicationAction()}
            </div>

            {/* Client Info Card (for lawyers) */}
            {isAuthenticated && user?.role === 'lawyer' && caseData.status === 'open' && !hasApplied && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Application Tips
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Respond quickly - early applications get more attention</li>
                  <li>• Be specific about your relevant experience</li>
                  <li>• Propose a fair fee within the client's budget</li>
                  <li>• Highlight your success rate with similar cases</li>
                </ul>
              </div>
            )}

            {/* Case Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Case Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Applications Received</span>
                  <span className="font-semibold">{caseData.applications_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Views</span>
                  <span className="font-semibold">{caseData.views || 0}</span>
                </div>
              </div>
            </div>

            {/* Share Case */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4">Share This Case</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Case link copied!');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <TrendingUp className="w-4 h-4" />
                Copy Case Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;