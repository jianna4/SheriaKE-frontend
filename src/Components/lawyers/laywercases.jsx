// src/pages/LawyerCases.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Search, Filter, MapPin, 
  DollarSign, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../auth/Api';

const LawyerCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('');
  const [practiceAreas, setPracticeAreas] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [casesRes, appsRes, areasRes] = await Promise.all([
        api.get('/marketplace/cases/'),
        api.get('/marketplace/applications/'),
        api.get('/marketplace/practice-areas/')
      ]);
      setCases(casesRes.data);
      setApplications(appsRes.data);
      setPracticeAreas(areasRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasApplied = (caseId) => {
    return applications.some(app => app.case === caseId);
  };

  const getApplicationStatus = (caseId) => {
    const application = applications.find(app => app.case === caseId);
    return application?.status;
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPracticeArea = !selectedPracticeArea || caseItem.practice_area === selectedPracticeArea;
    const isOpen = caseItem.status === 'open';
    return matchesSearch && matchesPracticeArea && isOpen;
  });

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
          <h1 className="text-3xl font-bold text-[#081c2b]">Browse Cases</h1>
          <p className="text-gray-600 mt-2">
            Find and apply to cases that match your expertise
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases by title, description, or practice area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Cases</p>
                <p className="text-2xl font-bold text-[#081c2b]">{filteredCases.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-[#d47a1a]" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Applications Sent</p>
                <p className="text-2xl font-bold text-[#081c2b]">{applications.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Cases</p>
                <p className="text-2xl font-bold text-[#081c2b]">
                  {applications.filter(a => a.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No cases available</h3>
            <p className="text-gray-500">Check back later for new case opportunities</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCases.map((caseItem) => {
              const applied = hasApplied(caseItem.id);
              const appStatus = getApplicationStatus(caseItem.id);
              
              return (
                <div key={caseItem.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[#081c2b] mb-2">
                        {caseItem.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {caseItem.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{caseItem.preferred_location || 'Remote OK'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-[#d47a1a]">
                            KES {caseItem.budget_min?.toLocaleString()} - {caseItem.budget_max?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {caseItem.practice_area_name && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {caseItem.practice_area_name}
                          </span>
                        )}
                        {caseItem.is_remote && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                            Remote OK
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-[140px]">
                      {applied ? (
                        <div className="text-center">
                          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            appStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            appStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appStatus === 'pending' && 'Application Pending'}
                            {appStatus === 'accepted' && 'Application Accepted'}
                            {appStatus === 'rejected' && 'Not Selected'}
                          </div>
                          {appStatus === 'accepted' && (
                            <Link
                              to={`/lawyer/conversations/${caseItem.id}`}
                              className="mt-2 block text-center text-sm text-[#d47a1a] hover:text-[#b86212]"
                            >
                              Message Client →
                            </Link>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={`/lawyer/cases/${caseItem.id}/apply`}
                          className="block w-full px-4 py-2 bg-[#d47a1a] text-white rounded-lg text-center font-semibold hover:bg-[#b86212] transition"
                        >
                          Apply Now
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

export default LawyerCases;