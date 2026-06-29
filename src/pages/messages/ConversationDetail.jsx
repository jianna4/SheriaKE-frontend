// src/pages/Messages/ConversationDetail.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, User, Paperclip, AlertCircle,
  Check, CheckCheck, File, X, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../Components/contexts/AuthContext';
import api from '../../Components/auth/Api';

const ConversationDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!id || id === 'undefined') {
      setError('Invalid conversation');
      setLoading(false);
      return;
    }
    
    fetchConversation();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchConversation = async () => {
    try {
      const response = await api.get(`/messaging/conversations/${id}/`);
      setConversation(response.data);
      await fetchMessages();
    } catch (error) {
      console.error('Error fetching conversation:', error);
      if (error.response?.status === 404) {
        setError('Conversation not found');
      } else {
        setError('Failed to load conversation');
      }
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messaging/messages/?conversation_id=${id}`);
      let msgs = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        msgs = response.data.results;
      } else if (Array.isArray(response.data)) {
        msgs = response.data;
      }
      
      setMessages(msgs);
      
      // Mark messages as read
      const unreadMsgs = msgs.filter(msg => 
        !msg.is_read && msg.sender?.id !== user?.id
      );
      
      if (unreadMsgs.length > 0) {
        await api.patch(`/messaging/conversations/${id}/mark-read/`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getOtherParticipant = () => {
    if (!conversation) return null;
    
    // Handle both possible data structures
    if (conversation.participants) {
      return conversation.participants.find(p => p.id !== user?.id) || conversation.participants[0];
    }
    
    const p1 = conversation.participant_one_detail;
    const p2 = conversation.participant_two_detail;
    return p1?.id === user?.id ? p2 : p1;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;
    
    setSending(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('conversation', id);
      formData.append('message', newMessage.trim() || '');
      formData.append('message_type', attachments.length > 0 ? 'file' : 'text');
      
      // Add attachments
      attachments.forEach((file) => {
        formData.append('attachment', file);
      });
      
      await api.post('/messaging/messages/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setNewMessage('');
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh messages
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.detail || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d47a1a]"></div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Conversation Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The conversation does not exist'}</p>
          <Link to="/messages" className="inline-block px-6 py-2 bg-[#d47a1a] text-white rounded-lg">
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const other = getOtherParticipant();
  const isLawyer = other?.role === 'lawyer';
  const otherRole = isLawyer ? 'Lawyer' : 'Client';
  const otherName = other?.full_name || other?.username || 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to="/messages" 
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isLawyer ? 'bg-[#fef8ee] text-[#d47a1a]' : 'bg-blue-50 text-blue-600'
                }`}>
                  <span className="font-bold">{getInitials(otherName)}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-[#081c2b]">{otherName}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={isLawyer ? 'text-[#d47a1a]' : 'text-blue-600'}>
                      {otherRole}
                    </span>
                    {conversation.conversation_type === 'case' && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{conversation.case_title || 'Case'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-280px)] flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Start the conversation</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages
                .filter(msg => !msg.is_deleted || msg.sender?.id === user?.id)
                .reduce((groups, msg) => {
                  const date = formatDate(msg.created_at);
                  if (!groups[date]) groups[date] = [];
                  groups[date].push(msg);
                  return groups;
                }, {})
                .map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                        {date}
                      </span>
                    </div>
                    {msgs.map((msg, index) => {
                      const isOwn = msg.sender?.id === user?.id;
                      const showAvatar = !isOwn && (index === 0 || msgs[index - 1]?.sender?.id !== msg.sender?.id);
                      
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-end gap-2 max-w-[70%] ${!isOwn && showAvatar ? 'mt-0' : 'mt-1'}`}>
                            {!isOwn && showAvatar && (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.sender?.role === 'lawyer' ? 'bg-[#fef8ee] text-[#d47a1a]' : 'bg-blue-50 text-blue-600'
                              }`}>
                                <span className="text-xs font-bold">
                                  {getInitials(msg.sender?.full_name || msg.sender?.username)}
                                </span>
                              </div>
                            )}
                            {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0"></div>}
                            
                            <div>
                              <div className={`rounded-2xl px-4 py-2.5 ${
                                isOwn ? 'bg-[#d47a1a] text-white' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {msg.is_deleted ? (
                                  <p className="text-sm italic text-gray-400">Message deleted</p>
                                ) : (
                                  <>
                                    {msg.message && (
                                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                    )}
                                    {msg.attachment && !msg.is_deleted && (
                                      <div className="mt-2">
                                        <a
                                          href={msg.attachment}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex items-center gap-2 text-sm ${
                                            isOwn ? 'text-white hover:text-gray-200' : 'text-[#d47a1a] hover:text-[#b86212]'
                                          }`}
                                        >
                                          <File className="w-4 h-4" />
                                          View Attachment
                                        </a>
                                      </div>
                                    )}
                                    {msg.edited_at && !msg.is_deleted && (
                                      <p className="text-xs opacity-60 mt-1">(edited)</p>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className={`text-xs text-gray-400 mt-1 flex items-center gap-1 ${
                                isOwn ? 'justify-end' : 'justify-start'
                              }`}>
                                {formatTime(msg.created_at)}
                                {isOwn && !msg.is_deleted && (
                                  <span className="ml-1">
                                    {msg.is_read ? (
                                      <CheckCheck className="w-3 h-3 text-blue-500" />
                                    ) : (
                                      <Check className="w-3 h-3 text-gray-400" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm p-3 mt-4">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1 text-sm">
                  <File className="w-3 h-3" />
                  <span className="text-gray-600 truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.txt"
            />
            
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e89432] focus:border-transparent outline-none resize-none min-h-[44px] max-h-[120px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            
            <button
              type="submit"
              disabled={sending || (!newMessage.trim() && attachments.length === 0)}
              className="p-2 bg-[#d47a1a] text-white rounded-lg hover:bg-[#b86212] transition disabled:opacity-50 flex-shrink-0"
            >
              {sending ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;