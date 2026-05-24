// src/pages/LawyerApplications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle, AlertCircle, 
  Briefcase, DollarSign, Calendar, Eye, 
  MessageCircle, TrendingUp, XCircle
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const LawyerApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/marketplace/applications/');
      console.log('Applications response:', response.data);
      
      // Handle paginated response
      let appsData = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        appsData = response.data.results;
      } else if (Array.isArray(response.data)) {
        appsData = response.data;
      } else {
        appsData = [];
      }
      
      setApplications(appsData);
      
      // Calculate stats
      const pending = appsData.filter(a => a.status === 'pending').length;
      const accepted = appsData.filter(a => a.status === 'accepted').length;
      const rejected = appsData.filter(a => a.status === 'rejected').length;
      
      setStats({
        pending,
        accepted,
        rejected,
        total: appsData.length,
      });
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredApplications = () => {
    switch (activeTab) {
      case 'pending':
        return applications.filter(a => a.status === 'pending');
      case 'accepted':
        return applications.filter(a => a.status === 'accepted');
      case 'rejected':
        return applications.filter(a => a.status === 'rejected');
      default:
        return applications;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending Review' };
      case 'accepted':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Accepted' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Not Selected' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: status || 'Unknown' };
    }
  };

  const filteredApps = getFilteredApplications();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#081c2b]">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track all the cases you've applied to and their status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-[#081c2b]">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-[#d47a1a]" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Not Selected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {[
              { id: 'all', label: 'All Applications', count: stats.total },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'accepted', label: 'Accepted', count: stats.accepted },
              { id: 'rejected', label: 'Not Selected', count: stats.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#d47a1a] text-[#d47a1a]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications found</h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'all' 
                ? "You haven't applied to any cases yet." 
                : `You don't have any ${activeTab} applications.`}
            </p>
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg hover:bg-[#b86212] transition"
            >
              <TrendingUp className="w-4 h-4" />
              Browse Available Cases
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((application) => {
              const StatusIcon = getStatusBadge(application.status).icon;
              const statusStyle = getStatusBadge(application.status);
              
              return (
                <div key={application.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left - Case Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusStyle.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusStyle.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          Applied on {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-[#081c2b] mb-2">
                        {application.case_title || application.case?.title || 'Case'}
                      </h2>
                      
                      <p className="text-gray-600 mb-4">
                        {application.message || 'No message provided with application'}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-[#d47a1a]">
                            Proposed: KES {parseFloat(application.proposed_fee || 0).toLocaleString()}
                          </span>
                        </div>
                        {application.estimated_duration && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Est. Duration: {application.estimated_duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Link
                        to={`/client/cases/${application.case}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-[#d47a1a] text-[#d47a1a] rounded-lg font-semibold hover:bg-[#d47a1a] hover:text-white transition"
                      >
                        <Eye className="w-4 h-4" />
                        View Case
                      </Link>
                      
                      {application.status === 'accepted' && (
                        <Link
                          to={`/messages?case=${application.case}`}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message Client
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerApplications;