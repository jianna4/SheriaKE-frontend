// src/pages/BidForCase.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, DollarSign, Clock,
  MapPin, User, Send, AlertCircle, 
  CheckCircle, ArrowLeft, Award
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import api from '../Components/auth/Api';

const ApplyToCase = () => {
  const { id } = useParams();
  const hasValidCaseId = Boolean(id && id !== 'undefined');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [existingBid, setExistingBid] = useState(null);
  const [loading, setLoading] = useState(hasValidCaseId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(hasValidCaseId ? '' : 'Invalid case ID');
  const [success, setSuccess] = useState(false);
  
  const [application, setApplication] = useState({
    message: '',
    proposed_fee: '',
    estimated_duration: '',
  });

  const fetchCaseDetails = async () => {
    try {
      const [caseResponse, bidResponse] = await Promise.all([
        api.get(`/marketplace/cases/${id}/`),
        api.get(`/marketplace/applications/?case=${id}`),
      ]);
      
      let caseData = caseResponse.data?.results?.[0] || caseResponse.data;
      
      if (!caseData || !caseData.id) {
        throw new Error('Case not found');
      }
      
      setCaseData(caseData);

      const bids = bidResponse.data?.results || bidResponse.data || [];
      const myBid = bids.find((bid) => bid.case === parseInt(id, 10));
      if (myBid) {
        setExistingBid(myBid);
        setApplication({
          message: myBid.message || '',
          proposed_fee: myBid.proposed_fee ? parseFloat(myBid.proposed_fee).toString() : '',
          estimated_duration: myBid.estimated_duration || '',
        });
        return;
      }
      
      // Pre-fill proposed fee based on case budget range
      if (caseData.budget_min && caseData.budget_max) {
        const suggestedFee = Math.floor((caseData.budget_min + caseData.budget_max) / 2);
        setApplication(prev => ({
          ...prev,
          proposed_fee: suggestedFee.toString()
        }));
      }
    } catch (error) {
      console.error('Error loading bid form:', error);
      setError('Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasValidCaseId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCaseDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidCaseId, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingBid && existingBid.status !== 'pending') {
      setError('Only pending bids can be edited.');
      return;
    }
    
    // Validation
    if (!application.message.trim()) {
      setError('Please provide a message explaining why you\'re a good fit for this case');
      return;
    }
    
    if (!application.proposed_fee || parseFloat(application.proposed_fee) <= 0) {
      setError('Please enter a valid proposed fee');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        case: parseInt(id),
        message: application.message,
        proposed_fee: parseFloat(application.proposed_fee),
        estimated_duration: application.estimated_duration || null,
      };
      const response = existingBid?.status === 'pending'
        ? await api.patch(`/marketplace/applications/${existingBid.id}/`, {
            message: payload.message,
            proposed_fee: payload.proposed_fee,
            estimated_duration: payload.estimated_duration,
          })
        : await api.post('/marketplace/applications/', payload);
      
      console.log('Bid saved:', response.data);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/lawyer/applications');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.message || 
                       'Failed to submit bid. Please try again.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Case Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/cases" className="inline-block px-6 py-2 bg-[#d47a1a] text-white rounded-lg">
            Browse Cases
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#081c2b] mb-2">Bid Saved!</h2>
          <p className="text-gray-600 mb-4">
            Your proposal has been sent to the client. You'll be notified when they respond.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to your bids...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d47a1a] mx-auto"></div>
        </div>
      </div>
    );
  }

  const isBidEditable = !existingBid || existingBid.status === 'pending';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to={`/cases/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#d47a1a] mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Details
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#1e4a6e] to-[#153a56] p-6 text-white">
                <h1 className="text-2xl font-bold">
                  {existingBid ? 'View Bid' : 'Place Bid'}
                </h1>
                <p className="text-gray-300 mt-1">
                  {isBidEditable ? 'Submit your proposal to represent the client' : 'This bid can no longer be edited'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {/* Cover Letter / Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={application.message}
                    onChange={(e) => setApplication({...application, message: e.target.value})}
                    disabled={!isBidEditable}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                    placeholder={`Dear client,

I have reviewed your case and believe I can help. Here's why I'm a good fit:

- My experience in ${caseData?.practice_area_detail?.name || 'this area'} 
- I have successfully handled similar cases
- I offer competitive rates and flexible scheduling

I look forward to discussing how I can assist you.`}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Explain why you're the right lawyer for this case
                  </p>
                </div>

                {/* Proposed Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Fee (KES) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={application.proposed_fee}
                      onChange={(e) => setApplication({...application, proposed_fee: e.target.value})}
                      disabled={!isBidEditable}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                      placeholder="e.g., 15000"
                      required
                    />
                  </div>
                  {caseData && (
                    <p className="text-xs text-gray-500 mt-1">
                      Client's budget range: KES {caseData.budget_min?.toLocaleString()} - {caseData.budget_max?.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Estimated Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration (Optional)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={application.estimated_duration}
                      onChange={(e) => setApplication({...application, estimated_duration: e.target.value})}
                      disabled={!isBidEditable}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent"
                      placeholder="e.g., 2 weeks, 1 month, 5 business days"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !isBidEditable}
                  className="w-full bg-[#d47a1a] text-white py-3 rounded-lg font-semibold hover:bg-[#b86212] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Saving Bid...' : existingBid?.status === 'pending' ? 'Update Bid' : existingBid ? 'Bid Locked' : 'Submit Bid'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar - Case Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Case Summary
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Case Title</p>
                  <p className="font-semibold text-[#081c2b]">{caseData?.title}</p>
                </div>
                
                {caseData?.practice_area_detail?.name && (
                  <div>
                    <p className="text-xs text-gray-500">Practice Area</p>
                    <p className="text-sm">{caseData.practice_area_detail.name}</p>
                  </div>
                )}
                
                {caseData?.preferred_location && (
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {caseData.preferred_location}
                      {caseData.is_remote && <span className="ml-1 text-green-600">(Remote OK)</span>}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-gray-500">Budget Range</p>
                  <p className="text-sm font-semibold text-[#d47a1a]">
                    KES {caseData?.budget_min?.toLocaleString()} - {caseData?.budget_max?.toLocaleString()}
                  </p>
                </div>
                
                {caseData?.description && (
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {caseData.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Your Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-[#081c2b] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Profile
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                </div>
                
                {user?.email && (
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                )}
                
                {user?.phone_number && (
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm">{user.phone_number}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  The client will see this information when reviewing your bid
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#fef8ee] border border-[#e89432] rounded-xl p-4">
              <h4 className="font-semibold text-[#081c2b] mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d47a1a]" />
                Bid Tips
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Personalize your proposal to the specific case</li>
                <li>• Highlight relevant experience and successes</li>
                <li>• Propose a fair fee within the client's budget range</li>
                <li>• Be clear about your availability and timeline</li>
                <li>• Respond promptly - clients appreciate fast responses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyToCase;