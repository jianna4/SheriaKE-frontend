// src/pages/FindLawyers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Star, Briefcase, 
  DollarSign, ChevronDown, Award, MessageCircle
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const FindLawyers = () => {
  const { user, isAuthenticated } = useAuth();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLawyers();
    fetchPracticeAreas();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await api.get('/marketplace/lawyers/');
      console.log('Lawyers API response:', response.data);
      
      // ✅ FIX: Extract the results array from paginated response
      let lawyersData = [];
      if (response.data && Array.isArray(response.data.results)) {
        lawyersData = response.data.results;
      } else if (Array.isArray(response.data)) {
        lawyersData = response.data;
      } else {
        lawyersData = [];
      }
      
      setLawyers(lawyersData);
      
      // Extract unique locations for filter
      const uniqueLocations = [...new Set(lawyersData.map(l => l.location).filter(Boolean))];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPracticeAreas = async () => {
    try {
      const response = await api.get('/marketplace/practice-areas/');
      // Practice areas might also be paginated
      let areasData = [];
      if (response.data && Array.isArray(response.data.results)) {
        areasData = response.data.results;
      } else if (Array.isArray(response.data)) {
        areasData = response.data;
      } else {
        areasData = [];
      }
      setPracticeAreas(areasData);
    } catch (error) {
      console.error('Error fetching practice areas:', error);
    }
  };

  // Filter and sort lawyers
  const filteredLawyers = lawyers
    .filter(lawyer => {
      const matchesSearch = lawyer.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lawyer.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lawyer.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lawyer.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPracticeArea = !selectedPracticeArea || 
        lawyer.practice_areas?.some(area => area.id === parseInt(selectedPracticeArea));
      
      const matchesLocation = !selectedLocation || lawyer.location === selectedLocation;
      
      const matchesPrice = !priceRange || (
        priceRange === '0-2000' ? (lawyer.consultation_fee || 0) <= 2000 :
        priceRange === '2000-5000' ? (lawyer.consultation_fee || 0) > 2000 && (lawyer.consultation_fee || 0) <= 5000 :
        priceRange === '5000-10000' ? (lawyer.consultation_fee || 0) > 5000 && (lawyer.consultation_fee || 0) <= 10000 :
        priceRange === '10000+' ? (lawyer.consultation_fee || 0) > 10000 : true
      );
      
      return matchesSearch && matchesPracticeArea && matchesLocation && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.average_rating || 0) - (a.average_rating || 0);
      if (sortBy === 'experience') return (b.years_of_experience || 0) - (a.years_of_experience || 0);
      if (sortBy === 'price_low') return (a.consultation_fee || 0) - (b.consultation_fee || 0);
      if (sortBy === 'price_high') return (b.consultation_fee || 0) - (a.consultation_fee || 0);
      return 0;
    });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
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
          <h1 className="text-3xl font-bold text-[#081c2b]">Find a Lawyer</h1>
          <p className="text-gray-600 mt-2">
            Browse through our directory of experienced lawyers and legal experts
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
                placeholder="Search by name, expertise, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
              />
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
            >
              <option value="rating">Sort by: Rating</option>
              <option value="experience">Sort by: Experience</option>
              <option value="price_low">Sort by: Price (Low to High)</option>
              <option value="price_high">Sort by: Price (High to Low)</option>
            </select>
            
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
              <div className="grid md:grid-cols-3 gap-4">
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
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee (KES)
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
                  >
                    <option value="">Any Price</option>
                    <option value="0-2000">0 - 2,000 KES</option>
                    <option value="2000-5000">2,000 - 5,000 KES</option>
                    <option value="5000-10000">5,000 - 10,000 KES</option>
                    <option value="10000+">10,000+ KES</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lawyers Grid */}
        {filteredLawyers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No lawyers found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Section - Profile */}
                  <div className="lg:w-1/3 p-6 bg-gradient-to-br from-[#1e4a6e] to-[#153a56] text-white">
                    <div className="text-center lg:text-left">
                      <div className="w-20 h-20 bg-[#d47a1a] rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                        <span className="text-2xl font-bold text-white">
                          {lawyer.user?.first_name?.[0]}{lawyer.user?.last_name?.[0]}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-1">
                        {lawyer.user?.first_name} {lawyer.user?.last_name}
                      </h2>
                      
                      <p className="text-[#f4ab5b] text-sm mb-3">
                        {lawyer.headline || 'Legal Professional'}
                      </p>
                      
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                        {renderStars(lawyer.average_rating)}
                        <span className="text-sm">
                          ({lawyer.total_reviews || 0} reviews)
                        </span>
                      </div>
                      
                      {lawyer.location && (
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-sm mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{lawyer.location}</span>
                        </div>
                      )}
                      
                      {lawyer.years_of_experience && (
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-sm">
                          <Award className="w-4 h-4" />
                          <span>{lawyer.years_of_experience} years experience</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Details */}
                  <div className="flex-1 p-6">
                    {lawyer.practice_areas && lawyer.practice_areas.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Practice Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {lawyer.practice_areas.map(area => (
                            <span key={area.id} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {area.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {lawyer.bio && (
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {lawyer.bio}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      {lawyer.consultation_fee && (
                        <div>
                          <p className="text-xs text-gray-500">Consultation Fee</p>
                          <p className="text-lg font-bold text-[#d47a1a]">
                            KES {lawyer.consultation_fee.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {lawyer.hourly_rate && (
                        <div>
                          <p className="text-xs text-gray-500">Hourly Rate</p>
                          <p className="text-lg font-bold text-[#d47a1a]">
                            KES {lawyer.hourly_rate.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/lawyers/${lawyer.id}`}
                        className="px-4 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
                      >
                        View Profile
                      </Link>
                      
                      {isAuthenticated && user?.role === 'client' && (
                        <Link
                          to={`/messages?lawyer=${lawyer.id}`}
                          className="px-4 py-2 border border-[#d47a1a] text-[#d47a1a] rounded-lg font-semibold hover:bg-[#d47a1a] hover:text-white transition"
                        >
                          <MessageCircle className="w-4 h-4 inline mr-1" />
                          Message to consult
                        </Link>
                      )}
                      
                      {!isAuthenticated && (
                        <Link
                          to="/login"
                          className="px-4 py-2 border border-[#d47a1a] text-[#d47a1a] rounded-lg font-semibold hover:bg-[#d47a1a] hover:text-white transition"
                        >
                          Login to Contact
                        </Link>
                      )}
                    </div>
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

export default FindLawyers;