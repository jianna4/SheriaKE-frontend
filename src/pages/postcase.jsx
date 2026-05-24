// src/pages/PostCase.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, DollarSign, MapPin, Clock, 
  Send, AlertCircle, CheckCircle, ArrowLeft,
  FileText, Users, Scale, Building, Calendar,
  HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const PostCase = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [caseData, setCaseData] = useState({
    practice_area: '',
    title: '',
    description: '',
    legal_category: '',
    urgency_level: 'medium',
    county: '',
    city: '',
    budget_type: 'fixed',
    budget_min: '',
    budget_max: '',
    preferred_lawyer_gender: 'any',
    preferred_experience_level: 'mid',
    preferred_location: '',
    is_remote: true,
    case_stage: 'Pre-litigation',
    court_case_exists: false,
    is_public: true,
    allow_direct_lawyer_invites: false,
  });

  // Kenyan counties list
  const counties = [
    'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru',
    'Tharaka Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua',
    'Nyeri', 'Kirinyaga', 'Muranga', 'Kiambu', 'Turkana', 'West Pokot',
    'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi',
    'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho',
    'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya',
    'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
  ];

  const legalCategories = [
    'Employment Law',
    'Family Law',
    'Criminal Law',
    'Civil Litigation',
    'Property Law',
    'Contract Law',
    'Constitutional Law',
    'Tax Law',
    'Intellectual Property',
    'Immigration Law',
    'Land & Environmental Law',
    'Banking & Finance Law',
    'Corporate Law',
    'Personal Injury',
    'Medical Malpractice',
    'Other'
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low - Can wait 2+ weeks', color: 'blue' },
    { value: 'medium', label: 'Medium - Within a week', color: 'yellow' },
    { value: 'high', label: 'High - Within 3 days', color: 'orange' },
    { value: 'urgent', label: 'Urgent - Within 24 hours', color: 'red' }
  ];

  const experienceLevels = [
    { value: 'junior', label: 'Junior (0-3 years)' },
    { value: 'mid', label: 'Mid Level (3-7 years)' },
    { value: 'senior', label: 'Senior (7+ years)' }
  ];

  const genderOptions = [
    { value: 'any', label: 'No Preference' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const caseStages = [
    'Pre-litigation',
    'Pleadings',
    'Discovery',
    'Pre-trial',
    'Trial',
    'Appeal',
    'Settlement'
  ];

  useEffect(() => {
    fetchPracticeAreas();
  }, []);

  const fetchPracticeAreas = async () => {
    try {
      const response = await api.get('/marketplace/practice-areas/');
      const areas = response.data?.results || response.data || [];
      setPracticeAreas(areas);
    } catch (error) {
      console.error('Error fetching practice areas:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCaseData({
      ...caseData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!caseData.practice_area) {
      setError('Please select a practice area');
      return;
    }
    if (!caseData.title.trim()) {
      setError('Please enter a case title');
      return;
    }
    if (!caseData.description.trim()) {
      setError('Please enter a case description');
      return;
    }
    if (!caseData.budget_min || !caseData.budget_max) {
      setError('Please enter budget range');
      return;
    }
    if (parseFloat(caseData.budget_min) >= parseFloat(caseData.budget_max)) {
      setError('Minimum budget must be less than maximum budget');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        practice_area: parseInt(caseData.practice_area),
        title: caseData.title,
        description: caseData.description,
        legal_category: caseData.legal_category || null,
        urgency_level: caseData.urgency_level,
        county: caseData.county || null,
        city: caseData.city || null,
        budget_type: caseData.budget_type,
        budget_min: parseFloat(caseData.budget_min),
        budget_max: parseFloat(caseData.budget_max),
        preferred_lawyer_gender: caseData.preferred_lawyer_gender,
        preferred_experience_level: caseData.preferred_experience_level,
        preferred_location: caseData.preferred_location || null,
        is_remote: caseData.is_remote,
        case_stage: caseData.case_stage,
        court_case_exists: caseData.court_case_exists,
        is_public: caseData.is_public,
        allow_direct_lawyer_invites: caseData.allow_direct_lawyer_invites,
      };

      console.log('Submitting case:', submitData);
      const response = await api.post('/marketplace/cases/', submitData);
      console.log('Case created:', response.data);
      
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/client/cases');
      }, 2000);
      
    } catch (error) {
      console.error('Error posting case:', error);
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.message || 
                       'Failed to post case. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#081c2b] mb-2">Case Posted Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your case has been published. Lawyers will now be able to view and apply.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to your cases...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d47a1a] mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#081c2b]">Post a New Case</h1>
          <p className="text-gray-600 mt-2">
            Provide details about your legal matter to get matched with the right lawyer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#081c2b] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d47a1a]" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Practice Area <span className="text-red-500">*</span>
                </label>
                <select
                  name="practice_area"
                  value={caseData.practice_area}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                  required
                >
                  <option value="">Select Practice Area</option>
                  {practiceAreas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={caseData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                  placeholder="e.g., Need help with unfair termination"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={caseData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                  placeholder="Describe your legal issue in detail. Include relevant dates, parties involved, and what you need help with..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about your situation to attract the right lawyers
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Category
                  </label>
                  <select
                    name="legal_category"
                    value={caseData.legal_category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {legalCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level
                  </label>
                  <div className="flex gap-2">
                    {urgencyOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setCaseData({...caseData, urgency_level: option.value})}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                          caseData.urgency_level === option.value
                            ? `bg-${option.color}-50 border-${option.color}-400 text-${option.color}-700`
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#081c2b] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#d47a1a]" />
              Location
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  County
                </label>
                <select
                  name="county"
                  value={caseData.county}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                >
                  <option value="">Select County</option>
                  {counties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City/Town
                </label>
                <input
                  type="text"
                  name="city"
                  value={caseData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                  placeholder="e.g., Nairobi CBD"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={caseData.is_remote}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#d47a1a] rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Remote consultation available</span>
              </label>
            </div>
          </div>

          {/* Budget Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#081c2b] mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#d47a1a]" />
              Budget
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Type
                </label>
                <select
                  name="budget_type"
                  value={caseData.budget_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                >
                  <option value="fixed">Fixed Fee</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="range">Range</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum (KES)
                </label>
                <input
                  type="number"
                  name="budget_min"
                  value={caseData.budget_min}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="5000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum (KES)
                </label>
                <input
                  type="number"
                  name="budget_max"
                  value={caseData.budget_max}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="20000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Lawyer Preferences - Advanced */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold text-[#081c2b] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#d47a1a]" />
                Lawyer Preferences (Optional)
              </h2>
              {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showAdvanced && (
              <div className="p-6 pt-0 border-t border-gray-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Gender
                    </label>
                    <select
                      name="preferred_lawyer_gender"
                      value={caseData.preferred_lawyer_gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {genderOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      name="preferred_experience_level"
                      value={caseData.preferred_experience_level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Location (Optional)
                  </label>
                  <input
                    type="text"
                    name="preferred_location"
                    value={caseData.preferred_location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Nairobi, Mombasa, or leave blank for any"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Stage
                  </label>
                  <select
                    name="case_stage"
                    value={caseData.case_stage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {caseStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="court_case_exists"
                      checked={caseData.court_case_exists}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#d47a1a] rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Court case already filed</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_public"
                      checked={caseData.is_public}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#d47a1a] rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Make case publicly visible</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allow_direct_lawyer_invites"
                      checked={caseData.allow_direct_lawyer_invites}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#d47a1a] rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Allow lawyers to invite themselves to this case</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d47a1a] text-white py-3 rounded-lg font-semibold hover:bg-[#b86212] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Posting Case...' : 'Post Case'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCase;