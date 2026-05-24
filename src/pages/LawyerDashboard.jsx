// src/pages/LawyerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, FileText, Users, Star, 
  DollarSign, Clock, CheckCircle, AlertCircle,
  TrendingUp, MessageCircle, Award
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState(null);
  const [openCases, setOpenCases] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeCases: 0,
    completedCases: 0,
    rating: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    fetchLawyerData();
  }, []);

  const fetchLawyerData = async () => {
    try {
      // Fetch lawyer profile
      const profileResponse = await api.get('/marketplace/my-lawyer-profile/');
      setLawyerProfile(profileResponse.data);
      
      // Fetch open cases for lawyers to apply
      const casesResponse = await api.get('/marketplace/cases/');
      setOpenCases(casesResponse.data.filter(c => c.status === 'open'));
      
      // Fetch lawyer's applications
      const applicationsResponse = await api.get('/marketplace/applications/');
      setApplications(applicationsResponse.data);
      
      // Calculate stats
      const applied = applicationsResponse.data.length;
      const active = applicationsResponse.data.filter(a => a.status === 'accepted').length;
      const completed = applicationsResponse.data.filter(a => a.status === 'completed').length;
      
      setStats({
        totalApplications: applied,
        activeCases: active,
        completedCases: completed,
        rating: profileResponse.data?.average_rating || 0,
        totalEarnings: profileResponse.data?.total_earnings || 0,
      });
    } catch (error) {
      console.error('Error fetching lawyer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Applications Sent', value: stats.totalApplications, icon: FileText, color: 'blue' },
    { title: 'Active Cases', value: stats.activeCases, icon: Briefcase, color: 'green' },
    { title: 'Completed Cases', value: stats.completedCases, icon: CheckCircle, color: 'purple' },
    { title: 'Total Earnings', value: `KES ${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'yellow' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-black">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
              <p className="text-gray-900">
                Find cases that match your expertise and grow your practice.
              </p>
            </div>
            {!lawyerProfile && (
              <Link
                to="/lawyer/profile"
                className="px-6 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-400 transition"
              >
                Complete Your Profile
              </Link>
            )}
          </div>
          
          {/* Profile Status Alert */}
          {!lawyerProfile && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <p className="text-sm">
                  Complete your lawyer profile to start applying for cases and receiving client requests.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              yellow: 'bg-yellow-100 text-yellow-600',
            };
            return (
              <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-navy-900">{stat.value}</span>
                </div>
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              </div>
            );
          })}
        </div>

        {/* Rating and Profile Section */}
        {lawyerProfile && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-navy-900">{stats.rating}</span>
                  <span className="text-gray-500">/5.0</span>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold-500" />
                  <span className="text-gray-600">{lawyerProfile.years_of_experience || 0} years experience</span>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">{lawyerProfile.total_clients || 0} clients served</span>
                </div>
              </div>
              <Link
                to="/lawyer/profile"
                className="text-gold-600 hover:text-gold-700 font-medium"
              >
                Edit Profile →
              </Link>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Open Cases to Apply */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-900">Open Cases</h2>
                <Link to="/cases" className="text-gold-600 hover:text-gold-700">
                  Browse All →
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-1">Cases waiting for lawyers</p>
            </div>
            <div className="divide-y divide-gray-200">
              {openCases.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No open cases at the moment. Check back later!</p>
                </div>
              ) : (
                openCases.slice(0, 3).map((caseItem) => (
                  <div key={caseItem.id} className="p-6 hover:bg-gray-50 transition">
                    <h3 className="font-semibold text-navy-900 mb-2">{caseItem.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{caseItem.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gold-600 font-medium">
                          Budget: KES {caseItem.budget_min} - {caseItem.budget_max}
                        </span>
                        <span className="text-gray-500">
                          {caseItem.preferred_location || 'Remote OK'}
                        </span>
                      </div>
                      <Link
                        to={`/lawyer/cases/${caseItem.id}`}
                        className="text-gold-600 hover:text-gold-700 font-medium"
                      >
                        Apply Now →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-900">My Applications</h2>
                <Link to="/lawyer/applications" className="text-gold-600 hover:text-gold-700">
                  View All →
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-1">Track your case applications</p>
            </div>
            <div className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>You haven't applied to any cases yet.</p>
                  <Link
                    to="/cases"
                    className="inline-block mt-3 text-gold-600 hover:text-gold-700"
                  >
                    Browse Cases →
                  </Link>
                </div>
              ) : (
                applications.slice(0, 3).map((application) => (
                  <div key={application.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-navy-900">{application.case_title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{application.message}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gold-600 font-medium">
                        Proposed Fee: KES {application.proposed_fee}
                      </span>
                      <span className="text-gray-500">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/lawyer/:id"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <Briefcase className="w-8 h-8 text-gold-500 mx-auto mb-2" />
            <h3 className="font-semibold text-navy-900">Update Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Keep your information current</p>
          </Link>
          <Link
            to="/cases"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <TrendingUp className="w-8 h-8 text-gold-500 mx-auto mb-2" />
            <h3 className="font-semibold text-navy-900">Find More Cases</h3>
            <p className="text-sm text-gray-500 mt-1">Browse available opportunities</p>
          </Link>
          <Link
            to="/chat"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <MessageCircle className="w-8 h-8 text-gold-500 mx-auto mb-2" />
            <h3 className="font-semibold text-navy-900">AI Legal Assistant</h3>
            <p className="text-sm text-gray-500 mt-1">Get help with legal research</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;