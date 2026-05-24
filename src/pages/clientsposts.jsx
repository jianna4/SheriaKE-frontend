// src/pages/ClientCases.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Plus, Clock, CheckCircle, 
  AlertCircle, Eye, Edit2, Trash2, 
  MessageCircle, DollarSign, MapPin, Users
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const ClientCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      const response = await api.get('/marketplace/cases/');
      console.log('My cases response:', response.data);
      
      // Handle paginated response
      let casesData = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        casesData = response.data.results;
      } else if (Array.isArray(response.data)) {
        casesData = response.data;
      } else {
        casesData = [];
      }
      
      setCases(casesData);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setError('Failed to load your cases');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCases = () => {
    switch (activeTab) {
      case 'open':
        return cases.filter(c => c.status === 'open');
      case 'pending':
        return cases.filter(c => c.status === 'pending');
      case 'assigned':
        return cases.filter(c => c.status === 'assigned');
      case 'closed':
        return cases.filter(c => c.status === 'closed');
      default:
        return cases;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Open - Accepting Applications' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending Review' };
      case 'assigned':
        return { color: 'bg-blue-100 text-blue-700', icon: Users, label: 'Assigned to Lawyer' };
      case 'closed':
        return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: 'Closed' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: status || 'Unknown' };
    }
  };

  const handleDelete = async () => {
    if (!selectedCase) return;
    
    setDeleting(true);
    try {
      await api.delete(`/marketplace/cases/${selectedCase.id}/`);
      setCases(cases.filter(c => c.id !== selectedCase.id));
      setShowDeleteModal(false);
      setSelectedCase(null);
    } catch (error) {
      console.error('Error deleting case:', error);
      setError('Failed to delete case. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (caseItem) => {
    setSelectedCase(caseItem);
    setShowDeleteModal(true);
  };

  const handleEdit = (caseItem) => {
    // Navigate to edit page (you can create an EditCase page)
    navigate(`/client/cases/${caseItem.id}/edit`);
  };

  const getApplicationCount = (caseId) => {
    // This would come from your API
    return caseItem.applications_count || 0;
  };

  const filteredCases = getFilteredCases();

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#081c2b]">My Cases</h1>
            <p className="text-gray-600 mt-2">
              Manage and track all your legal cases
            </p>
          </div>
          <Link
            to="/client/post-case"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
          >
            <Plus className="w-4 h-4" />
            Post New Case
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8 overflow-x-auto">
            {[
              { id: 'all', label: 'All Cases', count: cases.length },
              { id: 'open', label: 'Open', count: cases.filter(c => c.status === 'open').length },
              { id: 'pending', label: 'Pending', count: cases.filter(c => c.status === 'pending').length },
              { id: 'assigned', label: 'Assigned', count: cases.filter(c => c.status === 'assigned').length },
              { id: 'closed', label: 'Closed', count: cases.filter(c => c.status === 'closed').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
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

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No cases found</h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'all' 
                ? "You haven't posted any cases yet." 
                : `You don't have any ${activeTab} cases.`}
            </p>
            <Link
              to="/client/post-case"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg hover:bg-[#b86212] transition"
            >
              <Plus className="w-4 h-4" />
              Post Your First Case
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((caseItem) => {
              const statusBadge = getStatusBadge(caseItem.status);
              const StatusIcon = statusBadge.icon;
              
              return (
                <div key={caseItem.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left - Case Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          Posted on {new Date(caseItem.created_at).toLocaleDateString()}
                        </span>
                        {caseItem.urgency_level && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            caseItem.urgency_level === 'urgent' ? 'bg-red-100 text-red-700' :
                            caseItem.urgency_level === 'high' ? 'bg-orange-100 text-orange-700' :
                            caseItem.urgency_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {caseItem.urgency_level.toUpperCase()} Priority
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-semibold text-[#081c2b] mb-2">
                        {caseItem.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {caseItem.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-[#d47a1a]">
                            KES {caseItem.budget_min?.toLocaleString()} - {caseItem.budget_max?.toLocaleString()}
                          </span>
                        </div>
                        {caseItem.preferred_location && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{caseItem.preferred_location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>{caseItem.applications_count || 0} applications</span>
                        </div>
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Link
                        to={`/cases/${caseItem.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-[#d47a1a] text-[#d47a1a] rounded-lg font-semibold hover:bg-[#d47a1a] hover:text-white transition"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      
                      {caseItem.status === 'open' && (
                        <>
                          <button
                            onClick={() => handleEdit(caseItem)}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit Case
                          </button>
                          <button
                            onClick={() => openDeleteModal(caseItem)}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Case
                          </button>
                        </>
                      )}
                      
                      {caseItem.status === 'assigned' && caseItem.assigned_lawyer && (
                        <Link
                          to={`/messages?case=${caseItem.id}`}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message Lawyer
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#081c2b]">Delete Case</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete "<span className="font-semibold">{selectedCase.title}</span>"?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All applications for this case will also be removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? 'Deleting...' : 'Delete Case'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCases;