// src/pages/ClientCases.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Plus, Clock, CheckCircle, 
  AlertCircle, MessageCircle, Eye 
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/services/api';

const ClientCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      const response = await api.get('/marketplace/cases/');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
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
      case 'completed':
        return cases.filter(c => c.status === 'completed');
      default:
        return cases;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'open': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'assigned': 'bg-blue-100 text-blue-700',
      'completed': 'bg-gray-100 text-gray-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'assigned': return <MessageCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  const filteredCases = getFilteredCases();

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

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {[
              { id: 'all', label: 'All Cases', count: cases.length },
              { id: 'open', label: 'Open', count: cases.filter(c => c.status === 'open').length },
              { id: 'pending', label: 'Pending', count: cases.filter(c => c.status === 'pending').length },
              { id: 'assigned', label: 'Assigned', count: cases.filter(c => c.status === 'assigned').length },
              { id: 'completed', label: 'Completed', count: cases.filter(c => c.status === 'completed').length },
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
            {filteredCases.map((caseItem) => (
              <div key={caseItem.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(caseItem.status)}`}>
                        {getStatusIcon(caseItem.status)}
                        {caseItem.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted {new Date(caseItem.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-[#081c2b] mb-2">
                      {caseItem.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4">
                      {caseItem.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Budget:</span>
                        <span className="ml-1 font-semibold text-[#d47a1a]">
                          KES {caseItem.budget_min?.toLocaleString()} - {caseItem.budget_max?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-1">{caseItem.preferred_location || 'Remote OK'}</span>
                      </div>
                      {caseItem.assigned_lawyer && (
                        <div>
                          <span className="text-gray-500">Assigned Lawyer:</span>
                          <span className="ml-1 font-medium">{caseItem.assigned_lawyer_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Link
                      to={`/client/cases/${caseItem.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    
                    {caseItem.status === 'open' && (
                      <Link
                        to={`/client/cases/${caseItem.id}/edit`}
                        className="text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Edit Case
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCases;