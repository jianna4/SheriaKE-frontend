// src/pages/Messages/MessagesInbox.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Search, User, Clock, 
  ChevronRight, AlertCircle, Plus, Inbox
} from 'lucide-react';
import { useAuth } from '../../Components/contexts/AuthContext';
import api from '../../Components/auth/Api';

const MessagesInbox = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messaging/conversations/');
      console.log('Conversations response:', response.data);
      
      let convos = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        convos = response.data.results;
      } else if (Array.isArray(response.data)) {
        convos = response.data;
      } else {
        convos = [];
      }
      
      setConversations(convos);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    // Handle both possible data structures
    if (conversation.participants) {
      const other = conversation.participants.find(p => p.id !== user?.id);
      return other || conversation.participants[0] || { full_name: 'Unknown', role: 'user' };
    }
    
    const p1 = conversation.participant_one_detail;
    const p2 = conversation.participant_two_detail;
    const other = p1?.id === user?.id ? p2 : p1;
    return other || { full_name: 'Unknown', role: 'user' };
  };

  const getLastMessage = (conversation) => {
    if (conversation.last_message_detail) {
      return conversation.last_message_detail;
    }
    if (conversation.last_message) {
      return conversation.last_message;
    }
    return null;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const getUnreadCount = (conversation) => {
    if (!conversation.messages) return 0;
    return conversation.messages.filter(msg => 
      !msg.is_read && msg.sender?.id !== user?.id
    ).length;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    const name = other?.full_name || other?.username || '';
    const caseTitle = conv.case_title || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           caseTitle.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#081c2b]">Messages</h1>
            <p className="text-gray-600 mt-1">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {user?.role === 'client' && (
            <Link
              to="/lawyers"
              className="flex items-center gap-2 px-4 py-2 bg-[#d47a1a] text-white rounded-lg font-semibold hover:bg-[#b86212] transition"
            >
              <Plus className="w-4 h-4" />
              New Message
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations by name or case..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Conversation List */}
        {filteredConversations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No conversations found' : 'Your inbox is empty'}
            </h3>
            <p className="text-gray-500 mb-4">
              {user?.role === 'client' 
                ? 'Find a lawyer and start a conversation'
                : 'When clients message you, they\'ll appear here'}
            </p>
            {user?.role === 'client' && (
              <Link
                to="/lawyers"
                className="inline-block px-4 py-2 bg-[#d47a1a] text-white rounded-lg hover:bg-[#b86212] transition"
              >
                Find a Lawyer
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              const lastMsg = getLastMessage(conversation);
              const unreadCount = getUnreadCount(conversation);
              const isUnread = unreadCount > 0;
              const isLawyer = other?.role === 'lawyer';
              const otherName = other?.full_name || other?.username || 'Unknown';
              
              return (
                <Link
                  key={conversation.id}
                  to={`/messages/${conversation.id}`}
                  className={`block bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 ${
                    isUnread ? 'border-l-4 border-[#d47a1a]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isLawyer ? 'bg-[#fef8ee] text-[#d47a1a]' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <span className="text-lg font-bold">
                        {getInitials(otherName)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${isUnread ? 'text-[#081c2b]' : 'text-gray-700'}`}>
                            {otherName}
                          </h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isLawyer ? 'bg-[#fef8ee] text-[#d47a1a]' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {isLawyer ? 'Lawyer' : 'Client'}
                          </span>
                          {conversation.conversation_type === 'case' && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              Case
                            </span>
                          )}
                        </div>
                        {lastMsg?.created_at && (
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatTime(lastMsg.created_at)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${
                          isUnread ? 'text-gray-800 font-medium' : 'text-gray-500'
                        }`}>
                          {lastMsg?.sender?.id === user?.id ? 'You: ' : ''}
                          {lastMsg?.message || 'No messages yet'}
                          {lastMsg?.is_deleted && ' (deleted)'}
                        </p>
                        
                        {unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-[#d47a1a] text-white rounded-full flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      
                      {conversation.case_title && (
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          Case: {conversation.case_title}
                        </p>
                      )}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesInbox;