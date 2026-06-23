// src/pages/chatAI.jsx
import { useState, useRef, useEffect } from 'react';
import { 
  Send, Menu, X, Trash2, Plus, User, Briefcase, 
  Scale, Search, Clock, AlertCircle, CheckCircle, 
  Crown, LogIn, Sparkles
} from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../Components/auth/Api';

const Chat = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('employee');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rateLimit, setRateLimit] = useState({ canChat: true, remaining: 5 });
  const [backendStatus, setBackendStatus] = useState('connected');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Device tracking for rate limiting (only for unauthenticated)
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  const checkRateLimit = () => {
    if (isAuthenticated) return { canChat: true, remaining: 999 };
    
    const deviceId = getDeviceId();
    const limitData = localStorage.getItem(`rate_${deviceId}`);
    const today = new Date().toDateString();
    
    if (!limitData) {
      return { canChat: true, remaining: 5 };
    }
    
    try {
      const { count, date } = JSON.parse(limitData);
      if (date !== today) {
        localStorage.removeItem(`rate_${deviceId}`);
        return { canChat: true, remaining: 5 };
      }
      return { canChat: count < 5, remaining: 5 - count };
    } catch {
      return { canChat: true, remaining: 5 };
    }
  };

  const incrementPromptCount = () => {
    if (isAuthenticated) return { remaining: 999 };
    
    const deviceId = getDeviceId();
    const limitData = localStorage.getItem(`rate_${deviceId}`);
    let count = 1;
    
    if (limitData) {
      try {
        const parsed = JSON.parse(limitData);
        count = parsed.count + 1;
      } catch {}
    }
    
    localStorage.setItem(`rate_${deviceId}`, JSON.stringify({
      count,
      date: new Date().toDateString(),
    }));
    
    return { remaining: 5 - count };
  };

  // Load sessions for authenticated users only
  useEffect(() => {
    const limit = checkRateLimit();
    setRateLimit(limit);
    
    if (isAuthenticated) {
      loadSessions();
    } else {
      setMessages([getWelcomeMessage(role)]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = (userRole) => ({
    id: 'welcome',
    type: 'bot',
    content: `Welcome to SheriaKE Legal Assistant

I am your AI legal assistant, here to help you understand Kenyan employment law.

Current Mode: ${userRole === 'employee' ? 'Employee Mode' : 'Employer Mode'}

${!isAuthenticated ? `
Free Trial: ${rateLimit.remaining} messages remaining today
Sign up for unlimited access and save your conversations` : `
Premium Access - Unlimited messages + chat history saved`}

---

What I can help you with:

${userRole === 'employee' 
  ? `- Leave entitlements (annual, maternity, paternity)
- Termination and dismissal rules
- Wage payment regulations
- Workplace discrimination
- How to file complaints`

  : `- Contract requirements for employees
- Record keeping obligations
- Proper termination procedures
- Legal deductions from wages
- Health and safety requirements`}

---

Try asking:
${userRole === 'employee' 
  ? `- How much annual leave am I entitled to?
- Can my employer terminate me without notice?
- What is the maternity leave policy?`

  : `- What records must I keep for employees?
- How do I properly terminate an employee?
- What deductions can I make from wages?`}

How can I help you today?`,
    timestamp: new Date().toISOString()
  });

  const getLimitReachedMessage = () => ({
    id: 'limit-reached',
    type: 'bot',
    content: `Free Trial Limit Reached

You have used all 5 free messages for today.

Upgrade to Premium for:
- Unlimited messages
- Save chat history
- Access from any device
- Priority support

Sign up now or Login to your account.

Your free trial resets daily at midnight.`,
    timestamp: new Date().toISOString()
  });

  // Session management - ONLY for authenticated users
  const loadSessions = () => {
    if (!isAuthenticated || !user?.id) return;
    const savedSessions = localStorage.getItem(`chat_sessions_${user.id}`);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          loadSession(parsed[0].id);
        } else {
          createNewSession();
        }
      } catch (e) {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  };

  const createNewSession = () => {
    if (!isAuthenticated || !user?.id) return;
    const newSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [getWelcomeMessage(role)],
      role: role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
    localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(updatedSessions));
  };

  const loadSession = (sessionId) => {
    if (!isAuthenticated) return;
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(session.id);
      setMessages(session.messages);
      setRole(session.role);
    }
  };

  const saveCurrentSession = () => {
    if (!isAuthenticated || !user?.id) return;
    const updatedSessions = sessions.map(session => 
      session.id === currentSessionId 
        ? { ...session, messages: messages, role: role, updatedAt: new Date().toISOString() }
        : session
    );
    setSessions(updatedSessions);
    localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(updatedSessions));
  };

  const updateSessionTitle = (sessionId, newTitle) => {
    if (!isAuthenticated || !user?.id) return;
    console.log('Updating session title:', sessionId, newTitle);
    const updatedSessions = sessions.map(session =>
      session.id === sessionId
        ? { ...session, title: newTitle, updatedAt: new Date().toISOString() }
        : session
    );
    setSessions(updatedSessions);
    localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(updatedSessions));
  };

  const deleteSession = (sessionId) => {
    if (!isAuthenticated || !user?.id) return;
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(updatedSessions));
    
    if (sessionId === currentSessionId && updatedSessions.length > 0) {
      loadSession(updatedSessions[0].id);
    } else if (updatedSessions.length === 0) {
      createNewSession();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Check rate limit for unauthenticated users
    if (!isAuthenticated) {
      const limit = checkRateLimit();
      if (!limit.canChat) {
        setMessages(prev => [...prev, getLimitReachedMessage()]);
        return;
      }
    }

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    // Count user messages BEFORE adding the new one
    const currentUserMessagesCount = messages.filter(m => m.type === 'user').length;
    const isFirstUserMessage = currentUserMessagesCount === 0;
    
    console.log('First user message?', isFirstUserMessage);
    console.log('Current session ID:', currentSessionId);
    console.log('Is authenticated:', isAuthenticated);
    
    setMessages(prev => [...prev, userMessage]);
    
    // For authenticated users on first message, update the title
    if (isAuthenticated && isFirstUserMessage) {
      // If no session exists yet, create one first
      let sessionId = currentSessionId;
      
      if (!sessionId) {
        // Create a new session
        const newSession = {
          id: Date.now().toString(),
          title: 'New Conversation',
          messages: [getWelcomeMessage(role), userMessage],
          role: role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const updatedSessions = [newSession, ...sessions];
        setSessions(updatedSessions);
        setCurrentSessionId(newSession.id);
        sessionId = newSession.id;
        localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(updatedSessions));
      }
      
      // Now update the title
      let newTitle = input.trim();
      if (newTitle.length > 40) {
        newTitle = newTitle.substring(0, 40) + '...';
      }
      console.log('Setting title to:', newTitle);
      updateSessionTitle(sessionId, newTitle);
    }
    
    setInput('');
    setLoading(true);

    // Increment prompt count for unauthenticated users
    if (!isAuthenticated) {
      const newLimit = incrementPromptCount();
      setRateLimit({ canChat: newLimit.remaining > 0, remaining: newLimit.remaining });
    }

    try {
      const response = await api.post('/legal/ask/', {
        query: input,
        role: role
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.data.answer,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Save session after adding bot message (only for authenticated)
      if (isAuthenticated && currentSessionId) {
        saveCurrentSession();
      }
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Error: ${error.response?.data?.detail || error.message || 'Something went wrong. Please try again.'}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (isAuthenticated && currentSessionId && user?.id) {
      const updatedSessions = sessions.map(session =>
        session.id === currentSessionId ? { ...session, role: newRole } : session
      );
      setSessions(updatedSessions);
      localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(updatedSessions));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const suggestedQuestions = role === 'employee' 
    ? [
        "How much annual leave am I entitled to?",
        "What are the rules for maternity leave?",
        "Can I be fired without notice?",
        "What is unfair termination?"
      ]
    : [
        "What records must I keep for employees?",
        "How do I properly terminate an employee?",
        "What are the requirements for a written contract?",
        "What deductions can I make from wages?"
      ];

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar - Only for authenticated users */}
      {isAuthenticated && (
        <>
          <div className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-xl
            transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#1e4a6e] to-[#153a56]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#f4ab5b] p-2 rounded-lg">
                      <Scale className="w-6 h-6 text-[#1e4a6e]" />
                    </div>
                    <span className="text-lg font-bold text-white">
                      Sheria<span className="text-[#f4ab5b]">KE</span>
                    </span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={createNewSession}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#f4ab5b] text-[#1e4a6e] rounded-lg font-semibold hover:bg-[#e89432] transition"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e89432]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-2">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group p-3 rounded-lg cursor-pointer transition ${
                      currentSessionId === session.id
                        ? 'bg-[#fef8ee] border-l-4 border-[#d47a1a]'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => loadSession(session.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {session.role === 'employee' ? (
                            <User className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-[#d47a1a]" />
                          )}
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            {formatDate(session.updatedAt)}
                          </p>
                          <span className="text-xs text-gray-400">
                            • {session.messages.length} messages
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#f4ab5b] rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-[#1e4a6e]">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Crown className="w-5 h-5 text-[#d47a1a]" />
                </div>
              </div>
            </div>
          </div>
          {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        </>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex-col flex">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              {!isAuthenticated && (
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-[#1e4a6e] to-[#153a56] p-2 rounded-lg">
                    <Scale className="w-6 h-6 text-[#f4ab5b]" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    Sheria<span className="text-[#d47a1a]">KE</span>
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => handleRoleChange('employee')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                    role === 'employee'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Employee</span>
                </button>
                <button
                  onClick={() => handleRoleChange('employer')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                    role === 'employer'
                      ? 'bg-[#d47a1a] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Employer</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isAuthenticated && (
                <div className={`px-3 py-1.5 rounded-lg ${
                  rateLimit.remaining > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <span className={`text-xs font-medium ${
                    rateLimit.remaining > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {rateLimit.remaining > 0 ? `${rateLimit.remaining} free left` : 'Limit reached'}
                  </span>
                </div>
              )}
              
              {isAuthenticated && (
                <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-xs font-medium text-green-700 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                {backendStatus === 'connected' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#1e4a6e] to-[#153a56] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={message.id || idx}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-[#1e4a6e] to-[#153a56] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {message.content}
                </div>
                <p className="text-xs mt-2 opacity-60">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#d47a1a] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-[#d47a1a] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-[#d47a1a] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 2 && rateLimit.remaining > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-white/50">
            <p className="text-xs text-gray-500 text-center mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#d47a1a]" />
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:border-[#d47a1a] hover:bg-[#fef8ee] hover:text-[#d47a1a] transition shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 p-4 bg-white/95 backdrop-blur-sm">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={rateLimit.canChat || isAuthenticated ? "Type your legal question here..." : "Free trial limit reached. Sign up to continue."}
              rows={1}
              disabled={(!rateLimit.canChat && !isAuthenticated)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e89432] focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || (!rateLimit.canChat && !isAuthenticated)}
              className="px-5 py-3 bg-gradient-to-r from-[#d47a1a] to-[#e89432] text-white rounded-xl font-semibold hover:from-[#b86212] hover:to-[#d47a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {!isAuthenticated && rateLimit.remaining > 0 && (
            <p className="text-xs text-center text-gray-500 mt-3">
              Free trial: {rateLimit.remaining} message{rateLimit.remaining !== 1 ? 's' : ''} remaining today.
              <button onClick={() => navigate('/signup')} className="text-[#d47a1a] hover:underline ml-1 font-medium">
                Sign up for unlimited
              </button>
            </p>
          )}
          {!isAuthenticated && rateLimit.remaining === 0 && (
            <p className="text-xs text-center text-red-500 mt-3">
              You have reached your daily limit.
              <button onClick={() => navigate('/signup')} className="text-[#d47a1a] hover:underline ml-1 font-medium">
                Sign up now to continue chatting
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;