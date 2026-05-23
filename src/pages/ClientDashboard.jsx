// src/pages/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FileText, MessageCircle, Star, 
  Plus, Search, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCases: 0,
    pendingApplications: 0,
    completedCases: 0,
    messagesUnread: 0,
  });

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      // Fetch client's cases
      const casesResponse = await api.get('/marketplace/cases/');
      console.log('API Response:', casesResponse.data);
      console.log('=== API RESPONSE DEBUG ===');
    console.log('Full response:', casesResponse);
    console.log('Response data type:', typeof casesResponse.data);
    console.log('Response data:', casesResponse.data);
    console.log('Is it an array?', Array.isArray(casesResponse.data));
    console.log('Does it have results?', casesResponse.data?.results);
    console.log('Type of results:', typeof casesResponse.data?.results);
    console.log('Is results an array?', Array.isArray(casesResponse.data?.results));
      let casesData = [];
      if (casesResponse.data && casesResponse.data.results) {
        // Paginated response
        casesData = casesResponse.data.results;
      } else if (Array.isArray(casesResponse.data)) {
        // Direct array response
        casesData = casesResponse.data;
      } else {
        // Fallback
        casesData = [];
      }
      
      console.log('Extracted cases:', casesData);
      setCases(Array.isArray(casesData) ? casesData : []);
      
      // Calculate stats safely
      const active = casesData.filter(c => c.status === 'open').length;
      const pending = casesData.filter(c => c.status === 'pending').length;
      const completed = casesData.filter(c => c.status === 'completed').length;
      
      setStats({
        activeCases: active,
        pendingApplications: pending,
        completedCases: completed,
        messagesUnread: 0,
      });
    } catch (error) {
      console.error('Error fetching client data:', error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Active Cases', value: stats.activeCases, icon: FileText, color: 'blue' },
    { title: 'Pending Applications', value: stats.pendingApplications, icon: Clock, color: 'yellow' },
    { title: 'Completed Cases', value: stats.completedCases, icon: CheckCircle, color: 'green' },
    { title: 'Unread Messages', value: stats.messagesUnread, icon: MessageCircle, color: 'purple' },
  ];

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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#1e4a6e] to-[#153a56] rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.first_name || user?.username || 'User'}!
          </h1>
          <p className="text-gray-300">
            Find the right lawyer for your legal needs and track your cases.
          </p>
          <Link
            to="/client/post-case"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
          >
            <Plus className="w-4 h-4" />
            Post a New Case
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
            };
            return (
              <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-[#081c2b]">{stat.value}</span>
                </div>
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              </div>
            );
          })}
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#081c2b]">Recent Cases</h2>
              <Link to="/client/cases" className="text-[#d47a1a] hover:text-[#b86212]">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {cases.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No cases yet. Post your first case to get started!</p>
                <Link
                  to="/client/post-case"
                  className="inline-block mt-3 text-[#d47a1a] hover:text-[#b86212]"
                >
                  Post a Case →
                </Link>
              </div>
            ) : (
              cases.slice(0, 5).map((caseItem) => (
                <div key={caseItem.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#081c2b]">{caseItem.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      caseItem.status === 'open' ? 'bg-green-100 text-green-700' :
                      caseItem.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      caseItem.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {caseItem.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {caseItem.description?.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Budget: KES {caseItem.budget_min} - {caseItem.budget_max}
                    </span>
                    <Link
                      to={`/client/cases/${caseItem.id}`}
                      className="text-[#d47a1a] hover:text-[#b86212]"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Find Lawyers CTA */}
        <div className="mt-8 bg-gradient-to-r from-[#d47a1a] to-[#e89432] rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Need Legal Help?
          </h3>
          <p className="text-white/90 mb-4">
            Browse our directory of experienced lawyers
          </p>
          <Link
            to="/lawyers"
            className="inline-flex items-center gap-2 px-6 py-2 bg-white text-[#d47a1a] rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            <Search className="w-4 h-4" />
            Find a Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;