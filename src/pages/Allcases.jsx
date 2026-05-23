// src/pages/AllCases.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, MapPin, Clock, 
  DollarSign, ChevronDown, Users, Star 
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const AllCases = () => {
  const { user, isAuthenticated } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [practiceAreas, setPracticeAreas] = useState([]);

  useEffect(() => {
    fetchCases();
    fetchPracticeAreas();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/marketplace/cases/');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPracticeAreas = async () => {
    try {
      const response = await api.get('/marketplace/practice-areas/');
      setPracticeAreas(response.data);
    } catch (error) {
      console.error('Error fetching practice areas:', error);
    }
  };

  // Filter cases based on search and filters
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPracticeArea = !selectedPracticeArea || caseItem.practice_area === selectedPracticeArea;
    const matchesPrice = !priceRange || (
      priceRange === '0-5000' ? caseItem.budget_max <= 5000 :
      priceRange === '5000-20000' ? caseItem.budget_min >= 5000 && caseItem.budget_max <= 20000 :
      priceRange === '20000+' ? caseItem.budget_min >= 20000 : true
    );
    return matchesSearch && matchesPracticeArea && matchesPrice;
  });

  const getStatusBadge = (status) => {
    const badges = {
      'open': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'assigned': 'bg-blue-100 text-blue-700',
      'completed': 'bg-gray-100 text-gray-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

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
          <h1 className="text-3xl font-bold text-[#081c2b]">Legal Cases</h1>
          <p className="text-gray-600 mt-2">
            Browse through available legal cases and find the right opportunity
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Practice Area
                  </label>
                  <select
                    value={selectedPracticeArea}
                    onChange={(e) => setSelectedPracticeArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
                  >
                    <option value="">All Practice Areas</option>
                    {practiceAreas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (KES)
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
                  >
                    <option value="">All Prices</option>
                    <option value="0-5000">0 - 5,000 KES</option>
                    <option value="5000-20000">5,000 - 20,000 KES</option>
                    <option value="20000+">20,000+ KES</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No cases found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCases.map((caseItem) => (
              <div key={caseItem.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Case Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(caseItem.status)}`}>
                        {caseItem.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted {new Date(caseItem.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-[#081c2b] mb-2">
                      {caseItem.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {caseItem.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Briefcase className="w-4 h-4" />
                        <span>{caseItem.practice_area_name || 'General'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{caseItem.preferred_location || 'Remote OK'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{caseItem.is_remote ? 'Remote' : 'In-person'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Budget and Action */}
                  <div className="lg:text-right">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Budget Range</p>
                      <p className="text-xl font-bold text-[#d47a1a]">
                        KES {caseItem.budget_min?.toLocaleString()} - {caseItem.budget_max?.toLocaleString()}
                      </p>
                    </div>
                    
                    {isAuthenticated && user?.role === 'lawyer' && caseItem.status === 'open' && (
                      <Link
                        to={`/lawyer/cases/${caseItem.id}/apply`}
                        className="block px-4 py-2 bg-[#d47a1a] text-white rounded-lg text-center font-semibold hover:bg-[#b86212] transition"
                      >
                        Apply Now
                      </Link>
                    )}
                    
                    {!isAuthenticated && (
                      <Link
                        to="/login"
                        className="block px-4 py-2 border border-[#d47a1a] text-[#d47a1a] rounded-lg text-center font-semibold hover:bg-[#d47a1a] hover:text-white transition"
                      >
                        Login to Apply
                      </Link>
                    )}
                    
                    {isAuthenticated && user?.role === 'client' && caseItem.client_id === user?.id && (
                      <Link
                        to={`/client/cases/${caseItem.id}`}
                        className="block px-4 py-2 border border-[#d47a1a] text-[#d47a1a] rounded-lg text-center font-semibold hover:bg-[#d47a1a] hover:text-white transition"
                      >
                        View My Case
                      </Link>
                    )}
                    
                    {isAuthenticated && user?.role === 'client' && caseItem.client_id !== user?.id && (
                      <Link
                        to={`/cases/${caseItem.id}`}
                        className="block px-4 py-2 text-gray-500 text-center"
                      >
                        View Details
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

export default AllCases;